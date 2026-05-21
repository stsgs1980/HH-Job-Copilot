'use client'

export function Logo({ size = 'default' }: { size?: 'sm' | 'default' | 'lg' }) {
  const sizes = {
    sm: { box: 'w-6 h-6', text: 'text-sm', icon: 'text-[9px]' },
    default: { box: 'w-9 h-9', text: 'text-lg', icon: 'text-xs' },
    lg: { box: 'w-12 h-12', text: 'text-2xl', icon: 'text-sm' },
  }
  const s = sizes[size]

  return (
    <div className="flex items-center gap-2.5" style={{ perspective: '600px' }}>
      <div
        className={`${s.box} shrink-0 rounded-[10px] gradient-bg flex items-center justify-center font-black ${s.icon} text-white zap-pulse`}
        style={{
          transform: 'rotateY(-8deg) rotateX(4deg)',
          boxShadow: '0 6px 24px rgba(34,211,238,0.45), 0 4px 16px rgba(167,139,250,0.25), inset 0 1px 0 rgba(255,255,255,0.2)',
        }}
      >
        {/* SVG icon — hexagon with circuit pattern */}
        <svg viewBox="0 0 24 24" fill="none" className="w-[60%] h-[60%]" aria-hidden="true">
          <path d="M12 2L21 7.5V16.5L12 22L3 16.5V7.5L12 2Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M12 8V12M9 10.5H15M12 12L9 14M12 12L15 14" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
        </svg>
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
