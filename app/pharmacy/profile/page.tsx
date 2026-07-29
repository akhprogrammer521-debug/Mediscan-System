'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import { pharmacistProfileApi, authToken } from '@/lib/api/api'
import type { PharmacistProfile } from '@/lib/api/api'
import { useToast } from '@/components/ui/toast/useToast'

import { ProfileHeader } from '@/components/pharmacy/profile/ProfileHeader'
import { ProfileGrid } from '@/components/pharmacy/profile/ProfileGrid'
import { PageSkeleton } from '@/components/pharmacy/shared/PageSkeleton'
import { SectionCard } from '@/components/pharmacy/shared/SectionCard'
import { StatusBadge } from '@/components/pharmacy/shared/StatusBadge'

import { ArrowRight, ShieldAlert } from 'lucide-react'

type AccountStatus = 'active' | 'inactive' | 'unknown'

export default function ProfilePage() {
  const router = useRouter()
  const { showToast } = useToast()
  const once = useRef(false)

  const [data, setData] = useState<PharmacistProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const run = async () => {
      try {
        setLoading(true)

        const res = await pharmacistProfileApi.getMyProfile()
        if (!mounted) return

        if (!res.success) {
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

          setLoading(false)
          return
        }

        setData(res.data)
      } catch {
        if (!once.current) {
          showToast('حدث خطأ غير متوقع أثناء تحميل الملف الشخصي', 'error')
          once.current = true
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    run()
    return () => {
      mounted = false
    }
  }, [router, showToast])

  /* =======================
     LOADING
  ======================= */
  if (loading) {
    return <PageSkeleton title="الملف الشخصي" />
  }

  /* =======================
     FAILED STATE
  ======================= */
  if (!data || !data.user) {
    return (
      <div className="space-y-6">
        <ProfileHeader
          pharmacyName=''
          username="—"
          email="—"
          userActive="unknown"
          pharmacyActive="unknown"
        />

        <SectionCard title="تعذر تحميل الملف الشخصي" icon={ShieldAlert}>
          <p className="text-sm text-muted">
            تحقق من تسجيل الدخول أو صلاحيات الحساب ثم أعد المحاولة.
          </p>

          <div className="mt-4 flex gap-2">
            <Link href="/login">
              <span className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm text-white">
                تسجيل الدخول <ArrowRight size={16} />
              </span>
            </Link>
          </div>
        </SectionCard>
      </div>
    )
  }

  /* =======================
     STATUS CALCULATION
  ======================= */
  const userActive: AccountStatus = data.user.isActive
    ? 'active'
    : 'inactive'

  const pharmacyActive: AccountStatus =
    data.pharmacy?.isActive === true
      ? 'active'
      : data.pharmacy?.isActive === false
        ? 'inactive'
        : 'unknown'

  /* =======================
     RENDER
  ======================= */
  return (
    <div className="space-y-6">
      <ProfileHeader
        pharmacyName={data.pharmacy ? data.pharmacy.name : '—'}
        username={data.user.username}
        email={data.user.email}
        userActive={userActive}
        pharmacyActive={pharmacyActive}
      />

      {pharmacyActive === 'inactive' && (
        <SectionCard
          title="تنبيه: حساب الصيدلية موقوف"
          description="لا يمكنك استخدام ميزات النظام حتى يتم تفعيل الحساب"
          className="border border-border/50"
        >
          <div className="flex items-start gap-3">
            <StatusBadge status="inactive" />
            <p className="text-sm text-muted">
              يرجى التواصل مع الإدارة لإعادة التفعيل.
            </p>
          </div>
        </SectionCard>
      )}

      <ProfileGrid data={data} />
    </div>
  )
}
