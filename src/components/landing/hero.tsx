'use client'

import { ArrowRight, Play } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { GradientButton } from '@/components/shared'
import { RevealOnScroll, CountUp, GradientOrb, ScrollIndicator } from '@/components/neuro'

interface HeroProps {
  onNavigate: () => void
}

export function Hero({ onNavigate }: HeroProps) {
  return (
    <section className="relative overflow-hidden gradient-mesh-deep" aria-label="Главный баннер">
      {/* NEURO: Mesh gradient blobs — larger, richer color */}
      <div className="mesh-blob mesh-blob-1 top-[5%] left-[5%]" />
      <div className="mesh-blob mesh-blob-2 bottom-[10%] right-[5%]" />
      <div className="mesh-blob mesh-blob-3 top-[40%] left-[45%]" />

      {/* NEURO: Dot pattern — dual-layer organic dots */}
      <div className="dot-pattern top-32 right-16" />
      <div className="dot-pattern bottom-20 left-20 opacity-30" />

      {/* NEURO: Floating decorative elements */}
      <div
        className="absolute top-1/4 left-3/4 w-3 h-3 rounded-full bg-cyan/25 animate-float hidden lg:block"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/3 left-1/4 w-2 h-2 rounded-full bg-purple/25 animate-float hidden lg:block"
        style={{ animationDelay: '2s' }}
        aria-hidden="true"
      />
      <div
        className="absolute top-[60%] right-[20%] w-2 h-2 rounded-full bg-emerald/20 animate-float hidden lg:block"
        style={{ animationDelay: '4s' }}
        aria-hidden="true"
      />

      {/* NEURO v4: Hero gradient orbs — premium ambient lighting */}
      <GradientOrb color="cyan" size={500} x="20%" y="30%" />
      <GradientOrb color="purple" size={400} x="75%" y="60%" />
      <GradientOrb color="emerald" size={300} x="55%" y="80%" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-36 text-center">
        {/* Badge — animated border glow */}
        <RevealOnScroll delay={0.1}>
          <Badge variant="secondary" className="mb-8 gap-1.5 px-4 py-1.5 glass-card text-cyan animate-border-glow">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse-dot" />
            AI-помощник нового поколения
          </Badge>
        </RevealOnScroll>

        {/* Heading — gradient text animation */}
        <RevealOnScroll delay={0.2}>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.05]">
            Найди работу
            <br />
            <span className="gradient-text-animated">в 10 раз быстрее</span>
          </h1>
        </RevealOnScroll>

        {/* Subtitle */}
        <RevealOnScroll delay={0.3}>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed font-light">
            Автоматизируй отклики на HH.ru, получай AI-подсказки на собеседованиях в реальном времени и находи идеальные вакансии раньше остальных
          </p>
        </RevealOnScroll>

        {/* CTAs — premium buttons with shadow */}
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

        {/* Stats with CountUp — glass cards with hover glow */}
        <RevealOnScroll delay={0.5}>
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-3xl mx-auto">
            {[
              { target: 12847, label: 'пользователей', accent: 'gradient-text' },
              { target: 340, suffix: ' тыс.', label: 'откликов отправлено', accent: 'gradient-text' },
              { target: 89, suffix: '%', label: 'получают оффер', accent: 'text-emerald' },
              { target: 4.9, decimals: 1, label: 'рейтинг', accent: 'gradient-text' },
            ].map((stat, i) => (
              <div key={i} className="text-center glass-card p-4 sm:p-5 hover-glow stat-card glow-line">
                <div className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${stat.accent}`}>
                  <CountUp
                    target={stat.target}
                    suffix={stat.suffix}
                    decimals={stat.decimals || 0}
                  />
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </RevealOnScroll>

        {/* Social proof */}
        <RevealOnScroll delay={0.6}>
          <div className="mt-10 flex flex-col items-center gap-3">
            <div className="flex -space-x-2">
              {['АК', 'МП', 'ОС', 'ДВ', 'ЕН'].map((initials, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-background gradient-bg flex items-center justify-center text-[10px] font-bold text-white shadow-sm shadow-cyan/20">
                  {initials}
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">12 847</span> специалистов уже с нами
            </p>
          </div>
        </RevealOnScroll>

        {/* Scroll indicator — NEURO v4 animated gradient line */}
        <div className="mt-16">
          <ScrollIndicator label="листай вниз" />
        </div>
      </div>
    </section>
  )
}
