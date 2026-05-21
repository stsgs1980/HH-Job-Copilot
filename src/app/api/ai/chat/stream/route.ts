import { NextRequest } from 'next/server'
import { isFeatureEnabled } from '@/lib/feature-flags'
import { chatCompletion, chatCompletionStream } from '@/lib/ai'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

/**
 * POST /api/ai/chat/stream
 * SSE streaming endpoint for AI chat responses.
 *
 * When FEATURE_AI_STREAMING=true: uses z-ai-sdk streaming and emits SSE events
 * When FEATURE_AI_STREAMING=false: falls back to non-streaming and returns as a single SSE event
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

    // Save the last user message to DB
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user')
    if (lastUserMsg) {
      await db.aIMessage.create({
        data: {
          userId: mockUserId,
          role: 'user',
          content: lastUserMsg.content,
          source: source ?? 'chat',
        },
      })
    }

    const streamingEnabled = isFeatureEnabled('aiStreaming')

    if (streamingEnabled) {
      // ---- Streaming mode ----
      const aiStream = await chatCompletionStream(messages)

      const encoder = new TextEncoder()
      let fullContent = ''

      const transformStream = new TransformStream({
        async transform(chunk, controller) {
          const text = new TextDecoder().decode(chunk, { stream: true })
          const lines = text.split('\n')

          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed) continue

            // The upstream API sends SSE-style data too
            if (trimmed.startsWith('data: ')) {
              const data = trimmed.slice(6)

              if (data === '[DONE]') {
                // End of upstream stream — we'll send our own [DONE] after saving
                continue
              }

              try {
                const parsed = JSON.parse(data) as { choices?: Array<{ delta?: { content?: string } }> }
                const content = parsed.choices?.[0]?.delta?.content ?? ''
                if (content) {
                  fullContent += content
                  // Re-emit as our SSE format
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ content })}\n\n`),
                  )
                }
              } catch {
                // Try treating as plain content
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ content: data })}\n\n`),
                )
                fullContent += data
              }
            } else {
              // Try parsing as raw JSON (non-SSE format from upstream)
              try {
                const parsed = JSON.parse(trimmed) as { choices?: Array<{ delta?: { content?: string } }> }
                const content = parsed.choices?.[0]?.delta?.content ?? ''
                if (content) {
                  fullContent += content
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ content })}\n\n`),
                  )
                }
              } catch {
                // Not JSON, ignore
              }
            }
          }
        },
        async flush(controller) {
          // Send [DONE] signal
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))

          // Save the full AI response to DB in background
          if (fullContent) {
            try {
              await db.aIMessage.create({
                data: {
                  userId: mockUserId,
                  role: 'assistant',
                  content: fullContent,
                  source: source ?? 'chat',
                },
              })
            } catch (dbErr) {
              console.error('[/api/ai/chat/stream] DB save error:', dbErr)
            }
          }
        },
      })

      const readable = aiStream.pipeThrough(transformStream)

      return new Response(readable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      })
    } else {
      // ---- Non-streaming fallback ----
      const aiResponse = await chatCompletion(messages)

      // Save AI response to DB
      await db.aIMessage.create({
        data: {
          userId: mockUserId,
          role: 'assistant',
          content: aiResponse,
          source: source ?? 'chat',
        },
      })

      // Return as a single SSE event followed by [DONE]
      const encoder = new TextEncoder()
      const sseString = `data: ${JSON.stringify({ content: aiResponse })}\n\ndata: [DONE]\n\n`

      return new Response(encoder.encode(sseString), {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      })
    }
  } catch (error) {
    console.error('[/api/ai/chat/stream] Error:', error)
    const message = error instanceof Error ? error.message : 'Failed to generate AI response'
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )
  }
}
