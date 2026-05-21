// ============================================================
// POST /api/stripe/checkout — Create Stripe Checkout Session
// When FEATURE_STRIPE=false: returns 403
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { isFeatureEnabled } from '@/lib/feature-flags'
import { createCheckoutSession } from '@/lib/stripe'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  // Guard: feature flag
  if (!isFeatureEnabled('stripe')) {
    return NextResponse.json(
      { error: 'Payments not available yet' },
      { status: 403 },
    )
  }

  try {
    const body = await req.json()
    const { plan, userId } = body as {
      plan: 'PRO' | 'ULTRA'
      userId?: string
    }

    // Validate plan
    if (!plan || !['PRO', 'ULTRA'].includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan. Must be PRO or ULTRA' },
        { status: 400 },
      )
    }

    // Mock userId until real auth is implemented
    // TODO: Replace with session-based userId when NextAuth is enabled
    const effectiveUserId = userId ?? 'mock-user-001'

    // Get user email
    const user = await db.user.findUnique({
      where: { id: effectiveUserId },
      select: { email: true, plan: true },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 },
      )
    }

    // Check if user already on this plan or higher
    const planRank = { STARTER: 0, PRO: 1, ULTRA: 2 }
    if (planRank[user.plan as keyof typeof planRank] >= planRank[plan]) {
      return NextResponse.json(
        { error: `You are already on the ${user.plan} plan or higher` },
        { status: 400 },
      )
    }

    // Create checkout session
    const url = await createCheckoutSession(effectiveUserId, plan)

    return NextResponse.json({ url })
  } catch (error) {
    console.error('[/api/stripe/checkout] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create checkout session' },
      { status: 500 },
    )
  }
}
