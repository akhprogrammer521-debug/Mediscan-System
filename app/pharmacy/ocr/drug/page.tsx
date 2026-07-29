'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ocrApi } from '@/lib/api/api'
import type { OCRDrugScanResponse } from '@/lib/api/api'
import { useToast } from '@/components/ui/toast/useToast'
import { UploadCard } from '@/components/pharmacy/ocr/UploadCard'
import { OCRResultCard } from '@/components/pharmacy/ocr/OCRResultCard'
import { DrugResultCard } from '@/components/pharmacy/ocr/DrugResultCard'
import { Card } from '@/components/ui/Card'
import { Scan, Sparkles } from 'lucide-react'

export default function DrugOCRPage() {
  const { showToast } = useToast()

  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<OCRDrugScanResponse | null>(null)

  const canSubmit = useMemo(() => !!file && !loading, [file, loading])

  const pick = (f: File) => {
    setFile(f)
    setResult(null)
    setPreviewUrl(URL.createObjectURL(f))
  }

  const clear = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    setFile(null)
    setResult(null)
  }

  // 🔥 FIXED SUBMIT (NO BASE64)
  const submit = async () => {
    if (!file) return

    setLoading(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('image', file) // MUST match multer field name

      const res = await ocrApi.scanDrug(formData)

      if (!res.success) {
        showToast(res.error, 'error')
        return
      }

      setResult(res.data)
      showToast('تم تحليل الصورة بنجاح', 'success')
    } catch {
      showToast('فشل تحليل الصورة', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold">مسح دواء</h1>
          <p className="text-sm text-muted mt-1">
            ارفع صورة الدواء ليتم استخراج النص وربط النتائج مع قاعدة الأدوية.
          </p>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Scan className="text-primary" size={18} />
          </div>
        </div>
      </div>

      <UploadCard
        title="صورة الدواء"
        description="ارفع صورة واضحة لعلبة الدواء أو الملصق."
        file={file}
        previewUrl={previewUrl}
        onPick={pick}
        onClear={clear}
        onSubmit={submit}
        submitLabel="ابدأ التحليل"
        loading={loading}
      />

      {loading && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="card-lg p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="text-primary" size={18} />
              </div>
              <div>
                <div className="text-sm font-semibold">جارِ التحليل...</div>
                <div className="text-xs text-muted mt-1">
                  قد يستغرق الأمر بضع ثوانٍ حسب حجم الصورة.
                </div>
              </div>
            </div>

            <div className="mt-4 h-2 w-full rounded-full bg-subtle overflow-hidden">
              <motion.div
                className="h-full w-1/2 rounded-full bg-primary/40"
                animate={{ x: ['-50%', '150%'] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
              />
            </div>
          </Card>
        </motion.div>
      )}

      {result && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <OCRResultCard
            text={result.scan?.text ?? ''}
            language={result.scan?.language ?? null}
          />
          <DrugResultCard drug={result.drug ?? null} />
        </div>
      )}

      {!loading && !result && (
        <Card className="card-lg p-5">
          <div className="text-sm text-muted leading-relaxed">
            ارفع صورة ثم اضغط <b>ابدأ التحليل</b> لعرض النص المستخرج ونتيجة مطابقة الدواء.
          </div>
        </Card>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={clear}
          className="text-xs text-muted hover:text-text transition-colors"
          disabled={!file && !result}
        >
          إعادة تعيين
        </button>
      </div>

      <div className="sr-only">{String(canSubmit)}</div>
    </div>
  )
}
