'use client'

import { Search, Zap, MessageSquare, Mic, BarChart3, User } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { FeatureCard } from '@/types'

const features: FeatureCard[] = [
  { icon: Search, title: 'AI-поиск вакансий', desc: 'Автоматический подбор вакансий по вашим навыкам и предпочтениям. Совпадение до 95%.', accent: 'text-coral' },
  { icon: Zap, title: 'Авто-отклики', desc: 'Массовые отклики с персонализированными сопроводительными письмами от AI за секунды.', accent: 'text-green-accent' },
  { icon: MessageSquare, title: 'Чат с HR', desc: 'AI-ответы в чатах HH.ru через Chatik API с Humanizer — рекрутер не заметит AI.', accent: 'text-coral' },
  { icon: Mic, title: 'Интервью-ассистент', desc: 'ASR транскрибирует вопросы, AI генерирует подсказки на основе вашего опыта в реальном времени.', accent: 'text-green-accent' },
  { icon: BarChart3, title: 'Аналитика', desc: 'Трекинг откликов, приглашений, конверсий. Узнайте, что работает, а что нет.', accent: 'text-coral' },
  { icon: User, title: 'Профиль', desc: 'Оптимизация профиля под конкретные вакансии. AI подскажет, что добавить или изменить.', accent: 'text-green-accent' },
]

export function Features() {
  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">Всё для поиска работы</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">От автоматических откликов до AI-подсказок на интервью</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <Card key={i} className={`group border-border/50 hover-glow tilt-card fade-in-up stagger-${i + 1}`}>
              <CardHeader>
                <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-2 ${f.accent}`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <CardTitle className="text-lg font-bold">{f.title}</CardTitle>
              </CardHeader>
              <CardContent><p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p></CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
