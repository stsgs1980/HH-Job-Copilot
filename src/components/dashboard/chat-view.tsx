'use client'

import { useChatContext } from '@/contexts/chat-context'
import { useAnalytics } from '@/hooks/use-analytics'
import { useHHChat } from '@/hooks/use-hh-chat'
import { useFeatureFlag } from '@/hooks/use-feature-flag'
import { Zap, User, MessageSquare, Briefcase, Check, Building2, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { ChatMessage } from '@/hooks/use-ai-chat'

export function ChatView() {
  const chat = useChatContext()
  const { stats, weekChart, weekDays } = useAnalytics()
  const hhChat = useHHChat()
  const hhChatikEnabled = useFeatureFlag('hhChatik')

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Main chat area */}
      <main className="flex-1 overflow-y-auto" id="main-content">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">

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
                    <p className="text-sm font-semibold text-cyan mb-1">Copilot</p>
                    <div className="bg-muted/50 border border-border/30 rounded-2xl rounded-tl-sm p-4">
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
                    <p className="text-sm font-semibold text-cyan mb-1">Copilot</p>
                    <div className="bg-muted/50 border border-border/30 rounded-2xl rounded-tl-sm p-4">
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

          {/* Error */}
          {chat.error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400" role="alert">
              Ошибка: {chat.error}
            </div>
          )}

          {/* Empty state — digest */}
          {chat.messages.length === 0 && (
            <AIDigest
              stats={stats}
              weekChart={weekChart}
              weekDays={weekDays}
              chats={hhChat.chats}
            />
          )}

          <div className="h-24" />
        </div>
      </main>

      {/* HR Chat sidebar */}
      {hhChatikEnabled && (
        <aside className="hidden lg:flex flex-col w-[280px] border-l border-border/30 bg-background/80 backdrop-blur-xl shrink-0">
          <div className="px-3 py-2.5 border-b border-border/30">
            <span className="text-xs font-semibold flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-cyan" /> Чаты с HR
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {hhChat.isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-4 h-4 border-2 border-cyan border-t-transparent rounded-full animate-spin" />
              </div>
            ) : hhChat.chats.length === 0 ? (
              <div className="text-center py-8 text-xs text-muted-foreground">
                Нет чатов
              </div>
            ) : (
              hhChat.chats.map((c, i) => (
                <div key={i} className={`flex items-start gap-2 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-all ${c.unread ? 'bg-muted/30' : ''}`}>
                  <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                    {c.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium truncate">{c.name}</span>
                      <span className="text-[9px] text-muted-foreground">{c.time}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate">{c.preview}</p>
                  </div>
                  {c.unread && <div className="w-1.5 h-1.5 rounded-full bg-cyan shrink-0 mt-2" />}
                </div>
              ))
            )}
          </div>
        </aside>
      )}
    </div>
  )
}

/** AI Digest with real analytics data */
function AIDigest({
  stats,
  weekChart,
  weekDays,
  chats,
}: {
  stats: Array<{ value: string; label: string; color: string }>
  weekChart: number[]
  weekDays: string[]
  chats: Array<{ name: string; preview: string; time: string; unread: boolean; color: string }>
}) {
  const unreadChats = chats.filter(c => c.unread)

  return (
    <div className="flex gap-3">
      <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shrink-0">
        <Zap className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-cyan mb-1">Доброе утро!</p>
        <div className="bg-muted/30 border border-border/30 rounded-2xl rounded-tl-sm p-4 space-y-3">
          <p className="text-sm">Вот ваш дайджест за сегодня:</p>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2">
            {stats.map((s, i) => (
              <div key={i} className="bg-muted rounded-lg p-2 text-center">
                <div className={`text-base font-bold tabular-nums ${s.color}`}>{s.value}</div>
                <div className="text-[9px] text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Unread chats */}
          {unreadChats.length > 0 && (
            <div className="bg-muted/50 rounded-xl p-3 space-y-2">
              <span className="text-xs font-semibold flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-cyan" />
                {unreadChats.length} новых от HR
              </span>
              {unreadChats.slice(0, 3).map((c, i) => (
                <div key={i} className="flex items-center gap-2 text-[11px] py-1 border-b border-border/30 last:border-0">
                  <Building2 className="w-3 h-3 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground truncate">{c.name}: {c.preview}</span>
                </div>
              ))}
            </div>
          )}

          {/* Week chart */}
          <div className="bg-muted/50 rounded-xl p-3 space-y-2">
            <span className="text-xs font-semibold flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-emerald" /> За неделю
            </span>
            <div className="flex items-end gap-1 h-14 px-1">
              {weekChart.map((h, i) => (
                <div key={i} className="flex-1 rounded-t-sm transition-all duration-300" style={{
                  height: `${Math.max(h * 5, 4)}%`,
                  background: h > 0 ? (i >= 5 ? '#4ade80' : i === 3 ? '#a78bfa' : '#22d3ee') : '#333',
                  opacity: h > 0 ? 0.7 + (h / 400) : 0.3,
                }} />
              ))}
            </div>
            <div className="flex justify-between text-[9px] text-muted-foreground px-1">
              {weekDays.map(d => <span key={d}>{d}</span>)}
            </div>
          </div>

          {/* Quick commands */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: 'Найди вакансии', cmd: 'Найди вакансии по React' },
              { label: 'Статистика', cmd: 'Покажи статистику' },
              { label: 'Ответить HR', cmd: 'Ответь всем HR' },
            ].map(q => (
              <button
                key={q.label}
                className="px-2.5 py-1 text-[10px] rounded-lg bg-muted text-muted-foreground hover:text-cyan transition-all"
                onClick={() => {
                  const event = new CustomEvent('ai-command', { detail: q.cmd })
                  window.dispatchEvent(event)
                }}
              >
                {q.label}
              </button>
            ))}
          </div>
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
        <div className="bg-muted border border-border/30 rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[80%]">
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
        <p className="text-sm font-semibold text-cyan mb-1">Copilot</p>
        <div className="bg-muted/30 border border-border/30 rounded-2xl rounded-tl-sm p-4">
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
        <span className="text-[10px] text-muted-foreground mt-1 inline-block">
          {new Date(message.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  )
}
