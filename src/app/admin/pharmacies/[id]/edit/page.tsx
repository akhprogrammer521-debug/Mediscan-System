'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { pharmaciesApi, type Pharmacy, type UpdatePharmacyInput } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import { AdminShell } from '@/components/admin/AdminShell'
import { PageWrapper } from '@/components/admin/PageWrapper'

export default function EditPharmacyPage() {
  const router = useRouter()
  const params = useParams()
  const id = Number(params.id)

  const [form, setForm] = useState<UpdatePharmacyInput>({
    name: '',
    address: '',
    phone: '',
    licenseNumber: '',
    licenseIssuedAt: '',
    licenseExpiresAt: '',
    latitude: null,
    longitude: null,
  })

  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const loadPharmacy = async () => {
    try {
      setLoading(true)
      const res = await pharmaciesApi.getById(id)

      if (res.success && res.data) {
        const p = res.data as Pharmacy

        setForm({
          name: p.name,
          address: p.address,
          phone: p.phone,
          licenseNumber: p.licenseNumber,
          licenseIssuedAt: p.licenseIssuedAt ? toDatetimeLocal(p.licenseIssuedAt) : '',
          licenseExpiresAt: p.licenseExpiresAt ? toDatetimeLocal(p.licenseExpiresAt) : '',
          latitude: p.latitude ?? null,
          longitude: p.longitude ?? null,
        })

        setIsActive(!!p.isActive)
      } else {
        setError(res.error || 'تعذّر تحميل بيانات الصيدلية')
      }
    } catch {
      setError('خطأ غير متوقع أثناء تحميل البيانات')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPharmacy()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = (field: keyof UpdatePharmacyInput, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      // ✅ تحديث بيانات الصيدلية
      const res = await pharmaciesApi.update(id, {
        ...form,
        // رجّع التواريخ إلى ISO readable للباك (datetime string)
        licenseIssuedAt: form.licenseIssuedAt ? new Date(form.licenseIssuedAt).toISOString() : undefined,
        licenseExpiresAt: form.licenseExpiresAt ? new Date(form.licenseExpiresAt).toISOString() : undefined,
      })

      if (!res.success) {
        setError(res.error || 'فشل تعديل بيانات الصيدلية')
        return
      }

      // ✅ تحديث الحالة عبر endpoint الصحيح
      const statusRes = await pharmaciesApi.toggleStatus(id, isActive)
      if (!statusRes.success) {
        setError(statusRes.error || 'فشل تحديث حالة الصيدلية')
        return
      }

      setIsSuccess(true)
      setTimeout(() => router.push('/admin/pharmacies'), 900)
    } catch {
      setError('حدث خطأ غير متوقع أثناء الحفظ')
    } finally {
      setSaving(false)
    }
  }

  if (isSuccess) {
    return (
      <AdminShell>
        <PageWrapper title="الصيدليات" subtitle="تم تعديل بيانات الصيدلية بنجاح">
          <div className="flex min-h-[40vh] items-center justify-center">
            <div className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
                <CheckCircle className="h-8 w-8 text-emerald-400" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-main">تم تعديل بيانات الصيدلية بنجاح</h2>
              <p className="text-sm text-muted">سيتم تحويلك إلى قائمة الصيدليات...</p>
            </div>
          </div>
        </PageWrapper>
      </AdminShell>
    )
  }

  if (loading) {
    return (
      <AdminShell>
        <PageWrapper title="تعديل الصيدلية">
          <p className="p-8 text-muted text-center">جاري التحميل...</p>
        </PageWrapper>
      </AdminShell>
    )
  }

  return (
    <AdminShell>
      <PageWrapper title="تعديل الصيدلية" subtitle="تحديث معلومات الصيدلية">
        <div className="mb-4 flex items-center gap-3">
          <button
            title="رجوع"
            onClick={() => router.back()}
            className="rounded-xl border border-subtle bg-soft p-2 text-muted transition hover:bg-surface"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-2 rounded-xl border border-rose-400 bg-rose-900/40 px-4 py-3 text-sm text-rose-100">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="rounded-2xl border border-subtle bg-surface p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-main mb-2">اسم الصيدلية *</label>
              <input
                type="text"
                value={form.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full rounded-xl border border-subtle bg-soft px-4 py-2.5 text-main placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-main mb-2">رقم الترخيص *</label>
              <input
                type="text"
                value={form.licenseNumber || ''}
                onChange={(e) => handleChange('licenseNumber', e.target.value)}
                className="w-full rounded-xl border border-subtle bg-soft px-4 py-2.5 text-main placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-600"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-main mb-2">العنوان *</label>
              <input
                type="text"
                value={form.address || ''}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full rounded-xl border border-subtle bg-soft px-4 py-2.5 text-main placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-main mb-2">رقم الهاتف *</label>
              <input
                type="text"
                value={form.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full rounded-xl border border-subtle bg-soft px-4 py-2.5 text-main placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-main mb-2">تاريخ إصدار الترخيص</label>
              <input
                type="datetime-local"
                value={form.licenseIssuedAt || ''}
                onChange={(e) => handleChange('licenseIssuedAt', e.target.value)}
                className="w-full rounded-xl border border-subtle bg-soft px-4 py-2.5 text-main focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-main mb-2">تاريخ انتهاء الترخيص</label>
              <input
                type="datetime-local"
                value={form.licenseExpiresAt || ''}
                onChange={(e) => handleChange('licenseExpiresAt', e.target.value)}
                className="w-full rounded-xl border border-subtle bg-soft px-4 py-2.5 text-main focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
            </div>

            <div className="col-span-2 flex items-center gap-3 mt-2">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-5 w-5 rounded border-subtle bg-soft text-brand-600 focus:ring-brand-600"
              />
              <label className="text-sm text-main font-medium">الصيدلية نشطة (فعّالة)</label>
            </div>
          </div>

          <Button type="submit" className="w-full py-3 text-base font-semibold" isLoading={saving}>
            حفظ التعديلات
          </Button>
        </form>
      </PageWrapper>
    </AdminShell>
  )
}

function toDatetimeLocal(dateString: string) {
  // يحوّل ISO إلى شكل مناسب لـ datetime-local
  const d = new Date(dateString)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}
