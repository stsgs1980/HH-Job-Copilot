'use client'

import { createContext, useContext, useCallback, useState, type ReactNode } from 'react'
import { useAIChat, type ChatMessage } from '@/hooks/use-ai-chat'
import { useASR } from '@/hooks/use-asr'
import { useFeatureFlag } from '@/hooks/use-feature-flag'

interface ChatContextValue {
  // AI Chat
  messages: ChatMessage[]
  sendMessage: (text: string) => Promise<void>
  isLoading: boolean
  streamingText: string
  error: string | null
  stopStreaming: () => void
  clearMessages: () => void

  // ASR
  isRecording: boolean
  isTranscribing: boolean
  transcript: string
  startRecording: () => Promise<void>
  stopRecording: () => Promise<void>
  isASRSupported: boolean

  // Input
  inputValue: string
  setInputValue: (v: string) => void
  handleSubmit: () => void
}

const ChatContext = createContext<ChatContextValue | null>(null)

export function ChatProvider({ children }: { children: ReactNode }) {
  const aiChat = useAIChat()
  const asr = useASR({ autoHint: true })
  const asrEnabled = useFeatureFlag('asr')
  const [inputValue, setInputValue] = useState('')

  const handleSubmit = useCallback(() => {
    const text = inputValue.trim()
    if (!text || aiChat.isLoading) return

    aiChat.sendMessage(text)
    setInputValue('')
  }, [inputValue, aiChat])

  const handleStartRecording = useCallback(async () => {
    if (!asrEnabled) return
    await asr.startRecording()
  }, [asrEnabled, asr])

  const handleStopRecording = useCallback(async () => {
    await asr.stopRecording()
    // If we got a transcript, send it as a message
    if (asr.transcript.trim()) {
      aiChat.sendMessage(asr.transcript.trim())
    }
  }, [asr, aiChat])

  return (
    <ChatContext.Provider
      value={{
        messages: aiChat.messages,
        sendMessage: aiChat.sendMessage,
        isLoading: aiChat.isLoading,
        streamingText: aiChat.streamingText,
        error: aiChat.error,
        stopStreaming: aiChat.stopStreaming,
        clearMessages: aiChat.clearMessages,

        isRecording: asr.isRecording,
        isTranscribing: asr.isTranscribing,
        transcript: asr.transcript,
        startRecording: handleStartRecording,
        stopRecording: handleStopRecording,
        isASRSupported: asr.isSupported,

        inputValue,
        setInputValue,
        handleSubmit,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChatContext() {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChatContext must be used within ChatProvider')
  return ctx
}
