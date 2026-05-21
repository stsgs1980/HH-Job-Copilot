// ============================================================
// TTS Synthesis Endpoint
// POST /api/tts/synthesize
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

// Simple in-memory rate limiting (per day)
const ttsUsageMap = new Map<string, { date: string; seconds: number }>()

const TTS_PLAN_LIMITS: Record<string, number> = {
  STARTER: 0,    // Not available
  PRO: 0,        // Not available
  ULTRA: 60,     // 60 minutes/day
}

function checkTTSRateLimit(userId: string, plan: string): { allowed: boolean; remaining: number; reason?: string } {
  // TTS is Ultra-only
  if (plan !== 'ULTRA') {
    return { allowed: false, remaining: 0, reason: 'TTS is available in Ultra plan only' }
  }

  const today = new Date().toISOString().slice(0, 10)
  const usage = ttsUsageMap.get(userId)

  if (!usage || usage.date !== today) {
    ttsUsageMap.set(userId, { date: today, seconds: 0 })
    return { allowed: true, remaining: 60 * 60 }
  }

  const limitSeconds = (TTS_PLAN_LIMITS[plan] ?? 0) * 60
  const remaining = limitSeconds - usage.seconds
  return { allowed: remaining > 0, remaining: Math.max(0, remaining) }
}

export async function POST(req: NextRequest) {
  // Feature flag check
  if (!isFeatureEnabled('tts')) {
    return NextResponse.json(
      { error: 'TTS is available in Ultra plan', message: 'Upgrade to Ultra to enable voice output during interviews.' },
      { status: 403 },
    )
  }

  try {
    const body = await req.json()
    const { text, voice, interviewId, userId, plan } = body as {
      text?: string
      voice?: string
      interviewId?: string
      userId?: string
      plan?: string
    }

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'text is required and must be a non-empty string' },
        { status: 400 },
      )
    }

    // Rate limit + plan check
    const mockUserId = userId ?? 'mock-user-001'
    const userPlan = plan ?? 'STARTER'
    const rateCheck = checkTTSRateLimit(mockUserId, userPlan)
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: rateCheck.reason ?? 'TTS rate limit exceeded', message: rateCheck.reason ?? 'Daily TTS minutes limit exceeded.' },
        { status: 403 },
      )
    }

    // Call z-ai-web-dev-sdk TTS
    const zai = await getZAI()
    const response = await zai.audio.tts.create({
      input: text,
      voice: voice ?? 'tongtong',
      response_format: 'wav',
      stream: false,
    })

    // Get audio data as base64
    const arrayBuffer = await response.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)
    let binary = ''
    for (let i = 0; i < uint8Array.length; i++) {
      binary += String.fromCharCode(uint8Array[i])
    }
    const audioBase64 = btoa(binary)

    // Estimate duration for rate limiting (~150 words per minute, ~5 chars per word)
    const estimatedWords = text.length / 5
    const estimatedDurationSeconds = (estimatedWords / 150) * 60
    const currentUsage = ttsUsageMap.get(mockUserId)
    if (currentUsage) {
      currentUsage.seconds += Math.ceil(estimatedDurationSeconds)
    }

    // Save to interview hints if interviewId is provided
    if (interviewId) {
      try {
        const interview = await db.interview.findUnique({
          where: { id: interviewId },
        })
        if (interview) {
          const existingHints = interview.aiHints ? JSON.parse(interview.aiHints) as Array<{ text: string; spokenAt?: string }> : []
          existingHints.push({ text, spokenAt: new Date().toISOString() })
          await db.interview.update({
            where: { id: interviewId },
            data: { aiHints: JSON.stringify(existingHints) },
          })
        }
      } catch (dbError) {
        console.error('[/api/tts/synthesize] DB save error:', dbError)
        // Don't fail the request if DB save fails
      }
    }

    return NextResponse.json({
      audio: audioBase64,
      format: 'wav',
      duration: Math.ceil(estimatedDurationSeconds),
      remainingSeconds: rateCheck.remaining - Math.ceil(estimatedDurationSeconds),
    })
  } catch (error) {
    console.error('[/api/tts/synthesize] Error:', error)
    return NextResponse.json(
      { error: 'Failed to synthesize speech' },
      { status: 500 },
    )
  }
}
