"use client";

import { useEffect, useState } from "react";
import { User, Mail, Phone, AtSign } from "lucide-react";
import Button from "@/components/ui/button";
import useToast from "@/components/ui/use-toast";
import { profileApi } from "@/lib/api";

interface PersonalInfo {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
}

export default function EditPersonalInfoPage() {
  const { showToast } = useToast();
  const [data, setData] = useState<PersonalInfo | null>(null);

  useEffect(() => {
    profileApi.get().then((res) => {
      if (!res.success || !res.data) return;
      setData({
        firstName: res.data.patient.firstName,
        lastName: res.data.patient.lastName,
        username: res.data.user.username,
        email: res.data.user.email,
        phone: res.data.patient.phone,
      });
    });
  }, []);

  if (!data) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await profileApi.update({
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
    });

    if (res.success) {
      showToast("تم حفظ المعلومات بنجاح", "success");
      history.back();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-4">
      <FormInput label="الاسم الأول" value={data.firstName} icon={<User size={18} />} onChange={(v) => setData({ ...data, firstName: v })} />
      <FormInput label="الاسم الثاني" value={data.lastName} icon={<User size={18} />} onChange={(v) => setData({ ...data, lastName: v })} />
      <FormInput label="اسم المستخدم" value={data.username} icon={<AtSign size={18} />} disabled />
      <FormInput label="البريد الإلكتروني" value={data.email} icon={<Mail size={18} />} disabled />
      <FormInput label="رقم الهاتف" value={data.phone} icon={<Phone size={18} />} onChange={(v) => setData({ ...data, phone: v })} />
      <Button className="w-full">حفظ</Button>
    </form>
  );
}

function FormInput({
  label,
  value,
  onChange,
  icon,
  disabled,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  icon?: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <div className="flex gap-2 border rounded-xl px-3 py-2">
        {icon}
        <input
          value={value}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.value)}
          className="flex-1 bg-transparent outline-none"
        />
      </div>
    </div>
  );
}
