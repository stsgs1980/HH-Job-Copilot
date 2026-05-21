'use client'

import type { ReactNode } from 'react'

interface MarqueeProps {
  items: Array<{ content: ReactNode; key: string }>
  speed?: number
  className?: string
}

export function Marquee({ items, speed = 30, className = '' }: MarqueeProps) {
  return (
    <div className={`overflow-hidden ${className}`} aria-hidden="true">
      <div
        className="flex w-max"
        style={{
          animation: `marquee ${speed}s linear infinite`,
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
