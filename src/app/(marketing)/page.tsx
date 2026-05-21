'use client'

import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Hero, Features, HowItWorks, Pricing } from '@/components/landing'

export default function MarketingPage() {
  const router = useRouter()
  const goToLogin = () => router.push('/login')

  return (
    <>
      <Hero onNavigate={goToLogin} />
      <Features />
      <HowItWorks />
      <Pricing onNavigate={goToLogin} />
      <section className="py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Готов найти работу быстрее?</h2>
          <p className="text-lg text-muted-foreground mb-8">Присоединяйся к 5,000+ специалистов, которые уже используют AI-копилот</p>
          <Button size="lg" className="gradient-bg text-white border-0 hover:opacity-90 text-base px-10 h-12" onClick={goToLogin}>
            Начать бесплатно <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </section>
    </>
  )
}
