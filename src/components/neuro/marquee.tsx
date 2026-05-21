'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface MarqueeProps {
  items: Array<{ content: ReactNode; key: string }>
  speed?: number
  className?: string
  /** Pause on hover (default: true) */
  pauseOnHover?: boolean
  /** Direction: 'left' or 'right' (default: 'left') */
  direction?: 'left' | 'right'
}

export function Marquee({
  items,
  speed = 30,
  className = '',
  pauseOnHover = true,
  direction = 'left',
}: MarqueeProps) {
  const animDirection = direction === 'right' ? 'reverse' : 'normal'

  return (
    <div
      className={cn('overflow-hidden', pauseOnHover && '[&:hover>div]:[animation-play-state:paused]', className)}
      aria-hidden="true"
    >
      <div
        className="flex w-max"
        style={{
          animation: `marquee ${speed}s linear infinite`,
          animationDirection: animDirection,
        }}
      >
        {/* Double items for seamless loop */}
        {[...items, ...items].map((item, i) => (
          <div key={`${item.key}-${i}`} className="flex items-center shrink-0 px-10">
            {item.content}
          </div>
        ))}
      </div>
    </div>
  )
}
