"use client";

import { useRouter } from "next/navigation";
import { ClipboardList, History, PlusCircle } from "lucide-react";
import Button from "@/components/ui/button";


export default function OrdersHomePage() {
  const router = useRouter();

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-slate-50 dark:bg-slate-900 px-4 py-6"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              طلبات الأدوية
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              إدارة طلباتك الحالية، ومراجعة السجل، وإنشاء طلب جديد بسهولة.
            </p>
          </div>

          <Button
            className="flex items-center gap-2 px-4 py-2 text-sm"
            onClick={() => router.push("/orders/new/select-method")}
          >
            <PlusCircle size={18} />
            طلب دواء جديد
          </Button>
        </header>

        {/* Quick cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => router.push("/orders/current")}
            className="text-right rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition flex flex-col gap-2"
          >
            <div className="flex items-center gap-2">
              <span className="h-9 w-9 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                <ClipboardList className="text-blue-600 dark:text-blue-300" size={20} />
              </span>
              <span className="font-semibold text-slate-900 dark:text-slate-50 text-sm">
                الطلبات الجارية
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              متابعة حالة طلبات الأدوية التي لم تكتمل بعد.
            </p>
          </button>

          <button
            type="button"
            onClick={() => router.push("/orders/history")}
            className="text-right rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition flex flex-col gap-2"
          >
            <div className="flex items-center gap-2">
              <span className="h-9 w-9 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                <History className="text-emerald-600 dark:text-emerald-300" size={20} />
              </span>
              <span className="font-semibold text-slate-900 dark:text-slate-50 text-sm">
                سجل الطلبات
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              مراجعة طلباتك السابقة وإعادة الطلب بنقرة واحدة.
            </p>
          </button>
        </section>
      </div>
    </div>
  );
}
