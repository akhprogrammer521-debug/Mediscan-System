'use client'

import type { PharmacistNotification } from '@/lib/api/api'
import { SectionCard } from '@/components/pharmacy/shared/SectionCard'
import { Bell } from 'lucide-react'
import { NotificationItem } from '@/components/pharmacy/notifications/NotificationItem'

type Props = {
  items: PharmacistNotification[]
  onMarkRead: (id: number) => void
}

export function NotificationsList({ items, onMarkRead }: Props) {
  return (
    <SectionCard title="قائمة الإشعارات" description="اضغط على الإشعار لتحديده كمقروء" icon={Bell}>
      {items.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-subtle/40 p-4 text-sm text-muted">
          لا توجد إشعارات حالياً.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((n) => (
            <NotificationItem key={n.id} item={n} onMarkRead={onMarkRead} />
          ))}
        </div>
      )}
    </SectionCard>
  )
}
