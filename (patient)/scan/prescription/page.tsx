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
import { ocrApi, ttsApi } from "@/lib/api";
import type { DrugInfo } from "@/lib/api";
import Button from "@/components/ui/button";
import CameraCapture from "@/components/camera/CameraCapture";

type ScanStep = "idle" | "scanning" | "done" | "error";

export default function ScanPrescriptionPage() {
  const router = useRouter();
  const [step, setStep] = useState<ScanStep>("idle");
  const [error, setError] = useState<string | null>(null);
  const [rawText, setRawText] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [detectedDrugs, setDetectedDrugs] = useState<DrugInfo[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const [ttsText, setTtsText] = useState<string | null>(null);

  const handleFileSelected = async (file: File) => {
    setError(null);
    setDetectedDrugs([]);
    setRawText("");
    setTtsText(null);
    setStep("scanning");

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    try {
      const res = await ocrApi.scanPrescription(file);

      if (!res.success || !res.data) {
        throw new Error("OCR failed");
      }

      const { text, translated, drugs, ttsText } = res.data;

      // نعرض النص المترجم إن وجد
      setRawText((translated && translated.trim().length ? translated : text) || "");

      if (!drugs || drugs.length === 0) {
        setStep("error");
        setError("تمت قراءة الوصفة، لكن لم يتم التعرف على أدوية ضمن قاعدة البيانات.");
        return;
      }

      setDetectedDrugs(drugs);
      setTtsText(ttsText ?? null);
      setStep("done");
    } catch (e) {
      console.error(e);
      setStep("error");
      setError("حدث خطأ أثناء قراءة الوصفة. حاول مرة أخرى بصورة أوضح.");
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
    setDetectedDrugs([]);
    setTtsText(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleSpeak = async () => {
    if (!detectedDrugs.length) return;

    const textToRead =
      ttsText ??
      detectedDrugs
        .map((d) => `دواء: ${d.name}. المادة الفعّالة: ${d.composition}.`)
        .join(" ");

    try {
      const res = await ttsApi.speak(textToRead, "ar");
      if (!res.success || !res.data) throw new Error("TTS failed");

      const audio = new Audio(res.data.audioUrl);
      await audio.play();
    } catch (e) {
      console.error(e);
      alert("تعذر تشغيل الصوت حاليًا.");
    }
  };

  const handleOrderAll = () => {
    if (!detectedDrugs.length) return;
    router.push(`/orders/new/by-drug`);
  };

  const handleAddAllToMyMeds = () => {
    if (!detectedDrugs.length) return;
    alert(`(تجريبي) تم إضافة ${detectedDrugs.length} دواء من الوصفة إلى قائمة أدويتك.`);
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
            مسح وصفة طبية (OCR)
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            التقط صورة لوصفة الطبيب وسيتم استخراج أسماء الأدوية ومحاولة التعرف عليها وترجمتها إلى العربية إن لزم الأمر.
          </p>
        </header>

        {/* كارد المسح */}
        <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 md:p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* معاينة الصورة */}
            <div className="w-full md:w-1/2">
              <div className="aspect-[4/3] rounded-2xl border border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-800">
                {previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewUrl}
                    title="معاينة الوصفة الطبية"
                    alt="معاينة الوصفة الطبية"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center text-slate-400 gap-2">
                    <Camera size={32} />
                    <p className="text-xs">
                      لم تقم بعد باختيار صورة للوصفة. التقط صورة واضحة أو اختر صورة من المعرض.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* أزرار المسح */}
            <div className="w-full md:w-1/2 space-y-3">
              <p className="text-xs text-slate-600 dark:text-slate-300">
                يفضّل أن تكون الوصفة مسطحة والإضاءة جيدة، مع تركيز واضح على أسماء الأدوية.
              </p>

              <div className="space-y-2">
                {/* زر فتح الكاميرا */}
                <Button
                  type="button"
                  onClick={() => setShowCamera(true)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-slate-900 text-white px-4 py-2 text-sm cursor-pointer hover:bg-slate-800 transition"
                  title="التقاط صورة لوصفة طبية"
                >
                  <Camera size={18} />
                  <span>التقاط صورة لوصفة طبية</span>
                </Button>

                <label
                  htmlFor="prescriptionGallery"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white text-slate-900 px-4 py-2 text-sm cursor-pointer hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 transition"
                  title="اختيار صورة للوصفة من المعرض"
                >
                  <ImageIcon size={18} />
                  <span>اختيار صورة من المعرض</span>
                </label>
                <input
                  id="prescriptionGallery"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleInputChange}
                />

                {/* عرض الكاميرا */}
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
                  <span>جارٍ قراءة الوصفة وتحليل النص…</span>
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
                  <span>مسح وصفة جديدة</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* نتيجة الأدوية المستخرجة */}
        {detectedDrugs.length > 0 && step === "done" && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                الأدوية المستخرجة من الوصفة
              </h2>
              <button
                type="button"
                onClick={handleSpeak}
                className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-2xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Volume2 size={16} />
                <span>قراءة الأدوية صوتيًا</span>
              </button>
            </div>

            <div className="grid gap-3">
              {detectedDrugs.map((drug) => (
                <div
                  key={drug.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-sm flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                      {drug.name}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      {drug.composition}
                    </p>
                  </div>
                  <Button
                    className="px-3 py-1 text-xs"
                    onClick={() => router.push(`/orders/new/by-drug`)}
                  >
                    طلب هذا الدواء
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              <Button className="px-4 py-2 text-sm" onClick={handleOrderAll}>
                طلب جميع الأدوية دفعة واحدة
              </Button>
              <Button
                className="px-4 py-2 text-sm bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-100"
                onClick={handleAddAllToMyMeds}
              >
                إضافة الأدوية إلى أدويتي
              </Button>
            </div>
          </section>
        )}

        {/* النص الخام */}
        {rawText && (
          <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2">
              النص المستخرج من الوصفة (للمراجعة)
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
