"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      const role = session?.user?.role;
      if (role === "admin") {
        router.push("/admin/dashboard");
      } else if (role === "moderator") {
        router.push("/moderator/dashboard");
      } else {
        router.push("/user/dashboard");
      }
    }
  }, [status, session, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // ล้าง Error ก่อนล็อกอิน

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // ❌ ปิด redirect อัตโนมัติ
    });

    if (result?.error) {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    }
  };

  // ถ้า session กำลังโหลด ให้แสดง Loading
  // if (status === "loading") {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <div className="text-center text-xl font-semibold">กำลังโหลด...</div>
  //     </div>
  //   );
  // }  

  if (status === "loading") {
    return null;
  }
  

  return (
    <div className="flex min-h-screen p-4 items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">เข้าสู่ระบบกองบุญออนไลน์</h1>
        
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Email</label>
            <input 
              type="email" 
              placeholder="you@example.com"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300">Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button 
            type="submit" 
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            เข้าสู่ระบบ
          </button>
        </form>

        <div className="flex items-center justify-between">
          <hr className="w-full border-gray-300 dark:border-gray-600" />
          <span className="px-2 text-gray-500 dark:text-gray-400">หรือ</span>
          <hr className="w-full border-gray-300 dark:border-gray-600" />
        </div>

        <button 
          onClick={() => signIn("google")} 
          className="w-full flex items-center justify-center px-4 py-2 space-x-2 border rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          <img src="/icon/LINE_logo.svg" alt="Google" className="w-5 h-5" />
          <span className="text-gray-700 dark:text-gray-300">เข้าสู่ระบบด้วย Google</span>
        </button>
      </div>
    </div>
  );
}
