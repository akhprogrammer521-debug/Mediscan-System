"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PharmacyCard from "@/components/map/PharmacyCard";
import Button from "@/components/ui/button";
import { Pill, ArrowRight } from "lucide-react";
import { pharmaciesApi, patientSearchApi } from "@/lib/api";
import type { Pharmacy as ApiPharmacy, PharmacyStockItem } from "@/lib/api";
import type { Pharmacy as UiPharmacy, PharmacyDrug } from "@/types/pharmacy";

function toUiPharmacy(p: ApiPharmacy, drugs: UiPharmacy["drugs"] = []): UiPharmacy {
  return {
    id: String(p.id),
    name: p.name,
    address: p.address,
    phone: p.phone,
    lat: p.latitude ?? 0,
    lng: p.longitude ?? 0,
    services: [],
    drugs,
    distanceKm: undefined,
  } as UiPharmacy;
}

export default function PharmacyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const pharmacyId = String(params?.pharmacyId ?? "");

  const [loading, setLoading] = useState(true);
  const [pharmacy, setPharmacy] = useState<UiPharmacy | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);

      const pid = Number(pharmacyId);
      const pRes = await pharmaciesApi.getOne(pid);
      const dRes = await patientSearchApi.drugsByPharmacy(pid);

      if (pRes.success && pRes.data) {
        const stock: PharmacyStockItem[] = dRes.success && dRes.data ? dRes.data : [];

        // تحويل مخزون الصيدلية إلى نفس شكل drugs الذي كانت تستخدمه MOCK
        const uiDrugs: PharmacyDrug[] = stock
          .map((s): PharmacyDrug | null => {
            if (s.drug) {
              return {
                id: String(s.drug.id),
                name: s.drug.name,
                strength: s.drug.strength,
                available: s.quantity > 0,
                // price غير موجود → نتركه undefined
              };
            }

            if (s.customDrug) {
              return {
                id: String(s.customDrug.id),
                name: s.customDrug.name,
                strength: s.customDrug.strength ?? "",
                available: s.quantity > 0,
              };
            }

            return null;
          })
          .filter((d): d is PharmacyDrug => d !== null);


        setPharmacy(toUiPharmacy(pRes.data, uiDrugs));
      } else {
        setPharmacy(null);
      }

      setLoading(false);
    })();
  }, [pharmacyId]);

  const uiPharmacy = useMemo(() => pharmacy, [pharmacy]);

  if (loading) {
    return (
      <div dir="rtl" className="min-h-screen flex items-center justify-center">
        جاري التحميل...
      </div>
    );
  }

  if (!uiPharmacy) {
    return (
      <div dir="rtl" className="min-h-screen flex items-center justify-center text-sm text-rose-600">
        لم يتم العثور على الصيدلية المطلوبة.
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen flex flex-col gap-6 bg-slate-50 dark:bg-slate-900 p-4">
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-full border border-slate-300 dark:border-slate-700 p-1 text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            title="الرجوع"
          >
            <ArrowRight size={16} />
          </button>
          <div>
            <h1 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100">
              {uiPharmacy.name}
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-300">تفاصيل الصيدلية والأدوية المتوفرة.</p>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1.1fr)] gap-6 items-start">
        <div className="space-y-3">
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4">
            <PharmacyCard pharmacy={uiPharmacy} showDistance />
          </div>
        </div>

        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-8 w-8 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-700 dark:text-primary-300">
              <Pill size={18} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                الأدوية المتوفرة في هذه الصيدلية
              </h2>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">اختر دواء لطلبه مباشرة.</p>
            </div>
          </div>

          <div className="space-y-2">
            {uiPharmacy.drugs?.map((drug) => (
              <div
                key={drug.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-700 px-3 py-2 flex items-center justify-between gap-3 text-xs"
              >
                <div key={drug.id} className="rounded-2xl border p-3 text-xs">
                  <p className="font-medium">{drug.name}</p>
                  <p className="text-[11px] text-slate-500">{drug.strength || "—"}</p>

                  {!drug.available && (
                    <p className="text-[11px] text-rose-600">غير متوفر حالياً</p>
                  )}
                </div>

                {/* ❗ بدون size prop */}
                <Button
                  className="px-3 py-1 text-[11px]"
                  onClick={() =>
                    router.push(`/orders/new/confirm?pharmacyId=${uiPharmacy.id}&drugId=${encodeURIComponent(drug.id)}`)
                  }
                >
                  طلب هذا الدواء
                </Button>
              </div>
            ))}

            {(!uiPharmacy.drugs || uiPharmacy.drugs.length === 0) && (
              <p className="text-xs text-slate-500">لا يوجد أدوية متاحة حالياً.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
