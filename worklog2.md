---
Task ID: 1
Agent: main
Task: Fix runtime errors and enhance NEURO patterns to v4

Work Log:
- Investigated "missing required error components" runtime error
- Rewrote all 4 error.tsx files to use inline SVGs and plain HTML buttons (no library imports = no cascade failure)
- Added missing loading.tsx for (auth) route group
- Upgraded NEURO Design System from v3 to v4 in globals.css
- Created 3 new NEURO components: GlassCard, ScrollIndicator, GradientOrb
- Applied NEURO v4 effects across all pages (marketing, auth, dashboard)
- Build verification: 24 pages, 0 errors
- Runtime verification: all pages return HTTP 200

Stage Summary:
- Runtime errors fixed
- NEURO Design System upgraded to v4
- All pages enhanced with premium effects
