'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { usersApi, Patient } from '@/lib/api'
import {
  ArrowRight,
  User,
  Mail,
  Calendar,
  Activity,
  FileText,
  Pill,
  AlertTriangle,
  Heart,
  ShieldCheck,
  ShieldX,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { AdminShell } from '@/components/admin/AdminShell'
import { PageWrapper } from '@/components/admin/PageWrapper'

export default function PatientDetailPage() {
  const router = useRouter()
  const params = useParams()

  const patientId = useMemo(() => {
    const raw = (params as any)?.id
    const v = Array.isArray(raw) ? raw[0] : raw
    return Number(v)
  }, [params])

  const [patient, setPatient] = useState<Patient | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isToggling, setIsToggling] = useState(false)

  useEffect(() => {
    const fetchPatient = async () => {
      if (!patientId || Number.isNaN(patientId)) {
        setError('معرف المريض غير صالح')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        const response = await usersApi.getPatientById(patientId)

        if (response.success && response.data) {
          setPatient(response.data)
        } else {
          setError(response.error || 'فشل في تحميل بيانات المريض')
        }
      } catch {
        setError('حدث خطأ غير متوقع')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPatient()
  }, [patientId])

  const calculateAge = (birthDate: string | null | undefined): number | null => {
    if (!birthDate) return null
    const birth = new Date(birthDate)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'غير موجود'
    return new Date(dateString).toLocaleDateString('ar-SY', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const handleToggleStatus = async () => {
    if (!patient) return

    const ok = confirm(
      patient.user.isActive
        ? 'هل تريد إيقاف حساب هذا المريض؟'
        : 'هل تريد إعادة تفعيل حساب هذا المريض؟'
    )
    if (!ok) return

    try {
      setIsToggling(true)
      const res = await usersApi.togglePatientStatus(patient.id)

      if (!res.success) {
        alert(res.error || 'فشل تغيير حالة الحساب')
        return
      }

      // تحديث الواجهة فورًا
      setPatient((prev) =>
        prev
          ? {
              ...prev,
              user: { ...prev.user, isActive: !prev.user.isActive },
            }
          : prev
      )
    } catch {
      alert('حدث خطأ غير متوقع')
    } finally {
      setIsToggling(false)
    }
  }

  if (isLoading) {
    return (
      <AdminShell>
        <PageWrapper title="تفاصيل المريض" subtitle="جاري تحميل بيانات المريض...">
          <div className="space-y-6">
            <div className="h-8 w-40 animate-pulse rounded-xl bg-soft" />
            <div className="h-64 animate-pulse rounded-2xl border border-subtle bg-soft" />
          </div>
        </PageWrapper>
      </AdminShell>
    )
  }

  if (error || !patient) {
    return (
      <AdminShell>
        <PageWrapper title="تفاصيل المريض">
          <div className="space-y-6">
            <Button
              size="sm"
              variant="secondary"
              className="flex items-center gap-2 rounded-xl bg-soft text-main"
              onClick={() => router.back()}
            >
              <ArrowRight className="h-4 w-4" />
              <span>رجوع</span>
            </Button>

            <div className="rounded-xl border border-red-400 bg-red-900/40 px-4 py-3 text-sm text-red-100">
              {error || 'لم يتم العثور على المريض'}
            </div>
          </div>
        </PageWrapper>
      </AdminShell>
    )
  }

  const age = calculateAge(patient.medicalInfo?.birthDate)

  return (
    <AdminShell>
      <PageWrapper title="تفاصيل المريض" subtitle="عرض بيانات المريض والمعلومات الأساسية">
        {/* Top actions */}
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2 rounded-xl bg-soft text-main"
          >
            <ArrowRight className="h-4 w-4" />
            <span>رجوع</span>
          </Button>
        </div>

        {/* ===== Header Identity Card ===== */}
        <div className="mb-6 rounded-2xl border border-subtle bg-surface p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600/10 text-brand-600">
              <User className="h-7 w-7" />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-xl font-bold text-main">{patient.user.username}</h2>
              <div className="mt-1 flex items-center gap-2 text-sm text-muted">
                <Mail className="h-4 w-4" />
                <span className="truncate">{patient.user.email}</span>
              </div>
            </div>

            <div className="sm:ml-auto flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                  patient.user.isActive
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200'
                    : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200'
                }`}
              >
                {patient.user.isActive ? (
                  <ShieldCheck className="h-4 w-4" />
                ) : (
                  <ShieldX className="h-4 w-4" />
                )}
                {patient.user.isActive ? 'حساب نشط' : 'حساب موقوف'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* ======================= Main ======================= */}
          <div className="space-y-6 lg:col-span-2">
            {/* Personal Info */}
            <div className="rounded-2xl border border-subtle bg-surface p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-main">
                <User className="h-5 w-5 text-brand-600" />
                المعلومات الشخصية
              </h2>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="text-xs text-muted">اسم المستخدم</label>
                  <p className="mt-1 font-medium text-main">{patient.user.username}</p>
                </div>

                <div>
                  <label className="flex items-center gap-1 text-xs text-muted">
                    <Mail className="h-4 w-4" />
                    البريد الإلكتروني
                  </label>
                  <p className="mt-1 font-medium text-main">{patient.user.email}</p>
                </div>

                {patient.medicalInfo?.gender && (
                  <div>
                    <label className="text-xs text-muted">الجنس</label>
                    <p className="mt-1 font-medium text-main">
                      {patient.medicalInfo.gender === 'MALE' ? 'ذكر' : 'أنثى'}
                    </p>
                  </div>
                )}

                {patient.medicalInfo?.birthDate && (
                  <div>
                    <label className="flex items-center gap-1 text-xs text-muted">
                      <Calendar className="h-4 w-4" />
                      تاريخ الميلاد
                    </label>
                    <p className="mt-1 font-medium text-main">
                      {formatDate(patient.medicalInfo?.birthDate)}
                      {age !== null && ` (العمر: ${age} سنة)`}
                    </p>
                  </div>
                )}

                {patient.medicalInfo?.height && (
                  <div>
                    <label className="flex items-center gap-1 text-xs text-muted">
                      <Activity className="h-4 w-4" />
                      الطول
                    </label>
                    <p className="mt-1 font-medium text-main">{patient.medicalInfo?.height} سم</p>
                  </div>
                )}

                {patient.medicalInfo?.weight && (
                  <div>
                    <label className="flex items-center gap-1 text-xs text-muted">
                      <Activity className="h-4 w-4" />
                      الوزن
                    </label>
                    <p className="mt-1 font-medium text-main">{patient.medicalInfo?.weight} كغ</p>
                  </div>
                )}

                <div>
                  <label className="text-xs text-muted">رقم المريض</label>
                  <p className="mt-1 font-medium text-main">#{patient.id}</p>
                </div>

                <div>
                  <label className="text-xs text-muted">تاريخ التسجيل</label>
                  <p className="mt-1 font-medium text-main">
                    {new Date(patient.user.createdAt || patient.createdAt).toLocaleDateString('ar-SY')}
                  </p>
                </div>
              </div>
            </div>

            {/* Medical Info */}
            {patient.medicalInfo ? (
              <div className="rounded-2xl border border-subtle bg-surface p-6">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-main">
                  <FileText className="h-5 w-5 text-emerald-600" />
                  المعلومات الطبية
                </h2>

                <div className="space-y-6">
                  {patient.medicalInfo.allergies && (
                    <div>
                      <label className="flex items-center gap-1 text-xs text-muted">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        الحساسية
                      </label>
                      <p className="mt-1 rounded-xl border border-red-200 bg-red-50 p-3 text-main dark:border-red-700 dark:bg-red-900/30">
                        {patient.medicalInfo.allergies}
                      </p>
                    </div>
                  )}

                  {patient.medicalInfo.chronicDiseases && (
                    <div>
                      <label className="flex items-center gap-1 text-xs text-muted">
                        <Heart className="h-4 w-4 text-orange-500" />
                        الأمراض المزمنة
                      </label>
                      <p className="mt-1 rounded-xl border border-orange-200 bg-orange-50 p-3 text-main dark:border-orange-700 dark:bg-orange-900/30">
                        {patient.medicalInfo.chronicDiseases}
                      </p>
                    </div>
                  )}

                  {patient.medicalInfo.currentMedications && (
                    <div>
                      <label className="flex items-center gap-1 text-xs text-muted">
                        <Pill className="h-4 w-4 text-blue-500" />
                        الأدوية الحالية
                      </label>
                      <p className="mt-1 rounded-xl border border-blue-200 bg-blue-50 p-3 text-main dark:border-blue-700 dark:bg-blue-900/30">
                        {patient.medicalInfo.currentMedications}
                      </p>
                    </div>
                  )}

                  {patient.medicalInfo.chronicMedications && (
                    <div>
                      <label className="flex items-center gap-1 text-xs text-muted">
                        <Pill className="h-4 w-4 text-purple-500" />
                        الأدوية المزمنة
                      </label>
                      <p className="mt-1 rounded-xl border border-purple-200 bg-purple-50 p-3 text-main dark:border-purple-700 dark:bg-purple-900/30">
                        {patient.medicalInfo.chronicMedications}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-subtle bg-surface p-10 text-center">
                <FileText className="mx-auto mb-3 h-12 w-12 text-muted" />
                <p className="text-muted">لا توجد معلومات طبية مسجّلة</p>
              </div>
            )}
          </div>

          {/* ======================= Sidebar ======================= */}
          <div className="space-y-6">
            {/* Quick summary */}
            <div className="rounded-2xl border border-subtle bg-surface p-6">
              <h3 className="mb-3 text-sm font-semibold text-main">ملخص سريع</h3>

              <ul className="space-y-3 text-sm">
                <li className="flex items-center justify-between">
                  <span className="text-muted">عدد الطلبات</span>
                  <span className="font-bold text-main">{patient.orders?.length || 0}</span>
                </li>

                <li className="flex items-center justify-between">
                  <span className="text-muted">حالة الحساب</span>
                  <span
                    className={`font-bold ${
                      patient.user.isActive ? 'text-emerald-500' : 'text-rose-500'
                    }`}
                  >
                    {patient.user.isActive ? 'نشط' : 'موقوف'}
                  </span>
                </li>
              </ul>

              <Button
                className="mt-4 w-full"
                variant={patient.user.isActive ? 'danger' : 'primary'}
                isLoading={isToggling}
                onClick={handleToggleStatus}
              >
                {patient.user.isActive ? 'إيقاف الحساب' : 'تفعيل الحساب'}
              </Button>

              <p className="mt-3 text-xs text-muted">
                {patient.user.isActive
                  ? 'إيقاف الحساب يمنع المريض من تسجيل الدخول واستخدام النظام.'
                  : 'تفعيل الحساب يعيد السماح للمريض بالدخول واستخدام النظام.'}
              </p>
            </div>

            {/* Recent Orders */}
            {patient.orders && patient.orders.length > 0 && (
              <div className="rounded-2xl border border-subtle bg-surface p-6">
                <h3 className="mb-4 text-sm font-semibold text-main">الطلبات الأخيرة</h3>

                <div className="space-y-4 text-sm">
                  {patient.orders.slice(0, 5).map((order: any) => (
                    <div key={order.id} className="border-b border-subtle pb-3 last:border-0">
                      <p className="font-semibold text-main">طلب رقم #{order.id}</p>

                      <p className="mt-1 text-xs text-muted">
                        {order.pharmacy?.name || 'صيدلية غير معروفة'} •{' '}
                        {new Date(order.createdAt).toLocaleDateString('ar-SY')}
                      </p>

                      <span
                        className={`mt-2 inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          order.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                            : order.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                            : 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </PageWrapper>
    </AdminShell>
  )
}
