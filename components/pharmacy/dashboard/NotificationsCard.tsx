'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { PharmacistNotification } from '@/lib/api/api'
import { SectionCard } from '@/components/pharmacy/shared/SectionCard'
import { Bell, ArrowRight, Info, AlertTriangle } from 'lucide-react'

function iconByType(type: string) {
  const t = (type || '').toLowerCase()
  if (t.includes('system')) return Info
  if (t.includes('order')) return AlertTriangle
  if (t.includes('message')) return Bell
  return Bell
}

export function NotificationsCard({ notifications }: { notifications: PharmacistNotification[] }) {
  const list = (notifications ?? []).slice(0, 5)

  return (
    <SectionCard title="آخر الإشعارات" description="أحدث 5 إشعارات" icon={Bell}>
      {list.length === 0 ? (
        <div className="text-sm text-muted">لا توجد إشعارات حالياً.</div>
      ) : (
        <div className="space-y-3">
          {list.map((n, idx) => {
            const I = iconByType(n.type)
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="rounded-2xl border border-border/40 bg-bg/40 px-4 py-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <I size={16} />
                    </span>
                    <div>
                      <div className="text-sm font-semibold">{n.title}</div>
                      <div className="text-xs text-muted mt-1">{n.message}</div>
                    </div>
                  </div>

                  <span className="text-[11px] text-muted">{n.isRead ? 'مقروء' : 'جديد'}</span>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      <div className="mt-4">
        <Link href="/pharmacy/notifications" className="inline-flex items-center gap-2 text-sm text-primary">
          عرض الكل <ArrowRight size={16} />
        </Link>
      </div>
    </SectionCard>
  )
}
