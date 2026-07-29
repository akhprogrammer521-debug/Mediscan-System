"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import { z } from "zod";
import { authApi } from "@/lib/api";
import Cookies from "js-cookie";

interface LoginForm {
  username: string;
  password: string;
}

const loginSchema = z.object({
  username: z.string().min(3, "اسم المستخدم مطلوب (3 أحرف على الأقل)"),
  password: z.string().min(6, "كلمة المرور لا تقل عن 6 أحرف"),
});

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState<LoginForm>({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
    general?: string;
  }>({});

  const [loading, setLoading] = useState(false);

  const handleChange = <K extends keyof LoginForm>(
    field: K,
    value: LoginForm[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogin = async () => {
    const validation = loginSchema.safeParse(form);

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      setErrors({
        username: fieldErrors.username?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }

    setErrors({});
    setLoading(true);

    const res = await authApi.login({
      username: form.username,
      password: form.password,
    });

    setLoading(false);

    if (!res.success || !res.data) {
      setErrors({
        general: res.error || "فشل تسجيل الدخول",
      });
      return;
    }

    // حفظ التوكن
    Cookies.set("token", res.data.token, { expires: 7 });

    router.push("/dashboard");
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-950 px-4"
    >
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            تسجيل الدخول للمريض
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
            أدخل اسم المستخدم وكلمة المرور
          </p>
        </div>

        <div className="bg-white/90 dark:bg-slate-900/80 rounded-3xl shadow-xl border p-6 space-y-5">
          {errors.general && (
            <p className="text-sm text-red-600 text-center">
              {errors.general}
            </p>
          )}

          <div>
            <label className="text-sm font-medium">اسم المستخدم</label>
            <input
              className="w-full rounded-2xl border px-3 py-2.5"
              value={form.username}
              onChange={(e) => {
                handleChange("username", e.target.value);
                setErrors((p) => ({ ...p, username: undefined }));
              }}
            />
            {errors.username && (
              <p className="text-xs text-red-500 mt-1">
                {errors.username}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">كلمة المرور</label>
            <input
              type="password"
              className="w-full rounded-2xl border px-3 py-2.5"
              value={form.password}
              onChange={(e) => {
                handleChange("password", e.target.value);
                setErrors((p) => ({ ...p, password: undefined }));
              }}
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password}
              </p>
            )}
          </div>

          <Button
            className="w-full py-3"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </Button>

          <p className="text-center text-sm">
            لا تمتلك حساباً؟{" "}
            <Link
              href="/auth/register/step1"
              className="text-primary-600 font-medium"
            >
              إنشاء حساب
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
