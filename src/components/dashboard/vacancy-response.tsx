'use client'

import { Zap, Briefcase, ChevronRight, Building2, Check, Layers } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { VacancyCard as VacancyCardType } from '@/types'

const vacancies: VacancyCardType[] = [
  { title: 'Senior Frontend Developer', company: 'Яндекс', location: 'Удаленка', salary: '250-350k', match: 95 },
  { title: 'React Developer', company: 'Тинькофф', location: 'Удаленка', salary: '220-320k', match: 92 },
  { title: 'Frontend Lead', company: 'VK', location: 'СПб', salary: '280-400k', match: 87 },
]

export function VacancyResponse() {
  return (
    <div className="flex gap-3">
      <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shrink-0">
        <Zap className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-cyan mb-1">HH Job Copilot</p>
        <div className="bg-card border border-border rounded-2xl rounded-tl-sm p-4 space-y-3">
          <p className="text-sm">Готово! Ответ отправлен Елене через Chatik API:</p>
          <div className="bg-muted rounded-lg p-3 border-l-2 border-cyan">
            <p className="text-sm italic text-muted-foreground">&ldquo;Здравствуйте, Елена! Спасибо за приглашение. С удовольствием прохожу собеседование завтра в 14:00. Подскажите, какой формат — Zoom или Google Meet?&rdquo;</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="secondary" className="text-[10px] h-5 gap-1 bg-emerald-500/10 text-emerald-400 border-0"><Check className="w-3 h-3" /> Humanized</Badge>
            <Badge variant="secondary" className="text-[10px] h-5 gap-1 bg-cyan/10 text-cyan border-0"><Zap className="w-3 h-3" /> Отправлено</Badge>
          </div>
          {/* Vacancies */}
          <div className="bg-muted/50 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-purple" /> Топ вакансии React</span>
              <span className="text-xs text-cyan cursor-pointer flex items-center gap-1">Все 12 <ChevronRight className="w-3 h-3" /></span>
            </div>
            {vacancies.map((v, i) => (
              <div key={i} className="flex items-center gap-2 py-1.5 border-b border-border/50 last:border-0">
                <div className="w-7 h-7 rounded bg-muted flex items-center justify-center"><Building2 className="w-3.5 h-3.5 text-muted-foreground" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{v.title}</p>
                  <p className="text-[10px] text-muted-foreground">{v.company} &bull; {v.location}</p>
                </div>
                <span className="text-xs font-medium text-emerald-400 whitespace-nowrap">{v.salary}</span>
                <Badge variant="secondary" className="text-[9px] h-4 bg-cyan/10 text-cyan border-0">{v.match}%</Badge>
              </div>
            ))}
            <div className="flex gap-2 pt-1">
              <Button size="sm" className="h-7 text-xs gradient-bg text-white border-0 hover:opacity-90 gap-1"><Zap className="w-3 h-3" /> Массовый отклик</Button>
              <Button size="sm" variant="outline" className="h-7 text-xs gap-1"><Layers className="w-3 h-3" /> AI-сопоставление</Button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[10px] text-muted-foreground">09:02</span>
          <Badge variant="secondary" className="text-[10px] h-4 gap-1 bg-cyan/10 text-cyan border-0"><Zap className="w-2.5 h-2.5" /> Chatik API</Badge>
          <Badge variant="secondary" className="text-[10px] h-4 gap-1 bg-emerald-500/10 text-emerald-400 border-0"><Check className="w-2.5 h-2.5" /> Humanized</Badge>
        </div>
      </div>
    </div>
  )
}
