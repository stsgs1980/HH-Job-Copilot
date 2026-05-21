'use client'

import { Building2, Settings, Award } from 'lucide-react'
import { RevealOnScroll } from '@/components/neuro/reveal-on-scroll'
import type { StepItem } from '@/types'

const steps: StepItem[] = [
  { step: '01', icon: Building2, title: 'Подключите HH.ru', desc: 'Авторизуйтесь через HH.ru за 30 секунд. Мы безопасно получим доступ к вашему профилю и вакансиям.' },
  { step: '02', icon: Settings, title: 'Настройте фильтры', desc: 'Укажите желаемую зарплату, город, формат работы и ключевые навыки. ИИ учтёт все предпочтения.' },
  { step: '03', icon: Award, title: 'Получите оффер', desc: 'На собеседовании включите AI-подсказки и отвечайте уверенно. 89% пользователей получают оффер.' },
]

export function HowItWorks() {
  return (
    <section id="how" className="py-24 sm:py-32 bg-muted/30" aria-labelledby="how-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-cyan mb-4">
            <span className="w-6 h-px bg-cyan" />
            Как это работает
            <span className="w-6 h-px bg-cyan" />
          </div>
          <h2 id="how-heading" className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Четыре шага к <span className="gradient-text">новой работе</span>
          </h2>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <RevealOnScroll key={i} delay={i * 0.15}>
              <div className="relative text-center">
                <div className="text-5xl font-extrabold gradient-text opacity-20 mb-2">{s.step}</div>
                <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4 sweep-btn shadow-lg shadow-cyan/20">
                  <s.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
                {/* Connector line between steps */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-cyan/30 to-transparent" aria-hidden="true" />
                )}
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
