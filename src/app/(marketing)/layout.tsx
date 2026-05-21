import Link from 'next/link'
import { Logo, ThemeToggle } from '@/components/shared'
import { Button } from '@/components/ui/button'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <nav className="sticky top-0 z-50 glass-card rounded-none border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Возможности</a>
            <a href="#how" className="hover:text-foreground transition-colors">Как работает</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Тарифы</a>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" size="sm">Войти</Button>
            </Link>
            <Link href="/login">
              <Button size="sm" className="gradient-bg text-white border-0 hover:opacity-90">
                Начать бесплатно
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 gradient-mesh">{children}</main>

      <footer className="border-t border-border/50 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link href="/">
            <Logo size="sm" />
          </Link>
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
