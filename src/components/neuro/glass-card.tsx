'use client'

import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  /** Enable elevated variant (hero, pricing) */
  elevated?: boolean
  /** Enable animated glow line on top edge */
  glowLine?: boolean
  /** Enable hover glow effect */
  hoverGlow?: boolean
  /** Enable hover lift effect */
  hoverLift?: boolean
}

export function GlassCard({
  children,
  className = '',
  elevated = false,
  glowLine = false,
  hoverGlow = false,
  hoverLift = false,
}: GlassCardProps) {
  return (
    <div
      className={cn(
        elevated ? 'glass-card-elevated' : 'glass-card',
        glowLine && 'glow-line',
        hoverGlow && 'hover-glow',
        hoverLift && 'hover-lift',
        className,
      )}
    >
      {children}
    </div>
  )
}
