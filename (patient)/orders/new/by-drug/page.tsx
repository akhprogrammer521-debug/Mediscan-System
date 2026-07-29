"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Pill, Search, ChevronLeft } from "lucide-react";

import Button from "@/components/ui/button";
import { publicDrugsApi, PublicDrug } from "@/lib/api";

export default function ByDrugSearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [drugs, setDrugs] = useState<PublicDrug[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      const res = await publicDrugsApi.getAll();
      if (!res.success) {
        setError(res.error || "فشل تحميل قائمة الأدوية");
        setLoading(false);
        return;
      }
      setDrugs(res.data ?? []);
      setLoading(false);
    })();
  }, []);

  const filteredDrugs = useMemo(() => {
    const list = drugs;
    if (!query.trim()) return list;
    const q = query.toLowerCase();
    return list.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        (d.description ?? "").toLowerCase().includes(q) ||
        d.strength.toLowerCase().includes(q)
    );
  }, [query, drugs]);

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-slate-50 dark:bg-slate-900 px-4 py-6"
    >
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
                اختيار الدواء
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                ابحث عن الدواء، ثم اختر الصيدلية التي توفره.
              </p>
            </div>
          </div>
        </header>

        {/* Search */}
        <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-3">
          <label
            htmlFor="drug-search"
            className="block text-xs font-medium text-slate-700 dark:text-slate-200"
          >
            بحث عن دواء
          </label>
          <div className="relative">
            <input
              id="drug-search"
              title="بحث عن دواء"
              aria-label="بحث عن دواء"
              placeholder="اكتب اسم الدواء أو الاستطباب..."
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

        {/* List */}
        <section className="space-y-3">
          {loading && (
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-6">
              جارٍ تحميل الأدوية…
            </p>
          )}

          {!loading && error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 dark:border-rose-900/40 dark:bg-rose-900/10 p-4 text-sm text-rose-700 dark:text-rose-300">
              {error}
              <div className="mt-3">
                <Button
                  className="text-xs px-3 py-2"
                  onClick={() => window.location.reload()}
                >
                  إعادة المحاولة
                </Button>
              </div>
            </div>
          )}

          {!loading && !error && filteredDrugs.map((drug) => (
            <button
              key={drug.id}
              type="button"
              onClick={() => router.push(`/orders/new/by-drug/${drug.id}`)}
              className="w-full text-right rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:shadow-md hover:border-primary-400 dark:hover:border-primary-600 transition flex flex-col gap-2"
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
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-1">
                        {drug.description}
                      </p>
                    )}
                  </div>
                </div>
                <span className="text-[11px] text-primary-600 dark:text-primary-300">
                  اختيار الصيدلية
                </span>
              </div>
            </button>
          ))}

          {!loading && !error && filteredDrugs.length === 0 && (
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-6">
              لا توجد أدوية مطابقة لبحثك.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
