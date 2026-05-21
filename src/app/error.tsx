'use client'

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
        {/* Icon — inline SVG to avoid import failures */}
        <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan/20">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <path d="M12 9v4" /><path d="M12 17h.01" />
          </svg>
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

        {/* Actions — plain buttons to avoid import failures */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="gradient-bg text-white border-0 rounded-md px-5 py-2 text-sm font-medium cursor-pointer sweep-btn inline-flex items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 16h5v5" />
            </svg>
            Попробовать снова
          </button>
          <a
            href="/"
            className="text-muted-foreground hover:text-foreground transition-colors text-sm inline-flex items-center gap-2 px-5 py-2 rounded-md border border-border"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            На главную
          </a>
        </div>
      </div>
    </div>
  )
}
