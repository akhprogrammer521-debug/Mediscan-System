'use client'

import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Pill } from 'lucide-react'

export type DrugIdFieldProps = {
  label: string
  value: string
  onChange: (v: string) => void
  hint?: string
}

export function DrugIdField({ label, value, onChange, hint }: DrugIdFieldProps) {
  return (
    <Card className="card-lg p-5">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Pill className="text-primary" size={18} />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold">{label}</div>
          {hint && <div className="text-xs text-muted mt-1">{hint}</div>}

          <div className="mt-3">
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="مثال: 12"
              inputMode="numeric"
              className="bg-subtle"
            />
            <div className="text-[11px] text-muted mt-2 leading-relaxed">
              * حالياً يعتمد الاختيار على <b>Drug Name</b> لضمان العمل بدون أي API إضافي.
              لاحقاً يمكننا إضافة بحث/Autocomplete من قاعدة الأدوية بسهولة.
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
