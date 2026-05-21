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

## Task 4e: Add SEO meta tags, Open Graph, and sitemap.xml
**Date:** 2026-05-21
**Status:** ✅ Completed

### What was done
1. **Updated `src/app/layout.tsx`** — Enhanced the existing metadata object:
   - Added `metadataBase: new URL("https://hhcopilot.com")` for resolving relative OG image URLs
   - Added `creator` and `publisher` fields
   - Added `robots` meta with `index: true`, `follow: true`, and `googleBot` overrides (max-video-preview, max-image-preview, max-snippet)
   - Added `alternates` with canonical URL and `ru-RU` language
   - Added full **Open Graph** block: `type`, `locale` (ru_RU), `url`, `title`, `description`, `siteName`, `images` (1200×630 OG image)
   - Added full **Twitter Card** block: `summary_large_image` card, title, description, image, creator handle
   - Extended `keywords` array with English terms (job search, AI assistant, resume, auto apply)
   - Extracted `SITE_URL` constant to avoid repetition

2. **Created `src/app/sitemap.ts`** — Next.js dynamic sitemap generation:
   - Returns 4 entries: `/` (landing, priority 1.0, weekly), `/login` (priority 0.5, monthly), `/dashboard` (priority 0.8, daily), `/onboarding` (priority 0.6, monthly)
   - Uses `https://hhcopilot.com` as base URL
   - Sets `lastModified` to `new Date()` for freshness

3. **Created `src/app/robots.ts`** — Next.js dynamic robots.txt generation:
   - Allows all user agents on `/`
   - Disallows `/api/` and `/dashboard/` (authenticated pages)
   - Points sitemap to `https://hhcopilot.com/sitemap.xml`

4. **Deleted `public/robots.txt`** — Removed the static file to avoid conflicts with the dynamic `robots.ts` route handler

### Build verification
- `next build` passes successfully
- `/robots.txt` and `/sitemap.xml` appear in the build output as static (○) prerendered pages

## Task 4b: Create real Analytics API endpoint
**Date:** 2026-05-21
**Status:** ✅ Completed

### What was done
1. **Created `src/app/api/analytics/route.ts`** — GET endpoint that queries Prisma for real user data:
   - Accepts `GET /api/analytics?userId=xxx` (defaults to `mock-user-001`)
   - Queries `Application` table for: total count, count by status (INVITED, PENDING, REJECTED, VIEWED), conversion rate (INVITED/total×100), average match score
   - Queries `Chat` table for: total chats count, unread messages count
   - Builds 7-day week chart showing applications created per day for the last 7 days
   - Aligns `weekDays` labels to actual days of the week (Russian: Пн–Вс)
   - Returns structured JSON matching `AnalyticsData` interface: `{ stats, weekChart, weekDays }`
   - Stats use color classes: `text-cyan`, `text-emerald-400`, `text-purple`, `text-orange-400`
   - Graceful error handling: returns zero-defaults on error instead of throwing
   - Marked `dynamic = 'force-dynamic'` to prevent caching

2. **Updated `src/hooks/use-analytics.ts`** — Replaced mock AI chat fetch with real API call:
   - `fetchAnalyticsAPI()` now calls `GET /api/analytics?userId=mock-user-001`
   - Falls back to `MOCK_ANALYTICS` on error via `useQuery` placeholder + null-coalescing
   - Same return interface preserved (`stats`, `weekChart`, `weekDays`, `isLoading`)

### Build verification
- `next build` passes successfully
- `/api/analytics` appears in build output as dynamic (ƒ)

## Task 4c: Create skeleton loading components for dashboard
**Date:** 2026-05-21
**Status:** ✅ Completed

### What was done
1. **Created `src/components/dashboard/skeletons.tsx`** with 6 reusable skeleton components:
   - **`SkeletonAIDigest`** — Matches AIDigest layout: icon + glass-card with intro text line, 4-col stat grid, messages section (3 items) with action buttons, timestamp+badge row
   - **`SkeletonVacancyResponse`** — Matches VacancyResponse layout: icon + glass-card with response text, quote block with border-left, badges row, vacancy list (3 items) with action buttons, double badge meta row
   - **`SkeletonInterviewLive`** — Matches InterviewLive layout: icon + glass-card with intro text, interview panel with gradient border, LIVE header, interviewer question, AI hint box, user speech line, controls row
   - **`SkeletonAnalyticsInline`** — Matches AnalyticsInline layout: icon + glass-card with intro text, bar chart section (7 bars + day labels), 4-col stat grid, timestamp+badge row
   - **`SkeletonChatPanel`** — Matches ChatPanel sidebar: header with icon+close, 4 chat list items (avatar, name, preview), profile card at bottom
   - **`SkeletonChatMessage`** — Matches a single chat message bubble; supports `role` prop ('user' for right-aligned gray bubble, 'assistant' for left-aligned glass-card bubble with meta row)

2. **Used the existing `Skeleton` component** from `@/components/ui/skeleton` (shadcn/ui) as the building block

3. **Style requirements met**:
   - All skeleton cards use `.glass-card` class matching the glassmorphism style
   - `.shimmer` class added for the custom shimmer loading animation
   - Dimensions and spacing match real components (verified by reading actual component source)
   - Internal helper components (`SkeletonIcon`, `SkeletonTitle`, `SkeletonGlassCard`, `SkeletonBadge`, `SkeletonMetaRow`) for DRY code

4. **Updated `src/components/dashboard/index.ts`** — Added re-exports for all 6 skeleton components

5. **Updated `src/app/(app)/dashboard/page.tsx`** — Integrated skeleton loading states:
   - Shows skeleton dashboard cards when `chat.messages.length === 0 && hhChat.isLoading`
   - Shows real dashboard cards when `chat.messages.length === 0 && !hhChat.isLoading`
   - Shows `SkeletonChatPanel` when panel is visible and `hhChat.isLoading`
   - Shows real `ChatPanel` when panel is visible and not loading

### Build verification
- `next build` passes successfully (all routes compile, no errors)
- `bun run lint` passes with no errors

## Task 4f: Add error boundaries for each route group
**Date:** 2026-05-21
**Status:** ✅ Completed

### What was done
1. **Created `src/app/(marketing)/error.tsx`** — Landing page error boundary:
   - `'use client'` component (Next.js requirement for error.tsx)
   - "Что-то пошло не так" heading with `gradient-text`
   - "Попробуйте обновить страницу" description
   - Displays error message in muted text if available
   - Retry button calling `reset()` with RefreshCw icon
   - Link back to home with Home icon
   - Glass-card container with page-transition animation

2. **Created `src/app/(auth)/error.tsx`** — Auth page error boundary:
   - `'use client'` component
   - "Ошибка авторизации" heading with `gradient-text`
   - Description about auth issues and internet connection check
   - Error detail displayed in red-tinted card (bg-red-500/10, border-red-500/20)
   - "Войти снова" button linking to /login with RefreshCw icon
   - Link to home page with Home icon
   - Same glass-card styling

3. **Created `src/app/(app)/error.tsx`** — Dashboard/app error boundary:
   - `'use client'` component
   - "Ошибка в приложении" heading with `gradient-text`
   - Error detail in red-tinted card when available
   - Retry button calling `reset()` with RefreshCw icon
   - Link to dashboard with LayoutDashboard icon
   - Link to home page with Home icon
   - Same glass-card styling, responsive flex-col→flex-row layout

4. **Created `src/app/not-found.tsx`** — Global 404 page:
   - Large "404" number with `gradient-text` (text-8xl/text-9xl)
   - SearchX icon in gradient-bg container
   - "Страница не найдена" heading with `gradient-text`
   - Helpful Russian description about missing/moved pages
   - Link back to home with gradient-bg button
   - Glass-card container on gradient-mesh background
   - Fully responsive design

5. **Created `src/app/(app)/dashboard/loading.tsx`** — Dashboard loading skeleton:
   - Zap icon with pulse animation in gradient-bg container
   - Title area skeleton (h-8 + h-4 lines)
   - AI Digest card skeleton with shimmer effect
   - Grid of two card skeletons (responsive 1→2 cols)
   - Additional content skeleton with multiple shimmer lines
   - Uses `.glass-card` and `.shimmer` utility classes from globals.css
   - Bottom spacer to match dashboard page layout

### Style consistency
- All error pages use `.glass-card` for card containers
- All headings use `.gradient-text` class
- All primary buttons use `.gradient-bg` with `text-white border-0 hover:opacity-90`
- All pages use Lucide React icons (AlertTriangle, RefreshCw, Home, ShieldAlert, LayoutDashboard, SearchX, Zap)
- Responsive layouts using `flex-col sm:flex-row` patterns
- `.page-transition` animation on all error cards
- Russian language throughout (matching the app's locale)

### Build verification
- `next build` passes successfully — no errors
- `bun run lint` passes with no errors
- Dev server running without issues
