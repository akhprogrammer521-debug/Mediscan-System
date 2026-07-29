'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authToken, pharmacistOrdersApi } from '@/lib/api/api'
import type { PharmacistOrder } from '@/lib/api/api'
import { useToast } from '@/components/ui/toast/useToast'
import { OrdersHeader } from '@/components/pharmacy/orders/OrdersHeader'
import { OrdersFilters } from '@/components/pharmacy/orders/OrdersFilters'
import { OrdersTable } from '@/components/pharmacy/orders/OrdersTable'
import { PageSkeleton } from '@/components/pharmacy/shared/PageSkeleton'
import { SectionCard } from '@/components/pharmacy/shared/SectionCard'
import { AlertTriangle } from 'lucide-react'

type ViewState = 'loading' | 'ready' | 'error'
type OrderFilter = 'ALL' | 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED'

export default function OrdersPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const once = useRef(false)

  const [state, setState] = useState<ViewState>('loading')
  const [orders, setOrders] = useState<PharmacistOrder[]>([])
  const [filter, setFilter] = useState<OrderFilter>('ALL')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
  const q = query.trim().toLowerCase()
  let list = orders
  if (filter !== 'ALL') list = list.filter((o) => o.status === filter)
  if (!q) return list

  return list.filter((o) => {
    const fullName = o.patient
      ? `${o.patient.firstName} ${o.patient.lastName}`.toLowerCase()
      : ''
    return (
      (o.drugName ?? '').toLowerCase().includes(q) ||
      fullName.includes(q) ||
      String(o.id).includes(q)
    )
  })
}, [orders, filter, query])


  const load = async () => {
    setState('loading')
    const res = await pharmacistOrdersApi.getOrders()

    if (!res.success) {
      setState('error')

      if (!once.current) {
        showToast(res.error, 'error')
        once.current = true
      }

      const msg = (res.error || '').toLowerCase()
      if (msg.includes('unauthorized') || msg.includes('token')) {
        authToken.remove()
        router.replace('/login')
      }
      return
    }

    setOrders(res.data ?? [])
    setState('ready')
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ✅ التعديل هنا فقط (منطقي – بدون تغيير UI)
  const updateStatus = async (
    orderId: number,
    status: 'ACCEPTED' | 'REJECTED' | 'COMPLETED'
  ) => {
    const res =
      status === 'ACCEPTED'
        ? await pharmacistOrdersApi.accept(orderId)
        : await pharmacistOrdersApi.updateStatus(orderId, status)

    if (!res.success) {
      showToast(res.error, 'error')
      return
    }

    showToast('تم تحديث حالة الطلب', 'success')
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? res.data : o))
    )
  }

  if (state === 'loading') return <PageSkeleton title="الطلبات" />

  if (state === 'error') {
    return (
      <div className="space-y-6 page-animate">
        <OrdersHeader query={query} onQueryChange={setQuery} onRefresh={load} />
        <SectionCard
          title="تعذر تحميل الطلبات"
          icon={AlertTriangle}
          description="تحقق من الاتصال والصلاحيات ثم أعد المحاولة."
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

  return (
    <div className="space-y-6 page-animate">
      <OrdersHeader query={query} onQueryChange={setQuery} onRefresh={load} />
      <OrdersFilters value={filter} onChange={setFilter} orders={orders} />
      <OrdersTable orders={filtered} onUpdateStatus={updateStatus} />
    </div>
  )
}
