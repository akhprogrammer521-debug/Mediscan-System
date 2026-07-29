'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { drugsApi, Drug, CreateDrugInput } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ArrowLeft, CheckCircle, AlertCircle, Pill, Save } from 'lucide-react'
import { AdminShell } from '@/components/admin/AdminShell'
import { PageWrapper } from '@/components/admin/PageWrapper'

type FormErrors = Partial<Record<keyof CreateDrugInput | 'general', string>>

export default function EditDrugPage() {
  const router = useRouter()
  const params = useParams()
  const rawId = params.id
  const drugId = Number(Array.isArray(rawId) ? rawId[0] : rawId)

  const [drug, setDrug] = useState<Drug | null>(null)
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
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    const fetchDrug = async () => {
      if (!drugId || Number.isNaN(drugId)) {
        setErrors({ general: 'معرّف الدواء غير صالح' })
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const res = await drugsApi.getById(drugId)

        if (res.success && res.data) {
          const d = res.data
          setDrug(d)
          setFormData({
            name: d.name,
            strength: d.strength,
            description: d.description ?? '',

            composition: d.composition,
            indications: d.indications,
            contraindications: d.contraindications,
            dosage: d.dosage,
            warnings: d.warnings,
            sideEffects: d.sideEffects,
            interactions: d.interactions,
            overdose: d.overdose,
          })
        } else {
          setErrors({ general: res.error || 'فشل تحميل بيانات الدواء' })
        }
      } catch {
        setErrors({ general: 'حدث خطأ غير متوقع أثناء تحميل البيانات' })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDrug()
  }, [drugId])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) newErrors.name = 'اسم الدواء مطلوب'
    if (!formData.strength.trim()) newErrors.strength = 'التركيز مطلوب'

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

    setIsSaving(true)
    setErrors({})

    try {
      const res = await drugsApi.update(drugId, formData)

      if (res.success) {
        setIsSuccess(true)
        setTimeout(() => router.push('/admin/drugs'), 1300)
      } else {
        setErrors({ general: res.error || 'فشل تحديث بيانات الدواء' })
      }
    } catch {
      setErrors({ general: 'حدث خطأ غير متوقع أثناء الحفظ' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (field: keyof CreateDrugInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  if (isLoading) {
    return (
      <AdminShell>
        <PageWrapper title="تعديل دواء" subtitle="جاري تحميل بيانات الدواء">
          <div className="space-y-6">
            <div className="animate-pulse">
              <div className="mb-4 h-8 w-40 rounded-xl bg-soft" />
              <div className="rounded-2xl border border-subtle bg-surface p-6">
                <div className="h-72 rounded-xl bg-soft" />
              </div>
            </div>
          </div>
        </PageWrapper>
      </AdminShell>
    )
  }

  if (errors.general && !drug) {
    return (
      <AdminShell>
        <PageWrapper title="تعديل دواء">
          <div className="space-y-4">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 rounded-xl border border-subtle bg-soft px-3 py-2 text-sm text-main hover:bg-surface"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>رجوع</span>
            </button>

            <div className="flex items-start gap-2 rounded-xl border border-red-400 bg-red-900/40 px-4 py-3 text-sm text-red-100">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{errors.general}</span>
            </div>
          </div>
        </PageWrapper>
      </AdminShell>
    )
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
              <h2 className="text-xl font-semibold text-main">تم تحديث بيانات الدواء بنجاح</h2>
              <p className="text-muted mt-1">جاري تحويلك إلى قائمة الأدوية...</p>
            </div>
          </div>
        </PageWrapper>
      </AdminShell>
    )
  }

  return (
    <AdminShell>
      <PageWrapper title="تعديل دواء" subtitle={`تحديث معلومات الدواء: ${drug?.name ?? ''}`}>
        <div className="mb-4 flex items-center gap-3">
          <button
            title="goBack"
            onClick={() => router.back()}
            className="rounded-xl border border-subtle bg-soft p-2 hover:bg-surface transition"
          >
            <ArrowLeft className="h-4 w-4 text-main" />
          </button>

          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-soft p-2">
              <Pill className="h-5 w-5 text-brand-600" />
            </div>
            <span className="text-sm text-muted">تعديل بيانات الدواء في النظام</span>
          </div>
        </div>

        {errors.general && (
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-400 bg-red-900/40 px-4 py-3 text-sm text-red-100">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{errors.general}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-subtle bg-surface p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Input
              label="اسم الدواء *"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="أدخل اسم الدواء"
              error={errors.name}
              disabled={isSaving}
              required
              className="md:col-span-2"
            />

            <Input
              label="التركيز *"
              value={formData.strength}
              onChange={(e) => handleChange('strength', e.target.value)}
              placeholder="مثال: 500mg"
              error={errors.strength}
              disabled={isSaving}
              required
            />

            <Input
              label="وصف مختصر (اختياري)"
              value={formData.description ?? ''}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="وصف مختصر"
              disabled={isSaving}
            />
          </div>

          <Field label="التركيب *" value={formData.composition} error={errors.composition} onChange={(v) => handleChange('composition', v)} disabled={isSaving} placeholder="التركيب / المادة الفعالة..." />
          <Field label="الاستخدامات العلاجية *" value={formData.indications} error={errors.indications} onChange={(v) => handleChange('indications', v)} disabled={isSaving} placeholder="الحالات التي يعالجها..." />
          <Field label="موانع الاستخدام *" value={formData.contraindications} error={errors.contraindications} onChange={(v) => handleChange('contraindications', v)} disabled={isSaving} placeholder="متى لا يستخدم..." />
          <Field label="الجرعة *" value={formData.dosage} error={errors.dosage} onChange={(v) => handleChange('dosage', v)} disabled={isSaving} placeholder="كيفية الاستخدام..." />
          <Field label="التحذيرات *" value={formData.warnings} error={errors.warnings} onChange={(v) => handleChange('warnings', v)} disabled={isSaving} placeholder="تحذيرات هامة..." color="orange" />
          <Field label="الآثار الجانبية *" value={formData.sideEffects} error={errors.sideEffects} onChange={(v) => handleChange('sideEffects', v)} disabled={isSaving} placeholder="الآثار المحتملة..." />
          <Field label="التداخلات الدوائية *" value={formData.interactions} error={errors.interactions} onChange={(v) => handleChange('interactions', v)} disabled={isSaving} placeholder="تداخلات مع أدوية أخرى..." />
          <Field label="معلومات الجرعة الزائدة *" value={formData.overdose} error={errors.overdose} onChange={(v) => handleChange('overdose', v)} disabled={isSaving} placeholder="الجرعة الزائدة والتعامل..." color="red" />

          <div className="mt-4 flex items-center justify-end gap-4 border-t border-subtle pt-4">
            <Button type="button" variant="secondary" onClick={() => router.back()} disabled={isSaving}>
              إلغاء
            </Button>

            <Button type="submit" isLoading={isSaving} disabled={isSaving} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              <span>حفظ التعديلات</span>
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
      <label className="mb-2 block text-sm font-semibold text-main">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={3}
        className={`w-full rounded-xl border bg-soft px-4 py-2 text-sm text-main placeholder:text-muted focus:outline-none focus:ring-2 ${borderColor}`}
      />
      {error && <p className="mt-1 text-xs text-rose-400">{error}</p>}
    </div>
  )
}
