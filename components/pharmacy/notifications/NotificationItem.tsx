'use client'

import type { PharmacistNotification } from '@/lib/api/api'
import { Bell, CheckCircle2 } from 'lucide-react'

function formatDate(ts: string) {
  const d = new Date(ts)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString()
}

type Props = {
  item: PharmacistNotification
  onMarkRead: (id: number) => void
}

export function NotificationItem({ item, onMarkRead }: Props) {
  const unread = !item.isRead

  return (
    <button
      type="button"
      onClick={() => {
        if (unread) onMarkRead(item.id)
      }}
      className={[
        'w-full text-right rounded-2xl border border-border/60 p-4 transition',
        'hover:bg-subtle/40 active:scale-[0.99]',
        unread ? 'bg-primary/5' : 'bg-white',
      ].join(' ')}
      title={unread ? 'تحديد كمقروء' : 'مقروء'}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          {unread ? (
            <div className="rounded-xl bg-primary/10 p-2">
              <Bell size={18} />
            </div>
          ) : (
            <div className="rounded-xl bg-emerald-500/10 p-2">
              <CheckCircle2 size={18} />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="font-semibold truncate">{item.title || '—'}</div>
            <div className="text-xs text-muted">{formatDate(item.createdAt)}</div>
          </div>

          <div className="mt-1 text-sm text-muted whitespace-pre-wrap">
            {item.message || '—'}
          </div>

          {unread && (
            <div className="mt-3 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold">
              جديد
            </div>
          )}
        </div>
      </div>
    </button>
  )
}
