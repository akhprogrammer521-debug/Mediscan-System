"use client";

import { useSearchParams } from "next/navigation";
import { useState, useMemo } from "react";
import { MOCK_DRUGS } from "@/data/mockDrugs";  
import type { DrugInfo } from "@/types/drug";
import Button from "@/components/ui/button";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

export default function CompareDrugsPage() {
  const searchParams = useSearchParams();
  const scannedDrugId = searchParams.get("drugId");

  const [drugAId, setDrugAId] = useState<string>(scannedDrugId || "");
  const [drugBId, setDrugBId] = useState<string>("");

  const drugA = useMemo(
    () => MOCK_DRUGS.find((d) => d.id === drugAId) || null,
    [drugAId],
  );
  const drugB = useMemo(
    () => MOCK_DRUGS.find((d) => d.id === drugBId) || null,
    [drugBId],
  );

  const hasInteractionRisk = useMemo(() => {
    if (!drugA || !drugB) return false;

    // منطق بسيط فقط كمثال: أي دواءين مختلفين => خطر تداخل محتمل
    return drugA.id !== drugB.id;
  }, [drugA, drugB]);

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 md:p-8 flex justify-center"
    >
      <div className="w-full max-w-4xl space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
            مقارنة دوائين
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            اختر دواءين لعرض معلوماتهما الجانبية والتداخلات والتحذيرات. هذه المعلومات تجريبية
            حاليًا، وسيتم ربطها لاحقًا بقاعدة بيانات طبية متخصصة.
          </p>
        </header>

        {/* اختيار الدوائين */}
        <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 md:p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <label
                htmlFor="drugA"
                className="block text-xs text-slate-700 dark:text-slate-200"
              >
                الدواء الأول
              </label>
              <select
                id="drugA"
                title="الدواء الأول"
                aria-label="الدواء الأول"
                value={drugAId}
                onChange={(e) => setDrugAId(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">اختر دواء</option>
                {MOCK_DRUGS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="drugB"
                className="block text-xs text-slate-700 dark:text-slate-200"
              >
                الدواء الثاني
              </label>
              <select
                id="drugB"
                title="الدواء الثاني"
                aria-label="الدواء الثاني"
                value={drugBId}
                onChange={(e) => setDrugBId(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">اختر دواء</option>
                {MOCK_DRUGS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              className="px-4 py-2 text-sm"
              onClick={() => {
                setDrugAId(scannedDrugId || "");
                setDrugBId("");
              }}
            >
              إعادة التعيين
            </Button>
          </div>
        </section>

        {/* نتيجة المقارنة */}
        {drugA && drugB && (
          <section className="space-y-4">
            <div
              className={`rounded-3xl border p-4 flex items-start gap-3 ${
                hasInteractionRisk
                  ? "border-rose-300 bg-rose-50 dark:border-rose-700 dark:bg-rose-950/40"
                  : "border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950/30"
              }`}
            >
              {hasInteractionRisk ? (
                <AlertTriangle
                  className="text-rose-600 dark:text-rose-300 mt-0.5"
                  size={20}
                />
              ) : (
                <CheckCircle2
                  className="text-emerald-600 dark:text-emerald-300 mt-0.5"
                  size={20}
                />
              )}
              <div className="text-sm">
                <p className="font-semibold mb-1">
                  {hasInteractionRisk
                    ? "تحذير من تناول الدواءين معًا"
                    : "لا يوجد تحذير واضح من تزامن الدواءين (وفق البيانات التجريبية)"}
                </p>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  هذه النتيجة تجريبية فقط لأغراض العرض، ولا تغني عن استشارة الطبيب أو الصيدلي
                  قبل استخدام أي دواءين معًا.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <CompareColumn title="الدواء الأول" drug={drugA} />
              <CompareColumn title="الدواء الثاني" drug={drugB} />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function CompareColumn({ title, drug }: { title: string; drug: DrugInfo }) {
  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 space-y-2">
      <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
        {title}: {drug.name}
      </h2>
      <InfoRow label="المادة الفعّالة" value={drug.activeIngredient} />
      <InfoRow label="الاستطبابات" value={drug.indications} />
      <InfoRow label="مضاد الاستطباب" value={drug.contraindications} />
      <InfoRow label="التحذيرات" value={drug.warnings} />
      <InfoRow label="التأثيرات الجانبية" value={drug.sideEffects} />
      <InfoRow label="التداخلات الدوائية" value={drug.interactions} />
      <InfoRow label="فرط الجرعة" value={drug.overdose} />
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-slate-100 dark:border-slate-800 pb-1 mb-1 last:border-b-0 last:mb-0 last:pb-0">
      <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-0.5">
        {label}
      </p>
      <p className="text-xs text-slate-800 dark:text-slate-200">{value}</p>
    </div>
  );
}
