# HH Job Copilot — TODO

> Статус: MVP прототип (Landing + Auth + Dashboard)  
> Стек: Next.js 16 + TypeScript + Tailwind CSS 4 + shadcn/ui + Prisma + z-ai-sdk  
> Монетизация: Starter $0 / Pro $19/mo / Ultra $49/mo

---

## Phase 1: Фундамент (КРИТИЧНО)

- [ ] **Anti-monolith рефакторинг** — page.tsx (700 строк) → модульная структура
  - [ ] Route groups: `(marketing)/`, `(auth)/`, `(app)/`
  - [ ] Компоненты: `components/landing/`, `components/auth/`, `components/dashboard/`, `components/shared/`
  - [ ] Хуки: `hooks/use-hh-chat.ts`, `hooks/use-interview.ts`, `hooks/use-analytics.ts`
  - [ ] Библиотеки: `lib/hh-api.ts`, `lib/ai.ts`, `lib/prisma.ts`
  - [ ] Типы: `types/index.ts`

- [ ] **Prisma схема + миграция**
  - [ ] User (id, email, name, hhToken, plan, streakDays)
  - [ ] Chat (id, userId, hhChatId, employerName, unreadCount, aiRepliesOn)
  - [ ] Message (id, chatId, role, content, sentVia)
  - [ ] Application (id, userId, vacancyId, company, matchScore, status, coverLetter)
  - [ ] Interview (id, userId, company, position, transcript, aiHints, duration)
  - [ ] Enums: Plan, Role, SentVia, AppStatus

## Phase 2: Интеграция HH.ru

- [ ] **HH.ru OAuth авторизация**
  - [ ] `/api/auth/hh` — redirect to HH.ru OAuth
  - [ ] `/api/auth/hh/callback` — обработка callback, сохранение токена
  - [ ] Playwright для первоначального логина → cookies (hhtoken, hhuid, _xsrf)

- [ ] **Chatik API — чат с HR**
  - [ ] GET `/chatik/api/chats` — список чатов
  - [ ] GET `/chatik/api/chat_data?id=X` — сообщения чата
  - [ ] POST `/chatik/api/send` — отправить сообщение
  - [ ] POST `/chatik/api/mark_read` — пометить прочитанным
  - [ ] Polling каждые 5с / WebSocket

## Phase 3: AI фичи

- [ ] **LLM чат-ассистент** (z-ai-sdk)
  - [ ] Системный промпт: карьерный ассистент для соискателя
  - [ ] Контекст: резюме + история чатов + вакансия
  - [ ] Prompt-engineering skill для оптимизации промптов

- [ ] **Humanizer** (АВТО для всех HH.ru чатов)
  - [ ] LLM с инструкцией "перепиши как живой человек"
  - [ ] Varied sentence length, occasional typos, natural flow
  - [ ] Автовключение для всех Chatik API ответов

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

- [ ] Glassmorphism карточки с backdrop-blur
- [ ] Микро-анимации (fade-in при скролле, hover glow)
- [ ] Gradient mesh фон (tryusercue.com стиль)
- [ ] Streak counter с анимацией (thita.ai стиль)
- [ ] Skeleton loading states
- [ ] Smooth page transitions
- [ ] SVG логотип: молния + щит (Zap + Shield)

## Phase 6: Продакшен

- [ ] Lighthouse: Performance >90, Accessibility >95
- [ ] SEO: мета-теги, Open Graph, sitemap.xml, robots.txt
- [ ] Error boundaries на каждый маршрут
- [ ] Loading states (Suspense + skeletons)
- [ ] E2E тесты (Playwright)
- [ ] CI/CD: GitHub Actions → Vercel
- [ ] Домен: hhjobcopilot.ru / hhcopilot.com

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
