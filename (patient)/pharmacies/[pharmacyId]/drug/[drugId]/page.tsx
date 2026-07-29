"use client";

import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function PharmacyDrugOrderPage() {
  const { pharmacyId, drugId } = useParams<{
    pharmacyId: string;
    drugId: string;
  }>();

  const router = useRouter();

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 p-4 space-y-4">
      <button onClick={() => router.back()} className="flex items-center gap-1 text-sm">
        <ArrowRight size={16} /> رجوع
      </button>

      <div className="bg-white rounded-2xl p-4 border space-y-3">
        <p className="text-sm">
          سيتم تحويلك لتأكيد الطلب باستخدام البيانات الحقيقية.
        </p>

        <Button
          onClick={() =>
            router.push(
              `/orders/new/confirm?pharmacyId=${pharmacyId}&drugId=${drugId}`
            )
          }
        >
          متابعة تأكيد الطلب
        </Button>
      </div>
    </div>
  );
}
