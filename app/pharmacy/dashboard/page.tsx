'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import { pharmacistDashboardApi, authToken } from '@/lib/api/api'
import type { PharmacistDashboardResponse } from '@/lib/api/api'
import { useToast } from '@/components/ui/toast/useToast'

import { DashboardHeader } from '@/components/pharmacy/dashboard/DashboardHeader'
import { StatCard } from '@/components/pharmacy/dashboard/StatCard'
import { QuickActions } from '@/components/pharmacy/dashboard/QuickActions'
import { NotificationsCard } from '@/components/pharmacy/dashboard/NotificationsCard'
import { OrdersStatusDonut } from '@/components/pharmacy/dashboard/charts/OrdersStatusDonut'
import { StockHealthBar } from '@/components/pharmacy/dashboard/charts/StockHealthBar'
import { PageSkeleton } from '@/components/pharmacy/shared/PageSkeleton'
import { SectionCard } from '@/components/pharmacy/shared/SectionCard'

import {
  Package,
  ShoppingCart,
  CheckCircle2,
  XCircle,
  ScanLine,
  ArrowRight,
  Activity,
} from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const hasHandledAuthError = useRef(false)

  const [data, setData] = useState<PharmacistDashboardResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const run = async () => {
      setLoading(true)
      const res = await pharmacistDashboardApi.getDashboard()

      if (!mounted) return

      if (!res.success) {
        setLoading(false)

        // Toast مرة واحدة فقط
        if (!hasHandledAuthError.current) {
          showToast(res.error, 'error')
          hasHandledAuthError.current = true
        }

        // 401 / invalid token
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

      setData(res.data)
      setLoading(false)
    }

    run()
    return () => {
      mounted = false
    }
  }, [router, showToast])

  const stats = useMemo(() => {
    const s = data?.stats
    return {
      stockCount: s?.stockCount ?? 0,
      pendingOrders: s?.pendingOrders ?? 0,
      completedOrders: s?.completedOrders ?? 0,
      rejectedOrders: s?.rejectedOrders ?? 0,
    }
  }, [data])

  if (loading) return <PageSkeleton title="لوحة التحكم" />

  // في حال فشل التحميل وما في data
  if (!data) {
    return (
      <div className="space-y-6">
        <DashboardHeader
          pharmacyName="—"
          subtitle="تعذر تحميل بيانات لوحة التحكم"
          status="unknown"
        />
        <SectionCard title="ملاحظة">
          <div className="text-sm text-muted">
            تحقق من تسجيل الدخول أو صلاحيات الحساب ثم أعد المحاولة.
          </div>

          <div className="mt-4 flex gap-2">
            <Link href="/login" className="inline-flex">
              <span className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-white text-sm">
                تسجيل الدخول <ArrowRight size={16} />
              </span>
            </Link>
          </div>
        </SectionCard>
      </div>
    )
  }

  const pharmacyName = data.pharmacy?.name ?? 'صيدليتي'
  const pharmacyStatus: 'active' | 'inactive' | 'unknown' =
    data.pharmacy ? 'active' : 'unknown'

  return (
    <div className="space-y-6">
      <DashboardHeader
        pharmacyName={pharmacyName}
        subtitle="نظرة عامة على نشاط الصيدلية، الإحصائيات والعمليات السريعة"
        status={pharmacyStatus}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="المخزون"
          subtitle="عدد الأدوية المتوفرة"
          value={stats.stockCount}
          icon={Package}
          tone={stats.stockCount <= 0 ? 'danger' : stats.stockCount < 10 ? 'warning' : 'good'}
        />
        <StatCard
          title="طلبات معلّقة"
          subtitle="بانتظار المعالجة"
          value={stats.pendingOrders}
          icon={ShoppingCart}
          tone={stats.pendingOrders > 0 ? 'info' : 'neutral'}
        />
        <StatCard
          title="طلبات مكتملة"
          subtitle="تم تسليمها بنجاح"
          value={stats.completedOrders}
          icon={CheckCircle2}
          tone="good"
        />
        <StatCard
          title="طلبات مرفوضة"
          subtitle="تم رفضها"
          value={stats.rejectedOrders}
          icon={XCircle}
          tone={stats.rejectedOrders > 0 ? 'warning' : 'neutral'}
        />
      </div>

      {/* Charts + Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <SectionCard
          title="تحليلات الطلبات"
          description="توزيع الحالات ونظرة سريعة"
          icon={Activity}
          className="xl:col-span-2"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <OrdersStatusDonut
              pending={stats.pendingOrders}
              completed={stats.completedOrders}
              rejected={stats.rejectedOrders}
            />
            <StockHealthBar stockCount={stats.stockCount} />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/pharmacy/orders" className="inline-flex">
              <span className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-white text-sm">
                إدارة الطلبات <ArrowRight size={16} />
              </span>
            </Link>

            <Link href="/pharmacy/inventory" className="inline-flex">
              <span className="inline-flex items-center gap-2 rounded-xl bg-subtle px-4 py-2 text-sm text-text border border-border/40">
                فتح المخزون <Package size={16} />
              </span>
            </Link>

            <Link href="/pharmacy/ocr/prescription" className="inline-flex">
              <span className="inline-flex items-center gap-2 rounded-xl bg-subtle px-4 py-2 text-sm text-text border border-border/40">
                مسح وصفة <ScanLine size={16} />
              </span>
            </Link>
          </div>
        </SectionCard>

        <QuickActions />
      </div>

      {/* Notifications */}
      <NotificationsCard notifications={data.notifications ?? []} />
    </div>
  )
}
