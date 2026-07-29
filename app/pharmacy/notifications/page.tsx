'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authToken, pharmacistNotificationsApi } from '@/lib/api/api'
import type { PharmacistNotification } from '@/lib/api/api'
import { useToast } from '@/components/ui/toast/useToast'

import { PageSkeleton } from '@/components/pharmacy/shared/PageSkeleton'
import { NotificationsHeader } from '@/components/pharmacy/notifications/NotificationsHeader'
import { NotificationsList } from '@/components/pharmacy/notifications/NotificationsList'
import { SectionCard } from '@/components/pharmacy/shared/SectionCard'
import { BellOff } from 'lucide-react'

type ViewState = 'loading' | 'ready' | 'error'

export default function NotificationsPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const once = useRef(false)

  const [state, setState] = useState<ViewState>('loading')
  const [items, setItems] = useState<PharmacistNotification[]>([])

  const load = async () => {
    setState('loading')
    const res = await pharmacistNotificationsApi.getNotifications()

    if (!res.success) {
      setState('error')

      if (!once.current) {
        showToast(res.error, 'error')
        once.current = true
      }

      const msg = (res.error || '').toLowerCase()
      if (
        msg.includes('unauthorized') ||
        msg.includes('invalid token') ||
        msg.includes('token')
      ) {
        authToken.remove()
        router.replace('/login')
      }

      return
    }

    setItems(res.data ?? [])
    setState('ready')
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const unreadCount = items.filter((n) => !n.isRead).length

  const markRead = async (id: number) => {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )

    const res = await pharmacistNotificationsApi.markAsRead(id)
    if (!res.success) {
      showToast(res.error, 'error')
      setItems((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: false } : n))
      )
    }
  }

  if (state === 'loading') return <PageSkeleton title="الإشعارات" />

  if (state === 'error') {
    return (
      <div className="space-y-6 page-animate">
        <NotificationsHeader unreadCount={0} onRefresh={load} />
        <SectionCard
          title="تعذر تحميل الإشعارات"
          icon={BellOff}
          description="تحقق من الاتصال ثم أعد المحاولة."
        >
          <button
            onClick={load}
            className="mt-3 inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm text-white transition hover:opacity-90"
          >
            إعادة المحاولة
          </button>
        </SectionCard>
      </div>
    )
  }

  return (
    <div className="space-y-6 page-animate">
      <NotificationsHeader unreadCount={unreadCount} onRefresh={load} />
      <NotificationsList items={items} onMarkRead={markRead} />
    </div>
  )
}
