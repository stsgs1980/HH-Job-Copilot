import { NextRequest, NextResponse } from 'next/server'
import { getChats, type ChatikCookies } from '@/lib/hh-api'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

/**
 * GET /api/hh/chats
 * Fetch list of chats from HH.ru Chatik API.
 *
 * Query params:
 *   userId — (required for now, mock auth) user ID to look up cookies for
 */
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId query parameter' },
        { status: 400 },
      )
    }

    // Fetch user and their stored Chatik cookies
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

    // Parse the stored cookie JSON
    let cookies: ChatikCookies
    try {
      cookies = JSON.parse(user.hhCookies) as ChatikCookies
    } catch {
      return NextResponse.json(
        { error: 'Stored cookies are malformed. Please re-login via /api/hh/cookie-login.' },
        { status: 500 },
      )
    }

    // Validate required cookie fields
    const required: (keyof ChatikCookies)[] = ['hhtoken', 'hhuid', 'crypted_hhuid', '_xsrf']
    const missing = required.filter((k) => !cookies[k])
    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Missing cookie fields: ${missing.join(', ')}. Please re-login.` },
        { status: 400 },
      )
    }

    // Fetch chats from Chatik API
    const chats = await getChats(cookies)

    return NextResponse.json({ chats })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[/api/hh/chats] Error:', message)
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
