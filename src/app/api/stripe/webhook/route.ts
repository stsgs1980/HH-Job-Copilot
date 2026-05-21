// ============================================================
// POST /api/stripe/webhook — Handle Stripe Webhooks
// Verifies signature, updates DB based on event type
// When FEATURE_STRIPE=false: returns 200 (ignore)
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { isFeatureEnabled } from '@/lib/feature-flags'
import { getStripe, handleSubscriptionUpdate, handleSubscriptionDeleted } from '@/lib/stripe'
import type Stripe from 'stripe'

export async function POST(req: NextRequest) {
  // Guard: feature flag — just acknowledge but don't process
  if (!isFeatureEnabled('stripe')) {
    return NextResponse.json({ received: true })
  }

  const stripe = getStripe()
  if (!stripe) {
    return NextResponse.json({ received: true })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('[/api/stripe/webhook] Missing STRIPE_WEBHOOK_SECRET')
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 },
    )
  }

  try {
    // Get raw body for signature verification
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
      console.error('[/api/stripe/webhook] Missing stripe-signature header')
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 },
      )
    }

    // Verify webhook signature
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('[/api/stripe/webhook] Signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 },
      )
    }

    // Handle event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        console.log(`[Stripe] checkout.session.completed: ${session.id}`)

        // Extract subscription info
        if (session.mode === 'subscription' && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string,
          )

          await handleSubscriptionUpdate(
            subscription.customer as string,
            subscription.items.data[0]?.price.id ?? null,
            subscription.current_period_end
              ? new Date(subscription.current_period_end * 1000)
              : null,
          )
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        console.log(`[Stripe] customer.subscription.updated: ${subscription.id}`)

        await handleSubscriptionUpdate(
          subscription.customer as string,
          subscription.items.data[0]?.price.id ?? null,
          subscription.current_period_end
            ? new Date(subscription.current_period_end * 1000)
            : null,
        )
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        console.log(`[Stripe] customer.subscription.deleted: ${subscription.id}`)

        await handleSubscriptionDeleted(subscription.customer as string)
        break
      }

      default:
        console.log(`[Stripe] Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[/api/stripe/webhook] Error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 },
    )
  }
}
