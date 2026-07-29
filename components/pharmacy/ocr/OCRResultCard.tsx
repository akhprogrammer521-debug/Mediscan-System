'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { ClipboardCopy, FileText } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/toast/useToast'

export type OCRResultCardProps = {
  title?: string
  text?: string | null
  language?: string | null
}

export function OCRResultCard({
  title = 'النص المستخرج (OCR)',
  text,
  language,
}: OCRResultCardProps) {
  const { showToast } = useToast()

  const copy = async () => {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      showToast('تم نسخ النص', 'success')
    } catch {
      showToast('فشل النسخ', 'error')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Card className="card-lg p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center">
              <FileText className="text-primary" size={18} />
            </div>
            <div>
              <div className="text-sm font-semibold">{title}</div>
              <div className="text-xs text-muted mt-0.5">
                اللغة: {language || 'غير محددة'}
              </div>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            className="gap-2"
            onClick={copy}
            disabled={!text}
          >
            <ClipboardCopy size={16} />
            نسخ
          </Button>
        </div>

        <div className="mt-4 rounded-2xl border border-border/60 bg-subtle/40 p-4">
          <pre className="whitespace-pre-wrap text-sm leading-relaxed text-text">
            {text || 'لا يوجد نص بعد.'}
          </pre>
        </div>
      </Card>
    </motion.div>
  )
}
