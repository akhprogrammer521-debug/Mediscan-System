"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/button";

export default function UploadDrug() {
  const [preview, setPreview] = useState("");

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
      sessionStorage.setItem("guest_drug_image", reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleNext = () => {
    window.location.href = "/guest/scan-drug/result";
  };

  return (
    <div dir="rtl" className="p-6 space-y-6">

      <h1 className="text-xl font-bold">رفع صورة الدواء</h1>

      <input
        type="file"
        accept="image/*"
        aria-label="رفع صورة للدواء"
        title="رفع صورة للدواء"
        onChange={handleUpload}   // ← هنا نستخدم الدالة
        className="mt-2 block w-full bg-white dark:bg-slate-800 
             border p-3 rounded-lg cursor-pointer"
      />



      {preview && (
        <div className="relative w-64 h-64 border rounded-xl mx-auto overflow-hidden">
          <Image src={preview} alt="preview" fill className="object-cover" />
        </div>
      )}

      {preview && (
        <Button className="w-full py-3" onClick={handleNext}>
          متابعة
        </Button>
      )}
    </div>
  );
}
