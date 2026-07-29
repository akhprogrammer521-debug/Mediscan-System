'use client'

import React from 'react'

interface PageWrapperProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
}

export const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  title,
  subtitle,
}) => {
  return (
    <div className="page-animate">
      {title && (
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-main">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-sm text-muted">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </div>
  )
}
