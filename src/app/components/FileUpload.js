"use client";

import { useState } from "react";
import { uploadFile } from "../actions/upload";

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState("");

  const handleChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("กรุณาเลือกไฟล์ก่อนอัปโหลด");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await uploadFile(formData);

    if (response.success) {
      setMessage(`อัปโหลดสำเร็จ: ${response.filePath}`);
    } else {
      setMessage(`เกิดข้อผิดพลาด: ${response.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <input type="file" onChange={handleChange} className="border p-2" />
      {preview && <img src={preview} alt="Preview" className="w-40 h-40 object-cover" />}
      <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded">
        อัปโหลดไฟล์
      </button>
      {message && <p className="text-sm mt-2">{message}</p>}
    </div>
  );
}
