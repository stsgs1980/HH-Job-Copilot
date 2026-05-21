'use client'

import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function MarketingError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="glass-card p-8 sm:p-10 max-w-md w-full text-center page-transition">
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-white" />
        </div>

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-bold gradient-text mb-3">
          Что-то пошло не так
        </h2>

        {/* Description */}
        <p className="text-muted-foreground text-sm sm:text-base mb-2">
          Попробуйте обновить страницу
        </p>
        {error?.message && (
          <p className="text-xs text-muted-foreground/70 mb-6 max-w-xs mx-auto truncate">
            {error.message}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
          <Button
            onClick={reset}
            className="gradient-bg text-white border-0 hover:opacity-90 gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Попробовать снова
          </Button>
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <Home className="w-4 h-4" />
              На главную
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
