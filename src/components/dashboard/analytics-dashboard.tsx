'use client'

import { useAnalytics } from '@/hooks/use-analytics'
import { useApplications } from '@/hooks/use-vacancies'
import { useInterviews } from '@/hooks/use-interviews'
import { Badge } from '@/components/ui/badge'
import {
  BarChart3, Briefcase, CheckCircle2, Zap, TrendingUp, Users, Target,
} from 'lucide-react'

export function AnalyticsDashboard() {
  const { stats, weekChart, weekDays, isLoading: analyticsLoading } = useAnalytics()
  const { stats: appStats, isLoading: appLoading } = useApplications()
  const { stats: intStats, isLoading: intLoading } = useInterviews()

  const isLoading = analyticsLoading || appLoading || intLoading
  const conversionRate = appStats.total > 0 ? Math.round((appStats.invited / appStats.total) * 100) : 0
  const maxChart = Math.max(...weekChart, 1)
  const bestDayIndex = weekChart.indexOf(maxChart)

  if (isLoading) {
    return (
      <main className="flex-1 overflow-y-auto" id="main-content">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-5 h-5 border-2 border-cyan border-t-transparent rounded-full animate-spin" />
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 overflow-y-auto" id="main-content">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {/* Main stats */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={<Briefcase className="w-4 h-4 text-cyan" />} label="Откликов" value={appStats.total} color="text-cyan" subtext={`За неделю: ${weekChart.reduce((a, b) => a + b, 0)}`} />
          <StatCard icon={<CheckCircle2 className="w-4 h-4 text-emerald" />} label="Приглашений" value={appStats.invited} color="text-emerald" subtext={`Конверсия: ${conversionRate}%`} />
          <StatCard icon={<Target className="w-4 h-4 text-purple" />} label="Совпадение" value={stats.find(s => s.label === 'Совпадение')?.value ?? '0%'} color="text-purple" subtext="По данным AI" />
          <StatCard icon={<Users className="w-4 h-4 text-orange-400" />} label="Интервью" value={intStats.total} color="text-orange-400" subtext={`${intStats.completed} завершено`} />
        </div>

        {/* Week chart */}
        <div className="bg-muted/20 border border-border/30 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-cyan" /> Отклики за неделю
            </span>
            <Badge className="text-[10px] h-4 gap-1 bg-cyan/10 text-cyan border-0">
              <TrendingUp className="w-2.5 h-2.5" /> Активность
            </Badge>
          </div>
          <div className="flex items-end gap-2 h-24 px-1">
            {weekChart.map((h, i) => {
              const heightPercent = maxChart > 0 ? (h / maxChart) * 100 : 0
              const isBest = i === bestDayIndex && h > 0
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[9px] text-muted-foreground tabular-nums">{h || ''}</span>
                  <div className="w-full rounded-t-sm transition-all duration-300" style={{
                    height: `${Math.max(heightPercent, 4)}%`,
                    background: isBest ? '#4ade80' : h > 0 ? '#22d3ee' : '#333',
                    opacity: h > 0 ? 0.8 : 0.3,
                  }} />
                </div>
              )
            })}
          </div>
          <div className="flex gap-2 px-1">
            {weekDays.map(d => (
              <div key={d} className="flex-1 text-center text-[9px] text-muted-foreground">{d}</div>
            ))}
          </div>
        </div>

        {/* Funnel */}
        <div className="bg-muted/20 border border-border/30 rounded-xl p-4 space-y-3">
          <span className="text-xs font-semibold">Воронка откликов</span>
          <FunnelBar label="Отправлено" value={appStats.total} max={appStats.total || 1} color="bg-cyan" />
          <FunnelBar label="Просмотрено" value={appStats.viewed} max={appStats.total || 1} color="bg-purple" />
          <FunnelBar label="Приглашение" value={appStats.invited} max={appStats.total || 1} color="bg-emerald" />
          <FunnelBar label="Отклонено" value={appStats.rejected} max={appStats.total || 1} color="bg-red-400" />
        </div>

        <div className="h-20" />
      </div>
    </main>
  )
}

function StatCard({ icon, label, value, color, subtext }: { icon: React.ReactNode; label: string; value: number | string; color: string; subtext: string }) {
  return (
    <div className="bg-muted/20 border border-border/30 rounded-xl p-3.5 space-y-1">
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-[10px] text-muted-foreground">{label}</span>
      </div>
      <div className={`text-xl font-bold tabular-nums ${color}`}>{value}</div>
      <p className="text-[10px] text-muted-foreground">{subtext}</p>
    </div>
  )
}

function FunnelBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const percent = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value} ({percent}%)</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}
