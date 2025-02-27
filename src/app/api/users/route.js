import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
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
        const users = await prisma.user.findMany({
          orderBy: { createdAt: "asc" }
        });
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(users)}\n\n`));
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
    const { email, name, password, role } = await req.json();

    // เช็คว่ามี email นี้อยู่ในระบบแล้วหรือไม่
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "อีเมลนี้ถูกใช้ไปแล้ว" },
        { status: 400 }
      );
    }

    // เข้ารหัสรหัสผ่านก่อนบันทึก
    const hashedPassword = await bcrypt.hash(password, 12);

    // สร้าง user ใหม่
    const user = await prisma.user.create({
      data: {
        id: uuidv4(),
        email,
        name,
        password: hashedPassword,
        role,
      },
    });

    userEvent.emit("update");

    return NextResponse.json(user);
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
  const { id, name, email, role } = await req.json();

  try {
    const user = await prisma.user.update({
      where: { id },
      data: { name, email, role },
    });

    userEvent.emit("update");

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "ไม่สามารถอัปเดตข้อมูลได้" }, { status: 500 });
  }
}

// ✅ ลบสมาชิก
export async function DELETE(req) {
  const { id } = await req.json();

  await prisma.user.delete({ where: { id } });

  userEvent.emit("update");

  return NextResponse.json({ message: "User deleted successfully" });
}
