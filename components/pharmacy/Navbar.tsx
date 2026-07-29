'use client'

import { Menu, Bell, Moon, Sun, LogOut } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { pharmacistNotificationsApi } from '@/lib/api/api'

export function Navbar({
  onMenuClick,
}: {
  onMenuClick: () => void
}) {
  const { theme, toggleTheme, mounted } = useTheme()
  const router = useRouter()

  const [unreadCount, setUnreadCount] = useState(0)

  const loadUnreadCount = async () => {
    const res = await pharmacistNotificationsApi.getUnreadCount()
    if (res.success) {
      setUnreadCount(res.data)
    }
  }

  useEffect(() => {
  const init = async () => {
    await loadUnreadCount()
  }

  init()

  const interval = setInterval(loadUnreadCount, 15000)
  return () => clearInterval(interval)
}, [])


  const goToNotifications = () => {
    router.push('/pharmacy/notifications')
  }

  const logout = () => {
    localStorage.removeItem('pharmacy-token')
    window.location.href = '/login'
  }

  return (
    <header className="sticky top-0 z-20 h-14 bg-surface flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <button
          onClick={onMenuClick}
          className="md:hidden text-muted hover:text-text"
        >
          <Menu size={20} />
        </button>

        <p className="font-semibold text-sm">لوحة التحكم</p>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={goToNotifications}
          className="relative h-9 w-9 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 min-w-[16px] px-1 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        <button
          onClick={toggleTheme}
          className="h-9 w-9 rounded-full flex items-center justify-center text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950"
        >
          {!mounted ? (
            <Moon size={18} />
          ) : theme === 'light' ? (
            <Moon size={18} />
          ) : (
            <Sun size={18} />
          )}
        </button>

        <button
          onClick={logout}
          className="h-9 w-9 rounded-full flex items-center justify-center text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  )
}
