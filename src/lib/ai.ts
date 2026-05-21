// ============================================================
// z-ai-sdk wrapper for LLM, Humanizer, ASR, TTS
// ============================================================

import ZAI from 'z-ai-web-dev-sdk'

let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null

async function getZAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create()
  }
  return zaiInstance
}

// ---- LLM Chat ----

const SYSTEM_PROMPT = `Ты — HH Job Copilot, AI-ассистент для поиска работы на HH.ru. Твоя задача:
1. Помогать пользователю находить подходящие вакансии
2. Составлять персонализированные сопроводительные письма
3. Отвечать на сообщения HR от имени пользователя
4. Давать советы по подготовке к интервью
5. Анализировать профиль и предлагать улучшения

Стиль общения: дружелюбный, профессиональный, конкретный. Отвечай на русском языке.`

export async function chatCompletion(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
): Promise<string> {
  const zai = await getZAI()
  const completion = await zai.chat.completions.create({
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages,
    ],
  })
  return completion.choices[0]?.message?.content ?? ''
}

// ---- Humanizer ----

const HUMANIZER_PROMPT = `Перепиши текст так, чтобы он звучал как сообщение от живого человека. Правила:
- Разнообразная длина предложений (короткие и длинные)
- Естественные переходы между мыслями
- Минимум 1-2 небольших отклонения от формальности (но без сленга)
- Редкие эмодзи (не более одного на сообщение, и не всегда)
- Без типичных AI-паттернов ("Отлично!", "Конечно!", "Я с радостью помогу")
- Без идеальной пунктуации — можно пропустить запятую
- Человек может использовать "не" вместо "нет", сокращения вроде "спс", "ок"`

export async function humanize(text: string): Promise<string> {
  const zai = await getZAI()
  const completion = await zai.chat.completions.create({
    messages: [
      { role: 'system', content: HUMANIZER_PROMPT },
      { role: 'user', content: `Перепиши как живой человек:\n\n${text}` },
    ],
  })
  return completion.choices[0]?.message?.content ?? text
}

// ---- AI Reply for Chatik (auto-humanized in single call) ----

const HR_REPLY_PROMPT = `Ты — ассистент для ответа на сообщения HR от имени соискателя. Правила:
1. Отвечай вежливо, профессионально, конкретно
2. Показывай заинтересованность в позиции
3. Используй информацию из описания вакансии
4. Пиши естественно — как живой человек, не как AI
5. Разнообразная длина предложений
6. Без штампов вроде "Отлично!", "Конечно!", "Я с радостью помогу"
7. Можно偶尔 использовать сокращения вроде "ок", "спс"
8. Отвечай на русском языке`

export async function generateHRReply(
  context: {
    employerMessage: string
    vacancyTitle?: string
    company?: string
    userResume?: string
  },
): Promise<{ raw: string; humanized: string }> {
  const zai = await getZAI()

  // Single optimized call — generates humanized reply directly
  const prompt = `HR из компании "${context.company ?? 'компания'}" (вакансия: ${context.vacancyTitle ?? 'не указана'}) написал:
"${context.employerMessage}"

${context.userResume ? `Резюме соискателя:\n${context.userResume}\n\n` : ''}Напиши ответ от имени соискателя — естественно, как живой человек.`

  const completion = await zai.chat.completions.create({
    messages: [
      { role: 'system', content: HR_REPLY_PROMPT },
      { role: 'user', content: prompt },
    ],
  })

  const humanized = completion.choices[0]?.message?.content ?? ''

  // For the "raw" version, strip some humanization markers
  const raw = humanized
    .replace(/[👋🙏😊👍✨🎉]/g, '')
    .replace(/\b(ок|спс|ну)\b/gi, m => m === 'ок' ? 'хорошо' : m === 'спс' ? 'спасибо' : m)

  return { raw, humanized }
}
