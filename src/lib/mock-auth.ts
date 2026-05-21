// ============================================================
// Mock Auth — Development session fallback
// When FEATURE_NEXTAUTH=false, provides a mock user/session
// so the app works without real authentication.
// ============================================================

import { isFeatureEnabled } from '@/lib/feature-flags'
import type { Plan } from '@/types'

/** Mock user used when FEATURE_NEXTAUTH=false */
export const MOCK_USER = {
  id: 'mock-user-001',
  email: 'demo@hhcopilot.ru',
  name: 'Сергей Т.',
  image: null,
  plan: 'PRO' as Plan,
} as const

/** Mock session compatible with next-auth Session shape */
export const MOCK_SESSION = {
  user: {
    id: MOCK_USER.id,
    email: MOCK_USER.email,
    name: MOCK_USER.name,
    image: MOCK_USER.image,
    plan: MOCK_USER.plan,
  },
  expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
} as const

/**
 * Get the current user ID.
 * - When FEATURE_NEXTAUTH=true: returns the real session user ID (call from server context)
 * - When FEATURE_NEXTAUTH=false: returns the mock user ID
 *
 * In API routes, use this with a fallback:
 *   const userId = getUserId() ?? body.userId ?? searchParams.get('userId')
 */
export function getMockUserId(): string {
  return MOCK_USER.id
}

/**
 * Get the current user plan.
 * - When FEATURE_NEXTAUTH=true: returns the real plan from session
 * - When FEATURE_NEXTAUTH=false: returns 'PRO'
 */
export function getMockUserPlan(): Plan {
  return MOCK_USER.plan
}

/**
 * Check if we're in mock auth mode.
 */
export function isMockAuth(): boolean {
  return !isFeatureEnabled('nextauth')
}

/**
 * Server-side helper: resolve user ID from session or fallback sources.
 *
 * Usage in API routes:
 *   const userId = await resolveUserId(request) // checks session first, then falls back
 *
 * For GET routes, also checks searchParams:
 *   const userId = await resolveUserId(request, { queryParam: 'userId' })
 *
 * For POST routes, also checks body:
 *   const userId = await resolveUserId(request, { bodyField: 'userId' })
 */
export async function resolveUserId(
  request?: Request,
  options?: { queryParam?: string; bodyField?: string },
): Promise<string> {
  // In mock mode, always return mock user ID
  if (isMockAuth()) {
    return MOCK_USER.id
  }

  // In real auth mode, try to get user from session
  try {
    const { getServerSession } = await import('next-auth')
    const { authOptions } = await import('@/lib/auth')
    const session = await getServerSession(authOptions)
    if (session?.user?.id) {
      return session.user.id
    }
  } catch {
    // Session lookup failed, fall through to fallbacks
  }

  // Try query param fallback
  if (request && options?.queryParam) {
    const url = new URL(request.url)
    const fromQuery = url.searchParams.get(options.queryParam)
    if (fromQuery) return fromQuery
  }

  // Try body field fallback
  if (request && options?.bodyField) {
    try {
      const body = await request.clone().json() as Record<string, unknown>
      const fromBody = body[options.bodyField]
      if (typeof fromBody === 'string' && fromBody) return fromBody
    } catch {
      // Body not parseable, ignore
    }
  }

  // Ultimate fallback to mock user
  return MOCK_USER.id
}

/**
 * Server-side helper: resolve user plan from session or fallback.
 */
export async function resolveUserPlan(): Promise<Plan> {
  if (isMockAuth()) {
    return MOCK_USER.plan
  }

  try {
    const { getServerSession } = await import('next-auth')
    const { authOptions } = await import('@/lib/auth')
    const session = await getServerSession(authOptions)
    if ((session?.user as Record<string, unknown>)?.plan) {
      return (session.user as Record<string, unknown>).plan as Plan
    }
  } catch {
    // Session lookup failed
  }

  return 'STARTER' as Plan
}
