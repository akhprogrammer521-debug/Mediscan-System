'use client'

import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { RefreshCcw, Database, Search } from 'lucide-react'

type Props = {
  query: string
  onQueryChange: (v: string) => void
  onRefresh: () => void
}

export function DatabaseHeader({ query, onQueryChange, onRefresh }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 className="h1">قاعدة الأدوية</h1>
        <p className="text-sm text-muted">بحث واستعراض الأدوية وإضافتها للمخزون</p>
      </div>

      <div className="flex gap-2 w-full sm:w-auto">
        <div className="relative flex-1 sm:w-[360px]">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <Input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="ابحث باسم الدواء..."
            className="pl-10 bg-subtle"
          />
        </div>

        <Button variant="soft" onClick={onRefresh} className="gap-2">
          <RefreshCcw size={18} />
          تحديث
        </Button>

        <Button variant="soft" className="gap-2" type="button">
          <Database size={18} />
          قاعدة
        </Button>
      </div>
    </div>
  )
}
