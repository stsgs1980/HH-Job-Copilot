'use client'

import { Zap, MessageSquare, ChevronRight, Building2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { StatItem } from '@/types'

const digestStats: StatItem[] = [
  { value: '47', label: 'Отклики', color: 'text-cyan' },
  { value: '8', label: 'Приглашения', color: 'text-emerald-400' },
  { value: '5', label: 'Чаты', color: 'text-emerald' },
  { value: '2', label: 'Интервью', color: 'text-orange-400' },
]

const newMessages = [
  'Яндекс HR: Елена — Когда сможете пройти собеседование?',
  'Avito HR: Михаил — Расскажите о вашем опыте с Next.js?',
  'Тинькофф HR: Анна — Отправьте портфолио',
]

export function AIDigest() {
  return (
    <div className="flex gap-3">
      <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shrink-0">
        <Zap className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-cyan mb-1">HH Job Copilot</p>
        <div className="glass-card rounded-2xl rounded-tl-sm p-4 space-y-3">
          <p className="text-sm">Доброе утро, Сергей! Вот ваш дайджест за сегодня:</p>
          {/* Inline Stats */}
          <div className="grid grid-cols-4 gap-2">
            {digestStats.map((s, i) => (
              <div key={i} className="bg-muted rounded-lg p-2.5 text-center hover-glow cursor-default">
                <div className={`text-lg font-bold tabular-nums ${s.color}`}>{s.value}</div>
                <div className="text-[10px] text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
          {/* Chat messages card */}
          <div className="bg-muted/50 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold flex items-center gap-1.5"><MessageSquare className="w-4 h-4 text-cyan" /> 3 новых сообщения</span>
              <span className="text-xs text-cyan cursor-pointer flex items-center gap-1">Ответить всем <ChevronRight className="w-3 h-3" /></span>
            </div>
            {newMessages.map((msg, i) => (
              <div key={i} className="flex items-center gap-2 text-xs py-1.5 border-b border-border/50 last:border-0">
                <div className="w-6 h-6 rounded bg-muted flex items-center justify-center"><Building2 className="w-3 h-3 text-muted-foreground" /></div>
                <span className="text-muted-foreground truncate flex-1">{msg}</span>
              </div>
            ))}
            <div className="flex gap-2 pt-1">
              <Button size="sm" className="h-7 text-xs gradient-bg gradient-shimmer text-white border-0 hover:opacity-90 gap-1"><Zap className="w-3 h-3" /> AI-ответ всем</Button>
              <Button size="sm" variant="secondary" className="h-7 text-xs">Ответить вручную</Button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[10px] text-muted-foreground">09:00</span>
          <Badge variant="secondary" className="text-[10px] h-4 gap-1 bg-cyan/10 text-cyan border-0"><Zap className="w-2.5 h-2.5" /> Chatik API</Badge>
        </div>
      </div>
    </div>
  )
}
