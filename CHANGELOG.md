# Changelog

All notable changes to HH Job Copilot will be documented in this file.

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
