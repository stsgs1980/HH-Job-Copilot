'use client'

import { useState, useCallback, useRef } from 'react'
import { isFeatureEnabled } from '@/lib/feature-flags'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
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

      // Build messages payload for API
      const apiMessages = [...messages, userMsg].map(m => ({
        role: m.role === 'user' ? 'user' as const : 'assistant' as const,
        content: m.content,
      }))

      try {
        if (streamingEnabled) {
          // ---- SSE Streaming mode ----
          abortRef.current = new AbortController()
          const res = await fetch('/api/ai/chat/stream', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: apiMessages, source: 'chat' }),
            signal: abortRef.current.signal,
          })

          if (!res.ok) {
            throw new Error(`Stream error: ${res.status}`)
          }

          const reader = res.body?.getReader()
          if (!reader) throw new Error('No readable stream')

          const decoder = new TextDecoder()
          let fullText = ''
          let buffer = ''

          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })

            // Parse SSE events from buffer
            const lines = buffer.split('\n')
            buffer = lines.pop() ?? '' // Keep incomplete line in buffer

            for (const line of lines) {
              const trimmed = line.trim()
              if (!trimmed || !trimmed.startsWith('data: ')) continue

              const data = trimmed.slice(6) // Remove "data: " prefix

              if (data === '[DONE]') continue

              try {
                const parsed = JSON.parse(data) as { content: string }
                fullText += parsed.content
                setStreamingText(fullText)
              } catch {
                // Ignore malformed JSON chunks
              }
            }
          }

          // Finalize — add assistant message
          const assistantMsg: ChatMessage = {
            id: nextId(),
            role: 'assistant',
            content: fullText,
            timestamp: Date.now(),
          }
          setMessages(prev => [...prev, assistantMsg])
          setStreamingText('')
        } else if (aiChatEnabled) {
          // ---- Regular fetch mode ----
          const res = await fetch('/api/ai/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: apiMessages, source: 'chat' }),
          })

          if (!res.ok) {
            throw new Error(`API error: ${res.status}`)
          }

          const data = await res.json()
          const responseText = data.response ?? data.hint ?? ''

          const assistantMsg: ChatMessage = {
            id: nextId(),
            role: 'assistant',
            content: responseText,
            timestamp: Date.now(),
          }
          setMessages(prev => [...prev, assistantMsg])
        } else {
          // ---- AI Chat disabled — mock response ----
          const mockResponses: Record<string, string> = {
            default: 'Я пока работаю в демо-режиме. Включите AI Chat для реальных ответов.',
          }
          const responseText = mockResponses.default

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
    [messages, streamingEnabled, aiChatEnabled],
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
  }, [])

  return {
    messages,
    sendMessage,
    isLoading,
    error,
    streamingText,
    stopStreaming,
    clearMessages,
  }
}
