'use client'

import type { PharmacyStockItem } from '@/lib/api/api'
import { Card } from '@/components/ui/Card'
import { Package, AlertTriangle, XCircle, Layers } from 'lucide-react'

type Props = {
  items: PharmacyStockItem[]
}

export function InventoryStats({ items = [] }: { items: PharmacyStockItem[] } & Props) {
  const total = items.length
  const low = items.filter((x) => x.quantity > 0 && x.quantity <= 5).length
  const out = items.filter((x) => x.quantity === 0).length
  const totalUnits = items.reduce((acc, x) => acc + x.quantity, 0)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card title="عدد الأصناف" description="في المخزون">
        <div className="flex items-center justify-between">
          <p className="text-2xl font-semibold">{total}</p>
          <Package className="text-muted" size={20} />
        </div>
      </Card>

      <Card title="إجمالي الوحدات" description="مجموع الكميات">
        <div className="flex items-center justify-between">
          <p className="text-2xl font-semibold">{totalUnits}</p>
          <Layers className="text-muted" size={20} />
        </div>
      </Card>

      <Card title="منخفض" description="≤ 5 وحدات">
        <div className="flex items-center justify-between">
          <p className="text-2xl font-semibold">{low}</p>
          <AlertTriangle className="text-muted" size={20} />
        </div>
      </Card>

      <Card title="نفد" description="0 وحدات">
        <div className="flex items-center justify-between">
          <p className="text-2xl font-semibold">{out}</p>
          <XCircle className="text-muted" size={20} />
        </div>
      </Card>
    </div>
  )
}
