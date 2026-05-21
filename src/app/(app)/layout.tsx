'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ThemeToggle, Logo } from '@/components/shared'
import { ChatProvider, useChatContext } from '@/contexts/chat-context'
import { DashboardModeProvider, useDashboardMode } from '@/contexts/dashboard-mode-context'
import { useFeatureFlag } from '@/hooks/use-feature-flag'
import { useAnalytics } from '@/hooks/use-analytics'
import { useProfile } from '@/hooks/use-profile'
import {
  Zap, MessageSquare, Search, Briefcase, Mic, BarChart3, Check, LogOut, Send,
  Square, MicOff, Settings, ArrowLeft, Home,
} from 'lucide-react'
import type { DashboardMode } from '@/types'

const modes: Array<{ id: DashboardMode; label: string; icon: React.ComponentType<{ className?: string }>; shortLabel: string }> = [
  { id: 'chat', label: 'AI Ассистент', icon: MessageSquare, shortLabel: 'Чат' },
  { id: 'search', label: 'Поиск вакансий', icon: Search, shortLabel: 'Поиск' },
  { id: 'vacancies', label: 'Мои отклики', icon: Briefcase, shortLabel: 'Отклики' },
  { id: 'interview', label: 'Интервью', icon: Mic, shortLabel: 'Интервью' },
  { id: 'analytics', label: 'Аналитика', icon: BarChart3, shortLabel: 'Стат' },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardModeProvider>
      <ChatProvider>
        <AppShell>{children}</AppShell>
      </ChatProvider>
    </DashboardModeProvider>
  )
}

function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { activeMode, setActiveMode } = useDashboardMode()
  const chat = useChatContext()
  const asrEnabled = useFeatureFlag('asr')
  const { stats } = useAnalytics()
  const { profile } = useProfile()

  const отклики = stats.find(s => s.label === 'Отклики')?.value ?? '0'
  const приглашения = stats.find(s => s.label === 'Приглашения')?.value ?? '0'

  // Find current mode config
  const currentMode = modes.find(m => m.id === activeMode)

  // Determine if we're on a sub-page (settings, onboarding)
  const isSubPage = pathname !== '/dashboard'
  const isChatMode = activeMode === 'chat'

  return (
    <div className="h-screen flex flex-col bg-background relative overflow-hidden">
      {/* ── TOP BAR ── */}
      <header className="relative z-50 glass-nav shrink-0 border-b border-border/30" role="banner">
        <div className="px-4 sm:px-6 h-12 flex items-center justify-between gap-3">
          {/* Left: Back / Logo / Breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            {isSubPage ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 text-muted-foreground hover:text-foreground shrink-0"
                onClick={() => router.push('/dashboard')}
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Назад</span>
              </Button>
            ) : (
              <>
                <Link href="/" aria-label="На главную" className="shrink-0">
                  <Logo size="sm" />
                </Link>
                {/* Breadcrumb: show current section */}
                {currentMode && (
                  <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground min-w-0">
                    <Chevron className="w-3 h-3 shrink-0" />
                    <span className="truncate font-medium text-foreground">{currentMode.label}</span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Center: Desktop tabs (only on dashboard) */}
          {!isSubPage && (
            <nav className="hidden md:flex gap-0.5 bg-muted/40 rounded-lg p-0.5" role="tablist" aria-label="Разделы">
              {modes.map(m => (
                <button
                  key={m.id}
                  role="tab"
                  aria-selected={activeMode === m.id}
                  onClick={() => setActiveMode(m.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    activeMode === m.id
                      ? 'bg-background shadow-sm text-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                  }`}
                >
                  <m.icon className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">{m.shortLabel}</span>
                </button>
              ))}
            </nav>
          )}

          {/* Right: Stats + Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Mini stats */}
            <div className="hidden lg:flex items-center gap-2 text-[11px]">
              <span className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-md">
                <Zap className="w-3 h-3 text-cyan" />
                <span className="font-semibold tabular-nums">{отклики}</span>
              </span>
              <span className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-md">
                <Check className="w-3 h-3 text-emerald" />
                <span className="font-semibold tabular-nums">{приглашения}</span>
              </span>
            </div>

            {/* User avatar */}
            <button
              onClick={() => router.push('/settings')}
              className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center text-xs font-bold text-white shrink-0 hover:opacity-90 transition-opacity"
              aria-label="Настройки профиля"
            >
              {(profile?.name || 'С')[0].toUpperCase()}
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex relative z-10 overflow-hidden">
        {children}
      </div>

      {/* ── CHAT INPUT BAR (only chat mode on dashboard) ── */}
      {!isSubPage && isChatMode && (
        <div className="relative z-50 glass-nav shrink-0 border-t border-border/30">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3">
            <div className="flex items-center gap-2 bg-muted/30 rounded-xl px-4 py-2 border border-border/30 focus-within:border-cyan/30 focus-within:ring-1 focus-within:ring-cyan/20 transition-all">
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
                placeholder={chat.isRecording ? 'Слушаю...' : 'Спросите что угодно...'}
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
                    <Mic className={`w-4 h-4 ${asrEnabled ? 'text-emerald' : 'text-muted-foreground/50'}`} />
                  </Button>
                )}
              </div>
            </div>
            <p className="text-center text-[10px] text-muted-foreground/60 mt-1.5">
              {chat.isRecording ? (
                <span className="text-red-400 flex items-center justify-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" /> Запись...
                </span>
              ) : (
                'AI может ошибаться. Проверяйте важную информацию.'
              )}
            </p>
          </div>
        </div>
      )}

      {/* ── MOBILE BOTTOM NAV (only on dashboard) ── */}
      {!isSubPage && (
        <nav
          className="md:hidden relative z-50 glass-nav shrink-0 border-t border-border/30 safe-area-bottom"
          role="tablist"
          aria-label="Навигация"
        >
          <div className="flex items-center justify-around px-2 py-1.5">
            {modes.map(m => (
              <button
                key={m.id}
                role="tab"
                aria-selected={activeMode === m.id}
                onClick={() => setActiveMode(m.id)}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-medium transition-all min-w-0 ${
                  activeMode === m.id
                    ? 'text-cyan'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <m.icon className="w-5 h-5" />
                <span>{m.shortLabel}</span>
              </button>
            ))}
          </div>
        </nav>
      )}
    </div>
  )
}

/** Tiny chevron for breadcrumbs */
function Chevron({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}
