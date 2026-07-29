'use client'

import { Bot, User, Languages } from 'lucide-react'

type Props = {
  role: 'user' | 'assistant'
  content: string
  translatedContent?: string
  showTranslate?: boolean
  isTranslated?: boolean
  onTranslate?: () => void
}


export function ChatMessageBubble({
  role,
  content,
  translatedContent,
  showTranslate,
  isTranslated,
  onTranslate,
}: Props) {

  const isUser = role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-start' : 'justify-start'} animate-fadeUp`}>
      <div
        className={[
          'relative max-w-[92%] sm:max-w-[80%] rounded-2xl px-3 py-2 sm:px-4 sm:py-3',
          'border border-border/60 shadow-sm',
          isUser ? 'bg-white' : 'bg-primary/5',
        ].join(' ')}
      >
        {/* Header */}
        <div className="mb-1 flex items-center gap-2 text-xs text-muted">
          {isUser ? <User size={14} /> : <Bot size={14} />}
          <span>{isUser ? 'أنت' : 'المساعد'}</span>
        </div>

        {/* Content */}
       <div className="text-sm leading-6 whitespace-pre-wrap">
  {isTranslated && showTranslate ? translatedContent : content}
</div>


        {/* Translate button */}
        {showTranslate && onTranslate && (
          <button
            onClick={onTranslate}
            className="mt-2 flex items-center gap-1 text-xs text-blue-600 hover:underline"
          >
            <Languages size={12} />
            {isTranslated ? 'إظهار الأصل' : 'ترجمة'}
          </button>
        )}
      </div>
    </div>
  ) 
}
