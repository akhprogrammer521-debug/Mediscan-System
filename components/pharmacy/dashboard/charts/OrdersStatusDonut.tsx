'use client'

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'
import { SectionCard } from '@/components/pharmacy/shared/SectionCard'
import { PieChart as PieIcon } from 'lucide-react'

export function OrdersStatusDonut({
  pending,
  completed,
  rejected,
}: {
  pending: number
  completed: number
  rejected: number
}) {
  const data = [
    { name: 'معلقة', value: pending },
    { name: 'مكتملة', value: completed },
    { name: 'مرفوضة', value: rejected },
  ]

  // لا نحدد ألوان صريحة قوية؛ نخليها بسيطة عبر opacity
  const colors = ['rgba(59,130,246,0.65)', 'rgba(34,197,94,0.65)', 'rgba(239,68,68,0.65)']

  const total = pending + completed + rejected

  return (
    <SectionCard
      title="توزيع حالات الطلبات"
      description="عرض نسب الحالات الحالية"
      icon={PieIcon}
      className="h-[320px]"
    >
      {total === 0 ? (
        <div className="text-sm text-muted">لا توجد طلبات لعرض مخطط الحالات.</div>
      ) : (
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
              >
                {data.map((_, idx) => (
                  <Cell key={idx} fill={colors[idx]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-muted">
            <div>معلقة: <span className="text-text font-semibold">{pending}</span></div>
            <div>مكتملة: <span className="text-text font-semibold">{completed}</span></div>
            <div>مرفوضة: <span className="text-text font-semibold">{rejected}</span></div>
          </div>
        </div>
      )}
    </SectionCard>
  )
}
