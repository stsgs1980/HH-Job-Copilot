'use client'

import { Zap } from 'lucide-react'

export function Logo({ size = 'default' }: { size?: 'sm' | 'default' | 'lg' }) {
  const sizes = {
    sm: { box: 'w-6 h-6 rounded', icon: 'w-3 h-3', text: 'text-sm' },
    default: { box: 'w-8 h-8 rounded-lg', icon: 'w-4 h-4', text: 'text-lg' },
    lg: { box: 'w-12 h-12 rounded-xl', icon: 'w-6 h-6', text: 'text-2xl' },
  }
  const s = sizes[size]

  return (
    <div className="flex items-center gap-2">
      <div className={`${s.box} gradient-bg flex items-center justify-center zap-pulse`}>
        <Zap className={`${s.icon} text-white`} />
      </div>
      {size !== 'sm' && <span className={`font-bold ${s.text}`}>HH Job Copilot</span>}
    </div>
  )
}
