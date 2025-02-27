"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ ใช้ `useRouter` เพื่อเปลี่ยนหน้า
import Swal from "sweetalert2"; // ✅ เพิ่ม SweetAlert2
import Image from "next/image";

export default function FormPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    age: ""
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  // ✅ อัปเดตค่าฟอร์ม
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ ส่งข้อมูลฟอร์ม
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        // ✅ แสดง SweetAlert เมื่อส่งสำเร็จ
        Swal.fire({
          title: "ส่งข้อมูลสำเร็จ ✅",
          text: "ขอบคุณที่ร่วมทำบุญ!",
          icon: "success",
          confirmButtonText: "ไปต่อ",
        }).then(() => {
          nextStep(); // ✅ ไปที่ Step 4 (สำเร็จ)
          // router.push("/success"); // ✅ ถ้าอยากให้เปลี่ยนหน้า
        });
      } else {
        Swal.fire({
          title: "เกิดข้อผิดพลาด ❌",
          text: "กรุณาลองใหม่อีกครั้ง",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาด ❌",
        text: "เกิดปัญหาในการส่งข้อมูล กรุณาลองใหม่",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 max-w-[430px] max-h-[768px] flex flex-col p-4">
      <div className="grid grid-cols-1">
        <div className="text-left">
          <a href="/">
            <img className="h-12" src="https://lengnoeiyionline.com/FormTemplate/theme/Wat%20Leng%20Noei%20Yi/Assets/P-C%20(Product%20A)/Asset%20189.png" alt="Logo"/>
          </a>
        </div>

        {/* ✅ Progress Bar */}
        <div className="relative flex w-full justify-between">
          {["กองบุญ", "กรอกข้อมูล", "ชำระเงิน", "สำเร็จ"].map((label, index) => (
            <div key={index} className="relative mt-4 flex flex-col items-center w-full z-20">
              <div className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300
                ${index + 1 <= step ? "bg-green-600 shadow-md shadow-green-300 scale-110" : "bg-gray-300"}`}>
                {index + 1}
              </div>
              <p className={`text-xs mt-2 font-medium ${index + 1 <= step ? "text-green-600" : "text-gray-400"}`}>
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* ✅ แถบ Progress Bar (ย้ายลงล่าง) */}
        <div className="relative w-full flex items-center justify-between mt-4">
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-300"></div>
          <div className="absolute bottom-0 left-0 h-1 bg-green-600 transition-all duration-300"
            style={{ width: `${((step - 0) / (5 - 1)) * 100}%` }}></div>
        </div>
      </div>

      {/* ✅ Content Form */}
      <div className="w-full mt-10  h-[90vh] items-center bg-white p-6 rounded-xl shadow-md">
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold text-center">ทำบุญสร้างฤกษ์มงคล</h2>
            <Image src="/img/campaign.jpg" alt="Campaign" width={300} height={200} className="rounded-lg"/>
            <p className="mt-2 text-center">💰 100 บาท</p>
            <p className="text-gray-600 text-center">ชุดสร้างฤกษ์มงคล 1 เล่ม + วอลเปเปอร์ไหว้เจ้าเสริมดวง</p>
            <button onClick={nextStep} className="w-full mt-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-red-800">
              ถัดไป
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold text-center">กรอกข้อมูลและรายละเอียด</h2>
            <label className="block mt-4">ชื่อ - นามสกุล</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange}
              className="w-full border p-2 rounded-lg" placeholder="กรอกชื่อ - นามสกุล" required/>

            <label className="block mt-4">วัน เดือน ปีเกิด</label>
            <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange}
              className="w-full border p-2 rounded-lg" required/>

            <label className="block mt-4">อายุ</label>
            <input type="number" name="age" value={formData.age} onChange={handleChange}
              className="w-full border p-2 rounded-lg" placeholder="อายุ" required/>

            <div className="flex justify-between mt-4">
              <button onClick={prevStep} className="py-2 px-4 bg-gray-400 text-white rounded-lg hover:bg-gray-600">
                กลับ
              </button>
              <button onClick={nextStep} className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-red-800">
                ถัดไป
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold text-center">ยืนยันข้อมูล</h2>
            <p className="mt-4 text-center text-gray-700">กรุณาตรวจสอบข้อมูลของคุณก่อนกด "ยืนยัน"</p>
            <div className="flex justify-between mt-4">
              <button onClick={prevStep} className="py-2 px-4 bg-gray-400 text-white rounded-lg hover:bg-gray-600">
                กลับ
              </button>
              <button onClick={handleSubmit} disabled={loading}
                className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-green-800 disabled:bg-gray-400">
                {loading ? "กำลังส่ง..." : "ยืนยัน"}
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-xl font-bold text-center">สำเร็จ</h2>
            <p className="mt-4 text-center text-gray-700">ขอบคุณที่ร่วมทำบุญ 🎉</p>
          </div>
        )}
      </div>
    </div>
  );
}
