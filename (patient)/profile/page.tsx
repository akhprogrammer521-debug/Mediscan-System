"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  User,
  Stethoscope,
  HeartPulse,
  Calendar,
  Ruler,
  Weight,
  Shield,
} from "lucide-react";
import { profileApi } from "@/lib/api";

/* ====================== Types ====================== */

interface PersonalInfo {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
}

interface MedicalInfo {
  gender: "male" | "female" | "";
  birthDate: string;
  heightCm: string;
  weightKg: string;
  chronicDiseases: string;
  chronicMeds: string;
  currentMeds: string;
  allergies: string;
}

/* ====================== Page ====================== */

export default function PatientProfilePage() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [medicalInfo, setMedicalInfo] = useState<MedicalInfo | null>(null);

  useEffect(() => {
    profileApi.get().then((res) => {
      if (!res.success || !res.data) return;

      setPersonalInfo({
        firstName: res.data.patient.firstName,
        lastName: res.data.patient.lastName,
        username: res.data.user.username,
        email: res.data.user.email,
        phone: res.data.patient.phone,
      });

      const m = res.data.patient.medicalInfo;
      if (m) {
        setMedicalInfo({
          gender: m.gender === "MALE" ? "male" : "female",
          birthDate: m.birthDate.slice(0, 10),
          heightCm: String(m.height),
          weightKg: String(m.weight),
          chronicDiseases: m.chronicDiseases ?? "",
          chronicMeds: m.chronicMedications ?? "",
          currentMeds: m.currentMedications ?? "",
          allergies: m.allergies ?? "",
        });
      }
    });
  }, []);

  const age = useMemo(() => {
    if (!medicalInfo?.birthDate) return "-";
    const today = new Date();
    const birth = new Date(medicalInfo.birthDate);
    let years = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) years--;
    return `${years} سنة`;
  }, [medicalInfo]);

  if (!personalInfo) return null;

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-4">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <header className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <User size={26} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">الملف الشخصي</h1>
            <p className="text-sm text-slate-500">بيانات حسابك وصحتك</p>
          </div>
        </header>

        {/* Personal Info */}
        <Card
          title="المعلومات العامة"
          icon={<User size={20} />}
          actionHref="/profile/edit"
        >
          <InfoRow label="الاسم الأول" value={personalInfo.firstName} />
          <InfoRow label="الاسم الثاني" value={personalInfo.lastName} />
          <InfoRow label="اسم المستخدم" value={personalInfo.username} />
          <InfoRow label="البريد الإلكتروني" value={personalInfo.email} />
          <InfoRow label="رقم الهاتف" value={personalInfo.phone} />
        </Card>

        {/* Medical Info */}
        {medicalInfo && (
          <Card
            title="المعلومات الصحية"
            icon={<Stethoscope size={20} />}
            actionHref="/profile/medical-info"
          >
            <InfoRow
              label="الجنس"
              value={medicalInfo.gender === "male" ? "ذكر" : "أنثى"}
              icon={<HeartPulse size={14} />}
            />
            <InfoRow
              label="تاريخ الميلاد"
              value={medicalInfo.birthDate}
              icon={<Calendar size={14} />}
            />
            <InfoRow label="العمر" value={age} />
            <InfoRow
              label="الطول"
              value={`${medicalInfo.heightCm} سم`}
              icon={<Ruler size={14} />}
            />
            <InfoRow
              label="الوزن"
              value={`${medicalInfo.weightKg} كغ`}
              icon={<Weight size={14} />}
            />

            <InfoBlock label="الأمراض المزمنة" value={medicalInfo.chronicDiseases} />
            <InfoBlock label="الأدوية المزمنة" value={medicalInfo.chronicMeds} />
            <InfoBlock label="الأدوية الحالية" value={medicalInfo.currentMeds} />
            <InfoBlock label="الحساسية" value={medicalInfo.allergies} />
          </Card>
        )}

        {/* Security */}
        <Card
          title="إعدادات الأمان"
          icon={<Shield size={20} />}
          actionHref="/profile/account-settings"
        />
      </div>
    </div>
  );
}

/* ====================== UI ====================== */

function Card({
  title,
  icon,
  actionHref,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  actionHref?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 border shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          {icon}
          <h2 className="font-semibold">{title}</h2>
        </div>
        {actionHref && (
          <Link
            href={actionHref}
            className="text-sm px-4 py-2 bg-primary-600 text-white rounded-xl"
          >
            تعديل
          </Link>
        )}
      </div>
      <div className="grid md:grid-cols-2 gap-3">{children}</div>
    </section>
  );
}

function InfoRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border px-3 py-2 bg-slate-50 dark:bg-slate-800">
      <div className="flex items-center gap-1 text-xs text-slate-500">
        {icon}
        {label}
      </div>
      <div className="text-sm">{value}</div>
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border px-3 py-2 bg-slate-50 dark:bg-slate-800 md:col-span-2">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-sm">{value || "-"}</div>
    </div>
  );
}
