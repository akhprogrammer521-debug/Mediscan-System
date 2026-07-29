import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`rounded-2xl border border-subtle bg-surface shadow-soft ${className}`}
    >
      {children}
    </div>
  )
}
