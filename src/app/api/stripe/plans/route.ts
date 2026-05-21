// ============================================================
// GET /api/stripe/plans — Return available plans + current subscription
// Works even when Stripe is disabled (returns plan info from DB)
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { PLANS } from '@/lib/stripe'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    // Get userId from query params (for MVP, no auth)
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId') ?? 'mock-user-001'

    // Get user's current plan from DB
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        plan: true,
        stripeCustomerId: true,
        stripeCurrentPeriodEnd: true,
        stripePriceId: true,
      },
    })

    const currentPlan = user?.plan ?? 'STARTER'

    return NextResponse.json({
      plans: PLANS.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        priceLabel: p.priceLabel,
        features: p.features,
        limits: p.limits,
        popular: p.popular ?? false,
      })),
      currentPlan,
      subscription: user
        ? {
            plan: user.plan,
            stripeCustomerId: user.stripeCustomerId,
            currentPeriodEnd: user.stripeCurrentPeriodEnd,
            priceId: user.stripePriceId,
          }
        : null,
    })
  } catch (error) {
    console.error('[/api/stripe/plans] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch plans' },
      { status: 500 },
    )
  }
}
