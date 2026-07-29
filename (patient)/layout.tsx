"use client";

import React from "react";
import { ToastProvider } from "@/components/ui/use-toast";
import PatientSidebar from "@/components/patient/PatientSidebar";
import PatientNavbar from "@/components/layout/PatientNavbar";
import { NotificationsProvider } from "@/context/NotificationsContext";

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NotificationsProvider>
      <ToastProvider>
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
          {/* Navbar */}
          <PatientNavbar />

          {/* Content */}
          <main className="flex-1 md:mr-64 p-4 md:p-8 mt-[64px]">
            {children}
          </main>

          {/* Sidebar */}
          <PatientSidebar />
        </div>
      </ToastProvider>
    </NotificationsProvider>
  );
}
