import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = req.nextUrl;

  // ถ้าไม่มี Token ให้ Redirect ไปที่หน้า Login
  if (!token) {
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // ตรวจสอบ Role ของผู้ใช้
  if (pathname.startsWith("/admin") && token?.user?.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

// ระบุเส้นทางที่ Middleware จะทำงาน
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
