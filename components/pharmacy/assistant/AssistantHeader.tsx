'use client'

import { Bot, Languages, Plus } from 'lucide-react'
import { SectionCard } from '@/components/pharmacy/shared/SectionCard'
import { Button } from '@/components/ui/Button'

type Language = 'ar' | 'en'

type Props = {
  lang: Language
  onLangChange: (l: Language) => void
  onClear: () => void
  sending: boolean
  
}

export function AssistantHeader({ lang, onLangChange, onClear, sending }: Props) {
  return (
    <SectionCard
      title="المساعد الطبي"
      description="محادثة سريعة للحصول على إجابات ومعلومات عامة"
      icon={Bot}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="soft"
            className="gap-2"
            onClick={() => onLangChange(lang === 'ar' ? 'en' : 'ar')}
            title="تبديل اللغة"
            disabled={sending}
          >
            <Languages size={16} />
            {lang === 'ar' ? 'AR → EN' : 'EN → AR'}
          </Button>

          <Button
            variant="soft"
            className="gap-2"
            onClick={onClear}
            disabled={sending}
            title="بدء محادثة جديدة"
          >
            <Plus size={16} />
            محادثة جديدة
          </Button>
        </div>

        <div className="text-xs text-muted">
          {lang === 'ar' ? 'تنبيه: معلومات عامة وليست تشخيصًا.' : 'Note: General info, not diagnosis.'}
        </div>
      </div>
    </SectionCard>
  )
}
