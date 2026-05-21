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

      {/* Marquee — NEURO style with dot separators */}
      <section className="py-10 border-y border-border/50 glass-card rounded-none" aria-hidden="true">
        <Marquee
          items={['HH.ru', 'Сбербанк', 'Яндекс', 'Тинькофф', 'ВК', 'Ozon', 'МТС', 'Газпром', 'Росатом', 'Альфа-Банк'].map(name => ({
            key: name,
            content: (
              <div className="flex items-center gap-3 text-lg font-bold text-muted-foreground/30 whitespace-nowrap hover:text-cyan/40 transition-colors">
                {name}
                <span className="w-1.5 h-1.5 rounded-full bg-cyan/30" />
              </div>
            ),
          }))}
          speed={30}
          pauseOnHover
        />
      </section>

      <Features />
      <HowItWorks />
      <Pricing onNavigate={goToLogin} />

      {/* CTA — NEURO deep gradient with floating elements */}
      <RevealOnScroll className="py-24 sm:py-32 text-center relative overflow-hidden">
        {/* NEURO: Deep gradient mesh background */}
        <div className="absolute inset-0 gradient-mesh-deep pointer-events-none" />

        {/* NEURO: Mesh blobs for depth */}
        <div className="mesh-blob mesh-blob-1 bottom-0 left-1/4" />
        <div className="mesh-blob mesh-blob-2 top-0 right-1/4" />

        {/* NEURO: Floating elements */}
        <div className="absolute top-1/4 left-1/3 w-2 h-2 rounded-full bg-cyan/15 animate-float" aria-hidden="true" />
        <div className="absolute bottom-1/4 right-1/3 w-3 h-3 rounded-full bg-purple/10 animate-float" style={{ animationDelay: '2s' }} aria-hidden="true" />

        {/* NEURO: Bottom gradient fade */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-transparent via-cyan/5 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Готовы найти <span className="gradient-text-animated">идеальную работу</span>?
          </h2>
          <p className="text-lg text-muted-foreground mb-10 font-light">
            Присоединяйтесь к 12 000+ пользователям, которые уже нашли работу быстрее
          </p>
          <Button size="lg" className="gradient-bg text-white border-0 hover:opacity-90 sweep-btn text-base px-10 h-12 shadow-lg shadow-cyan/20" onClick={goToLogin}>
            Начать бесплатно <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </RevealOnScroll>
    </>
  )
}
