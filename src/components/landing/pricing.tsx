'use client'

import { Check } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { PricingTier } from '@/types'

const tiers: PricingTier[] = [
  { name: 'Starter', price: '0', period: '', desc: 'Для знакомства с платформой', features: ['5 откликов в день', '3 чата с HR', 'Базовый AI-копилот', 'Аналитика за неделю'], cta: 'Начать бесплатно', popular: false },
  { name: 'Pro', price: '19', period: '/мес', desc: 'Для активного поиска работы', features: ['Безлимит откликов', 'Humanizer для чатов', 'ASR 30 мин/интервью', 'AI-сопроводительные', 'Полная аналитика', 'Приоритетная поддержка'], cta: 'Попробовать Pro', popular: true },
  { name: 'Ultra', price: '49', period: '/мес', desc: 'Для серьёзной карьеры', features: ['Всё из Pro', 'Безлимит ASR', 'TTS голосовой вывод', 'Приоритетный AI', 'API доступ', 'Персональный менеджер'], cta: 'Выбрать Ultra', popular: false },
]

interface PricingProps {
  onNavigate: () => void
}

export function Pricing({ onNavigate }: PricingProps) {
  return (
    <section id="pricing" className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Тарифы</h2>
          <p className="text-lg text-muted-foreground">Начни бесплатно, масштабируй по мере роста</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tiers.map((p, i) => (
            <Card key={i} className={`relative flex flex-col hover-glow ${p.popular ? 'gradient-border glass-card scale-105 shadow-lg' : 'border-border/50'}`}>
              {p.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10"><Badge className="gradient-bg text-white border-0 px-3">Популярный</Badge></div>}
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-xl">{p.name}</CardTitle>
                <CardDescription>{p.desc}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold tabular-nums">${p.price}</span>
                  <span className="text-muted-foreground">{p.period}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {p.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-cyan mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className={`w-full ${p.popular ? 'gradient-bg gradient-shimmer text-white border-0 hover:opacity-90' : ''}`} variant={p.popular ? 'default' : 'outline'} onClick={onNavigate}>
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
