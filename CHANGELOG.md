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

### Design inspiration
- nextjs.org: 3-column layout, Cmd+K, dark theme, Geist fonts, stat cards
- 21st.dev: 78 AI Chat components, Radix UI + Tailwind, dark mode, glowing AI chat
- thita.ai: Progress bars, streak counters, roadmap, AI Coach + Mock Interview
- polarity.so: Technical landing, clear benefits, 3-tier pricing
- tryusercue.com: Premium glassmorphic design, gradient mesh backgrounds
