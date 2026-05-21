import { NextRequest, NextResponse } from 'next/server'
import { chatCompletion } from '@/lib/ai'

const COVER_LETTER_SYSTEM_PROMPT = `Ты — эксперт по написанию сопроводительных писем для HH.ru. Твоя задача — составить профессиональное, персонализированное сопроводительное письмо на русском языке.

Правила:
1. Письмо должно быть конкретным — указывай, почему именно эта вакансия и компания интересны
2. Используй информацию из описания вакансии, чтобы показать соответствие требованиям
3. Если дано резюме, выдели релевантный опыт и достижения
4. Структура: приветствие → заинтересованность → релевантный опыт → закрытие
5. Тон: профессиональный, но живой — без штампов вроде "я целеустремленный командный игрок"
6. Длина: 3-5 абзацев, не более 250 слов
7. Обращайся к компании по имени, если оно указано
8. Если описание вакансии не дано, сделай письмо более универсальным, но с фокусом на позицию`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      vacancyTitle,
      company,
      vacancyDescription,
      resumeText,
    } = body as {
      vacancyTitle?: string
      company?: string
      vacancyDescription?: string
      resumeText?: string
    }

    if (!vacancyTitle || typeof vacancyTitle !== 'string' || vacancyTitle.trim().length === 0) {
      return NextResponse.json(
        { error: 'vacancyTitle is required and must be a non-empty string' },
        { status: 400 },
      )
    }

    const userMessage = `Составь сопроводительное письмо:
— Вакансия: ${vacancyTitle}
— Компания: ${company ?? 'не указана'}
${vacancyDescription ? `— Описание вакансии:\n${vacancyDescription}` : ''}
${resumeText ? `— Моё резюме:\n${resumeText}` : ''}`

    const coverLetter = await chatCompletion([
      { role: 'system', content: COVER_LETTER_SYSTEM_PROMPT },
      { role: 'user', content: userMessage },
    ])

    return NextResponse.json({ coverLetter })
  } catch (error) {
    console.error('[/api/ai/cover-letter] Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate cover letter' },
      { status: 500 },
    )
  }
}
