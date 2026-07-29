"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import { MapPin, ChevronLeft, Clock, Store } from "lucide-react";
import Button from "@/components/ui/button";
import { pharmaciesApi, publicDrugsApi, Pharmacy, PublicDrug } from "@/lib/api";

type LatLng = { lat: number; lng: number };

function toKmDistance(a: LatLng, b: LatLng): number {
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

export default function MapViewPage() {
  const router = useRouter();
  const params = useParams();

  const drugId = Number(params?.drugId as string);
  const pharmacyId = Number(params?.pharmacyId as string);

  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);
  const [drug, setDrug] = useState<PublicDrug | null>(null);

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
      if (Number.isFinite(pharmacyId) && pharmacyId > 0) {
        const res = await pharmaciesApi.getOne(pharmacyId);
        if (res.success) setPharmacy(res.data ?? null);
      }
      if (Number.isFinite(drugId) && drugId > 0) {
        const res = await publicDrugsApi.getOne(drugId);
        if (res.success) setDrug(res.data ?? null);
      }
    })();
  }, [pharmacyId, drugId]);

  const pharmacyPos: LatLng | null = useMemo(() => {
    const lat = pharmacy?.latitude ?? null;
    const lng = pharmacy?.longitude ?? null;
    if (lat == null || lng == null) return null;
    return { lat, lng };
  }, [pharmacy]);

  const distanceKm = useMemo(() => {
    if (!userLocation || !pharmacyPos) return null;
    return toKmDistance(userLocation, pharmacyPos);
  }, [userLocation, pharmacyPos]);

  const { isLoaded } = useJsApiLoader({
    id: "google-maps-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries: ["places"],
    language: "en",
    region: "US",
  });

  if (!pharmacyId || !Number.isFinite(pharmacyId)) {
    return (
      <div className="min-h-screen flex items-center justify-center text-rose-600 text-sm">
        معرّف الصيدلية غير صحيح.
      </div>
    );
  }

  if (pharmacy && !pharmacyPos) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600 dark:text-slate-300 text-sm">
        هذه الصيدلية لا تملك إحداثيات (Latitude/Longitude) لعرضها على الخريطة.
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 space-y-4">
      <header className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="h-9 w-9 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800"
          title="رجوع"
        >
          <ChevronLeft size={18} />
        </button>

        <h1 className="text-lg font-bold text-slate-900 dark:text-slate-50">
          موقع الصيدلية على الخريطة
        </h1>
      </header>

      <div className="w-full h-[420px] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow">
        {isLoaded && pharmacyPos ? (
          <GoogleMap
            center={pharmacyPos}
            zoom={15}
            mapContainerStyle={{ width: "100%", height: "100%" }}
            options={{ disableDefaultUI: true, zoomControl: true }}
          >
            {userLocation && (
              <Marker
                position={userLocation}
                // لا نحدد ألوان/ستايل كثيرة
              />
            )}

            <Marker position={pharmacyPos} />

            <InfoWindow position={pharmacyPos}>
              <div className="text-sm">
                <p className="font-semibold">{pharmacy?.name || "صيدلية"}</p>
                <p className="text-xs mt-1 text-slate-600 dark:text-slate-300">
                  {drug ? `${drug.name} ${drug.strength}` : ""}
                </p>
              </div>
            </InfoWindow>
          </GoogleMap>
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-slate-500">
            جارٍ تحميل الخريطة…
          </div>
        )}
      </div>

      <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 space-y-2">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">
          {pharmacy?.name || "الصيدلية"}
        </h2>

        {distanceKm != null && (
          <p className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1">
            <MapPin size={14} /> على بعد {distanceKm.toFixed(1)} كم
          </p>
        )}

        {pharmacy?.address && (
          <p className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1">
            <Store size={14} /> {pharmacy.address}
          </p>
        )}

        <p className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1">
          <Clock size={14} /> يمكنك طلب الدواء مباشرة من هذه الصيدلية.
        </p>

        <Button
          className="w-full mt-3 py-2 text-sm"
          onClick={() => {
            const qp = new URLSearchParams();
            if (Number.isFinite(drugId) && drugId > 0) {
              qp.set("drugId", String(drugId));
            }
            if (drug) {
              qp.set("drugName", drug.name);
              qp.set("strength", drug.strength);
            }
            qp.set("pharmacyId", String(pharmacyId));
            router.push(`/orders/new/confirm?${qp.toString()}`);
          }}
        >
          تأكيد طلب هذا الدواء من هذه الصيدلية
        </Button>
      </section>
    </div>
  );
}
