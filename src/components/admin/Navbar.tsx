'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import {
  Bell,
  LogOut,
  User2,
  CheckCircle2,
  AlertTriangle,
  Info,
  SunMedium,
  MoonStar,
} from 'lucide-react'
import { notificationsApi, Notification } from '@/lib/api'
import { useTheme } from '@/components/providers/ThemeProvider'

export const Navbar = () => {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  const fetchNotifications = async () => {
    const res = await notificationsApi.getAll()

  if (!res.success || !res.data) {
    setNotifications([])
    setUnreadCount(0)
    return
  }

  setNotifications(res.data)

const unread = res.data.filter(n => !n.isRead).length
setUnreadCount(unread)
  }

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const handleLogout = () => {
    Cookies.remove('token')
    router.push('/auth/login')
  }

  const markAsRead = async (id: number) => {
    try {
      await notificationsApi.markAsRead(id)
      await fetchNotifications()
    } catch { }
  }

  const iconByType = (type: string) => {
    const t = type.toLowerCase()
    if (t === 'success') return <CheckCircle2 className="h-4 w-4 text-emerald-400" />
    if (t === 'error' || t === 'danger')
      return <AlertTriangle className="h-4 w-4 text-red-400" />
    return <Info className="h-4 w-4 text-brand-500" />
  }

  const formatDate = (dateString: string) => {
    const d = new Date(dateString)
    const now = new Date()
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000)
    if (diff < 60) return 'الآن'
    if (diff < 3600) return `${Math.floor(diff / 60)} دقيقة`
    if (diff < 86400) return `${Math.floor(diff / 3600)} ساعة`
    return `${Math.floor(diff / 86400)} يوم`
  }

  return (
     <header className="sticky top-0 z-30 border-b border-subtle bg-surface backdrop-blur-sm">
      <div className="flex items-center justify-between py-3 px-4 sm:px-6">
        {/* هوية المنصة */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-600 text-xs font-bold text-white">
            MS
          </div>

          <div className="flex flex-col">
            <h1 className="text-sm font-semibold text-main">
              mediScan
            </h1>
            <p className="text-[11px] text-muted">
              نظام إدارة المنصة الطبية
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* زر تبديل الثيم */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-subtle bg-soft text-main text-xs hover:opacity-80"
            title={theme === 'light' ? 'تفعيل الوضع الليلي' : 'تفعيل الوضع الفاتح'}
          >
            {theme === 'light' ? (
              <MoonStar className="h-4 w-4" />
            ) : (
              <SunMedium className="h-4 w-4" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen((v) => !v)}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-subtle bg-soft text-main hover:opacity-80"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -left-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {open && (
              <div className="absolute left-0 mt-2 w-80 max-h-96 overflow-hidden rounded-2xl border border-subtle bg-surface shadow-soft">
                <div className="flex items-center justify-between border-b border-subtle px-4 py-3">
                  <span className="text-sm font-semibold text-main">
                    الإشعارات
                  </span>
                  <button
                    onClick={() => {
                      setOpen(false)
                      router.push('/admin/notifications')
                    }}
                    className="text-[11px] text-brand-600 hover:text-brand-500"
                  >
                    عرض الكل
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-6 text-center text-xs text-muted">
                      لا توجد إشعارات حالياً
                    </div>
                  ) : (
                    <ul className="divide-y border-subtle">
                      {notifications.map((n) => (
                        <li
                          key={n.id}
                          className={`cursor-pointer px-4 py-3 text-xs hover:bg-soft ${!n.isRead ? 'bg-soft/60' : ''
                            }`}
                          onClick={() => {
                            if (!n.isRead) markAsRead(n.id)
                            setOpen(false)
                            router.push('/admin/notifications')
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5">{iconByType(n.type)}</div>
                            <div className="flex-1">
                              <p
                                className={
                                  n.isRead
                                    ? 'text-main'
                                    : 'font-semibold text-main'
                                }
                              >
                                {n.message}
                              </p>
                              <div className="mt-1 flex items-center gap-2 text-[11px] text-muted">
                                <span>{formatDate(n.createdAt)}</span>
                                <span className="h-1 w-1 rounded-full bg-muted" />
                                <span className="uppercase">{n.type}</span>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-xl bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-500"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>
    </header>
  )
}
