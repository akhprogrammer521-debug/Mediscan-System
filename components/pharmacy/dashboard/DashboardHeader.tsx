'use client'

import { motion } from 'framer-motion'
import { CalendarDays, Store } from 'lucide-react'
import { StatusBadge } from '@/components/pharmacy/shared/StatusBadge'

export function DashboardHeader({
  pharmacyName,
  subtitle,
  status,
}: {
  pharmacyName: string
  subtitle: string
  status: 'active' | 'inactive' | 'unknown'
}) {
  const today = new Intl.DateTimeFormat('ar', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date())

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        <div className="flex items-center gap-2">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
            <Store size={20} className="text-primary" />
          </span>
          <div>
            <h1 className="h1">لوحة التحكم</h1>
            <p className="text-sm text-muted">{subtitle}</p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <StatusBadge status={status} />
          <span className="inline-flex items-center gap-2 rounded-xl border border-border/40 bg-subtle px-3 py-1.5 text-xs text-muted">
            <CalendarDays size={14} />
            {today}
          </span>
          <span className="inline-flex items-center gap-2 rounded-xl border border-border/40 bg-subtle px-3 py-1.5 text-xs text-muted">
            الصيدلية: <span className="text-text font-medium">{pharmacyName}</span>
          </span>
        </div>
      </div>
    </motion.div>
  )
}
