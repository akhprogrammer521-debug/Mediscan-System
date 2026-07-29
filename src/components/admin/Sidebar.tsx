'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Building2,
  Users,
  Pill,
  Bell,
  Settings,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'

const menuItems = [
  { href: '/admin/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
  { href: '/admin/pharmacies', label: 'الصيدليات', icon: Building2 },
  { href: '/admin/patients', label: 'المرضى', icon: Users },
  { href: '/admin/drugs', label: 'الأدوية', icon: Pill },
  { href: '/admin/settings', label: 'الإعدادات', icon: Settings },
]

export const Sidebar = () => {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--sidebar-width',
      collapsed ? '4.5rem' : '15rem'   
    )
  }, [collapsed])

  return (
    <aside
      className={`fixed top-0 right-0 h-screen z-40 flex flex-col  bg-surface transition-all duration-300 ${
        collapsed ? 'w-[4.5rem]' : 'w-60'
      }`}
    >
     
      {/* الشعار */}
      <div className="border-b border-subtle px-4 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-sm font-bold text-white"
          onClick={() => setCollapsed((v) => !v)}
          >
            MS
          </div>
          {!collapsed && (
            <div>
              <p className="text-sm font-semibold text-main">mediScan</p>
            </div>
          )}
        </div>
      </div>

      {/* القائمة */}
      <nav className="flex-1 overflow-y-auto px-2 pt-4 pb-6">
        <ul className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + '/')

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={[
                    'group flex items-center rounded-xl px-3 py-2 text-sm transition-colors border',
                    isActive
                      ? 'border-brand-500/70 bg-soft text-main'
                      : 'border-transparent text-muted hover:bg-soft hover:border-subtle',
                  ].join(' ')}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-soft text-main group-hover:bg-surface">
                    <Icon className="h-4 w-4" />
                  </span>
                  {!collapsed && (
                    <span className="mr-3 truncate text-[13px]">
                      {item.label}
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="border-t border-subtle px-3 py-3 text-[11px] text-muted">
        {!collapsed ? (
          <p>يمكنك إدارة الصيدليات والمرضى والأدوية من القائمة الجانبية.</p>
        ) : (
          <p className="text-center">⚙️</p>
        )}
      </div>
    </aside>

  )
}
