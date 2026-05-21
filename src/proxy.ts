// ============================================================
// Proxy (Next.js 16 replacement for middleware.ts)
// Route protection with NextAuth / mock fallback
// When FEATURE_NEXTAUTH=false: skip all checks (mock mode)
// When FEATURE_NEXTAUTH=true: protect /dashboard, /api/hh/*, /api/ai/*
// Public routes: /, /login, /api/auth/*, /api/hh/oauth/*
// ============================================================

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

/** Routes that don't require authentication */
const PUBLIC_ROUTES = [
  '/',
  '/login',
]

/** Route prefixes that are always public */
const PUBLIC_PREFIXES = [
  '/api/auth/',
  '/api/hh/oauth/',
]

/** Route prefixes that require authentication when NextAuth is enabled */
const PROTECTED_PREFIXES = [
  '/dashboard',
  '/api/hh/',
  '/api/ai/',
]

/** Check if a pathname matches a public route */
function isPublicRoute(pathname: string): boolean {
  if (PUBLIC_ROUTES.includes(pathname)) return true
  if (PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return true
  return false
}

/** Check if a pathname matches a protected route */
function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // When FEATURE_NEXTAUTH=false, skip all auth checks
  if (process.env.NEXT_PUBLIC_FEATURE_NEXTAUTH !== 'true') {
    return NextResponse.next()
  }

  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  // Only check protected routes
  if (!isProtectedRoute(pathname)) {
    return NextResponse.next()
  }

  // Check for JWT token
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    if (!token) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 },
        )
      }

      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  } catch (error) {
    console.error('[Proxy] Token verification error:', error)

    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 },
      )
    }

    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|logo\\.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
