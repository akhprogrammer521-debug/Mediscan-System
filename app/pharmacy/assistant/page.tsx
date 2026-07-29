'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { aiApi, authToken, translateApi } from '@/lib/api/api'
import { useToast } from '@/components/ui/toast/useToast'

import { PageSkeleton } from '@/components/pharmacy/shared/PageSkeleton'
import { AssistantHeader } from '@/components/pharmacy/assistant/AssistantHeader'
import { AssistantChat } from '@/components/pharmacy/assistant/AssistantChat'
import { ChatInput } from '@/components/pharmacy/assistant/ChatInput'

type Language = 'ar' | 'en'
type ChatRole = 'user' | 'assistant'

type ChatMessage = {
  id: string
  role: ChatRole
  content: string
  translatedContent?: string
  isTranslated?: boolean
  createdAt: number
}

const uid = () => `${Date.now()}_${Math.random().toString(16).slice(2)}`


const detectLanguage = (text: string): Language => {
  const hasArabic = /[\u0600-\u06FF]/.test(text)
  const hasEnglish = /[a-zA-Z]/.test(text)

  // نص مختلط → نترجم حسب لغة الواجهة
  if (hasArabic && hasEnglish) {
    return 'ar' // نعتبره عربي افتراضيًا
  }

  return hasEnglish ? 'en' : 'ar'
}


export default function AssistantPage() {
  const router = useRouter()
  const { showToast } = useToast()

  const [loading, setLoading] = useState(true)
  const [lang, setLang] = useState<Language>('ar')
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: uid(),
      role: 'assistant',
      content:
        lang === 'ar'
          ? 'مرحبًا 👋 أنا المساعد الطبي. اكتب سؤالك وسأساعدك.'
          : 'Hi 👋 I’m the medical assistant. Ask me anything.',
      createdAt: Date.now(),
    },
  ])

  const bootOnce = useRef(false)

  // 🔁 تحديث رسالة الترحيب عند تغيير اللغة (إذا المحادثة جديدة)
  useEffect(() => {
    if (!bootOnce.current) {
      bootOnce.current = true
      setLoading(false)
      return
    }

    if (messages.length === 1 && messages[0]?.role === 'assistant') {
      setMessages([
        {
          id: uid(),
          role: 'assistant',
          content:
            lang === 'ar'
              ? 'مرحبًا 👋 أنا المساعد الطبي. اكتب سؤالك وسأساعدك.'
              : 'Hi 👋 I’m the medical assistant. Ask me anything.',
          createdAt: Date.now(),
        },
      ])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang])

  const canSend = useMemo(() => {
    return input.trim().length >= 2 && !sending
  }, [input, sending])

  // 📤 إرسال رسالة للـ AI
  const handleSend = async () => {
    const text = input.trim()
    if (!text || sending) return

    setSending(true)
    setInput('')

    const userMsg: ChatMessage = {
      id: uid(),
      role: 'user',
      content: text,
      createdAt: Date.now(),
    }

    const assistantStub: ChatMessage = {
      id: uid(),
      role: 'assistant',
      content: lang === 'ar' ? '...جارٍ التفكير' : '...Thinking',
      createdAt: Date.now() + 1,
    }

    setMessages((prev) => [...prev, userMsg, assistantStub])

    const res = await aiApi.chat(text, lang)

    if (!res.success) {
      const msg = (res.error || '').toLowerCase()
      if (msg.includes('unauthorized') || msg.includes('token')) {
        authToken.remove()
        router.replace('/login')
        return
      }

      showToast(res.error, 'error')
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantStub.id
            ? {
                ...m,
                content:
                  lang === 'ar'
                    ? 'تعذر الحصول على رد الآن. حاول مرة أخرى.'
                    : 'Could not get a response. Please try again.',
              }
            : m
        )
      )
      setSending(false)
      return
    }

    setMessages((prev) =>
      prev.map((m) =>
        m.id === assistantStub.id
          ? { ...m, content: res.data.answer || '—' }
          : m
      )
    )

    setSending(false)
  }

  const handleTranslate = async (id: string) => {
  const msg = messages.find((m) => m.id === id)
  if (!msg) return

  // Toggle
  if (msg.translatedContent) {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, isTranslated: !m.isTranslated } : m
      )
    )
    return
  }

  const from = detectLanguage(msg.content)
  const to: Language = from === 'ar' ? 'en' : 'ar'

  try {
    const res = await translateApi.translate(msg.content, from, to)
    console.log('TRANSLATE RESPONSE', res)

    if (!res.success || !res.data.translation) {
      showToast('فشل الترجمة', 'error')
      return
    }

    setMessages((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              translatedContent: res.data.translation,
              isTranslated: true,
            }
          : m
      )
    )
  } catch (e) {
    console.error('TRANSLATION ERROR', e)
    showToast('حدث خطأ أثناء الترجمة', 'error')
  }
}

  const handleClear = () => {
    setMessages([
      {
        id: uid(),
        role: 'assistant',
        content:
          lang === 'ar'
            ? 'تم بدء محادثة جديدة ✅ اكتب سؤالك.'
            : 'New chat started ✅ Ask your question.',
        createdAt: Date.now(),
      },
    ])
    setInput('')
  }

  if (loading) return <PageSkeleton title="المساعد الطبي" />

  return (
    <div className="space-y-6 page-animate">
      <AssistantHeader
        lang={lang}
        onLangChange={setLang}
        onClear={handleClear}
        sending={sending}
      />

      <AssistantChat
        lang={lang}
        messages={messages}
        onTranslate={handleTranslate}
      />

      <ChatInput
        value={input}
        onChange={setInput}
        onSend={handleSend}
        disabled={!canSend}
        sending={sending}
        lang={lang}
      />
    </div>
  )
}
