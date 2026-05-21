'use client'

export function Logo({ size = 'default' }: { size?: 'sm' | 'default' | 'lg' }) {
  const sizes = {
    sm: { box: 'w-6 h-6', text: 'text-sm' },
    default: { box: 'w-8 h-8', text: 'text-lg' },
    lg: { box: 'w-12 h-12', text: 'text-2xl' },
  }
  const s = sizes[size]

  return (
    <div className="flex items-center gap-2">
      <div className={`${s.box} shrink-0 zap-pulse`}>
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#E8443A" />
              <stop offset="100%" stopColor="#4ade80" />
            </linearGradient>
          </defs>
          {/* Shield */}
          <path d="M16 2L4 8v8c0 7.5 5.1 14.3 12 16 6.9-1.7 12-8.5 12-16V8L16 2z" fill="url(#logo-grad)" opacity="0.2" />
          <path d="M16 2L4 8v8c0 7.5 5.1 14.3 12 16 6.9-1.7 12-8.5 12-16V8L16 2z" stroke="url(#logo-grad)" strokeWidth="1.5" fill="none" />
          {/* Zap */}
          <path d="M18 6l-6 9h4l-2 11 6-9h-4l2-11z" fill="url(#logo-grad)" />
        </svg>
      </div>
      {size !== 'sm' && <span className={`font-extrabold tracking-tight ${s.text}`}>HH <span className="text-coral">Copilot</span></span>}
    </div>
  )
}
