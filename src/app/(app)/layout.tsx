'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ThemeToggle, Logo } from '@/components/shared'
import { ChatProvider, useChatContext } from '@/contexts/chat-context'
import { useFeatureFlag } from '@/hooks/use-feature-flag'
import {
  Zap, MessageSquare, Search, Briefcase, Mic, BarChart3, Check, LogOut, Send,
  Square, MicOff,
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
  return (
    <ChatProvider>
      <AppShell>{children}</AppShell>
    </ChatProvider>
  )
}

function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [activeMode, setActiveMode] = useState<DashboardMode>('chat')
  const chat = useChatContext()
  const asrEnabled = useFeatureFlag('asr')

  return (
    <div className="h-screen flex flex-col bg-background relative overflow-hidden">
      {/* NEURO: Ambient glow — larger, better positioned */}
      <div className="ambient-glow w-[600px] h-[600px] bg-cyan -top-64 -right-64" aria-hidden="true" />
      <div className="ambient-glow w-[400px] h-[400px] bg-purple -bottom-40 -left-40" style={{ animationDelay: '-12s' }} aria-hidden="true" />

      {/* NEURO: Dot pattern in background */}
      <div className="dot-pattern top-20 right-20 opacity-20" aria-hidden="true" />

      {/* Top Bar — glass nav */}
      <header className="relative z-50 glass-nav shrink-0" role="banner">
        <div className="px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" aria-label="HH Job Copilot — главная">
              <Logo size="sm" />
            </Link>
            <span className="font-bold text-sm hidden sm:inline">HH Job Copilot</span>
            <nav className="hidden md:flex gap-1 glass-card rounded-xl p-1" role="tablist" aria-label="Режимы дашборда">
              {modes.map(m => (
                <button
                  key={m.id}
                  role="tab"
                  aria-selected={activeMode === m.id}
                  onClick={() => setActiveMode(m.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
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
              <span className="flex items-center gap-1.5 glass-card px-2.5 py-1 rounded-lg">
                <Zap className="w-3 h-3 text-cyan" />
                <span className="font-semibold tabular-nums">47</span> откликов
              </span>
              <span className="flex items-center gap-1.5 glass-card px-2.5 py-1 rounded-lg">
                <Check className="w-3 h-3 text-emerald" />
                <span className="font-semibold tabular-nums">8</span> приглашений
              </span>
              <span className="flex items-center gap-1.5 glass-card px-2.5 py-1 rounded-lg">
                <MessageSquare className="w-3 h-3 text-purple" />
                <span className="font-semibold tabular-nums">5</span> чатов
              </span>
            </div>
            <ThemeToggle size="icon" className="h-8 w-8" />
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.push('/')} aria-label="Выйти">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex relative z-10 overflow-hidden">
        {children}
      </div>

      {/* Input Bar — glass nav style */}
      <div className="relative z-50 glass-nav shrink-0">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center gap-2 glass-card rounded-xl px-4 py-2">
            {chat.isLoading ? (
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-red-400 hover:text-red-300" onClick={chat.stopStreaming} aria-label="Остановить">
                <Square className="w-4 h-4" />
              </Button>
            ) : (
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={chat.handleSubmit} disabled={!chat.inputValue.trim()} aria-label="Отправить">
                <Send className="w-4 h-4" />
              </Button>
            )}
            <input
              value={chat.inputValue}
              onChange={e => chat.setInputValue(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); chat.handleSubmit() } }}
              placeholder={chat.isRecording ? 'Слушаю...' : 'Спросите что угодно или дайте команду...'}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              aria-label="Ввод сообщения"
            />
            <div className="flex items-center gap-1">
              {chat.isRecording ? (
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300" onClick={chat.stopRecording} aria-label="Остановить запись">
                  <MicOff className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={asrEnabled ? chat.startRecording : undefined}
                  title={asrEnabled ? 'Голосовой ввод' : 'Скоро'}
                  aria-label={asrEnabled ? 'Голосовой ввод' : 'Голосовой ввод скоро'}
                >
                  <Mic className={`w-4 h-4 ${asrEnabled ? 'text-emerald' : 'text-muted-foreground'}`} />
                  {chat.isRecording && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-400 animate-pulse-dot" />}
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => { chat.setInputValue('Найди вакансии по '); }}
                title="Поиск вакансий"
                aria-label="Поиск вакансий"
              >
                <Briefcase className="w-4 h-4 text-cyan" />
              </Button>
            </div>
          </div>
          <p className="text-center text-[10px] text-muted-foreground mt-2">
            {chat.isRecording ? (
              <span className="text-red-400 flex items-center justify-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse-dot" /> Запись...
              </span>
            ) : (
              'HH Job Copilot может ошибаться. Проверяйте важную информацию.'
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
