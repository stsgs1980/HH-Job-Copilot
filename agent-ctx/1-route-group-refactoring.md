# Task 1 — Route Group Refactoring

## Agent: main
## Status: ✅ Completed

### Summary
Converted the SPA router in `src/app/page.tsx` to Next.js file-system based routing with route groups `(marketing)`, `(auth)`, and `(app)`.

### Changes Made

#### New Files Created
1. **`src/app/(marketing)/layout.tsx`** — Server component. Sticky nav with Logo, anchor links, ThemeToggle, Войти/Начать бесплатно buttons using `next/link` to `/login`. Footer with Logo, links, copyright.
2. **`src/app/(marketing)/page.tsx`** — Client component. Landing page content: Hero, Features, HowItWorks, Pricing, CTA section. Uses `useRouter().push('/login')` for `onNavigate` callbacks.
3. **`src/app/(auth)/layout.tsx`** — Server component. Centered card layout with ambient glow backgrounds, Logo linking to `/`, ThemeToggle at bottom.
4. **`src/app/(auth)/login/page.tsx`** — Client component. Renders `AuthForm` with `onNavigate` → `router.push('/dashboard')`.
5. **`src/app/(app)/layout.tsx`** — Client component. App shell: top bar (Logo, mode tabs, stats, ThemeToggle, logout→`/`), input bar at bottom, ambient glows. Manages `activeMode` and `inputValue` state.
6. **`src/app/(app)/dashboard/page.tsx`** — Client component. Dashboard content: AIDigest, UserMessage, VacancyResponse, InterviewLive, AnalyticsInline, ChatPanel. Manages `showPanel` state.

#### Modified Files
- **`src/types/index.ts`** — Removed `View` type (no longer needed with file-system routing).

#### Deleted Files
- **`src/app/page.tsx`** — Old monolithic SPA router replaced by route group pages.

### Route Structure
| URL | Route Group | Page File | Description |
|-----|-------------|-----------|-------------|
| `/` | `(marketing)` | `(marketing)/page.tsx` | Landing page |
| `/login` | `(auth)` | `(auth)/login/page.tsx` | Auth page |
| `/dashboard` | `(app)` | `(app)/dashboard/page.tsx` | Dashboard |

### Navigation
- All `onNavigate('auth')` → `router.push('/login')` or `<Link href="/login">`
- All `onNavigate('dashboard')` → `router.push('/dashboard')`
- All `onNavigate('landing')` → `router.push('/')`
- Existing components (Hero, Pricing, AuthForm) kept unchanged — they still accept `onNavigate: () => void` callbacks

### Verification
- `bun run lint` — passes with no errors
- Dev server compiles all routes successfully (`/`, `/login`, `/dashboard` all return 200)
- No remaining references to the removed `View` type
