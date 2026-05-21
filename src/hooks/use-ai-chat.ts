'use client'

import { useState, useCallback, useRef } from 'react'
import { isFeatureEnabled } from '@/lib/feature-flags'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  /** If this message triggered an action */
  action?: string | null
  actionData?: Record<string, string> | null
}

let msgCounter = 0
function nextId(): string {
  msgCounter += 1
  return `msg-${Date.now()}-${msgCounter}`
}

export function useAIChat() {
  const streamingEnabled = isFeatureEnabled('aiStreaming')
  const aiChatEnabled = isFeatureEnabled('aiChat')

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [lastAction, setLastAction] = useState<{ type: string; data: Record<string, string> } | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return

      // Add user message
      const userMsg: ChatMessage = {
        id: nextId(),
        role: 'user',
        content: text.trim(),
        timestamp: Date.now(),
      }
      setMessages(prev => [...prev, userMsg])
      setIsLoading(true)
      setError(null)
      setStreamingText('')

      try {
        if (aiChatEnabled) {
          // ---- Context-aware command mode ----
          // First message uses /api/ai/command for context-aware responses
          // Falls back to regular chat for conversation continuity
          const isCommandLike = /^(найди|поиск|искать|отклик|ответь|создай|интервью|подскаж|стат|анал|сколько|покажи|список|чат|сообщен)/i.test(text.trim())

          if (isCommandLike || messages.length === 0) {
            // Use command API — context-aware
            const res = await fetch('/api/ai/command', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ message: text.trim(), userId: 'mock-user-001' }),
            })

            if (!res.ok) {
              throw new Error(`Command API error: ${res.status}`)
            }

            const data = await res.json()
            const responseText = data.response ?? ''

            if (data.action && data.actionData) {
              setLastAction({ type: data.action, data: data.actionData })
            }

            const assistantMsg: ChatMessage = {
              id: nextId(),
              role: 'assistant',
              content: responseText,
              timestamp: Date.now(),
              action: data.action ?? null,
              actionData: data.actionData ?? null,
            }
            setMessages(prev => [...prev, assistantMsg])
          } else {
            // Use regular chat API for follow-up conversation
            const apiMessages = [...messages, userMsg].map(m => ({
              role: m.role === 'user' ? 'user' as const : 'assistant' as const,
              content: m.content,
            }))

            const res = await fetch('/api/ai/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ messages: apiMessages, source: 'chat' }),
            })

            if (!res.ok) {
              throw new Error(`API error: ${res.status}`)
            }

            const data = await res.json()
            const responseText = data.response ?? ''

            const assistantMsg: ChatMessage = {
              id: nextId(),
              role: 'assistant',
              content: responseText,
              timestamp: Date.now(),
            }
            setMessages(prev => [...prev, assistantMsg])
          }
        } else {
          // ---- AI Chat disabled — mock response ----
          const responseText = 'Я пока работаю в демо-режиме. Включите AI Chat для реальных ответов.'

          const assistantMsg: ChatMessage = {
            id: nextId(),
            role: 'assistant',
            content: responseText,
            timestamp: Date.now(),
          }
          setMessages(prev => [...prev, assistantMsg])
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return
        const message = err instanceof Error ? err.message : 'Unknown error'
        setError(message)
      } finally {
        setIsLoading(false)
        setStreamingText('')
      }
    },
    [messages, aiChatEnabled],
  )

  /** Stop the current streaming response */
  const stopStreaming = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort()
      abortRef.current = null
    }
    setIsLoading(false)
  }, [])

  /** Clear all messages */
  const clearMessages = useCallback(() => {
    setMessages([])
    setStreamingText('')
    setError(null)
    setLastAction(null)
  }, [])

  return {
    messages,
    sendMessage,
    isLoading,
    error,
    streamingText,
    stopStreaming,
    clearMessages,
    lastAction,
  }
}
