import Link from 'next/link'
import { Logo, ThemeToggle } from '@/components/shared'
import { GradientOrb } from '@/components/neuro'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex bg-background relative overflow-hidden">
      {/* NEURO: Mesh gradient blobs — larger, organic */}
      <div className="mesh-blob mesh-blob-1 top-[5%] left-[5%]" />
      <div className="mesh-blob mesh-blob-2 bottom-[10%] right-[5%]" />
      <div className="mesh-blob mesh-blob-3 top-[40%] left-[45%]" />

      {/* NEURO v4: Premium gradient orbs */}
      <GradientOrb color="purple" size={350} x="30%" y="50%" />
      <GradientOrb color="emerald" size={250} x="80%" y="25%" />

      {/* NEURO: Dot pattern — dual-layer */}
      <div className="dot-pattern top-[20%] right-[8%]" />

      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center" aria-hidden="true">
        {/* NEURO: Deep gradient mesh background */}
        <div className="absolute inset-0 gradient-mesh-deep" />

        {/* NEURO: Dot pattern */}
        <div className="dot-pattern top-[30%] right-[10%]" />

        {/* NEURO: Floating elements */}
        <div className="absolute top-1/3 right-1/4 w-2 h-2 rounded-full bg-cyan/25 animate-float" />
        <div className="absolute bottom-1/3 left-1/4 w-3 h-3 rounded-full bg-purple/20 animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute top-[60%] right-[15%] w-2 h-2 rounded-full bg-emerald/15 animate-float" style={{ animationDelay: '5s' }} />

        <div className="relative z-10 p-16 max-w-lg" style={{
          animation: 'fadeInUp 0.8s cubic-bezier(0.23, 1, 0.32, 1) both',
        }}>
          <Link href="/" className="flex items-center gap-3 mb-12" style={{ perspective: '800px' }}>
            <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center font-black text-lg text-white"
              style={{
                transform: 'rotateY(-8deg) rotateX(4deg)',
                boxShadow: '0 8px 30px rgba(34,211,238,0.45), 0 4px 20px rgba(167,139,250,0.25)',
                animation: 'fadeInUp 0.8s cubic-bezier(0.23, 1, 0.32, 1) 0.1s both',
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" aria-hidden="true">
                <path d="M12 2L21 7.5V16.5L12 22L3 16.5V7.5L12 2Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M12 8V12M9 10.5H15M12 12L9 14M12 12L15 14" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
              </svg>
            </div>
            <span className="text-2xl font-extrabold tracking-tight" style={{ animation: 'fadeInUp 0.8s cubic-bezier(0.23, 1, 0.32, 1) 0.15s both' }}>
              HH <span className="gradient-text">Copilot</span>
            </span>
          </Link>

          <h1 className="text-4xl sm:text-5xl font-extrabold leading-[1.1] tracking-tight mb-5" style={{ animation: 'fadeInUp 0.8s cubic-bezier(0.23, 1, 0.32, 1) 0.2s both' }}>
            Найди работу <span className="gradient-text-animated">мечты</span>
          </h1>

          <p className="text-base text-muted-foreground leading-relaxed mb-10 font-light" style={{ animation: 'fadeInUp 0.8s cubic-bezier(0.23, 1, 0.32, 1) 0.3s both' }}>
            Автоматизируйте поиск на HH.ru, получайте AI-подсказки на собеседованиях и получайте офферы быстрее, чем когда-либо
          </p>

          {/* Testimonial — elevated glass card with gradient accent */}
          <div className="glass-card-elevated p-7 relative overflow-hidden" style={{ animation: 'fadeInUp 0.8s cubic-bezier(0.23, 1, 0.32, 1) 0.4s both' }}>
            <div className="absolute top-0 left-0 w-0.5 h-full gradient-bg" />
            <p className="text-sm text-muted-foreground leading-relaxed italic mb-4">
              С HH Copilot я нашла работу за 2 недели вместо 3 месяцев. AI-подсказки на собеседовании — это просто магия!
            </p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center text-xs font-bold text-white shadow-sm shadow-cyan/20">
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
        {/* Left border gradient line */}
        <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-cyan/20 to-transparent" />

        <div className="relative z-10 w-full max-w-md" style={{ animation: 'fadeInUp 0.6s cubic-bezier(0.23, 1, 0.32, 1) 0.2s both' }}>
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/">
              <Logo size="lg" />
            </Link>
          </div>

          <div className="glass-card-elevated p-8 hover-glow glow-line">
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
