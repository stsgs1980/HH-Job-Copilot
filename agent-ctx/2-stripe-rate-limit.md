## Task 2: Stripe payments integration (test mode) + Rate limiting
**Date:** 2026-05-21
**Status:** ✅ Completed

### What was done

1. **Installed `stripe` package** — npm install stripe

2. **Created `src/lib/stripe.ts`** — Stripe server utilities
   - `getStripe()` — Initializes Stripe client only when `isFeatureEnabled('stripe')` AND `STRIPE_SECRET_KEY` configured; returns null otherwise
   - `getOrCreateCustomer(userId, email)` — Creates or retrieves Stripe customer ID, saves to DB
   - `createCheckoutSession(userId, plan)` — Creates Stripe Checkout Session for PRO/ULTRA upgrade with success/cancel URLs
   - `createPortalSession(customerId)` — Creates Stripe Customer Portal session for subscription management
   - `handleSubscriptionUpdate(customerId, priceId, currentPeriodEnd)` — Updates user plan in DB based on price ID mapping
   - `handleSubscriptionDeleted(customerId)` — Downgrades user to STARTER on subscription cancellation
   - `getPlanLimits(plan)` / `getPlanInfo(plan)` — Returns plan limits and metadata
   - `PLANS` array — Full plan definitions with features, limits, pricing (STARTER free, PRO $19/mo, ULTRA $49/mo)
   - Types exported: `Plan`, `PlanLimits`, `PlanInfo`

3. **Created `src/lib/rate-limit.ts`** — Rate limiting by plan
   - In-memory `Map` store (key = `${userId}:${action}`, value = count + resetAt)
   - `PLAN_LIMITS` via `getPlanLimits()` from stripe.ts (STARTER: 5 apps/10 chats/20 AI/0 ASR/0 TTS; PRO: unlimited/30 ASR; ULTRA: unlimited ASR/60 TTS; -1 = unlimited)
   - `checkRateLimit(userId, action, increment?)` — Checks and optionally increments counter, returns `{ allowed, remaining, limit, resetAt }`
   - `getUserUsage(userId)` — Returns usage stats for all action types
   - `resetRateLimit(userId, action)` / `resetAllRateLimits(userId)` — Admin utilities
   - Periodic cleanup of expired entries (every 10 min)
   - Daily reset window (midnight UTC)
   - Works independently of Stripe (reads plan from DB)

4. **Created `src/app/api/stripe/checkout/route.ts`** — POST
   - Validates plan is PRO or ULTRA
   - Checks user isn't already on equal/higher plan
   - Creates Stripe Checkout session and returns `{ url }`
   - Returns 403 when `FEATURE_STRIPE=false`

5. **Created `src/app/api/stripe/webhook/route.ts`** — POST
   - Verifies Stripe webhook signature with `STRIPE_WEBHOOK_SECRET`
   - Handles `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Updates user plan and Stripe fields in DB
   - Returns 200 (ignored) when `FEATURE_STRIPE=false`

6. **Created `src/app/api/stripe/portal/route.ts`** — POST
   - Creates Stripe Customer Portal session and returns `{ url }`
   - Validates user has a Stripe customer ID before creating portal
   - Returns 403 when `FEATURE_STRIPE=false`

7. **Created `src/app/api/stripe/plans/route.ts`** — GET
   - Returns `{ plans, currentPlan, subscription }` from DB
   - Works even when Stripe is disabled (reads plan info from DB only)
   - Supports `?userId=` query param

8. **Created `src/hooks/use-stripe.ts`** — Client-side React hook
   - `useStripe(userId?)` returns `{ subscribe, openPortal, plans, currentPlan, subscription, isLoading, isEnabled, refreshPlans }`
   - `subscribe(plan)` — Opens Stripe Checkout or shows "Coming Soon" toast when `FEATURE_STRIPE=false`
   - `openPortal()` — Opens Stripe billing portal or shows "Coming Soon" toast
   - Auto-fetches plans on mount via `/api/stripe/plans`
   - Uses `sonner` toast for notifications

### Key design decisions
- All Stripe operations check `isFeatureEnabled('stripe')` before proceeding — no crashes when disabled
- When feature is off: API routes return 403 (checkout/portal), 200 (webhook), or work normally (plans)
- Rate limiter works independently of Stripe — reads plan from DB `User.plan` field
- In-memory store for MVP; designed for easy Redis migration
- Mock userId (`'mock-user-001'`) used as placeholder until NextAuth is enabled
- Stripe API version pinned to `2023-10-16`
