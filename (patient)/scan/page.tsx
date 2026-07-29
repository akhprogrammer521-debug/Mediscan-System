"use client";

import { Camera, FileText } from "lucide-react";
import Link from "next/link";

export default function ScanHomePage() {
  return (
    <div
      dir="rtl"
      className="min-h-screen p-6 md:p-10 bg-gradient-to-b from-slate-50 to-slate-100
                 dark:from-slate-900 dark:to-slate-950"
    >
      <div className="max-w-3xl mx-auto space-y-8">

        {/* عنوان الصفحة */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            نظام المسح الذكي OCR
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm">
            اختر طريقة المسح لقراءة علبة دواء أو وصفة طبية باستخدام الذكاء الاصطناعي.
          </p>
        </div>

        {/* الخيارات */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* مسح دواء */}
          <Link href="/scan/drug">
            <div
              className="
                cursor-pointer rounded-3xl p-6 border shadow-sm
                bg-white hover:shadow-md transition
                dark:bg-slate-800 blue:border-slate-700
              "
            >
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Camera className="text-blue-600 dark:text-blue-300" size={30} />
                </div>
                <div>
                  <h2 className="font-semibold text-lg text-slate-900 dark:text-slate-100">
                    مسح دواء عبر الكاميرا
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    التعرّف على علبة الدواء وتحليل المعلومات الطبية تلقائيًا.
                  </p>
                </div>
              </div>
            </div>
          </Link>

         
        </div>

        {/* معلومات */}
        <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-4">
          يتم تحليل النصوص باستخدام الذكاء الاصطناعي وتحويلها إلى معلومات دوائية دقيقة.
        </div>
      </div>
    </div>
  );
}
