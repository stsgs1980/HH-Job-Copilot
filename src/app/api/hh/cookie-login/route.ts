import { NextRequest, NextResponse } from 'next/server'
import { getChats, type ChatikCookies } from '@/lib/hh-api'
import { db } from '@/lib/db'
import { resolveUserId } from '@/lib/mock-auth'

/**
 * POST /api/hh/cookie-login
 * Accept raw Chatik cookies from the user and validate them.
 *
 * This is the "manual login" alternative to OAuth for the Chatik API,
 * which requires cookies (hhtoken, hhuid, crypted_hhuid, _xsrf) rather than
 * OAuth bearer tokens.
 *
 * Body:
 *   userId       — (optional, resolved from session) user ID to associate cookies with
 *   hhtoken      — (required) HH.ru auth token cookie
 *   hhuid        — (required) HH.ru user ID cookie
 *   crypted_hhuid — (required) Encrypted HH.ru user ID cookie
 *   _xsrf        — (required) XSRF token cookie
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { hhtoken, hhuid, crypted_hhuid, _xsrf } = body as {
      hhtoken?: string
      hhuid?: string
      crypted_hhuid?: string
      _xsrf?: string
    }

    // Resolve userId from session or fallback to body field
    const userId = await resolveUserId(req, { bodyField: 'userId' })

    const requiredCookies: Record<string, string | undefined> = {
      hhtoken,
      hhuid,
      crypted_hhuid,
      _xsrf,
    }

    const missing = Object.entries(requiredCookies)
      .filter(([, v]) => !v)
      .map(([k]) => k)

    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Missing cookie fields: ${missing.join(', ')}` },
        { status: 400 },
      )
    }

    const cookies: ChatikCookies = {
      hhtoken: hhtoken!,
      hhuid: hhuid!,
      crypted_hhuid: crypted_hhuid!,
      _xsrf: _xsrf!,
    }

    // Validate cookies by making a test request to /chats
    try {
      await getChats(cookies)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      console.error('[/api/hh/cookie-login] Cookie validation failed:', message)
      return NextResponse.json(
        { error: `Cookie validation failed: ${message}. Please check your cookies and try again.` },
        { status: 401 },
      )
    }

    // Ensure the user exists (create if not — for MVP convenience)
    const user = await db.user.upsert({
      where: { id: userId },
      update: {
        hhCookies: JSON.stringify(cookies),
      },
      create: {
        id: userId,
        email: `${userId}@hh-copilot.local`,
        hhCookies: JSON.stringify(cookies),
      },
    })

    return NextResponse.json({
      success: true,
      userId: user.id,
      message: 'Chatik cookies validated and stored successfully.',
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[/api/hh/cookie-login] Error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
