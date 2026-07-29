"use client";

import Image from "next/image";
import { useState } from "react";
import Button from "@/components/ui/button";

export default function DrugResult() {
  const [img] = useState(() => sessionStorage.getItem("guest_drug_image") || "");

  return (
    <div dir="rtl" className="p-6 space-y-6 min-h-screen">

      <h1 className="text-2xl font-bold">نتيجة تحليل الدواء</h1>

      {img && (
        <div className="relative w-72 h-72 rounded-xl overflow-hidden border mx-auto">
          <Image src={img} alt="scanned" fill className="object-cover" />
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 border rounded-2xl p-4">
        <h2 className="font-semibold text-lg mb-3">معلومات دوائية (تجريبية):</h2>
        <ul className="text-slate-700 dark:text-slate-300 space-y-1">
          <li>● الاسم: Paracetamol</li>
          <li>● الجرعة: 500 mg</li>
          <li>● الاستعمال: مسكن ألم</li>
          <li>● التحذيرات: مشاكل الكبد</li>
          <li>● التداخلات الدوائية: تفاعل متوسط</li>
        </ul>
      </div>

      <Button className="w-full py-3" onClick={() => history.back()}>
        رجوع
      </Button>

    </div>
  );
}
