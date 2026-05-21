'use client'

import { Sparkles, ArrowRight, Play } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { GradientButton } from '@/components/shared'

interface HeroProps {
  onNavigate: () => void
}

export function Hero({ onNavigate }: HeroProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="ambient-glow w-[500px] h-[500px] bg-cyan -top-48 -right-48" />
      <div className="ambient-glow w-[350px] h-[350px] bg-purple -bottom-32 -left-32" style={{ animationDelay: '-12s' }} />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 text-center">
        <Badge variant="secondary" className="mb-6 gap-1.5 px-3 py-1">
          <Sparkles className="w-3 h-3" /> AI-копилот для HH.ru
        </Badge>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
          Найди работу мечты<br />
          <span className="gradient-text">с AI-копилотом</span>
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Автоматизируй отклики, общайся с HR через AI и проходи интервью с подсказками в реальном времени. Всё в одном месте.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <GradientButton size="lg" onClick={onNavigate}>
            Начать бесплатно <ArrowRight className="ml-2 w-4 h-4" />
          </GradientButton>
          <GradientButton size="lg" variant="outline">
            <Play className="mr-2 w-4 h-4" /> Смотреть демо
          </GradientButton>
        </div>
        {/* Social proof */}
        <div className="mt-12 flex flex-col items-center gap-3">
          <div className="flex -space-x-2">
            {['АК', 'МП', 'ОС', 'ДВ', 'ЕН'].map((initials, i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-background gradient-bg flex items-center justify-center text-[10px] font-bold text-white">
                {initials}
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">5,000+</span> специалистов уже с нами
          </p>
        </div>
      </div>
    </section>
  )
}
