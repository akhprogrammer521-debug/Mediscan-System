"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function GuestScanPrescriptionPage() {
  const router = useRouter();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !files[0]) return;
    const url = URL.createObjectURL(files[0]);
    setPreviewUrl(url);
    setShowResult(true);
  };

  return (
    <div className="space-y-5">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <h1 className="text-lg font-bold mb-1">مسح وصفة طبية (وضع الضيف)</h1>
        <p className="text-xs text-slate-600 dark:text-slate-300">
          جرّب كيف يمكن لـ MediScan قراءة وصفة الطبيب وتحويلها إلى أدوية مفهومة باللغة
          العربية. البيانات هنا للعرض فقط.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 p-5 space-y-4">
        <p className="text-xs font-medium text-slate-700 dark:text-slate-200">
          التقط صورة لوصفتك أو ارفع صورة من المعرض:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-4 text-center text-xs cursor-pointer hover:border-primary-500 hover:bg-primary-50/50 dark:hover:bg-slate-800">
            <span className="mb-1 font-semibold text-slate-800 dark:text-slate-50">
              فتح الكاميرا
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              التقط صورة لوصفة الطبيب
            </span>
            <Button
                      className="w-full text-lg py-3"
                      onClick={() => router.push("/guest/scan-drug/camera")}
                    >
                      📸 فتح الكاميرا لمسح الدواء
                    </Button>
          </label>

          <label className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-4 text-center text-xs cursor-pointer hover:border-primary-500 hover:bg-primary-50/50 dark:hover:bg-slate-800">
            <span className="mb-1 font-semibold text-slate-800 dark:text-slate-50">
              رفع صورة من الجهاز
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              استخدم صورة سابقة للوصفة
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              title="رفع صورة للصفة الطبية"
              aria-label="رفع صورة للصفة الطبية"
              onChange={handleInputChange}
            />
          </label>
        </div>

        {previewUrl && (
          <div className="mt-4 flex items-center gap-3">
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
              <Image
                src={previewUrl}
                alt="صورة وصفة طبية"
                fill
                className="object-cover"
              />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              هذه صورة تجريبية، في النسخة الكاملة سيتم تحليل النصوص، التعرف على أسماء
              الأدوية والجرعات، وترجمتها للعربية.
            </p>
          </div>
        )}
      </div>

      {showResult && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">مثال لنتيجة تحليل الوصفة</h2>
            <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300 text-[10px]">
              بيانات تجريبية
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300">
            تم التعرف على الأدوية التالية من الوصفة (مثال):
          </p>

          <ul className="text-xs text-slate-700 dark:text-slate-200 space-y-1.5">
            <li>
              <strong>1. Amoxicillin 500mg Capsule</strong> — كبسولة كل 8 ساعات لمدة 7 أيام.
            </li>
            <li>
              <strong>2. Paracetamol 500mg Tablet</strong> — قرص عند اللزوم لخفض الحرارة (بحد
              أقصى 4 مرات يومياً).
            </li>
            <li>
              <strong>3. Vitamin D 50000 IU</strong> — كبسولة مرة أسبوعياً لمدة 8 أسابيع.
            </li>
          </ul>

          <Button className="w-full mt-2 py-2.5 text-xs">
            الاستماع لقراءة الوصفة بالعربية (تمثيلي)
          </Button>
        </div>
      )}
    </div>
  );
}
