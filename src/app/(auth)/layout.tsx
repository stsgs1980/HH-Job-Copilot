import Link from 'next/link'
import { Logo, ThemeToggle } from '@/components/shared'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex bg-background relative overflow-hidden">
      {/* NEURO: Mesh gradient blobs */}
      <div className="mesh-blob mesh-blob-1 top-[10%] left-[10%]" />
      <div className="mesh-blob mesh-blob-2 bottom-[20%] right-[10%]" />
      <div className="mesh-blob mesh-blob-3 top-[50%] left-[50%]" />

      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center" aria-hidden="true">
        <div className="dot-pattern top-[30%] right-[10%]" />
        <div className="relative z-10 p-16 max-w-lg">
          <Link href="/" className="flex items-center gap-3 mb-12">
            <Logo size="lg" />
          </Link>
          <h1 className="text-4xl sm:text-5xl font-black leading-[1.1] tracking-tight mb-5">
            Найди работу <span className="gradient-text">мечты</span>
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed mb-10 font-light">
            Автоматизируйте поиск на HH.ru, получайте AI-подсказки на собеседованиях и получайте офферы быстрее, чем когда-либо
          </p>
          {/* Testimonial */}
          <div className="glass-card p-7 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-0.5 h-full gradient-bg" />
            <p className="text-sm text-muted-foreground leading-relaxed italic mb-4">
              С HH Copilot я нашла работу за 2 недели вместо 3 месяцев. AI-подсказки на собеседовании — это просто магия!
            </p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center text-xs font-bold text-white">
                АК
              </div>
              <div>
                <div className="text-sm font-semibold">Анна Козлова</div>
                <div className="text-xs text-muted-foreground">Frontend Developer, Яндекс</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 relative">
        {/* Left border gradient */}
        <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent" />

        <div className="relative z-10 w-full max-w-md page-transition">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/">
              <Logo size="lg" />
            </Link>
          </div>

          <div className="hover-glow rounded-2xl">
            {children}
          </div>

          <div className="text-center mt-6">
            <ThemeToggle variant="ghost" size="sm" showLabel />
          </div>

          <p className="text-center text-xs text-muted-foreground mt-4">
            Продолжая, вы соглашаетесь с{' '}
            <a href="#" className="text-cyan hover:text-cyan-light transition-colors">Политикой конфиденциальности</a>
          </p>
        </div>
      </div>
    </div>
  )
}
