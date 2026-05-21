'use client'

// ============================================================
// useTTS Hook — Client-side text-to-speech playback
// ============================================================

import { useState, useRef, useCallback, useEffect } from 'react'
import { isFeatureEnabled } from '@/lib/feature-flags'
import { base64ToAudioBlob } from '@/lib/asr-utils'
import { toast } from 'sonner'

interface UseTTSOptions {
  /** Interview ID to associate TTS usage with */
  interviewId?: string
  /** Voice to use (default: tongtong) */
  defaultVoice?: string
}

interface UseTTSReturn {
  /** Speak the given text aloud */
  speak: (text: string) => Promise<void>
  /** Stop current playback */
  stop: () => void
  /** Whether TTS is currently playing audio */
  isSpeaking: boolean
  /** Current error message */
  error: string | null
  /** Whether TTS feature is available (feature flag + plan) */
  isAvailable: boolean
}

export function useTTS(options: UseTTSOptions = {}): UseTTSReturn {
  const { interviewId, defaultVoice = 'tongtong' } = options

  const [isSpeaking, setIsSpeaking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const objectUrlRef = useRef<string | null>(null)

  // Check if TTS is available (feature flag must be enabled)
  const isAvailable = isFeatureEnabled('tts')

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
        objectUrlRef.current = null
      }
    }
  }, [])

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
    setIsSpeaking(false)
  }, [])

  const speak = useCallback(async (text: string) => {
    // Feature flag check — graceful degradation
    if (!isFeatureEnabled('tts')) {
      toast.info('TTS скоро будет доступно', {
        description: 'Обновите до Ultra для озвучки подсказок',
      })
      return
    }

    if (!text || text.trim().length === 0) return

    // Stop any current playback first
    stop()

    try {
      setError(null)
      setIsSpeaking(true)

      const response = await fetch('/api/tts/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voice: defaultVoice,
          interviewId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || errorData.error || 'TTS synthesis failed')
      }

      const data = await response.json()
      const audioBase64 = data.audio as string

      if (!audioBase64) {
        throw new Error('No audio data returned')
      }

      // Convert base64 to blob and play
      const blob = base64ToAudioBlob(audioBase64, 'audio/wav')
      const url = URL.createObjectURL(blob)
      objectUrlRef.current = url

      const audio = new Audio(url)
      audioRef.current = audio

      audio.onended = () => {
        setIsSpeaking(false)
        URL.revokeObjectURL(url)
        objectUrlRef.current = null
        audioRef.current = null
      }

      audio.onerror = () => {
        setIsSpeaking(false)
        setError('Audio playback failed')
        URL.revokeObjectURL(url)
        objectUrlRef.current = null
        audioRef.current = null
      }

      await audio.play()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'TTS failed'
      setError(message)
      setIsSpeaking(false)
      toast.error('Ошибка озвучки', { description: message })
    }
  }, [defaultVoice, interviewId, stop])

  return {
    speak,
    stop,
    isSpeaking,
    error,
    isAvailable,
  }
}
