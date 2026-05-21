import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

interface AnalyticsStats {
  value: string
  label: string
  color: string
}

interface AnalyticsResponse {
  stats: AnalyticsStats[]
  weekChart: number[]
  weekDays: string[]
}

const WEEK_DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

function getDayOfWeek(date: Date): number {
  // JS getDay() returns 0=Sun, 1=Mon...6=Sat
  // We need 0=Mon, 1=Tue...6=Sun
  const jsDay = date.getDay()
  return jsDay === 0 ? 6 : jsDay - 1
}

function getDefaultResponse(): AnalyticsResponse {
  return {
    stats: [
      { value: '0', label: 'Отклики', color: 'text-cyan' },
      { value: '0', label: 'Приглашения', color: 'text-emerald-400' },
      { value: '0%', label: 'Конверсия', color: 'text-emerald' },
      { value: '0%', label: 'Совпадение', color: 'text-orange-400' },
    ],
    weekChart: [0, 0, 0, 0, 0, 0, 0],
    weekDays: WEEK_DAYS,
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const userId = searchParams.get('userId') || 'mock-user-001'

    // Calculate date boundaries for the last 7 days
    const now = new Date()
    const sevenDaysAgo = new Date(now)
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6) // include today + 6 previous days
    sevenDaysAgo.setHours(0, 0, 0, 0)

    // Query all applications for the user
    const applications = await db.application.findMany({
      where: { userId },
      select: {
        status: true,
        matchScore: true,
        createdAt: true,
      },
    })

    // Query chats for the user
    const chats = await db.chat.findMany({
      where: { userId },
      select: {
        id: true,
        unreadCount: true,
      },
    })

    // Calculate stats
    const totalApplications = applications.length
    const invitedCount = applications.filter((a) => a.status === 'INVITED').length
    const _pendingCount = applications.filter((a) => a.status === 'PENDING').length
    const _rejectedCount = applications.filter((a) => a.status === 'REJECTED').length
    const _viewedCount = applications.filter((a) => a.status === 'VIEWED').length

    // Conversion rate = INVITED / total * 100
    const conversionRate =
      totalApplications > 0 ? Math.round((invitedCount / totalApplications) * 100) : 0

    // Average match score
    const applicationsWithScore = applications.filter((a) => a.matchScore !== null)
    const avgMatchScore =
      applicationsWithScore.length > 0
        ? Math.round(
            applicationsWithScore.reduce((sum, a) => sum + (a.matchScore ?? 0), 0) /
              applicationsWithScore.length
          )
        : 0

    // Total chats count
    const _totalChats = chats.length

    // Unread messages count (sum of unreadCount across all chats)
    const _unreadMessages = chats.reduce((sum, c) => sum + c.unreadCount, 0)

    // Build week chart: applications per day for last 7 days
    const weekChart = new Array(7).fill(0) as number[]

    applications.forEach((app) => {
      const appDate = new Date(app.createdAt)
      if (appDate >= sevenDaysAgo) {
        const daysFromStart = Math.floor(
          (appDate.getTime() - sevenDaysAgo.getTime()) / (1000 * 60 * 60 * 24)
        )
        if (daysFromStart >= 0 && daysFromStart < 7) {
          weekChart[daysFromStart]++
        }
      }
    })

    // Build the stats array
    const stats: AnalyticsStats[] = [
      { value: String(totalApplications), label: 'Отклики', color: 'text-cyan' },
      { value: String(invitedCount), label: 'Приглашения', color: 'text-emerald-400' },
      { value: `${conversionRate}%`, label: 'Конверсия', color: 'text-emerald' },
      { value: `${avgMatchScore}%`, label: 'Совпадение', color: 'text-orange-400' },
    ]

    // Adjust weekDays to align with the actual days of the week
    const startDayIndex = getDayOfWeek(sevenDaysAgo)
    const alignedWeekDays = Array.from({ length: 7 }, (_, i) => {
      return WEEK_DAYS[(startDayIndex + i) % 7]
    })

    const response: AnalyticsResponse = {
      stats,
      weekChart,
      weekDays: alignedWeekDays,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('[Analytics API] Error:', error)
    // Return reasonable defaults instead of errors
    return NextResponse.json(getDefaultResponse())
  }
}
