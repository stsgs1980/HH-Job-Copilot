# HH Job Copilot — TODO

> Статус: v0.4.0 — Real Data Flow + SEO + Error Boundaries + Skeletons
> Стек: Next.js 16 + TypeScript + Tailwind CSS 4 + shadcn/ui + Prisma + z-ai-sdk
> Монетизация: Starter $0 / Pro $19/mo / Ultra $49/mo

---

## Phase 1: Фундамент ✅

- [x] **Anti-monolith рефакторинг** — page.tsx → модульная структура
  - [x] Route groups: `(marketing)/`, `(auth)/`, `(app)/`
  - [x] Компоненты: `components/landing/`, `components/auth/`, `components/dashboard/`, `components/shared/`
  - [x] Библиотеки: `lib/hh-api.ts`, `lib/ai.ts`, `lib/db.ts`
  - [x] Типы: `types/index.ts`
  - [x] Хуки: `hooks/use-hh-chat.ts`, `hooks/use-interview.ts`, `hooks/use-analytics.ts`

- [x] **Prisma схема + миграция**
  - [x] 7 моделей + 6 enum

## Phase 2: Интеграция HH.ru ✅

- [x] **HH.ru API proxy routes** (6 endpoints)
  - [ ] Playwright для автоматического логина → cookies
  - [ ] Polling каждые 5с / WebSocket для новых сообщений
  - [ ] Real auth (NextAuth session) вместо mock userId

## Phase 3: AI фичи ✅

- [x] **AI API routes** (6 endpoints: chat, humanize, hr-reply, cover-letter, interview-hint, stream)
- [x] **AI фронтенд интеграция** — use-ai-chat hook с streaming + feature flags
  - [ ] Auto-Humanizer toggle в настройках чата
  - [ ] Prompt-engineering skill для оптимизации промптов
- [x] **ASR** — transcribe/stream endpoints + use-asr hook (за фича-флагом)
- [x] **TTS** — synthesize endpoint + use-tts hook (за фича-флагом)

## Phase 4: SaaS ✅

- [x] **NextAuth.js** — код написан, за фича-флагом (NEXT_PUBLIC_FEATURE_NEXTAUTH)
  - [ ] Email + пароль (когда активируем)
  - [ ] HH.ru OAuth provider
  - [ ] Google OAuth provider
- [x] **Stripe** — код написан, за фича-флагом (NEXT_PUBLIC_FEATURE_STRIPE)
  - [x] Checkout Session для Pro / Ultra
  - [x] Webhook для подтверждения оплаты
  - [x] Customer Portal для управления подпиской
  - [x] Rate limiting по тарифу
- [x] **Onboarding wizard** (4 шага: резюме, предпочтения, HH.ru, AI-опрос)

## Phase 5: Дизайн полировка ✅

- [x] Glassmorphism карточки с backdrop-blur (`.glass-card`) — light + dark mode
- [x] Микро-анимации (fade-in-up, hover glow, stagger, zap-pulse)
- [x] Gradient mesh фон (light + dark адаптация)
- [x] Streak counter с анимацией
- [x] Gradient border + shimmer + page transitions
- [x] SVG логотип: молния + щит (Zap + Shield) с gradient
- [x] Skeleton loading для всех dashboard секций (6 компонентов)
- [x] Theme fix: glass-card, ambient-glow, hover-glow — корректная light/dark специфика

## Phase 6: Продакшен ✅ (частично)

- [x] SEO: мета-теги, Open Graph, Twitter Card, sitemap.xml, robots.ts
- [x] Error boundaries на каждый маршрут + глобальный 404
- [x] Loading states (dashboard loading.tsx + skeleton компоненты)
- [x] `.env.example` — документированный файл окружения
- [ ] Lighthouse: Performance >90, Accessibility >95
- [ ] E2E тесты (Playwright)
- [ ] CI/CD: GitHub Actions → Vercel
- [ ] Домен: hhjobcopilot.ru / hhcopilot.com

## Phase 7: Real Data Flow ✅

- [x] **Analytics API** — `GET /api/analytics` с Prisma queries (отклики, конверсия, чаты, weekly chart)
- [x] **use-analytics** — подключён к реальному API вместо mock
- [x] **use-ai-chat** — streaming + regular fetch + mock fallback (3 режима через feature flags)
- [x] **use-hh-chat** — React Query с real API + mock fallback + polling 5с
- [x] **use-interview** — real API hints + mock fallback

---

## Выполнено

- [x] Landing page (Hero, Features, How it works, Pricing, CTA, Footer)
- [x] Auth page (Sign in / Sign up, HH.ru OAuth, email/password)
- [x] Dashboard Conversational OS (AI чат, дайджест, вакансии, интервью LIVE, аналитика, float panel)
- [x] Тёмная/светлая тема (next-themes) — исправлена light/dark специфика CSS
- [x] SVG иконки (Lucide, zero unicode emoji)
- [x] ThemeToggle компонент (hydration-safe, useSyncExternalStore)
- [x] Адаптивный дизайн (mobile-first)
- [x] Custom color system (oklch, cyan/purple gradient, light+dark адаптация)
- [x] Anti-monolith refactoring → Next.js route groups
- [x] Prisma схема (7 моделей, 6 enum)
- [x] HH.ru Chatik API proxy (6 endpoints)
- [x] AI API routes (6 endpoints: chat, humanize, hr-reply, cover-letter, interview-hint, stream)
- [x] Design polish: glassmorphism, gradient mesh, hover-glow, fade-in-up, streak-glow, gradient-border, shimmer, page-transition
- [x] Feature Flags (7 флагов, все фичи построены но отключены по умолчанию)
- [x] Stripe + Rate limiting (код за фича-флагом)
- [x] NextAuth + mock-auth (код за фича-флагом)
- [x] ASR + TTS (код за фича-флагом)
- [x] Onboarding wizard (4 шага)
- [x] Skeleton loading (6 компонентов)
- [x] SEO (Open Graph, Twitter Card, sitemap.xml, robots.ts)
- [x] Error boundaries + 404 + loading states
- [x] Analytics API (Prisma queries)
