"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Navbar from "../../components/Navbar";
import ScrollToTop from "../../components/ScrollToTop";
import useSSE from "../../hooks/useSSE";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [Data, setData] = useState(true);
  const router = useRouter();

  useEffect(() => {
      if (status === "loading") return;
  
      if (!session || session.user.role !== "admin") {
        Swal.fire({
          title: "ปฏิเสธการเข้าถึง",
          text: "คุณไม่มีสิทธิ์เข้าถึงหน้านี้",
          icon: "error",
        }).then(() => router.push("/login"));
      } else {
        setLoading(false);
      }
    }, [session, status, router]);

    useSSE("/api/campaigns/waitingopen", (data) => {
        setData(data);
      });

    if (loading) {
      return (
        <div
          id="loader"
          className="fixed inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-dashed rounded-full animate-spin"></div>
            <p className="mt-4 text-blue-400 text-lg font-semibold">Loading...</p>
          </div>
        </div>
      );
    }

  return (
    <div className="min-h-screen pt-16 bg-gray-100 dark:bg-gray-900">
      <Navbar />
      {/* Content */}
      <main className="p-6 ">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">
            จัดการข้อมูลหัวข้อกองบุญ
          </h1>
        </div>        
      </main>
      <ScrollToTop />
    </div>
  );
}
