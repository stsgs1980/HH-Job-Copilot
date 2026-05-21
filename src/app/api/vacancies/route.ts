import { NextRequest, NextResponse } from 'next/server'
import { chatCompletion } from '@/lib/ai'
import { db } from '@/lib/db'
import { resolveUserId } from '@/lib/mock-auth'

export const dynamic = 'force-dynamic'

/**
 * GET /api/vacancies — get saved applications (vacancies user applied to)
 * Query params: status, page, limit
 */
export async function GET(req: NextRequest) {
  try {
    const userId = await resolveUserId(req, { queryParam: 'userId' })
    const { searchParams } = req.nextUrl
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') ?? '1', 10)
    const limit = parseInt(searchParams.get('limit') ?? '20', 10)

    const where: Record<string, unknown> = { userId }
    if (status) where.status = status

    const [applications, total] = await Promise.all([
      db.application.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.application.count({ where }),
    ])

    return NextResponse.json({
      applications,
      total,
      page,
      limit,
      hasMore: total > page * limit,
    })
  } catch (error) {
    console.error('[/api/vacancies GET] Error:', error)
    return NextResponse.json({ applications: [], total: 0, page: 1, limit: 20, hasMore: false })
  }
}

/**
 * POST /api/vacancies — AI-powered vacancy search
 * Body: { query: string, location?: string, salaryFrom?: number, salaryTo?: number }
 */
export async function POST(req: NextRequest) {
  try {
    const userId = await resolveUserId(req, { bodyField: 'userId' })
    const body = await req.json()
    const { query, location, salaryFrom, salaryTo } = body as {
      query: string
      location?: string
      salaryFrom?: number
      salaryTo?: number
    }

    if (!query?.trim()) {
      return NextResponse.json({ error: 'query is required' }, { status: 400 })
    }

    // Get user profile for context
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { resumeText: true, preferences: true },
    })

    const preferences = user?.preferences ? JSON.parse(user.preferences) : {}
    const resume = user?.resumeText ?? ''

    // Use AI to generate relevant vacancies based on user query
    const searchPrompt = `Ты — поисковый ассистент HH.ru. На основе запроса пользователя найди подходящие вакансии.

Запрос: "${query}"
${location ? `Локация: ${location}` : ''}
${salaryFrom ? `Зарплата от: ${salaryFrom}` : ''}
${salaryTo ? `Зарплата до: ${salaryTo}` : ''}
${resume ? `Резюме пользователя: ${resume.substring(0, 500)}` : ''}

Сгенерируй 6-8 реалистичных вакансий в формате JSON массива. Каждая вакансия должна иметь:
{
  "title": "Название позиции",
  "company": "Название компании (реальная российская IT компания)",
  "location": "Город или Удаленка",
  "salary": "Зарплата (например: 250-350k RUB)",
  "match": число 60-99 (процент совпадения с резюме),
  "description": "Краткое описание вакансии в 1-2 предложениях",
  "requirements": ["Требование 1", "Требование 2", "Требование 3"],
  "url": "https://hh.ru/vacancy/_fake_id"
}

Верни ТОЛЬКО JSON массив, без markdown и пояснений.`

    const aiResponse = await chatCompletion([
      { role: 'user', content: searchPrompt },
    ])

    // Parse AI response
    let vacancies
    try {
      // Try to extract JSON from the response
      const jsonMatch = aiResponse.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        vacancies = JSON.parse(jsonMatch[0])
      } else {
        vacancies = JSON.parse(aiResponse)
      }
    } catch {
      // If parsing fails, return a structured fallback
      vacancies = [
        {
          title: `${query} Developer`,
          company: 'IT Компания',
          location: location ?? 'Удаленка',
          salary: `${salaryFrom ?? 200}-${salaryTo ?? 400}k RUB`,
          match: 78,
          description: `Вакансия по вашему запросу "${query}"`,
          requirements: [query, 'Teamwork', 'Communication'],
          url: '#',
        },
      ]
    }

    return NextResponse.json({ vacancies, query })
  } catch (error) {
    console.error('[/api/vacancies POST] Error:', error)
    return NextResponse.json({ error: 'Failed to search vacancies' }, { status: 500 })
  }
}
