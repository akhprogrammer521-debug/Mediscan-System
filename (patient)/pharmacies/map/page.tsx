"use client";

import { useEffect, useState } from "react";
import PharmaciesMap from "@/components/map/PharmaciesMap";
import PharmacyCard from "@/components/map/PharmacyCard";
import { pharmaciesApi } from "@/lib/api";
import { MapPin } from "lucide-react";
import type { Pharmacy as UiPharmacy } from "@/types/pharmacy";
import type { Pharmacy as ApiPharmacy } from "@/lib/api";

function toUiPharmacy(p: ApiPharmacy): UiPharmacy {
  return {
    id: String(p.id),
    name: p.name,
    address: p.address,
    phone: p.phone,
    lat: p.latitude ?? 0,
    lng: p.longitude ?? 0,
    services: [],
    drugs: [],
    distanceKm: undefined,
  } as UiPharmacy;
}

export default function PharmaciesMapPage() {
  const [pharmacies, setPharmacies] = useState<UiPharmacy[]>([]);

  useEffect(() => {
    (async () => {
      const res = await pharmaciesApi.getAll();
      if (res.success && res.data) {
        setPharmacies(res.data.map(toUiPharmacy));
      }
    })();
  }, []);

  return (
    <div dir="rtl" className="min-h-screen flex flex-col gap-6 bg-slate-50 dark:bg-slate-900 p-4">
      <header className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-700 dark:text-primary-300">
            <MapPin size={20} />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100">
              خريطة الصيدليات القريبة
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              استكشف الصيدليات المجاورة لك.
            </p>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)] gap-6 items-start">
        <div className="order-2 lg:order-1">
          <PharmaciesMap pharmacies={pharmacies} />
        </div>

        <aside className="order-1 lg:order-2 space-y-3 max-h-[460px] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
            الصيدليات المتاحة حالياً
          </h2>

          {pharmacies.map((ph) => (
            <div
              key={ph.id}
              className="border border-slate-200 dark:border-slate-700 rounded-2xl p-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              <PharmacyCard pharmacy={ph} />
            </div>
          ))}
        </aside>
      </section>
    </div>
  );
}
