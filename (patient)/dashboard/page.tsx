"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  BellRing,
  ClipboardList,
  FileText,
  Pill,
  PlusCircle,
  FileScanIcon,
} from "lucide-react";
import { dashboardApi } from "@/lib/api";

interface DashboardData {
  stats: {
    activeMedications: number;
    currentOrders: number;
    todayDoses: number;
    notificationsCount: number;
  };
  notifications: {
    id: number;
    title: string;
    message: string;
  }[];
}

export default function PatientDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      const res = await dashboardApi.get();
      if (res.success) {
        setData(res.data as unknown as DashboardData);
      }
      setLoading(false);
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        جاري تحميل لوحة التحكم...
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-6 md:px-8 lg:px-10"
    >
      <div className="max-w-6xl mx-auto space-y-8">

        {/* ====================== رأس الصفحة ====================== */}
        <section className="bg-gradient-to-l from-sky-50 to-slate-50 dark:from-slate-900 dark:to-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                مرحباً بك من جديد
              </h1>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 mt-1">
                هنا تجد ملخص حالتك الدوائية اليوم.
              </p>
            </div>

            <Link
              href="/orders/new/select-method"
              className="inline-flex items-center justify-center rounded-2xl bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 text-sm font-semibold shadow-md"
            >
              <PlusCircle className="ml-2" size={18} />
              طلب دواء جديد
            </Link>
          </div>

          {/* الإحصائيات */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-6">
            <StatCard
              value={String(data?.stats.activeMedications ?? 0)}
              label="الأدوية النشطة"
              tone="blue"
              icon={<Pill size={20} />}
            />
            <StatCard
              value={String(data?.stats.todayDoses ?? 0)}
              label="جرعات اليوم"
              tone="green"
              icon={<ClipboardList size={20} />}
            />
            <StatCard
              value={String(data?.stats.currentOrders ?? 0)}
              label="الطلبات الجارية"
              tone="indigo"
              icon={<FileText size={20} />}
            />
            <StatCard
              value={String(data?.notifications.length ?? 0)}
              label="تنبيهات جديدة"
              tone="red"
              icon={<BellRing size={20} />}
            />
          </div>
        </section>

        {/* ====================== الأدوات ====================== */}
        <section className="space-y-4">
          <h2 className="text-lg md:text-xl font-semibold text-slate-800 dark:text-slate-100">
            الأدوات
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ToolCard
              title="مسح دواء"
              description="التعرّف على الدواء عبر الكاميرا."
              icon={<FileScanIcon size={24} />}
              href="/scan/drug"
            />
            <ToolCard
              title="أدويتي"
              description="إدارة الأدوية الخاصة بك."
              icon={<Pill size={24} />}
              href="/my-medicines"
            />
            <ToolCard
              title="إضافة طلب"
              description="إرسال طلب دواء جديد."
              icon={<PlusCircle size={24} />}
              href="/orders/new/select-method"
            />
          </div>
        </section>

        {/* ====================== التنبيهات ====================== */}
        <section className="space-y-4">
          <h2 className="text-lg md:text-xl font-semibold text-slate-800 dark:text-slate-100">
            آخر التنبيهات
          </h2>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 space-y-3 shadow-sm">
            {data?.notifications.length ? (
              data.notifications.map((n) => (
                <NotificationItem
                  key={n.id}
                  title={n.title}
                  description={n.message}
                />
              ))
            ) : (
              <p className="text-sm text-slate-500">لا توجد تنبيهات حالياً</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

/* ====================== Components ====================== */

function StatCard({
  value,
  label,
  icon,
  tone,
}: {
  value: string;
  label: string;
  icon: React.ReactNode;
  tone: "blue" | "green" | "indigo" | "red";
}) {
  const toneMap = {
    blue: "bg-blue-50 text-blue-700 dark:bg-blue-900/25 dark:text-blue-200",
    green:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/25 dark:text-emerald-200",
    indigo:
      "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/25 dark:text-indigo-200",
    red: "bg-rose-50 text-rose-700 dark:bg-rose-900/25 dark:text-rose-200",
  };

  return (
    <div
      className={`flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-700 px-4 py-3 shadow-sm ${toneMap[tone]}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl font-bold">{value}</span>
        {icon}
      </div>
      <span className="text-xs md:text-sm font-medium">{label}</span>
    </div>
  );
}

function ToolCard({
  title,
  description,
  icon,
  href,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col justify-between rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">{title}</h3>
        <div className="text-primary-600 dark:text-primary-400">{icon}</div>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        {description}
      </p>
    </Link>
  );
}

function NotificationItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 text-sm">
      <div className="font-semibold mb-1">{title}</div>
      <p className="text-slate-600 dark:text-slate-300">{description}</p>
    </div>
  );
}
