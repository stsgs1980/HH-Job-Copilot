'use client'

import { cn } from '@/lib/utils'

interface AmbientGlowProps {
  color: 'cyan' | 'purple'
  size?: 'sm' | 'md' | 'lg'
  position: string
  delay?: number
}

const sizeMap = { sm: 'w-[250px] h-[250px]', md: 'w-[350px] h-[350px]', lg: 'w-[500px] h-[500px]' }

export function AmbientGlow({ color, size = 'md', position, delay }: AmbientGlowProps) {
  return (
    <div
      className={cn('ambient-glow', sizeMap[size], `bg-${color}`, position)}
      style={delay ? { animationDelay: `${delay}s` } : undefined}
    />
  )
}
