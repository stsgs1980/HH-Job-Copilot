// ============================================================
// Stripe Server Utilities — Test mode only
// All operations guarded by isFeatureEnabled('stripe')
// ============================================================

import Stripe from 'stripe'
import { isFeatureEnabled } from '@/lib/feature-flags'
import { db } from '@/lib/db'

/** Plan type matching Prisma enum */
export type Plan = 'STARTER' | 'PRO' | 'ULTRA'

/** Plan limits structure */
export interface PlanLimits {
  applicationsPerDay: number   // -1 = unlimited
  chatMessagesPerDay: number
  aiChatPerDay: number
  asrMinutesPerDay: number
  ttsMinutesPerDay: number
}

/** Price IDs for each paid plan (from env) */
const PRICE_IDS: Record<'PRO' | 'ULTRA', string | undefined> = {
  PRO: process.env.STRIPE_PRO_PRICE_ID,
  ULTRA: process.env.STRIPE_ULTRA_PRICE_ID,
}

/** Plan display info */
export interface PlanInfo {
  id: Plan
  name: string
  price: number
  priceLabel: string
  features: string[]
  limits: PlanLimits
  popular?: boolean
}

/** All plan definitions */
export const PLANS: PlanInfo[] = [
  {
    id: 'STARTER',
    name: 'Starter',
    price: 0,
    priceLabel: 'Free',
    features: [
      '5 job applications/day',
      '10 chat messages/day',
      '20 AI chat messages/day',
      'Basic AI cover letters',
    ],
    limits: {
      applicationsPerDay: 5,
      chatMessagesPerDay: 10,
      aiChatPerDay: 20,
      asrMinutesPerDay: 0,
      ttsMinutesPerDay: 0,
    },
  },
  {
    id: 'PRO',
    name: 'Pro',
    price: 19,
    priceLabel: '$19/mo',
    features: [
      'Unlimited job applications',
      'Unlimited chat messages',
      'Unlimited AI chat',
      '30 min ASR/day',
      'AI interview hints',
      'AI humanizer',
    ],
    limits: {
      applicationsPerDay: -1,
      chatMessagesPerDay: -1,
      aiChatPerDay: -1,
      asrMinutesPerDay: 30,
      ttsMinutesPerDay: 0,
    },
    popular: true,
  },
  {
    id: 'ULTRA',
    name: 'Ultra',
    price: 49,
    priceLabel: '$49/mo',
    features: [
      'Everything in Pro',
      'Unlimited ASR',
      '60 min TTS/day',
      'Priority AI responses',
      'Advanced analytics',
    ],
    limits: {
      applicationsPerDay: -1,
      chatMessagesPerDay: -1,
      aiChatPerDay: -1,
      asrMinutesPerDay: -1,
      ttsMinutesPerDay: 60,
    },
  },
]

/** Get plan limits by plan id */
export function getPlanLimits(plan: Plan): PlanLimits {
  const planInfo = PLANS.find((p) => p.id === plan)
  if (!planInfo) return PLANS[0].limits
  return planInfo.limits
}

/** Get plan info by plan id */
export function getPlanInfo(plan: Plan): PlanInfo {
  const planInfo = PLANS.find((p) => p.id === plan)
  if (!planInfo) return PLANS[0]
  return planInfo
}

/**
 * Initialize Stripe client (only when feature flag is on AND key is configured)
 * Returns null when Stripe is disabled — callers must check
 */
export function getStripe(): Stripe | null {
  if (!isFeatureEnabled('stripe') || !process.env.STRIPE_SECRET_KEY) return null
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
    typescript: {
      // Suppress ts2769 for Stripe API version mismatch
      ignoreUnknownFiles: true,
    },
  } as Stripe.StripeConfig)
}

/**
 * Create or get Stripe customer for a user
 * Returns the Stripe customer ID
 */
export async function getOrCreateCustomer(
  userId: string,
  email: string,
): Promise<string> {
  const stripe = getStripe()
  if (!stripe) throw new Error('Stripe is not configured')

  // Check if user already has a Stripe customer ID
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true },
  })

  if (user?.stripeCustomerId) {
    return user.stripeCustomerId
  }

  // Create a new Stripe customer
  const customer = await stripe.customers.create({
    email,
    metadata: {
      userId,
    },
  })

  // Save customer ID to DB
  await db.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customer.id },
  })

  return customer.id
}

/**
 * Create a Stripe Checkout Session for plan upgrade
 * Returns the checkout session URL
 */
export async function createCheckoutSession(
  userId: string,
  plan: 'PRO' | 'ULTRA',
): Promise<string> {
  const stripe = getStripe()
  if (!stripe) throw new Error('Stripe is not configured')

  // Get user info
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { email: true, stripeCustomerId: true },
  })

  if (!user) throw new Error('User not found')

  const priceId = PRICE_IDS[plan]
  if (!priceId) throw new Error(`No price ID configured for plan: ${plan}`)

  // Ensure customer exists
  const customerId = await getOrCreateCustomer(userId, user.email)

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}?checkout=success&plan=${plan}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}?checkout=cancelled`,
    metadata: {
      userId,
      plan,
    },
    subscription_data: {
      metadata: {
        userId,
        plan,
      },
    },
  })

  return session.url!
}

/**
 * Create a Stripe Customer Portal session
 * Returns the portal URL
 */
export async function createPortalSession(customerId: string): Promise<string> {
  const stripe = getStripe()
  if (!stripe) throw new Error('Stripe is not configured')

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}`,
  })

  return session.url
}

/**
 * Handle subscription update from webhook
 * Updates user plan and Stripe fields in DB
 */
export async function handleSubscriptionUpdate(
  customerId: string,
  priceId: string | null,
  currentPeriodEnd: Date | null,
): Promise<void> {
  // Find user by Stripe customer ID
  const user = await db.user.findUnique({
    where: { stripeCustomerId: customerId },
  })

  if (!user) {
    console.error(`[Stripe] No user found for customer: ${customerId}`)
    return
  }

  // Determine plan from price ID
  let plan: Plan = 'STARTER'
  if (priceId === PRICE_IDS.PRO) {
    plan = 'PRO'
  } else if (priceId === PRICE_IDS.ULTRA) {
    plan = 'ULTRA'
  }

  await db.user.update({
    where: { id: user.id },
    data: {
      plan,
      stripePriceId: priceId,
      stripeCurrentPeriodEnd: currentPeriodEnd,
    },
  })

  console.log(`[Stripe] Updated user ${user.id} to plan ${plan}`)
}

/**
 * Handle subscription deletion from webhook
 * Downgrades user to STARTER plan
 */
export async function handleSubscriptionDeleted(customerId: string): Promise<void> {
  const user = await db.user.findUnique({
    where: { stripeCustomerId: customerId },
  })

  if (!user) {
    console.error(`[Stripe] No user found for customer: ${customerId}`)
    return
  }

  await db.user.update({
    where: { id: user.id },
    data: {
      plan: 'STARTER',
      stripePriceId: null,
      stripeCurrentPeriodEnd: null,
    },
  })

  console.log(`[Stripe] Downgraded user ${user.id} to STARTER`)
}
