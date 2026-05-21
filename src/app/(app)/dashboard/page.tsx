'use client'

import { useState } from 'react'
import { AIDigest, UserMessage, VacancyResponse, InterviewLive, AnalyticsInline, ChatPanel, SkeletonAIDigest, SkeletonVacancyResponse, SkeletonInterviewLive, SkeletonAnalyticsInline, SkeletonChatPanel, SkeletonChatMessage } from '@/components/dashboard'
import { useChatContext } from '@/contexts/chat-context'
import { useHHChat } from '@/hooks/use-hh-chat'
import { useFeatureFlag } from '@/hooks/use-feature-flag'
import { Zap, User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { ChatMessage } from '@/hooks/use-ai-chat'

export default function DashboardPage() {
  const [showPanel, setShowPanel] = useState(true)
  const chat = useChatContext()
  const hhChat = useHHChat()
  const hhChatikEnabled = useFeatureFlag('hhChatik')

  return (
    <>
      <main className="flex-1 overflow-y-auto">
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
              {/* Streaming text indicator */}
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
              {/* Loading indicator (non-streaming) */}
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
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-bounce" style={{ animationDelay: '150ms' }} />
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
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">
              Ошибка: {chat.error}
            </div>
          )}

          {/* When no chat messages, show skeleton or default dashboard view */}
          {chat.messages.length === 0 && hhChat.isLoading && (
            <div className="space-y-6">
              <SkeletonAIDigest />
              <SkeletonChatMessage role="user" />
              <SkeletonVacancyResponse />
              <SkeletonInterviewLive />
              <SkeletonAnalyticsInline />
            </div>
          )}
          {chat.messages.length === 0 && !hhChat.isLoading && (
            <>
              <AIDigest />
              <UserMessage text="Ответь Елене из Яндекса, что готов на собеседование завтра в 14:00. И покажи новые вакансии по React" />
              <VacancyResponse />
              <InterviewLive />
              <AnalyticsInline />
            </>
          )}

          <div className="h-24" />
        </div>
      </main>

      {showPanel && hhChat.isLoading && <SkeletonChatPanel />}
      {showPanel && !hhChat.isLoading && <ChatPanel onClose={() => setShowPanel(false)} chats={hhChat.chats} isLoading={hhChat.isLoading} />}
    </>
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
