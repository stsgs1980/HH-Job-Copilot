'use client'

import { useRef, type ReactNode, type MouseEvent } from 'react'
import { cn } from '@/lib/utils'

interface SpotlightCardProps {
  children: ReactNode
  className?: string
  spotlightColor?: string
  /** Enable 3D tilt on hover (default: false) */
  tilt?: boolean
  /** Max tilt degrees when tilt is enabled (default: 6) */
  maxTilt?: number
}

export function SpotlightCard({
  children,
  className = '',
  spotlightColor,
  tilt = false,
  maxTilt = 6,
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    card.style.setProperty('--mx', `${x}%`)
    card.style.setProperty('--my', `${y}%`)

    if (tilt) {
      const tiltX = ((y / 100) - 0.5) * -maxTilt
      const tiltY = ((x / 100) - 0.5) * maxTilt
      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-3px)`
    }
  }

  function handleMouseLeave() {
    const card = cardRef.current
    if (!card) return
    if (tilt) {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)'
    }
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'group relative overflow-hidden glass-card transition-all duration-300 hover:border-cyan/20',
        tilt && 'will-change-transform',
        className,
      )}
      style={{
        // @ts-expect-error CSS custom properties
        '--mx': '50%',
        '--my': '50%',
        ...(tilt ? { transition: 'transform 0.2s ease-out, border-color 0.3s, box-shadow 0.3s' } : {}),
      }}
    >
      {/* NEURO: Spotlight radial gradient overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at var(--mx) var(--my), ${spotlightColor || 'rgba(34,211,238,0.06)'} 0%, transparent 60%)`,
        }}
        aria-hidden="true"
      />
      {/* NEURO: Top edge highlight on hover */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.3), rgba(167,139,250,0.2), transparent)',
        }}
        aria-hidden="true"
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
