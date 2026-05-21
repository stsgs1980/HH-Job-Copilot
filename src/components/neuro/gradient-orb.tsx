'use client'

interface GradientOrbProps {
  color?: 'cyan' | 'purple' | 'emerald'
  size?: number
  x?: string
  y?: string
  className?: string
}

const colorMap = {
  cyan: 'rgba(34,211,238,0.20)',
  purple: 'rgba(167,139,250,0.18)',
  emerald: 'rgba(52,211,153,0.15)',
}

export function GradientOrb({
  color = 'cyan',
  size = 300,
  x = '50%',
  y = '50%',
  className = '',
}: GradientOrbProps) {
  return (
    <div
      className={`hero-orb ${className}`}
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        background: colorMap[color],
        transform: 'translate(-50%, -50%)',
      }}
      aria-hidden="true"
    />
  )
}
