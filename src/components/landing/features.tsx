'use client'

import { Search, Zap, MessageSquare, Mic, BarChart3, Settings } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { FeatureCard } from '@/types'

const features: FeatureCard[] = [
  { icon: Zap, title: 'Авто-отклики', desc: 'ИИ анализирует вакансии и автоматически отправляет персонализированные отклики. Экономьте до 5 часов в день на рутине.', accent: 'text-cyan' },
  { icon: Mic, title: 'AI-подсказки', desc: 'Получайте подсказки в реальном времени во время собеседования. Whisper распознаёт речь, а GPT генерирует идеальные ответы.', accent: 'text-emerald' },
  { icon: Search, title: 'Умный поиск', desc: 'Алгоритм подбирает вакансии по вашему профилю, навыкам и предпочтениям. Забудьте про неактуальные предложения.', accent: 'text-purple' },
  { icon: BarChart3, title: 'Аналитика', desc: 'Отслеживайте конверсию откликов, узнавайте почему вас не приглашают и получайте рекомендации по улучшению профиля.', accent: 'text-cyan' },
  { icon: Settings, title: 'Интеграции', desc: 'Работает с HH.ru Chatik API, Telegram, Google Calendar. Настраивайте автосообщения и напоминания о звонках.', accent: 'text-emerald' },
  { icon: MessageSquare, title: 'Чат с HR', desc: 'AI-ответы в чатах HH.ru через Chatik API с Humanizer — рекрутер не заметит разницы. Персонализация под ваш стиль.', accent: 'text-purple' },
]

export function Features() {
  return (
    <section id="features" className="py-24 sm:py-32" aria-labelledby="features-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-cyan mb-4">
            <span className="w-6 h-px bg-cyan" />
            Возможности
            <span className="w-6 h-px bg-cyan" />
          </div>
          <h2 id="features-heading" className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
            Всё что нужно для <span className="gradient-text">быстрого поиска</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            От автоматических откликов до AI-подсказок на интервью
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <Card
              key={i}
              className={`group border-border/50 hover-glow tilt-card fade-in-up stagger-${Math.min(i + 1, 5)}`}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                  f.accent === 'text-cyan'
                    ? 'bg-cyan/10 border border-cyan/15'
                    : f.accent === 'text-emerald'
                    ? 'bg-emerald/10 border border-emerald/15'
                    : 'bg-purple/10 border border-purple/15'
                }`}>
                  <f.icon className={`w-5 h-5 ${f.accent}`} />
                </div>
                <CardTitle className="text-lg font-bold">{f.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
