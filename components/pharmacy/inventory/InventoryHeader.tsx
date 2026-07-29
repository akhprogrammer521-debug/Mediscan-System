'use client'

import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { RefreshCcw, PackageSearch , Plus  } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Props = {
  query: string
  onQueryChange: (v: string) => void
  onRefresh: () => void
}

export function InventoryHeader({ query, onQueryChange, onRefresh }: Props) {
  const router = useRouter()
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 className="h1">المخزون</h1>
        <p className="text-sm text-muted">إدارة مخزون الصيدلية وتحديث الكميات</p>
      </div>

      <div className="flex gap-2 w-full sm:w-auto">
        <div className="relative flex-1 sm:w-[320px]">
          <PackageSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <Input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="ابحث باسم الدواء..."
            className="pl-10 bg-subtle"
          />
        </div>

        <button
          onClick={() => router.push('/pharmacy/inventory/create')}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm text-white transition hover:opacity-90"
        >
          <Plus size={16} />
          إضافة دواء
        </button>

        <Button variant="soft" onClick={onRefresh} className="gap-2">
          <RefreshCcw size={18} />
          تحديث
        </Button>
      </div>
    </div>
  )
}