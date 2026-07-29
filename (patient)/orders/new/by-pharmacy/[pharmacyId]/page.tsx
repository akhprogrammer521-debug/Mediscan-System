"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Pill, Store, Search, ChevronLeft, MapPin } from "lucide-react";
import Button from "@/components/ui/button";
import { pharmaciesApi, patientSearchApi, Pharmacy } from "@/lib/api";

interface PageProps {
  params: { pharmacyId: string };
}

/**
 * هذا هو الشكل الحقيقي المتوقع من API بعد تعديل الباك اند:
 * - drug ممكن يكون null
 * - customDrug ممكن يكون null
 */
type ApiStockItem = {
  quantity: number;
  drug: {
    id: number;
    name: string;
    strength: string;
    description?: string | null;
  } | null;
  customDrug: {
    id: number;
    name: string;
    strength: string;
  } | null;
};

type NormalizedDrug = {
  key: string; // "g-1" أو "c-5"
  kind: "GENERAL" | "CUSTOM";
  id: number;
  name: string;
  strength: string;
  description?: string | null;
  quantity: number;
};

export default function PharmacyDrugsPage({ params }: PageProps) {
  const router = useRouter();
  const pharmacyId = Number(params.pharmacyId);

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);
  const [items, setItems] = useState<ApiStockItem[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!Number.isFinite(pharmacyId) || pharmacyId <= 0) {
        setError("معرّف الصيدلية غير صحيح");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const [phRes, itemsRes] = await Promise.all([
        pharmaciesApi.getOne(pharmacyId),
        patientSearchApi.drugsByPharmacy(pharmacyId),
      ]);

      if (!phRes.success) {
        setError(phRes.error || "فشل تحميل معلومات الصيدلية");
        setLoading(false);
        return;
      }

      if (!itemsRes.success) {
        setError(itemsRes.error || "فشل تحميل أدوية الصيدلية");
        setLoading(false);
        return;
      }

      setPharmacy(phRes.data ?? null);

      // مهم: نضمن إن البيانات مطابقة لشكلنا (بدون any)
      const data = (itemsRes.data ?? []) as unknown as ApiStockItem[];
      setItems(data);

      setLoading(false);
    })();
  }, [pharmacyId]);

  const normalized: NormalizedDrug[] = useMemo(() => {
    return (items ?? [])
      .map((it): NormalizedDrug | null => {
        if (it.drug) {
          return {
            key: `g-${it.drug.id}`,
            kind: "GENERAL",
            id: it.drug.id,
            name: it.drug.name,
            strength: it.drug.strength,
            description: it.drug.description ?? null,
            quantity: it.quantity,
          };
        }

        if (it.customDrug) {
          return {
            key: `c-${it.customDrug.id}`,
            kind: "CUSTOM",
            id: it.customDrug.id,
            name: it.customDrug.name,
            strength: it.customDrug.strength,
            description: null,
            quantity: it.quantity,
          };
        }

        return null;
      })
      .filter((x): x is NormalizedDrug => x !== null);
  }, [items]);

  const filtered = useMemo(() => {
    if (!query.trim()) return normalized;
    const q = query.toLowerCase();

    return normalized.filter((d) => {
      const name = d.name.toLowerCase();
      const strength = d.strength.toLowerCase();
      const desc = (d.description ?? "").toLowerCase();
      return name.includes(q) || strength.includes(q) || desc.includes(q);
    });
  }, [normalized, query]);

  const selectedDrug = useMemo(() => {
    if (!selectedKey) return null;
    return normalized.find((x) => x.key === selectedKey) ?? null;
  }, [normalized, selectedKey]);

  const handleContinue = () => {
    if (!selectedDrug || !pharmacy) return;

    const qp = new URLSearchParams();
    qp.set("pharmacyId", String(pharmacy.id));

    // إذا كان الدواء عام => drugId
    // إذا كان خاص => customDrugId
    if (selectedDrug.kind === "GENERAL") {
      qp.set("drugId", String(selectedDrug.id));
    } else {
      qp.set("customDrugId", String(selectedDrug.id));
    }

    qp.set("drugName", selectedDrug.name);
    qp.set("strength", selectedDrug.strength);

    router.push(`/orders/new/confirm?${qp.toString()}`);
  };

  if (!loading && (error || !pharmacy)) {
    return (
      <div dir="rtl" className="min-h-screen bg-slate-50 dark:bg-slate-900 px-4 py-10">
        <div className="max-w-xl mx-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 text-center">
          <p className="text-sm text-rose-600 dark:text-rose-300">
            {error || "لم يتم العثور على الصيدلية"}
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200"
            >
              رجوع
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 dark:bg-slate-900 px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="h-9 w-9 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800"
              title="رجوع"
            >
              <ChevronLeft size={18} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50">
                أدوية {pharmacy?.name}
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                اختر الدواء الذي تريد طلبه من هذه الصيدلية.
              </p>
            </div>
          </div>
        </header>

        {/* Pharmacy summary */}
        <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex items-center gap-3">
          <span className="h-10 w-10 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
            <Store className="text-emerald-600 dark:text-emerald-300" size={20} />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              {pharmacy?.name}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
              <span className="inline-flex items-center gap-1">
                <MapPin size={12} />
                {pharmacy?.address}
              </span>
            </p>
          </div>
        </section>

        {/* Search */}
        <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-3">
          <label
            htmlFor="drug-search-pharmacy"
            className="block text-xs font-medium text-slate-700 dark:text-slate-200"
          >
            بحث عن دواء في هذه الصيدلية
          </label>
          <div className="relative">
            <input
              id="drug-search-pharmacy"
              title="بحث عن دواء"
              aria-label="بحث عن دواء"
              placeholder="اكتب اسم الدواء..."
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>
        </section>

        {/* Drugs list */}
        <section className="space-y-3">
          {loading && (
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-6">
              جارٍ تحميل الأدوية…
            </p>
          )}

          {!loading &&
            filtered.map((drug) => {
              const isSelected = selectedKey === drug.key;

              return (
                <button
                  key={drug.key}
                  type="button"
                  onClick={() => setSelectedKey(drug.key)}
                  className={`w-full text-right rounded-3xl border p-4 shadow-sm flex flex-col gap-2 transition ${
                    isSelected
                      ? "border-primary-500 bg-primary-50/70 dark:bg-primary-900/20"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary-400 dark:hover:border-primary-500"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="h-9 w-9 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                        <Pill className="text-blue-600 dark:text-blue-300" size={18} />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                          {drug.name}{" "}
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {drug.strength}
                          </span>
                        </p>

                        {drug.description && (
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-1">
                            {drug.description}
                          </p>
                        )}

                        {drug.kind === "CUSTOM" && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            (دواء خاص بالصيدلية)
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right text-xs">
                      <p className="font-semibold text-slate-900 dark:text-slate-50">
                        الكمية: {drug.quantity}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}

          {!loading && filtered.length === 0 && (
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-6">
              لا توجد أدوية مطابقة لبحثك في هذه الصيدلية.
            </p>
          )}
        </section>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            رجوع
          </button>
          <Button
            type="button"
            className="px-6 py-2 text-sm"
            onClick={handleContinue}
            disabled={!selectedDrug}
          >
            متابعة لتأكيد الطلب
          </Button>
        </div>
      </div>
    </div>
  );
}
