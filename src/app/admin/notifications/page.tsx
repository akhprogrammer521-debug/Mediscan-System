'use client'

import { useEffect, useState } from 'react'
import { notificationsApi, Notification } from '@/lib/api'
import { Bell, Check, AlertCircle, Info, CheckCircle, XCircle } from 'lucide-react'
import { AdminShell } from '@/components/admin/AdminShell'
import { PageWrapper } from '@/components/admin/PageWrapper'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadNotifications = async () => {
    try {
      setIsLoading(true)
      const res = await notificationsApi.getAll()

      if (res.success && res.data) {
        setNotifications(res.data)
      } else {
        setError(res.error || 'فشل تحميل الإشعارات')
      }
    } catch {
      setError('حدث خطأ غير متوقع')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  const markAsRead = async (id: number) => {
    await notificationsApi.markAsRead(id)
    loadNotifications()
  }

  const renderIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS':
        return <CheckCircle className="h-5 w-5 text-emerald-500" />
      case 'ERROR':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'WARNING':
        return <AlertCircle className="h-5 w-5 text-orange-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  return (
    <AdminShell>
      <PageWrapper title="الإشعارات" subtitle="عرض وإدارة الإشعارات">

        {error && (
          <div className="mb-4 rounded-xl border border-red-400 bg-red-900/40 px-4 py-3 text-red-200">
            {error}
          </div>
        )}

        <div className="rounded-2xl border border-subtle bg-surface">

          {isLoading ? (
            <div className="p-6 space-y-4 animate-pulse">
              <div className="h-20 bg-soft rounded-xl" />
              <div className="h-20 bg-soft rounded-xl" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="h-16 w-16 mx-auto text-muted mb-4" />
              <p className="text-main text-lg">لا توجد إشعارات</p>
            </div>
          ) : (
            <div className="divide-y divide-subtle">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-4 p-6 ${
                    !n.isRead ? 'bg-brand-600/5' : ''
                  }`}
                >
                  <div className="p-2 rounded-lg bg-soft">
                    {renderIcon(n.type)}
                  </div>

                  <div className="flex-1">
                    <p className="text-main font-semibold">{n.message}</p>
                    <p className="text-xs text-muted mt-1">
                      {new Date(n.createdAt).toLocaleString('ar-SY')}
                    </p>
                  </div>

                  {!n.isRead && (
                    <button
                      onClick={() => markAsRead(n.id)}
                      className="rounded-lg p-2 text-brand-600 hover:bg-brand-600/10"
                      title="وضع كمقروء"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </PageWrapper>
    </AdminShell>
  )
}
