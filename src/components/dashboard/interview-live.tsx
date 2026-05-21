'use client'

import { Zap, Mic } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function InterviewLive() {
  return (
    <div className="flex gap-3">
      <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shrink-0">
        <Zap className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-cyan mb-1">HH Job Copilot</p>
        <div className="bg-card border border-border rounded-2xl rounded-tl-sm p-4 space-y-3">
          <p className="text-sm">Интервью-режим активирован! Микрофон включён, ASR готов.</p>
          <div className="rounded-xl border border-cyan/20 bg-gradient-to-br from-cyan/5 to-purple/5 overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-cyan/10">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-red-400"><span className="w-2 h-2 rounded-full bg-red-400 animate-pulse-dot" /> LIVE</span>
              <span className="text-xs text-muted-foreground flex items-center gap-1"><Mic className="w-3 h-3" /> Яндекс — Senior Frontend</span>
            </div>
            <div className="p-3 space-y-2">
              <p className="text-sm"><span className="font-semibold text-purple">Интервьюер:</span> Здравствуйте! Расскажите о вашем опыте работы с React и Next.js?</p>
              <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-lg p-2.5">
                <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider mb-1 flex items-center gap-1"><Zap className="w-3 h-3" /> AI Подсказка</p>
                <p className="text-xs text-muted-foreground leading-relaxed">Работаю с React 5+ лет, с Next.js — 3 года. В последнем проекте реализовал SSR для e-commerce (500k+ MAU), настроил ISR для каталога, интегрировал middleware для A/B тестирования.</p>
              </div>
              <p className="text-sm flex items-center gap-2">
                <span className="font-semibold text-cyan">Вы:</span> Работаю с React уже более 5 лет...
                <span className="flex items-end gap-0.5 h-3.5">
                  {[0, 0.15, 0.3, 0.45].map((d, i) => (
                    <span key={i} className="w-0.5 bg-purple rounded-full animate-wave" style={{ animationDelay: `${d}s` }} />
                  ))}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[10px] text-muted-foreground">13:55</span>
          <Badge variant="secondary" className="text-[10px] h-4 gap-1 bg-purple/10 text-purple border-0"><Mic className="w-2.5 h-2.5" /> ASR Active</Badge>
        </div>
      </div>
    </div>
  )
}
