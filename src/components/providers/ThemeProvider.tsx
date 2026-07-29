'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

const THEME_STORAGE_KEY = 'mediscan-theme'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light')

  // تطبيق الثيم على <html> + حفظه
  const applyTheme = useCallback((value: Theme) => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', value)
    }
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(THEME_STORAGE_KEY, value)
    }
    setThemeState(value)
  }, [])

  // مرة واحدة عند التحميل: نقرأ من localStorage أو من system
  useEffect(() => {
    if (typeof window === 'undefined') return

    const stored = window.localStorage.getItem(THEME_STORAGE_KEY) as Theme | null
    if (stored === 'light' || stored === 'dark') {
      applyTheme(stored)
    } else {
      const prefersDark = window.matchMedia?.(
        '(prefers-color-scheme: dark)'
      ).matches
      applyTheme(prefersDark ? 'dark' : 'light')
    }
  }, [applyTheme])

  const setTheme = (value: Theme) => {
    applyTheme(value)
  }

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return ctx
}
