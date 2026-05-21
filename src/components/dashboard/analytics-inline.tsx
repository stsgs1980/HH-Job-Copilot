'use client'

import { BarChart3 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { StatItem } from '@/types'

const weekChart = [40, 65, 45, 80, 55, 92, 70]
const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

const analyticsStats: StatItem[] = [
  { v: '47', l: 'Отклики', c: 'text-cyan' },
  { v: '8', l: 'Приглашения', c: 'text-emerald-400' },
  { v: '17%', l: 'Конверсия', c: 'text-purple' },
  { v: '89%', l: 'Совпадение', c: 'text-orange-400' },
]

export function AnalyticsInline() {
  return (
    <div className="flex gap-3">
      <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shrink-0">
        <BarChart3 className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-cyan mb-1">HH Job Copilot</p>
        <div className="glass-card rounded-2xl rounded-tl-sm p-4 space-y-3">
          <p className="text-sm">Вот ваша аналитика за неделю:</p>
          <div className="bg-muted/50 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold flex items-center gap-1.5"><BarChart3 className="w-4 h-4 text-cyan" /> Отклики за неделю</span>
              <span className="text-xs text-cyan cursor-pointer">Подробнее</span>
            </div>
            <div className="flex items-end gap-1 h-20 px-1">
              {weekChart.map((h, i) => (
                <div key={i} className="flex-1 rounded-t-sm transition-all duration-300" style={{
                  height: `${h}%`,
                  background: i >= 5 ? '#4ade80' : i === 3 ? '#a78bfa' : '#22d3ee',
                  opacity: 0.7 + (h / 400),
                }} />
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground px-1">
              {weekDays.map(d => <span key={d}>{d}</span>)}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {analyticsStats.map((s, i) => (
              <div key={i} className="bg-muted rounded-lg p-2 text-center hover-glow cursor-default">
                <div className={`text-sm font-bold tabular-nums ${s.c}`}>{s.v}</div>
                <div className="text-[9px] text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[10px] text-muted-foreground">14:10</span>
          <Badge variant="secondary" className="text-[10px] h-4 gap-1 bg-orange-500/10 text-orange-400 border-0"><BarChart3 className="w-2.5 h-2.5" /> Analytics</Badge>
        </div>
      </div>
    </div>
  )
}
