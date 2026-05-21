// ============================================================
// ASR Transcription Endpoint
// POST /api/asr/transcribe
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { isFeatureEnabled } from '@/lib/feature-flags'
import { db } from '@/lib/db'

// z-ai-web-dev-sdk MUST be used in backend only
import ZAI from 'z-ai-web-dev-sdk'

let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null

async function getZAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create()
  }
  return zaiInstance
}

// Simple in-memory rate limiting (per day)
const asrUsageMap = new Map<string, { date: string; seconds: number }>()

const PLAN_LIMITS: Record<string, number> = {
  STARTER: 5,   // 5 minutes/day
  PRO: 30,      // 30 minutes/day
  ULTRA: 120,   // 120 minutes/day
}

function checkASRRateLimit(userId: string, plan: string): { allowed: boolean; remaining: number } {
  const today = new Date().toISOString().slice(0, 10)
  const usage = asrUsageMap.get(userId)

  if (!usage || usage.date !== today) {
    asrUsageMap.set(userId, { date: today, seconds: 0 })
    return { allowed: true, remaining: (PLAN_LIMITS[plan] ?? 5) * 60 }
  }

  const limitSeconds = (PLAN_LIMITS[plan] ?? 5) * 60
  const remaining = limitSeconds - usage.seconds
  return { allowed: remaining > 0, remaining: Math.max(0, remaining) }
}

export async function POST(req: NextRequest) {
  // Feature flag check
  if (!isFeatureEnabled('asr')) {
    return NextResponse.json(
      { error: 'ASR not available', message: 'ASR is not available in your current plan. Upgrade to Pro or Ultra to enable speech recognition.' },
      { status: 403 },
    )
  }

  try {
    const body = await req.json()
    const { audio, format, interviewId, userId } = body as {
      audio?: string
      format?: string
      interviewId?: string
      userId?: string
    }

    if (!audio || typeof audio !== 'string') {
      return NextResponse.json(
        { error: 'audio is required and must be a base64-encoded string' },
        { status: 400 },
      )
    }

    // Rate limit check
    const mockUserId = userId ?? 'mock-user-001'
    const { allowed, remaining } = checkASRRateLimit(mockUserId, 'PRO')
    if (!allowed) {
      return NextResponse.json(
        { error: 'ASR rate limit exceeded', message: 'Daily ASR minutes limit exceeded. Upgrade your plan for more minutes.' },
        { status: 429 },
      )
    }

    // Call z-ai-web-dev-sdk ASR
    const zai = await getZAI()
    const asrResponse = await zai.audio.asr.create({
      file_base64: audio,
    })

    const transcriptText = asrResponse.text ?? ''

    // Estimate audio duration for rate limiting (~3 seconds per chunk as rough estimate)
    const estimatedDuration = 3
    const currentUsage = asrUsageMap.get(mockUserId)
    if (currentUsage) {
      currentUsage.seconds += estimatedDuration
    }

    // Save transcript to Interview model if interviewId provided
    if (interviewId) {
      try {
        const interview = await db.interview.findUnique({
          where: { id: interviewId },
        })

        if (interview) {
          const existingTranscript = interview.transcript ?? ''
          const updatedTranscript = existingTranscript
            ? `${existingTranscript}\n${transcriptText}`
            : transcriptText

          await db.interview.update({
            where: { id: interviewId },
            data: { transcript: updatedTranscript },
          })
        }
      } catch (dbError) {
        console.error('[/api/asr/transcribe] DB save error:', dbError)
        // Don't fail the request if DB save fails
      }
    }

    return NextResponse.json({
      text: transcriptText,
      confidence: undefined,
      remainingSeconds: remaining - estimatedDuration,
    })
  } catch (error) {
    console.error('[/api/asr/transcribe] Error:', error)
    return NextResponse.json(
      { error: 'Failed to transcribe audio' },
      { status: 500 },
    )
  }
}
