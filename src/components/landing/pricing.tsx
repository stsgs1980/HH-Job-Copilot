'use client'

import { Check } from 'lucide-react'
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SpotlightCard } from '@/components/neuro/spotlight-card'
import { TiltCard } from '@/components/neuro/tilt-card'
import { RevealOnScroll } from '@/components/neuro/reveal-on-scroll'
import type { PricingTier } from '@/types'

const tiers: PricingTier[] = [
  {
    name: 'Старт',
    price: '0',
    period: '',
    desc: 'Для тех, кто начинает поиск',
    features: ['20 откликов в месяц', 'Базовый поиск вакансий', 'Шаблоны сопроводительных', 'Аналитика профиля'],
    cta: 'Начать бесплатно',
    popular: false,
  },
  {
    name: 'Про',
    price: '1 490',
    period: '/мес',
    desc: 'Максимальная эффективность',
    features: ['Безлимитные отклики', 'AI-автоотклики', 'Подсказки на собеседовании', 'Расширенная аналитика', 'Приоритетная поддержка'],
    cta: 'Выбрать Про',
    popular: true,
  },
  {
    name: 'Команда',
    price: '4 990',
    period: '/мес',
    desc: 'Для HR и рекрутеров',
    features: ['Всё из Про', 'Командный дашборд', 'API доступ', 'SSO интеграция', 'Персональный менеджер'],
    cta: 'Связаться с нами',
    popular: false,
  },
]

interface PricingProps {
  onNavigate: () => void
}

export function Pricing({ onNavigate }: PricingProps) {
  return (
    <section id="pricing" className="py-24 sm:py-32 relative" aria-labelledby="pricing-heading">
      {/* NEURO: Section divider at top */}
      <div className="absolute top-0 left-0 right-0 section-divider" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-cyan mb-4">
            <span className="w-8 h-px bg-gradient-to-r from-transparent to-cyan" />
            Тарифы
            <span className="w-8 h-px bg-gradient-to-l from-transparent to-cyan" />
          </div>
          <h2 id="pricing-heading" className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Выберите <span className="gradient-text">свой план</span>
          </h2>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tiers.map((p, i) => (
            <RevealOnScroll key={i} delay={i * 0.1} direction={i === 0 ? 'left' : i === 2 ? 'right' : 'up'}>
              <TiltCard maxTilt={p.popular ? 6 : 3} glareIntensity={p.popular ? 0.12 : 0.05}>
                <SpotlightCard
                  spotlightColor={p.popular ? 'rgba(34,211,238,0.12)' : 'rgba(34,211,238,0.04)'}
                  animatedBorder={p.popular}
                  tilt={false}
                  className={`p-8 flex flex-col h-full glass-card ${p.popular ? 'shadow-xl shadow-cyan/8' : ''}`}
                >
                  {p.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <Badge className="gradient-bg text-white border-0 px-3 shadow-lg shadow-cyan/30">Популярный</Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-2 p-0">
                    <CardTitle className="text-xl font-bold">{p.name}</CardTitle>
                    <CardDescription>{p.desc}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-extrabold tabular-nums">{p.price}</span>
                      <span className="text-muted-foreground">{p.period ? ` ${p.period}` : ''}</span>
                      {p.price !== '0' && <span className="text-xs text-muted-foreground ml-1">&#8381;</span>}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 p-0 mt-6">
                    <ul className="space-y-3" role="list">
                      {p.features.map((f, fi) => (
                        <li key={fi} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-emerald mt-0.5 shrink-0" aria-hidden="true" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="p-0 mt-6">
                    <Button
                      className={`w-full ${
                        p.popular
                          ? 'gradient-bg gradient-shimmer text-white border-0 hover:opacity-90 sweep-btn shadow-lg shadow-cyan/20'
                          : ''
                      }`}
                      variant={p.popular ? 'default' : 'outline'}
                      onClick={onNavigate}
                    >
                      {p.cta}
                    </Button>
                  </CardFooter>
                </SpotlightCard>
              </TiltCard>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
