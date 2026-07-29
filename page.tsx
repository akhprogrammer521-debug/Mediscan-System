"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";



export default function LandingPage() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);


  // تبديل الثيم
  const toggleTheme = () => {
    const html = document.documentElement;
    html.classList.toggle("dark");
    setDarkMode(!darkMode);

  };

  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900"
    >
      {/* Header */}
      <header className="w-full border-b border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="logo"
              width={35}
              height={35}
              className="rounded-lg"
            />

            <span className="text-lg font-bold text-slate-800 dark:text-slate-100">
              mediScan
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600 dark:text-slate-300">

            <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400">
              الرئيسية
            </a>

            <a href="#features" className="hover:text-primary-600 dark:hover:text-primary-400">
              مميزات المنصة
            </a>

            <a href="#contact" className="hover:text-primary-600 dark:hover:text-primary-400">
              تواصل معنا
            </a>

            <a href="/auth/login" className="hover:text-primary-600 dark:hover:text-primary-400">
              تسجيل الدخول
            </a>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {darkMode ? (
                <Sun size={22} className="text-yellow-400" />
              ) : (
                <Moon size={22} className="text-slate-700 dark:text-slate-200" />
              )}
            </button>

          </nav>

        </div>
      </header>

      {/* Main */}
      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-4 py-10 md:py-16 flex flex-col md:flex-row items-center gap-10">
          {/* Right: text */}
          <div className="w-full md:w-1/2 space-y-6 text-right">
            <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              منصة طبية ذكية للتحقق من الأدوية والوصفات
            </p>

            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 leading-relaxed">
              MediScan{" "}
              <span className="text-primary-600 dark:text-primary-400">
                المساعد الطبي الذكي لإدارة الأدوية
              </span>
            </h1>

            <p className="text-slate-700 dark:text-slate-300 text-base md:text-lg leading-8">
              تساعدك MediScan على إدارة أدويتك اليومية بشكل آمن، من خلال تنظيم جداول الجرعات،
              تسجيل الجرعات المتناولة، اكتشاف التفاعلات الدوائية بين أدويتك الحالية،
              عرض التحذيرات والتنبيهات المهمة، وإرسال تذكيرات تساعدك على الالتزام بالعلاج .
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Button
                className="flex-1 py-3 text-sm md:text-base font-semibold"
                onClick={() => router.push("/auth/register/step1")}
              >
                إنشاء حساب مريض جديد
              </Button>

            </div>

            {/* Mini stats */}
            <div className="grid grid-cols-3 gap-3 mt-4 text-xs md:text-sm">
  <div className="rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 px-3 py-2 text-center">
    <p className="font-semibold text-slate-900 dark:text-slate-50">
      أدوية نشطة
    </p>
    <p className="text-slate-500 dark:text-slate-400">
      تنظيم وجدولة الاستخدام
    </p>
  </div>

  <div className="rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 px-3 py-2 text-center">
    <p className="font-semibold text-slate-900 dark:text-slate-50">
      تحذيرات دوائية
    </p>
    <p className="text-slate-500 dark:text-slate-400">
      اكتشاف التداخلات تلقائيًا
    </p>
  </div>

  <div className="rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 px-3 py-2 text-center">
    <p className="font-semibold text-slate-900 dark:text-slate-50">
      تسجيل الجرعات
    </p>
    <p className="text-slate-500 dark:text-slate-400">
      متابعة الالتزام بالعلاج
    </p>
  </div>
</div>

          </div>

          {/* Left: illustration */}
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative w-[320px] h-[320px] md:w-[380px] md:h-[380px]">
              <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-primary-500/20 via-emerald-400/10 to-slate-200 shadow-2xl shadow-primary-500/20" />
              <div className="relative w-full h-full flex items-center justify-center p-8">
                <Image
                  src="/ChatGPT Image 26 نوفمبر 2025، 07_45_02 م.png"
                  alt="طبيب يفحص وصفة دوائية عبر تطبيق MediScan"
                  fill
                  className="object-contain rounded-[28px]"
                />
              </div>
            </div>
          </div>
        </section>

       {/* Features */}
<section
  id="features"
  className="bg-white/80 dark:bg-slate-900/80 border-t border-slate-200/70 dark:border-slate-800"
>
  <div className="max-w-6xl mx-auto px-4 py-10 grid gap-6 md:grid-cols-3">
    <FeatureCard
      title="إدارة وجدولة الأدوية"
      desc="أضف أدويتك بسهولة ونظّم جدول الجرعات والأيام، مع إمكانية تعديل المعلومات ومتابعة كل دواء بشكل مستقل."
    />

    <FeatureCard
      title="تسجيل الجرعات والمتابعة"
      desc="سجّل الجرعات التي تم تناولها يوميًا، وتابع التزامك بالعلاج من خلال سجل واضح وإحصائيات مبسّطة."
    />

    <FeatureCard
      title="تحذيرات التفاعلات الدوائية"
      desc="يقارن النظام بين أدويتك النشطة تلقائيًا، ويعرض تحذيرات وتنبيهات عند وجود تداخلات دوائية محتملة."
    />
  </div>
</section>
      </main>

      {/* Footer */}
      <footer
        id="contact"
        className="border-t border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80"
      >
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          <p>© جميع الحقوق محفوظة — MediScan 2025</p>
          <p>هذه المنصة للمساعدة ولا تغني عن استشارة الطبيب أو الصيدلاني.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
        {title}
      </h3>
      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        {desc}
      </p>
    </div>
  );
}
