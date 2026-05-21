// ============================================================
// useStripe — Client-side Stripe hook
// When FEATURE_STRIPE=false: subscribe returns "coming soon" toast
// ============================================================

'use client'

import { useState, useCallback, useEffect } from 'react'
import { isFeatureEnabled } from '@/lib/feature-flags'
import { toast } from 'sonner'

/** Plan type */
type Plan = 'STARTER' | 'PRO' | 'ULTRA'

/** Plan info from API */
interface PlanInfo {
  id: Plan
  name: string
  price: number
  priceLabel: string
  features: string[]
  limits: {
    applicationsPerDay: number
    chatMessagesPerDay: number
    aiChatPerDay: number
    asrMinutesPerDay: number
    ttsMinutesPerDay: number
  }
  popular: boolean
}

/** Subscription info from API */
interface SubscriptionInfo {
  plan: Plan
  stripeCustomerId: string | null
  currentPeriodEnd: string | null
  priceId: string | null
}

/** Plans API response */
interface PlansResponse {
  plans: PlanInfo[]
  currentPlan: Plan
  subscription: SubscriptionInfo | null
}

/** useStripe hook return type */
interface UseStripeReturn {
  /** Subscribe to a plan — opens Stripe Checkout or shows "coming soon" */
  subscribe: (plan: 'PRO' | 'ULTRA') => Promise<void>
  /** Open Stripe Customer Portal for managing subscription */
  openPortal: () => Promise<void>
  /** Available plans */
  plans: PlanInfo[]
  /** Current plan */
  currentPlan: Plan | null
  /** Current subscription info */
  subscription: SubscriptionInfo | null
  /** Loading state */
  isLoading: boolean
  /** Whether Stripe feature is enabled */
  isEnabled: boolean
  /** Refresh plans data */
  refreshPlans: () => Promise<void>
}

export function useStripe(userId?: string): UseStripeReturn {
  const [plans, setPlans] = useState<PlanInfo[]>([])
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null)
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const isEnabled = isFeatureEnabled('stripe')

  /** Fetch plans from API */
  const refreshPlans = useCallback(async () => {
    try {
      const params = userId ? `?userId=${userId}` : ''
      const res = await fetch(`/api/stripe/plans${params}`)
      if (!res.ok) throw new Error('Failed to fetch plans')

      const data: PlansResponse = await res.json()
      setPlans(data.plans)
      setCurrentPlan(data.currentPlan)
      setSubscription(data.subscription)
    } catch (error) {
      console.error('[useStripe] Failed to fetch plans:', error)
    }
  }, [userId])

  // Fetch plans on mount
  useEffect(() => {
    refreshPlans()
  }, [refreshPlans])

  /** Subscribe to a plan */
  const subscribe = useCallback(
    async (plan: 'PRO' | 'ULTRA') => {
      if (!isEnabled) {
        toast.info('Coming Soon', {
          description: 'Payment integration is coming soon. Stay tuned!',
        })
        return
      }

      setIsLoading(true)
      try {
        const res = await fetch('/api/stripe/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan, userId }),
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Failed to create checkout session')
        }

        const data = await res.json()

        if (data.url) {
          // Redirect to Stripe Checkout
          window.location.href = data.url
        }
      } catch (error) {
        toast.error('Subscription Error', {
          description: error instanceof Error ? error.message : 'Failed to start checkout',
        })
      } finally {
        setIsLoading(false)
      }
    },
    [isEnabled, userId],
  )

  /** Open Stripe Customer Portal */
  const openPortal = useCallback(async () => {
    if (!isEnabled) {
      toast.info('Coming Soon', {
        description: 'Payment integration is coming soon. Stay tuned!',
      })
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create portal session')
      }

      const data = await res.json()

      if (data.url) {
        // Redirect to Stripe Portal
        window.location.href = data.url
      }
    } catch (error) {
      toast.error('Portal Error', {
        description: error instanceof Error ? error.message : 'Failed to open billing portal',
      })
    } finally {
      setIsLoading(false)
    }
  }, [isEnabled, userId])

  return {
    subscribe,
    openPortal,
    plans,
    currentPlan,
    subscription,
    isLoading,
    isEnabled,
    refreshPlans,
  }
}
