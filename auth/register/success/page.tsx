import { ShieldCheck } from "lucide-react";
export default function RegisterSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/90 dark:bg-slate-900/90 border border-emerald-200 dark:border-emerald-800 rounded-3xl shadow-xl p-8 text-center space-y-4">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900 mx-auto">

          <ShieldCheck size={18} className="text-emerald-600" />
        </div>

        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          تم إنشاء حسابك بنجاح
        </h1>

        <p className="text-sm text-slate-600 dark:text-slate-300">
          يمكنك الآن تسجيل الدخول واستخدام جميع خصائص MediScan لمتابعة
          أدويتك والتواصل مع الصيدليات.
        </p>

        <a
          href="/dashboard"
          className="inline-flex justify-center w-full mt-2 py-3 rounded-xl bg-primary-600 text-white hover:bg-primary-700 transition-colors"
        >
          الانتقال إلى تسجيل الدخول
        </a>
      </div>
    </div>
  );
}
