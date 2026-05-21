'use client'

import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Hero, Features, HowItWorks, Pricing } from '@/components/landing'
import { Marquee, RevealOnScroll } from '@/components/neuro'

export default function MarketingPage() {
  const router = useRouter()
  const goToLogin = () => router.push('/login')

  return (
    <>
      <Hero onNavigate={goToLogin} />

      {/* Marquee */}
      <section className="py-10 border-y border-border/50" aria-hidden="true">
        <Marquee
          items={['HH.ru', 'Сбербанк', 'Яндекс', 'Тинькофф', 'ВК', 'Ozon', 'МТС', 'Газпром', 'Росатом', 'Альфа-Банк'].map(name => ({
            key: name,
            content: (
              <div className="flex items-center gap-3 text-lg font-bold text-muted-foreground/40 whitespace-nowrap">
                {name}
                <span className="w-1 h-1 rounded-full bg-cyan" />
              </div>
            ),
          }))}
          speed={30}
        />
      </section>

      <Features />
      <HowItWorks />
      <Pricing onNavigate={goToLogin} />

      {/* CTA */}
      <RevealOnScroll className="py-24 sm:py-32 text-center relative">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-transparent via-cyan/5 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Готовы найти <span className="gradient-text">идеальную работу</span>?
          </h2>
          <p className="text-lg text-muted-foreground mb-10 font-light">
            Присоединяйтесь к 12 000+ пользователям, которые уже нашли работу быстрее
          </p>
          <Button size="lg" className="gradient-bg text-white border-0 hover:opacity-90 sweep-btn text-base px-10 h-12" onClick={goToLogin}>
            Начать бесплатно <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </RevealOnScroll>
    </>
  )
}
