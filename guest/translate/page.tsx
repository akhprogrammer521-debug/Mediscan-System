"use client";

import { useState } from "react";
import Button from "@/components/ui/button";

export default function GuestTranslatePage() {
  const [text, setText] = useState("");
  const [translated, setTranslated] = useState("");

  const handleTranslate = () => {
    // ترجمة وهمية للتجربة
    if (!text.trim()) return;
    setTranslated(
      "مثال ترجمة: حبتان من الباراسيتامول 500 مجم عند الحاجة كل 6 ساعات لخفض الحرارة، " +
        "ولا تتجاوز 4 جرعات في اليوم."
    );
  };

  return (
    <div className="space-y-5">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <h1 className="text-lg font-bold mb-1">ترجمة وصفة أجنبية (وضع الضيف)</h1>
        <p className="text-xs text-slate-600 dark:text-slate-300">
          الصق نص الوصفة باللغة الإنجليزية (أو لغة أخرى) وسنظهر لك مثالاً مترجماً إلى
          العربية لتتخيل كيف ستعمل النسخة الكاملة من MediScan.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
        <div className="space-y-1">
          <label
            htmlFor="foreign-text"
            className="text-xs font-medium text-slate-700 dark:text-slate-200"
          >
            نص الوصفة الأجنبية
          </label>
          <textarea
            id="foreign-text"
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows={4}
            placeholder="مثال: Take 1 tablet of Paracetamol 500mg every 6 hours if needed for pain or fever..."
            title="نص الوصفة الأجنبية"
            aria-label="نص الوصفة الأجنبية"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <Button className="w-full mt-1 py-2.5 text-xs" onClick={handleTranslate}>
          عرض مثال للترجمة للعربية
        </Button>

        {translated && (
          <div className="mt-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 space-y-1">
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-1">
              النتيجة التالية مثال توضيحي وليست ترجمة حقيقية للنص المدخل:
            </p>
            <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
              {translated}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
