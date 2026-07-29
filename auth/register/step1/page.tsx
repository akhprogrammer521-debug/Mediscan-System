"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Button from "@/components/ui/button";
import { z } from "zod";
import { authApi } from "@/lib/api";

interface Step1Form {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export default function SignUpStep1() {
  const router = useRouter();

  const [form, setForm] = useState<Step1Form>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<{ confirmPassword?: string }>({});

  const registerSchema = z
    .object({
      password: z.string().min(8),
      confirmPassword: z.string().min(8).max(20),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "كلمتا المرور غير متطابقتين",
      path: ["confirmPassword"],
    });

  const handleChange = <K extends keyof Step1Form>(
    field: K,
    value: Step1Form[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = async () => {
    const validation = registerSchema.safeParse({
      password: form.password,
      confirmPassword: form.confirmPassword,
    });

    if (!validation.success) {
      setErrors({
        confirmPassword:
          validation.error.flatten().fieldErrors.confirmPassword?.[0],
      });
      return;
    }

    const res = await authApi.register({
      firstName: form.firstName,
      lastName: form.lastName,
      username: form.username,
      email: form.email,
      phone: form.phone,
      password: form.password,
    });

    if (!res.success || !res.data) {
      alert(res.error || "فشل إنشاء الحساب");
      return;
    }

    Cookies.set("token", res.data.token);
    router.push("/auth/register/step2");
  };


  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-950 px-4"
    >
      <div className="w-full max-w-md space-y-6">
        {/* Brand */}
        <div className="text-center">
          <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 dark:bg-slate-800/60 shadow-sm border border-slate-200/70 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 mb-3">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            منصة MediScan الطبية
          </p>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
            إنشاء حساب مريض جديد
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
            أدخل بياناتك الأساسية لبدء استخدام المساعد الطبي الذكي.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/90 dark:bg-slate-900/80 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 p-6 md:p-7 space-y-5 backdrop-blur">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First name */}
            <div className="space-y-1">
              <label
                htmlFor="firstName"
                className="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                الاسم الأول
              </label>
              <input
                id="firstName"
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="مثال: أحمد"
                required
                title="الاسم الأول"
                aria-label="الاسم الأول"
                value={form.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
              />
            </div>

            {/* Last name */}
            <div className="space-y-1">
              <label
                htmlFor="lastName"
                className="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                الاسم الثاني
              </label>
              <input
                id="lastName"
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="مثال: خالد"
                title="الاسم الثاني"
                aria-label="الاسم الثاني"
                value={form.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Username */}
          <div className="space-y-1">
            <label
              htmlFor="username"
              className="text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              اسم الحساب
            </label>
            <input
              id="username"
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="اسم المستخدم في النظام"
              title="اسم الحساب"
              aria-label="اسم الحساب"
              value={form.username}
              onChange={(e) => handleChange("username", e.target.value)}
              required
            />
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                البريد الإلكتروني
              </label>
              <input
                id="email"
                type="email"
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="example@mail.com"
                title="الإيميل"
                aria-label="الإيميل"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="phone"
                className="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                رقم الموبايل
              </label>
              <input
                id="phone"
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="مثال: 05XXXXXXXX"
                title="رقم الموبايل"
                aria-label="رقم الموبايل"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Passwords */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label
                htmlFor="password"
                className="text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                كلمة المرور
              </label>
              <input
                id="password"
                type="password"
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="••••••••"
                title="كلمة المرور"
                aria-label="كلمة المرور"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                required
                minLength={8}
                maxLength={20}
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-slate-700 dark:text-slate-200"
              > 
                تأكيد كلمة المرور
              </label>
              <input
                id="confirmPassword"
                type="password"
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="أعد كتابة كلمة المرور"
                title="تأكيد كلمة المرور"
                aria-label="تأكيد كلمة المرور"
                value={form.confirmPassword}
                onChange={(e) => {
                  handleChange("confirmPassword", e.target.value);
                  setErrors({}); 
                }}
                required
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          <Button className="w-full mt-3 py-3 text-sm font-semibold" onClick={handleNext}>
            متابعة إلى التحقق
          </Button>

          <p className="text-center text-sm text-slate-600 dark:text-slate-300">
            لديك حساب بالفعل؟{" "}
            <Link href="/auth/login" className="text-primary-600 dark:text-primary-400 font-medium">
              تسجيل الدخول
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          MediScan © 2025 – منصة طبية ذكية للمساعدة في فهم أدويتك.
        </p>
      </div>
    </div>
  );
}