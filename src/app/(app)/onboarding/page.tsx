'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Logo } from '@/components/shared'
import {
  FileText, MapPin, Building2, Sparkles, ArrowRight, ArrowLeft, Check,
  Briefcase, DollarSign, Globe, Users,
} from 'lucide-react'

const steps = [
  { id: 1, icon: FileText, title: 'Резюме', desc: 'Загрузите резюме или введите данные' },
  { id: 2, icon: MapPin, title: 'Предпочтения', desc: 'Зарплата, локация, формат работы' },
  { id: 3, icon: Building2, title: 'HH.ru', desc: 'Подключите аккаунт HH.ru' },
  { id: 4, icon: Sparkles, title: 'AI-опрос', desc: 'Обучите AI вашему стилю общения' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    resume: '',
    salaryMin: '',
    salaryMax: '',
    location: '',
    format: 'remote',
    hhConnected: false,
    aiTrained: false,
  })

  const update = (key: string, value: string | boolean) =>
    setFormData(prev => ({ ...prev, [key]: value }))

  const next = () => step < 4 && setStep(step + 1)
  const prev = () => step > 1 && setStep(step - 1)
  const finish = () => router.push('/dashboard')

  return (
    <div className="h-screen flex flex-col items-center justify-center p-4 gradient-mesh">
      <div className="ambient-glow w-[400px] h-[400px] bg-coral -top-32 -right-32" />
      <div className="ambient-glow w-[300px] h-[300px] bg-green-accent -bottom-24 -left-24" style={{ animationDelay: '-8s' }} />

      <div className="relative z-10 w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8 page-transition">
          <Logo size="lg" />
          <p className="text-muted-foreground text-sm mt-2">Настройка за 2 минуты</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                step > s.id ? 'gradient-bg' : step === s.id ? 'glass-card hover-glow' : 'bg-muted'
              }`}>
                {step > s.id ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <s.icon className={`w-5 h-5 ${step === s.id ? 'text-coral' : 'text-muted-foreground'}`} />
                )}
              </div>
              {i < 3 && (
                <div className={`w-8 sm:w-16 h-0.5 mx-1 transition-colors duration-300 ${
                  step > s.id ? 'bg-coral' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <Card className="glass-card hover-glow">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">{steps[step - 1].title}</CardTitle>
            <CardDescription>{steps[step - 1].desc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === 1 && (
              <div className="space-y-4 fade-in-up">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ваше имя</label>
                  <Input
                    placeholder="Сергей Т."
                    value={formData.name}
                    onChange={e => update('name', e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Опыт работы (ключевые навыки)</label>
                  <textarea
                    placeholder="React, Next.js, TypeScript, 5 лет опыта во фронтенд-разработке..."
                    value={formData.resume}
                    onChange={e => update('resume', e.target.value)}
                    className="w-full min-h-[120px] rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Позже вы сможете загрузить полное резюме из файла</p>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 fade-in-up stagger-1">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5" /> Зарплата от</label>
                    <Input placeholder="200 000" value={formData.salaryMin} onChange={e => update('salaryMin', e.target.value)} className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Зарплата до</label>
                    <Input placeholder="350 000" value={formData.salaryMax} onChange={e => update('salaryMax', e.target.value)} className="h-11" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Локация</label>
                  <Input placeholder="Москва / Удаленка" value={formData.location} onChange={e => update('location', e.target.value)} className="h-11" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Формат</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'remote', label: 'Удаленка', icon: Globe },
                      { id: 'office', label: 'Офис', icon: Building2 },
                      { id: 'hybrid', label: 'Гибрид', icon: Users },
                    ].map(f => (
                      <button
                        key={f.id}
                        onClick={() => update('format', f.id)}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-all ${
                          formData.format === f.id
                            ? 'border-coral bg-coral/5 text-coral'
                            : 'border-border/50 hover:border-coral/30 text-muted-foreground'
                        }`}
                      >
                        <f.icon className="w-4 h-4" />
                        <span className="text-xs font-medium">{f.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 fade-in-up stagger-2">
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    Подключите HH.ru аккаунт для доступа к вакансиям, чатам с HR и автоматическим откликам
                  </p>
                  <Button
                    size="lg"
                    className="gradient-bg gradient-shimmer text-white border-0 hover:opacity-90"
                    onClick={() => {
                      update('hhConnected', true)
                      // In production: redirect to /api/hh/oauth
                      // For now: mark as connected
                    }}
                  >
                    {formData.hhConnected ? (
                      <><Check className="mr-2 w-4 h-4" /> Подключено</>
                    ) : (
                      <><Building2 className="mr-2 w-4 h-4" /> Подключить HH.ru</>
                    )}
                  </Button>
                  {!formData.hhConnected && (
                    <p className="text-xs text-muted-foreground">Можно пропустить и подключить позже</p>
                  )}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4 fade-in-up stagger-3">
                <div className="text-center py-4 space-y-4">
                  <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    Ответьте на пару вопросов, чтобы AI научился общаться как вы
                  </p>
                </div>
                <div className="bg-muted rounded-xl p-4 space-y-3">
                  <p className="text-sm font-medium">Представьтесь работодателю:</p>
                  <textarea
                    placeholder="Здравствуйте! Меня зовут Сергей, я фронтенд-разработчик с 5-летним опытом..."
                    className="w-full min-h-[80px] rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                  <p className="text-sm font-medium mt-3">Как бы вы ответили на приглашение:</p>
                  <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground italic">
                    &ldquo;Здравствуйте! Нас заинтересовало ваше резюме. Когда сможете пройти собеседование?&rdquo;
                  </div>
                  <textarea
                    placeholder="Спасибо за приглашение! Готов пройти собеседование..."
                    className="w-full min-h-[80px] rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center">AI запомнит ваш стиль и будет отвечать похоже</p>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4">
              <Button variant="ghost" onClick={prev} disabled={step === 1} className="gap-1.5">
                <ArrowLeft className="w-4 h-4" /> Назад
              </Button>
              {step < 4 ? (
                <Button onClick={next} className="gradient-bg text-white border-0 hover:opacity-90 gap-1.5">
                  Далее <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button onClick={finish} className="gradient-bg gradient-shimmer text-white border-0 hover:opacity-90 gap-1.5">
                  Начать работу <Sparkles className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
