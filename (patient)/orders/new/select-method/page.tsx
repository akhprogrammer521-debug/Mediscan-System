"use client";

import { useRouter } from "next/navigation";
import { Pill, Store, ArrowRight } from "lucide-react";


export default function SelectOrderMethodPage() {
  const router = useRouter();

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-slate-50 dark:bg-slate-900 px-4 py-6"
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <header className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            طريقة إنشاء الطلب
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            اختر الطريقة الأنسب لك لطلب الأدوية من الصيدليات القريبة منك.
          </p>
        </header>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 text-xs text-slate-600 dark:text-slate-300">
          <span className="flex items-center gap-1">
            <span className="h-6 w-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-[11px]">
              1
            </span>
            اختيار الطريقة
          </span>
          <span className="h-px w-8 bg-slate-300 dark:bg-slate-700" />
          <span className="flex items-center gap-1">
            <span className="h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[11px]">
              2
            </span>
            اختيار الدواء / الصيدلية
          </span>
          <span className="h-px w-8 bg-slate-300 dark:bg-slate-700" />
          <span className="flex items-center gap-1">
            <span className="h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[11px]">
              3
            </span>
            تأكيد الطلب
          </span>
        </div>

        {/* Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* By pharmacy */}
          <button
            type="button"
            onClick={() => router.push("/orders/new/by-pharmacy")}
            className="text-right rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md hover:border-primary-400 dark:hover:border-primary-500 transition flex flex-col gap-3"
          >
            <div className="flex items-center gap-3">
              <span className="h-10 w-10 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                <Store className="text-emerald-600 dark:text-emerald-300" size={22} />
              </span>
              <div>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                  اختيار صيدلية أولاً
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  تصفح صيدلية معيّنة، ثم اختر من الأدوية المتوفرة لديها.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>مناسب عندما تفضّل صيدلية معيّنة.</span>
              <ArrowRight size={16} />
            </div>
          </button>
          {/* By drug */}
          <button
            type="button"
            onClick={() => router.push("/orders/new/by-drug")}
            className="text-right rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md hover:border-primary-400 dark:hover:border-primary-500 transition flex flex-col gap-3"
          >
            <div className="flex items-center gap-3">
              <span className="h-10 w-10 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                <Pill className="text-blue-600 dark:text-blue-300" size={22} />
              </span>
              <div>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                  طلب دواء معيّن
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  ابحث عن دواء محدد، ثم اعرف الصيدليات التي توفره واختر الأنسب.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>مناسب عند معرفة اسم الدواء مسبقاً.</span>
              <ArrowRight size={16} />
            </div>
          </button>
        </section>

        <div className="text-center text-xs text-slate-500 dark:text-slate-400">
          يمكنك تغيير الطريقة في أي وقت قبل تأكيد الطلب.
        </div>
      </div>
    </div>
  );
}
