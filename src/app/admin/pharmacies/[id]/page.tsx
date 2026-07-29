'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { pharmaciesApi } from '@/lib/api'
import { AdminShell } from '@/components/admin/AdminShell'
import { PageWrapper } from '@/components/admin/PageWrapper'
import {
    Building2,
    Phone,
    Mail,
    ShieldCheck,
    ShieldX,
    User,
    FileWarning,
    ArrowLeft,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function PharmacyDetailsPage() {
    const params = useParams()

    const id = Array.isArray(params.id)
        ? Number(params.id[0])
        : Number(params.id)
    const router = useRouter()
    const [pharmacy, setPharmacy] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [newPassword, setNewPassword] = useState<string | null>(null)


    useEffect(() => {
        const load = async () => {
            const res = await pharmaciesApi.getById(Number(id))
            if (res.success && res.data) {
                setPharmacy(res.data)
            }
            setLoading(false)
        }
        load()
    }, [id])

    if (loading) {
        return (
            <AdminShell>
                <PageWrapper title="ملف الصيدلية">
                    <p className="p-8 text-center text-muted">جاري التحميل...</p>
                </PageWrapper>
            </AdminShell>
        )
    }

    if (!pharmacy) return null

    return (
        <AdminShell>
            <PageWrapper
                title="ملف الصيدلية"
                subtitle="جميع بيانات الصيدلية وحساب الدخول"
            >
                {/* رجوع */}
                <button
                    onClick={() => router.back()}
                    className="mb-6 flex items-center gap-2 text-sm text-muted hover:text-main"
                >
                    <ArrowLeft className="h-4 w-4" />
                    رجوع
                </button>

                <div className="grid gap-6 md:grid-cols-2">

                    {/* معلومات الصيدلية */}
                    <div className="rounded-2xl border border-subtle bg-surface p-6">
                        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-main">
                            <Building2 className="h-4 w-4" />
                            بيانات الصيدلية
                        </h3>

                        <Info label="الاسم" value={pharmacy.name} />
                        <Info label="العنوان" value={pharmacy.address} />
                        <Info label="رقم الترخيص" value={pharmacy.licenseNumber} />
                        <Info label="تاريخ الإنشاء" value={new Date(pharmacy.createdAt).toLocaleDateString()} />
                        <Info label="انتهاء الترخيص" value={new Date(pharmacy.licenseExpiresAt).toLocaleDateString()} />

                        <div className="mt-3">
                            {pharmacy.isActive ? (
                                <Status text="فعّالة" icon={ShieldCheck} color="emerald" />
                            ) : (
                                <Status text="موقوفة" icon={ShieldX} color="rose" />
                            )}
                        </div>
                    </div>

                    {/* التواصل */}
                    <div className="rounded-2xl border border-subtle bg-surface p-6">
                        <h3 className="mb-4 text-sm font-semibold text-main">
                            بيانات التواصل
                        </h3>

                        <Info icon={Phone} value={pharmacy.phone} />
                        {pharmacy.phone && <Info icon={Mail} value={pharmacy.email} />}




                    </div>

                    {/* حساب الدخول */}
                    <div className="md:col-span-2 rounded-2xl border border-subtle bg-surface p-6">
                        <h3 className="mb-4 text-sm font-semibold text-main">
                            حساب الدخول
                        </h3>

                        <Info
                            icon={User}
                            label="اسم المستخدم"
                            value={pharmacy.pharmacist?.user?.username}
                        />

                        {newPassword && (
                            <div className="mt-3 rounded-xl border border-amber-400 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                                <strong>كلمة المرور الجديدة:</strong>
                                <span className="ml-2 font-mono">{newPassword}</span>
                                <p className="mt-1 text-xs">
                                   <FileWarning className="inline-block ml-1 h-3 w-3" /> لن تظهر مرة أخرى بعد تحديث الصفحة
                                </p>
                            </div>
                        )}


                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted">كلمة المرور</span>
                            <Button
                                variant="secondary"
                                onClick={async () => {
                                    if (!confirm("هل تريد إعادة تعيين كلمة المرور؟")) return

                                    const res = await pharmaciesApi.resetPassword(id)

                                    if (res.success && res.data) {
                                        setNewPassword(res.data.password)
                                    }
                                }}
                            >
                                إعادة تعيين كلمة المرور
                            </Button>

                        </div>

                    </div>
                </div>
            </PageWrapper>
        </AdminShell>
    )
}

/* ===== Components ===== */

function Info({
    label,
    value,
    icon: Icon,
}: {
    label?: string
    value?: string
    icon?: any
}) {
    if (!value) return null
    return (
        <div className="mb-2 flex items-center gap-2 text-sm text-main">
            {Icon && <Icon className="h-4 w-4 text-muted" />}
            {label && <span className="text-muted">{label}:</span>}
            <span>{value}</span>
        </div>
    )
}

function Status({
    text,
    icon: Icon,
    color,
}: {
    text: string
    icon: any
    color: 'emerald' | 'rose'
}) {
    return (
        <div
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold
      bg-${color}-500/10 text-${color}-500`}
        >
            <Icon className="h-4 w-4" />
            {text}
        </div>
    )
}
