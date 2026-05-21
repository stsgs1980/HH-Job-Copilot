// ============================================================
// useAuth — Client-side auth hook
// When FEATURE_NEXTAUTH=true: uses next-auth/react useSession()
// When FEATURE_NEXTAUTH=false: returns mock session
// Returns: { user, isAuthenticated, plan, logout, isLoading }
// ============================================================

'use client'

import { useCallback, useMemo } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { MOCK_USER } from '@/lib/mock-auth'
import type { Plan } from '@/types'

/** Feature flag check at build time for client */
const NEXTAUTH_ENABLED = process.env.NEXT_PUBLIC_FEATURE_NEXTAUTH === 'true'

interface AuthUser {
  id: string
  email: string
  name: string | null
  image: string | null
}

interface UseAuthReturn {
  user: AuthUser | null
  isAuthenticated: boolean
  plan: Plan
  logout: () => void
  isLoading: boolean
}

// Static mock logout function (stable reference)
const mockLogout = () => {
  // In mock mode, redirect to landing
  window.location.href = '/'
}

/**
 * Client-side auth hook.
 * Works in both NextAuth and mock mode.
 * All hooks are always called to satisfy rules-of-hooks.
 */
export function useAuth(): UseAuthReturn {
  // Always call all hooks — rules-of-hooks compliance
  const { data: session, status } = useSession()

  const nextAuthLogout = useCallback(() => {
    signOut({ callbackUrl: '/login' })
  }, [])

  // Compute mock auth (always, for consistency)
  const mockAuth = useMemo(() => ({
    user: {
      id: MOCK_USER.id,
      email: MOCK_USER.email,
      name: MOCK_USER.name,
      image: MOCK_USER.image,
    },
    isAuthenticated: true,
    plan: MOCK_USER.plan,
    logout: mockLogout,
    isLoading: false,
  }), [])

  // Compute real auth
  const realAuth = useMemo(() => {
    const isLoading = status === 'loading'
    const isAuthenticated = status === 'authenticated' && !!session?.user

    return {
      user: session?.user
        ? {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name ?? null,
            image: session.user.image ?? null,
          }
        : null,
      isAuthenticated,
      plan: (session?.user as Record<string, unknown>)?.plan as Plan ?? 'STARTER',
      logout: nextAuthLogout,
      isLoading,
    }
  }, [session, status, nextAuthLogout])

  // Return appropriate auth based on feature flag
  return NEXTAUTH_ENABLED ? realAuth : mockAuth
}
