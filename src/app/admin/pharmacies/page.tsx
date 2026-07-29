'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { pharmaciesApi, type Pharmacy } from '@/lib/api'
import {
  Search,
  Plus,
  Edit,
  Eye,
  Building2,
  MapPin,
  Phone,
  Settings,
  ToggleLeft,
  ToggleRight,
  User2,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { AdminShell } from '@/components/admin/AdminShell'
import { PageWrapper } from '@/components/admin/PageWrapper'

export default function PharmaciesPage() {
  const router = useRouter()
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<number | null>(null)

  const fetchPharmacies = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // ✅ لا يوجد search في الباك
      const response = await pharmaciesApi.getAll()

      if (response.success && response.data) {
        setPharmacies(response.data)
      } else {
        setError(response.error || 'فشل تحميل بيانات الصيدليات')
      }
    } catch {
      setError('حدث خطأ غير متوقع')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPharmacies()
  }, [])

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return pharmacies

    return pharmacies.filter((p) => {
      const pharmacistUsername = p.pharmacist?.user?.username?.toLowerCase() || ''
      const pharmacistEmail = p.pharmacist?.user?.email?.toLowerCase() || ''
      return (
        p.name.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.phone.toLowerCase().includes(q) ||
        p.licenseNumber.toLowerCase().includes(q) ||
        pharmacistUsername.includes(q) ||
        pharmacistEmail.includes(q)
      )
    })
  }, [pharmacies, searchQuery])

  
  const handleToggleStatus = async (pharmacy: Pharmacy) => {
    try {
      setBusyId(pharmacy.id)
      const res = await pharmaciesApi.toggleStatus(pharmacy.id, !pharmacy.isActive)
      if (res.success) {
        await fetchPharmacies()
      } else {
        alert(res.error || 'فشل تغيير الحالة')
      }
    } catch {
      alert('حدث خطأ غير متوقع')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <AdminShell>
      <PageWrapper title="الصيدليات" subtitle="إدارة بيانات الصيدليات وحسابات الدخول">
        {error && (
          <div className="mb-4 rounded-xl border border-red-400 bg-red-900/40 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        )}

        <div className="mb-4 flex items-center justify-between">
          <div />
          <Button
            onClick={() => router.push('/admin/pharmacies/create')}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>إضافة صيدلية</span>
          </Button>
        </div>

        <div className="mb-6 rounded-2xl border border-subtle bg-surface">
          <div className="border-b border-subtle p-5">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="ابحث (اسم الصيدلية / العنوان / الهاتف / الترخيص / اسم المستخدم / الإيميل)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-subtle bg-soft px-4 py-2.5 pr-10 text-main placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4 p-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 animate-pulse rounded-xl bg-soft" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <Building2 className="mx-auto mb-4 h-16 w-16 text-muted" />
              <p className="text-lg font-medium text-main">لا توجد صيدليات</p>
              <p className="mt-2 text-sm text-muted">
                {searchQuery ? 'جرّب تعديل كلمات البحث.' : 'ابدأ بإضافة صيدلية جديدة.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="border-b border-subtle bg-soft">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-main">الصيدلية</th>
                    <th className="px-6 py-4 text-xs font-semibold text-main">العنوان</th>
                    <th className="px-6 py-4 text-xs font-semibold text-main">التواصل</th>
                    <th className="px-6 py-4 text-xs font-semibold text-main">رقم الترخيص</th>
                    <th className="px-6 py-4 text-xs font-semibold text-main">الحالة</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-main">
                      <div className="flex items-center justify-start gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-soft text-muted">
                          <Settings className="h-3.5 w-3.5" />
                        </div>
                        <span>إجراءات</span>
                      </div>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-subtle bg-surface">
                  {filtered.map((pharmacy) => (
                    <tr key={pharmacy.id} className="transition-colors hover:bg-soft">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-soft text-brand-600">
                            <Building2 className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-semibold text-main">{pharmacy.name}</p>
                            <p className="mt-0.5 flex items-center gap-2 text-xs text-muted">
                              <User2 className="h-3.5 w-3.5" />
                              <span dir="ltr">
                                {pharmacy.pharmacist?.user?.username || '—'}
                              </span>
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-sm text-main">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted" />
                          <span>{pharmacy.address}</span>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="space-y-1 text-sm text-main">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted" />
                            <span dir="ltr">{pharmacy.phone}</span>
                          </div>
                          <div className="text-xs text-muted" dir="ltr">
                            {pharmacy.pharmacist?.user?.email || ''}
                          </div>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="rounded-lg bg-soft px-2 py-1 text-xs font-mono text-main">
                          {pharmacy.licenseNumber}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${pharmacy.isActive
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-rose-500/10 text-rose-400'
                            }`}
                        >
                          {pharmacy.isActive ? 'فعّالة' : 'موقوفة'}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-left text-sm">
                        <div className="flex items-center justify-start gap-2">
                          <button
                            onClick={() => router.push(`/admin/pharmacies/${pharmacy.id}/edit`)}
                            className="rounded-lg p-2 text-brand-600 transition hover:bg-brand-600/10"
                            title="تعديل"
                          >
                            <Edit className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => handleToggleStatus(pharmacy)}
                            disabled={busyId === pharmacy.id}
                            className="rounded-lg p-2 text-sky-500 transition hover:bg-sky-500/10 disabled:opacity-50"
                            title={pharmacy.isActive ? 'إيقاف' : 'تفعيل'}
                          >
                            {pharmacy.isActive ? (
                              <ToggleRight className="h-4 w-4" />
                            ) : (
                              <ToggleLeft className="h-4 w-4" />
                            )}
                          </button>

                          <button
                            onClick={() =>
                              router.push(`/admin/pharmacies/${pharmacy.id}`)
                            }
                            className="rounded-lg p-2 text-sky-600 transition hover:bg-sky-600/10"
                            title="عرض الملف الكامل"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}
        </div>
      </PageWrapper>
    </AdminShell>
  )
}
