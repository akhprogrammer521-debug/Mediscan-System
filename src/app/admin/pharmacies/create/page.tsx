'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { pharmaciesApi, type CreatePharmacyInput } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ArrowLeft, CheckCircle, AlertCircle, Building2, UserCircle2 } from 'lucide-react'
import { AdminShell } from '@/components/admin/AdminShell'
import { PageWrapper } from '@/components/admin/PageWrapper'

interface FormErrors {
  name?: string
  address?: string
  phone?: string
  email?: string
  licenseNumber?: string
  licenseIssuedAt?: string
  licenseExpiresAt?: string
  username?: string
  password?: string
  general?: string
}

export default function CreatePharmacyPage() {
  const router = useRouter()

  const [formData, setFormData] = useState<CreatePharmacyInput>({
    name: '',
    address: '',
    phone: '',
    email: '',
    licenseNumber: '',
    licenseIssuedAt: '',
    licenseExpiresAt: '',
    username: '',
    password: '',
    latitude: null,
    longitude: null,
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) newErrors.name = 'اسم الصيدلية مطلوب'
    if (!formData.address.trim()) newErrors.address = 'العنوان مطلوب'
    if (!formData.phone.trim()) newErrors.phone = 'رقم الهاتف مطلوب'
    if (!formData.licenseNumber.trim()) newErrors.licenseNumber = 'رقم الترخيص مطلوب'

    // الباك عندك يفضل وجود التواريخ، وإذا تركتها فاضية قد لا يقبل حسب validation
    if (!formData.licenseIssuedAt?.trim()) newErrors.licenseIssuedAt = 'تاريخ إصدار الترخيص مطلوب'
    if (!formData.licenseExpiresAt?.trim()) newErrors.licenseExpiresAt = 'تاريخ انتهاء الترخيص مطلوب'

    if (!formData.email?.trim()) newErrors.email = 'البريد الإلكتروني مطلوب'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'البريد الإلكتروني غير صالح'

    if (!formData.username.trim()) newErrors.username = 'اسم المستخدم مطلوب'
    if (!formData.password.trim()) newErrors.password = 'كلمة المرور مطلوبة'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Transliteration بسيط
  const arabicToEnglish = (str: string) => {
    const map: Record<string, string> = {
      'أ':'a','ا':'a','إ':'i','آ':'a',
      'ب':'b','ت':'t','ث':'th','ج':'j','ح':'h','خ':'kh',
      'د':'d','ذ':'th','ر':'r','ز':'z','س':'s','ش':'sh','ص':'s',
      'ض':'d','ط':'t','ظ':'z','ع':'a','غ':'gh',
      'ف':'f','ق':'q','ك':'k','ل':'l','م':'m','ن':'n','ه':'h','و':'w','ي':'y',
      'ء':'a','ؤ':'o','ئ':'e','ة':'h'
    }
    return str.split('').map((c) => map[c] || c).join('')
  }

  const generateUsername = () => {
    let name = arabicToEnglish(formData.name.trim())
    const cleanName = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')

    const license = (formData.licenseNumber || 'ph').toLowerCase().replace(/\s+/g, '')

    setFormData((prev) => ({
      ...prev,
      username: `${cleanName || 'pharmacy'}_${license}`,
    }))
  }

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789!@#$%&*'
    let pwd = ''
    for (let i = 0; i < 10; i++) pwd += chars.charAt(Math.floor(Math.random() * chars.length))
    setFormData((prev) => ({ ...prev, password: pwd }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    if (!validateForm()) return

    setIsLoading(true)
    try {
      // ✅ payload مطابق للباك تماماً
      const payload: CreatePharmacyInput = {
        name: formData.name.trim(),
        address: formData.address.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        licenseNumber: formData.licenseNumber.trim(),
        licenseIssuedAt: formData.licenseIssuedAt,
        licenseExpiresAt: formData.licenseExpiresAt,
        username: formData.username.trim(),
        password: formData.password,
        latitude: formData.latitude ?? null,
        longitude: formData.longitude ?? null,
      }

      const response = await pharmaciesApi.create(payload)

      if (response.success) {
        setIsSuccess(true)
        setTimeout(() => router.push('/admin/pharmacies'), 1200)
      } else {
        setErrors({ general: response.error || 'فشل إنشاء الصيدلية' })
      }
    } catch {
      setErrors({ general: 'حدث خطأ غير متوقع في الخادم' })
    } finally {
      setIsLoading(false)
    }
  }

  const setField = (field: keyof CreatePharmacyInput, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof FormErrors]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  if (isSuccess) {
    return (
      <AdminShell>
        <PageWrapper title="الصيدليات" subtitle="تم إنشاء الصيدلية بنجاح">
          <div className="flex min-h-[40vh] items-center justify-center">
            <div className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
                <CheckCircle className="h-8 w-8 text-emerald-400" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-main">تم إنشاء الصيدلية بنجاح</h2>
              <p className="text-sm text-muted">سيتم تحويلك إلى قائمة الصيدليات...</p>
            </div>
          </div>
        </PageWrapper>
      </AdminShell>
    )
  }

  return (
    <AdminShell>
      <PageWrapper title="الصيدليات" subtitle="إضافة صيدلية جديدة للنظام">
        <div className="mb-6 flex items-center gap-4">
          <button
            title="رجوع"
            onClick={() => router.back()}
            className="rounded-xl border border-subtle bg-soft p-2 text-muted transition hover:bg-surface"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600/10 text-brand-600">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-main">إنشاء صيدلية جديدة</h1>
              <p className="text-xs text-muted">تعبئة بيانات الصيدلية وحساب الدخول الخاص بها</p>
            </div>
          </div>
        </div>

        {errors.general && (
          <div className="mb-6 flex items-start gap-2 rounded-xl border border-rose-400 bg-rose-900/40 px-4 py-3 text-sm text-rose-100">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
            <span>{errors.general}</span>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* معلومات الصيدلية */}
          <div className="rounded-2xl border border-subtle bg-surface p-6">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-soft text-brand-600">
                <Building2 className="h-4 w-4" />
              </div>
              <h2 className="text-sm font-semibold text-main">معلومات الصيدلية</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <Input
                  label="اسم الصيدلية *"
                  value={formData.name}
                  onChange={(v: any) => setField('name', typeof v === 'string' ? v : v.target.value)}
                  placeholder="أدخل اسم الصيدلية"
                  required
                  disabled={isLoading}
                />
                {errors.name && <p className="mt-1 text-xs text-rose-400">{errors.name}</p>}
              </div>

              <div>
                <Input
                  label="رقم الترخيص *"
                  value={formData.licenseNumber}
                  onChange={(v: any) => setField('licenseNumber', typeof v === 'string' ? v : v.target.value)}
                  placeholder="أدخل رقم الترخيص"
                  required
                  disabled={isLoading}
                />
                {errors.licenseNumber && <p className="mt-1 text-xs text-rose-400">{errors.licenseNumber}</p>}
              </div>
            </div>

            <div className="mt-4">
              <Input
                label="العنوان الكامل *"
                value={formData.address}
                onChange={(v: any) => setField('address', typeof v === 'string' ? v : v.target.value)}
                placeholder="المدينة - الشارع - تفاصيل إضافية"
                required
                disabled={isLoading}
              />
              {errors.address && <p className="mt-1 text-xs text-rose-400">{errors.address}</p>}
            </div>

            <div className="mt-4 grid gap-6 md:grid-cols-2">
              <div>
                <Input
                  label="رقم الهاتف *"
                  value={formData.phone}
                  onChange={(v: any) => setField('phone', typeof v === 'string' ? v : v.target.value)}
                  placeholder="أدخل رقم الهاتف"
                  required
                  disabled={isLoading}
                />
                {errors.phone && <p className="mt-1 text-xs text-rose-400">{errors.phone}</p>}
              </div>

              <div>
                <Input
                  label="البريد الإلكتروني *"
                  value={formData.email}
                  onChange={(v: any) => setField('email', typeof v === 'string' ? v : v.target.value)}
                  placeholder="example@domain.com"
                  required
                  disabled={isLoading}
                />
                {errors.email && <p className="mt-1 text-xs text-rose-400">{errors.email}</p>}
              </div>
            </div>

            <div className="mt-4 grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-main">تاريخ إصدار الترخيص *</label>
                <input
                  type="datetime-local"
                  value={formData.licenseIssuedAt || ''}
                  onChange={(e) => setField('licenseIssuedAt', e.target.value)}
                  className="w-full rounded-xl border border-subtle bg-soft px-3 py-2 text-sm text-main focus:outline-none focus:ring-2 focus:ring-brand-600"
                  disabled={isLoading}
                />
                {errors.licenseIssuedAt && <p className="mt-1 text-xs text-rose-400">{errors.licenseIssuedAt}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-main">تاريخ انتهاء الترخيص *</label>
                <input
                  type="datetime-local"
                  value={formData.licenseExpiresAt || ''}
                  onChange={(e) => setField('licenseExpiresAt', e.target.value)}
                  className="w-full rounded-xl border border-subtle bg-soft px-3 py-2 text-sm text-main focus:outline-none focus:ring-2 focus:ring-brand-600"
                  disabled={isLoading}
                />
                {errors.licenseExpiresAt && <p className="mt-1 text-xs text-rose-400">{errors.licenseExpiresAt}</p>}
              </div>
            </div>
          </div>

          {/* حساب الصيدلي */}
          <div className="rounded-2xl border border-subtle bg-surface p-6">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-soft text-brand-600">
                <UserCircle2 className="h-4 w-4" />
              </div>
              <h2 className="text-sm font-semibold text-main">حساب الصيدلي في النظام</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-main">اسم المستخدم *</label>
                <div className="flex gap-2">
                  <input
                    dir="ltr"
                    className="flex-1 rounded-xl border border-subtle bg-soft px-3 py-2 text-sm text-main placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-600"
                    value={formData.username}
                    placeholder="اكتب أو أنشئ اسم مستخدم تلقائياً"
                    onChange={(e) => setField('username', e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={generateUsername}
                    disabled={isLoading}
                    className="rounded-xl border border-subtle bg-soft px-3 py-2 text-xs text-main hover:bg-surface disabled:opacity-60"
                  >
                    توليد
                  </button>
                </div>
                {errors.username && <p className="mt-1 text-xs text-rose-400">{errors.username}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-main">كلمة المرور *</label>
                <div className="flex gap-2">
                  <input
                    dir="ltr"
                    type="text"
                    className="flex-1 rounded-xl border border-subtle bg-soft px-3 py-2 text-sm text-main placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-600"
                    value={formData.password}
                    placeholder="اكتب أو أنشئ كلمة مرور تلقائياً"
                    onChange={(e) => setField('password', e.target.value)}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={generatePassword}
                    disabled={isLoading}
                    className="rounded-xl border border-subtle bg-soft px-3 py-2 text-xs text-main hover:bg-surface disabled:opacity-60"
                  >
                    توليد
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-rose-400">{errors.password}</p>}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => router.back()} disabled={isLoading}>
              إلغاء
            </Button>
            <Button type="submit" isLoading={isLoading} disabled={isLoading}>
              إنشاء الصيدلية
            </Button>
          </div>
        </form>
      </PageWrapper>
    </AdminShell>
  )
}
