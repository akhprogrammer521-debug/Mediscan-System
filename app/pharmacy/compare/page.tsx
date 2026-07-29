'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { pharmacistDrugsApi } from '@/lib/api/api'
import type { DrugComparisonResult } from '@/lib/api/api'
import { useToast } from '@/components/ui/toast/useToast'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Layers, Sparkles } from 'lucide-react'
import { DrugIdField } from '@/components/pharmacy/compare/DrugIdField'
import { ComparisonGrid } from '@/components/pharmacy/compare/ComparisonGrid'


export default function ComparePage() {
  const { showToast } = useToast()

  const [drugAName, setDrugA] = useState('')
  const [drugBName, setDrugB] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DrugComparisonResult | null>(null)

const canSubmit = useMemo(
  () =>
    drugAName.trim().length > 1 &&
    drugBName.trim().length > 1 &&
    !loading,
  [drugAName, drugBName, loading]
)

const compare = async () => {
  if (!drugAName.trim() || !drugBName.trim()) {
    showToast('يرجى إدخال اسمي الدواءين', 'warning')
    return
  }

  setLoading(true)
  setResult(null)

  const res = await pharmacistDrugsApi.compareByName(
    drugAName,
    drugBName
  )

  setLoading(false)

  if (!res.success) {
    showToast(res.error, 'error')
    return
  }

  setResult(res.data)
  showToast('تمت المقارنة بنجاح', 'success')
}


  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold">مقارنة أدوية</h1>
          <p className="text-sm text-muted mt-1">
            أدخل معرفَي دواء من قاعدة الأدوية لمقارنة الخصائص والتداخلات.
          </p>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Layers className="text-primary" size={18} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DrugIdField
          label="الدواء A"
          value={drugAName}
          onChange={setDrugA}
          hint="أدخل Drug Name(اسم) للدواء الأول"
        />
        <DrugIdField
          label="الدواء B"
          value={drugBName}
          onChange={setDrugB}
          hint="أدخل Drug Name(اسم) للدواء الثاني"
        />
      </div>

      <Card className="card-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">تنفيذ المقارنة</div>
            <div className="text-xs text-muted mt-1">
              سيتم جلب بيانات الدواءين ثم عرض التداخلات إن وجدت.
            </div>
          </div>

          <Button
            type="button"
            size="lg"
            className="gap-2"
            disabled={!canSubmit}
            onClick={compare}
          >
            <Sparkles size={18} />
            {loading ? 'جارِ المقارنة...' : 'قارن الآن'}
          </Button>
        </div>

        {(!drugAName || !drugBName) && (
          <div className="mt-4 text-xs text-muted">
            أدخل اسمين صحيحين أكبر من 0 لتفعيل زر المقارنة.
          </div>
        )}
      </Card>

      {loading && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="card-lg p-5">
            <div className="text-sm font-semibold">جارِ جلب النتائج...</div>
            <div className="mt-4 h-2 w-full rounded-full bg-subtle overflow-hidden">
              <motion.div
                className="h-full w-1/2 rounded-full bg-primary/40"
                animate={{ x: ['-50%', '150%'] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
              />
            </div>
          </Card>
        </motion.div>
      )}

      {result && <ComparisonGrid result={result} />}
    </div>
  )
}
