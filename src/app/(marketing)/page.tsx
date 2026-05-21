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

      {/* Marquee — NEURO style with dot separators, glass card */}
      <section className="py-10 border-y border-border/50 glass-card rounded-none relative" aria-hidden="true">
        {/* NEURO: Section divider gradient */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan/20 to-transparent" />
        <Marquee
          items={['HH.ru', 'Сбербанк', 'Яндекс', 'Тинькофф', 'ВК', 'Ozon', 'МТС', 'Газпром', 'Росатом', 'Альфа-Банк'].map(name => ({
            key: name,
            content: (
              <div className="flex items-center gap-3 text-lg font-bold text-muted-foreground/30 whitespace-nowrap hover:text-cyan/50 transition-colors">
                {name}
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-br from-cyan/40 to-purple/30" />
              </div>
            ),
          }))}
          speed={30}
          pauseOnHover
        />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple/15 to-transparent" />
      </section>

      <Features />
      <HowItWorks />
      <Pricing onNavigate={goToLogin} />

      {/* CTA — NEURO deep gradient with floating elements */}
      <RevealOnScroll className="py-24 sm:py-32 text-center relative overflow-hidden">
        {/* NEURO: Section divider at top */}
        <div className="absolute top-0 left-0 right-0 section-divider" />

        {/* NEURO: Deep gradient mesh background */}
        <div className="absolute inset-0 gradient-mesh-deep pointer-events-none" />

        {/* NEURO: Mesh blobs for depth */}
        <div className="mesh-blob mesh-blob-1 bottom-0 left-1/4" />
        <div className="mesh-blob mesh-blob-2 top-0 right-1/4" />

        {/* NEURO: Floating elements */}
        <div className="absolute top-1/4 left-1/3 w-2 h-2 rounded-full bg-cyan/20 animate-float" aria-hidden="true" />
        <div className="absolute bottom-1/4 right-1/3 w-3 h-3 rounded-full bg-purple/15 animate-float" style={{ animationDelay: '2s' }} aria-hidden="true" />
        <div className="absolute top-[60%] left-[15%] w-2 h-2 rounded-full bg-emerald/15 animate-float" style={{ animationDelay: '4s' }} aria-hidden="true" />

        {/* NEURO: Bottom gradient glow */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none opacity-[0.06]"
          style={{
            background: 'radial-gradient(ellipse, rgba(34,211,238,0.6), rgba(167,139,250,0.4), transparent 70%)',
            filter: 'blur(40px)',
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Готовы найти <span className="gradient-text-animated">идеальную работу</span>?
          </h2>
          <p className="text-lg text-muted-foreground mb-10 font-light">
            Присоединяйтесь к 12 000+ пользователям, которые уже нашли работу быстрее
          </p>
          <Button
            size="lg"
            className="gradient-bg text-white border-0 hover:opacity-90 sweep-btn text-base px-10 h-12 shadow-lg shadow-cyan/25 hover:shadow-cyan/40 transition-shadow"
            onClick={goToLogin}
          >
            Начать бесплатно <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </RevealOnScroll>
    </>
  )
}
