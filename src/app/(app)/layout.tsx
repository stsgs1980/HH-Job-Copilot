'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ThemeToggle, Logo } from '@/components/shared'
import {
  Zap, MessageSquare, Search, Briefcase, Mic, BarChart3, Check, LogOut, Send,
} from 'lucide-react'
import type { DashboardMode } from '@/types'

const modes: Array<{ id: DashboardMode; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { id: 'chat', label: 'Чат', icon: MessageSquare },
  { id: 'search', label: 'Поиск', icon: Search },
  { id: 'vacancies', label: 'Вакансии', icon: Briefcase },
  { id: 'interview', label: 'Интервью', icon: Mic },
  { id: 'analytics', label: 'Аналитика', icon: BarChart3 },
]

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [activeMode, setActiveMode] = useState<DashboardMode>('chat')
  const [inputValue, setInputValue] = useState('')

  return (
    <div className="h-screen flex flex-col bg-background relative overflow-hidden">
      <div className="ambient-glow w-[500px] h-[500px] bg-cyan -top-48 -right-48" />
      <div className="ambient-glow w-[350px] h-[350px] bg-purple -bottom-32 -left-32" style={{ animationDelay: '-12s' }} />

      {/* Top Bar */}
      <header className="relative z-50 glass-card rounded-none shrink-0">
        <div className="px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Logo size="sm" />
            </Link>
            <span className="font-bold text-sm hidden sm:inline">HH Job Copilot</span>
            <nav className="hidden md:flex gap-1 bg-muted rounded-lg p-1">
              {modes.map(m => (
                <button
                  key={m.id}
                  onClick={() => setActiveMode(m.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    activeMode === m.id ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <m.icon className="w-3.5 h-3.5" /> {m.label}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden lg:flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 bg-muted px-2.5 py-1 rounded-md"><Zap className="w-3 h-3 text-cyan" /><span className="font-semibold tabular-nums">47</span> откликов</span>
              <span className="flex items-center gap-1.5 bg-muted px-2.5 py-1 rounded-md"><Check className="w-3 h-3 text-emerald-400" /><span className="font-semibold tabular-nums">8</span> приглашений</span>
              <span className="flex items-center gap-1.5 bg-muted px-2.5 py-1 rounded-md"><MessageSquare className="w-3 h-3 text-purple" /><span className="font-semibold tabular-nums">5</span> чатов</span>
            </div>
            <ThemeToggle size="icon" className="h-8 w-8" />
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.push('/')}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex relative z-10 overflow-hidden">
        {children}
      </div>

      {/* Input Bar */}
      <div className="relative z-50 glass-card rounded-none shrink-0">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center gap-2 bg-muted rounded-xl px-4 py-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0"><Send className="w-4 h-4" /></Button>
            <input
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Спросите что угодно или дайте команду..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8"><Mic className="w-4 h-4 text-purple" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8"><Briefcase className="w-4 h-4 text-cyan" /></Button>
            </div>
          </div>
          <p className="text-center text-[10px] text-muted-foreground mt-2">HH Job Copilot может ошибаться. Проверяйте важную информацию.</p>
        </div>
      </div>
    </div>
  )
}
