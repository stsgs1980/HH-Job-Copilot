'use client'

import { Search, Zap, MessageSquare, Mic, BarChart3, Settings } from 'lucide-react'
import { CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { SpotlightCard } from '@/components/neuro/spotlight-card'
import { RevealOnScroll } from '@/components/neuro/reveal-on-scroll'
import type { FeatureCard } from '@/types'

const features: FeatureCard[] = [
  { icon: Zap, title: 'Авто-отклики', desc: 'ИИ анализирует вакансии и автоматически отправляет персонализированные отклики. Экономьте до 5 часов в день на рутине.', accent: 'text-cyan' },
  { icon: Mic, title: 'AI-подсказки', desc: 'Получайте подсказки в реальном времени во время собеседования. Whisper распознаёт речь, а GPT генерирует идеальные ответы.', accent: 'text-emerald' },
  { icon: Search, title: 'Умный поиск', desc: 'Алгоритм подбирает вакансии по вашему профилю, навыкам и предпочтениям. Забудьте про неактуальные предложения.', accent: 'text-purple' },
  { icon: BarChart3, title: 'Аналитика', desc: 'Отслеживайте конверсию откликов, узнавайте почему вас не приглашают и получайте рекомендации по улучшению профиля.', accent: 'text-cyan' },
  { icon: Settings, title: 'Интеграции', desc: 'Работает с HH.ru Chatik API, Telegram, Google Calendar. Настраивайте автосообщения и напоминания о звонках.', accent: 'text-emerald' },
  { icon: MessageSquare, title: 'Чат с HR', desc: 'AI-ответы в чатах HH.ru через Chatik API с Humanizer — рекрутер не заметит разницы. Персонализация под ваш стиль.', accent: 'text-purple' },
]

const spotlightColors = [
  'rgba(34,211,238,0.10)',
  'rgba(52,211,153,0.10)',
  'rgba(167,139,250,0.10)',
  'rgba(34,211,238,0.10)',
  'rgba(52,211,153,0.10)',
  'rgba(167,139,250,0.10)',
]

const iconBgs = [
  'bg-cyan/10 border border-cyan/15',
  'bg-emerald/10 border border-emerald/15',
  'bg-purple/10 border border-purple/15',
  'bg-cyan/10 border border-cyan/15',
  'bg-emerald/10 border border-emerald/15',
  'bg-purple/10 border border-purple/15',
]

export function Features() {
  return (
    <section id="features" className="py-24 sm:py-32 relative" aria-labelledby="features-heading">
      {/* NEURO: Subtle background mesh */}
      <div className="absolute inset-0 gradient-mesh opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <RevealOnScroll className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-cyan mb-4">
            <span className="w-8 h-px bg-gradient-to-r from-transparent to-cyan" />
            Возможности
            <span className="w-8 h-px bg-gradient-to-l from-transparent to-cyan" />
          </div>
          <h2 id="features-heading" className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Всё что нужно для <span className="gradient-text">быстрого поиска</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            От автоматических откликов до AI-подсказок на интервью
          </p>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <RevealOnScroll key={i} delay={i * 0.08}>
              <SpotlightCard
                spotlightColor={spotlightColors[i]}
                tilt
                maxTilt={4}
                className="p-8 h-full hover-lift glass-card glow-line"
              >
                <CardHeader className="p-0 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${iconBgs[i]}`}>
                    <f.icon className={`w-5 h-5 ${f.accent}`} />
                  </div>
                  <CardTitle className="text-lg font-bold">{f.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                </CardContent>
              </SpotlightCard>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
