"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import Button from "@/components/ui/button";
import useToast from "@/components/ui/use-toast";

export default function PrivacySecurityPage() {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { showToast } = useToast();

  /** عملية حذف الحساب */
  const handleDeleteAccount = () => {
    // هنا يتم استدعاء API الحقيقي لحذف الحساب
    // await deleteAccountAPI();

    showToast("تم حذف الحساب", "success");
    showToast("تم حذف حسابك بنجاح. نتمنى لك الصحة والعافية دائما", "success");

    router.push("/"); // واجهة الترحيب
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen p-6 space-y-6 text-slate-900 dark:text-slate-100"
    >
      <h1 className="text-2xl font-bold">الخصوصية والأمان</h1>

      <div className="rounded-3xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
        <h2 className="text-lg font-semibold mb-2">حذف الحساب نهائيًا</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
          سيؤدي حذف الحساب إلى إزالة جميع بياناتك الطبية، وصفاتك، وأدويتك من
          النظام بشكل دائم ولا يمكن استعادتها لاحقًا.
        </p>

        <Button
          className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2"
          onClick={() => setConfirmOpen(true)}
        >
          <Trash2 size={16} className="ml-2" />
          حذف الحساب نهائيًا
        </Button>
      </div>

      {/* نافذة التأكيد */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold mb-2 text-rose-600">تأكيد حذف الحساب</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
              هل أنت متأكد أنك تريد حذف حسابك نهائيًا؟ لن تتمكن من استعادة أي بيانات
              بعد الحذف.
            </p>

            <div className="flex justify-between gap-3 mt-4">
              <Button
                className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                onClick={() => setConfirmOpen(false)}
              >
                إلغاء
              </Button>

              <Button
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white"
                onClick={handleDeleteAccount}
              >
                نعم، احذف الحساب
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
