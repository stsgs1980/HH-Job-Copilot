'use client'

import { Check } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
    <section id="pricing" className="py-24 sm:py-32" aria-labelledby="pricing-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-cyan mb-4">
            <span className="w-6 h-px bg-cyan" />
            Тарифы
            <span className="w-6 h-px bg-cyan" />
          </div>
          <h2 id="pricing-heading" className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
            Выберите <span className="gradient-text">свой план</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tiers.map((p, i) => (
            <Card
              key={i}
              className={`relative flex flex-col hover-glow ${
                p.popular ? 'gradient-border glass-card scale-105 shadow-lg' : 'border-border/50'
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <Badge className="gradient-bg text-white border-0 px-3">Популярный</Badge>
                </div>
              )}
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-xl font-bold">{p.name}</CardTitle>
                <CardDescription>{p.desc}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-black tabular-nums">{p.price}</span>
                  <span className="text-muted-foreground">{p.period ? ` ${p.period}` : ''}</span>
                  {p.price !== '0' && <span className="text-xs text-muted-foreground ml-1">&#8381;</span>}
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3" role="list">
                  {p.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-emerald mt-0.5 shrink-0" aria-hidden="true" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className={`w-full ${
                    p.popular
                      ? 'gradient-bg gradient-shimmer text-white border-0 hover:opacity-90 sweep-btn'
                      : ''
                  }`}
                  variant={p.popular ? 'default' : 'outline'}
                  onClick={onNavigate}
                >
                  {p.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
