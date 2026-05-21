'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface GradientButtonProps {
  children: React.ReactNode
  size?: 'sm' | 'default' | 'lg'
  className?: string
  onClick?: () => void
  variant?: 'primary' | 'outline'
  type?: 'button' | 'submit'
  disabled?: boolean
}

export function GradientButton({
  children,
  size = 'default',
  className,
  onClick,
  variant = 'primary',
  type = 'button',
  disabled = false,
}: GradientButtonProps) {
  if (variant === 'outline') {
    return (
      <Button
        size={size}
        variant="outline"
        type={type}
        disabled={disabled}
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
      type={type}
      disabled={disabled}
      className={cn(
        'gradient-bg text-white border-0 hover:opacity-90 sweep-btn',
        size === 'lg' && 'text-base px-8 h-12',
        className,
      )}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}
