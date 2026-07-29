'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { authApi } from '@/lib/api'
import { setAuthCookie } from '@/app/actions/auth.actions'
import {
  Shield,
  Lock,
  User,
  AlertCircle,
  Eye,
  EyeOff,
  Sun,
  Moon,
} from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { useTheme } from '@/components/providers/ThemeProvider'

interface FormErrors {
  username?: string
  password?: string
  general?: string
}

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  // 🌓 من الـ ThemeProvider
  const { theme, toggleTheme } = useTheme()

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!username.trim()) newErrors.username = 'اسم المستخدم مطلوب'
    if (!password.trim()) newErrors.password = 'كلمة المرور مطلوبة'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (!validateForm()) return

    setIsLoading(true)
    try {
      const response = await authApi.login(username.trim(), password)
      if (response.success && response.data) {
        const { token, user } = response.data

        await setAuthCookie(token)

        document.cookie = `role=${user.role}; path=/;`

        router.push('/admin/dashboard')
        router.refresh()
      }
      else {
        setErrors({
          general:
            response.error ||
            'فشل تسجيل الدخول، يرجى التحقق من البيانات.',
        })
      }
    } catch {
      setErrors({
        general: 'حدث خطأ غير متوقع، حاول مرة أخرى.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center 
bg-[var(--bg-main)] text-[var(--text-main)] transition-colors px-4">
      {/* زر تغيير الثيم */}
      <button
        onClick={toggleTheme}
        className="absolute right-6 top-6 rounded-xl border border-slate-200 bg-white p-2 shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
        title="تغيير الثيم"
      >
        {theme === 'dark' ? (
          <Sun className="h-5 w-5 text-yellow-400" />
        ) : (
          <Moon className="h-5 w-5 text-slate-700" />
        )}
      </button>

      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition-colors dark:border-slate-800 dark:bg-slate-900/90">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white">
              <Shield className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
              تسجيل دخول المسؤول
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              الوصول إلى لوحة التحكم الخاصة بمنصة mediScan
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <div className="mb-2 flex items-start gap-2 rounded-xl border border-red-600 bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950 dark:text-red-100">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>{errors.general}</span>
              </div>
            )}

            {/* Username */}
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-800 dark:text-slate-200">
                اسم المستخدم
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <Input
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="أدخل اسم المستخدم"
                  className="pl-9"
                  error={errors.username}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-800 dark:text-slate-200">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور"
                  className="pl-9 pr-9"
                  error={errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="mt-2 w-full"
              isLoading={isLoading}
            >
              دخول
            </Button>
          </form>

          <p className="mt-6 text-center text-[11px] text-slate-500 dark:text-slate-400">
            هذا النظام مخصص للاستخدام من قبل طاقم الإدارة المصرّح لهم فقط.
          </p>
        </div>
      </div>
    </div>
  )
}
