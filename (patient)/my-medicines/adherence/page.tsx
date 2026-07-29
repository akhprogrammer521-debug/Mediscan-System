"use client";

import { useEffect, useState } from "react";
import { BarChart3, CheckCircle2, Percent } from "lucide-react";
import { medicationExtraApi } from "@/lib/api";

interface AdherenceData {
  totalDoses: number;
  takenDoses: number;
  adherenceRate: number;
}

export default function AdherencePage() {
  const [data, setData] = useState<AdherenceData | null>(null);

  useEffect(() => {
    medicationExtraApi.adherence().then((res) => {
      if (res.success && res.data) setData(res.data);
    });
  }, []);

  if (!data) return null;

  return (
    <div dir="rtl" className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <header className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-primary-50 flex items-center justify-center">
          <BarChart3 className="text-primary-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">الالتزام بالأدوية</h1>
          <p className="text-sm text-slate-500">
            ملخص التزامك بتناول الجرعات
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={<CheckCircle2 />}
          label="الجرعات المأخوذة"
          value={data.takenDoses}
        />
        <StatCard
          icon={<BarChart3 />}
          label="إجمالي الجرعات"
          value={data.totalDoses}
        />
        <StatCard
          icon={<Percent />}
          label="نسبة الالتزام"
          value={`${data.adherenceRate}%`}
          highlight
        />
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-3xl border p-5 bg-white dark:bg-slate-900 space-y-2 ${
        highlight ? "border-primary-500" : "border-slate-200"
      }`}
    >
      <div className="flex items-center gap-2 text-slate-600">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">
        {value}
      </p>
    </div>
  );
}
