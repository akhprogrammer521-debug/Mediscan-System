'use client'

import type { DrugDto } from '@/lib/api/api'
import { SectionCard } from '@/components/pharmacy/shared/SectionCard'
import { FileText } from 'lucide-react'

type Props = {
  drug: DrugDto | null
}

export function DrugPreview({ drug }: Props) {
  return (
    <SectionCard
      title="تفاصيل الدواء"
      description="عرض سريع للمعلومات الطبية"
      icon={FileText}
      className="h-full"
    >
      {!drug ? (
        <p className="text-sm text-muted">اختر دواء من القائمة لعرض التفاصيل.</p>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted">الاسم</p>
            <p className="font-semibold">{drug.name}</p>
          </div>

          <div>
            <p className="text-xs text-muted">العيار</p>
            <p className="font-semibold">{drug.strength}</p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <InfoBlock label="التركيب" value={drug.composition} />
            <InfoBlock label="الاستطبابات" value={drug.indications} />
            <InfoBlock label="الجرعة" value={drug.dosage} />
            <InfoBlock label="تحذيرات" value={drug.warnings} />
            <InfoBlock label="آثار جانبية" value={drug.sideEffects} />
          </div>
        </div>
      )}
    </SectionCard>
  )
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-subtle/30 p-3 transition hover:bg-subtle/50">
      <p className="text-xs text-muted mb-1">{label}</p>
      <p className="text-sm leading-relaxed">{value}</p>
    </div>
  )
}
