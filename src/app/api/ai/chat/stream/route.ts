import { NextRequest } from 'next/server'
import { isFeatureEnabled } from '@/lib/feature-flags'
import { chatCompletion } from '@/lib/ai'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

/**
 * POST /api/ai/chat/stream
 * SSE streaming endpoint for AI chat responses.
 *
 * When streaming is disabled or fails, falls back to non-streaming mode.
 *
 * SSE format:
 *   data: { "content": "chunk" }\n\n
 *   data: [DONE]\n\n
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { messages, source, userId } = body as {
      messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>
      source?: string
      userId?: string
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'messages is required and must be a non-empty array' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      )
    }

    const mockUserId = userId ?? 'mock-user-001'

    // Call AI (non-streaming for reliability)
    const aiResponse = await chatCompletion(messages)

    // Save messages to DB in background (non-blocking)
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user')
    Promise.all([
      lastUserMsg && db.aIMessage.create({
        data: {
          userId: mockUserId,
          role: 'user',
          content: lastUserMsg.content,
          source: source ?? 'chat',
        },
      }).catch(e => console.error('[/api/ai/chat/stream] DB save user msg error:', e.message)),
      db.aIMessage.create({
        data: {
          userId: mockUserId,
          role: 'assistant',
          content: aiResponse,
          source: source ?? 'chat',
        },
      }).catch(e => console.error('[/api/ai/chat/stream] DB save AI msg error:', e.message)),
    ]).catch(() => {})

    // Return as SSE events
    const encoder = new TextEncoder()
    const sseString = `data: ${JSON.stringify({ content: aiResponse })}\n\ndata: [DONE]\n\n`

    return new Response(encoder.encode(sseString), {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('[/api/ai/chat/stream] Error:', error)
    const message = error instanceof Error ? error.message : 'Failed to generate AI response'
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )
  }
}
