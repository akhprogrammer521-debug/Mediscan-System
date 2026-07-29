'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { usersApi, Patient } from '@/lib/api'
import {
  Search,
  Eye,
  ToggleLeft,
  ToggleRight,
  User,
  Mail,
  Calendar,
  Activity,
} from 'lucide-react'
import { AdminShell } from '@/components/admin/AdminShell'
import { PageWrapper } from '@/components/admin/PageWrapper'

export default function PatientsPage() {
  const router = useRouter()
  const [patients, setPatients] = useState<Patient[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPatients = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await usersApi.getPatients(searchQuery || undefined)

      if (response.success && response.data) {
        setPatients(response.data)
      } else {
        setError(response.error || 'فشل تحميل المرضى')
      }
    } catch {
      setError('حدث خطأ غير متوقع')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPatients()
    }, 300)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

  const getMedicalInfoPreview = (patient: Patient): string => {
    if (!patient.medicalInfo) return 'لا توجد معلومات'

    const info = patient.medicalInfo
    const parts: string[] = []

    if (info.allergies) parts.push(`حساسية: ${info.allergies.substring(0, 30)}...`)
    if (info.chronicDiseases) parts.push(`مزمن: ${info.chronicDiseases.substring(0, 30)}...`)
    if (info.currentMedications) parts.push(`أدوية: ${info.currentMedications.substring(0, 30)}...`)

    return parts.length ? parts.join(' • ') : 'لا توجد معلومات'
  }

  const calculateAge = (birthDate: string | Date | null | undefined): number | null => {

    if (!birthDate) return null
    const birth = new Date(birthDate)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const md = today.getMonth() - birth.getMonth()
    if (md < 0 || (md === 0 && today.getDate() < birth.getDate())) age--
    return age

  }


  const togglePatientStatus = async (id: number) => {
    try {
      await usersApi.togglePatientStatus(id)
      fetchPatients()
    } catch (err) {
      console.error('Error toggling patient status:', err)
    }
  }

  return (
    <AdminShell>
      <PageWrapper title="المرضى" subtitle="إدارة بيانات المرضى والمعلومات الطبية">
        {error && (
          <div className="mb-4 rounded-xl border border-red-400 bg-red-900/40 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        )}

        <div className="mb-6 rounded-2xl border border-subtle bg-surface">
          <div className="border-b border-subtle p-5">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="ابحث باسم المريض أو البريد الإلكتروني..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-subtle bg-soft px-4 py-2.5 pr-10 text-main placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-600"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4 p-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-xl bg-soft" />
              ))}
            </div>
          ) : patients.length === 0 ? (
            <div className="p-12 text-center">
              <User className="mx-auto mb-4 h-16 w-16 text-muted" />
              <p className="text-lg font-medium text-main">لا يوجد مرضى</p>
              <p className="mt-2 text-sm text-muted">
                {searchQuery ? 'جرّب تعديل كلمات البحث' : 'لم يتم تسجيل أي مريض بعد'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="border-b border-subtle bg-soft">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-main">المريض</th>
                    <th className="px-6 py-4 text-xs font-semibold text-main">التواصل</th>
                    <th className="px-6 py-4 text-xs font-semibold text-main">البيانات</th>
                    <th className="px-6 py-4 text-xs font-semibold text-main">معلومات طبية</th>
                    <th className="px-6 py-4 text-xs font-semibold text-main">الحالة</th>
                    <th className="px-6 py-4 text-xs font-semibold text-main">إجراءات</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-subtle bg-surface">
                  {patients.map((patient) => {
                    const age = calculateAge(patient.medicalInfo?.birthDate)

                    return (
                      <tr key={patient.id} className="transition-colors hover:bg-soft">
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-soft text-brand-600">
                              <User className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-semibold text-main">{patient.user.username}</p>
                              <p className="text-xs text-muted"># {patient.id}</p>
                            </div>
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-main">
                            <Mail className="h-4 w-4 text-muted" />
                            {patient.user.email}
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-main">
                          <div className="space-y-1">
                            {patient.medicalInfo?.gender && (
                              <p className="capitalize">
                                {patient.medicalInfo.gender === 'MALE' ? 'ذكر' : 'أنثى'}
                              </p>
                            )}

                            {age !== null && (
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted" />
                                <span>{age} سنة</span>
                              </div>
                            )}

                            {patient.medicalInfo?.height || patient.medicalInfo?.weight ? (
                              <div className="flex items-center gap-2">
                                <Activity className="h-4 w-4 text-muted" />
                                <span>
                                  {patient.medicalInfo?.height && `${patient.medicalInfo.height}سم`}
                                  {patient.medicalInfo?.height && patient.medicalInfo?.weight && ' • '}
                                  {patient.medicalInfo?.weight && `${patient.medicalInfo.weight}كغ`}
                                </span>
                              </div>
                            ) : (
                              !patient.medicalInfo?.gender && age === null && (
                                <span className="text-xs text-muted">لا توجد بيانات</span>
                              )
                            )}
                          </div>
                        </td>

                        <td className="max-w-xs px-6 py-4 text-sm text-main">
                          {patient.medicalInfo ? (
                            <div className="truncate text-muted">
                              {getMedicalInfoPreview(patient)}
                            </div>
                          ) : (
                            <span className="text-muted">لا يوجد</span>
                          )}
                        </td>

                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${patient.user.isActive
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-rose-100 text-rose-700'
                              }`}
                          >
                            {patient.user.isActive ? 'نشط' : 'موقوف'}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-left">
                          <div className="flex items-center justify-start gap-2">
                            <button
                              onClick={() => router.push(`/admin/patients/${patient.id}`)}
                              title="عرض التفاصيل"
                              className="rounded-lg p-2 text-brand-600 transition hover:bg-brand-600/10"
                            >
                              <Eye className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => togglePatientStatus(patient.id)}
                              className="rounded-lg p-2 text-sky-500 transition hover:bg-sky-500/10 disabled:opacity-50"
                              title={patient.user.isActive ? 'إيقاف' : 'تفعيل'}
                            >
                              {patient.user.isActive ? (
                                <ToggleRight className="h-4 w-4" />
                              ) : (
                                <ToggleLeft className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </PageWrapper>
    </AdminShell>
  )
}
