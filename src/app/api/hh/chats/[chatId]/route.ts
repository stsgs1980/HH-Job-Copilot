import { NextRequest, NextResponse } from 'next/server'
import {
  getChatData,
  sendMessage,
  markRead,
  type ChatikCookies,
} from '@/lib/hh-api'
import { db } from '@/lib/db'
import { resolveUserId } from '@/lib/mock-auth'

export const dynamic = 'force-dynamic'

/** Helper: resolve Chatik cookies for a given userId */
async function getCookiesForUser(userId: string): Promise<ChatikCookies | NextResponse> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { hhCookies: true },
  })

  if (!user?.hhCookies) {
    return NextResponse.json(
      { error: 'No Chatik cookies found for this user. Please log in via /api/hh/cookie-login first.' },
      { status: 401 },
    )
  }

  try {
    return JSON.parse(user.hhCookies) as ChatikCookies
  } catch {
    return NextResponse.json(
      { error: 'Stored cookies are malformed. Please re-login via /api/hh/cookie-login.' },
      { status: 500 },
    )
  }
}

/**
 * GET /api/hh/chats/[chatId]
 * Fetch messages for a specific chat.
 *
 * Query params:
 *   userId — (optional, fallback) user ID
 *   limit  — (optional, default 50) number of messages
 *   offset — (optional, default 0) offset for pagination
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ chatId: string }> },
) {
  try {
    const { chatId } = await params
    // Resolve userId from session or fallback to query param
    const userId = await resolveUserId(req, { queryParam: 'userId' })

    const cookiesOrErr = await getCookiesForUser(userId)
    if (cookiesOrErr instanceof NextResponse) return cookiesOrErr

    const limit = parseInt(req.nextUrl.searchParams.get('limit') ?? '50', 10)
    const offset = parseInt(req.nextUrl.searchParams.get('offset') ?? '0', 10)

    const messages = await getChatData(cookiesOrErr, chatId, limit, offset)

    return NextResponse.json({ messages })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[/api/hh/chats/[chatId]] GET Error:', message)
    return NextResponse.json({ error: message }, { status: 502 })
  }
}

/**
 * POST /api/hh/chats/[chatId]
 * Send a message or mark chat as read.
 *
 * Body:
 *   userId — (optional, fallback) user ID
 *   action — (optional) "mark_read" to mark as read; omit/other to send message
 *   text   — (required when action != "mark_read") message text
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ chatId: string }> },
) {
  try {
    const { chatId } = await params
    // Resolve userId from session or fallback to body field
    const userId = await resolveUserId(req, { bodyField: 'userId' })

    const cookiesOrErr = await getCookiesForUser(userId)
    if (cookiesOrErr instanceof NextResponse) return cookiesOrErr

    const body = await req.json()
    const { action, text } = body as {
      action?: string
      text?: string
    }

    // Mark as read
    if (action === 'mark_read') {
      const result = await markRead(cookiesOrErr, chatId)
      return NextResponse.json(result)
    }

    // Send message
    if (!text?.trim()) {
      return NextResponse.json(
        { error: 'Missing "text" field. Provide message text or set action="mark_read".' },
        { status: 400 },
      )
    }

    const result = await sendMessage(cookiesOrErr, chatId, text)
    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[/api/hh/chats/[chatId]] POST Error:', message)
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
