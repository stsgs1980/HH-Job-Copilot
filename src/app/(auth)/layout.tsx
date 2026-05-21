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
        {/* NEURO: Gradient mesh background */}
        <div className="absolute inset-0" style={{
          background: [
            'radial-gradient(ellipse at 20% 50%, rgba(34,211,238,0.1) 0%, transparent 50%)',
            'radial-gradient(ellipse at 80% 20%, rgba(167,139,250,0.08) 0%, transparent 40%)',
            'radial-gradient(ellipse at 60% 80%, rgba(52,211,153,0.06) 0%, transparent 40%)',
          ].join(', '),
        }} />

        {/* NEURO: Dot pattern */}
        <div className="dot-pattern top-[30%] right-[10%]" />

        <div className="relative z-10 p-16 max-w-lg" style={{
          animation: 'fadeInUp 0.8s ease-out both',
        }}>
          <Link href="/" className="flex items-center gap-3 mb-12" style={{ perspective: '600px' }}>
            <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center font-black text-lg text-white"
              style={{
                transform: 'rotateY(-8deg) rotateX(4deg)',
                boxShadow: '0 6px 30px rgba(34,211,238,0.35), 0 6px 30px rgba(167,139,250,0.2)',
                animation: 'fadeInUp 0.8s ease-out 0.1s both',
              }}
            >
              HC
            </div>
            <span className="text-2xl font-extrabold tracking-tight" style={{ animation: 'fadeInUp 0.8s ease-out 0.15s both' }}>
              HH <span className="gradient-text">Copilot</span>
            </span>
          </Link>

          <h1 className="text-4xl sm:text-5xl font-extrabold leading-[1.1] tracking-tight mb-5" style={{ animation: 'fadeInUp 0.8s ease-out 0.2s both' }}>
            Найди работу <span className="gradient-text">мечты</span>
          </h1>

          <p className="text-base text-muted-foreground leading-relaxed mb-10 font-light" style={{ animation: 'fadeInUp 0.8s ease-out 0.3s both' }}>
            Автоматизируйте поиск на HH.ru, получайте AI-подсказки на собеседованиях и получайте офферы быстрее, чем когда-либо
          </p>

          {/* Testimonial */}
          <div className="glass-card p-7 relative overflow-hidden" style={{ animation: 'fadeInUp 0.8s ease-out 0.4s both' }}>
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

        <div className="relative z-10 w-full max-w-md" style={{ animation: 'fadeInUp 0.6s ease-out 0.2s both' }}>
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
