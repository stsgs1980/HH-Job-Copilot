'use client'

import { Building2, Settings, Award, ChevronRight } from 'lucide-react'
import type { StepItem } from '@/types'

const steps: StepItem[] = [
  { step: '01', icon: Building2, title: 'Подключи HH.ru', desc: 'Авторизуйся через HH.ru — мы безопасно получим доступ к твоим вакансиям и чатам.' },
  { step: '02', icon: Settings, title: 'Настрой AI', desc: 'Загрузи резюме, укажи предпочтения. AI обучится на твоём опыте и стиле общения.' },
  { step: '03', icon: Award, title: 'Получай офферы', desc: 'AI откликается, отвечает в чатах и подсказывает на интервью. Ты только подтверждаешь.' },
]

export function HowItWorks() {
  return (
    <section id="how" className="py-20 sm:py-28 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">Как это работает</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">Три простых шага до работы мечты</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <div key={i} className="relative text-center">
              <div className="text-5xl font-black gradient-text opacity-20 mb-2">{s.step}</div>
              <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4 sweep-btn">
                <s.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">{s.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
              {i < 2 && <ChevronRight className="hidden md:block absolute top-1/2 -right-4 w-8 h-8 text-muted-foreground/30" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
