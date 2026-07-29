'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { SectionCard } from '@/components/pharmacy/shared/SectionCard'
import { ScanLine, FileText, Layers, Package, ShoppingCart, ArrowRight } from 'lucide-react'

const items = [
  { title: 'مسح دواء', desc: 'OCR وتحليل سريع', href: '/pharmacy/ocr/drug', icon: ScanLine },
  { title: 'مسح وصفة', desc: 'استخراج بيانات الوصفة', href: '/pharmacy/ocr/prescription', icon: FileText },
  { title: 'مقارنة أدوية', desc: 'تداخلات وتحذيرات', href: '/pharmacy/compare', icon: Layers },
  { title: 'المخزون', desc: 'إدارة كميات الأدوية', href: '/pharmacy/inventory', icon: Package },
  { title: 'الطلبات', desc: 'قبول/رفض/إكمال', href: '/pharmacy/orders', icon: ShoppingCart },
]

export function QuickActions() {
  return (
    <SectionCard title="عمليات سريعة" description="اختصارات للمهام اليومية" icon={ArrowRight}>
      <div className="space-y-3">
        {items.map((it, idx) => {
          const Icon = it.icon
          return (
            <motion.div
              key={it.href}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link
                href={it.href}
                className="group flex items-center justify-between rounded-2xl border border-border/40 bg-bg/40 px-4 py-3 hover:bg-bg/60 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon size={18} />
                  </span>
                  <div>
                    <div className="text-sm font-semibold">{it.title}</div>
                    <div className="text-xs text-muted">{it.desc}</div>
                  </div>
                </div>

                <span className="text-xs text-muted group-hover:text-text transition">فتح</span>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </SectionCard>
  )
}
