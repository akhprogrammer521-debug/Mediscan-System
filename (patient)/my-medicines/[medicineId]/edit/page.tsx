"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import { Pill, Clock, Plus, ChevronRight } from "lucide-react";
import { medicationsApi } from "@/lib/api";
import type { MedicationStatus } from "@/lib/api";

type WeekDay = "SUN" | "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT";

const weekDays: { key: WeekDay; label: string }[] = [
  { key: "SUN", label: "الأحد" },
  { key: "MON", label: "الاثنين" },
  { key: "TUE", label: "الثلاثاء" },
  { key: "WED", label: "الأربعاء" },
  { key: "THU", label: "الخميس" },
  { key: "FRI", label: "الجمعة" },
  { key: "SAT", label: "السبت" },
];

export default function EditMedicinePage() {
  const { medicineId } = useParams<{ medicineId: string }>();
  const router = useRouter();

  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<MedicationStatus>("ACTIVE");

  const [newTime, setNewTime] = useState("");
  const [selectedDays, setSelectedDays] = useState<WeekDay[]>([]);

  const [schedules, setSchedules] = useState<
    { time: string; days: WeekDay[] }[]
  >([]);

  /* ===== Load medication ===== */
  useEffect(() => {
    const load = async () => {
      const res = await medicationsApi.getOne(Number(medicineId));
      if (res.success && res.data) {
        setName(res.data.name);
        setDosage(res.data.dosage);
        setNotes(res.data.notes ?? "");
        setStatus(res.data.status);

        setSchedules(
          res.data.schedules.map((s) => ({
            time: s.time,
            days: s.days.split(",") as WeekDay[],
          }))
        );
      }
    };
    load();
  }, [medicineId]);

  /* ===== Add schedule ===== */
  const addSchedule = () => {
    if (!newTime || selectedDays.length === 0) return;

    setSchedules((prev) => [
      ...prev,
      { time: newTime, days: selectedDays },
    ]);

    setNewTime("");
    setSelectedDays([]);
  };

  /* ===== Submit ===== */
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    await medicationsApi.update(Number(medicineId), {
      name,
      dosage,
      notes,
      status,
      schedules,
    });

    router.push(`/my-medicines/${medicineId}`);
  };

  return (
    <div dir="rtl" className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex items-center gap-1 text-sm text-slate-600"
      >
        <ChevronRight size={18} />
        رجوع
      </button>

      <form
        onSubmit={submit}
        className="bg-white dark:bg-slate-900 rounded-3xl border p-6 space-y-6"
      >
        <header className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center">
            <Pill className="text-blue-600" />
          </div>
          <h1 className="text-xl font-bold">تعديل الدواء</h1>
        </header>

        <Field label="اسم الدواء">
          <input value={name} onChange={(e) => setName(e.target.value)} className="input-med" />
        </Field>

        <Field label="الجرعة">
          <input value={dosage} onChange={(e) => setDosage(e.target.value)} className="input-med" />
        </Field>

        <Field label="الحالة">
          <div className="flex gap-2">
            {(["ACTIVE", "PAUSED", "STOPPED"] as MedicationStatus[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={`px-3 py-1.5 rounded-full border text-xs ${
                  status === s
                    ? "bg-primary-50 border-primary-500 text-primary-700"
                    : "border-slate-300 text-slate-600"
                }`}
              >
                {s === "ACTIVE" ? "نشط" : s === "PAUSED" ? "موقوف مؤقتًا" : "موقوف"}
              </button>
            ))}
          </div>
        </Field>

        <Field label="ملاحظات">
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="input-med min-h-[90px]" />
        </Field>

        {/* ===== Schedules ===== */}
        <Field label="جدولة الجرعات">
          <div className="flex gap-2">
            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="input-med"
            />
            <button type="button" onClick={addSchedule} className="px-3 rounded-xl border flex items-center gap-1 text-sm">
              <Plus size={14} /> إضافة
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {weekDays.map((d) => (
              <button
                type="button"
                key={d.key}
                onClick={() =>
                  setSelectedDays((prev) =>
                    prev.includes(d.key)
                      ? prev.filter((x) => x !== d.key)
                      : [...prev, d.key]
                  )
                }
                className={`px-3 py-1 rounded-full border text-xs ${
                  selectedDays.includes(d.key)
                    ? "bg-blue-500 text-white"
                    : ""
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          <div className="space-y-3 mt-3">
  {schedules.map((s, index) => (
    <div
      key={index}
      className="flex flex-col gap-2 p-3 rounded-2xl border bg-slate-50"
    >
      {/* Time + Remove */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm">
          <Clock size={14} />
          <input
            type="time"
            value={s.time}
            onChange={(e) => {
              const updated = [...schedules];
              updated[index].time = e.target.value;
              setSchedules(updated);
            }}
            className="rounded-lg border px-2 py-1 text-sm"
          />
        </div>

        {/* Remove schedule */}
        <button
          type="button"
          onClick={() =>
            setSchedules((prev) => prev.filter((_, i) => i !== index))
          }
          className="text-xs text-rose-600 hover:underline"
        >
          إزالة
        </button>
      </div>

      {/* Days */}
      <div className="flex flex-wrap gap-2">
        {weekDays.map((d) => (
          <button
            key={d.key}
            type="button"
            onClick={() => {
              const updated = [...schedules];
              const days = updated[index].days;

              updated[index].days = days.includes(d.key)
                ? days.filter((x) => x !== d.key)
                : [...days, d.key];

              setSchedules(updated);
            }}
            className={`px-2.5 py-1 rounded-full text-xs border ${
              s.days.includes(d.key)
                ? "bg-blue-500 text-white border-blue-500"
                : "border-slate-300 text-slate-600"
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>
    </div>
  ))}
</div>

        </Field>

        <Button className="w-full">حفظ التعديلات</Button>
      </form>
    </div>
  );
}

/* ===== UI ===== */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}
