'use client'

import { useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Image as ImageIcon, UploadCloud, X } from 'lucide-react'

export type UploadCardProps = {
  title: string
  description?: string
  accept?: string
  file: File | null
  previewUrl?: string | null
  disabled?: boolean
  loading?: boolean
  onPick: (file: File) => void
  onClear: () => void
  onSubmit?: () => void
  submitLabel?: string
}

export function UploadCard({
  title,
  description,
  accept = 'image/*',
  file,
  previewUrl,
  disabled,
  loading,
  onPick,
  onClear,
  onSubmit,
  submitLabel = 'ابدأ التحليل',
}: UploadCardProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const hint = useMemo(() => {
    if (file) return `${file.name} • ${(file.size / 1024).toFixed(0)}KB`
    return 'اسحب الصورة هنا أو اختر ملفًا'
  }, [file])

  const openPicker = () => inputRef.current?.click()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    onPick(f)
    // reset same file selection
    e.target.value = ''
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (disabled || loading) return
    const f = e.dataTransfer.files?.[0]
    if (!f) return
    if (!f.type.startsWith('image/')) return
    onPick(f)
  }

  return (
    <Card className="card-lg p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          {description && (
            <p className="text-sm text-muted mt-1 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!!file && (
            <Button
              type="button"
              variant="ghost"
              className="gap-2"
              onClick={onClear}
              disabled={disabled || loading}
            >
              <X size={16} />
              إزالة
            </Button>
          )}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="mt-4"
      >
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={openPicker}
          className={[
            'group cursor-pointer rounded-2xl border border-dashed border-border/60 bg-subtle/40 p-5',
            'hover:bg-subtle/60 transition-colors',
            disabled ? 'opacity-60 cursor-not-allowed' : '',
          ].join(' ')}
        >
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-primary/10 flex items-center justify-center">
              {previewUrl ? (
                <ImageIcon className="text-primary" size={18} />
              ) : (
                <UploadCloud className="text-primary" size={18} />
              )}
            </div>

            <div className="flex-1">
              <div className="text-sm font-medium">{hint}</div>
              <div className="text-xs text-muted mt-1">
                JPG / PNG / WEBP • أقصى حجم يفضّل ≤ 5MB
              </div>
            </div>
          </div>

          {previewUrl && (
            <div className="mt-4 overflow-hidden rounded-2xl border border-border/50 bg-bg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="preview"
                className="w-full max-h-[360px] object-contain"
              />
            </div>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleChange}
          disabled={disabled || loading}
        />

        {onSubmit && (
          <div className="mt-4 flex justify-end">
            <Button
              type="button"
              size="lg"
              className="gap-2"
              onClick={onSubmit}
              disabled={disabled || loading || !file}
            >
              <UploadCloud size={18} />
              {loading ? 'جارِ التحليل...' : submitLabel}
            </Button>
          </div>
        )}
      </motion.div>
    </Card>
  )
}
