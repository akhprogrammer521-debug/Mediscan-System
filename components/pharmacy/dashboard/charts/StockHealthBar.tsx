'use client'

import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts'
import { SectionCard } from '@/components/pharmacy/shared/SectionCard'
import { PackageSearch } from 'lucide-react'

export function StockHealthBar({ stockCount }: { stockCount: number }) {
  // “مؤشر” بسيط: هدف افتراضي لواجهة احترافية (تقدر تعدله لاحقاً من Settings)
  const target = 50
  const safe = Math.min(stockCount, target)

  const data = [
    { name: 'المتوفر', value: safe },
    { name: 'الهدف', value: target },
  ]

  return (
    <SectionCard
      title="مؤشر صحة المخزون"
      description="مقارنة المخزون بهدف افتراضي"
      icon={PackageSearch}
      className="h-[320px]"
    >
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <Tooltip />
            <Bar dataKey="value" radius={[10, 10, 10, 10]} />
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-3 text-xs text-muted">
          المخزون الحالي: <span className="text-text font-semibold">{stockCount}</span>
          {' '}— الهدف: <span className="text-text font-semibold">{target}</span>
        </div>
      </div>
    </SectionCard>
  )
}
