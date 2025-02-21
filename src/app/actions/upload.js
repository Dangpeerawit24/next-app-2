"use server";

import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";

export async function uploadFile(formData) {
  const file = formData.get("file");

  if (!file) {
    return { success: false, message: "No file uploaded" };
  }

  const uploadsDir = path.join(process.cwd(), "public/uploads");

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const filePath = path.join(uploadsDir, file.name);
  const buffer = Buffer.from(await file.arrayBuffer());

  fs.writeFileSync(filePath, buffer);

  return { success: true, filePath: `/uploads/${file.name}` };
}
