"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Image from "next/image";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export default function FormPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    birthdate: "",
    month: "",
    year: "",
    age: "",
    birthtime: "",
    constellation: "",
    useGoodTime: false,
    file: null,
  });

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const fetchUserData = async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await fetch(`/api/get-user?name=${query}`);
      const data = await response.json();

      if (data.success) {
        setSuggestions(data.users);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "name") {
      fetchUserData(value);
    }
  };

  const handleSelectSuggestion = (user) => {
    setFormData({
      name: user.detailsname || "",
      birthdate: user.detailsbirthdate || "",
      month: user.detailsbirthmonth || "",
      year: user.detailsbirthyear || "",
      age: user.detailsbirthage || "",
      birthtime: user.detailsbirthtime || "",
      constellation: user.detailsbirthconstellation || "",
      useGoodTime: user.detailsbirthtime === "เวลาดี",
    });

    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleBirthTimeChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      if (prev.useGoodTime) {
        return prev;
      }

      const [currentHour = "00", currentMinute = "00"] = (
        prev.birthtime || "00:00"
      ).split(":");

      return {
        ...prev,
        birthtime:
          name === "hour"
            ? `${value}:${currentMinute}`
            : `${currentHour}:${value}`,
      };
    });
  };

  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;

    setFormData((prev) => ({
      ...prev,
      useGoodTime: isChecked,
      birthtime: isChecked ? "เวลาดี" : "",
    }));
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleChangeAge = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const nextStepCheck = () => {
    if (
      !formData.name ||
      !formData.birthdate ||
      !formData.month ||
      !formData.year ||
      !formData.constellation ||
      !formData.birthtime ||
      !formData.age
    ) {
      let missingFields = [];
      if (!formData.name) missingFields.push("• ชื่อ - นามสกุล");
      if (!formData.birthdate) missingFields.push("• วันเกิด");
      if (!formData.month) missingFields.push("• เดือนเกิด");
      if (!formData.year) missingFields.push("• ปีเกิด");
      if (!formData.constellation) missingFields.push("• ปีนักษัตร");
      if (!formData.birthtime) missingFields.push("• เวลาเกิด");
      if (!formData.age) missingFields.push("• อายุ");

      const missingListHTML = missingFields
        .map((field) => `<li>${field}</li>`)
        .join("");

      Swal.fire({
        title:
          "<h1 style='font-weight: bold; font-size: 22px; color: #444;'>กรุณากรอกข้อมูลให้ครบถ้วน</h1>",
        html: `<ul style="text-align: left; font-size: 16px; color: #555;">${missingListHTML}</ul>`,
        icon: "warning",
        customClass: {
          popup: "rounded-lg shadow-lg",
          confirmButton: "bg-[#742F1E] text-white text-lg px-6 py-2 rounded-md",
        },
        confirmButtonText: "ตกลง",
        width: "375px",
        showConfirmButton: true,
      }).then(() => {
        document.getElementById("name-input")?.focus();
      });

      setLoading(false);
      return;
    } else {
      Swal.fire({
        title:
          "<h2 style='font-size: 24px; color: #B3885B;'>ตรวจสอบข้อมูลให้ถูกต้อง<br>ก่อนทำการยืนยัน</h2>",
        html: `
            <div style="text-align: center; margin-bottom: 10px;">
              <div style="display: inline-block; background-color: #742F1E; color: white; padding: 10px 20px; border-radius: 20px; font-size: 18px;">
                ชุดฝากดวงปีชง<br>ราคาชุดละ 100 บาท
              </div>
            </div>
            <table style="width: 100%; text-align: left; font-size: 16px; color: #555;">
              <tr><td><strong>ชื่อ-สกุล</strong></td><td>: ${formData.name}</td></tr>
              <tr><td><strong>วัน เดือน ปี เกิด</strong></td><td>: ${formData.birthdate}-${formData.month}-${formData.year}</td></tr>
              <tr><td><strong>เวลาเกิด</strong></td><td>: ${formData.birthtime}</td></tr>
              <tr><td><strong>ปีนักษัตร</strong></td><td>: ${formData.constellation}</td></tr>
              <tr><td><strong>อายุ</strong></td><td>: ${formData.age}</td></tr>
            </table>
          `,
        iconHtml: `
          <img src="/img/Asset 237.png" 
               style="width: 100%; background: transparent; filter: drop-shadow(0 0 0 transparent);">
        `,
        showCancelButton: true,
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "แก้ไข",
        customClass: {
          popup: "rounded-lg shadow-lg",
          confirmButton:
            "order-2 bg-[#742F1E] text-white text-lg px-6 py-2 mr-4 rounded-md",
          cancelButton:
            "order-1 bg-gray-400 text-white text-lg px-6 py-2 ml-4 rounded-md",
          icon: "no-border",
        },
        buttonsStyling: true,
        reverseButtons: true,
        width: "375px",
      }).then((result) => {
        if (result.isConfirmed) {
          nextStep();
        }
      });
    }
  };

  // ✅ ส่งข้อมูลฟอร์ม
  const handleSubmit = async () => {
    setLoading(true);

    if (!formData.file || formData.file.size === 0) {
      Swal.fire({
        text: "กรุณาอัปโหลดภาพสลิปก่อนดำเนินการ",
        icon: "warning",
        width: "375px",
        showConfirmButton: true,
        confirmButtonText: "ตกลง",
      }).then(() => {
        document.getElementById("upload-slip-btn")?.focus();
      });

      setLoading(false);
      return;
    }

    try {
      Swal.fire({
        title: "กำลังดำเนินการ...",
        text: "กรุณารอสักครู่",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        width: "375px",
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("birthdate", formData.birthdate);
      formDataToSend.append("month", formData.month);
      formDataToSend.append("year", formData.year);
      formDataToSend.append("constellation", formData.constellation);
      formDataToSend.append("birthtime", formData.birthtime);
      formDataToSend.append("age", formData.age);
      formDataToSend.append("file", formData.file);

      const response = await fetch("/api/submit-form", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        Swal.fire({
          timer: 1000,
          showConfirmButton: false,
          width: "375px",
        }).then(() => {
          nextStep();
        });
      } else {
        Swal.fire({
          title: "เกิดข้อผิดพลาด ❌",
          text: "กรุณาลองใหม่อีกครั้ง",
          icon: "error",
          width: "375px",
          showConfirmButton: true,
          confirmButtonText: "ตกลง",
        });
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error("❌ Error:", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาด ❌",
        text: "เกิดปัญหาในการส่งข้อมูล กรุณาลองใหม่",
        icon: "error",
        width: "375px",
        showConfirmButton: true,
        confirmButtonText: "ตกลง",
      });
      setLoading(false);
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
    w-screen
    min-w-[375px]
    max-w-[425px]
    min-h-[60vh]
    p-0 m-0
    flex flex-col
    bg-cover bg-top bg-no-repeat
  "
      style={{
        backgroundImage: "url('/img/Background.png')",
      }}
    >
      <div
        className="grid grid-cols-1 py-10 px-2"
      >
        <div className="relative mt-6 flex w-full justify-between">
          {["ข้อมูลกองบุญ", "กรอกข้อมูล", "ชำระเงิน", "สำเร็จ"].map(
            (label, index) => (
              <div
                key={index}
                className="relative mt-4 flex flex-col items-center w-full z-20"
              >
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300
                ${index + 1 <= step
                      ? "bg-green-600 scale-110 text-white"
                      : "bg-gray-300"
                    }`}
                >
                  {index + 1}
                </div>
                <p
                  className={`text-xs mt-2 font-medium ${index + 1 <= step ? " text-white" : "text-gray-400"
                    }`}
                >
                  {label}
                </p>
              </div>
            )
          )}
        </div>

        <div className="relative w-full flex items-center justify-between mt-4">
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-300"></div>
          <div
            className="absolute bottom-0 left-0 h-1 bg-green-600 transition-all duration-300"
            style={{ width: `${((step - 0) / (5 - 1)) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="w-full items-center px-6">
        {step === 1 && (
          <div className="w-full">
            <h2 className="w-full text-xl font-bold text-center mt-10">
              ร่วมบุญกองบุญ
            </h2>
            <h2 className="text-lg font-bold text-center text-wrap">
              เทียนประธีปแห่งประณิธาน
            </h2>
            <div className="flex w-full justify-center">
              <Image
                className="rounded-lg mt-4 w-full"
                src="/img/campaigns/547231415721263316.jpg"
                width={1080}
                height={1080}
                priority
                alt="Picture of the author"
              />
            </div>
            <p className="mt-4 text-center text-lg">ร่วมบุญ: 100 บาท</p>
            <p className=" text-center text-md">
              รับเจ้าภาพจำนวน 50 เจ้าภาพ- ครอบครัว
            </p>
            <Image
              className="mt-4 w-full"
              src="/img/Asset 279.png"
              width={500}
              height={500}
              alt="Picture of the author"
            />
            <p className="mt-4 text-gray-600 text-center">
              ทุกเจ้าภาพแจ้งชื่อ สกุล บริษัท ห้างร้าน - เริ่มจุดวันที่ 1
              ในความหมายดั่งเจ้าภาพได้น้อมขอพรต่อพระองค์ตลอดเวลาและได้รับการอภิบาลคุ้มครอง
              ดูแล พลังพุทธบารมีประทานพรแก่เจ้าภาพอย่างต่อเนื่องอีกด้วย
            </p>
            <button
              onClick={nextStep}
              className="w-full flex items-center justify-center gap-2 mt-10 py-3 px-6 bg-[#742F1E] font-semibold text-white rounded-full shadow-md 
             "
            >
              ถัดไป
              <span className="text-xl">➜</span>
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="w-full">
            <h2 className="w-full text-xl font-bold text-center mt-10">
              กรอกข้อมูลและรายละเอียด
            </h2>
            <div className=" flex flex-row">
              <label className="block mt-4">ชื่อ - นามสกุล</label>
              <label className="block mt-4 text-red-600 font-bold">*</label>
            </div>
            <div className="relative w-full">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg mt-2"
                placeholder="กรอกชื่อ - นามสกุล"
                required
              />

              {showSuggestions && (
                <ul className="absolute left-0 right-0 bg-white border rounded-lg shadow-md max-h-48 overflow-auto">
                  {suggestions.map((user, index) => (
                    <li
                      key={index}
                      onClick={() => handleSelectSuggestion(user)}
                      className="p-2 cursor-pointer hover:bg-gray-200"
                    >
                      {user.detailsname}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className=" flex flex-row">
              <label className="block mt-4">วัน เดือน ปีเกิด</label>
              <label className="block mt-4 text-red-600 font-bold">*</label>
            </div>
            <div className="grid mt-2 gap-1 grid-cols-3">
              <select
                name="birthdate"
                value={formData.birthdate || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg"
              >
                <option value="">วันที่</option>
                <option value="ไม่ทราบ">ไม่ทราบ</option>
                {[...Array(31).keys()].map((d) => (
                  <option key={d + 1} value={d + 1}>
                    {d + 1}
                  </option>
                ))}
              </select>

              <select
                name="month"
                value={formData.month || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg"
              >
                <option value="">เดือน</option>
                {[
                  "ไม่ทราบ",
                  "มกราคม",
                  "กุมภาพันธ์",
                  "มีนาคม",
                  "เมษายน",
                  "พฤษภาคม",
                  "มิถุนายน",
                  "กรกฏาคม",
                  "สิงหาคม",
                  "กันยายน",
                  "ตุลาคม",
                  "พฤศจิกายน",
                  "ธันวาคม",
                ].map((month, i) => (
                  <option key={i} value={month}>
                    {month}
                  </option>
                ))}
              </select>

              <select
                name="year"
                value={formData.year || ""}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg"
              >
                <option value="">ปี</option>
                <option value="ไม่ทราบ">ไม่ทราบ</option>
                {[...Array(100).keys()].map((y) => (
                  <option key={y} value={2568 - y}>
                    {2568 - y}
                  </option>
                ))}
              </select>
            </div>

            <div className=" flex flex-row mb-2">
              <label className="block mt-4">ปีนักษัตร</label>
              <label className="block mt-4 text-red-600 font-bold">*</label>
            </div>
            <select
              name="constellation"
              value={formData.constellation || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg"
            >
              <option value="">เลือกปีนักษัตร</option>
              {[
                "ไม่ทราบ",
                "ชวด",
                "ฉลู",
                "ขาล",
                "เถาะ",
                "มะโรง",
                "มะเส็ง",
                "มะเมีย",
                "มะแม",
                "วอก",
                "ระกา",
                "จอ",
                "กุน",
              ].map((zodiac, index) => (
                <option key={index} value={zodiac}>
                  {zodiac}
                </option>
              ))}
            </select>

            <div className=" flex flex-row">
              <p className="block mt-4 mb-2">
                เวลาเกิด ( ถ้าไม่ทราบเวลาเกิด คลิก{" "}
                <label>
                  <input
                    type="checkbox"
                    id="chkbirthtime"
                    name="useGoodTime"
                    checked={formData.useGoodTime}
                    onChange={handleCheckboxChange}
                    value="เวลาดี"
                  ></input>
                </label>{" "}
                )
              </p>
            </div>
            {!formData.useGoodTime && (
              <div className="grid gap-1 grid-cols-2">
                <select
                  name="hour"
                  value={
                    formData.useGoodTime
                      ? ""
                      : (formData.birthtime || "00:00").split(":")[0] || ""
                  }
                  onChange={handleBirthTimeChange}
                  disabled={formData.useGoodTime}
                  className="w-full border p-2 rounded-lg"
                >
                  <option value="">ชั่วโมง</option>
                  {[...Array(24).keys()].map((h) => (
                    <option key={h} value={h.toString().padStart(2, "0")}>
                      {h.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>

                <select
                  name="minute"
                  value={
                    formData.useGoodTime
                      ? ""
                      : (formData.birthtime || "00:00").split(":")[1] || ""
                  }
                  onChange={handleBirthTimeChange}
                  disabled={formData.useGoodTime}
                  className="w-full border p-2 rounded-lg"
                >
                  <option value="">นาที</option>
                  {[...Array(60).keys()].map((m) => (
                    <option key={m} value={m.toString().padStart(2, "0")}>
                      {m.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              {(formData.useGoodTime || formData.birthtime === "เวลาดี") && (
                <div className="mt-2 p-2 bg-green-100 border border-green-400 text-green-800 rounded-md">
                  <p>คุณเลือก “เวลาดี” แทนการระบุเวลาเกิด</p>
                </div>
              )}
            </div>

            <div className=" flex flex-row">
              <label className="block mt-4">อายุ</label>
              <label className="block mt-4 text-red-600 font-bold">*</label>
            </div>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChangeAge}
              className="w-full mt-2 border p-2 rounded-xl"
              placeholder="กรอกอายุ"
              required
            />

            <div className="flex justify-between mt-10 gap-4">
              <button
                onClick={prevStep}
                className="flex items-center justify-center gap-2 py-3 px-6 bg-[#B8A7A7] text-white text-lg font-semibold rounded-full shadow-md"
              >
                <span className="text-xl">←</span> กลับ
              </button>

              <button
                onClick={nextStepCheck}
                className="flex items-center justify-center gap-2 py-3 px-6 bg-[#742F1E] text-white text-lg font-semibold rounded-full shadow-md"
              >
                ถัดไป <span className="text-xl">→</span>
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="w-full">
            <h2 className="text-xl mt-10 font-bold text-[#BD9B5B] text-center">
              สแกน QR CODE นี้ เพื่อชำระเงิน
            </h2>
            <p className="text-center text-gray-500">
              บันทึกหน้าจอหรือบันทึกรูปภาพเพื่อสแกน
            </p>
            <Image
              className="mt-2 w-full"
              src="/img/Asset 279.png"
              width={500}
              height={500}
              alt="QRCODE"
            />
            <div className="flex-col justify-center mt-2">
              <div className="flex justify-center mt-2">
                <Image
                  className="rounded-lg"
                  src="/img/QRCODE.jpg"
                  width={280}
                  height={384}
                  alt="QRCODE"
                />
              </div>
              <div className="flex flex-row justify-center mt-4">
                <p className="text-xl text-end mr-2">ยอดรวมสุทธิ</p>
                <p className="px-2 text-xl text-center bg-red-200 rounded-xl">
                  8888.88
                </p>
                <p className="text-xl text-start ml-2">บาท</p>
              </div>
              <Image
                className="mt-4 w-full"
                src="/img/Asset 279.png"
                width={500}
                height={500}
                alt="QRCODE"
              />
              <div className="mt-2 text-center ">
                <h2 className="text-xl font-bold text-[#BD9B5B] text-center">
                  แนบสลิปหลักฐานการชำระเงิน
                </h2>
                <p className="text-xs">
                  * กรุณาอัปโหลดภาพสลิปที่เห็นชื่อและ QR Code ชัดเจน
                </p>
                <div className="mt-6">
                  <label className="cursor-pointer bg-gray-400 text-white py-3 px-6 rounded-full w-full max-w-xs text-center text-lg font-semibold hover:bg-gray-500 transition-all duration-300">
                    {formData.file ? formData.file.name : "อัปโหลดรูปภาพสลิป"}
                    <input
                      type="file"
                      name="file"
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*"
                      required
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-10 gap-4">
              <button
                onClick={prevStep}
                className="flex items-center justify-center gap-2 py-3 px-6 bg-[#B8A7A7] text-white text-lg font-semibold rounded-full shadow-md"
              >
                <span className="text-xl">←</span> กลับ
              </button>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`flex items-center justify-center gap-2 py-3 px-6 
                  text-white text-lg font-semibold rounded-full shadow-md ${loading ? "bg-gray-500" : "bg-[#742F1E]"
                  }`}
              >
                {loading ? "กำลังส่ง..." : "ยืนยัน"}
                <span className="text-xl">→</span>
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="w-full">
            <h2 className="text-xl font-bold text-center">สำเร็จ</h2>
            <p className="mt-4 text-center text-gray-700">
              ขอบคุณที่ร่วมทำบุญ 🎉
            </p>
          </div>
        )}
      </div>
      <div className="relative flex bottom-0 mt-10 bg-cover bg-center w-full min-w-[375px] max-w-[425px] h-[80px]">
        <Image src="/img/footerimg.png" fill sizes="425px" alt="some image" />
      </div>
    </div>
  );
}
