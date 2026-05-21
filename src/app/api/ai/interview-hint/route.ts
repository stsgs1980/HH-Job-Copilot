import { NextRequest, NextResponse } from 'next/server'
import { chatCompletion } from '@/lib/ai'
import { db } from '@/lib/db'
import { resolveUserId } from '@/lib/mock-auth'

const INTERVIEW_HINT_SYSTEM_PROMPT = `Ты — AI-ассистент на собеседовании. На основе вопроса интервьюера и контекста резюме, дай краткую, конкретную подсказку что ответить. Формат: 1-2 предложения с ключевыми моментами.

Правила:
- Будь конкретным — указывай примеры из опыта, если есть контекст резюме
- Не пиши длинный ответ — только суть, ключевые тезисы
- Если вопрос про слабые стороны, предложи честный ответ с акцентом на рост
- Если вопрос технический, дай структуру ответа (определение → пример → результат)
- Если нет контекста резюме, давай универсальные рекомендации по типу вопроса`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      interviewId,
      question,
      resumeContext,
      previousQA,
    } = body as {
      interviewId?: string
      question?: string
      resumeContext?: string
      previousQA?: Array<{ q: string; a: string }>
    }

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return NextResponse.json(
        { error: 'question is required and must be a non-empty string' },
        { status: 400 },
      )
    }

    // Build context from previous Q&A
    let previousContext = ''
    if (previousQA && previousQA.length > 0) {
      previousContext = '\n\nПредыдущие вопросы и ответы:\n' +
        previousQA
          .map((qa) => `Q: ${qa.q}\nA: ${qa.a}`)
          .join('\n\n')
    }

    const userMessage = `Вопрос интервьюера: "${question}"
${resumeContext ? `\nКонтекст из резюме:\n${resumeContext}` : ''}
${previousContext}

Дай краткую подсказку для ответа.`

    const hint = await chatCompletion([
      { role: 'system', content: INTERVIEW_HINT_SYSTEM_PROMPT },
      { role: 'user', content: userMessage },
    ])

    // Save to DB in background (non-blocking)
    const resolvedUserId = await resolveUserId(req, { bodyField: 'userId' })
    db.aIMessage.create({
      data: {
        userId: resolvedUserId,
        role: 'assistant',
        content: hint,
        source: 'interview',
        interviewId: interviewId ?? undefined,
      },
    }).catch(e => console.error('[/api/ai/interview-hint] DB save error:', e.message))

    return NextResponse.json({ hint })
  } catch (error) {
    console.error('[/api/ai/interview-hint] Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate interview hint' },
      { status: 500 },
    )
  }
}
