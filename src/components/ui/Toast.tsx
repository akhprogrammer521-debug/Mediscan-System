'use client'

import { useEffect } from 'react'
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info'
  isVisible: boolean
  onClose: () => void
  duration?: number
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  isVisible,
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    if (!isVisible) return
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [isVisible, duration, onClose])

  if (!isVisible) return null

  const styles: Record<string, string> = {
    success: 'border-emerald-600 bg-emerald-950 text-emerald-100',
    error: 'border-red-600 bg-red-950 text-red-100',
    info: 'border-brand-600 bg-slate-900 text-slate-100',
  }

  const icons: Record<string, JSX.Element> = {
    success: <CheckCircle2 className="h-5 w-5" />,
    error: <AlertTriangle className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />,
  }

  return (
    <div className="fixed top-4 left-4 z-50">
      <div
        className={`flex min-w-[260px] max-w-sm items-center gap-3 rounded-xl border px-4 py-3 text-xs shadow-soft ${styles[type]}`}
      >
        <span>{icons[type]}</span>
        <p className="flex-1">{message}</p>
        <button
          title="close"
          onClick={onClose}
          className="text-slate-300 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
