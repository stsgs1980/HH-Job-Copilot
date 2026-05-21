'use client'

import { useEffect, useRef, useState } from 'react'

interface CountUpProps {
  target: number
  duration?: number
  suffix?: string
  prefix?: string
  decimals?: number
  className?: string
}

export function CountUp({
  target,
  duration = 2000,
  suffix = '',
  prefix = '',
  decimals = 0,
  className = '',
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState('0')
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          const start = performance.now()

          function animate(now: number) {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            // Cubic ease-out with slight bounce
            const eased = 1 - Math.pow(1 - progress, 3)
            const current = target * eased

            if (decimals > 0) {
              setDisplay(current.toFixed(decimals))
            } else {
              setDisplay(Math.floor(current).toLocaleString('ru-RU'))
            }

            if (progress < 1) {
              requestAnimationFrame(animate)
            }
          }

          requestAnimationFrame(animate)
          observer.unobserve(el)
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration, decimals, hasAnimated])

  return (
    <span ref={ref} className={className}>
      {prefix}{display}{suffix}
    </span>
  )
}
