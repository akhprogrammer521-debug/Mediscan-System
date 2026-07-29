"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Package, Store, MapPin, Upload, AlertTriangle } from "lucide-react";
import Button from "@/components/ui/button";
import {
  ordersApi,
  pharmaciesApi,
  publicDrugsApi,
  Pharmacy,
  PublicDrug,
} from "@/lib/api";

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("فشل قراءة الملف"));
    reader.readAsDataURL(file);
  });
}

export default function ConfirmOrderPage() {
  const router = useRouter();
  const sp = useSearchParams();

  const drugId = Number(sp.get("drugId") || "");
  const pharmacyId = Number(sp.get("pharmacyId") || "");
  const drugNameFromQs = sp.get("drugName") || "";
  const strengthFromQs = sp.get("strength") || "";

  const [drug, setDrug] = useState<PublicDrug | null>(null);
  const customDrugId = Number(sp.get("customDrugId") || "");
  const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [requiresPrescription, setRequiresPrescription] = useState(false);
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setError(null);

      // drug
      if (Number.isFinite(drugId) && drugId > 0) {
        const d = await publicDrugsApi.getOne(drugId);
        if (d.success) setDrug(d.data ?? null);
      }

      // pharmacy
      if (Number.isFinite(pharmacyId) && pharmacyId > 0) {
        const p = await pharmaciesApi.getOne(pharmacyId);
        if (p.success) setPharmacy(p.data ?? null);
      }
    })();
  }, [drugId, pharmacyId]);

  const titleDrugName = useMemo(() => {
    if (drug?.name) return `${drug.name} ${drug.strength}`.trim();
    return `${drugNameFromQs} ${strengthFromQs}`.trim() || "الدواء";
  }, [drug, drugNameFromQs, strengthFromQs]);

  const canSubmit =
    Number.isFinite(pharmacyId) &&
    pharmacyId > 0 &&
    titleDrugName.length > 0 &&
    quantity > 0 &&
    (!requiresPrescription || !!prescriptionFile);

  type CreateOrderPayload = {
    pharmacyId: number;
    quantity: number;
    requiresPrescription: boolean;
    prescriptionImage: string | null;
    drugId?: number;
    customDrugId?: number;
    drugName?: string;
  };

  const handleConfirm = async () => {
    if (!canSubmit) return;

    setSubmitting(true);
    setError(null);

    try {
      const prescriptionImage = prescriptionFile
        ? await fileToDataUrl(prescriptionFile)
        : null;

      const payload: CreateOrderPayload = {
        pharmacyId,
        quantity,
        requiresPrescription,
        prescriptionImage,
        drugName: titleDrugName,
      };

      // ✅ دواء عام
      if (Number.isFinite(drugId) && drugId > 0) {
        payload.drugId = drugId;
      }

      // ✅ دواء مخصص
      if (Number.isFinite(customDrugId) && customDrugId > 0) {
        payload.customDrugId = customDrugId;
      }

      const res = await ordersApi.create(payload);

      if (!res.success) {
        setError(res.error || "فشل إنشاء الطلب");
        return;
      }

      router.push("/orders/current");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "خطأ غير معروف";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 dark:bg-slate-900 px-4 py-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <header className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            تأكيد الطلب
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            راجع تفاصيل طلبك قبل الإرسال إلى الصيدلية.
          </p>
        </header>

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 dark:border-rose-900/40 dark:bg-rose-900/10 p-4 text-sm text-rose-700 dark:text-rose-300 flex items-start gap-2">
            <AlertTriangle size={18} className="mt-0.5" />
            <div>{error}</div>
          </div>
        )}

        {/* Summary Card */}
        <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-5">
          {/* Medicine */}
          <div className="flex items-start gap-3">
            <span className="h-10 w-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <Package className="text-slate-700 dark:text-slate-200" size={20} />
            </span>
            <div className="flex-1">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                {titleDrugName}
              </h2>
              {drug?.description && (
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-1">
                  {drug.description}
                </p>
              )}

              <div className="mt-3 flex items-center gap-3">
                <label className="text-xs text-slate-700 dark:text-slate-200">
                  الكمية
                </label>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                  className="w-24 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Pharmacy */}
          <div className="flex items-start gap-3">
            <span className="h-10 w-10 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
              <Store className="text-emerald-600 dark:text-emerald-300" size={20} />
            </span>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                {pharmacy?.name || "الصيدلية"}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
                <span className="inline-flex items-center gap-1">
                  <MapPin size={12} />
                  {pharmacy?.address || "—"}
                </span>
              </p>
            </div>
          </div>

          {/* Prescription */}
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 p-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <label className="inline-flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={requiresPrescription}
                  onChange={(e) => setRequiresPrescription(e.target.checked)}
                  className="h-4 w-4"
                />
                هذا الدواء يحتاج وصفة طبية
              </label>
            </div>

            {requiresPrescription && (
              <div className="space-y-2">
                <label className="text-xs text-slate-600 dark:text-slate-300">
                  ارفع صورة الوصفة (JPG/PNG)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPrescriptionFile(e.target.files?.[0] ?? null)}
                    className="block w-full text-xs"
                  />
                  <Upload size={16} className="text-slate-500" />
                </div>
                {requiresPrescription && !prescriptionFile && (
                  <p className="text-[11px] text-rose-600 dark:text-rose-300">
                    يجب إرفاق وصفة طبية لإرسال هذا الطلب.
                  </p>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            تعديل البيانات
          </button>
          <Button
            type="button"
            className="px-6 py-2 text-sm"
            onClick={handleConfirm}
            disabled={!canSubmit || submitting}
          >
            {submitting ? "جارٍ الإرسال…" : "تأكيد وإرسال الطلب"}
          </Button>
        </div>
      </div>
    </div>
  );
}
