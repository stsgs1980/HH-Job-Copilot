import { NextRequest, NextResponse } from 'next/server'
import { generateHRReply } from '@/lib/ai'
import { sendMessage } from '@/lib/hh-api'
import { db } from '@/lib/db'
import { resolveUserId } from '@/lib/mock-auth'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      chatId,
      employerMessage,
      vacancyTitle,
      company,
      autoSend,
    } = body as {
      chatId?: string
      employerMessage?: string
      vacancyTitle?: string
      company?: string
      autoSend?: boolean
    }

    if (!employerMessage || typeof employerMessage !== 'string' || employerMessage.trim().length === 0) {
      return NextResponse.json(
        { error: 'employerMessage is required and must be a non-empty string' },
        { status: 400 },
      )
    }

    if (!chatId) {
      return NextResponse.json(
        { error: 'chatId is required' },
        { status: 400 },
      )
    }

    // Resolve userId from session or fallback
    const resolvedUserId = await resolveUserId(req, { bodyField: 'userId' })

    // Generate raw + humanized reply
    const { raw, humanized } = await generateHRReply({
      employerMessage,
      vacancyTitle,
      company,
    })

    let sent = false

    // Auto-send via Chatik API if requested
    if (autoSend) {
      try {
        // Retrieve stored Chatik cookies for this user
        const user = await db.user.findUnique({
          where: { id: resolvedUserId },
          select: { hhCookies: true },
        })

        if (user?.hhCookies) {
          const cookies = JSON.parse(user.hhCookies)
          await sendMessage(cookies, chatId, humanized)
          sent = true
        }
      } catch (sendError) {
        console.error('[/api/ai/hr-reply] Auto-send failed:', sendError)
        // Don't fail the whole request — just mark as not sent
      }
    }

    // Save the message to DB
    await db.message.create({
      data: {
        chatId,
        role: 'AI',
        content: humanized,
        sentVia: sent ? 'HUMANIZED_AI' : 'MANUAL',
        aiRawContent: raw,
        aiHumanized: true,
      },
    })

    return NextResponse.json({ raw, humanized, sent })
  } catch (error) {
    console.error('[/api/ai/hr-reply] Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate HR reply' },
      { status: 500 },
    )
  }
}
