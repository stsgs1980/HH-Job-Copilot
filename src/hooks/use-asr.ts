'use client'

// ============================================================
// useASR Hook — Client-side microphone recording & transcription
// ============================================================

import { useState, useRef, useCallback, useEffect } from 'react'
import { isFeatureEnabled } from '@/lib/feature-flags'
import { audioBlobToBase64, isASRSupported, interviewAudioConstraints } from '@/lib/asr-utils'
import { toast } from 'sonner'

interface UseASROptions {
  /** Interview ID to associate transcripts with */
  interviewId?: string
  /** Auto-send transcript to interview-hint API after recording */
  autoHint?: boolean
}

interface UseASRReturn {
  /** Whether ASR is currently recording */
  isRecording: boolean
  /** The latest transcript text */
  transcript: string
  /** Accumulated transcript from all recordings in session */
  fullTranscript: string
  /** Start recording audio from microphone */
  startRecording: () => Promise<void>
  /** Stop recording and send audio for transcription */
  stopRecording: () => Promise<void>
  /** Current error message */
  error: string | null
  /** Whether the browser supports ASR */
  isSupported: boolean
  /** Whether ASR is currently transcribing (after stop, before result) */
  isTranscribing: boolean
  /** Clear the current transcript */
  clearTranscript: () => void
}

export function useASR(options: UseASROptions = {}): UseASRReturn {
  const { interviewId, autoHint = true } = options

  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [fullTranscript, setFullTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isTranscribing, setIsTranscribing] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const supported = isASRSupported()

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop()
      }
    }
  }, [])

  const startRecording = useCallback(async () => {
    // Feature flag check — graceful degradation
    if (!isFeatureEnabled('asr')) {
      toast.info('ASR скоро будет доступно', {
        description: 'Обновите план для использования распознавания речи',
      })
      return
    }

    if (!supported) {
      setError('Ваш браузер не поддерживает запись аудио')
      toast.error('Браузер не поддерживается')
      return
    }

    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia(interviewAudioConstraints)
      streamRef.current = stream
      chunksRef.current = []

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : 'audio/webm',
      })

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start(1000) // Collect data every second
      setIsRecording(true)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to access microphone'
      setError(message)
      toast.error('Ошибка доступа к микрофону', { description: message })
    }
  }, [supported])

  const stopRecording = useCallback(async () => {
    if (!mediaRecorderRef.current || !isRecording) return

    return new Promise<void>((resolve) => {
      mediaRecorderRef.current!.onstop = async () => {
        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop())
          streamRef.current = null
        }

        setIsRecording(false)
        setIsTranscribing(true)

        try {
          // Combine chunks into a single blob
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
          const base64 = await audioBlobToBase64(blob)

          // Send to transcription API
          const response = await fetch('/api/asr/transcribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              audio: base64,
              format: 'webm',
              interviewId,
            }),
          })

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.message || errorData.error || 'Transcription failed')
          }

          const data = await response.json()
          const text = data.text ?? ''

          setTranscript(text)
          setFullTranscript(prev => prev ? `${prev}\n${text}` : text)
          setError(null)

          // Auto-trigger interview hint if enabled
          if (autoHint && text.trim() && interviewId) {
            try {
              await fetch('/api/ai/interview-hint', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  interviewId,
                  question: text,
                }),
              })
            } catch {
              // Hint generation failure shouldn't break the flow
            }
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Transcription failed'
          setError(message)
          toast.error('Ошибка транскрипции', { description: message })
        } finally {
          setIsTranscribing(false)
          chunksRef.current = []
          resolve()
        }
      }

      mediaRecorderRef.current!.stop()
    })
  }, [isRecording, interviewId, autoHint])

  const clearTranscript = useCallback(() => {
    setTranscript('')
    setFullTranscript('')
    setError(null)
  }, [])

  return {
    isRecording,
    transcript,
    fullTranscript,
    startRecording,
    stopRecording,
    error,
    isSupported: supported,
    isTranscribing,
    clearTranscript,
  }
}
