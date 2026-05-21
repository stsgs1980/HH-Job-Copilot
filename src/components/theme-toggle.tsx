'use client'

import { useSyncExternalStore } from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Sun, Moon } from 'lucide-react'

// Hydration-safe: returns false on server, true on client
const emptySubscribe = () => () => {}
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  )
}

interface ThemeToggleProps {
  variant?: 'ghost' | 'outline' | 'default'
  size?: 'icon' | 'sm' | 'default'
  showLabel?: boolean
  className?: string
}

export function ThemeToggle({
  variant = 'ghost',
  size = 'icon',
  showLabel = false,
  className,
}: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useMounted()

  if (!mounted) {
    return (
      <Button variant={variant} size={size} className={className} disabled aria-hidden>
        <span className="w-4 h-4" />
      </Button>
    )
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Переключить на светлую тему' : 'Переключить на тёмную тему'}
    >
      {isDark ? <Sun className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} /> : <Moon className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />}
      {showLabel && <span className="ml-2">{isDark ? 'Светлая тема' : 'Тёмная тема'}</span>}
    </Button>
  )
}
