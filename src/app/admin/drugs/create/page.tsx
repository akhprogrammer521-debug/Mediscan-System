'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { drugsApi, CreateDrugInput } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ArrowLeft, CheckCircle, AlertCircle, Pill } from 'lucide-react'
import { AdminShell } from '@/components/admin/AdminShell'
import { PageWrapper } from '@/components/admin/PageWrapper'

type FormErrors = Partial<Record<keyof CreateDrugInput | 'general', string>>

export default function CreateDrugPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<CreateDrugInput>({
    name: '',
    strength: '',
    description: '',

    composition: '',
    indications: '',
    contraindications: '',
    dosage: '',
    warnings: '',
    sideEffects: '',
    interactions: '',
    overdose: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) newErrors.name = 'اسم الدواء مطلوب'
    if (!formData.strength.trim()) newErrors.strength = 'التركيز مطلوب'

    // الباك-إند يطلب كل الحقول الطبية (min(1))
    if (!formData.composition.trim()) newErrors.composition = 'التركيب مطلوب'
    if (!formData.indications.trim()) newErrors.indications = 'الاستخدامات مطلوبة'
    if (!formData.contraindications.trim()) newErrors.contraindications = 'موانع الاستخدام مطلوبة'
    if (!formData.dosage.trim()) newErrors.dosage = 'الجرعة مطلوبة'
    if (!formData.warnings.trim()) newErrors.warnings = 'التحذيرات مطلوبة'
    if (!formData.sideEffects.trim()) newErrors.sideEffects = 'الآثار الجانبية مطلوبة'
    if (!formData.interactions.trim()) newErrors.interactions = 'التداخلات مطلوبة'
    if (!formData.overdose.trim()) newErrors.overdose = 'معلومات الجرعة الزائدة مطلوبة'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      const res = await drugsApi.create(formData)

      if (res.success) {
        setIsSuccess(true)
        setTimeout(() => router.push('/admin/drugs'), 1300)
      } else {
        setErrors({ general: res.error || 'فشل إنشاء الدواء' })
      }
    } catch {
      setErrors({ general: 'حدث خطأ غير متوقع' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: keyof CreateDrugInput, value: string) => {
    setFormData((p) => ({ ...p, [field]: value }))
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }))
  }

  if (isSuccess) {
    return (
      <AdminShell>
        <PageWrapper>
          <div className="min-h-[50vh] flex items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600/20">
                <CheckCircle className="h-10 w-10 text-emerald-500" />
              </div>
              <h2 className="text-xl font-semibold text-main">تم إنشاء الدواء بنجاح</h2>
              <p className="text-muted mt-1">جاري تحويلك لقائمة الأدوية...</p>
            </div>
          </div>
        </PageWrapper>
      </AdminShell>
    )
  }

  return (
    <AdminShell>
      <PageWrapper title="إضافة دواء" subtitle="قم بإضافة دواء جديد إلى قاعدة البيانات الطبية">
        <div className="flex items-center gap-3 mb-4">
          <button
            title="goBack"
            onClick={() => router.back()}
            className="rounded-xl bg-soft p-2 hover:bg-surface border border-subtle transition"
          >
            <ArrowLeft className="h-5 w-5 text-main" />
          </button>

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-soft p-2">
              <Pill className="h-5 w-5 text-brand-600" />
            </div>
          </div>
        </div>

        {errors.general && (
          <div className="mb-6 flex items-start gap-2 rounded-xl border border-red-400 bg-red-900/40 px-4 py-3 text-red-200">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{errors.general}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="rounded-2xl border border-subtle bg-surface p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Input
              label="اسم الدواء *"
              value={formData.name}
              error={errors.name}
              disabled={isLoading}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="أدخل اسم الدواء"
              className="md:col-span-2"
            />

            <Input
              label="التركيز *"
              value={formData.strength}
              error={errors.strength}
              disabled={isLoading}
              onChange={(e) => handleChange('strength', e.target.value)}
              placeholder="مثال: 500mg"
            />

            <Input
              label="وصف مختصر (اختياري)"
              value={formData.description ?? ''}
              disabled={isLoading}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="وصف مختصر للدواء"
            />
          </div>

          <Field
            label="التركيب *"
            value={formData.composition}
            error={errors.composition}
            onChange={(val) => handleChange('composition', val)}
            disabled={isLoading}
            placeholder="التركيب / المادة الفعالة..."
          />

          <Field
            label="الاستخدامات العلاجية *"
            value={formData.indications}
            error={errors.indications}
            onChange={(val) => handleChange('indications', val)}
            disabled={isLoading}
            placeholder="ما الحالات التي يعالجها هذا الدواء؟"
          />

          <Field
            label="موانع الاستخدام *"
            value={formData.contraindications}
            error={errors.contraindications}
            onChange={(val) => handleChange('contraindications', val)}
            disabled={isLoading}
            placeholder="متى يجب عدم استخدام هذا الدواء؟"
          />

          <Field
            label="الجرعة *"
            value={formData.dosage}
            error={errors.dosage}
            onChange={(val) => handleChange('dosage', val)}
            disabled={isLoading}
            placeholder="مثال: كبسولة مرتين يومياً..."
          />

          <Field
            label="التحذيرات *"
            value={formData.warnings}
            error={errors.warnings}
            onChange={(val) => handleChange('warnings', val)}
            disabled={isLoading}
            placeholder="تحذيرات هامة قبل الاستخدام..."
            color="orange"
          />

          <Field
            label="الآثار الجانبية *"
            value={formData.sideEffects}
            error={errors.sideEffects}
            onChange={(val) => handleChange('sideEffects', val)}
            disabled={isLoading}
            placeholder="الآثار الجانبية المحتملة..."
          />

          <Field
            label="التداخلات الدوائية *"
            value={formData.interactions}
            error={errors.interactions}
            onChange={(val) => handleChange('interactions', val)}
            disabled={isLoading}
            placeholder="التفاعلات الدوائية المحتملة..."
          />

          <Field
            label="معلومات الجرعة الزائدة *"
            value={formData.overdose}
            error={errors.overdose}
            onChange={(val) => handleChange('overdose', val)}
            disabled={isLoading}
            placeholder="أعراض الجرعة الزائدة وطرق التعامل..."
            color="red"
          />

          <div className="flex items-center justify-end gap-4 pt-6 border-t border-subtle">
            <Button type="button" variant="secondary" disabled={isLoading} onClick={() => router.back()}>
              إلغاء
            </Button>

            <Button type="submit" isLoading={isLoading} disabled={isLoading}>
              إضافة الدواء
            </Button>
          </div>
        </form>
      </PageWrapper>
    </AdminShell>
  )
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  disabled,
  error,
  color,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder: string
  disabled?: boolean
  error?: string
  color?: 'orange' | 'red'
}) {
  const borderColor =
    color === 'orange'
      ? 'border-orange-400 focus:ring-orange-500'
      : color === 'red'
      ? 'border-red-400 focus:ring-red-500'
      : 'border-subtle focus:ring-brand-600'

  return (
    <div>
      <label className="block text-sm font-semibold text-main mb-2">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={3}
        className={`w-full rounded-xl border bg-soft px-4 py-2 text-main placeholder:text-muted focus:outline-none focus:ring-2 ${borderColor}`}
      />
      {error && <p className="mt-1 text-xs text-rose-400">{error}</p>}
    </div>
  )
}
