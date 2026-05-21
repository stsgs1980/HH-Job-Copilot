'use client'

export function Logo({ size = 'default' }: { size?: 'sm' | 'default' | 'lg' }) {
  const sizes = {
    sm: { box: 'w-6 h-6', text: 'text-sm' },
    default: { box: 'w-9 h-9', text: 'text-lg' },
    lg: { box: 'w-12 h-12', text: 'text-2xl' },
  }
  const s = sizes[size]

  return (
    <div className="flex items-center gap-2.5" style={{ perspective: '600px' }}>
      <div className={`${s.box} shrink-0 rounded-[10px] gradient-bg flex items-center justify-center font-black text-sm text-white zap-pulse`}
        style={{ transform: 'rotateY(-8deg) rotateX(4deg)', boxShadow: '0 4px 20px rgba(34,211,238,0.35), 0 4px 20px rgba(167,139,250,0.2)' }}
      >
        HC
      </div>
      {size !== 'sm' && (
        <span className={`font-extrabold tracking-tight ${s.text}`}>
          HH{' '}
          <span className="gradient-text">Copilot</span>
        </span>
      )}
    </div>
  )
}
