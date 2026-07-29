'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useToast } from '@/components/ui/toast/useToast'
import { pharmacistAuthApi , authToken } from '@/lib/api/api'

import {
  User,
  Lock,
  Eye,
  EyeOff,
  LogIn,
} from 'lucide-react'

export default function PharmacyLoginPage() {
  const router = useRouter()
  const { showToast } = useToast()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username || !password) {
      showToast('يرجى إدخال اسم المستخدم وكلمة المرور', 'warning')
      return
    }

    setLoading(true)

    const res = await pharmacistAuthApi.login({ username, password })

    setLoading(false)

    if (!res.success) {
      showToast('فشل تسجيل الدخول', 'error')
      return
    }
      showToast('تم تسجيل الدخول بنجاح', 'success')
    authToken.set(res.data.token)
    router.push('/pharmacy/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <Card className="w-full max-w-sm card-lg auth-card">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
            <LogIn className="text-primary" size={24} />
          </div>

          <h1 className="text-lg font-semibold">نظام الصيدلية</h1>
          <p className="text-sm text-muted mt-1">
            تسجيل الدخول إلى لوحة التحكم
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <Input
              placeholder="اسم المستخدم"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="pl-10 bg-subtle"
            />
          </div>

          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10 bg-subtle"
            />

            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full gap-2 mt-2"
            disabled={loading}
          >
            <LogIn size={18} />
            {loading ? 'جاري التحقق...' : 'تسجيل الدخول'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
