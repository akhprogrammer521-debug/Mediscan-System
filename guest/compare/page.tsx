"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import TextField from "@/components/forms/TextAreaField";

interface DrugCompare {
  name1: string;
  name2: string;
  interactions: string[];
  similarity: string;
}

export default function ComparePage() {
  const [drug1, setDrug1] = useState("");
  const [drug2, setDrug2] = useState("");

  const [result, setResult] = useState<DrugCompare | null>(null);

  const fakeCompare = () => {
    setResult({
      name1: drug1,
      name2: drug2,
      interactions: [
        "قد يحدث تفاعل متوسط بين الدواءين",
        "زيادة خطر النزيف عند الدمج",
      ],
      similarity: "تركيب الدواءين يختلف بنسبة 60%",
    });
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          مقارنة دواءين
        </h1>
        <button onClick={() => history.back()} className="text-primary-600">
          رجوع
        </button>
      </div>

      <p className="text-slate-600 dark:text-slate-300 mb-8">
        أدخل اسم دواءين ليقوم النظام بمقارنتهما وتحليل التفاعلات المحتملة بينهما.
      </p>

      <div className="max-w-md mx-auto bg-white dark:bg-slate-800 border rounded-3xl shadow-lg p-6">
        <TextField
          label="اسم الدواء الأول"
          value={drug1}
          onChange={(e) => setDrug1(e.target.value)}
        />

        <TextField
          label="اسم الدواء الثاني"
          value={drug2}
          onChange={(e) => setDrug2(e.target.value)}
        />

        {!result && (
          <Button onClick={fakeCompare} className="w-full mt-4 py-3 text-lg">
            مقارنة الدواءين
          </Button>
        )}
      </div>

      {result && (
        <div className="max-w-md mx-auto mt-8">
          <div className="bg-white dark:bg-slate-800 border rounded-2xl p-6 shadow-sm mb-4">
            <p className="font-semibold">اسم الدواءين:</p>
            <p className="text-slate-600 dark:text-slate-300">
              {result.name1} & {result.name2}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 border rounded-2xl p-6 shadow-sm mb-4">
            <p className="font-semibold">نسبة التشابه:</p>
            <p className="text-slate-600 dark:text-slate-300">{result.similarity}</p>
          </div>

          <div className="bg-white dark:bg-slate-800 border rounded-2xl p-6 shadow-sm">
            <p className="font-semibold">التداخلات المحتملة:</p>
            <ul className="list-disc pr-6 text-slate-600 dark:text-slate-300 mt-2">
              {result.interactions.map((x, i) => (
                <li key={i}>{x}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}