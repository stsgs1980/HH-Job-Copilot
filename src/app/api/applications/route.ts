import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { resolveUserId } from '@/lib/mock-auth'
import { chatCompletion } from '@/lib/ai'

export const dynamic = 'force-dynamic'

/**
 * GET /api/applications — list user's job applications
 */
export async function GET(req: NextRequest) {
  try {
    const userId = await resolveUserId(req, { queryParam: 'userId' })
    const { searchParams } = req.nextUrl
    const status = searchParams.get('status')

    const where: Record<string, unknown> = { userId }
    if (status) where.status = status

    const applications = await db.application.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    // Also get stats
    const [total, pending, viewed, invited, rejected] = await Promise.all([
      db.application.count({ where: { userId } }),
      db.application.count({ where: { userId, status: 'PENDING' } }),
      db.application.count({ where: { userId, status: 'VIEWED' } }),
      db.application.count({ where: { userId, status: 'INVITED' } }),
      db.application.count({ where: { userId, status: 'REJECTED' } }),
    ])

    return NextResponse.json({
      applications,
      stats: { total, pending, viewed, invited, rejected },
    })
  } catch (error) {
    console.error('[/api/applications GET] Error:', error)
    return NextResponse.json({
      applications: [],
      stats: { total: 0, pending: 0, viewed: 0, invited: 0, rejected: 0 },
    })
  }
}

/**
 * POST /api/applications — create a new application (apply to vacancy)
 * Body: { title, company, location?, salary?, vacancyUrl?, matchScore? }
 */
export async function POST(req: NextRequest) {
  try {
    const userId = await resolveUserId(req, { bodyField: 'userId' })
    const body = await req.json()
    const { title, company, location, salary, vacancyUrl, matchScore, generateCoverLetter, resumeText } = body as {
      title: string
      company: string
      location?: string
      salary?: string
      vacancyUrl?: string
      matchScore?: number
      generateCoverLetter?: boolean
      resumeText?: string
    }

    if (!title || !company) {
      return NextResponse.json({ error: 'title and company are required' }, { status: 400 })
    }

    // Generate AI cover letter if requested
    let coverLetter: string | undefined
    if (generateCoverLetter) {
      try {
        const user = await db.user.findUnique({
          where: { id: userId },
          select: { resumeText: true },
        })
        const resume = resumeText ?? user?.resumeText ?? ''

        const letterResponse = await chatCompletion([
          {
            role: 'user',
            content: `Напиши краткое сопроводительное письмо для отклика на вакансию "${title}" в компании "${company}".
${location ? `Локация: ${location}` : ''}
${salary ? `Зарплата: ${salary}` : ''}
${resume ? `Моё резюме: ${resume.substring(0, 500)}` : ''}

Письмо должно быть: коротким (3-4 абзаца), профессиональным, с упоминанием релевантного опыта. Без излишней формальности.`,
          },
        ])
        coverLetter = letterResponse
      } catch {
        coverLetter = undefined
      }
    }

    const application = await db.application.create({
      data: {
        userId,
        title,
        company,
        location,
        salary,
        vacancyUrl,
        matchScore,
        coverLetter,
        status: 'PENDING',
      },
    })

    return NextResponse.json({ application })
  } catch (error) {
    console.error('[/api/applications POST] Error:', error)
    return NextResponse.json({ error: 'Failed to create application' }, { status: 500 })
  }
}

/**
 * PATCH /api/applications — update application status
 * Body: { id, status, coverLetter? }
 */
export async function PATCH(req: NextRequest) {
  try {
    const userId = await resolveUserId(req, { bodyField: 'userId' })
    const body = await req.json()
    const { id, status, coverLetter } = body as {
      id: string
      status?: string
      coverLetter?: string
    }

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    // Verify ownership
    const existing = await db.application.findFirst({
      where: { id, userId },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    const updateData: Record<string, unknown> = {}
    if (status) {
      updateData.status = status
      // Set timestamps based on status
      if (status === 'VIEWED') updateData.viewedAt = new Date()
      if (status === 'INVITED') updateData.invitedAt = new Date()
      if (status === 'REJECTED') updateData.rejectedAt = new Date()
    }
    if (coverLetter !== undefined) {
      updateData.coverLetter = coverLetter
      updateData.coverLetterEdited = true
    }

    const application = await db.application.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ application })
  } catch (error) {
    console.error('[/api/applications PATCH] Error:', error)
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 })
  }
}

/**
 * DELETE /api/applications — delete an application
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

    // Verify ownership
    const existing = await db.application.findFirst({
      where: { id, userId },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    await db.application.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[/api/applications DELETE] Error:', error)
    return NextResponse.json({ error: 'Failed to delete application' }, { status: 500 })
  }
}
