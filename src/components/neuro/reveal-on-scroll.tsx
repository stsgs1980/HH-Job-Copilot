'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

interface RevealOnScrollProps {
  children: ReactNode
  className?: string
  delay?: number
  threshold?: number
  once?: boolean
  /** Direction of reveal: 'up' | 'left' | 'right' | 'scale' */
  direction?: 'up' | 'left' | 'right' | 'scale'
}

const directionStyles: Record<string, { hidden: string; visible: string }> = {
  up: {
    hidden: 'translateY(30px) scale(0.98)',
    visible: 'translateY(0) scale(1)',
  },
  left: {
    hidden: 'translateX(-30px) scale(0.98)',
    visible: 'translateX(0) scale(1)',
  },
  right: {
    hidden: 'translateX(30px) scale(0.98)',
    visible: 'translateX(0) scale(1)',
  },
  scale: {
    hidden: 'scale(0.95)',
    visible: 'scale(1)',
  },
}

export function RevealOnScroll({
  children,
  className = '',
  delay = 0,
  threshold = 0.1,
  once = true,
  direction = 'up',
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) observer.unobserve(el)
        } else if (!once) {
          setIsVisible(false)
        }
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, once])

  const styles = directionStyles[direction] || directionStyles.up

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? styles.visible : styles.hidden,
        transition: `opacity 0.7s cubic-bezier(0.23, 1, 0.32, 1) ${delay}s, transform 0.7s cubic-bezier(0.23, 1, 0.32, 1) ${delay}s`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  )
}
