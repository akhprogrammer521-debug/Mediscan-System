'use client'

import { SendHorizonal } from 'lucide-react'
import { SectionCard } from '@/components/pharmacy/shared/SectionCard'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

type Language = 'ar' | 'en'

type Props = {
  value: string
  onChange: (v: string) => void
  onSend: () => void
  disabled: boolean
  sending: boolean
  lang: Language
}

export function ChatInput({ value, onChange, onSend, disabled, sending, lang }: Props) {
  return (
    <SectionCard
      title={lang === 'ar' ? 'إرسال رسالة' : 'Send a message'}
      description={lang === 'ar' ? 'اكتب السؤال واضغط إرسال' : 'Type your question and send'}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={lang === 'ar' ? 'مثال: ما جرعة الباراسيتامول؟' : 'e.g., Paracetamol dosage?'}
          className="bg-subtle"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              if (!disabled) onSend()
            }
          }}
        />

        <Button
          variant="primary"
          className="gap-2"
          onClick={onSend}
          disabled={disabled}
          title="إرسال"
        >
          <SendHorizonal size={16} />
          {sending ? (lang === 'ar' ? 'جارٍ الإرسال' : 'Sending') : lang === 'ar' ? 'إرسال' : 'Send'}
        </Button>
      </div>
    </SectionCard>
  )
}
