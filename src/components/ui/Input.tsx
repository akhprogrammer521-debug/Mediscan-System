import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-1 block text-xs font-medium text-slate-200">
          {label}
        </label>
      )}
      <input
  className={`w-full rounded-xl border bg-surface px-3 py-2 text-sm text-main placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 disabled:opacity-70 ${error ? 'border-red-500' : 'border-subtle'} ${className}`}
  {...props}
/>

      {hint && !error && (
        <p className="mt-1 text-[11px] text-slate-400">{hint}</p>
      )}
      {error && (
        <p className="mt-1 text-[11px] text-red-400 font-medium">{error}</p>
      )}
    </div>
  )
}
