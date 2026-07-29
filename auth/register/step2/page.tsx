"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import { HeartPulse, Pill, FileText, AlertTriangle } from "lucide-react";
import { medicalInfoApi } from "@/lib/api";

export default function SignUpStep2() {
  const router = useRouter();

  const [form, setForm] = useState({
    gender: "",
    birthdate: "",
    height: "",
    weight: "",
    currentMedications: "",
    chronicMedications: "",
    chronicDiseases: "",
    allergies: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const finishSignup = async () => {
  if (!form.birthdate || !form.height || !form.weight) {
    alert("يرجى تعبئة جميع الحقول الأساسية");
    return;
  }

  const res = await medicalInfoApi.submit({
    gender: form.gender === "ذكر" ? "MALE" : "FEMALE",
    birthDate: new Date(form.birthdate + "T00:00:00Z").toISOString(),
    height: Number(form.height),
    weight: Number(form.weight),
    currentMedications: form.currentMedications || null,
    chronicMedications: form.chronicMedications || null,
    chronicDiseases: form.chronicDiseases || null,
    allergies: form.allergies || null,
  });

  if (!res.success) {
    alert(res.error || "فشل حفظ المعلومات الطبية");
    return;
  }

  router.push("/dashboard");
};


  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-2xl space-y-6">
        <div className="bg-white rounded-3xl p-6 space-y-6">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <select
              value={form.gender}
              onChange={(e) => handleChange("gender", e.target.value)}
              className="rounded-2xl border px-3 py-2.5"
            >
              <option value="">اختر الجنس</option>
              <option value="ذكر">ذكر</option>
              <option value="أنثى">أنثى</option>
            </select>

            <input
              type="date"
              value={form.birthdate}
              onChange={(e) => handleChange("birthdate", e.target.value)}
              className="rounded-2xl border px-3 py-2.5"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              placeholder="الطول (سم)"
              value={form.height}
              onChange={(e) => handleChange("height", e.target.value)}
              className="rounded-2xl border px-3 py-2.5"
            />
            <input
              placeholder="الوزن (كغ)"
              value={form.weight}
              onChange={(e) => handleChange("weight", e.target.value)}
              className="rounded-2xl border px-3 py-2.5"
            />
          </div>

          <FieldArea title="الأدوية الحالية" value={form.currentMedications} onChange={(v) => handleChange("currentMedications", v)} icon={<Pill size={18} />} />
          <FieldArea title="الأدوية المزمنة" value={form.chronicMedications} onChange={(v) => handleChange("chronicMedications", v)} icon={<FileText size={18} />} />
          <FieldArea title="الأمراض المزمنة" value={form.chronicDiseases} onChange={(v) => handleChange("chronicDiseases", v)} icon={<HeartPulse size={18} />} />
          <FieldArea title="الحساسية" value={form.allergies} onChange={(v) => handleChange("allergies", v)} icon={<AlertTriangle size={18} />} />

          <Button className="w-full py-3" onClick={finishSignup}>
            إنشاء الحساب
          </Button>
        </div>
      </div>
    </div>
  );
}

function FieldArea({
  title,
  value,
  onChange,
  icon,
}: {
  title: string;
  value: string;
  onChange: (v: string) => void;
  icon: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium">
        {icon} {title}
      </label>
      <textarea
        className="w-full rounded-2xl border px-3 py-2.5"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
