import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { resolveUserId } from '@/lib/mock-auth'

/**
 * GET /api/hh/oauth/callback
 * Handle OAuth callback from HH.ru.
 *
 * Query params (provided by HH.ru redirect):
 *   code  — authorization code to exchange for tokens
 *   state — CSRF state (should match the one sent, but we skip validation for MVP)
 *
 * Exchanges the code for an access token, then stores it in the DB.
 */
export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get('code')

    if (!code) {
      return NextResponse.json(
        { error: 'Missing "code" parameter from HH.ru OAuth callback.' },
        { status: 400 },
      )
    }

    const clientId = process.env.HH_CLIENT_ID
    const clientSecret = process.env.HH_CLIENT_SECRET
    const redirectUri = process.env.HH_REDIRECT_URL

    if (!clientId || !clientSecret || !redirectUri) {
      console.error(
        '[/api/hh/oauth/callback] Missing HH_CLIENT_ID, HH_CLIENT_SECRET, or HH_REDIRECT_URL env vars',
      )
      return NextResponse.json(
        { error: 'HH.ru OAuth is not configured on the server.' },
        { status: 500 },
      )
    }

    // Exchange code for access token
    const tokenRes = await fetch('https://hh.ru/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
      }),
    })

    if (!tokenRes.ok) {
      const errBody = await tokenRes.text()
      console.error('[/api/hh/oauth/callback] Token exchange failed:', errBody)
      return NextResponse.json(
        { error: 'Failed to exchange code for access token.', details: errBody },
        { status: 502 },
      )
    }

    const tokenData = await tokenRes.json()
    const {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: expiresIn,
    } = tokenData as {
      access_token: string
      refresh_token: string
      expires_in: number
    }

    // Resolve userId from session or fallback to query param
    const userId = await resolveUserId(req, { queryParam: 'userId' })

    // Store tokens in DB
    const expiresAt = new Date(Date.now() + expiresIn * 1000)
    await db.user.upsert({
      where: { id: userId },
      update: {
        hhToken: accessToken,
        hhRefreshToken: refreshToken,
        hhTokenExpiresAt: expiresAt,
      },
      create: {
        id: userId,
        email: `${userId}@hh-copilot.local`,
        hhToken: accessToken,
        hhRefreshToken: refreshToken,
        hhTokenExpiresAt: expiresAt,
      },
    })

    // Redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', req.url))
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[/api/hh/oauth/callback] Error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
