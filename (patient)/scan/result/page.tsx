"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Pill, Mic, Repeat } from "lucide-react";
import Button from "@/components/ui/button";
import { ocrApi } from "@/lib/api";
import type { DrugInfo } from "@/lib/api";

export default function DrugScanResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scanId = searchParams.get("scanId");

  const [drug, setDrug] = useState<DrugInfo | null>(null);
  const [loading, setLoading] = useState(true);

  /* =========================
     جلب النتيجة من الباك اند
  ========================= */
  useEffect(() => {
    if (!scanId) return;

    ocrApi.getScanResult(Number(scanId)).then((res) => {
      setLoading(false);

      if (!res.success || !res.data || !res.data.drug) {
        setDrug(null);
        return;
      }

      setDrug(res.data.drug);
    });
  }, [scanId]);

  if (!scanId) {
    return <div className="p-6 text-red-600">معرّف الفحص غير صالح</div>;
  }

  if (loading) {
    return <div className="p-6">جارٍ تحميل البيانات…</div>;
  }

  if (!drug) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        تم استخراج النص لكن لم يتم التعرف على الدواء
      </div>
    );
  }

  const speak = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "ar-SA";
    window.speechSynthesis.speak(utter);
  };

  const fullDrugText = `
${drug.name}.
المادة الفعالة: ${drug.composition}.
الاستطبابات: ${drug.indications}.
الجرعة: ${drug.dosage}.
التحذيرات: ${drug.warnings}.
الآثار الجانبية: ${drug.sideEffects}.
التداخلات: ${drug.interactions}.
فرط الجرعة: ${drug.overdose}.
  `;

  return (
    <div dir="rtl" className="min-h-screen p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Pill />
        نتيجة تحليل الدواء
      </h1>

      <div className="w-full max-w-2xl bg-white border rounded-3xl p-6 space-y-4">
        <h2 className="text-xl font-bold">{drug.name}</h2>

        <InfoBlock label="المادة الفعالة" value={drug.composition} />
        <InfoBlock label="الاستطبابات" value={drug.indications} />
        <InfoBlock label="مضادات الاستطباب" value={drug.contraindications} />
        <InfoBlock label="الجرعة" value={drug.dosage} />
        <InfoBlock label="تحذيرات" value={drug.warnings} highlight />
        <InfoBlock label="الآثار الجانبية" value={drug.sideEffects} />
        <InfoBlock label="التداخلات الدوائية" value={drug.interactions} />
        <InfoBlock label="فرط الجرعة" value={drug.overdose} />

        <Button onClick={() => speak(fullDrugText)} className="w-full gap-2">
          <Mic size={18} />
          الاستماع للمعلومات صوتيًا
        </Button>
      </div>

      <button
        onClick={() => router.push("/scan/drug")}
        className="mt-6 flex items-center gap-2 border px-4 py-2 rounded-xl"
      >
        <Repeat size={18} />
        مسح دواء جديد
      </button>
    </div>
  );
}

function InfoBlock({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className={`p-4 rounded-xl border ${highlight ? "bg-red-50" : "bg-slate-50"}`}>
      <h3 className="text-xs font-bold mb-1">{label}</h3>
      <p>{value}</p>
    </div>
  );
}
