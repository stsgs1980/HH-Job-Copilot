'use client'

export default function MarketingError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16 gradient-mesh relative overflow-hidden">
      <div className="mesh-blob mesh-blob-1 top-[10%] left-[10%]" />
      <div className="mesh-blob mesh-blob-2 bottom-[20%] right-[10%]" />

      <div className="glass-card p-8 sm:p-10 max-w-md w-full text-center page-transition relative z-10">
        <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan/20">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <path d="M12 9v4" /><path d="M12 17h.01" />
          </svg>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold gradient-text mb-3">
          Что-то пошло не так
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base mb-2">
          Произошла непредвиденная ошибка
        </p>
        {error?.message && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 mb-6">
            <p className="text-xs text-red-400 break-words">{error.message}</p>
          </div>
        )}
        {!error?.message && <div className="mb-6" />}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="gradient-bg text-white border-0 rounded-md px-5 py-2 text-sm font-medium cursor-pointer sweep-btn inline-flex items-center gap-2"
          >
            Попробовать снова
          </button>
          <a
            href="/"
            className="text-muted-foreground hover:text-foreground transition-colors text-sm inline-flex items-center gap-2 px-5 py-2 rounded-md border border-border"
          >
            На главную
          </a>
        </div>
      </div>
    </div>
  )
}
