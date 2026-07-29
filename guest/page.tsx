"use client";

import Link from "next/link";
import Image from "next/image";

export default function GuestHomePage() {
  return (
    <div className="space-y-5">
      {/* مقدمة */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-5">
        <h1 className="text-lg font-bold mb-2">مرحباً بك في وضع الضيف</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          يمكنك تجربة بعض قدرات MediScan بدون إنشاء حساب. النتائج هنا للتجربة
          فقط ولا تعتمد عليها طبياً بشكل كامل.
        </p>
      </div>

      {/* الكروت */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FeatureCard
          title="مسح علبة دواء"
          desc="التعرّف على دواء من صورة العلبة، مع عرض تركيب مبسّط ومعلومات أولية."
          href="/guest/scan-drug"
          img="/scan.png"
        />

        <FeatureCard
          title="مسح وصفة طبية"
          desc="ارفع صورة لوصفة الطبيب للحصول على قراءة نصية وترجمة عربية."
          href="/guest/scan-prescription"
          img="/scan.png"
        />

        <FeatureCard
          title="ترجمة وصفة أجنبية"
          desc="أدخل نص أو صورة لوصفة بلغة أجنبية لتحويلها للعربية (نسخة تجريبية)."
          href="/guest/translate"
          img="/translate.png"
        />

        <FeatureCard
          title="المساعد الطبي الذكي"
          desc="اسأل عن تفاعلات دوائية أو استفسارات عامة حول الأدوية."
          href="/guest/chat"
          img="/ChatBot.png"
        />
      </div>

      <p className="text-[11px] text-slate-500 dark:text-slate-400">
        ملاحظة: هذه النسخة للعرض فقط — للمعلومات الطبية الدقيقة، سجّل حساب مريض كامل
        وراجع طبيبك أو صيدلانياً مختصاً دائماً.
      </p>
    </div>
  );
}

/* ---------- Component  ---------- */

function FeatureCard({
  title,
  desc,
  href,
  img,
}: {
  title: string;
  desc: string;
  href: string;
  img: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* صورة أيقونة الميزة */}
      <div className="w-full h-28 mb-3 flex items-center justify-center">
        <Image
          src={img}
          alt={title}
          width={100}
          height={100}
          className="object-contain border:25px"
        />
      </div>

      <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-1">
        {title}
      </h2>

      <p className="text-xs text-slate-600 dark:text-slate-300">{desc}</p>
    </Link>
  );
}
