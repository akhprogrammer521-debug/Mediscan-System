"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import { passwordApi } from "@/lib/api";
import { Lock } from "lucide-react";

export default function ChangePasswordPage() {
  const router = useRouter();

  const [currentPassword, setCurrent] = useState("");
  const [newPassword, setNew] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirm) {
      alert("كلمتا المرور غير متطابقتين");
      return;
    }

    const res = await passwordApi.change({
      currentPassword,
      newPassword,
    });

    if (res.success) {
      router.back();
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-slate-50 dark:bg-slate-900 px-4 pt-6"
    >
      <div className="max-w-md mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow border border-slate-200 dark:border-slate-800 p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <Lock className="text-slate-700 dark:text-slate-200" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              تغيير كلمة المرور
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              أدخل كلمة المرور الحالية والجديدة
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <PasswordField
            label="كلمة المرور الحالية"
            value={currentPassword}
            onChange={setCurrent}
          />

          <PasswordField
            label="كلمة المرور الجديدة"
            value={newPassword}
            onChange={setNew}
          />

          <PasswordField
            label="تأكيد كلمة المرور الجديدة"
            value={confirm}
            onChange={setConfirm}
          />

          <Button className="w-full py-3 text-sm font-semibold">
            حفظ التغييرات
          </Button>
        </form>

        {/* Back */}
        <button
          type="button"
          onClick={() => router.back()}
          className="w-full text-center text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
        >
          العودة
        </button>
      </div>
    </div>
  );
}

/* ====================== Components ====================== */

function PasswordField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-slate-700 dark:text-slate-300">
        {label}
      </label>
      <input
        type="password"
        value={value}
        placeholder={label}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full rounded-xl border border-slate-300 dark:border-slate-700
          bg-white dark:bg-slate-800
          px-3 py-2.5 text-sm
          outline-none
          focus:ring-2 focus:ring-primary-500 focus:border-transparent
        "
        required
      />
    </div>
  );
}
