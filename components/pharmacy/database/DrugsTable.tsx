'use client'

import type { DrugDto } from '@/lib/api/api'
import { SectionCard } from '@/components/pharmacy/shared/SectionCard'
import { Button } from '@/components/ui/Button'
import { Pill, Plus } from 'lucide-react'

type Props = {
  drugs: DrugDto[]
  selectedId: number | null
  onSelect: (d: DrugDto) => void
  onAddToStock: (d: DrugDto) => void
}

export function DrugsTable({ drugs, selectedId, onSelect, onAddToStock }: Props) {
  return (
    <SectionCard title="قائمة الأدوية" description="اختر دواء لعرض التفاصيل" icon={Pill}>
      {drugs.length === 0 ? (
        <p className="text-sm text-muted">لا توجد نتائج.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-muted">
              <tr className="border-b">
                <th className="py-3 text-right font-medium">الاسم</th>
                <th className="py-3 text-right font-medium">العيار</th>
                <th className="py-3 text-right font-medium">إجراء</th>
              </tr>
            </thead>

            <tbody>
              {drugs.map((d) => {
                const active = selectedId === d.id
                return (
                  <tr
                    key={d.id}
                    className={`border-b last:border-0 transition cursor-pointer ${
                      active ? 'bg-subtle/70' : 'hover:bg-subtle/40'
                    }`}
                    onClick={() => onSelect(d)}
                  >
                    <td className="py-3">
                      <div className="font-medium">{d.name}</div>
                      <div className="text-xs text-muted line-clamp-1">{d.description || '—'}</div>
                    </td>
                    <td className="py-3 text-muted">{d.strength}</td>
                    <td className="py-3">
                      <Button
                        variant="primary"
                        className="gap-2"
                        onClick={(e) => {
                          e.stopPropagation()
                          onAddToStock(d)
                        }}
                      >
                        <Plus size={16} />
                        للمخزون
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </SectionCard>
  )
}
