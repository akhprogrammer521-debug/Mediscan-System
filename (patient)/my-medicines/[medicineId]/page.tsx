"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import {
  Pill,
  Clock,
  CalendarDays,
  ChevronRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { medicationsApi, medicationLogApi } from "@/lib/api";
import type { PatientMedication, MedicationSchedule, MedicationStatus } from "@/lib/api";

type UIStatus = "active" | "paused" | "stopped";

function mapStatus(status: MedicationStatus): UIStatus {
  if (status === "ACTIVE") return "active";
  if (status === "PAUSED") return "paused";
  return "stopped";
}

function statusLabel(ui: UIStatus) {
  if (ui === "active") return "دواء نشط";
  if (ui === "paused") return "موقوف مؤقتاً";
  return "موقوف نهائياً";
}

function statusColor(ui: UIStatus) {
  if (ui === "active") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (ui === "paused") return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-rose-50 text-rose-700 border-rose-200";
}

function splitDays(days: string) {
  // backend might store: "ALL" or "MON,TUE"
  if (!days) return ["غير محدد"];
  if (days === "ALL") return ["كل الأيام"];
  return days.split(",").map((d) => d.trim());
}

export default function MedicineDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const medicineId = String(params?.medicineId ?? "");

  const [loading, setLoading] = useState(true);
  const [medicine, setMedicine] = useState<PatientMedication | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError("");

      const res = await medicationsApi.getAll();
      if (!mounted) return;

      if (!res.success) {
        setError(res.error || "فشل تحميل الدواء");
        setLoading(false);
        return;
      }

      const list = res.data ?? [];
      const found = list.find((m) => String(m.id) === medicineId) ?? null;
      setMedicine(found);
      setLoading(false);
    };

    if (medicineId) load();

    return () => {
      mounted = false;
    };
  }, [medicineId]);

  const uiStatus = useMemo(() => {
    if (!medicine) return "active" as UIStatus;
    return mapStatus(medicine.status);
  }, [medicine]);

  const scheduleView = useMemo(() => {
    if (!medicine) return [];
    // هنا نضيف days للعرض + لا نستخدم takenToday لأنه غير موجود من API
    return medicine.schedules.map((s: MedicationSchedule) => ({
      id: s.id,
      time: s.time,
      days: splitDays((s as unknown as { days?: string }).days ?? "ALL"),
    }));
  }, [medicine]);

  if (loading) {
    return (
      <div
        dir="rtl"
        className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900"
      >
        <p className="text-sm text-slate-600 dark:text-slate-300">
          جاري تحميل بيانات الدواء...
        </p>
      </div>
    );
  }

  if (!medicine) {
    return (
      <div
        dir="rtl"
        className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900"
      >
        <div className="text-center space-y-3">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            لا يوجد دواء مطابق لهذا المعرف.
          </p>
          <Button onClick={() => router.push("/my-medicines")}>
            العودة لقائمة الأدوية
          </Button>
        </div>
      </div>
    );
  }

  const handleMarkTaken = async () => {
    if (!medicine || medicine.schedules.length === 0) return;

    const scheduleId = medicine.schedules[0].id;

    await medicationLogApi.markTaken(scheduleId);

    // إعادة تحميل الدواء نفسه
    const res = await medicationsApi.getOne(medicine.id);
    if (res.success && res.data) {
      setMedicine(res.data);
    }
  };




  const handleDelete = async () => {
    if (!confirm("هل تريد بالتأكيد حذف هذا الدواء من قائمتك؟")) return;
    await medicationsApi.delete(medicine.id);
    router.push("/my-medicines");
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-slate-50 dark:bg-slate-900 px-4 py-4 md:py-6"
    >
      <div className="max-w-4xl mx-auto space-y-5">
        <button
          type="button"
          onClick={() => router.push("/my-medicines")}
          className="inline-flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300 mb-1"
        >
          <ChevronRight size={16} />
          <span>العودة إلى الأدوية الخاصة بي</span>
        </button>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center">
              <Pill className="text-blue-600 dark:text-blue-300" size={24} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-50">
                {medicine.name}
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {medicine.dosage}
              </p>
            </div>
          </div>

          <span
            className={`self-start md:self-auto text-[11px] px-3 py-1.5 rounded-full border ${statusColor(
              uiStatus
            )}`}
          >
            {statusLabel(uiStatus)}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <section className="md:col-span-2 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-sm">
            <Block title="الجرعة وطريقة الاستخدام" icon={<Clock size={16} />}>
              <p className="text-sm text-slate-800 dark:text-slate-200">
                {medicine.dosage}
              </p>
            </Block>

            {medicine.notes && (
              <Block title="ملاحظات">
                <p className="text-sm text-slate-800 dark:text-slate-200">
                  {medicine.notes}
                </p>
              </Block>
            )}
          </section>

          <section className="space-y-4">
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <CalendarDays size={18} />
                <h2 className="text-sm font-semibold">جدولة الجرعات</h2>
              </div>

              {scheduleView.length === 0 ? (
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  لا توجد أوقات مجدولة لهذا الدواء حالياً.
                </p>
              ) : (
                <ul className="space-y-2 text-xs">
                  {scheduleView.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between gap-2 rounded-2xl bg-slate-50 dark:bg-slate-800 px-3 py-2"
                    >
                      <span className="inline-flex items-center gap-1">
                        <Clock size={14} />
                        <strong>{item.time}</strong>
                      </span>
                      <span className="text-[11px] text-slate-600 dark:text-slate-300">
                        {item.days.join("، ")}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-sm">
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-500" />
                تسجيل جرعة اليوم
              </h2>

              <Button
                type="button"
                onClick={handleMarkTaken}
                disabled={medicine.schedules.length === 0} className="w-full py-2 text-sm mt-1 flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={16} />
                تسجيل الجرعة الآن
              </Button>

              {medicine.schedules.length === 0 && (
                <p className="text-xs text-rose-600">
                  لا يمكن تسجيل الجرعة قبل إضافة وقت للدواء
                </p>
              )}



            </div>

            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 space-y-2 shadow-sm text-xs">
              <h3 className="font-semibold mb-1">إجراءات سريعة</h3>

              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => router.push(`/my-medicines/${medicine.id}/edit`)}
                  className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-300 hover:text-blue-500 transition text-xs"
                  title="تعديل ملاحظات الدواء والجدولة"
                >
                  <Pill size={16} />
                  <span>تعديل الملاحظات وجدول أوقات الدواء</span>
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  className="inline-flex items-center gap-2 text-rose-600 dark:text-rose-400 hover:text-rose-500 transition text-xs"
                  title="حذف الدواء نهائياً"
                >
                  <XCircle size={16} />
                  <span>حذف الدواء من قائمتي</span>
                </button>
              </div>
            </div>
          </section>
        </div>

        {error && (
          <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p>
        )}
      </div>
    </div>
  );
}

/* === Components === */

function Block({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
        {icon}
        <span className="font-semibold">{title}</span>
      </div>
      {children}
    </div>
  );
}
