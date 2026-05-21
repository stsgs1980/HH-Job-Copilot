import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { resolveUserId } from '@/lib/mock-auth'

export const dynamic = 'force-dynamic'

/**
 * GET /api/interviews — list user's interviews
 */
export async function GET(req: NextRequest) {
  try {
    const userId = await resolveUserId(req, { queryParam: 'userId' })
    const { searchParams } = req.nextUrl
    const status = searchParams.get('status')

    const where: Record<string, unknown> = { userId }
    if (status) where.status = status

    const interviews = await db.interview.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    const [scheduled, inProgress, completed] = await Promise.all([
      db.interview.count({ where: { userId, status: 'SCHEDULED' } }),
      db.interview.count({ where: { userId, status: 'IN_PROGRESS' } }),
      db.interview.count({ where: { userId, status: 'COMPLETED' } }),
    ])

    return NextResponse.json({
      interviews,
      stats: { scheduled, inProgress, completed, total: scheduled + inProgress + completed },
    })
  } catch (error) {
    console.error('[/api/interviews GET] Error:', error)
    return NextResponse.json({
      interviews: [],
      stats: { scheduled: 0, inProgress: 0, completed: 0, total: 0 },
    })
  }
}

/**
 * POST /api/interviews — create a new interview
 * Body: { company, position, scheduledAt?, vacancyTitle?, vacancyId? }
 */
export async function POST(req: NextRequest) {
  try {
    const userId = await resolveUserId(req, { bodyField: 'userId' })
    const body = await req.json()
    const { company, position, scheduledAt, vacancyTitle, vacancyId } = body as {
      company: string
      position: string
      scheduledAt?: string
      vacancyTitle?: string
      vacancyId?: string
    }

    if (!company || !position) {
      return NextResponse.json({ error: 'company and position are required' }, { status: 400 })
    }

    // Get user resume for context
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { resumeText: true },
    })

    const interview = await db.interview.create({
      data: {
        userId,
        company,
        position,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        vacancyTitle,
        vacancyId,
        resumeContext: user?.resumeText?.substring(0, 1000) ?? null,
        status: scheduledAt ? 'SCHEDULED' : 'IN_PROGRESS',
      },
    })

    return NextResponse.json({ interview })
  } catch (error) {
    console.error('[/api/interviews POST] Error:', error)
    return NextResponse.json({ error: 'Failed to create interview' }, { status: 500 })
  }
}

/**
 * PATCH /api/interviews — update interview (status, transcript, summary)
 * Body: { id, status?, transcript?, aiHints?, aiSummary? }
 */
export async function PATCH(req: NextRequest) {
  try {
    const userId = await resolveUserId(req, { bodyField: 'userId' })
    const body = await req.json()
    const { id, status, transcript, aiHints, aiSummary } = body as {
      id: string
      status?: string
      transcript?: string
      aiHints?: string
      aiSummary?: string
    }

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const existing = await db.interview.findFirst({
      where: { id, userId },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 })
    }

    const updateData: Record<string, unknown> = {}
    if (status) updateData.status = status
    if (transcript !== undefined) updateData.transcript = transcript
    if (aiHints !== undefined) updateData.aiHints = aiHints
    if (aiSummary !== undefined) updateData.aiSummary = aiSummary

    const interview = await db.interview.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ interview })
  } catch (error) {
    console.error('[/api/interviews PATCH] Error:', error)
    return NextResponse.json({ error: 'Failed to update interview' }, { status: 500 })
  }
}

/**
 * DELETE /api/interviews — delete an interview
 * Body: { id }
 */
export async function DELETE(req: NextRequest) {
  try {
    const userId = await resolveUserId(req, { bodyField: 'userId' })
    const body = await req.json()
    const { id } = body as { id: string }

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const existing = await db.interview.findFirst({
      where: { id, userId },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 })
    }

    await db.interview.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[/api/interviews DELETE] Error:', error)
    return NextResponse.json({ error: 'Failed to delete interview' }, { status: 500 })
  }
}
