"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function GuestLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50"
    >
      {/* Header */}
      <header className="bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
                  <Image
                    src="/logo.png" // ضع صورة اللوغو هنا
                    alt="logo"
                    width={35}
                    height={35}
                    className="rounded-lg"
                  />
          
                  <span className="text-lg font-bold text-slate-800 dark:text-slate-100">
                    mediScan
                  </span>
                </div>
          <Link
            href="/auth/login"
            className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
          >
            تسجيل دخول كمريض
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-4 pb-20">
        {children}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 inset-x-0 bg-white/95 dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-800 backdrop-blur-md">
        <div className="max-w-3xl mx-auto flex items-center justify-around py-2 text-xs">
          <NavItem href="/guest" label="الرئيسية" active={isActive("/guest")} />
          <NavItem
            href="/guest/scan-drug"
            label="مسح دواء"
            active={isActive("/guest/scan-drug")}
          />
          <NavItem
            href="/guest/scan-prescription"
            label="وصفة طبية"
            active={isActive("/guest/scan-prescription")}
          />
          <NavItem
            href="/guest/chat"
            label="المساعد"
            active={isActive("/guest/chat")}
          />
        </div>
      </nav>
    </div>
  );
}

function NavItem({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center gap-0.5 px-2 ${
        active ? "text-primary-600 dark:text-primary-400" : "text-slate-500 dark:text-slate-400"
      }`}
    >
      <span
        className={`h-1 w-6 rounded-full mb-0.5 ${
          active ? "bg-primary-500 dark:bg-primary-400" : "bg-transparent"
        }`}
      />
      <span className="text-[11px]">{label}</span>
    </Link>
  );
}
