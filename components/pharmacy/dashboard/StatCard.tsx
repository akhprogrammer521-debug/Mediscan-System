'use client'

import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

type Tone = 'good' | 'warning' | 'danger' | 'info' | 'neutral'

export function StatCard({
  title,
  subtitle,
  value,
  icon: Icon,
  tone = 'neutral',
}: {
  title: string
  subtitle?: string
  value: number
  icon: LucideIcon
  tone?: Tone
}) {
  const toneClass: Record<Tone, string> = {
    good: 'bg-primary/10 text-primary',
    warning: 'bg-subtle text-text',
    danger: 'bg-subtle text-text',
    info: 'bg-primary/10 text-primary',
    neutral: 'bg-subtle text-muted',
  }

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      className="rounded-2xl border border-border/40 bg-subtle/60 backdrop-blur p-5 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">{title}</p>
          {subtitle ? <p className="mt-1 text-xs text-muted">{subtitle}</p> : null}
        </div>

        <span className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${toneClass[tone]}`}>
          <Icon size={18} />
        </span>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div className="text-3xl font-semibold leading-none">{value}</div>
        <div className="text-xs text-muted">آخر تحديث: الآن</div>
      </div>
    </motion.div>
  )
}
