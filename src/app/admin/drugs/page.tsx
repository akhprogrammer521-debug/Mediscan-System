'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { drugsApi, Drug } from '@/lib/api'
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Pill,
  FlaskConical,
  AlertTriangle,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { AdminShell } from '@/components/admin/AdminShell'
import { PageWrapper } from '@/components/admin/PageWrapper'

export default function DrugsPage() {
  const router = useRouter()
  const [drugs, setDrugs] = useState<Drug[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const fetchDrugs = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await drugsApi.getAll()

      if (response.success && response.data) {
        setDrugs(response.data)
      } else {
        setError(response.error || 'فشل تحميل الأدوية')
      }
    } catch {
      setError('حدث خطأ غير متوقع')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDrugs()
  }, [])

  // فلترة Front فقط (لأن الباك اند لا يدعم search في /admin/drugs)
  const filteredDrugs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return drugs

    return drugs.filter((d) => {
      const hay = [
        d.name,
        d.strength,
        d.composition,
        d.indications,
        d.dosage,
        d.warnings,
        d.contraindications,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return hay.includes(q)
    })
  }, [drugs, searchQuery])

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا الدواء؟ هذا الإجراء غير قابل للاسترجاع.')) return

    try {
      setDeleteId(id)
      const response = await drugsApi.delete(id)

      if (response.success) {
        await fetchDrugs()
      } else {
        alert(response.error || 'فشل حذف الدواء')
      }
    } catch {
      alert('حدث خطأ غير متوقع')
    } finally {
      setDeleteId(null)
    }
  }

  const getInfoPreview = (drug: Drug): string => {
    const parts: string[] = []
    if (drug.indications)
      parts.push(`الاستخدامات: ${drug.indications.substring(0, 30)}...`)
    if (drug.dosage)
      parts.push(`الجرعة: ${drug.dosage.substring(0, 25)}...`)
    return parts.length ? parts.join(' • ') : 'لا توجد معلومات إضافية'
  }

  return (
    <AdminShell>
      <PageWrapper title="الأدوية" subtitle="إدارة قاعدة بيانات الأدوية والمعلومات الطبية">
        {error && (
          <div className="mb-4 rounded-xl border border-red-400 bg-red-900/40 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div />
          <Button
            onClick={() => router.push('/admin/drugs/create')}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>إضافة دواء</span>
          </Button>
        </div>

        <div className="rounded-2xl border border-subtle bg-surface mb-6">
          <div className="p-5 border-b border-subtle">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="ابحث باسم الدواء، التركيب، الاستخدامات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-subtle bg-soft px-4 py-2.5 pr-10 text-main placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 rounded-xl bg-soft animate-pulse" />
              ))}
            </div>
          ) : filteredDrugs.length === 0 ? (
            <div className="p-12 text-center">
              <Pill className="mx-auto mb-4 h-16 w-16 text-muted" />
              <p className="text-main text-lg font-medium">لا يوجد أدوية</p>
              <p className="text-muted text-sm mt-2">
                {searchQuery ? 'جرّب تعديل كلمات البحث.' : 'ابدأ بإضافة دواء جديد.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-soft border-b border-subtle">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-main">معلومات الدواء</th>
                    <th className="px-6 py-4 text-xs font-semibold text-main">التركيب</th>
                    <th className="px-6 py-4 text-xs font-semibold text-main">تفاصيل طبية</th>
                    <th className="px-6 py-4 text-xs font-semibold text-main">تحذيرات</th>
                    <th className="px-6 py-4 text-xs font-semibold text-main text-right pr-8">إجراءات</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-subtle">
                  {filteredDrugs.map((drug) => (
                    <tr key={drug.id} className="hover:bg-soft transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-soft text-brand-600">
                            <Pill className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-main font-semibold">
                              {drug.name} <span className="text-muted text-xs">({drug.strength})</span>
                            </p>
                            <p className="text-muted text-xs"># {drug.id}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-main">
                        <div className="flex items-center gap-2 text-sm">
                          <FlaskConical className="h-4 w-4 text-muted" />
                          <span className="truncate max-w-xs">{drug.composition}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 max-w-md text-sm text-main">
                        <div className="truncate">{getInfoPreview(drug)}</div>
                      </td>

                      <td className="px-6 py-4 text-sm">
                        {drug.warnings || drug.contraindications ? (
                          <div className="flex items-center gap-2 text-orange-500">
                            <AlertTriangle className="h-4 w-4" />
                            <span>يحتوي تحذيرات</span>
                          </div>
                        ) : (
                          <span className="text-muted">لا يوجد</span>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-left">
                        <div className="flex items-center justify-start gap-2">
                          <button
                            onClick={() => router.push(`/admin/drugs/${drug.id}`)}
                            title="تعديل"
                            className="rounded-lg p-2 text-brand-600 hover:bg-brand-600/10 transition"
                          >
                            <Edit className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => handleDelete(drug.id)}
                            disabled={deleteId === drug.id}
                            title="حذف"
                            className="rounded-lg p-2 text-red-500 hover:bg-red-500/10 transition disabled:opacity-50"
                          >
                            <Trash2 className="h-4 w-4" />
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
