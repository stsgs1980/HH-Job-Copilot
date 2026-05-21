import { NextRequest, NextResponse } from 'next/server'
import { generateHRReply } from '@/lib/ai'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      chatId,
      employerMessage,
      vacancyTitle,
      company,
    } = body as {
      chatId?: string
      employerMessage?: string
      vacancyTitle?: string
      company?: string
    }

    if (!employerMessage || typeof employerMessage !== 'string' || employerMessage.trim().length === 0) {
      return NextResponse.json(
        { error: 'employerMessage is required and must be a non-empty string' },
        { status: 400 },
      )
    }

    // Generate raw + humanized reply
    const { raw, humanized } = await generateHRReply({
      employerMessage,
      vacancyTitle,
      company,
    })

    // Auto-send is not available without HH.ru Chatik API credentials
    // When FEATURE_HH_CHATIK=true and user has stored cookies, autoSend would be handled here
    const sent = false

    return NextResponse.json({ raw, humanized, sent })
  } catch (error) {
    console.error('[/api/ai/hr-reply] Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate HR reply' },
      { status: 500 },
    )
  }
}
