"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Navbar from "../../components/Navbar";

export default function UserManagement() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ ตรวจสอบสิทธิ์ (อนุญาตเฉพาะ Admin)
  useEffect(() => {
    if (status === "loading") return;

    if (!session || session.user.role !== "admin") {
      Swal.fire({
        title: "ปฏิเสธการเข้าถึง",
        text: "คุณไม่มีสิทธิ์เข้าถึงหน้านี้",
        icon: "error",
      }).then(() => router.push("/dashboard"));
    } else {
      fetchUsers();
    }
  }, [session, status, router]);

  // ✅ ดึงข้อมูลสมาชิก
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      Swal.fire("เกิดข้อผิดพลาด!", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ เพิ่มสมาชิกใหม่
  const handleAddUser = async () => {
    const { value: formValues } = await Swal.fire({
      title: "เพิ่มสมาชิกใหม่",
      html: `
        <div class="w-full items-center text-center">
          <div class="flex items-center">
            <p class="w-[20%] text-lg text-start">ชื่อ :</p>
            <input id="swal-name" class="mb-2 h-14 w-full rounded border-2 border-solid" placeholder="ชื่อ" required>
          </div>
          <div class="flex items-center">
            <p class="w-[20%] text-lg text-start">อีเมล :</p>
          <input id="swal-email" class="mb-2 h-14 w-full rounded border-2 border-solid" placeholder="อีเมล" required>
          </div>
          <div class="flex items-center">
            <p class="w-[20%] text-lg text-start">รหัสผ่าน :</p>
          <input id="swal-password" class="mb-2 h-14 w-full rounded border-2 border-solid" type="password" placeholder="รหัสผ่าน" required>
          </div>
        </div>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const name = document.getElementById("swal-name").value.trim();
        const email = document.getElementById("swal-email").value.trim();
        const password = document.getElementById("swal-password").value.trim();

        if (!name || !email || !password) {
          Swal.showValidationMessage("กรุณากรอกข้อมูลให้ครบทุกช่อง!");
          return false;
        }

        return { name, email, password, role: "user" };
      },
    });

    if (!formValues) return;

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });

      if (!res.ok) throw new Error("เพิ่มสมาชิกไม่สำเร็จ");
      fetchUsers();
      Swal.fire("สำเร็จ!", "เพิ่มสมาชิกใหม่แล้ว", "success");
    } catch (error) {
      Swal.fire("เกิดข้อผิดพลาด!", error.message, "error");
    }
  };

  // ✅ ลบสมาชิก
  const handleDeleteUser = async (id) => {
    const result = await Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "ต้องการลบสมาชิกนี้?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch("/api/users", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        if (!res.ok) throw new Error("ลบสมาชิกไม่สำเร็จ");
        fetchUsers();
        Swal.fire("ลบสำเร็จ!", "สมาชิกถูกลบแล้ว", "success");
      } catch (error) {
        Swal.fire("เกิดข้อผิดพลาด!", error.message, "error");
      }
    }
  };

  // ✅ แก้ไขสมาชิก
  const handleEditUser = async (user) => {
    const { value: formValues } = await Swal.fire({
      title: "แก้ไขข้อมูลสมาชิก",
      html: `
        <input id="swal-name" class="swal2-input" placeholder="ชื่อ" value="${
          user.name
        }">
        <input id="swal-email" class="swal2-input" placeholder="อีเมล" value="${
          user.email
        }">
        <select id="swal-role" class="swal2-input">
          <option value="admin" ${
            user.role === "admin" ? "selected" : ""
          }>Admin</option>
          <option value="moderator" ${
            user.role === "moderator" ? "selected" : ""
          }>Moderator</option>
          <option value="user" ${
            user.role === "user" ? "selected" : ""
          }>User</option>
        </select>
      `,
      focusConfirm: false,
      preConfirm: () => {
        return {
          id: user.id,
          name: document.getElementById("swal-name").value,
          email: document.getElementById("swal-email").value,
          role: document.getElementById("swal-role").value,
        };
      },
    });

    if (!formValues) return;

    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });

      if (!res.ok) throw new Error("แก้ไขข้อมูลไม่สำเร็จ");
      fetchUsers();
      Swal.fire("บันทึกสำเร็จ!", "ข้อมูลสมาชิกถูกอัปเดตแล้ว", "success");
    } catch (error) {
      Swal.fire("เกิดข้อผิดพลาด!", error.message, "error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-xl font-semibold">กำลังโหลด...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-16 bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <main className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">
          จัดการข้อมูลสมาชิก
        </h1>

        <div className="flex justify-end mb-4">
          <button
            onClick={handleAddUser}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            + เพิ่มสมาชิก
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="p-4 w-[20%] text-left">ชื่อ</th>
                <th className="p-4 text-left">อีเมล</th>
                <th className="p-4 w-[15%] text-left">สิทธิ์</th>
                <th className="p-4 w-[15%] text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="p-4">{user.name}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">{user.role}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 mr-2"
                    >
                      แก้ไข
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
