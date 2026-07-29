"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, MapPin } from "lucide-react";
import Button from "@/components/ui/button";
import { patientSearchApi, PharmacyStockByDrugItem } from "@/lib/api";

interface PageProps {
  params: { drugId: string , customDrugId: string };
}

export default function PharmaciesByDrugPage({ params }: PageProps) {
  const router = useRouter();
  const drugId = Number(params.drugId);
  const customDrugId = Number(params.customDrugId);

  const [items, setItems] = useState<PharmacyStockByDrugItem[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!Number.isFinite(drugId || customDrugId)) {
        setError("معرّف الدواء غير صحيح");
        setLoading(false);
        return;
      }

      const res = await patientSearchApi.pharmaciesByDrug(drugId);

      if (!res.success) {
        setError(res.error || "فشل تحميل الصيدليات");
        setLoading(false);
        return;
      }

      setItems(res.data ?? []);
      setLoading(false);
    })();
  }, [drugId, customDrugId]);

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    return items.filter((i) =>
      i.pharmacy.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [items, query]);

  if (!loading && error) {
    return (
      <div className="p-10 text-center text-rose-600">{error}</div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <header className="flex items-center gap-3">
          <button onClick={() => router.back()}>
            <ChevronLeft />
          </button>
          <h1 className="text-xl font-bold">اختر الصيدلية</h1>
        </header>

        {/* Search */}
        <input
          placeholder="بحث باسم الصيدلية..."
          className="w-full p-3 rounded-xl border"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {/* List */}
        {filtered.map((item) => (
          <div
            key={item.pharmacy.id}
            className="bg-white rounded-2xl p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{item.pharmacy.name}</p>
              <p className="text-xs flex items-center gap-1">
                <MapPin size={12} /> {item.pharmacy.address}
              </p>
              <p className="text-xs">الكمية: {item.quantity}</p>
            </div>

            <Button
              onClick={() => {
                const qp = new URLSearchParams();
                qp.set("pharmacyId", String(item.pharmacy.id));
                 qp.set("drugId", String(drugId));
                  qp.set("customDrugId", String(customDrugId));
                router.push(`/orders/new/confirm?${qp.toString()}`);
              }}
            >
              اختيار
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
