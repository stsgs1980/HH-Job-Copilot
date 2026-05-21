'use client'

import { useState, useCallback } from 'react'
import { Zap, Mic, MicOff, Volume2, VolumeX, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useASR } from '@/hooks/use-asr'
import { useTTS } from '@/hooks/use-tts'
import { isFeatureEnabled } from '@/lib/feature-flags'

// Mock interview data for demo
const MOCK_INTERVIEW = {
  company: 'Яндекс',
  position: 'Senior Frontend',
  interviewerQuestion: 'Здравствуйте! Расскажите о вашем опыте работы с React и Next.js?',
  mockHint: 'Работаю с React 5+ лет, с Next.js — 3 года. В последнем проекте реализовал SSR для e-commerce (500k+ MAU), настроил ISR для каталога, интегрировал middleware для A/B тестирования.',
}

export function InterviewLive() {
  const asrEnabled = isFeatureEnabled('asr')
  const ttsEnabled = isFeatureEnabled('tts')

  const [aiHint, setAiHint] = useState<string | null>(null)
  const [isHintLoading, setIsHintLoading] = useState(false)

  const {
    isRecording,
    transcript,
    fullTranscript,
    startRecording,
    stopRecording,
    error: asrError,
    isSupported: asrSupported,
    isTranscribing,
  } = useASR({
    interviewId: 'mock-interview-001',
    autoHint: false, // We handle hint generation manually to show loading state
  })

  const {
    speak: speakHint,
    stop: stopSpeaking,
    isSpeaking,
    error: ttsError,
  } = useTTS({
    interviewId: 'mock-interview-001',
  })

  // Handle mic toggle
  const handleMicToggle = useCallback(async () => {
    if (isRecording) {
      await stopRecording()
    } else {
      await startRecording()
    }
  }, [isRecording, startRecording, stopRecording])

  // When we get a new transcript, request an AI hint
  const handleGetHint = useCallback(async (question: string) => {
    if (!question.trim()) return

    setIsHintLoading(true)
    try {
      const response = await fetch('/api/ai/interview-hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interviewId: 'mock-interview-001',
          question,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setAiHint(data.hint)
      } else {
        // Fallback to mock hint
        setAiHint(MOCK_INTERVIEW.mockHint)
      }
    } catch {
      // Fallback to mock hint on error
      setAiHint(MOCK_INTERVIEW.mockHint)
    } finally {
      setIsHintLoading(false)
    }
  }, [])

  // Auto-trigger hint after transcription completes
  const handleMicStop = useCallback(async () => {
    await stopRecording()
    // Note: transcript will be updated after the async stopRecording completes
    // We'll use the fullTranscript which accumulates
  }, [stopRecording])

  // Trigger hint generation when transcript changes
  const latestTranscript = transcript

  // Show the user's spoken text (real or mock)
  const displayUserText = asrEnabled
    ? (fullTranscript || (isRecording ? '' : 'Нажмите на микрофон чтобы начать говорить...'))
    : 'Работаю с React уже более 5 лет...'

  // Show the AI hint (real or mock)
  const displayHint = asrEnabled
    ? (aiHint ?? (isHintLoading ? '' : 'Подсказка появится после вашего ответа'))
    : MOCK_INTERVIEW.mockHint

  return (
    <div className="flex gap-3">
      <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shrink-0">
        <Zap className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-coral mb-1">HH Job Copilot</p>
        <div className="glass-card rounded-2xl rounded-tl-sm p-4 space-y-3">
          <p className="text-sm">Интервью-режим активирован! Микрофон включён, ASR готов.</p>
          <div className="rounded-xl gradient-border bg-gradient-to-br from-cyan/5 to-purple/5 overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-coral/10">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-red-400 streak-glow rounded px-1.5 py-0.5">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse-dot" /> LIVE
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Mic className="w-3 h-3" /> {MOCK_INTERVIEW.company} — {MOCK_INTERVIEW.position}
              </span>
            </div>
            <div className="p-3 space-y-2">
              {/* Interviewer question */}
              <p className="text-sm">
                <span className="font-semibold text-green-accent">Интервьюер:</span>{' '}
                {MOCK_INTERVIEW.interviewerQuestion}
              </p>

              {/* AI Hint */}
              <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-lg p-2.5 gradient-border">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                    <Zap className="w-3 h-3" /> AI Подсказка
                  </p>
                  {/* TTS button — only when feature enabled */}
                  {ttsEnabled && displayHint && !isHintLoading && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 shrink-0"
                      onClick={() => isSpeaking ? stopSpeaking() : speakHint(displayHint)}
                      title={isSpeaking ? 'Остановить озвучку' : 'Озвучить подсказку'}
                    >
                      {isSpeaking ? (
                        <VolumeX className="w-3 h-3 text-green-accent" />
                      ) : (
                        <Volume2 className="w-3 h-3 text-green-accent/60 hover:text-green-accent" />
                      )}
                    </Button>
                  )}
                </div>
                {isHintLoading ? (
                  <div className="flex items-center gap-2 mt-1">
                    <Loader2 className="w-3 h-3 animate-spin text-emerald-400" />
                    <p className="text-xs text-muted-foreground">Генерирую подсказку...</p>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground leading-relaxed mt-1">{displayHint}</p>
                )}
              </div>

              {/* User speech / transcript */}
              <p className="text-sm flex items-center gap-2">
                <span className="font-semibold text-coral">Вы:</span>{' '}
                <span className="flex-1">{displayUserText}</span>
                {asrEnabled && isRecording && (
                  <span className="flex items-end gap-0.5 h-4">
                    {[0, 0.15, 0.3, 0.45, 0.6].map((d, i) => (
                      <span
                        key={i}
                        className="w-0.5 bg-green-accent rounded-full animate-wave"
                        style={{ animationDelay: `${d}s`, height: `${0.5 + i * 0.2}rem` }}
                      />
                    ))}
                  </span>
                )}
                {asrEnabled && isTranscribing && (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-green-accent" />
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Controls row */}
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[10px] text-muted-foreground">
            {new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
          </span>

          {/* ASR status badge */}
          {asrEnabled ? (
            <Badge
              variant="secondary"
              className={`text-[10px] h-4 gap-1 border-0 ${
                isRecording
                  ? 'bg-red-500/10 text-red-400'
                  : isTranscribing
                    ? 'bg-green-accent/10 text-green-accent'
                    : 'bg-green-accent/10 text-green-accent'
              }`}
            >
              <Mic className="w-2.5 h-2.5" />
              {isRecording ? 'Recording' : isTranscribing ? 'Transcribing' : 'ASR Ready'}
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-[10px] h-4 gap-1 bg-green-accent/10 text-green-accent border-0">
              <Mic className="w-2.5 h-2.5" /> ASR Active
            </Badge>
          )}

          {/* TTS status badge */}
          {ttsEnabled && isSpeaking && (
            <Badge variant="secondary" className="text-[10px] h-4 gap-1 bg-coral/10 text-coral border-0">
              <Volume2 className="w-2.5 h-2.5" /> Speaking
            </Badge>
          )}

          {/* Mic toggle button */}
          {asrEnabled && asrSupported && (
            <Button
              variant="ghost"
              size="icon"
              className={`h-6 w-6 rounded-full ${
                isRecording
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-400'
                  : 'bg-green-accent/10 text-green-accent hover:bg-green-accent/20 hover:text-green-accent'
              }`}
              onClick={isRecording ? handleMicStop : handleMicToggle}
              disabled={isTranscribing}
              title={isRecording ? 'Остановить запись' : 'Начать запись'}
            >
              {isRecording ? (
                <MicOff className="w-3 h-3" />
              ) : (
                <Mic className="w-3 h-3" />
              )}
            </Button>
          )}

          {/* Get hint button */}
          {asrEnabled && latestTranscript && !aiHint && !isHintLoading && (
            <Button
              variant="ghost"
              size="sm"
              className="h-5 text-[10px] gap-1 text-emerald-400 hover:text-emerald-400 px-2"
              onClick={() => handleGetHint(latestTranscript)}
            >
              <Zap className="w-2.5 h-2.5" /> Подсказка
            </Button>
          )}
        </div>

        {/* Error display */}
        {(asrError || ttsError) && (
          <p className="text-[10px] text-red-400 mt-1">
            {asrError || ttsError}
          </p>
        )}
      </div>
    </div>
  )
}
