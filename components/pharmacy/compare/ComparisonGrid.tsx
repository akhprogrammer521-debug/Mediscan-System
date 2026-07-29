'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import type { DrugComparisonResult } from '@/lib/api/api'
import { ShieldAlert, ShieldCheck } from 'lucide-react'

export type ComparisonGridProps = {
  result: DrugComparisonResult
}

export function ComparisonGrid({ result }: ComparisonGridProps) {
  const { drugA, drugB, interaction } = result
  const hasInteraction = !!interaction

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-4"
    >
      <Card className="card-lg p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">التداخل الدوائي</div>
            <div className="text-xs text-muted mt-1">
              نتيجة مقارنة التداخل بين الدواءين (إن وُجدت).
            </div>
          </div>

          <div
            className={[
              'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs border',
              hasInteraction
                ? 'border-red-200 bg-red-50 text-red-700'
                : 'border-green-200 bg-green-50 text-green-700',
            ].join(' ')}
          >
            {hasInteraction ? <ShieldAlert size={14} /> : <ShieldCheck size={14} />}
            {hasInteraction ? 'يوجد تحذير' : 'لا يوجد تحذير'}
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-border/60 bg-subtle/40 p-4 text-sm leading-relaxed">
          {hasInteraction ? (
            <>
              <div className="text-xs text-muted">الخطورة</div>
              <div className="font-semibold mt-1">{interaction.severity}</div>
              <div className="text-xs text-muted mt-4">التحذير</div>
              <div className="mt-1">{interaction.warning}</div>
            </>
          ) : (
            <div className="text-muted">
              لم يرجع النظام تحذيراً واضحاً للتداخل. (قد يعني لا يوجد تداخل أو لا توجد
              بيانات كافية.)
            </div>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="card-lg p-5">
          <div className="text-sm font-semibold">الدواء A</div>
          <div className="text-xs text-muted mt-1">
            {drugA.name} • {drugA.strength}
          </div>

          <div className="mt-4 grid gap-3">
            <div className="rounded-2xl border border-border/60 bg-subtle/40 p-4">
              <div className="text-xs text-muted">التركيب</div>
              <div className="text-sm mt-1 leading-relaxed">{drugA.composition}</div>
            </div>
            <div className="rounded-2xl border border-border/60 bg-subtle/40 p-4">
              <div className="text-xs text-muted">الاستعمالات</div>
              <div className="text-sm mt-1 leading-relaxed">{drugA.indications}</div>
            </div>
            <div className="rounded-2xl border border-border/60 bg-subtle/40 p-4">
              <div className="text-xs text-muted">التحذيرات</div>
              <div className="text-sm mt-1 leading-relaxed">{drugA.warnings}</div>
            </div>
          </div>
        </Card>

        <Card className="card-lg p-5">
          <div className="text-sm font-semibold">الدواء B</div>
          <div className="text-xs text-muted mt-1">
            {drugB.name} • {drugB.strength}
          </div>

          <div className="mt-4 grid gap-3">
            <div className="rounded-2xl border border-border/60 bg-subtle/40 p-4">
              <div className="text-xs text-muted">التركيب</div>
              <div className="text-sm mt-1 leading-relaxed">{drugB.composition}</div>
            </div>
            <div className="rounded-2xl border border-border/60 bg-subtle/40 p-4">
              <div className="text-xs text-muted">الاستعمالات</div>
              <div className="text-sm mt-1 leading-relaxed">{drugB.indications}</div>
            </div>
            <div className="rounded-2xl border border-border/60 bg-subtle/40 p-4">
              <div className="text-xs text-muted">التحذيرات</div>
              <div className="text-sm mt-1 leading-relaxed">{drugB.warnings}</div>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  )
}
