import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { EventEmitter } from "events";
import fs from "fs";
import path from "path";
import QRCode from "qrcode";
import crypto from "crypto";

const prisma = new PrismaClient();
if (!global.userEvent) {
  global.userEvent = new EventEmitter();
  global.userEvent.setMaxListeners(20); // ✅ ป้องกัน MaxListenersExceededWarning
}
const userEvent = global.userEvent;

// ✅ อ่านข้อมูลสมาชิกทั้งหมด
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get("id"), 10);
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const sendData = async () => {
        const campaigns = await prisma.$queryRaw`
              SELECT * FROM campaign_transactions WHERE campaignsid = ${id}
            `;

        controller.enqueue(encoder.encode(`data: ${JSON.stringify(campaigns)}\n\n`));
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

export async function POST(req) {
  try {
    const formData = await req.formData();

    const UPLOAD_DIR = path.join(process.cwd(), "public/img/slip");

    // ตรวจสอบว่าไดเรกทอรีมีอยู่หรือไม่ ถ้าไม่มีให้สร้างใหม่
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    // ดึงข้อมูลจากฟอร์ม
    const details = formData.get("details");
    const detailswish = formData.get("detailswish");
    const value = formData.get("value");
    const lineName = formData.get("lineName");
    const form = formData.get("form");
    const respond = formData.get("respond");
    const campaignsid = formData.get("campaignsid");
    const campaignsname = formData.get("campaignsname");
    const transactionID = crypto.randomBytes(16).toString("hex");

    let status;
    if (respond === "แอดมินจะส่งภาพกองบุญให้ท่านได้อนุโมทนาอีกครั้ง") {
      status = "รอดำเนินการ";
    } else {
      status = "ส่งภาพกองบุญแล้ว";
    }

    // ค้นหาข้อมูล lineUser จากฐานข้อมูล โดยใช้ display_name เท่ากับ lineName
    let lineNameinsert = lineName;
    let lineLineIdinsert = null;
    let lineUserData = [];
    if (lineName) {
      lineUserData = await prisma.line_users.findMany({
        where: { display_name: lineName },
        orderBy: { id: "desc" },
        take: 1,
      });
    }

    // ถ้ามีข้อมูลจากฐานข้อมูล ให้นำข้อมูลจาก element แรกใน array มาใช้
    if (lineUserData && lineUserData.length > 0) {
      lineNameinsert = lineUserData[0].display_name;
      lineLineIdinsert = lineUserData[0].user_id;
    }

    // สร้าง QR Code หากมีข้อมูล lineUser
    let qrUrl = null;
    if (lineLineIdinsert) {
      const qrData = `${process.env.NEXT_PUBLIC_BASE_URL}/line/pushimages/${transactionID}`;
      const qrFolder = path.join(process.cwd(), "public/img/qrcodes");
      if (!fs.existsSync(qrFolder)) {
        fs.mkdirSync(qrFolder, { recursive: true });
      }

      // สร้างชื่อไฟล์ QR Code
      const qrFileName = `qrcode_${Date.now()}_${Math.floor(Math.random() * 10000)}.png`;
      const qrFilePath = path.join(qrFolder, qrFileName);

      // สร้าง QR Code และบันทึกเป็นไฟล์
      await QRCode.toFile(qrFilePath, qrData, {
        width: 300,
      });
      qrUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/img/qrcodes/${qrFileName}`;
    }

    // สร้างข้อมูลใหม่ในฐานข้อมูล
    const newTransaction = await prisma.campaign_transactions.create({
      data: {
        details: details,
        detailswish: detailswish,
        lineId: lineLineIdinsert,
        lineName: lineNameinsert,
        transactionID: transactionID,
        campaignsname: campaignsname,
        campaignsid: Number(campaignsid),
        form: form,
        value: value,
        status: status,
        qr_url: qrUrl,
      },
    });

    userEvent.emit("update");

    return new Response(JSON.stringify({ success: true, data: newTransaction }), {
      status: 201,
    });
  } catch (error) {
    console.error("Error submitting form:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Internal Server Error" }),
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

