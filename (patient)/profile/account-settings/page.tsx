"use client";

import Button from "@/components/ui/button";
import { Lock } from "lucide-react";
import useToast from "@/components/ui/use-toast";
import Link from "next/link";


export default function AccountSettingsPage() {
  const { showToast } = useToast();
  // تسجيل الخروج
  const handleLogout = () => {
    localStorage.clear();
    showToast("تم تسجيل الخروج بنجاح", "success");
    window.location.href = "/auth/login";
  };
  return (
    <div dir="rtl" className="space-y-6 max-w-3xl mx-auto pt-6">

      <h1 className="text-xl font-bold text-center">إعدادات الحساب</h1>

      {/* ====== الأمان والخصوصية ====== */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">

        {/* تغيير كلمة المرور */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Lock size={20} />
            <span className="font-semibold">تغيير كلمة المرور</span>
          </div>

          <Link href="/profile/account-settings/change-password">
            <Button>تعديل كلمة المرور</Button>
          </Link>
        </div>
      </div>

      {/* زر تسجيل الخروج */}
      <div className="flex justify-center">
        <button
          onClick={handleLogout}
          className="px-6 py-3 rounded-2xl bg-red-600 text-white hover:bg-red-700"
        >
          تسجيل الخروج
        </button>
      </div>
    </div>
  );
}
