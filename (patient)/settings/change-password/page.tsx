"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import { Lock, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // قوة كلمة المرور
  const passwordStrength = (() => {
    if (newPassword.length < 6) return "ضعيفة جدًا";
    if (newPassword.length < 8) return "ضعيفة";
    if (!/[A-Z]/.test(newPassword)) return "متوسطة";
    if (!/[0-9]/.test(newPassword)) return "جيدة";
    return "قوية";
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setErr(null);

    if (newPassword !== confirm) {
      setErr("كلمة المرور الجديدة غير متطابقة.");
      return;
    }

    setLoading(true);

    try {
      /** 
       * 🔒 لاحقاً هنا سيتم الربط مع API
       * مثال:
       * const res = await fetch("/api/user/password", {
       *   method: "PUT",
       *   body: JSON.stringify({ currentPassword, newPassword }),
       * });
       */

      await new Promise((res) => setTimeout(res, 1200)); // محاكاة API

      setMsg("تم تحديث كلمة المرور بنجاح!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirm("");

      setTimeout(() => {
        router.back(); // العودة إلى صفحة البروفايل
      }, 1200);
    } catch {
      setErr("حدث خطأ أثناء تحديث كلمة المرور.");
    }

    setLoading(false);
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 md:p-8 flex items-start justify-center"
    >
      <main className="w-full max-w-lg bg-white dark:bg-slate-900 shadow-xl rounded-3xl border border-slate-200 dark:border-slate-700 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <Lock size={24} className="text-primary-600 dark:text-primary-300" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50">
              تغيير كلمة المرور
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              قم بإدخال كلمة المرور الحالية والجديدة لحماية حسابك.
            </p>
          </div>
        </div>

        {/* Alert messages */}
        {msg && (
          <div className="rounded-2xl p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 text-sm">
            <ShieldCheck className="inline-block mr-1" size={16} />
            {msg}
          </div>
        )}
        {err && (
          <div className="rounded-2xl p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 text-sm">
            {err}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            id="oldPass"
            label="كلمة المرور الحالية"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />

          <InputField
            id="newPass"
            label="كلمة مرور جديدة"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          {/* Password Strength */}
          {newPassword.length > 0 && (
            <p className="text-xs text-slate-600 dark:text-slate-300">
              قوة كلمة المرور:{" "}
              <span className="font-bold text-primary-600 dark:text-primary-400">
                {passwordStrength}
              </span>
            </p>
          )}

          <InputField
            id="confirm"
            label="تأكيد كلمة المرور"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-xs rounded-xl border border-slate-300 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              إلغاء
            </button>

            <Button
              type="submit"
              className="px-4 py-2 text-xs"
              disabled={loading}
            >
              {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}

/* ------------------------- Components ------------------------- */

function InputField({
  id,
  label,
  type = "text",
  value,
  onChange,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className="block text-sm text-slate-700 dark:text-slate-200"
      >
        {label}
      </label>

      <input
        id={id}
        type={type}
        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        value={value}
        onChange={onChange}
        placeholder={label}
        title={label}
        aria-label={label}
      />
    </div>
  );
}
