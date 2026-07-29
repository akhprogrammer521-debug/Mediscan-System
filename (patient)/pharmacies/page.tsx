"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PharmaciesMap from "@/components/map/PharmaciesMap";
import { pharmaciesApi } from "@/lib/api";
import type { Pharmacy as UiPharmacy } from "@/types/pharmacy";
import type { Pharmacy as ApiPharmacy } from "@/lib/api";

/* ======================
   حساب المسافة بالكيلومتر
====================== */
function distanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toUiPharmacy(
  p: ApiPharmacy,
  userLocation?: { lat: number; lng: number }
): UiPharmacy {
  const dist =
    userLocation && p.latitude != null && p.longitude != null
      ? distanceKm(
          userLocation.lat,
          userLocation.lng,
          p.latitude,
          p.longitude
        )
      : undefined;

  return {
    id: String(p.id),
    name: p.name,
    address: p.address,
    phone: p.phone,
    lat: p.latitude ?? 0,
    lng: p.longitude ?? 0,
    services: [],
    drugs: [],
    distanceKm: dist ? Number(dist.toFixed(1)) : undefined,
  };
}

export default function PharmaciesPage() {
  const [pharmacies, setPharmacies] = useState<UiPharmacy[]>([]);
  const [userLocation, setUserLocation] =
    useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      () => setUserLocation({ lat: 33.5138, lng: 36.2765 })
    );
  }, []);

  useEffect(() => {
    if (!userLocation) return;

    (async () => {
      const res = await pharmaciesApi.getAll();
      if (res.success && res.data) {
        setPharmacies(res.data.map((p) => toUiPharmacy(p, userLocation)));
      }
    })();
  }, [userLocation]);

  return (
    <div dir="rtl" className="min-h-screen p-4 md:p-8 bg-slate-50 dark:bg-slate-900 space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
        الصيدليات القريبة
      </h1>

      <div className="w-full h-[400px] rounded-3xl overflow-hidden shadow border border-slate-200 dark:border-slate-700">
        {userLocation && (
          <PharmaciesMap pharmacies={pharmacies} userLocation={userLocation} />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pharmacies.map((ph) => (
          <Link
            key={ph.id}
            href={`/pharmacies/${ph.id}`}
            className="block p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-slate-900 dark:text-white font-semibold">
                {ph.name}
              </h3>
              <span className="text-xs text-blue-600 dark:text-blue-400">
                {ph.distanceKm ? `${ph.distanceKm} كم` : "—"}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              {ph.address}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
