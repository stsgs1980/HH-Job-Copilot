// ============================================================
// Rate Limiting by Plan — In-memory store for MVP
// Works independently of Stripe (based on DB plan field)
// -1 = unlimited
// ============================================================

import { db } from '@/lib/db'
import type { Plan } from '@/lib/stripe'
import { getPlanLimits } from '@/lib/stripe'

/** Rate limit action types */
export type RateLimitAction =
  | 'applications'
  | 'chatMessages'
  | 'aiChat'
  | 'asrMinutes'
  | 'ttsMinutes'

/** Mapping from action to plan limit field */
const ACTION_TO_LIMIT_FIELD: Record<RateLimitAction, keyof ReturnType<typeof getPlanLimits>> = {
  applications: 'applicationsPerDay',
  chatMessages: 'chatMessagesPerDay',
  aiChat: 'aiChatPerDay',
  asrMinutes: 'asrMinutesPerDay',
  ttsMinutes: 'ttsMinutesPerDay',
}

/** Rate limit check result */
export interface RateLimitResult {
  allowed: boolean
  remaining: number
  limit: number   // -1 = unlimited
  resetAt: Date   // When the daily window resets
}

// ---- In-memory rate limit store ----

interface RateLimitEntry {
  count: number
  resetAt: number // Unix timestamp ms
}

/** Map<key, entry> where key = `${userId}:${action}` */
const store = new Map<string, RateLimitEntry>()

/** Clean up expired entries every 10 minutes */
const CLEANUP_INTERVAL = 10 * 60 * 1000
let lastCleanup = Date.now()

function cleanupExpired() {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL) return
  lastCleanup = now

  for (const [key, entry] of store) {
    if (now > entry.resetAt) {
      store.delete(key)
    }
  }
}

/**
 * Get the start of the next day (midnight UTC) for reset calculation
 */
function getNextDayReset(): Date {
  const tomorrow = new Date()
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1)
  tomorrow.setUTCHours(0, 0, 0, 0)
  return tomorrow
}

/**
 * Get user's current plan from DB
 * Falls back to STARTER if user not found
 */
async function getUserPlan(userId: string): Promise<Plan> {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { plan: true },
    })
    return (user?.plan as Plan) ?? 'STARTER'
  } catch {
    return 'STARTER'
  }
}

/**
 * Check rate limit for a user and action
 * Returns whether the action is allowed and remaining count
 *
 * @param userId - The user ID
 * @param action - The action type to check
 * @param increment - Whether to increment the counter (default: true)
 * @returns RateLimitResult with allowed status and remaining count
 */
export async function checkRateLimit(
  userId: string,
  action: RateLimitAction,
  increment = true,
): Promise<RateLimitResult> {
  // Clean up expired entries periodically
  cleanupExpired()

  // Get user's plan and limits
  const plan = await getUserPlan(userId)
  const limits = getPlanLimits(plan)
  const limitField = ACTION_TO_LIMIT_FIELD[action]
  const limit = limits[limitField]

  // Unlimited means always allowed
  if (limit === -1) {
    return {
      allowed: true,
      remaining: -1,
      limit: -1,
      resetAt: getNextDayReset(),
    }
  }

  // Zero limit means action not available for this plan
  if (limit === 0) {
    return {
      allowed: false,
      remaining: 0,
      limit: 0,
      resetAt: getNextDayReset(),
    }
  }

  const now = Date.now()
  const key = `${userId}:${action}`
  const entry = store.get(key)

  // Determine current count and reset time
  let count: number
  let resetAt: number

  if (entry && now < entry.resetAt) {
    // Entry exists and hasn't expired
    count = entry.count
    resetAt = entry.resetAt
  } else {
    // No entry or expired — start fresh
    count = 0
    const nextReset = getNextDayReset()
    resetAt = nextReset.getTime()
  }

  // Check if allowed
  const allowed = count < limit
  const remaining = Math.max(0, limit - count - (increment && allowed ? 1 : 0))

  // Increment counter if allowed and requested
  if (increment && allowed) {
    store.set(key, {
      count: count + 1,
      resetAt,
    })
  }

  return {
    allowed,
    remaining,
    limit,
    resetAt: new Date(resetAt),
  }
}

/**
 * Get current usage stats for a user
 * Returns usage counts for all action types
 */
export async function getUserUsage(userId: string): Promise<
  Record<RateLimitAction, { used: number; limit: number; remaining: number }>
> {
  const plan = await getUserPlan(userId)
  const limits = getPlanLimits(plan)
  const now = Date.now()

  const result = {} as Record<RateLimitAction, { used: number; limit: number; remaining: number }>

  for (const action of Object.keys(ACTION_TO_LIMIT_FIELD) as RateLimitAction[]) {
    const limitField = ACTION_TO_LIMIT_FIELD[action]
    const limit = limits[limitField]
    const key = `${userId}:${action}`
    const entry = store.get(key)

    const used = entry && now < entry.resetAt ? entry.count : 0
    const remaining = limit === -1 ? -1 : Math.max(0, limit - used)

    result[action] = { used, limit, remaining }
  }

  return result
}

/**
 * Reset rate limit for a specific user and action (admin use)
 */
export function resetRateLimit(userId: string, action: RateLimitAction): void {
  const key = `${userId}:${action}`
  store.delete(key)
}

/**
 * Reset all rate limits for a user (admin use)
 */
export function resetAllRateLimits(userId: string): void {
  for (const action of Object.keys(ACTION_TO_LIMIT_FIELD) as RateLimitAction[]) {
    store.delete(`${userId}:${action}`)
  }
}
