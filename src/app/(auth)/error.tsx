'use client'

import { ShieldAlert, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="w-full flex items-center justify-center py-12">
      <div className="glass-card p-8 sm:p-10 max-w-md w-full text-center page-transition">
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-8 h-8 text-white" />
        </div>

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-bold gradient-text mb-3">
          Ошибка авторизации
        </h2>

        {/* Description */}
        <p className="text-muted-foreground text-sm sm:text-base mb-2">
          Произошла ошибка при попытке входа в аккаунт
        </p>
        <p className="text-xs text-muted-foreground/70 mb-6">
          Проверьте подключение к интернету и попробуйте снова
        </p>

        {/* Error detail */}
        {error?.message && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 mb-6">
            <p className="text-xs text-red-400 break-words">
              {error.message}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/login">
            <Button className="gradient-bg text-white border-0 hover:opacity-90 gap-2">
              <RefreshCw className="w-4 h-4" />
              Войти снова
            </Button>
          </Link>
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
