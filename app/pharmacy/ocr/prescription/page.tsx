'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ocrApi } from '@/lib/api/api'
import type { OCRPrescriptionScanResponse } from '@/lib/api/api'
import { useToast } from '@/components/ui/toast/useToast'
import { UploadCard } from '@/components/pharmacy/ocr/UploadCard'
import { OCRResultCard } from '@/components/pharmacy/ocr/OCRResultCard'
import { PrescriptionResult } from '@/components/pharmacy/ocr/PrescriptionResult'
import { Card } from '@/components/ui/Card'
import { FileText, Sparkles } from 'lucide-react'

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

export default function PrescriptionOCRPage() {
  const { showToast } = useToast()

  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [result, setResult] = useState<OCRPrescriptionScanResponse | null>(null)

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

  const submit = async () => {
    if (!file) return
    setLoading(true)
    setResult(null)

    try {
      const base64 = await fileToBase64(file)
      const res = await ocrApi.scanPrescription(base64)

      if (!res.success) {
        showToast(res.error, 'error')
        setLoading(false)
        return
      }

      setResult(res.data)
      showToast('تم تحليل الوصفة بنجاح', 'success')
    } catch {
      showToast('فشل تحليل الوصفة', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold">مسح وصفة طبية</h1>
          <p className="text-sm text-muted mt-1">
            ارفع صورة وصفة طبية ليتم استخراج النص والأدوية المحتملة.
          </p>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
            <FileText className="text-primary" size={18} />
          </div>
        </div>
      </div>

      <UploadCard
        title="صورة الوصفة"
        description="يفضّل صورة مستقيمة وإضاءة واضحة."
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
                  يتم استخراج النص ومحاولة التعرف على أسماء الأدوية.
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
            title="النص المستخرج من الوصفة"
            text={result.scan?.text ?? ''}
            language={result.scan?.language ?? null}
          />
          <PrescriptionResult extractedDrugNames={result.extractedDrugNames ?? []} />
        </div>
      )}

      {!loading && !result && (
        <Card className="card-lg p-5">
          <div className="text-sm text-muted leading-relaxed">
            ارفع صورة ثم اضغط <b>ابدأ التحليل</b> لعرض النص والأدوية المستخرجة.
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
