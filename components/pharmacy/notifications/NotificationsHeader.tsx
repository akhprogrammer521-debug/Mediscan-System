'use client'

import { Bell, RefreshCw } from 'lucide-react'
import { SectionCard } from '@/components/pharmacy/shared/SectionCard'
import { Button } from '@/components/ui/Button'

type Props = {
  unreadCount: number
  onRefresh: () => void
}

export function NotificationsHeader({ unreadCount, onRefresh }: Props) {
  return (
    <SectionCard
      title="الإشعارات"
      description="تابع آخر التنبيهات والتحديثات"
      icon={Bell}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted">غير مقروء:</span>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold">
            {unreadCount}
          </span>
        </div>

        <Button variant="soft" className="gap-2" onClick={onRefresh}>
          <RefreshCw size={16} />
          تحديث
        </Button>
      </div>
    </SectionCard>
  )
}
