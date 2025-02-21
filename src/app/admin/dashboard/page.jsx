"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Navbar from "../../components/Navbar";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-xl font-semibold">กำลังโหลด...</div>
      </div>
    );
  }

  if (!session || session.user.role !== "admin") {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      {/* Content */}
      <main className="p-6 mt-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            ยินดีต้อนรับ, {session?.user?.email}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            บทบาท: {session?.user?.role}
          </p>
        </div>

        {/* การ์ดข้อมูล */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              จำนวนผู้ใช้
            </h3>
            <p className="text-2xl font-bold text-blue-600">1,234</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              ยอดขายวันนี้
            </h3>
            <p className="text-2xl font-bold text-green-600">฿25,000</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              คำสั่งซื้อที่รอดำเนินการ
            </h3>
            <p className="text-2xl font-bold text-orange-600">15</p>
          </div>
        </div>
      </main>
    </div>
  );
}
