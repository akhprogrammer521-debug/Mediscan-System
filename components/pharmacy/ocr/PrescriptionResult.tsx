'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { ListChecks, AlertTriangle } from 'lucide-react'

export type PrescriptionResultProps = {
  extractedDrugNames?: string[] | null
}

export function PrescriptionResult({ extractedDrugNames }: PrescriptionResultProps) {
  const list = (extractedDrugNames ?? []).filter(Boolean)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Card className="card-lg p-5">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
            <ListChecks className="text-primary" size={18} />
          </div>
          <div>
            <div className="text-sm font-semibold">الأدوية المستخرجة</div>
            <div className="text-xs text-muted mt-0.5">
              سيتم عرض أسماء الأدوية التي تم التعرف عليها من الوصفة.
            </div>
          </div>
        </div>

        {list.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-border/60 bg-subtle/40 p-4 flex items-start gap-3">
            <AlertTriangle className="text-muted mt-0.5" size={18} />
            <div className="text-sm text-muted leading-relaxed">
              لم يتم استخراج أسماء أدوية. جرّب صورة أوضح، إضاءة أفضل، أو قصّ
              الحواف الزائدة.
            </div>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {list.map((name) => (
              <div
                key={name}
                className="rounded-2xl border border-border/60 bg-subtle/40 p-4 text-sm"
              >
                {name}
              </div>
            ))}
          </div>
        )}
      </Card>
    </motion.div>
  )
}
