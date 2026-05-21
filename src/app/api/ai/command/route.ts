import { NextRequest, NextResponse } from 'next/server'
import { chatCompletion } from '@/lib/ai'
import { db } from '@/lib/db'
import { resolveUserId } from '@/lib/mock-auth'

export const dynamic = 'force-dynamic'

/**
 * POST /api/ai/command
 * Smart AI command that understands user intent and performs actions.
 * Returns structured response with action type and data.
 */
export async function POST(req: NextRequest) {
  try {
    const userId = await resolveUserId(req, { bodyField: 'userId' })
    const body = await req.json()
    const { message } = body as { message: string }

    if (!message?.trim()) {
      return NextResponse.json({ error: 'message is required' }, { status: 400 })
    }

    // Get user context
    const [user, applications, interviews, chats] = await Promise.all([
      db.user.findUnique({
        where: { id: userId },
        select: { resumeText: true, preferences: true, name: true, plan: true },
      }),
      db.application.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      db.interview.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      db.chat.findMany({
        where: { userId },
        orderBy: { lastMessageAt: 'desc' },
        take: 5,
      }),
    ])

    const preferences = user?.preferences ? JSON.parse(user.preferences) : {}
    const resume = user?.resumeText ?? ''

    // Build context-aware system prompt
    const contextPrompt = `Ты — HH Job Copilot, AI-ассистент для поиска работы. У тебя есть доступ к данным пользователя.

ДАННЫЕ ПОЛЬЗОВАТЕЛЯ:
- Имя: ${user?.name ?? 'Пользователь'}
- Тариф: ${user?.plan ?? 'STARTER'}
${resume ? `- Резюме: ${resume.substring(0, 500)}` : ''}
${preferences.salaryMin ? `- Зарплата: от ${preferences.salaryMin} до ${preferences.salaryMax} RUB` : ''}
${preferences.location ? `- Локация: ${preferences.location}` : ''}
${preferences.format ? `- Формат: ${preferences.format}` : ''}

ТЕКУЩИЕ ОТКЛИКИ (${applications.length}):
${applications.slice(0, 5).map(a => `- ${a.title} в ${a.company} (${a.status}, совпадение ${a.matchScore}%)`).join('\n')}

ИНТЕРВЬЮ (${interviews.length}):
${interviews.map(i => `- ${i.position} в ${i.company} (${i.status})`).join('\n')}

АКТИВНЫЕ ЧАТЫ (${chats.length}):
${chats.map(c => `- ${c.employerName}: "${c.lastMessage}" ${c.unreadCount > 0 ? `(непрочитанных: ${c.unreadCount})` : ''}`).join('\n')}

КОМАНДЫ КОТОРЫЕ ТЫ МОЖЕШЬ ВЫПОЛНИТЬ:
1. Поиск вакансий — если пользователь просит найти вакансии
2. Отклик — если пользователь хочет откликнуться
3. Ответ HR — если пользователь просит ответить на сообщение
4. Аналитика — если пользователь спрашивает про статистику
5. Создать интервью — если пользователь готовится к собеседованию
6. Общий вопрос — на всё остальное

Если пользователь просит найти вакансии, ответь в формате:
SEARCH: [запрос для поиска]

Если просит ответить HR:
HR_REPLY: [имя работодателя]: [текст ответа]

Если просит создать интервью:
INTERVIEW: [компания] | [позиция]

Во всех остальных случаях — отвечай естественно как ассистент. Отвечай на русском.`

    const aiResponse = await chatCompletion([
      { role: 'system', content: contextPrompt },
      { role: 'user', content: message },
    ])

    // Parse the response for commands
    let action: string | null = null
    let actionData: Record<string, string> = {}
    let text = aiResponse

    // Check for SEARCH command
    const searchMatch = aiResponse.match(/SEARCH:\s*\[([^\]]+)\]/)
    if (searchMatch) {
      action = 'search'
      actionData.query = searchMatch[1]
      text = aiResponse.replace(/SEARCH:\s*\[[^\]]+\]/, '').trim()
    }

    // Check for HR_REPLY command
    const hrMatch = aiResponse.match(/HR_REPLY:\s*\[([^\]]+)\]:\s*\[([^\]]+)\]/)
    if (hrMatch) {
      action = 'hr_reply'
      actionData.employer = hrMatch[1]
      actionData.reply = hrMatch[2]
      text = aiResponse.replace(/HR_REPLY:\s*\[[^\]]+\]:\s*\[[^\]]+\]/, '').trim()
    }

    // Check for INTERVIEW command
    const interviewMatch = aiResponse.match(/INTERVIEW:\s*\[([^\]]+)\]\s*\|\s*\[([^\]]+)\]/)
    if (interviewMatch) {
      action = 'interview'
      actionData.company = interviewMatch[1]
      actionData.position = interviewMatch[2]
      text = aiResponse.replace(/INTERVIEW:\s*\[[^\]]+\]\s*\|\s*\[[^\]]+\]/, '').trim()
    }

    // Save AI message to DB (non-blocking)
    db.aIMessage.create({
      data: {
        userId,
        role: 'assistant',
        content: aiResponse,
        source: 'command',
      },
    }).catch(() => {})

    return NextResponse.json({
      response: text,
      action,
      actionData: Object.keys(actionData).length > 0 ? actionData : undefined,
    })
  } catch (error) {
    console.error('[/api/ai/command] Error:', error)
    return NextResponse.json({ error: 'Failed to process command' }, { status: 500 })
  }
}
