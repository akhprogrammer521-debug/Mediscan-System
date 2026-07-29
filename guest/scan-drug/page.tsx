"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function GuestScanDrugPage() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fakeResultShown, setFakeResultShown] = useState(false);
  const router = useRouter();

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setFakeResultShown(true); // نظهر نتائج وهمية للتجربة
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    handleFileChange(files && files[0] ? files[0] : null);
  };

  return (
    <div className="space-y-5">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <h1 className="text-lg font-bold mb-1">مسح علبة دواء (وضع الضيف)</h1>
        <p className="text-xs text-slate-600 dark:text-slate-300">
          التقط صورة للواجهة الأمامية لعلبة الدواء أو ارفع صورة موجودة في جهازك، وسنظهر
          لك مثالاً افتراضياً لكيفية تحليل المعلومات.
        </p>
      </div>

      {/* Upload area */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 p-5 space-y-4">
        <p className="text-xs font-medium text-slate-700 dark:text-slate-200">
          اختر طريقة إدخال الصورة:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-4 text-center text-xs cursor-pointer hover:border-primary-500 hover:bg-primary-50/50 dark:hover:bg-slate-800">
            <span className="mb-1 font-semibold text-slate-800 dark:text-slate-50">
              فتح الكاميرا
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              متاحة على الهواتف التي تدعم ذلك
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
              اختر صورة سابقة لعلبة الدواء
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              title="رفع صورة من الجهاز"
              aria-label="رفع صورة من الجهاز"
              onChange={handleInputChange}
            />
          </label>
        </div>

        {previewUrl && (
          <div className="mt-4 flex items-center gap-3">
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
              <Image
                src={previewUrl}
                alt="صورة علبة الدواء المختارة"
                fill
                className="object-cover"
              />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              هذه صورة تجريبية تم تحميلها. في النسخة الكاملة سيتم تحليل النصوص عبر OCR
              واستخراج اسم الدواء وتركيبه ومعلوماته.
            </p>
          </div>
        )}
      </div>

      {/* Fake analysis result */}
      {fakeResultShown && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">مثال لنتيجة تحليل الدواء</h2>
            <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300 text-[10px]">
              بيانات تجريبية
            </span>
          </div>

          <ul className="text-xs text-slate-700 dark:text-slate-200 space-y-1.5">
            <li><strong>الاسم التجاري:</strong> Paracetamol 500mg</li>
            <li><strong>الاسم العلمي:</strong> Paracetamol</li>
            <li><strong>الاستطبابات:</strong> مسكن ألم خفيف إلى متوسط، خافض حرارة.</li>
            <li><strong>الجرعة الشائعة للبالغين:</strong> قرص 500 مجم كل 6–8 ساعات (بحد أقصى 4 جم/اليوم).</li>
            <li><strong>تحذيرات:</strong> يُمنع تجاوز الجرعة اليومية، يُستخدم بحذر عند مرضى الكبد.</li>
            <li><strong>تداخلات دوائية مهمة:</strong> أدوية سميّة للكبد، الكحول، بعض أدوية الصرع.</li>
          </ul>

          <Button className="w-full mt-2 py-2.5 text-xs">
            تجربة مقارنة هذا الدواء مع دواء آخر (تجريبياً)
          </Button>
        </div>
      )}
    </div>
  );
}
