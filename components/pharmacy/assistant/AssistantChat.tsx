'use client'

import { useEffect, useMemo, useRef } from 'react'
import { SectionCard } from '@/components/pharmacy/shared/SectionCard'
import { Bot } from 'lucide-react'
import { ChatMessageBubble } from '@/components/pharmacy/assistant/ChatMessage'

type Language = 'ar' | 'en'
type ChatRole = 'user' | 'assistant'

export type ChatMessage = {
  id: string
  role: ChatRole
  content: string
  translatedContent?: string
  isTranslated?: boolean
  createdAt: number
}

type Props = {
  lang: Language
  messages: ChatMessage[]
  onTranslate: (id: string) => void
}

export function AssistantChat({ messages, onTranslate }: Props) {
  const endRef = useRef<HTMLDivElement | null>(null)

  const sorted = useMemo(
    () => [...messages].sort((a, b) => a.createdAt - b.createdAt),
    [messages]
  )

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [sorted.length])

  return (
    <SectionCard title="المحادثة" description="اكتب سؤالك بالأسفل" icon={Bot}>
      <div className="max-h-[60vh] overflow-y-auto rounded-2xl border border-border/60 bg-subtle/40 p-3 sm:p-4">
        <div className="flex flex-col gap-3">
          {messages.map((m) => (
            <ChatMessageBubble
              key={m.id}
              role={m.role}
              content={m.isTranslated && m.translatedContent ? m.translatedContent : m.content}
              translatedContent={m.translatedContent}
              isTranslated={m.isTranslated}
              showTranslate={m.role === 'assistant'}
              onTranslate={() => onTranslate?.(m.id)}
            />
          ))}

          <div ref={endRef} />
        </div>
      </div>
    </SectionCard>
  )
}
