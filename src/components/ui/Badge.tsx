import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'outline'
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
}) => {
  const variants: Record<string, string> = {
  default: 'bg-soft text-main border border-subtle',
  success: 'bg-emerald-900/60 text-emerald-200 border border-emerald-700',
  warning: 'bg-amber-900/60 text-amber-200 border border-amber-700',
  danger: 'bg-red-900/60 text-red-200 border border-red-700',
  outline: 'bg-transparent text-muted border border-subtle',
}


  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
