'use client'

import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16 gradient-mesh relative overflow-hidden">
      {/* NEURO: Mesh blobs */}
      <div className="mesh-blob mesh-blob-1 top-[10%] left-[10%]" />
      <div className="mesh-blob mesh-blob-2 bottom-[20%] right-[10%]" />

      <div className="glass-card p-8 sm:p-10 max-w-md w-full text-center page-transition relative z-10">
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan/20">
          <AlertTriangle className="w-8 h-8 text-white" />
        </div>

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-bold gradient-text mb-3">
          Что-то пошло не так
        </h2>

        {/* Description */}
        <p className="text-muted-foreground text-sm sm:text-base mb-2">
          Произошла непредвиденная ошибка
        </p>
        {error?.message && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 mb-6">
            <p className="text-xs text-red-400 break-words">
              {error.message}
            </p>
          </div>
        )}

        {!error?.message && <div className="mb-6" />}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={reset}
            className="gradient-bg text-white border-0 hover:opacity-90 gap-2 sweep-btn"
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
