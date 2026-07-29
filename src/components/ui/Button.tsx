import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  isLoading?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const base =
  'inline-flex items-center justify-center rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[color:var(--bg-body)] disabled:opacity-60 disabled:cursor-not-allowed'

const variants: Record<string, string> = {
  primary:
    'bg-brand-600 text-white hover:bg-brand-500 focus:ring-brand-500 border border-brand-500/60',
  secondary:
    'bg-surface text-main hover:bg-soft border border-subtle',
  ghost:
    'bg-transparent text-muted hover:bg-soft border border-transparent',
  danger:
    'bg-red-600 text-white hover:bg-red-500 focus:ring-red-500 border border-red-500/70',
}


  const sizes: Record<string, string> = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-sm',
    icon: 'h-9 w-9 text-sm',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-transparent" />
          <span className="text-xs">جارِ المعالجة...</span>
        </span>
      ) : (
        children
      )}
    </button>
  )
}
