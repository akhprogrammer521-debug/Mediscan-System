'use client'

import { useEffect, useState } from 'react'
import { settingsApi, SystemSetting } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Toast } from '@/components/ui/Toast'
import { Save, Loader2 } from 'lucide-react'
import { AdminShell } from '@/components/admin/AdminShell'
import { PageWrapper } from '@/components/admin/PageWrapper'

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSetting[]>([])
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState({
    message: '',
    type: 'success' as 'success' | 'error',
    isVisible: false,
  })

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true)
        const res = await settingsApi.get()

        if (res.success && res.data) {
          setSettings(res.data)

          const initial: Record<string, string> = {}
          res.data.forEach((s) => {
            initial[s.key] = s.value
          })
          setFormData(initial)
        } else {
          setError(res.error || 'فشل تحميل الإعدادات')
        }
      } catch {
        setError('حدث خطأ غير متوقع')
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const payload = Object.entries(formData).map(([key, value]) => ({
        key,
        value,
      }))

 const res = await settingsApi.update({
        settings: payload,
      })
      if (res.success) {
        setToast({
          message: 'تم حفظ الإعدادات بنجاح',
          type: 'success',
          isVisible: true,
        })
      } else {
        setToast({
          message: res.error || 'فشل حفظ الإعدادات',
          type: 'error',
          isVisible: true,
        })
      }
    } catch {
      setToast({
        message: 'حدث خطأ غير متوقع',
        type: 'error',
        isVisible: true,
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AdminShell>
      <PageWrapper title="الإعدادات" subtitle="إدارة إعدادات النظام">

        {error && (
          <div className="mb-4 rounded-xl border border-red-400 bg-red-900/40 px-4 py-3 text-red-200">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="p-6 space-y-4 animate-pulse">
            <div className="h-6 bg-soft rounded" />
            <div className="h-6 bg-soft rounded" />
            <div className="h-6 bg-soft rounded" />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="rounded-2xl border border-subtle bg-surface p-8 space-y-6">
              {settings.map((s) => (
  <div key={s.key} className="space-y-2">
    {/* Label أوضح */}
    <div className="text-sm font-semibold text-gray-800">
      {s.key}
    </div>

    {/* Input يبقى كما هو */}
    <Input
      value={formData[s.key] ?? ''}
      onChange={(e) =>
        setFormData((prev) => ({
          ...prev,
          [s.key]: e.target.value,
        }))
      }
    />
  </div>
))}


              <div className="flex justify-end pt-6 border-t border-subtle">
                <Button type="submit" isLoading={isSaving} className="flex items-center gap-2">
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      جاري الحفظ
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      حفظ الإعدادات
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        )}

        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={() => setToast((t) => ({ ...t, isVisible: false }))}
        />
      </PageWrapper>
    </AdminShell>
  )
}
