import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/hh/oauth
 * Redirect to HH.ru OAuth authorization page.
 *
 * Reads HH_CLIENT_ID and HH_REDIRECT_URL from environment variables.
 * Optionally accepts a `state` query param for CSRF protection.
 */
export async function GET(req: NextRequest) {
  const clientId = process.env.HH_CLIENT_ID
  const redirectUri = process.env.HH_REDIRECT_URL

  if (!clientId || !redirectUri) {
    console.error(
      '[/api/hh/oauth] Missing HH_CLIENT_ID or HH_REDIRECT_URL env vars',
    )
    return NextResponse.json(
      { error: 'HH.ru OAuth is not configured on the server.' },
      { status: 500 },
    )
  }

  // Optional state param for CSRF protection
  const state = req.nextUrl.searchParams.get('state') ?? crypto.randomUUID()

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
  })

  const oauthUrl = `https://hh.ru/oauth/authorize?${params}`

  return NextResponse.redirect(oauthUrl)
}
