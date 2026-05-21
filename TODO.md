# HH Job Copilot — TODO

> Статус: v0.2.0 — Route groups + Prisma + API routes + Design polish
> Стек: Next.js 16 + TypeScript + Tailwind CSS 4 + shadcn/ui + Prisma + z-ai-sdk
> Монетизация: Starter $0 / Pro $19/mo / Ultra $49/mo

---

## Phase 1: Фундамент (КРИТИЧНО)

- [x] **Anti-monolith рефакторинг** — page.tsx → модульная структура
  - [x] Route groups: `(marketing)/`, `(auth)/`, `(app)/`
  - [x] Компоненты: `components/landing/`, `components/auth/`, `components/dashboard/`, `components/shared/`
  - [x] Библиотеки: `lib/hh-api.ts`, `lib/ai.ts`, `lib/db.ts`
  - [x] Типы: `types/index.ts`
  - [ ] Хуки: `hooks/use-hh-chat.ts`, `hooks/use-interview.ts`, `hooks/use-analytics.ts`

- [x] **Prisma схема + миграция**
  - [x] User (id, email, name, hhToken, plan, streakDays, Stripe fields)
  - [x] Chat (id, userId, hhChatId, employerName, unreadCount, aiRepliesOn, humanizeMode)
  - [x] Message (id, chatId, role, content, sentVia, aiRawContent, aiHumanized)
  - [x] Application (id, userId, vacancyId, company, matchScore, status, coverLetter)
  - [x] Interview (id, userId, company, position, transcript, aiHints, duration)
  - [x] AIMessage (id, userId, role, content, source, tokens, model)
  - [x] Enums: Plan, MessageRole, SentVia, AppStatus, InterviewStatus

## Phase 2: Интеграция HH.ru

- [x] **HH.ru API proxy routes**
  - [x] `GET /api/hh/oauth` — redirect to HH.ru OAuth
  - [x] `GET /api/hh/oauth/callback` — обработка callback, сохранение токена
  - [x] `POST /api/hh/cookie-login` — manual Chatik cookies login
  - [x] `GET /api/hh/chats` — список чатов (proxy to Chatik API)
  - [x] `GET /api/hh/chats/[chatId]` — сообщения чата
  - [x] `POST /api/hh/chats/[chatId]` — отправить сообщение / mark read
  - [ ] Playwright для автоматического логина → cookies (hhtoken, hhuid, _xsrf)
  - [ ] Polling каждые 5с / WebSocket для новых сообщений
  - [ ] Real auth (NextAuth session) вместо mock userId

## Phase 3: AI фичи

- [x] **AI API routes**
  - [x] `POST /api/ai/chat` — LLM чат-ассистент (z-ai-sdk)
  - [x] `POST /api/ai/humanize` — Humanizer для Chatik ответов
  - [x] `POST /api/ai/hr-reply` — Генерация + humanize + автосенд HR ответов
  - [x] `POST /api/ai/cover-letter` — AI сопроводительные письма
  - [x] `POST /api/ai/interview-hint` — Подсказки на интервью в реальном времени

- [ ] **AI фронтенд интеграция**
  - [ ] Подключить чат-инпут к `/api/ai/chat`
  - [ ] Streaming ответы (SSE) для реального времени
  - [ ] Auto-Humanizer toggle в настройках чата
  - [ ] Prompt-engineering skill для оптимизации промптов

- [ ] **ASR — интервью-ассистент**
  - [ ] Whisper/z-ai для транскрипции речи в реальном времени
  - [ ] Потоковая транскрипция → LLM генерирует подсказки
  - [ ] Контекст: резюме + JD вакансии + предыдущие ответы

- [ ] **TTS — голосовой вывод** (Ultra тариф)
  - [ ] z-ai TTS для озвучивания AI-подсказок
  - [ ] Только в тарифе Ultra

## Phase 4: SaaS

- [ ] **NextAuth.js** — авторизация
  - [ ] Email + пароль
  - [ ] HH.ru OAuth provider
  - [ ] Google OAuth provider
  - [ ] Session management

- [ ] **Stripe** — платежи
  - [ ] Checkout Session для Pro / Ultra
  - [ ] Webhook для подтверждения оплаты
  - [ ] Customer Portal для управления подпиской
  - [ ] Rate limiting по тарифу (Starter: 5 откликов/день)

- [ ] **Onboarding wizard**
  - [ ] Шаг 1: Загрузка резюме / ввод данных
  - [ ] Шаг 2: Выбор предпочтений (зарплата, локация, формат)
  - [ ] Шаг 3: Подключение HH.ru аккаунта
  - [ ] Шаг 4: Первый AI-опрос (обучение стилю)

## Phase 5: Дизайн полировка

- [x] Glassmorphism карточки с backdrop-blur (`.glass-card`)
- [x] Микро-анимации (fade-in-up при скролле, hover glow, stagger)
- [x] Gradient mesh фон (tryusercue.com стиль)
- [x] Streak counter с анимацией (thita.ai стиль)
- [x] Gradient border на популярных карточках
- [x] Shimmer loading states (`.shimmer`)
- [x] Smooth page transitions (`.page-transition`)
- [x] Zap pulse на логотипе
- [ ] Skeleton loading для API данных
- [ ] SVG логотип: молния + щит (Zap + Shield) — заменить текстовый

## Phase 6: Продакшен

- [ ] Lighthouse: Performance >90, Accessibility >95
- [ ] SEO: мета-теги, Open Graph, sitemap.xml, robots.txt
- [ ] Error boundaries на каждый маршрут
- [ ] Loading states (Suspense + skeletons)
- [ ] E2E тесты (Playwright)
- [ ] CI/CD: GitHub Actions → Vercel
- [ ] Домен: hhjobcopilot.ru / hhcopilot.com
- [ ] `.env.example` — документированный файл окружения

---

## Выполнено

- [x] Landing page (Hero, Features, How it works, Pricing, CTA, Footer)
- [x] Auth page (Sign in / Sign up, HH.ru OAuth, email/password)
- [x] Dashboard Conversational OS (AI чат, дайджест, вакансии, интервью LIVE, аналитика, float panel)
- [x] Тёмная/светлая тема (next-themes)
- [x] SVG иконки (Lucide, zero unicode emoji)
- [x] ThemeToggle компонент (hydration-safe, useSyncExternalStore)
- [x] Адаптивный дизайн (mobile-first)
- [x] Custom color system (oklch, cyan/purple gradient)
- [x] Anti-monolith refactoring → Next.js route groups
- [x] Prisma схема (7 моделей, 6 enum)
- [x] HH.ru Chatik API proxy (6 endpoints)
- [x] AI API routes (5 endpoints: chat, humanize, hr-reply, cover-letter, interview-hint)
- [x] Design polish: glassmorphism, gradient mesh, hover-glow, fade-in-up, streak-glow, gradient-border, shimmer, page-transition
