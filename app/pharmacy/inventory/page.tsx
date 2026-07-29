'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authToken, pharmacistStockApi } from '@/lib/api/api'
import type { PharmacyStockItem } from '@/lib/api/api'
import { useToast } from '@/components/ui/toast/useToast'
import { InventoryHeader } from '@/components/pharmacy/inventory/InventoryHeader'
import { InventoryStats } from '@/components/pharmacy/inventory/InventoryStats'
import { StockTable } from '@/components/pharmacy/inventory/StockTable'
import { PageSkeleton } from '@/components/pharmacy/shared/PageSkeleton'
import { SectionCard } from '@/components/pharmacy/shared/SectionCard'
import { AlertTriangle } from 'lucide-react'

type ViewState = 'loading' | 'ready' | 'error'

export default function InventoryPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const once = useRef(false)

  const [state, setState] = useState<ViewState>('loading')
  const [items, setItems] = useState<PharmacyStockItem[]>([])
  const [query, setQuery] = useState('')

  /* ================= FILTER ================= */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items

    return items.filter((it) => {
      const name =
        it.drug?.name?.toLowerCase() ??
        it.customDrug?.name?.toLowerCase() ??
        ''

      return name.includes(q)
    })
  }, [items, query])

  /* ================= LOAD ================= */
  const load = async () => {
    setState('loading')
    const res = await pharmacistStockApi.getStock()

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

  /* ================= UPDATE (QTY + PRICE) ================= */
  const handleUpdate = async (
    stockId: number,
    quantity: number,
    price: number
  ) => {
    const res = await pharmacistStockApi.update(stockId, {
      quantity,
      price,
    })

    if (!res.success) {
      showToast(res.error, 'error')
      return
    }

    showToast('تم تحديث الكمية والسعر', 'success')
    setItems((prev) =>
      prev.map((x) => (x.id === stockId ? res.data : x))
    )
  }

  /* ================= REMOVE ================= */
  const handleRemove = async (stockId: number) => {
    const res = await pharmacistStockApi.remove(stockId)

    if (!res.success) {
      showToast(res.error, 'error')
      await load()
      return
    }

    showToast('تم حذف الدواء من المخزون', 'success')
    await load()
  }

  /* ================= STATES ================= */
  if (state === 'loading') {
    return <PageSkeleton title="المخزون" />
  }

  if (state === 'error') {
    return (
      <div className="space-y-6 page-animate">
        <InventoryHeader
          query={query}
          onQueryChange={setQuery}
          onRefresh={load}
        />

        <SectionCard
          title="تعذر تحميل المخزون"
          icon={AlertTriangle}
          description="تحقق من تسجيل الدخول ثم أعد المحاولة."
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

  /* ================= READY ================= */
  return (
    <div className="space-y-6 page-animate">
      <InventoryHeader
        query={query}
        onQueryChange={setQuery}
        onRefresh={load}
      />

      <InventoryStats items={items} />

      <StockTable
        items={filtered}
        onUpdate={handleUpdate}
        onRemove={handleRemove}
      />
    </div>
  )
}
