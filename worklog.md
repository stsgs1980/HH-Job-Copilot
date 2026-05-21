# Worklog — HH Job Copilot

## Task 1: Anti-monolith refactoring — Convert SPA router to Next.js route groups
**Date:** 2026-05-21
**Status:** ✅ Completed

### What was done
- Deleted old `src/app/page.tsx` (SPA router with `useState<View>` switching between landing/auth/dashboard)
- Created 3 route groups with proper Next.js file-system routing:
  - `(marketing)/layout.tsx` + `(marketing)/page.tsx` → Landing page at `/`
  - `(auth)/layout.tsx` + `(auth)/login/page.tsx` → Auth page at `/login`
  - `(app)/layout.tsx` + `(app)/dashboard/page.tsx` → Dashboard at `/dashboard`
- Removed `View` type from `src/types/index.ts`
- All navigation uses `next/link` and `next/navigation` (useRouter) instead of `onNavigate` prop
- Existing components kept unchanged — they still accept `onNavigate: () => void` callbacks, which are now wired to `router.push()`
- Layouts split responsibilities: marketing has nav+footer, auth has centered card+glows, app has top bar+input bar shell
- Dashboard mode state (activeMode, inputValue) managed in `(app)/layout.tsx`; showPanel managed in `(app)/dashboard/page.tsx`
- Verified: lint passes, all 3 routes return 200

## Task 4: Create AI API routes (chat, humanizer, HR reply, cover letter, interview hint)
**Date:** 2026-05-21
**Status:** ✅ Completed

### What was done
- Created 5 API route files under `src/app/api/ai/`:
  1. **`chat/route.ts`** — POST endpoint for general AI chat
     - Accepts `{ messages, source?, userId? }`
     - Calls `chatCompletion` from `@/lib/ai`
     - Saves user message and AI response to `AIMessage` table
     - Returns `{ response }` with the AI text
  2. **`humanize/route.ts`** — POST endpoint to humanize AI text
     - Accepts `{ text }`
     - Calls `humanize` from `@/lib/ai`
     - Returns `{ original, humanized }`
  3. **`hr-reply/route.ts`** — POST endpoint for HR reply generation
     - Accepts `{ chatId, employerMessage, vacancyTitle?, company?, autoSend?, userId? }`
     - Calls `generateHRReply` from `@/lib/ai`
     - If `autoSend` is true, sends via Chatik API (`sendMessage` from `@/lib/hh-api`)
     - Saves message to `Message` table with `aiRawContent` and `aiHumanized` fields
     - Returns `{ raw, humanized, sent }`
  4. **`cover-letter/route.ts`** — POST endpoint for cover letter generation
     - Accepts `{ vacancyTitle, company?, vacancyDescription?, resumeText? }`
     - Uses `chatCompletion` with specialized cover-letter system prompt
     - Returns `{ coverLetter }`
  5. **`interview-hint/route.ts`** — POST endpoint for real-time interview hints
     - Accepts `{ interviewId?, question, resumeContext?, previousQA?, userId? }`
     - Uses `chatCompletion` with interview-assistant system prompt
     - Saves hint to `AIMessage` table with source='interview'
     - Returns `{ hint }`
- All routes use proper error handling with try/catch
- Mock userId (`'mock-user-001'`) used as placeholder until real auth
- Build verification: `next build` passes successfully, all 5 routes compiled as dynamic (ƒ)
- Lint verification: `bun run lint` passes with no errors

## Task 3: Create HH.ru Chatik API proxy routes
**Date:** 2026-05-21
**Status:** ✅ Completed

### What was done
- Created 5 API route files under `src/app/api/hh/`:
  1. **`chats/route.ts`** — GET endpoint to fetch list of chats
     - Reads `userId` from query param (mock auth)
     - Looks up stored `hhCookies` from `User` table in DB
     - Validates required cookie fields (hhtoken, hhuid, crypted_hhuid, _xsrf)
     - Calls `getChats` from `@/lib/hh-api`
     - Returns `{ chats }` JSON array
  2. **`chats/[chatId]/route.ts`** — GET + POST for a specific chat
     - GET: Fetch messages via `getChatData`, supports `limit` and `offset` pagination
     - POST: Dual action — if `action=mark_read`, calls `markRead`; otherwise calls `sendMessage` with required `text` field
     - Shared helper `getCookiesForUser` to DRY cookie lookup + validation
  3. **`oauth/route.ts`** — GET redirect to HH.ru OAuth authorization
     - Reads `HH_CLIENT_ID` and `HH_REDIRECT_URL` from env
     - Generates random `state` param for CSRF protection
     - Redirects to `https://hh.ru/oauth/authorize?response_type=code&...`
  4. **`oauth/callback/route.ts`** — GET handle OAuth callback
     - Exchanges `code` for access token via `POST https://hh.ru/oauth/token`
     - Uses `HH_CLIENT_ID`, `HH_CLIENT_SECRET`, `HH_REDIRECT_URL` from env
     - Stores `hhToken`, `hhRefreshToken`, `hhTokenExpiresAt` in DB (if `userId` param provided)
     - Redirects to `/dashboard` on success
  5. **`cookie-login/route.ts`** — POST accept raw Chatik cookies
     - Validates all 4 required cookie fields
     - Validates cookies by making a test `/chats` request
     - Upserts user in DB (creates if not exists for MVP convenience)
     - Stores cookies as JSON in `user.hhCookies` field
     - Returns `{ success, userId, message }`
- Added env vars to `.env`: `HH_CLIENT_ID`, `HH_CLIENT_SECRET`, `HH_REDIRECT_URL`
- All routes use `NextRequest`/`NextResponse` from `next/server`
- Proper error handling with try/catch and meaningful error messages
- All routes import helpers from `@/lib/hh-api` and `@/lib/db`
- Lint verification: `bun run lint` passes with no errors

## Task 2: Stripe payments integration (test mode) + Rate limiting
**Date:** 2026-05-21
**Status:** ✅ Completed

### What was done
- Installed `stripe` npm package
- Created `src/lib/stripe.ts` — Server utilities: getStripe(), getOrCreateCustomer(), createCheckoutSession(), createPortalSession(), handleSubscriptionUpdate(), handleSubscriptionDeleted(), getPlanLimits(), getPlanInfo(), PLANS definitions (STARTER/PRO/ULTRA)
- Created `src/lib/rate-limit.ts` — In-memory rate limiting by plan: checkRateLimit(), getUserUsage(), resetRateLimit(), resetAllRateLimits(). Works independently of Stripe (reads plan from DB)
- Created 4 API routes:
  - `POST /api/stripe/checkout` — Create Stripe Checkout Session (403 when disabled)
  - `POST /api/stripe/webhook` — Handle Stripe webhooks with signature verification (200 when disabled)
  - `POST /api/stripe/portal` — Create Stripe Customer Portal session (403 when disabled)
  - `GET /api/stripe/plans` — Return plans + current subscription (works when disabled)
- Created `src/hooks/use-stripe.ts` — Client hook: subscribe(), openPortal(), plans, currentPlan, isLoading, isEnabled, refreshPlans. Shows "Coming Soon" toast when Stripe disabled
- All Stripe operations guarded by `isFeatureEnabled('stripe')`
- Lint verification: all new files pass with no errors
