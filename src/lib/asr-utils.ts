// ============================================================
// ASR / TTS Audio Utility Functions
// Helpers for browser audio recording and playback
// ============================================================

/**
 * Convert a MediaRecorder Blob to a base64 string
 */
export function audioBlobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const dataUrl = reader.result as string
      // Strip the data URL prefix (e.g. "data:audio/webm;base64,")
      const base64 = dataUrl.split(',')[1]
      if (base64) {
        resolve(base64)
      } else {
        reject(new Error('Failed to convert blob to base64'))
      }
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}

/**
 * Check if the browser supports MediaRecorder for audio recording
 */
export function isASRSupported(): boolean {
  return typeof window !== 'undefined' && !!window.MediaRecorder && !!navigator.mediaDevices?.getUserMedia
}

/**
 * Audio constraints optimized for interview recording
 * - mono channel (speech doesn't need stereo)
 * - 16kHz sample rate (sufficient for speech recognition)
 * - noise suppression and echo cancellation enabled
 */
export const interviewAudioConstraints: MediaStreamConstraints = {
  audio: {
    channelCount: 1,
    sampleRate: 16000,
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  },
}

/**
 * Convert a base64 audio string to a Blob
 */
export function base64ToAudioBlob(base64: string, mimeType: string = 'audio/wav'): Blob {
  const binaryString = atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return new Blob([bytes], { type: mimeType })
}

/**
 * Play audio from a base64-encoded audio source
 */
export function playAudioFromBase64(base64: string, mimeType: string = 'audio/wav'): Promise<void> {
  return new Promise((resolve, reject) => {
    const blob = base64ToAudioBlob(base64, mimeType)
    const url = URL.createObjectURL(blob)
    const audio = new Audio(url)

    audio.onended = () => {
      URL.revokeObjectURL(url)
      resolve()
    }
    audio.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Audio playback failed'))
    }

    audio.play().catch(reject)
  })
}
