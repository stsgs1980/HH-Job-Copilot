'use client'

import { ArrowRight, Play, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { GradientButton } from '@/components/shared'
import { RevealOnScroll, CountUp } from '@/components/neuro'

interface HeroProps {
  onNavigate: () => void
}

export function Hero({ onNavigate }: HeroProps) {
  return (
    <section className="relative overflow-hidden gradient-mesh" aria-label="Главный баннер">
      {/* NEURO: Mesh gradient blobs */}
      <div className="mesh-blob mesh-blob-1 top-[10%] left-[10%]" />
      <div className="mesh-blob mesh-blob-2 bottom-[20%] right-[10%]" />
      <div className="mesh-blob mesh-blob-3 top-[50%] left-[50%]" />

      {/* NEURO: Dot pattern */}
      <div className="dot-pattern top-40 right-20" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-36 text-center">
        {/* Badge */}
        <RevealOnScroll delay={0.1}>
          <Badge variant="secondary" className="mb-8 gap-1.5 px-4 py-1.5 glass-card text-cyan">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse-dot" />
            AI-помощник нового поколения
          </Badge>
        </RevealOnScroll>

        {/* Heading */}
        <RevealOnScroll delay={0.2}>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.05]">
            Найди работу
            <br />
            <span className="gradient-text">в 10 раз быстрее</span>
          </h1>
        </RevealOnScroll>

        {/* Subtitle */}
        <RevealOnScroll delay={0.3}>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed font-light">
            Автоматизируй отклики на HH.ru, получай AI-подсказки на собеседованиях в реальном времени и находи идеальные вакансии раньше остальных
          </p>
        </RevealOnScroll>

        {/* CTAs */}
        <RevealOnScroll delay={0.4}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <GradientButton size="lg" onClick={onNavigate}>
              Попробовать бесплатно <ArrowRight className="ml-2 w-4 h-4" />
            </GradientButton>
            <GradientButton size="lg" variant="outline">
              <Play className="mr-2 w-4 h-4" /> Смотреть демо
            </GradientButton>
          </div>
        </RevealOnScroll>

        {/* Stats with CountUp */}
        <RevealOnScroll delay={0.5}>
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {[
              { target: 12847, label: 'пользователей', accent: 'gradient-text' },
              { target: 340, suffix: ' тыс.', label: 'откликов отправлено', accent: 'gradient-text' },
              { target: 89, suffix: '%', label: 'получают оффер', accent: 'text-emerald' },
              { target: 4.9, decimals: 1, label: 'рейтинг', accent: 'gradient-text' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${stat.accent}`}>
                  <CountUp
                    target={stat.target}
                    suffix={stat.suffix}
                    decimals={stat.decimals || 0}
                  />
                </div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </RevealOnScroll>

        {/* Social proof */}
        <RevealOnScroll delay={0.6}>
          <div className="mt-10 flex flex-col items-center gap-3">
            <div className="flex -space-x-2">
              {['АК', 'МП', 'ОС', 'ДВ', 'ЕН'].map((initials, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-background gradient-bg flex items-center justify-center text-[10px] font-bold text-white">
                  {initials}
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">12 847</span> специалистов уже с нами
            </p>
          </div>
        </RevealOnScroll>

        {/* Scroll indicator */}
        <div className="mt-16 flex flex-col items-center gap-2 text-muted-foreground text-xs font-medium">
          <div className="w-px h-10 bg-gradient-to-b from-cyan to-transparent animate-pulse-dot" />
          листай вниз
        </div>
      </div>
    </section>
  )
}
