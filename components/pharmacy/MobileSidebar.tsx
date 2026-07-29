'use client'

import Link from 'next/link'
import { pharmacySidebar } from '@/config/pharmacySidebar'
import { cn } from '@/lib/cn'

type Props = {
  open: boolean
  onClose: () => void
}

export function MobileSidebar({ open, onClose }: Props) {
  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <aside
        className={cn(
          'fixed z-50 inset-y-0 left-0 w-64 bg-surface border-r transform transition-transform md:hidden',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="h-14 flex items-center px-4 font-semibold border-b">
          Pharmacy Panel
        </div>

        <nav className="px-2 py-4 space-y-4">
          {pharmacySidebar.map((group) => (
            <div key={group.label}>
              <p className="px-3 mb-1 text-xs font-semibold text-muted">
                {group.label}
              </p>

              <div className="flex flex-col gap-1">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className="rounded-xl px-3 py-2 text-sm hover:bg-subtle transition"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>
    </>
  )
}
