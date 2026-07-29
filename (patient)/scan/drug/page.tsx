"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  Image as ImageIcon,
  Loader2,
  Volume2,
  RefreshCcw,
} from "lucide-react";
import { ocrApi , ttsApi } from "@/lib/api";
import type { DrugInfo } from "@/types/drug";
import Button from "@/components/ui/button";
import Image from "next/image";
import CameraCapture from "@/components/camera/CameraCapture";

type ScanStep = "idle" | "scanning" | "done" | "error";

export default function ScanDrugPage() {
  const router = useRouter();
  const [step, setStep] = useState<ScanStep>("idle");
  const [error, setError] = useState<string | null>(null);
  const [rawText, setRawText] = useState("");
  const [drug, setDrug] = useState<DrugInfo | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  const handleFileSelected = async (file: File) => {
  setError(null);
  setDrug(null);
  setRawText("");
  setStep("scanning");

  const url = URL.createObjectURL(file);
  setPreviewUrl(url);

  try {
    const res = await ocrApi.scanDrug(file);

    if (!res.success || !res.data) {
      throw new Error("OCR failed");
    }

    setRawText(res.data.text);

    if (!res.data.drug) {
  setStep("error");
  setError("تم استخراج النص لكن لم يتم التعرف على الدواء.");
  return;
}
    setDrug(drug);
   router.push(`/scan/result?scanId=${res.data.scan.id}`);


    setStep("done");

  } catch (e) {
    console.error(e);
    setStep("error");
    setError(
      "حدث خطأ أثناء تحليل صورة الدواء. يرجى المحاولة بصورة أوضح."
    );
  }
};


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    void handleFileSelected(file);
  };

  const handleRetry = () => {
    setStep("idle");
    setError(null);
    setRawText("");
    setDrug(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleSpeak = async () => {
  if (!rawText) return;

  try {
    const res = await ttsApi.speak(rawText, "ar");

    if (!res.success || !res.data) {
      throw new Error("TTS failed");
    }

    const audio = new Audio(res.data.audioUrl);
    audio.play();
  } catch (e) {
    console.error(e);
    alert("تعذر تشغيل الصوت حاليًا.");
  }
};


  const handleOrderDrug = () => {
    if (!drug) return;
    router.push(`/orders/new/by-drug`);
  };

  const handleCompare = () => {
    if (!drug) return;
    router.push(`/scan/compare`);
  };

  const handleAddToMyMeds = () => {
    if (!drug) return;
    alert(`(تجريبي) تم إضافة ${drug.name} إلى قائمتك الدوائية.`);
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 md:p-8 flex items-start justify-center"
    >
      <div className="w-full max-w-3xl space-y-6">
        {/* العنوان */}
        <header className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
            مسح دواء عبر الكاميرا (OCR)
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            صوّر علبة الدواء بوضوح ليتم التعرف على النص وتحليل المعلومات الطبية المرتبطة به.
          </p>
        </header>

        {/* كارد المسح */}
        <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 md:p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* معاينة الصورة */}
            <div className="w-full md:w-1/2">
              <div className="aspect-[4/3] rounded-2xl border border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-800">
                {previewUrl ? (
                  <Image
                    src={previewUrl}
                    alt="معاينة علبة الدواء"
                    width={600}
                    height={400}
                    unoptimized
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center text-slate-400 gap-2">
                    <Camera size={32} />
                    <p className="text-xs">
                      لم تقم بعد باختيار صورة. قم بالتقاط صورة لعلبة الدواء أو اختر صورة من المعرض.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* أزرار المسح */}
            <div className="w-full md:w-1/2 space-y-3">
              <p className="text-xs text-slate-600 dark:text-slate-300">
                تأكد من أن اسم الدواء والمعلومات مكتوبة بوضوح في الصورة للحصول على نتيجة أفضل.
              </p>

              <div className="space-y-2">
                <Button
                  type="button"
                  onClick={() => setShowCamera(true)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-slate-900 text-white px-4 py-2 text-sm cursor-pointer hover:bg-slate-800 transition"
                >
                  <Camera size={18} />
                  <span>التقاط صورة من الكاميرا</span>
                </Button>

                <label
                  htmlFor="galleryInput"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white text-slate-900 px-4 py-2 text-sm cursor-pointer hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 transition"
                >
                  <ImageIcon size={18} />
                  <span>اختيار صورة من المعرض</span>
                </label>

                <input
                  id="galleryInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleInputChange}
                />

                {showCamera && (
                  <CameraCapture
                    onCapture={(file) => {
                      setShowCamera(false);
                      handleFileSelected(file);
                    }}
                    onClose={() => setShowCamera(false)}
                  />
                )}
              </div>

              {step === "scanning" && (
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <Loader2 className="animate-spin" size={16} />
                  <span>جارٍ قراءة النص من علبة الدواء، يرجى الانتظار…</span>
                </div>
              )}

              {error && step === "error" && (
                <div className="rounded-2xl border border-rose-300 bg-rose-50 dark:bg-rose-950/40 dark:border-rose-800 p-3 text-xs text-rose-700 dark:text-rose-200">
                  {error}
                </div>
              )}

              {step !== "idle" && (
                <button
                  type="button"
                  onClick={handleRetry}
                  className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 mt-1"
                >
                  <RefreshCcw size={14} />
                  <span>مسح صورة جديدة</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {drug && step === "done" && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                معلومات الدواء المكتشف
              </h2>
              <button
                type="button"
                onClick={handleSpeak}
                className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-2xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Volume2 size={16} />
                <span>تشغيل القراءة الصوتية</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <InfoBlock label="اسم الدواء" value={drug.name} />
              <InfoBlock label="المادة الفعّالة" value={drug.activeIngredient} />
              <InfoBlock label="الاستطبابات" value={drug.indications} />
              <InfoBlock label="مضاد الاستطباب" value={drug.contraindications} />
              <InfoBlock label="الجرعة وطريقة الاستعمال" value={drug.dosage} />
              <InfoBlock label="تحذيرات الاستعمال" value={drug.warnings} />
              <InfoBlock label="التأثيرات الجانبية" value={drug.sideEffects} />
              <InfoBlock label="التداخلات الدوائية" value={drug.interactions} />
              <InfoBlock label="فرط الجرعة" value={drug.overdose} />
            </div>

            <div className="flex flex-wrap gap-3 mt-2">
              <Button className="px-4 py-2 text-sm" onClick={handleOrderDrug}>
                طلب هذا الدواء من صيدلية
              </Button>

              <Button
                className="px-4 py-2 text-sm bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-100"
                onClick={handleAddToMyMeds}
              >
                إضافة الدواء إلى أدويتي
              </Button>

              <Button
                className="px-4 py-2 text-sm bg-emerald-500 hover:bg-emerald-600"
                onClick={handleCompare}
              >
                مقارنة هذا الدواء بدواء آخر
              </Button>
            </div>
          </section>
        )}

        {rawText && (
          <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">
              النص المستخرج من علبة الدواء (للمراجعة)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
              {rawText}
            </p>
          </section>
        )}
      </div>
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3">
      <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-1">
        {label}
      </p>
      <p className="text-sm text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  );
}
