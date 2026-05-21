'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { Logo } from '@/components/shared'
import { Hero, Features, HowItWorks, Pricing } from '@/components/landing'
import { AuthForm } from '@/components/auth'
import { AIDigest, UserMessage, VacancyResponse, InterviewLive, AnalyticsInline, ChatPanel } from '@/components/dashboard'
import {
  Zap, MessageSquare, Search, Briefcase, Mic, BarChart3, User,
  ArrowRight, Check, LogOut, Send,
} from 'lucide-react'
import type { View, DashboardMode } from '@/types'

// ============================================================
// LANDING PAGE
// ============================================================
function LandingPage({ onNavigate }: { onNavigate: (v: View) => void }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo />
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Возможности</a>
            <a href="#how" className="hover:text-foreground transition-colors">Как работает</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Тарифы</a>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={() => onNavigate('auth')}>Войти</Button>
            <Button size="sm" className="gradient-bg text-white border-0 hover:opacity-90" onClick={() => onNavigate('auth')}>
              Начать бесплатно
            </Button>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <Hero onNavigate={() => onNavigate('auth')} />
        <Features />
        <HowItWorks />
        <Pricing onNavigate={() => onNavigate('auth')} />
        <section className="py-20 sm:py-28">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Готов найти работу быстрее?</h2>
            <p className="text-lg text-muted-foreground mb-8">Присоединяйся к 5,000+ специалистов, которые уже используют AI-копилот</p>
            <Button size="lg" className="gradient-bg text-white border-0 hover:opacity-90 text-base px-10 h-12" onClick={() => onNavigate('auth')}>
              Начать бесплатно <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/50 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Logo size="sm" />
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Условия</a>
            <a href="#" className="hover:text-foreground transition-colors">Конфиденциальность</a>
            <a href="#" className="hover:text-foreground transition-colors">Поддержка</a>
          </div>
          <p className="text-xs text-muted-foreground">&copy; 2026 HH Job Copilot</p>
        </div>
      </footer>
    </div>
  )
}

// ============================================================
// AUTH PAGE
// ============================================================
function AuthPage({ onNavigate }: { onNavigate: (v: View) => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="ambient-glow w-[400px] h-[400px] bg-cyan -top-32 -right-32" />
      <div className="ambient-glow w-[300px] h-[300px] bg-purple -bottom-24 -left-24" style={{ animationDelay: '-8s' }} />
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="text-center mb-8">
          <Logo size="lg" />
          <p className="text-muted-foreground text-sm mt-1">Войдите в свой аккаунт</p>
        </div>
        <AuthForm onNavigate={() => onNavigate('dashboard')} />
        <div className="text-center mt-4">
          <ThemeToggle variant="ghost" size="sm" showLabel />
        </div>
      </div>
    </div>
  )
}

// ============================================================
// DASHBOARD — Conversational OS
// ============================================================
function Dashboard({ onNavigate }: { onNavigate: (v: View) => void }) {
  const [activeMode, setActiveMode] = useState<DashboardMode>('chat')
  const [inputValue, setInputValue] = useState('')
  const [showPanel, setShowPanel] = useState(true)

  const modes: Array<{ id: DashboardMode; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'chat', label: 'Чат', icon: MessageSquare },
    { id: 'search', label: 'Поиск', icon: Search },
    { id: 'vacancies', label: 'Вакансии', icon: Briefcase },
    { id: 'interview', label: 'Интервью', icon: Mic },
    { id: 'analytics', label: 'Аналитика', icon: BarChart3 },
  ]

  return (
    <div className="h-screen flex flex-col bg-background relative overflow-hidden">
      <div className="ambient-glow w-[500px] h-[500px] bg-cyan -top-48 -right-48" />
      <div className="ambient-glow w-[350px] h-[350px] bg-purple -bottom-32 -left-32" style={{ animationDelay: '-12s' }} />

      {/* Top Bar */}
      <header className="relative z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl shrink-0">
        <div className="px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Logo size="sm" />
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
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onNavigate('landing')}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex relative z-10 overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
            <div className="text-center pt-4 pb-2">
              <h2 className="text-2xl sm:text-3xl font-bold gradient-text">HH Job Copilot</h2>
              <p className="text-muted-foreground text-sm mt-1">Ваш AI-ассистент для поиска работы и прохождения интервью</p>
            </div>

            <AIDigest />
            <UserMessage text="Ответь Елене из Яндекса, что готов на собеседование завтра в 14:00. И покажи новые вакансии по React" />
            <VacancyResponse />
            <InterviewLive />
            <AnalyticsInline />

            <div className="h-24" />
          </div>
        </main>

        {showPanel && <ChatPanel onClose={() => setShowPanel(false)} />}
      </div>

      {/* Input Bar */}
      <div className="relative z-50 border-t border-border/50 bg-background/80 backdrop-blur-xl shrink-0">
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

// ============================================================
// MAIN ROUTER
// ============================================================
export default function Home() {
  const [view, setView] = useState<View>('landing')

  switch (view) {
    case 'landing':
      return <LandingPage onNavigate={setView} />
    case 'auth':
      return <AuthPage onNavigate={setView} />
    case 'dashboard':
      return <Dashboard onNavigate={setView} />
  }
}
