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
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const sendData = async () => {
        const topics = await prisma.topic.findMany({
          orderBy: { createdAt: "asc" }
        });

        controller.enqueue(encoder.encode(`data: ${JSON.stringify(topics)}\n\n`));
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

    const topic = await prisma.topic.findUnique({ where: { id } });

    if (!topic) {
      return NextResponse.json({ message: "Topic not found" }, { status: 404 });
    }

    if (topic.status == "อยู่ในช่วงงาน") {
      await prisma.topic.delete({ where: { id } });
    } else {
      return NextResponse.json({ message: "Cannot delete this topic" }, { status: 400 });
    }

    userEvent.emit("update");

    return NextResponse.json({ message: "Topic deleted successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting topic", error: error.message }, { status: 500 });
  }
}


