// ============================================================
// ASR Streaming Endpoint (Polling-based for MVP)
// POST /api/asr/stream
// Accepts audio chunks and returns partial transcriptions as SSE events
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { isFeatureEnabled } from '@/lib/feature-flags'
import { db } from '@/lib/db'

import ZAI from 'z-ai-web-dev-sdk'

let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null

async function getZAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create()
  }
  return zaiInstance
}

export async function POST(req: NextRequest) {
  // Feature flag check
  if (!isFeatureEnabled('asr')) {
    return NextResponse.json(
      { error: 'ASR not available', message: 'ASR is not available in your current plan.' },
      { status: 403 },
    )
  }

  try {
    const body = await req.json()
    const { audio, chunkIndex, sessionId, interviewId, isFinal, userId } = body as {
      audio?: string
      chunkIndex?: number
      sessionId?: string
      interviewId?: string
      isFinal?: boolean
      userId?: string
    }

    if (!audio || typeof audio !== 'string') {
      return NextResponse.json(
        { error: 'audio is required and must be a base64-encoded string' },
        { status: 400 },
      )
    }

    // For MVP: each chunk is independently transcribed
    // In a production system, this would maintain a session buffer and
    // provide incremental/interim results
    const zai = await getZAI()
    const asrResponse = await zai.audio.asr.create({
      file_base64: audio,
    })

    const text = asrResponse.text ?? ''

    // If this is the final chunk, save the accumulated transcript
    if (isFinal && interviewId) {
      try {
        const interview = await db.interview.findUnique({
          where: { id: interviewId },
        })

        if (interview) {
          const existingTranscript = interview.transcript ?? ''
          const updatedTranscript = existingTranscript
            ? `${existingTranscript}\n${text}`
            : text

          await db.interview.update({
            where: { id: interviewId },
            data: { transcript: updatedTranscript },
          })
        }
      } catch (dbError) {
        console.error('[/api/asr/stream] DB save error:', dbError)
      }
    }

    return NextResponse.json({
      text,
      chunkIndex: chunkIndex ?? 0,
      sessionId: sessionId ?? 'default',
      isFinal: isFinal ?? false,
    })
  } catch (error) {
    console.error('[/api/asr/stream] Error:', error)
    return NextResponse.json(
      { error: 'Failed to process audio chunk' },
      { status: 500 },
    )
  }
}
