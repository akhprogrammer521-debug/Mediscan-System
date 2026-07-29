"use client";

import {  useState } from "react";

type ThemeMode = "light" | "dark" | "system";

const ACCENT_COLORS = [
  { name: "أزرق", value: "#2563eb" },
  { name: "كحلي", value: "#1e3a8a" },
  { name: "أخضر", value: "#059669" },
  { name: "بنفسجي", value: "#7c3aed" },
];


/** تطبيق الثيم */
const applyTheme = (mode: ThemeMode) => {
  const root = document.documentElement;

  if (mode === "light") root.classList.remove("dark");
  else if (mode === "dark") root.classList.add("dark");
  else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }
};

/** تطبيق اللون */
const applyAccent = (value: string) => {
  document.documentElement.style.setProperty("--accent", value);
};


export default function ThemeSection() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "system";
    const t = localStorage.getItem("themeMode") as ThemeMode | null;
    if (t) applyTheme(t);
    return t ?? "system";
  });

  const [accent, setAccent] = useState(() => {
    if (typeof window === "undefined") return "#3B82F6";
    const c = localStorage.getItem("accentColor");
    if (c) applyAccent(c);
    return c ?? "#3B82F6";
  });



  /** عند تغيير الثيم */
  const changeTheme = (mode: ThemeMode) => {
    setTheme(mode);
    localStorage.setItem("theme-mode", mode);
    applyTheme(mode);
  };

  /** عند تغيير اللون */
  const changeAccent = (color: string) => {
    setAccent(color);
    localStorage.setItem("accent-color", color);
    applyAccent(color);
  };

  return (
    <section className="mt-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-5 space-y-5">

      <h2 className="font-bold text-lg text-slate-900 dark:text-slate-100">
        مظهر التطبيق
      </h2>

      {/* خيارات الثيم */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

        <button
          onClick={() => changeTheme("light")}
          className={`p-4 rounded-2xl border text-center transition ${theme === "light"
              ? "border-[var(--accent)] bg-[var(--accent)]/10"
              : "border-slate-300 dark:border-slate-600"
            }`}
        >
          وضع فاتح
        </button>

        <button
          onClick={() => changeTheme("dark")}
          className={`p-4 rounded-2xl border text-center transition ${theme === "dark"
              ? "border-[var(--accent)] bg-[var(--accent)]/10"
              : "border-slate-300 dark:border-slate-600"
            }`}
        >
          وضع داكن
        </button>

        <button
          onClick={() => changeTheme("system")}
          className={`p-4 rounded-2xl border text-center transition ${theme === "system"
              ? "border-[var(--accent)] bg-[var(--accent)]/10"
              : "border-slate-300 dark:border-slate-600"
            }`}
        >
          حسب النظام
        </button>

      </div>

      {/* ألوان النظام */}
      <div className="space-y-2">
        <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
          لون النظام الأساسي
        </p>

        <div className="flex flex-wrap gap-3">
          {ACCENT_COLORS.map((c) => (
            <button
              key={c.value}
              
              onClick={() => changeAccent(c.value)}
              className={`w-10 h-10 rounded-full border transition ${accent === c.value
                  ? "ring-2 ring-[var(--accent)] border-[var(--accent)]"
                  : "border-slate-300 dark:border-slate-600"
                }`}
              style={{ backgroundColor: c.value }}
              title={`لون ${c.name}`}
            />

          ))}
        </div>
      </div>

    </section>
  );
}
