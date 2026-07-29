"use client";

import { useEffect, useState } from "react";
import {
  HeartPulse,
  Calendar,
  Ruler,
  Weight,
  Pill,
  AlertTriangle,
  Activity,
} from "lucide-react";
import Button from "@/components/ui/button";
import useToast from "@/components/ui/use-toast";
import { medicalInfoApi, profileApi } from "@/lib/api";

interface MedicalInfo {
  gender: "male" | "female";
  birthDate: string;
  heightCm: string;
  weightKg: string;
  chronicDiseases: string;
  chronicMeds: string;
  currentMeds: string;
  allergies: string;
}

export default function EditMedicalInfoPage() {
  const { showToast } = useToast();
  const [data, setData] = useState<MedicalInfo | null>(null);

  useEffect(() => {
    profileApi.get().then((res) => {
      if (!res.success || !res.data?.patient.medicalInfo) return;

      const m = res.data.patient.medicalInfo;
      setData({
        gender: m.gender === "MALE" ? "male" : "female",
        birthDate: m.birthDate.slice(0, 10),
        heightCm: String(m.height),
        weightKg: String(m.weight),
        chronicDiseases: m.chronicDiseases ?? "",
        chronicMeds: m.chronicMedications ?? "",
        currentMeds: m.currentMedications ?? "",
        allergies: m.allergies ?? "",
      });
    });
  }, []);

  if (!data) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await medicalInfoApi.submit({
      gender: data.gender === "male" ? "MALE" : "FEMALE",
      birthDate: data.birthDate,
      height: Number(data.heightCm),
      weight: Number(data.weightKg),
      chronicDiseases: data.chronicDiseases || null,
      chronicMedications: data.chronicMeds || null,
      currentMedications: data.currentMeds || null,
      allergies: data.allergies || null,
    });

    if (res.success) {
      showToast("تم حفظ المعلومات الصحية بنجاح", "success");
      history.back();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-4">
      {/* الجنس */}
      <SelectInput
        label="الجنس"
        value={data.gender}
        icon={<HeartPulse size={18} />}
        options={[
          { label: "ذكر", value: "male" },
          { label: "أنثى", value: "female" },
        ]}
        onChange={(v) => setData({ ...data, gender: v as "male" | "female" })}
      />

      {/* تاريخ الميلاد */}
      <FormInput
        label="تاريخ الميلاد"
        type="date"
        value={data.birthDate}
        icon={<Calendar size={18} />}
        onChange={(v) => setData({ ...data, birthDate: v })}
      />

      {/* الطول */}
      <FormInput
        label="الطول (سم)"
        value={data.heightCm}
        icon={<Ruler size={18} />}
        onChange={(v) => setData({ ...data, heightCm: v })}
      />

      {/* الوزن */}
      <FormInput
        label="الوزن (كغ)"
        value={data.weightKg}
        icon={<Weight size={18} />}
        onChange={(v) => setData({ ...data, weightKg: v })}
      />

      {/* الأمراض المزمنة */}
      <TextareaInput
        label="الأمراض المزمنة"
        value={data.chronicDiseases}
        icon={<Activity size={18} />}
        onChange={(v) => setData({ ...data, chronicDiseases: v })}
      />

      {/* الأدوية المزمنة */}
      <TextareaInput
        label="الأدوية المزمنة"
        value={data.chronicMeds}
        icon={<Pill size={18} />}
        onChange={(v) => setData({ ...data, chronicMeds: v })}
      />

      {/* الأدوية الحالية */}
      <TextareaInput
        label="الأدوية الحالية"
        value={data.currentMeds}
        icon={<Pill size={18} />}
        onChange={(v) => setData({ ...data, currentMeds: v })}
      />

      {/* الحساسية */}
      <TextareaInput
        label="الحساسية"
        value={data.allergies}
        icon={<AlertTriangle size={18} />}
        onChange={(v) => setData({ ...data, allergies: v })}
      />

      <Button className="w-full">حفظ</Button>
    </form>
  );
}

/* =========================
   UI COMPONENTS (Same Style)
========================= */

function FormInput({
  label,
  value,
  onChange,
  icon,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  icon?: React.ReactNode;
  type?: string;
}) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <div className="flex gap-2 border rounded-xl px-3 py-2">
        {icon}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent outline-none"
        />
      </div>
    </div>
  );
}

function TextareaInput({
  label,
  value,
  onChange,
  icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <div className="flex gap-2 border rounded-xl px-3 py-2">
        {icon}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent outline-none resize-none"
          rows={2}
        />
      </div>
    </div>
  );
}

function SelectInput({
  label,
  value,
  options,
  onChange,
  icon,
}: {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (v: string) => void;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <div className="flex gap-2 border rounded-xl px-3 py-2">
        {icon}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent outline-none"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
