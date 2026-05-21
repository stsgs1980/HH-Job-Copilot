// ============================================================
// POST /api/stripe/portal — Create Stripe Customer Portal Session
// When FEATURE_STRIPE=false: returns 403
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { isFeatureEnabled } from '@/lib/feature-flags'
import { createPortalSession } from '@/lib/stripe'
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
    const { userId } = body as { userId?: string }

    // Mock userId until real auth is implemented
    const effectiveUserId = userId ?? 'mock-user-001'

    // Get user's Stripe customer ID
    const user = await db.user.findUnique({
      where: { id: effectiveUserId },
      select: { stripeCustomerId: true },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 },
      )
    }

    if (!user.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No billing account found. Please subscribe first.' },
        { status: 400 },
      )
    }

    // Create portal session
    const url = await createPortalSession(user.stripeCustomerId)

    return NextResponse.json({ url })
  } catch (error) {
    console.error('[/api/stripe/portal] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create portal session' },
      { status: 500 },
    )
  }
}
