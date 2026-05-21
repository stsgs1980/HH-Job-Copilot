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

// ---- LLM Chat Streaming ----

export async function chatCompletionStream(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
): Promise<ReadableStream<Uint8Array>> {
  const zai = await getZAI()
  const stream = await zai.chat.completions.create({
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages,
    ],
    stream: true,
  })
  // z-ai-sdk returns response.body (ReadableStream) when stream=true
  return stream as ReadableStream<Uint8Array>
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

// ---- AI Reply for Chatik (auto-humanized) ----

export async function generateHRReply(
  context: {
    employerMessage: string
    vacancyTitle?: string
    company?: string
    userResume?: string
    previousMessages?: Array<{ role: string; content: string }>
  },
): Promise<{ raw: string; humanized: string }> {
  const prompt = `HR из компании "${context.company ?? 'компания'}" (вакансия: ${context.vacancyTitle ?? 'не указана'}) написал:
"${context.employerMessage}"

${context.userResume ? `Резюме пользователя:\n${context.userResume}\n\n` : ''}Составь вежливый, профессиональный ответ от имени соискателя. Ответ должен быть конкретным и показывать заинтересованность.`

  const raw = await chatCompletion([{ role: 'user', content: prompt }])
  const humanized = await humanize(raw)

  return { raw, humanized }
}
