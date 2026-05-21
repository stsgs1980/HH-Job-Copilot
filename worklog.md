
---
Task ID: 1
Agent: main
Task: Fix runtime errors + upgrade NEURO design patterns v3

Work Log:
- Fixed AnalyticsInline StatItem property name mismatch (s.v/s.l/s.c -> s.value/s.label/s.color)
- Fixed ChatPanel props interface (added chats, isLoading optional props)
- Added root-level error.tsx (was missing, only global-error.tsx existed)
- Complete rewrite of globals.css NEURO Design System v3:
  - Glassmorphism: stronger blur, cyan-tinted borders, inset highlights
  - Noise overlay: richer grain (numOctaves=5), stronger dark mode opacity (0.055)
  - Cursor glow: larger (700px), stronger dark mode (0.14 cyan)
  - Dot pattern: dual-layer (24px + 48px), cyan + purple dots
  - Mesh blobs: larger (600/500/400), richer colors
  - Gradient text: more vivid in dark mode (oklch 0.80/0.78)
  - Glass cards: cyan-tinted borders, stronger shadows, inset highlights
  - Glass nav: cyan edge highlight, stronger blur
  - Glass elevated: ambient glow in dark mode
  - New: section-divider, stat-card, scroll-indicator patterns
  - Gradient mesh backgrounds: stronger opacity values
  - Hover effects: deeper shadows, stronger cyan glow
  - Premium button sweep: faster (0.5s), brighter (0.30 opacity)
- Updated SpotlightCard: top+bottom edge highlights, 600px spotlight radius
- Updated TiltCard: cyan/purple tinted glare, scale3d on hover
- Updated Logo: SVG hexagon icon, stronger 3D shadow
- Updated GradientButton: shadow-lg shadow-cyan/25, gradient-border for outline
- Updated Hero: scroll-indicator, gradient orb, floating elements, stat-card
- Updated Features: section-divider, gradient label lines, icon backgrounds
- Updated HowItWorks: section-divider, gradient label lines, stronger shadows
- Updated Pricing: animated border, stronger button shadows
- Updated Marketing page: section dividers, gradient marquee dots
- Updated Auth layout: SVG logo icon, gradient accent line, floating elements
- Updated Dashboard layout: ambient glows, stat-card for metrics
- Build: 24 pages, 0 errors

Stage Summary:
- Fixed 3 runtime errors (AnalyticsInline, ChatPanel, root error.tsx)
- All NEURO patterns upgraded to v3 with stronger visual presence
- Build passes with 0 errors
