import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// ✅ อ่านข้อมูลสมาชิกทั้งหมด
export async function GET() {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}

// ✅ เพิ่มสมาชิกใหม่
export async function POST(req) {
  const { email, name, password, role } = await req.json();

  // เข้ารหัสรหัสผ่านก่อนบันทึก
  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { email, name, password: hashedPassword, role },
  });

  return NextResponse.json(user);
}

// ✅ แก้ไขข้อมูลสมาชิก
export async function PUT(req) {
    const { id, name, email, role } = await req.json();
  
    try {
      const user = await prisma.user.update({
        where: { id },
        data: { name, email, role },
      });
  
      return NextResponse.json(user);
    } catch (error) {
      return NextResponse.json({ error: "ไม่สามารถอัปเดตข้อมูลได้" }, { status: 500 });
    }
  }

// ✅ ลบสมาชิก
export async function DELETE(req) {
  const { id } = await req.json();

  await prisma.user.delete({ where: { id } });

  return NextResponse.json({ message: "User deleted successfully" });
}
