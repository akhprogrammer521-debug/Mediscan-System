"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import { Pill, Clock } from "lucide-react";
import { medicationLogApi, medicationsApi, PatientMedication, MedicationSchedule } from "@/lib/api";

type FilterStatus = "ACTIVE" | "PAUSED" | "STOPPED" | "ALL";
type WeekDay = "SUN" | "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT";

const weekDayMap: WeekDay[] = [
  "SUN",
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
];

function isScheduleForToday(days?: string) {
  if (!days) return true; 
  const todayKey = weekDayMap[new Date().getDay()];
  return days.split(",").includes(todayKey);
}


function countTakenToday(logs: { date: string | Date }[] = []) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return logs.filter((l) => {
    const d = new Date(l.date);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  }).length;
}

export default function MyMedicinesPage() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("ACTIVE");
  const [medicines, setMedicines] = useState<PatientMedication[]>([]);
  const [loading, setLoading] = useState(true);
  const [takenMap, setTakenMap] = useState<Record<number, boolean>>({});


  const handleMarkTaken = async (medicine: PatientMedication) => {
    const firstSchedule = medicine.schedules[0];
    if (!firstSchedule || typeof firstSchedule.id !== "number") return;

    await medicationLogApi.markTaken(firstSchedule.id);
    const res = await medicationsApi.getAll();
    if (res.success && res.data) {
      setMedicines(res.data);
    }
  };

  useEffect(() => {
    const load = async () => {
      const res = await medicationsApi.getAll();
      if (res.success && res.data) {
        setMedicines(res.data);
      }
      setLoading(false);
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    return medicines.filter((m) => {
      const matchStatus =
        statusFilter === "ALL" ? true : m.status === statusFilter;

      const matchSearch = m.name
        .toLowerCase()
        .includes(search.trim().toLowerCase());

      return matchStatus && matchSearch;
    });
  }, [medicines, statusFilter, search]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        جاري تحميل الأدوية...
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-slate-50 dark:bg-slate-900 px-4 py-6"
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">الأدوية الخاصة بي</h1>
            <p className="text-sm text-slate-500">
              إدارة وجدولة جميع أدويتك
            </p>
          </div>
          <Button onClick={() => router.push("/my-medicines/add")}>
            + إضافة دواء
          </Button>
        </div>

        {/* Search */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث عن دواء..."
          className="w-full rounded-2xl px-4 py-2 border bg-white dark:bg-slate-900"
        />

        {/* Filters */}
        <div className="flex gap-2 text-sm">
          {[
            { label: "نشطة", value: "ACTIVE" },
            { label: "موقوفة مؤقتاً", value: "PAUSED" },
            { label: "موقوفة", value: "STOPPED" },
            { label: "الكل", value: "ALL" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value as FilterStatus)}
              className={`px-3 py-1.5 rounded-full border ${statusFilter === f.value
                ? "bg-primary-50 border-primary-500 text-primary-700"
                : "border-slate-300 text-slate-600"
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((med) => {
            const firstSchedule = med.schedules[0] as
  | (MedicationSchedule & {
      logs?: { date: string | Date }[];
      days?: string;
    })
  | undefined;

const logs = firstSchedule?.logs ?? [];
const takenCount = countTakenToday(logs);
const takenToday = takenMap[med.id] ?? takenCount > 0;
const isTodayAllowed = isScheduleForToday(firstSchedule?.days);

            return (
              <div
                key={med.id}
                className="rounded-3xl bg-white dark:bg-slate-900 border p-4 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-2">
                    <div className="h-10 w-10 rounded-2xl bg-blue-50 flex items-center justify-center">
                      <Pill className="text-blue-600" />
                    </div>
                    <div>
                      <h2 className="font-semibold">{med.name}</h2>
                      <p className="text-xs text-slate-500">{med.dosage}</p>
                    </div>
                  </div>

                  <span className="text-[11px] px-2 py-1 rounded-full border">
                    {med.status}
                  </span>
                </div>

                <div className="text-xs flex justify-between text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {med.schedules.length} مرات يومياً
                  </span>
                  {med.schedules[0] && (
                    <span>الجرعة القادمة: {med.schedules[0].time}</span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <input
  type="checkbox"
  checked={takenToday}
  disabled={!isTodayAllowed}
  onChange={async () => {
    if (takenToday || !isTodayAllowed) return;

    const firstSchedule = med.schedules[0];
    if (!firstSchedule) return;

    setTakenMap((prev) => ({
      ...prev,
      [med.id]: true,
    }));

    try {
      await medicationLogApi.markTaken(firstSchedule.id);

      const res = await medicationsApi.getAll();
      if (res.success && res.data) {
        setMedicines(res.data);
      }
    } catch {
      setTakenMap((prev) => ({
        ...prev,
        [med.id]: false,
      }));
    }
  }}
/>


                  {!isTodayAllowed && (
  <span className="text-[11px] text-amber-600">
    (لا توجد جرعة مجدولة اليوم)
  </span>
)}

                </div>


                {med.notes && (
                  <p className="text-xs text-slate-500">{med.notes}</p>
                )}

                <span
                  className={`text-[11px] px-2.5 py-1 rounded-full border ${med.status === "ACTIVE"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : med.status === "PAUSED"
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-rose-50 text-rose-700 border-rose-200"
                    }`}
                >
                  {med.status === "ACTIVE"
                    ? "نشط"
                    : med.status === "PAUSED"
                      ? "موقوف مؤقتاً"
                      : "موقوف"}
                </span>


                <div className="flex justify-between">
                  {med.schedules[0] && (
                    <Button
                      type="button"
                      onClick={() => handleMarkTaken(med)}
                      disabled={takenToday || !isTodayAllowed}
                      className="w-full py-2 text-sm mt-1"
                    >
                      {takenToday
                        ? `تم تسجيل الجرعة (${takenCount}) ✔`
                        : "تسجيل الجرعة الآن"}
                    </Button>



                  )}

                  <button
                    onClick={() => router.push(`/my-medicines/${med.id}`)}
                    className="text-xs text-primary-600"
                  >
                    عرض التفاصيل
                  </button>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <p className="col-span-full text-center text-slate-500">
              لا توجد أدوية مطابقة
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
