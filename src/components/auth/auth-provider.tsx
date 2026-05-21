// ============================================================
// Auth Provider — Conditional SessionProvider wrapper
// When FEATURE_NEXTAUTH=true: wraps children with NextAuth SessionProvider
// When FEATURE_NEXTAUTH=false: renders children directly (mock mode)
// ============================================================

'use client'

import { SessionProvider } from 'next-auth/react'

const NEXTAUTH_ENABLED = process.env.NEXT_PUBLIC_FEATURE_NEXTAUTH === 'true'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  if (!NEXTAUTH_ENABLED) {
    return <>{children}</>
  }

  return <SessionProvider>{children}</SessionProvider>
}
