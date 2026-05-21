import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { resolveUserId } from '@/lib/mock-auth'

export const dynamic = 'force-dynamic'

/** GET /api/profile — get current user profile */
export async function GET(req: NextRequest) {
  try {
    const userId = await resolveUserId(req, { queryParam: 'userId' })

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        plan: true,
        resumeText: true,
        preferences: true,
        streakDays: true,
        lastActiveAt: true,
        hhToken: true,
        hhCookies: true,
        createdAt: true,
      },
    })

    if (!user) {
      // Auto-create mock user if not exists
      const created = await db.user.create({
        data: {
          id: userId,
          email: 'demo@hhcopilot.ru',
          name: 'Сергей Т.',
          plan: 'PRO',
          streakDays: 7,
        },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          plan: true,
          resumeText: true,
          preferences: true,
          streakDays: true,
          lastActiveAt: true,
          hhToken: true,
          hhCookies: true,
          createdAt: true,
        },
      })
      return NextResponse.json(created)
    }

    // Don't expose raw tokens/cookies to client
    return NextResponse.json({
      ...user,
      hhToken: !!user.hhToken,
      hhCookies: !!user.hhCookies,
    })
  } catch (error) {
    console.error('[/api/profile GET] Error:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

/** PATCH /api/profile — update user profile */
export async function PATCH(req: NextRequest) {
  try {
    const userId = await resolveUserId(req, { bodyField: 'userId' })
    const body = await req.json()

    const { name, resumeText, preferences } = body as {
      name?: string
      resumeText?: string
      preferences?: string
    }

    // Ensure user exists
    const existing = await db.user.findUnique({ where: { id: userId } })
    if (!existing) {
      await db.user.create({
        data: {
          id: userId,
          email: 'demo@hhcopilot.ru',
          name: name ?? 'Сергей Т.',
          plan: 'PRO',
          resumeText,
          preferences,
        },
      })
    } else {
      await db.user.update({
        where: { id: userId },
        data: {
          ...(name !== undefined && { name }),
          ...(resumeText !== undefined && { resumeText }),
          ...(preferences !== undefined && { preferences }),
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[/api/profile PATCH] Error:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
