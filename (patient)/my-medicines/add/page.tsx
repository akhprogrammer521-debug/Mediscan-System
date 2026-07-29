"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import { Pill, Clock, Plus, ChevronRight } from "lucide-react";
import { medicationsApi } from "@/lib/api";

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

export default function AddMedicinePage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [notes, setNotes] = useState("");

  const [newTime, setNewTime] = useState("");
  const [selectedDays, setSelectedDays] = useState<WeekDay[]>([]);
  const [schedules, setSchedules] = useState<
    { time: string; days: WeekDay[] }[]
  >([]);

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

    const res = await medicationsApi.create({
      name,
      dosage,
      notes,
      schedules,
    });

    if (res.success) router.push("/my-medicines");
  };

  return (
    <div dir="rtl" className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      {/* Back */}
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300"
      >
        <ChevronRight size={18} />
        رجوع
      </button>

      <form
        onSubmit={submit}
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-6"
      >
        {/* Header */}
        <header className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center">
            <Pill className="text-blue-600 dark:text-blue-300" />
          </div>
          <h1 className="text-xl font-bold">إضافة دواء جديد</h1>
        </header>

        <Field label="اسم الدواء">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-med"
            required
          />
        </Field>

        <Field label="الجرعة">
          <input
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            className="input-med"
            required
          />
        </Field>

        <Field label="ملاحظات (اختياري)">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="input-med min-h-[90px]"
          />
        </Field>

        {/* ===== Schedule ===== */}
        <Field label="جدولة الجرعات">
          <div className="flex flex-col gap-3">
            {/* Time */}
            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="input-med w-fit"
              required
            />

            {/* Days */}
            <div className="flex flex-wrap gap-2">
              {weekDays.map((d) => (
                <button
                  key={d.key}
                  type="button"
                  onClick={() =>
                    setSelectedDays((prev) =>
                      prev.includes(d.key)
                        ? prev.filter((x) => x !== d.key)
                        : [...prev, d.key]
                    )
                  }
                  className={`px-3 py-1 rounded-full border text-xs transition ${
                    selectedDays.includes(d.key)
                      ? "bg-blue-500 text-white border-blue-500"
                      : "border-slate-300 text-slate-600"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>

            {/* Add */}
            <button
              type="button"
              onClick={addSchedule}
              className="self-start px-3 py-1.5 rounded-xl border border-slate-300 text-sm flex items-center gap-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <Plus size={14} />
              إضافة الوقت
            </button>

            {/* Preview */}
            {schedules.length > 0 && (
              <div className="flex flex-col gap-1 text-xs">
                {schedules.map((s, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-2xl bg-slate-50 dark:bg-slate-800 px-3 py-2"
                  >
                    <Clock size={12} />
                    <strong>{s.time}</strong>
                    <span className="text-slate-500">
                      — {s.days.join("، ")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Field>

        <Button className="w-full">حفظ الدواء</Button>
      </form>
    </div>
  );
}

/* ===== UI ===== */
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>
      {children}
    </div>
  );
}
