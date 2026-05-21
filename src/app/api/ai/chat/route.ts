import { NextRequest, NextResponse } from 'next/server'
import { chatCompletion } from '@/lib/ai'
import { db } from '@/lib/db'
import { resolveUserId } from '@/lib/mock-auth'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { messages, source } = body as {
      messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>
      source?: string
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'messages is required and must be a non-empty array' },
        { status: 400 },
      )
    }

    // Resolve userId from session or fallback
    const resolvedUserId = await resolveUserId(req, { bodyField: 'userId' })

    // Save the last user message to DB
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user')

    if (lastUserMsg) {
      await db.aIMessage.create({
        data: {
          userId: resolvedUserId,
          role: 'user',
          content: lastUserMsg.content,
          source: source ?? 'chat',
        },
      })
    }

    // Call AI
    const aiResponse = await chatCompletion(messages)

    // Save AI response to DB
    await db.aIMessage.create({
      data: {
        userId: resolvedUserId,
        role: 'assistant',
        content: aiResponse,
        source: source ?? 'chat',
      },
    })

    return NextResponse.json({ response: aiResponse })
  } catch (error) {
    console.error('[/api/ai/chat] Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate AI response' },
      { status: 500 },
    )
  }
}
