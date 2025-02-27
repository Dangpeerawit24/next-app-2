import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { EventEmitter } from "events";

const prisma = new PrismaClient();
if (!global.userEvent) {
  global.userEvent = new EventEmitter();
  global.userEvent.setMaxListeners(20); // ✅ ป้องกัน MaxListenersExceededWarning
}
const userEvent = global.userEvent;

// ✅ อ่านข้อมูลสมาชิกทั้งหมด
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type"); // 📌 อ่านค่าจาก `?type=...`

  // ✅ ใช้ SSE (Server-Sent Events) เฉพาะเมื่อ `type=stream`
  if (type === "stream") {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const sendData = async () => {
          const topics = await prisma.$queryRaw`
            SELECT 
    c.*, 
    COUNT(camp.id) AS total_campaigns, 
    COALESCE(SUM(COALESCE(trans.total_value, 0) * COALESCE(camp.price, 0)), 0) AS total_value_price
FROM topic AS c
LEFT JOIN campaign AS camp ON c.id = camp.topicId
LEFT JOIN (
    SELECT 
        campaignsid, 
        SUM(value) AS total_value
    FROM campaign_transactions
    GROUP BY campaignsid
) AS trans ON camp.id = trans.campaignsid
GROUP BY c.id, c.name;

          `

          const sanitizedTopics = topics.map(topic => ({
            ...topic,
            id: topic.id.toString(),  // ถ้า id เป็น BigInt
            total_campaigns: Number(topic.total_campaigns), // แปลงเป็น Number ป้องกันปัญหา
            total_value_price: topic.total_value_price ? topic.total_value_price.toString() : "0", // ป้องกัน null
          }));

          controller.enqueue(encoder.encode(`data: ${JSON.stringify(sanitizedTopics)}\n\n`));
        };

        await sendData();

        userEvent.removeAllListeners("update");
        userEvent.on("update", () => {
          console.log("Update event triggered");
        });

        userEvent.on("update", sendData);

        return () => {
          isConnectionOpen = false;
          clearInterval(heartbeat);

          // ✅ ป้องกันการเรียก enqueue() หลังจากปิดไปแล้ว
          try {
            controller.close();
          } catch (error) {
            console.warn("⚠️ Controller ปิดอยู่แล้ว", error);
          }

          console.log("❌ SSE Connection Closed");
        };

      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  }

  try {
    let topics;

    // ✅ ดึงข้อมูลแบบแยกตาม `type`
    if (type === "option") {
      topics = await prisma.topic.findMany({
        where: { status: "อยู่ในช่วงงาน" }, // 📌 ดึงเฉพาะหัวข้อที่ถูกเก็บถาวร
      });
    }

    return NextResponse.json(topics);
  } catch (error) {
    console.error("❌ Error fetching topics:", error);
    return NextResponse.json({ error: "โหลดข้อมูลไม่สำเร็จ" }, { status: 500 });
  }
}

// ✅ เพิ่มสมาชิกใหม่
export async function POST(req) {
  try {
    const { name, status } = await req.json();

    // สร้าง user ใหม่
    const topic = await prisma.topic.create({
      data: {
        name,
        status,
      },
    });

    userEvent.emit("update");

    return NextResponse.json(topic);
  } catch (error) {
    console.error("เกิดข้อผิดพลาด:", error);
    return NextResponse.json(
      { error: "ไม่สามารถเพิ่มสมาชิกได้" },
      { status: 500 }
    );
  }
}

// ✅ แก้ไขข้อมูลสมาชิก
export async function PUT(req) {
  const { id, name, status } = await req.json();

  try {
    const topic = await prisma.topic.update({
      where: { id },
      data: { name, status },
    });

    userEvent.emit("update");

    return NextResponse.json(topic);
  } catch (error) {
    return NextResponse.json({ error: "ไม่สามารถอัปเดตข้อมูลได้" }, { status: 500 });
  }
}

// ✅ ลบสมาชิก
export async function DELETE(req) {
  try {
    const { id } = await req.json();
    const numericId = Number(id); // ✅ แปลง id เป็นตัวเลข

    if (isNaN(numericId) || numericId <= 0) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const topic = await prisma.topic.findUnique({ where: { id: numericId } });

    if (!topic) {
      return NextResponse.json({ message: "Topic not found" }, { status: 404 });
    }

    if (topic.status === "อยู่ในช่วงงาน") {
      await prisma.topic.delete({ where: { id: numericId } });
    } else {
      return NextResponse.json({ message: "Cannot delete this topic" }, { status: 400 });
    }

    userEvent.emit("update");

    return NextResponse.json({ message: "Topic deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting topic", error: error.message },
      { status: 500 }
    );
  }
}



