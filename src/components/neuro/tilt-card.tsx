'use client'

import { useRef, type ReactNode, type MouseEvent } from 'react'
import { cn } from '@/lib/utils'

interface TiltCardProps {
  children: ReactNode
  className?: string
  maxTilt?: number
  /** Glare effect intensity (0-1, default: 0.08) */
  glareIntensity?: number
}

export function TiltCard({
  children,
  className = '',
  maxTilt = 6,
  glareIntensity = 0.08,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    const tiltX = (y - 0.5) * -maxTilt
    const tiltY = (x - 0.5) * maxTilt

    card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`

    // Move glare
    const glare = card.querySelector('[data-glare]') as HTMLElement
    if (glare) {
      glare.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,${glareIntensity}), transparent 60%)`
    }
  }

  function handleMouseLeave() {
    const card = cardRef.current
    if (!card) return
    card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)'

    const glare = card.querySelector('[data-glare]') as HTMLElement
    if (glare) {
      glare.style.background = 'transparent'
    }
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'transition-transform duration-300 ease-out will-change-transform',
        className,
      )}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* NEURO: Glare overlay */}
      <div
        data-glare
        className="pointer-events-none absolute inset-0 z-20 rounded-2xl transition-opacity duration-300"
        aria-hidden="true"
      />
      {children}
    </div>
  )
}
