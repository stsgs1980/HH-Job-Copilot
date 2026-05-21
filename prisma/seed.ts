// ============================================================
// Seed script — demo data for HH Job Copilot
// Run: npx tsx prisma/seed.ts
// ============================================================

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  const userId = 'mock-user-001'

  // Upsert user
  const user = await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: {
      id: userId,
      email: 'demo@hhcopilot.ru',
      name: 'Сергей Т.',
      plan: 'PRO',
      streakDays: 7,
      resumeText: 'Frontend Developer с 5-летним опытом. Основной стек: React, Next.js, TypeScript, Tailwind CSS. Работал в Яндекс (3 года), Avito (2 года). Опыт с SSR, ISR, A/B тестирование, оптимизация производительности. Английский B2.',
      preferences: JSON.stringify({
        salaryMin: 250000,
        salaryMax: 400000,
        location: 'Удаленка',
        format: 'remote',
      }),
    },
  })

  console.log(`User: ${user.name} (${user.id})`)

  // Create chats
  const chat1 = await prisma.chat.upsert({
    where: { id: 'chat-001' },
    update: {},
    create: {
      id: 'chat-001',
      userId,
      employerName: 'Яндекс — Елена',
      vacancyTitle: 'Senior Frontend Developer',
      lastMessage: 'Когда сможете пройти собеседование?',
      lastMessageAt: new Date(Date.now() - 2 * 60 * 1000),
      unreadCount: 1,
      aiRepliesOn: true,
    },
  })

  const chat2 = await prisma.chat.upsert({
    where: { id: 'chat-002' },
    update: {},
    create: {
      id: 'chat-002',
      userId,
      employerName: 'Avito — Михаил',
      vacancyTitle: 'React Developer',
      lastMessage: 'Расскажите о вашем опыте с Next.js',
      lastMessageAt: new Date(Date.now() - 15 * 60 * 1000),
      unreadCount: 1,
      aiRepliesOn: true,
    },
  })

  const chat3 = await prisma.chat.upsert({
    where: { id: 'chat-003' },
    update: {},
    create: {
      id: 'chat-003',
      userId,
      employerName: 'Тинькофф — Анна',
      vacancyTitle: 'Frontend Lead',
      lastMessage: 'Отправьте портфолио',
      lastMessageAt: new Date(Date.now() - 60 * 60 * 1000),
      unreadCount: 0,
      aiRepliesOn: false,
    },
  })

  const chat4 = await prisma.chat.upsert({
    where: { id: 'chat-004' },
    update: {},
    create: {
      id: 'chat-004',
      userId,
      employerName: 'VK — Дмитрий',
      vacancyTitle: 'Frontend Engineer',
      lastMessage: 'Спасибо за отклик! Нам интересен ваш опыт...',
      lastMessageAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      unreadCount: 0,
      aiRepliesOn: true,
    },
  })

  const chat5 = await prisma.chat.upsert({
    where: { id: 'chat-005' },
    update: {},
    create: {
      id: 'chat-005',
      userId,
      employerName: 'Сбер — Мария',
      vacancyTitle: 'Senior React Developer',
      lastMessage: 'Приглашаем на техническое интервью!',
      lastMessageAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      unreadCount: 1,
      aiRepliesOn: true,
    },
  })

  console.log(`Chats: 5 created`)

  // Create messages for chat1
  await prisma.message.createMany({
    data: [
      { chatId: chat1.id, role: 'EMPLOYER', content: 'Здравствуйте! Нас заинтересовало ваше резюме на позицию Senior Frontend Developer.', sentVia: 'MANUAL' },
      { chatId: chat1.id, role: 'EMPLOYER', content: 'Когда сможете пройти собеседование?', sentVia: 'MANUAL' },
    ],
  })

  await prisma.message.createMany({
    data: [
      { chatId: chat2.id, role: 'EMPLOYER', content: 'Здравствуйте, Сергей! У нас есть открытая позиция React Developer.', sentVia: 'MANUAL' },
      { chatId: chat2.id, role: 'EMPLOYER', content: 'Расскажите о вашем опыте с Next.js', sentVia: 'MANUAL' },
    ],
  })

  await prisma.message.createMany({
    data: [
      { chatId: chat5.id, role: 'EMPLOYER', content: 'Здравствуйте! По результатам оценки резюме приглашаем на техническое интервью.', sentVia: 'MANUAL' },
    ],
  })

  console.log('Messages created')

  // Create applications
  const applications = [
    { title: 'Senior Frontend Developer', company: 'Яндекс', location: 'Удаленка', salary: '300-400k RUB', matchScore: 95, status: 'INVITED' as const, invitedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), coverLetter: 'Здравствуйте! Меня заинтересовала вакансия Senior Frontend Developer. У меня 5 лет опыта с React и Next.js, включая работу в крупных проектах с 500k+ MAU. Буду рад обсудить детали на интервью.' },
    { title: 'React Developer', company: 'Avito', location: 'Удаленка', salary: '250-350k RUB', matchScore: 92, status: 'VIEWED' as const, viewedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), coverLetter: 'Привет! Пишу по поводу React Developer позиции. Работаю с React 5+ лет, с Next.js — 3 года. Последний проект — e-commerce на ISR с каталогом 100k+ товаров.' },
    { title: 'Frontend Lead', company: 'Тинькофф', location: 'Удаленка', salary: '350-500k RUB', matchScore: 87, status: 'PENDING' as const },
    { title: 'Frontend Engineer', company: 'VK', location: 'СПб / Удаленка', salary: '280-380k RUB', matchScore: 84, status: 'PENDING' as const },
    { title: 'Senior React Developer', company: 'Сбер', location: 'Удаленка', salary: '300-420k RUB', matchScore: 89, status: 'INVITED' as const, invitedAt: new Date(Date.now() - 12 * 60 * 60 * 1000) },
    { title: 'Fullstack Developer', company: 'Ozon', location: 'Удаленка', salary: '270-370k RUB', matchScore: 78, status: 'REJECTED' as const, rejectedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
    { title: 'Web Developer', company: 'МТС', location: 'Москва', salary: '200-280k RUB', matchScore: 72, status: 'VIEWED' as const, viewedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
    { title: 'Frontend Developer', company: 'HeadHunter', location: 'Удаленка', salary: '260-360k RUB', matchScore: 91, status: 'PENDING' as const },
  ]

  // Create with different dates for week chart
  for (const app of applications) {
    // Spread over last 7 days for chart data
    const daysAgo = Math.floor(Math.random() * 7)
    const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)

    await prisma.application.create({
      data: {
        userId,
        ...app,
        createdAt,
      },
    })
  }

  console.log(`Applications: ${applications.length} created`)

  // Create interviews
  const interviews = [
    { company: 'Яндекс', position: 'Senior Frontend Developer', status: 'SCHEDULED' as const, scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), vacancyTitle: 'Senior Frontend Developer' },
    { company: 'Сбер', position: 'Senior React Developer', status: 'IN_PROGRESS' as const, vacancyTitle: 'Senior React Developer' },
    { company: 'Avito', position: 'React Developer', status: 'COMPLETED' as const, vacancyTitle: 'React Developer', aiSummary: 'Интервью прошло успешно. Кандидат продемонстрировал глубокие знания React и Next.js. Рекомендуется на позицию.' },
  ]

  for (const interview of interviews) {
    await prisma.interview.create({
      data: {
        userId,
        ...interview,
      },
    })
  }

  console.log(`Interviews: ${interviews.length} created`)

  // Create some AI messages for context
  const aiMessages = [
    { role: 'user', content: 'Найди вакансии React Developer', source: 'chat' },
    { role: 'assistant', content: 'Нашёл 12 вакансий React Developer с зарплатой от 250k. Топ-3: Яндекс (300-400k), Avito (250-350k), Тинькофф (350-500k). Хотите откликнуться?', source: 'chat' },
    { role: 'user', content: 'Откликнись на все три', source: 'chat' },
    { role: 'assistant', content: 'Готово! Отправил отклики с персонализированными сопроводительными письмами. Яндекс — 95% совпадение, Avito — 92%, Тинькофф — 87%.', source: 'chat' },
  ]

  for (const msg of aiMessages) {
    await prisma.aIMessage.create({
      data: {
        userId,
        ...msg,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      },
    })
  }

  console.log('AI Messages: 4 created')
  console.log('\n✅ Seed complete!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
