# Changelog

All notable changes to HH Job Copilot will be documented in this file.

## [0.4.0] — 2026-05-22

### Added — Real Data Flow
- **Analytics API** (`GET /api/analytics`): Real Prisma queries for applications count, conversion rate, match score, weekly chart, chats stats. Returns structured JSON matching `AnalyticsData` interface
- **use-analytics hook**: Connected to real `/api/analytics` endpoint instead of mock AI chat approach. Falls back to mock data on error
- **Skeleton loading components** (6 components in `dashboard/skeletons.tsx`):
  - `SkeletonAIDigest` — matches AIDigest layout with shimmer
  - `SkeletonVacancyResponse` — matches VacancyResponse with vacancy list items
  - `SkeletonInterviewLive` — matches InterviewLive with gradient-border panel
  - `SkeletonAnalyticsInline` — matches AnalyticsInline with chart bars + stat grid
  - `SkeletonChatPanel` — matches ChatPanel sidebar with chat list items
  - `SkeletonChatMessage` — matches chat message bubble (user/assistant variants)
- **Dashboard loading states**: Skeletons shown during data loading, real cards when ready

### Added — SEO
- **Enhanced metadata** in root layout: Open Graph tags (og:type, og:locale, og:image), Twitter Card (summary_large_image), robots directives, canonical URL, extended keywords
- **Dynamic sitemap** (`src/app/sitemap.ts`): 4 entries with priorities and change frequencies
- **Dynamic robots.txt** (`src/app/robots.ts`): Allow all, disallow `/api/` and `/dashboard/`, sitemap reference
- Removed static `public/robots.txt` to avoid conflict with dynamic handler

### Added — Error Boundaries
- **Marketing error** (`(marketing)/error.tsx`): "Что-то пошло не так" with retry + home link
- **Auth error** (`(auth)/error.tsx`): "Ошибка авторизации" with login retry
- **App error** (`(app)/error.tsx`): "Ошибка в приложении" with retry + dashboard/home links
- **Global 404** (`not-found.tsx`): Large gradient "404" + "Страница не найдена" with home link
- **Dashboard loading** (`(app)/dashboard/loading.tsx`): Shimmer skeleton while dashboard loads

### Fixed — Theme System (Critical)
- **Glass-card dark mode bug**: `:root .glass-card` (specificity 0,1,1) was always winning over `.glass-card` (0,1,0), making glass cards permanently light even in dark mode. Fixed with `.dark .glass-card` explicit override
- **Gradient-mesh invisible in light mode**: `opacity: 0.15` on white background was invisible. Reduced to `0.08` in light, `0.15` in dark
- **Ambient-glow invisible in light mode**: Same issue. Light mode `0.08`, dark mode `0.15`
- **Hover-glow too subtle in light mode**: Added separate `.dark .hover-glow:hover` with stronger glow values
- **Gradient-text low contrast in light mode**: Light mode uses deeper blue-purple `oklch(0.65 0.2 240)`, dark uses bright cyan-purple `oklch(0.75 0.18 195)`
- **Streak-glow too strong in light mode**: Separate keyframes for light/dark
- **Color system**: `--color-cyan` and `--color-purple` now have light mode variants (deeper hues for contrast)
- **Light theme colors**: Enhanced `--primary` to deep blue `oklch(0.25 0.04 260)`, `--ring` to blue-violet, muted/accent with slight blue tint
- **Removed obsolete `tailwind.config.ts`**: Tailwind v4 uses `@theme inline` in CSS — the old v3 config with `hsl(var(--...))` was conflicting with `oklch()` values

### Stats
- **27 routes** (22 API + 5 pages) + middleware
- **6 skeleton components** for loading states
- **5 error boundary pages** (3 route groups + 404 + loading)
- **1 new API endpoint** (`/api/analytics`)

## [0.3.0] — 2026-05-21

### Added — Feature Flags System
- **7 feature flags** via `.env` environment variables:
  - `NEXT_PUBLIC_FEATURE_STRIPE` — Stripe payments (default: off)
  - `NEXT_PUBLIC_FEATURE_NEXTAUTH` — Real auth (default: off)
  - `NEXT_PUBLIC_FEATURE_AI_CHAT` — AI chat via z-ai-sdk (default: on)
  - `NEXT_PUBLIC_FEATURE_HH_CHATIK` — HH.ru Chatik API (default: off)
  - `NEXT_PUBLIC_FEATURE_ASR` — Speech recognition (default: off)
  - `NEXT_PUBLIC_FEATURE_TTS` — Voice output (default: off)
  - `NEXT_PUBLIC_FEATURE_AI_STREAMING` — SSE streaming (default: off)
- All features built and functional but disabled by default — can be activated individually

### Added — Auth
- **NextAuth integration** (`src/lib/auth.ts`): Credentials provider + HH.ru OAuth, behind feature flag
- **Mock auth** (`src/lib/mock-auth.ts`): Returns mock session when NextAuth disabled
- **Auth provider** (`src/components/auth/auth-provider.tsx`): Wraps app with session context
- **use-auth hook** (`src/hooks/use-auth.ts`): Access session, login/logout, plan info

### Added — Stripe Payments
- **Stripe server lib** (`src/lib/stripe.ts`): Checkout sessions, customer portal, webhooks, plan management
- **Rate limiting** (`src/lib/rate-limit.ts`): In-memory rate limiting by plan (Starter: 5/day, Pro: 50/day, Ultra: unlimited)
- **4 API routes**: checkout, portal, webhook, subscription/plans — all behind feature flag
- **use-stripe hook** (`src/hooks/use-stripe.ts`): Subscribe, manage portal, plan info

### Added — ASR/TTS
- **ASR endpoints**: transcribe (POST) and stream (POST) — Whisper-based speech recognition
- **TTS endpoint**: synthesize (POST) — voice output for AI hints
- **use-asr hook** (`src/hooks/use-asr.ts`): Recording controls, transcription, auto-send to chat
- **use-tts hook** (`src/hooks/use-tts.ts`): Voice synthesis, Ultra-plan gating

### Added — AI Streaming
- **Streaming endpoint** (`/api/ai/chat/stream`): SSE streaming for real-time AI responses
- **use-ai-chat hook** (`src/hooks/use-ai-chat.ts`): 3 modes — streaming, regular fetch, mock fallback

### Added — Onboarding Wizard
- **4-step onboarding** (`/onboarding`): Resume → Preferences → HH.ru connect → AI training
- Glass-card design with gradient progress indicator

### Added — Hooks & Dashboard
- **use-hh-chat**: React Query with real API + mock fallback + 5s polling
- **use-interview**: Real API hints + mock fallback
- **use-analytics**: Real API + mock fallback
- **use-feature-flag**: Client-side flag checking
- **Chat context** (`src/contexts/chat-context.tsx`): Unified AI chat + ASR state

## [0.2.0] — 2026-05-21

### Added — Architecture
- **Anti-monolith refactoring**: Replaced SPA router with Next.js route groups
- **Prisma database schema** (7 models, 6 enums)
- **HH.ru API proxy routes** (6 endpoints)
- **AI API routes** (5 endpoints)

### Added — Design Polish
- Glassmorphism, gradient mesh, hover-glow, fade-in-up, streak-glow, gradient-border, shimmer, page-transition, gradient-shimmer, zap-pulse

## [0.1.0] — 2026-05-21

### Added
- **Landing page**: Hero section with gradient text, 6 feature cards, 3-step "How it works", 3-tier pricing (Starter $0 / Pro $19 / Ultra $49), CTA section, footer
- **Auth page**: Sign in / Sign up tabs, HH.ru OAuth button, email/password login, password visibility toggle, terms checkbox
- **Dashboard**: Conversational OS pattern — AI chat with inline cards (digest, vacancies, interview LIVE, analytics), float panel with active chats, profile card with streak counter, input bar with mic/vacancy shortcuts
- **Theme system**: Dark/light mode via next-themes, ThemeProvider in layout, custom oklch color system (cyan/purple gradient), ambient glow animations
- **ThemeToggle component**: Hydration-safe using `useSyncExternalStore` (not useEffect+setState), supports variant/size/showLabel/className props
- **Custom CSS utilities**: `.gradient-bg`, `.gradient-text`, `.ambient-glow`, `.animate-pulse-dot`, `.animate-wave`
- **Responsive design**: Mobile-first, breakpoints sm/md/lg/xl
- **SVG icons only**: Lucide React icons, zero unicode emoji
- **Metadata**: HH Job Copilot SEO meta tags, Open Graph, ru locale

### Fixed
- Hydration mismatch: server rendered `<Moon>` icon, client rendered `<Sun>` — resolved with `useSyncExternalStore` mounted guard in ThemeToggle component
- ESLint error: `react-hooks/set-state-in-effect` on `setMounted(true)` inside `useEffect` — replaced with `useSyncExternalStore`

## [0.2.0] — 2026-05-21

### Added — Architecture
- **Anti-monolith refactoring**: Replaced SPA router (`page.tsx` with `useState<View>`) with Next.js route groups
  - `(marketing)/` — Landing page with dedicated layout (nav + footer)
  - `(auth)/login/` — Auth page with centered glassmorphic layout
  - `(app)/dashboard/` — Conversational OS with shared app shell (top bar + input bar)
  - Navigation via `next/link` and `next/navigation` (useRouter) instead of `onNavigate` callbacks
  - Removed `View` type from types/index.ts (no longer needed)

- **Prisma database schema** (7 models, 6 enums):
  - `User` — email, name, HH.ru tokens/cookies, subscription plan (Starter/Pro/Ultra), Stripe fields, streak
  - `Chat` — HH Chatik chat mapping, employer name, AI auto-reply toggle, humanize mode
  - `Message` — role (USER/EMPLOYER/AI), sentVia (MANUAL/AI/HUMANIZED_AI), raw vs humanized content
  - `Application` — vacancy tracking, match score, cover letter, status lifecycle (PENDING→INVITED→REJECTED)
  - `Interview` — ASR transcript, AI hints, summary feedback, interview status
  - `AIMessage` — LLM conversation history with source, token count, model tracking
  - Enums: `Plan`, `MessageRole`, `SentVia`, `AppStatus`, `InterviewStatus`

- **HH.ru API proxy routes** (6 endpoints):
  - `GET /api/hh/chats` — Fetch chat list from Chatik API
  - `GET /api/hh/chats/[chatId]` — Fetch messages for a chat
  - `POST /api/hh/chats/[chatId]` — Send message or mark read
  - `GET /api/hh/oauth` — Redirect to HH.ru OAuth authorization
  - `GET /api/hh/oauth/callback` — Handle OAuth callback, exchange code for token
  - `POST /api/hh/cookie-login` — Accept Chatik cookies (manual login), validate and store

- **AI API routes** (5 endpoints):
  - `POST /api/ai/chat` — General AI chat with DB persistence (AIMessage)
  - `POST /api/ai/humanize` — Humanize AI text for natural Chatik responses
  - `POST /api/ai/hr-reply` — Generate + humanize HR reply, optional auto-send via Chatik
  - `POST /api/ai/cover-letter` — Generate personalized cover letter for vacancy
  - `POST /api/ai/interview-hint` — Real-time interview hints based on transcript context

### Added — Design Polish
- **Glassmorphism**: `.glass-card` utility with backdrop-blur, subtle borders (dark + light mode)
- **Gradient mesh**: `.gradient-mesh` background with multi-point radial gradients (tryusercue.com style)
- **Hover glow**: `.hover-glow` — cyan/purple box-shadow + border-color transition on hover
- **Fade-in-up animations**: `.fade-in-up` with `.stagger-1` through `.stagger-5` delays
- **Streak glow**: `.streak-glow` — pulsing emerald box-shadow for streak counters (thita.ai style)
- **Gradient border**: `.gradient-border` — animated gradient outline via mask-composite
- **Shimmer loading**: `.shimmer` — sweep highlight animation for skeleton states
- **Page transitions**: `.page-transition` — subtle scale + opacity on route changes
- **Button shimmer**: `.gradient-shimmer` — light sweep over gradient buttons
- **Zap pulse**: `.zap-pulse` — logo icon bounce on hover
- Applied glassmorphism to all AI message bubbles (digest, vacancy response, interview live, analytics)
- Applied hover-glow to feature cards, pricing cards, dashboard stat items
- Gradient-border on popular pricing card + interview LIVE container
- Streak-glow on chat panel profile card

### Design inspiration
- nextjs.org: 3-column layout, Cmd+K, dark theme, Geist fonts, stat cards
- 21st.dev: 78 AI Chat components, Radix UI + Tailwind, dark mode, glowing AI chat
- thita.ai: Progress bars, streak counters, roadmap, AI Coach + Mock Interview
- polarity.so: Technical landing, clear benefits, 3-tier pricing
- tryusercue.com: Premium glassmorphic design, gradient mesh backgrounds
