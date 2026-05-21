'use client'

import { useState, useCallback, useRef } from 'react'
import { isFeatureEnabled } from '@/lib/feature-flags'

export type InterviewStatus = 'idle' | 'scheduled' | 'in-progress' | 'completed'

export interface InterviewState {
  status: InterviewStatus
  currentHint: string | null
  transcript: Array<{ speaker: 'interviewer' | 'you'; text: string }>
  isListening: boolean
}

const MOCK_HINT = 'Работаю с React 5+ лет, с Next.js — 3 года. В последнем проекте реализовал SSR для e-commerce (500k+ MAU), настроил ISR для каталога, интегрировал middleware для A/B тестирования.'

const MOCK_TRANSCRIPT: Array<{ speaker: 'interviewer' | 'you'; text: string }> = [
  { speaker: 'interviewer', text: 'Здравствуйте! Расскажите о вашем опыте работы с React и Next.js?' },
  { speaker: 'you', text: 'Работаю с React уже более 5 лет...' },
]

async function fetchHintAPI(question: string): Promise<string> {
  const res = await fetch('/api/ai/interview-hint', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question,
      resumeContext: 'Senior Frontend Developer, 5+ лет React, 3 года Next.js',
      userId: 'mock-user-001',
    }),
  })
  if (!res.ok) throw new Error('Failed to get interview hint')
  const data = await res.json()
  return data.hint ?? ''
}

export function useInterview() {
  const asrEnabled = isFeatureEnabled('asr')
  const [state, setState] = useState<InterviewState>({
    status: 'idle',
    currentHint: null,
    transcript: [],
    isListening: false,
  })
  const abortRef = useRef<AbortController | null>(null)

  const startInterview = useCallback(() => {
    setState({
      status: 'in-progress',
      currentHint: asrEnabled ? null : MOCK_HINT,
      transcript: asrEnabled ? [] : MOCK_TRANSCRIPT,
      isListening: asrEnabled,
    })
  }, [asrEnabled])

  const stopInterview = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort()
      abortRef.current = null
    }
    setState(prev => ({
      ...prev,
      status: 'completed',
      isListening: false,
    }))
  }, [])

  /** Submit an interviewer question to get an AI hint */
  const submitQuestion = useCallback(
    async (question: string) => {
      if (!question.trim()) return

      setState(prev => ({
        ...prev,
        transcript: [...prev.transcript, { speaker: 'interviewer', text: question }],
      }))

      if (asrEnabled) {
        try {
          abortRef.current = new AbortController()
          const hint = await fetchHintAPI(question)
          setState(prev => ({
            ...prev,
            currentHint: hint,
          }))
        } catch (err) {
          if (err instanceof DOMException && err.name === 'AbortError') return
          console.error('Failed to get interview hint:', err)
          setState(prev => ({
            ...prev,
            currentHint: 'Не удалось получить подсказку. Попробуйте ещё раз.',
          }))
        }
      } else {
        // Mock mode — already set the mock hint
        setState(prev => ({
          ...prev,
          currentHint: MOCK_HINT,
        }))
      }
    },
    [asrEnabled],
  )

  /** Add a "you" transcript line */
  const addUserResponse = useCallback((text: string) => {
    setState(prev => ({
      ...prev,
      transcript: [...prev.transcript, { speaker: 'you', text }],
    }))
  }, [])

  /** Reset to idle */
  const resetInterview = useCallback(() => {
    setState({
      status: 'idle',
      currentHint: null,
      transcript: [],
      isListening: false,
    })
  }, [])

  return {
    status: state.status,
    currentHint: state.currentHint,
    transcript: state.transcript,
    isListening: state.isListening,
    startInterview,
    stopInterview,
    submitQuestion,
    addUserResponse,
    resetInterview,
  }
}
