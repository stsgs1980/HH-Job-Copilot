'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  Zap, MessageSquare, Search, Briefcase, Mic, BarChart3, User,
  ArrowRight, Check, ChevronRight, Building2,
  Layers, Sparkles, Send,
  X, Play, Award, LogOut, Settings,
  Mail, Lock, UserPlus, Eye, EyeOff
} from 'lucide-react'

type View = 'landing' | 'auth' | 'dashboard'

// ============================================================
// LANDING PAGE
// ============================================================
function LandingPage({ onNavigate }: { onNavigate: (v: View) => void }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">HH Job Copilot</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Возможности</a>
            <a href="#how" className="hover:text-foreground transition-colors">Как работает</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Тарифы</a>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={() => onNavigate('auth')}>Войти</Button>
            <Button size="sm" className="gradient-bg text-white border-0 hover:opacity-90" onClick={() => onNavigate('auth')}>
              Начать бесплатно
            </Button>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="ambient-glow w-[500px] h-[500px] bg-cyan -top-48 -right-48" />
          <div className="ambient-glow w-[350px] h-[350px] bg-purple -bottom-32 -left-32" style={{ animationDelay: '-12s' }} />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 text-center">
            <Badge variant="secondary" className="mb-6 gap-1.5 px-3 py-1">
              <Sparkles className="w-3 h-3" /> AI-копилот для HH.ru
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Найди работу мечты<br />
              <span className="gradient-text">с AI-копилотом</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Автоматизируй отклики, общайся с HR через AI и проходи интервью с подсказками в реальном времени. Всё в одном месте.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gradient-bg text-white border-0 hover:opacity-90 text-base px-8 h-12" onClick={() => onNavigate('auth')}>
                Начать бесплатно <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8 h-12">
                <Play className="mr-2 w-4 h-4" /> Смотреть демо
              </Button>
            </div>
            {/* Social proof */}
            <div className="mt-12 flex flex-col items-center gap-3">
              <div className="flex -space-x-2">
                {['АК', 'МП', 'ОС', 'ДВ', 'ЕН'].map((initials, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-background gradient-bg flex items-center justify-center text-[10px] font-bold text-white">
                    {initials}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">5,000+</span> специалистов уже с нами
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 sm:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Всё для поиска работы</h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">От автоматических откликов до AI-подсказок на интервью</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Search, title: 'AI-поиск вакансий', desc: 'Автоматический подбор вакансий по вашим навыкам и предпочтениям. Совпадение до 95%.', accent: 'text-cyan' },
                { icon: Zap, title: 'Авто-отклики', desc: 'Массовые отклики с персонализированными сопроводительными письмами от AI за секунды.', accent: 'text-purple' },
                { icon: MessageSquare, title: 'Чат с HR', desc: 'AI-ответы в чатах HH.ru через Chatik API с Humanizer — рекрутер не заметит AI.', accent: 'text-cyan' },
                { icon: Mic, title: 'Интервью-ассистент', desc: 'ASR транскрибирует вопросы, AI генерирует подсказки на основе вашего опыта в реальном времени.', accent: 'text-purple' },
                { icon: BarChart3, title: 'Аналитика', desc: 'Трекинг откликов, приглашений, конверсий. Узнайте, что работает, а что нет.', accent: 'text-cyan' },
                { icon: User, title: 'Профиль', desc: 'Оптимизация профиля под конкретные вакансии. AI подскажет, что добавить или изменить.', accent: 'text-purple' },
              ].map((f, i) => (
                <Card key={i} className="group border-border/50 hover:border-cyan/30 transition-all duration-300 hover:shadow-lg hover:shadow-cyan/5">
                  <CardHeader>
                    <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-2 ${f.accent}`}>
                      <f.icon className="w-5 h-5" />
                    </div>
                    <CardTitle className="text-lg">{f.title}</CardTitle>
                  </CardHeader>
                  <CardContent><p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p></CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="py-20 sm:py-28 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Как это работает</h2>
              <p className="text-lg text-muted-foreground">Три простых шага до работы мечты</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: '01', icon: Building2, title: 'Подключи HH.ru', desc: 'Авторизуйся через HH.ru — мы безопасно получим доступ к твоим вакансиям и чатам.' },
                { step: '02', icon: Settings, title: 'Настрой AI', desc: 'Загрузи резюме, укажи предпочтения. AI обучится на твоём опыте и стиле общения.' },
                { step: '03', icon: Award, title: 'Получай офферы', desc: 'AI откликается, отвечает в чатах и подсказывает на интервью. Ты только подтверждаешь.' },
              ].map((s, i) => (
                <div key={i} className="relative text-center">
                  <div className="text-5xl font-bold gradient-text opacity-20 mb-2">{s.step}</div>
                  <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4">
                    <s.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
                  {i < 2 && <ChevronRight className="hidden md:block absolute top-1/2 -right-4 w-8 h-8 text-muted-foreground/30" />}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-20 sm:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Тарифы</h2>
              <p className="text-lg text-muted-foreground">Начни бесплатно, масштабируй по мере роста</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                { name: 'Starter', price: '0', period: '', desc: 'Для знакомства с платформой', features: ['5 откликов в день', '3 чата с HR', 'Базовый AI-копилот', 'Аналитика за неделю'], cta: 'Начать бесплатно', popular: false },
                { name: 'Pro', price: '19', period: '/мес', desc: 'Для активного поиска работы', features: ['Безлимит откликов', 'Humanizer для чатов', 'ASR 30 мин/интервью', 'AI-сопроводительные', 'Полная аналитика', 'Приоритетная поддержка'], cta: 'Попробовать Pro', popular: true },
                { name: 'Ultra', price: '49', period: '/мес', desc: 'Для серьёзной карьеры', features: ['Всё из Pro', 'Безлимит ASR', 'TTS голосовой вывод', 'Приоритетный AI', 'API доступ', 'Персональный менеджер'], cta: 'Выбрать Ultra', popular: false },
              ].map((p, i) => (
                <Card key={i} className={`relative flex flex-col ${p.popular ? 'border-cyan/50 shadow-lg shadow-cyan/5 scale-105' : 'border-border/50'}`}>
                  {p.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2"><Badge className="gradient-bg text-white border-0 px-3">Популярный</Badge></div>}
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
                    <Button className={`w-full ${p.popular ? 'gradient-bg text-white border-0 hover:opacity-90' : ''}`} variant={p.popular ? 'default' : 'outline'} onClick={() => onNavigate('auth')}>
                      {p.cta}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 sm:py-28">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Готов найти работу быстрее?</h2>
            <p className="text-lg text-muted-foreground mb-8">Присоединяйся к 5,000+ специалистов, которые уже используют AI-копилот</p>
            <Button size="lg" className="gradient-bg text-white border-0 hover:opacity-90 text-base px-10 h-12" onClick={() => onNavigate('auth')}>
              Начать бесплатно <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded gradient-bg flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-semibold">HH Job Copilot</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Условия</a>
            <a href="#" className="hover:text-foreground transition-colors">Конфиденциальность</a>
            <a href="#" className="hover:text-foreground transition-colors">Поддержка</a>
          </div>
          <p className="text-xs text-muted-foreground">&copy; 2026 HH Job Copilot</p>
        </div>
      </footer>
    </div>
  )
}

// ============================================================
// AUTH PAGE
// ============================================================
function AuthPage({ onNavigate }: { onNavigate: (v: View) => void }) {
  const [authTab, setAuthTab] = useState('signin')
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="ambient-glow w-[400px] h-[400px] bg-cyan -top-32 -right-32" />
      <div className="ambient-glow w-[300px] h-[300px] bg-purple -bottom-24 -left-24" style={{ animationDelay: '-8s' }} />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mx-auto mb-4">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold">HH Job Copilot</h1>
          <p className="text-muted-foreground text-sm mt-1">Войдите в свой аккаунт</p>
        </div>

        <Card className="border-border/50">
          <Tabs value={authTab} onValueChange={setAuthTab}>
            <TabsList className="grid w-full grid-cols-2 m-4 mb-0">
              <TabsTrigger value="signin">Вход</TabsTrigger>
              <TabsTrigger value="signup">Регистрация</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="p-6 space-y-4">
              <Button variant="outline" className="w-full h-11 gap-2" onClick={() => onNavigate('dashboard')}>
                <Building2 className="w-4 h-4" /> Войти через HH.ru
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">или</span></div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input className="pl-9 h-11" placeholder="you@example.com" type="email" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Пароль</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input className="pl-9 pr-9 h-11" placeholder="Введите пароль" type={showPassword ? 'text' : 'password'} />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <label className="flex items-center gap-2"><input type="checkbox" className="rounded" /> Запомнить</label>
                <a href="#" className="text-cyan hover:underline">Забыли пароль?</a>
              </div>
              <Button className="w-full h-11 gradient-bg text-white border-0 hover:opacity-90" onClick={() => onNavigate('dashboard')}>
                Войти <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </TabsContent>

            <TabsContent value="signup" className="p-6 space-y-4">
              <Button variant="outline" className="w-full h-11 gap-2">
                <Building2 className="w-4 h-4" /> Войти через HH.ru
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">или</span></div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Имя</label>
                <div className="relative">
                  <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input className="pl-9 h-11" placeholder="Сергей Т." />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input className="pl-9 h-11" placeholder="you@example.com" type="email" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Пароль</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input className="pl-9 h-11" placeholder="Минимум 8 символов" type="password" />
                </div>
              </div>
              <label className="flex items-start gap-2 text-sm text-muted-foreground">
                <input type="checkbox" className="rounded mt-0.5" />
                <span>Принимаю <a href="#" className="text-cyan hover:underline">условия использования</a> и <a href="#" className="text-cyan hover:underline">политику конфиденциальности</a></span>
              </label>
              <Button className="w-full h-11 gradient-bg text-white border-0 hover:opacity-90" onClick={() => onNavigate('dashboard')}>
                Создать аккаунт <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </TabsContent>
          </Tabs>
        </Card>

        <div className="text-center mt-4">
          <ThemeToggle variant="ghost" size="sm" showLabel />
        </div>
      </div>
    </div>
  )
}

// ============================================================
// DASHBOARD — Conversational OS
// ============================================================
function Dashboard({ onNavigate }: { onNavigate: (v: View) => void }) {
  const [activeMode, setActiveMode] = useState('chat')
  const [inputValue, setInputValue] = useState('')
  const [showPanel, setShowPanel] = useState(true)

  const modes = [
    { id: 'chat', label: 'Чат', icon: MessageSquare },
    { id: 'search', label: 'Поиск', icon: Search },
    { id: 'vacancies', label: 'Вакансии', icon: Briefcase },
    { id: 'interview', label: 'Интервью', icon: Mic },
    { id: 'analytics', label: 'Аналитика', icon: BarChart3 },
  ]

  const chatList = [
    { name: 'Яндекс — Елена', preview: 'Когда сможете пройти собеседование?', time: '2м', unread: true, color: 'bg-cyan/10 text-cyan' },
    { name: 'Avito — Михаил', preview: 'Расскажите о вашем опыте с Next.js', time: '15м', unread: true, color: 'bg-purple/10 text-purple' },
    { name: 'Тинькофф — Анна', preview: 'Отправьте портфолио', time: '1ч', unread: false, color: 'bg-orange-500/10 text-orange-400' },
    { name: 'VK — Дмитрий', preview: 'Спасибо за отклик! Нам интересен...', time: '2ч', unread: false, color: 'bg-emerald-500/10 text-emerald-400' },
  ]

  return (
    <div className="h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Ambient */}
      <div className="ambient-glow w-[500px] h-[500px] bg-cyan -top-48 -right-48" />
      <div className="ambient-glow w-[350px] h-[350px] bg-purple -bottom-32 -left-32" style={{ animationDelay: '-12s' }} />

      {/* Top Bar */}
      <header className="relative z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl shrink-0">
        <div className="px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-sm hidden sm:inline">HH Job Copilot</span>
            </div>
            <nav className="hidden md:flex gap-1 bg-muted rounded-lg p-1">
              {modes.map(m => (
                <button
                  key={m.id}
                  onClick={() => setActiveMode(m.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    activeMode === m.id ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <m.icon className="w-3.5 h-3.5" /> {m.label}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden lg:flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 bg-muted px-2.5 py-1 rounded-md"><Zap className="w-3 h-3 text-cyan" /><span className="font-semibold tabular-nums">47</span> откликов</span>
              <span className="flex items-center gap-1.5 bg-muted px-2.5 py-1 rounded-md"><Check className="w-3 h-3 text-emerald-400" /><span className="font-semibold tabular-nums">8</span> приглашений</span>
              <span className="flex items-center gap-1.5 bg-muted px-2.5 py-1 rounded-md"><MessageSquare className="w-3 h-3 text-purple" /><span className="font-semibold tabular-nums">5</span> чатов</span>
            </div>
            <ThemeToggle size="icon" className="h-8 w-8" />
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onNavigate('landing')}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex relative z-10 overflow-hidden">
        {/* Conversation */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
            {/* Header */}
            <div className="text-center pt-4 pb-2">
              <h2 className="text-2xl sm:text-3xl font-bold gradient-text">HH Job Copilot</h2>
              <p className="text-muted-foreground text-sm mt-1">Ваш AI-ассистент для поиска работы и прохождения интервью</p>
            </div>

            {/* AI Message: Digest */}
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-cyan mb-1">HH Job Copilot</p>
                <div className="bg-card border border-border rounded-2xl rounded-tl-sm p-4 space-y-3">
                  <p className="text-sm">Доброе утро, Сергей! Вот ваш дайджест за сегодня:</p>
                  {/* Inline Stats */}
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { value: '47', label: 'Отклики', color: 'text-cyan' },
                      { value: '8', label: 'Приглашения', color: 'text-emerald-400' },
                      { value: '5', label: 'Чаты', color: 'text-purple' },
                      { value: '2', label: 'Интервью', color: 'text-orange-400' },
                    ].map((s, i) => (
                      <div key={i} className="bg-muted rounded-lg p-2.5 text-center">
                        <div className={`text-lg font-bold tabular-nums ${s.color}`}>{s.value}</div>
                        <div className="text-[10px] text-muted-foreground">{s.label}</div>
                      </div>
                    ))}
                  </div>
                  {/* Chat messages card */}
                  <div className="bg-muted/50 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold flex items-center gap-1.5"><MessageSquare className="w-4 h-4 text-cyan" /> 3 новых сообщения</span>
                      <span className="text-xs text-cyan cursor-pointer flex items-center gap-1">Ответить всем <ChevronRight className="w-3 h-3" /></span>
                    </div>
                    {['Яндекс HR: Елена — Когда сможете пройти собеседование?', 'Avito HR: Михаил — Расскажите о вашем опыте с Next.js?', 'Тинькофф HR: Анна — Отправьте портфолио'].map((msg, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs py-1.5 border-b border-border/50 last:border-0">
                        <div className="w-6 h-6 rounded bg-muted flex items-center justify-center"><Building2 className="w-3 h-3 text-muted-foreground" /></div>
                        <span className="text-muted-foreground truncate flex-1">{msg}</span>
                      </div>
                    ))}
                    <div className="flex gap-2 pt-1">
                      <Button size="sm" className="h-7 text-xs gradient-bg text-white border-0 hover:opacity-90 gap-1"><Zap className="w-3 h-3" /> AI-ответ всем</Button>
                      <Button size="sm" variant="secondary" className="h-7 text-xs">Ответить вручную</Button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] text-muted-foreground">09:00</span>
                  <Badge variant="secondary" className="text-[10px] h-4 gap-1 bg-cyan/10 text-cyan border-0"><Zap className="w-2.5 h-2.5" /> Chatik API</Badge>
                </div>
              </div>
            </div>

            {/* User Message */}
            <div className="flex gap-3 flex-row-reverse">
              <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-foreground" />
              </div>
              <div className="bg-muted border border-border rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[80%]">
                <p className="text-sm">Ответь Елене из Яндекса, что готов на собеседование завтра в 14:00. И покажи новые вакансии по React</p>
              </div>
            </div>

            {/* AI Response: Action + Vacancies */}
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-cyan mb-1">HH Job Copilot</p>
                <div className="bg-card border border-border rounded-2xl rounded-tl-sm p-4 space-y-3">
                  <p className="text-sm">Готово! Ответ отправлен Елене через Chatik API:</p>
                  <div className="bg-muted rounded-lg p-3 border-l-2 border-cyan">
                    <p className="text-sm italic text-muted-foreground">&ldquo;Здравствуйте, Елена! Спасибо за приглашение. С удовольствием прохожу собеседование завтра в 14:00. Подскажите, какой формат — Zoom или Google Meet?&rdquo;</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-[10px] h-5 gap-1 bg-emerald-500/10 text-emerald-400 border-0"><Check className="w-3 h-3" /> Humanized</Badge>
                    <Badge variant="secondary" className="text-[10px] h-5 gap-1 bg-cyan/10 text-cyan border-0"><Zap className="w-3 h-3" /> Отправлено</Badge>
                  </div>
                  {/* Vacancies */}
                  <div className="bg-muted/50 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-purple" /> Топ вакансии React</span>
                      <span className="text-xs text-cyan cursor-pointer flex items-center gap-1">Все 12 <ChevronRight className="w-3 h-3" /></span>
                    </div>
                    {[
                      { title: 'Senior Frontend Developer', company: 'Яндекс', loc: 'Удаленка', salary: '250-350k', match: 95 },
                      { title: 'React Developer', company: 'Тинькофф', loc: 'Удаленка', salary: '220-320k', match: 92 },
                      { title: 'Frontend Lead', company: 'VK', loc: 'СПб', salary: '280-400k', match: 87 },
                    ].map((v, i) => (
                      <div key={i} className="flex items-center gap-2 py-1.5 border-b border-border/50 last:border-0">
                        <div className="w-7 h-7 rounded bg-muted flex items-center justify-center"><Building2 className="w-3.5 h-3.5 text-muted-foreground" /></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{v.title}</p>
                          <p className="text-[10px] text-muted-foreground">{v.company} &bull; {v.loc}</p>
                        </div>
                        <span className="text-xs font-medium text-emerald-400 whitespace-nowrap">{v.salary}</span>
                        <Badge variant="secondary" className="text-[9px] h-4 bg-cyan/10 text-cyan border-0">{v.match}%</Badge>
                      </div>
                    ))}
                    <div className="flex gap-2 pt-1">
                      <Button size="sm" className="h-7 text-xs gradient-bg text-white border-0 hover:opacity-90 gap-1"><Zap className="w-3 h-3" /> Массовый отклик</Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs gap-1"><Layers className="w-3 h-3" /> AI-сопоставление</Button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] text-muted-foreground">09:02</span>
                  <Badge variant="secondary" className="text-[10px] h-4 gap-1 bg-cyan/10 text-cyan border-0"><Zap className="w-2.5 h-2.5" /> Chatik API</Badge>
                  <Badge variant="secondary" className="text-[10px] h-4 gap-1 bg-emerald-500/10 text-emerald-400 border-0"><Check className="w-2.5 h-2.5" /> Humanized</Badge>
                </div>
              </div>
            </div>

            {/* Interview Mode Card */}
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-cyan mb-1">HH Job Copilot</p>
                <div className="bg-card border border-border rounded-2xl rounded-tl-sm p-4 space-y-3">
                  <p className="text-sm">Интервью-режим активирован! Микрофон включён, ASR готов.</p>
                  <div className="rounded-xl border border-cyan/20 bg-gradient-to-br from-cyan/5 to-purple/5 overflow-hidden">
                    <div className="flex items-center gap-2 px-3 py-2 border-b border-cyan/10">
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-red-400"><span className="w-2 h-2 rounded-full bg-red-400 animate-pulse-dot" /> LIVE</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><Mic className="w-3 h-3" /> Яндекс — Senior Frontend</span>
                    </div>
                    <div className="p-3 space-y-2">
                      <p className="text-sm"><span className="font-semibold text-purple">Интервьюер:</span> Здравствуйте! Расскажите о вашем опыте работы с React и Next.js?</p>
                      <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-lg p-2.5">
                        <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider mb-1 flex items-center gap-1"><Zap className="w-3 h-3" /> AI Подсказка</p>
                        <p className="text-xs text-muted-foreground leading-relaxed">Работаю с React 5+ лет, с Next.js — 3 года. В последнем проекте реализовал SSR для e-commerce (500k+ MAU), настроил ISR для каталога, интегрировал middleware для A/B тестирования.</p>
                      </div>
                      <p className="text-sm flex items-center gap-2">
                        <span className="font-semibold text-cyan">Вы:</span> Работаю с React уже более 5 лет...
                        <span className="flex items-end gap-0.5 h-3.5">
                          {[0, 0.15, 0.3, 0.45].map((d, i) => (
                            <span key={i} className="w-0.5 bg-purple rounded-full animate-wave" style={{ animationDelay: `${d}s` }} />
                          ))}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] text-muted-foreground">13:55</span>
                  <Badge variant="secondary" className="text-[10px] h-4 gap-1 bg-purple/10 text-purple border-0"><Mic className="w-2.5 h-2.5" /> ASR Active</Badge>
                </div>
              </div>
            </div>

            {/* Analytics Inline */}
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-cyan mb-1">HH Job Copilot</p>
                <div className="bg-card border border-border rounded-2xl rounded-tl-sm p-4 space-y-3">
                  <p className="text-sm">Вот ваша аналитика за неделю:</p>
                  <div className="bg-muted/50 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold flex items-center gap-1.5"><BarChart3 className="w-4 h-4 text-cyan" /> Отклики за неделю</span>
                      <span className="text-xs text-cyan cursor-pointer">Подробнее</span>
                    </div>
                    {/* Chart */}
                    <div className="flex items-end gap-1 h-20 px-1">
                      {[40, 65, 45, 80, 55, 92, 70].map((h, i) => (
                        <div key={i} className="flex-1 rounded-t-sm transition-all duration-300" style={{
                          height: `${h}%`,
                          background: i >= 5 ? '#4ade80' : i === 3 ? '#a78bfa' : '#22d3ee',
                          opacity: 0.7 + (h / 400),
                        }} />
                      ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-muted-foreground px-1">
                      {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(d => <span key={d}>{d}</span>)}
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { v: '47', l: 'Отклики', c: 'text-cyan' },
                      { v: '8', l: 'Приглашения', c: 'text-emerald-400' },
                      { v: '17%', l: 'Конверсия', c: 'text-purple' },
                      { v: '89%', l: 'Совпадение', c: 'text-orange-400' },
                    ].map((s, i) => (
                      <div key={i} className="bg-muted rounded-lg p-2 text-center">
                        <div className={`text-sm font-bold tabular-nums ${s.c}`}>{s.v}</div>
                        <div className="text-[9px] text-muted-foreground">{s.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] text-muted-foreground">14:10</span>
                  <Badge variant="secondary" className="text-[10px] h-4 gap-1 bg-orange-500/10 text-orange-400 border-0"><BarChart3 className="w-2.5 h-2.5" /> Analytics</Badge>
                </div>
              </div>
            </div>

            {/* Spacer for input */}
            <div className="h-24" />
          </div>
        </main>

        {/* Float Panel: Chats */}
        {showPanel && (
          <aside className="hidden lg:flex flex-col w-[340px] border-l border-border/50 bg-background/80 backdrop-blur-xl shrink-0">
            <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
              <span className="text-sm font-semibold flex items-center gap-1.5"><MessageSquare className="w-4 h-4 text-cyan" /> Активные чаты</span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowPanel(false)}><X className="w-3 h-3" /></Button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {chatList.map((c, i) => (
                <div key={i} className={`flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors ${c.unread ? 'bg-muted/30' : ''}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${c.color}`}>
                    {c.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium truncate">{c.name}</span>
                      <span className="text-[10px] text-muted-foreground">{c.time}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">{c.preview}</p>
                  </div>
                  {c.unread && <div className="w-2 h-2 rounded-full bg-cyan shrink-0" />}
                </div>
              ))}
            </div>
            {/* Profile Card */}
            <div className="border-t border-border/50 p-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold">Сергей Т.</p>
                  <p className="text-[10px] text-muted-foreground">Pro тариф</p>
                </div>
                <div className="flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[10px] font-medium text-emerald-400">7 дней streak</span>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Input Bar */}
      <div className="relative z-50 border-t border-border/50 bg-background/80 backdrop-blur-xl shrink-0">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center gap-2 bg-muted rounded-xl px-4 py-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0"><Send className="w-4 h-4" /></Button>
            <input
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Спросите что угодно или дайте команду..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8"><Mic className="w-4 h-4 text-purple" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8"><Briefcase className="w-4 h-4 text-cyan" /></Button>
            </div>
          </div>
          <p className="text-center text-[10px] text-muted-foreground mt-2">HH Job Copilot может ошибаться. Проверяйте важную информацию.</p>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// MAIN ROUTER
// ============================================================
export default function Home() {
  const [view, setView] = useState<View>('landing')

  switch (view) {
    case 'landing':
      return <LandingPage onNavigate={setView} />
    case 'auth':
      return <AuthPage onNavigate={setView} />
    case 'dashboard':
      return <Dashboard onNavigate={setView} />
  }
}
