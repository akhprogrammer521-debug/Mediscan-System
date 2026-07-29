"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Store, Search, ChevronLeft } from "lucide-react";

import Button from "@/components/ui/button";
import { pharmaciesApi, Pharmacy } from "@/lib/api";

type UserLocation = { lat: number; lng: number };

function toKmDistance(a: UserLocation, b: UserLocation): number {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return R * c;
}

export default function ByPharmacySearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      () => null
    );
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      const res = await pharmaciesApi.getAll();
      if (!res.success) {
        setError(res.error || "فشل تحميل الصيدليات");
        setLoading(false);
        return;
      }
      setPharmacies(res.data ?? []);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    const list = pharmacies
      .map((p) => {
        const lat = p.latitude ?? null;
        const lng = p.longitude ?? null;
        const distanceKm =
          userLocation && lat != null && lng != null
            ? toKmDistance(userLocation, { lat, lng })
            : null;
        return { ...p, distanceKm };
      })
      .sort((a, b) => {
        if (a.distanceKm != null && b.distanceKm != null)
          return a.distanceKm - b.distanceKm;
        return (a.name ?? "").localeCompare(b.name ?? "");
      });

    if (!query.trim()) return list;
    const q = query.toLowerCase();
    return list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.address ?? "").toLowerCase().includes(q)
    );
  }, [query, pharmacies, userLocation]);

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
                اختيار صيدلية
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                اختر صيدلية أولاً، ثم حدد الدواء المتوفر لديها.
              </p>
            </div>
          </div>
        </header>

        {/* Search */}
        <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-3">
          <label
            htmlFor="pharmacy-search"
            className="block text-xs font-medium text-slate-700 dark:text-slate-200"
          >
            بحث عن صيدلية
          </label>
          <div className="relative">
            <input
              id="pharmacy-search"
              title="بحث عن صيدلية"
              aria-label="بحث عن صيدلية"
              placeholder="اكتب اسم الصيدلية أو العنوان..."
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
              جارٍ تحميل الصيدليات…
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

          {!loading && !error && filtered.map((pharmacy) => (
            <button
              key={pharmacy.id}
              type="button"
              onClick={() => router.push(`/orders/new/by-pharmacy/${pharmacy.id}`)}
              className="w-full text-right rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md hover:border-primary-400 dark:hover:border-primary-500 transition flex flex-col gap-2"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="h-10 w-10 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                    <Store className="text-emerald-600 dark:text-emerald-300" size={20} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                      {pharmacy.name}
                    </p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-2">
                      {pharmacy.distanceKm != null && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={12} />
                          على بعد {pharmacy.distanceKm.toFixed(1)} كم
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1">
                        رقم الهاتف: {pharmacy.phone}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300">
                {pharmacy.address}
              </p>
            </button>
          ))}

          {!loading && !error && filtered.length === 0 && (
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-6">
              لا توجد صيدليات مطابقة لبحثك.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
