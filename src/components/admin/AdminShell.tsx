'use client'

import React from 'react'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'

interface AdminShellProps {
  children: React.ReactNode
}



export const AdminShell: React.FC<AdminShellProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[color:var(--bg-body)] flex">
      {/* Sidebar ثابت على اليمين */}
      <Sidebar />

      {/* كل شيء آخر (navbar + page) يتحرّك بمقدار عرض السايدبار */}
      <div
        className="flex flex-1 flex-col min-h-screen transition-all duration-300 "
        style={{ marginRight: 'var(--sidebar-width)' }}
      >
        <Navbar />

        <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
