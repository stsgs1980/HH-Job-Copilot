'use client'

import { useState, useCallback } from 'react'
import { useChatContext } from '@/contexts/chat-context'
import { useAnalytics } from '@/hooks/use-analytics'
import { useHHChat } from '@/hooks/use-hh-chat'
import { useFeatureFlag } from '@/hooks/use-feature-flag'
import { Zap, User, MessageSquare, Briefcase, Check, Building2, ChevronRight, X, Send, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { ChatMessage } from '@/hooks/use-ai-chat'

export function ChatView() {
  const chat = useChatContext()
  const { stats, weekChart, weekDays } = useAnalytics()
  const hhChat = useHHChat()
  const hhChatikEnabled = useFeatureFlag('hhChatik')
  const [showChatPanel, setShowChatPanel] = useState(true)

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Main chat area */}
      <main className="flex-1 overflow-y-auto" id="main-content">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          <div className="text-center pt-4 pb-2">
            <h2 className="text-2xl sm:text-3xl font-bold gradient-text">HH Job Copilot</h2>
            <p className="text-muted-foreground text-sm mt-1">Ваш AI-ассистент для поиска работы и прохождения интервью</p>
          </div>

          {/* AI Chat messages */}
          {chat.messages.length > 0 && (
            <div className="space-y-4">
              {chat.messages.map((msg: ChatMessage) => (
                <ChatMessageBubble key={msg.id} message={msg} />
              ))}
              {chat.isLoading && chat.streamingText && (
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-cyan mb-1">HH Job Copilot</p>
                    <div className="glass-card rounded-2xl rounded-tl-sm p-4">
                      <p className="text-sm">{chat.streamingText}<span className="inline-block w-1.5 h-4 bg-cyan animate-pulse ml-0.5 align-middle" /></p>
                    </div>
                  </div>
                </div>
              )}
              {chat.isLoading && !chat.streamingText && (
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4 text-white animate-pulse" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-cyan mb-1">HH Job Copilot</p>
                    <div className="glass-card rounded-2xl rounded-tl-sm p-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-purple animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        Думаю...
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Error state */}
          {chat.error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400" role="alert">
              Ошибка: {chat.error}
            </div>
          )}

          {/* When no chat messages, show digest with REAL data */}
          {chat.messages.length === 0 && (
            <AIDigestReal
              stats={stats}
              weekChart={weekChart}
              weekDays={weekDays}
              chats={hhChat.chats}
              hhChatikEnabled={hhChatikEnabled}
            />
          )}

          <div className="h-24" />
        </div>
      </main>

      {/* Chat Panel — real data from DB */}
      {showChatPanel && (
        <aside className="hidden lg:flex flex-col w-[300px] border-l border-border/50 bg-background/80 backdrop-blur-xl shrink-0">
          <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
            <span className="text-sm font-semibold flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-cyan" /> Чаты с HR
            </span>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowChatPanel(false)}>
              <X className="w-3 h-3" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {hhChat.isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-4 h-4 border-2 border-cyan border-t-transparent rounded-full animate-spin" />
              </div>
            ) : hhChat.chats.length === 0 ? (
              <div className="text-center py-8 text-xs text-muted-foreground">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
                Нет чатов
              </div>
            ) : (
              hhChat.chats.map((c, i) => (
                <ChatListItem key={i} chat={c} onSend={hhChat.sendMessage} />
              ))
            )}
          </div>
          {/* Profile card */}
          <div className="border-t border-border/50 p-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold">Сергей Т.</p>
                <p className="text-[10px] text-muted-foreground">Pro тариф</p>
              </div>
              <div className="flex items-center gap-1 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[9px] font-medium text-emerald-400">7 дней</span>
              </div>
            </div>
          </div>
        </aside>
      )}
    </div>
  )
}

/** Chat list item with AI reply button */
function ChatListItem({
  chat,
  onSend,
}: {
  chat: { name: string; preview: string; time: string; unread: boolean; color: string }
  onSend: (chatId: string, text: string) => void
}) {
  const [aiReplying, setAiReplying] = useState(false)

  const handleAIReply = useCallback(async () => {
    setAiReplying(true)
    try {
      const res = await fetch('/api/ai/hr-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employerMessage: chat.preview,
          company: chat.name.split(' — ')[0] || chat.name,
          vacancyTitle: chat.name.split(' — ')[1] || '',
          userId: 'mock-user-001',
        }),
      })
      if (res.ok) {
        const data = await res.json()
        // For now, just send via the hhChat hook (will use mock if HH not enabled)
        // In production, this would auto-send via Chatik API
        console.log('AI Reply generated:', data.humanizedReply ?? data.rawReply)
      }
    } catch {
      // Silently fail
    }
    setAiReplying(false)
  }, [chat])

  return (
    <div className={`flex items-start gap-2 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-all ${chat.unread ? 'bg-muted/30' : ''}`}>
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 ${chat.color}`}>
        {chat.name.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium truncate">{chat.name}</span>
          <span className="text-[9px] text-muted-foreground">{chat.time}</span>
        </div>
        <p className="text-[10px] text-muted-foreground truncate">{chat.preview}</p>
        {chat.unread && (
          <button
            onClick={handleAIReply}
            disabled={aiReplying}
            className="mt-1 flex items-center gap-1 text-[9px] text-cyan hover:text-cyan/80 transition-colors"
          >
            <Sparkles className="w-2.5 h-2.5" />
            {aiReplying ? 'Генерирую...' : 'AI-ответ'}
          </button>
        )}
      </div>
      {chat.unread && <div className="w-1.5 h-1.5 rounded-full bg-cyan shrink-0 mt-2" />}
    </div>
  )
}

/** AI Digest with real analytics data */
function AIDigestReal({
  stats,
  weekChart,
  weekDays,
  chats,
  hhChatikEnabled,
}: {
  stats: Array<{ value: string; label: string; color: string }>
  weekChart: number[]
  weekDays: string[]
  chats: Array<{ name: string; preview: string; time: string; unread: boolean; color: string }>
  hhChatikEnabled: boolean
}) {
  const unreadChats = chats.filter(c => c.unread)

  return (
    <div className="flex gap-3">
      <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shrink-0">
        <Zap className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-cyan mb-1">HH Job Copilot</p>
        <div className="glass-card rounded-2xl rounded-tl-sm p-4 space-y-3">
          <p className="text-sm">Доброе утро! Вот ваш дайджест за сегодня:</p>

          {/* Real Stats from API */}
          <div className="grid grid-cols-4 gap-2">
            {stats.map((s, i) => (
              <div key={i} className="bg-muted rounded-lg p-2.5 text-center hover-glow cursor-default">
                <div className={`text-lg font-bold tabular-nums ${s.color}`}>{s.value}</div>
                <div className="text-[10px] text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Chat messages */}
          {unreadChats.length > 0 && (
            <div className="bg-muted/50 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-cyan" />
                  {unreadChats.length} новых сообщения
                </span>
              </div>
              {unreadChats.map((c, i) => (
                <div key={i} className="flex items-center gap-2 text-xs py-1.5 border-b border-border/50 last:border-0">
                  <div className="w-6 h-6 rounded bg-muted flex items-center justify-center">
                    <Building2 className="w-3 h-3 text-muted-foreground" />
                  </div>
                  <span className="text-muted-foreground truncate flex-1">{c.name}: {c.preview}</span>
                </div>
              ))}
            </div>
          )}

          {/* Mini week chart */}
          <div className="bg-muted/50 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-emerald" /> Отклики за неделю
              </span>
            </div>
            <div className="flex items-end gap-1 h-16 px-1">
              {weekChart.map((h, i) => (
                <div key={i} className="flex-1 rounded-t-sm transition-all duration-300" style={{
                  height: `${Math.max(h * 5, 4)}%`,
                  background: h > 0 ? (i >= 5 ? '#4ade80' : i === 3 ? '#a78bfa' : '#22d3ee') : '#444',
                  opacity: h > 0 ? 0.7 + (h / 400) : 0.3,
                }} />
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground px-1">
              {weekDays.map(d => <span key={d}>{d}</span>)}
            </div>
          </div>

          {/* Quick commands */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: 'Найди вакансии', cmd: 'Найди вакансии по React' },
              { label: 'Статистика', cmd: 'Покажи мою статистику' },
              { label: 'Ответить HR', cmd: 'Ответь всем HR' },
            ].map(q => (
              <button
                key={q.label}
                className="px-2.5 py-1 text-[10px] rounded-lg glass-card text-muted-foreground hover:text-cyan hover-glow transition-all"
                onClick={() => {
                  // This will be picked up by the chat input
                  const event = new CustomEvent('ai-command', { detail: q.cmd })
                  window.dispatchEvent(event)
                }}
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[10px] text-muted-foreground">
            {new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
          </span>
          <Badge variant="secondary" className="text-[10px] h-4 gap-1 bg-cyan/10 text-cyan border-0">
            <Zap className="w-2.5 h-2.5" /> Live
          </Badge>
        </div>
      </div>
    </div>
  )
}

/** Single chat message bubble */
function ChatMessageBubble({ message }: { message: ChatMessage }) {
  if (message.role === 'user') {
    return (
      <div className="flex gap-3 flex-row-reverse">
        <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
          <User className="w-4 h-4 text-foreground" />
        </div>
        <div className="bg-muted border border-border rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[80%]">
          <p className="text-sm">{message.content}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-3">
      <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shrink-0">
        <Zap className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-cyan mb-1">HH Job Copilot</p>
        <div className="glass-card rounded-2xl rounded-tl-sm p-4">
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[10px] text-muted-foreground">
            {new Date(message.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
          </span>
          <Badge variant="secondary" className="text-[10px] h-4 gap-1 bg-cyan/10 text-cyan border-0">
            <Zap className="w-2.5 h-2.5" /> AI
          </Badge>
        </div>
      </div>
    </div>
  )
}
