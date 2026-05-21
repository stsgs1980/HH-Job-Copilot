'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { DashboardMode } from '@/types'

interface DashboardModeContextValue {
  activeMode: DashboardMode
  setActiveMode: (mode: DashboardMode) => void
}

const DashboardModeContext = createContext<DashboardModeContextValue | null>(null)

export function DashboardModeProvider({ children }: { children: ReactNode }) {
  const [activeMode, setActiveMode] = useState<DashboardMode>('chat')

  const handleSetActiveMode = useCallback((mode: DashboardMode) => {
    setActiveMode(mode)
  }, [])

  return (
    <DashboardModeContext.Provider value={{ activeMode, setActiveMode: handleSetActiveMode }}>
      {children}
    </DashboardModeContext.Provider>
  )
}

export function useDashboardMode() {
  const ctx = useContext(DashboardModeContext)
  if (!ctx) throw new Error('useDashboardMode must be used within DashboardModeProvider')
  return ctx
}
