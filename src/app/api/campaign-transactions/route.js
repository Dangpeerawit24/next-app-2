import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { EventEmitter } from "events";
import fs from "fs";
import path from "path";


const prisma = new PrismaClient();
const userEvent = new EventEmitter();

// ✅ อ่านข้อมูลสมาชิกทั้งหมด
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get("id"), 10);
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const sendData = async () => {
        const campaigns = await prisma.$queryRaw`
              SELECT * FROM campaign_transactions WHERE campaignsid = ${id} AND status = "รอดำเนินการ"
            `;

        controller.enqueue(encoder.encode(`data: ${JSON.stringify(campaigns)}\n\n`));
      };

      await sendData();
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
    const formData = await req.formData();

    const UPLOAD_DIR = path.join(process.cwd(), "public/img/campaigns");

    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    const name = formData.get("name");
    const description = formData.get("description");
    const price = parseInt(formData.get("price"), 10);
    const stock = parseInt(formData.get("stock"), 10);
    const status = formData.get("status");
    const topicId = parseInt(formData.get("topicId"), 10);
    const Broadcast = formData.get("Broadcast");
    const details = formData.get("details");
    const respond = formData.get("respond");
    const file = formData.get("campaign_img");

    const fileExt = path.extname(file.name);
    const newFileName = `${Date.now()}${fileExt}`;
    const newFilePath = path.join(UPLOAD_DIR, newFileName);
    const URL = process.env.NEXT_PUBLIC_BASE_URL;

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    await fs.promises.writeFile(newFilePath, fileBuffer);
    const campaign_img = `/img/campaigns/${newFileName}`;

    const campaign = await prisma.campaign.create({
      data: {
        name,
        description,
        price,
        topicId,
        stock,
        details,
        status,
        respond,
        campaign_img,
      },
    });

    userEvent.emit("update");

    return NextResponse.json(campaign);
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

export async function DELETE(req) {
  const { id } = await req.json();

  await prisma.campaign_transactions.delete({ where: { id } });

  userEvent.emit("update");

  return NextResponse.json({ message: "deleted successfully" });
}

