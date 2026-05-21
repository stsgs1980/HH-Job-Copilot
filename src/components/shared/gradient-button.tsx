'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface GradientButtonProps {
  children: React.ReactNode
  size?: 'sm' | 'default' | 'lg'
  className?: string
  onClick?: () => void
  variant?: 'primary' | 'outline'
}

export function GradientButton({
  children,
  size = 'default',
  className,
  onClick,
  variant = 'primary',
}: GradientButtonProps) {
  if (variant === 'outline') {
    return (
      <Button
        size={size}
        variant="outline"
        className={cn('text-base', size === 'lg' && 'px-8 h-12', className)}
        onClick={onClick}
      >
        {children}
      </Button>
    )
  }

  return (
    <Button
      size={size}
      className={cn(
        'gradient-bg text-white border-0 hover:opacity-90',
        size === 'lg' && 'text-base px-8 h-12',
        className,
      )}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}
