'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Pill, ShieldAlert } from 'lucide-react'
import type { DrugDto } from '@/lib/api/api'

export type DrugResultCardProps = {
  drug?: DrugDto | null
}

export function DrugResultCard({ drug }: DrugResultCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Card className="card-lg p-5">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Pill className="text-primary" size={18} />
          </div>
          <div>
            <div className="text-sm font-semibold">نتيجة مطابقة الدواء</div>
            <div className="text-xs text-muted mt-0.5">
              سيتم عرض بيانات الدواء إذا تم التعرف عليه.
            </div>
          </div>
        </div>

        {!drug ? (
          <div className="mt-4 rounded-2xl border border-border/60 bg-subtle/40 p-4 flex items-start gap-3">
            <div className="mt-0.5">
              <ShieldAlert className="text-muted" size={18} />
            </div>
            <div className="text-sm text-muted leading-relaxed">
              لم يتم العثور على دواء مطابق في قاعدة البيانات (أو لم يرجع الباك اند
              دواء). جرّب صورة أوضح أو اسم مختلف.
            </div>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-border/60 bg-subtle/40 p-4">
              <div className="text-xs text-muted">الاسم</div>
              <div className="text-sm font-semibold mt-1">{drug.name}</div>

              <div className="text-xs text-muted mt-4">التركيز</div>
              <div className="text-sm mt-1">{drug.strength}</div>

              {drug.description && (
                <>
                  <div className="text-xs text-muted mt-4">الوصف</div>
                  <div className="text-sm mt-1 leading-relaxed">
                    {drug.description}
                  </div>
                </>
              )}
            </div>

            <div className="rounded-2xl border border-border/60 bg-subtle/40 p-4">
              <div className="text-xs text-muted">الاستعمالات</div>
              <div className="text-sm mt-1 leading-relaxed">{drug.indications}</div>

              <div className="text-xs text-muted mt-4">التحذيرات</div>
              <div className="text-sm mt-1 leading-relaxed">{drug.warnings}</div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-subtle/40 p-4">
              <div className="text-xs text-muted">التركيب</div>
              <div className="text-sm mt-1 leading-relaxed">{drug.composition}</div>

              <div className="text-xs text-muted mt-4">الجرعة</div>
              <div className="text-sm mt-1 leading-relaxed">{drug.dosage}</div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-subtle/40 p-4">
              <div className="text-xs text-muted">الآثار الجانبية</div>
              <div className="text-sm mt-1 leading-relaxed">{drug.sideEffects}</div>

              <div className="text-xs text-muted mt-4">التداخلات</div>
              <div className="text-sm mt-1 leading-relaxed">{drug.interactions}</div>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  )
}
