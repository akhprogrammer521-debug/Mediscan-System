'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  authToken,
  pharmacistSettingsApi,
  pharmacistProfileApi,
} from '@/lib/api/api'
import type { PharmacistSetting } from '@/lib/api/api'
import { useToast } from '@/components/ui/toast/useToast'

import { PageSkeleton } from '@/components/pharmacy/shared/PageSkeleton'
import { SettingsSection } from '@/components/pharmacy/settings/SettingsSection'
import { GeneralSettings } from '@/components/pharmacy/settings/GeneralSettings'
import { AccountSettings } from '@/components/pharmacy/settings/AccountSettings'
import { SectionCard } from '@/components/pharmacy/shared/SectionCard'
import { Settings2 } from 'lucide-react'

type ViewState = 'loading' | 'ready' | 'error'

export default function SettingsPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const once = useRef(false)

  const [state, setState] = useState<ViewState>('loading')
  const [items, setItems] = useState<PharmacistSetting[]>([])
  const [saving, setSaving] = useState(false)

  /* ================= LOAD SETTINGS ================= */

  const load = async () => {
    setState('loading')
    const res = await pharmacistSettingsApi.getSettings()

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

  /* ================= STATE HELPERS ================= */

  const record = useMemo(() => {
    const r: Record<string, string> = {}
    for (const s of items) r[s.key] = s.value
    return r
  }, [items])

  const updateKey = (key: string, value: string) => {
    setItems((prev) => {
      const idx = prev.findIndex((x) => x.key === key)
      if (idx === -1) return [...prev, { key, value }]
      const copy = [...prev]
      copy[idx] = { key, value }
      return copy
    })
  }

  const removeKey = (key: string) => {
    setItems((prev) => prev.filter((x) => x.key !== key))
  }

  /* ================= SAVE ================= */

  const save = async () => {
    setSaving(true)

    const res = await pharmacistSettingsApi.updateSettings(items)
    if (!res.success) {
      setSaving(false)
      showToast(res.error, 'error')
      return
    }

    const profileRes = await pharmacistProfileApi.getMyProfile()
    if (profileRes.success) {
      window.dispatchEvent(
        new CustomEvent('pharmacy:profile-updated', {
          detail: profileRes.data,
        })
      )
    }

    setSaving(false)
    showToast('تم حفظ الإعدادات', 'success')
    await load()
  }

  /* ================= UI STATES ================= */

  if (state === 'loading') return <PageSkeleton title="الإعدادات" />

  if (state === 'error') {
    return (
      <div className="space-y-6 page-animate">
        <SectionCard
          title="الإعدادات"
          icon={Settings2}
          description="تعذر تحميل الإعدادات"
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

  /* ================= RENDER ================= */

  return (
    <div className="space-y-6 page-animate">
      <SettingsSection saving={saving} onSave={save} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <GeneralSettings values={record} onChange={updateKey} />
        <AccountSettings values={record} onChange={updateKey} />
      </div>

      {/* إعدادات متقدمة */}
      <SectionCard
        title="إعدادات متقدمة"
        description="عرض كل المفاتيح وإمكانية تعديلها مباشرة"
      >
        {items.length === 0 ? (
          <div className="rounded-2xl border border-border/60 bg-subtle/40 p-4 text-sm text-muted">
            لا توجد إعدادات محفوظة حاليًا.
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((s) => (
              <div
                key={s.key}
                className="flex flex-col gap-2 rounded-2xl border border-border/60 bg-surface p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate">{s.key}</div>
                  <div className="text-xs text-muted truncate">{s.value}</div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => removeKey(s.key)}
                    className="rounded-xl border border-border/60 px-3 py-2 text-sm hover:bg-subtle/40"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  )
}
