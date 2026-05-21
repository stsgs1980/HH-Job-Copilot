import Link from 'next/link'
import { Logo, ThemeToggle } from '@/components/shared'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background gradient-mesh relative overflow-hidden">
      <div className="ambient-glow w-[400px] h-[400px] bg-cyan -top-32 -right-32" />
      <div className="ambient-glow w-[300px] h-[300px] bg-purple -bottom-24 -left-24" style={{ animationDelay: '-8s' }} />
      <div className="relative z-10 w-full max-w-md px-4 page-transition">
        <div className="text-center mb-8">
          <Link href="/">
            <Logo size="lg" />
          </Link>
          <p className="text-muted-foreground text-sm mt-1">Войдите в свой аккаунт</p>
        </div>
        <div className="hover-glow rounded-xl">
          {children}
        </div>
        <div className="text-center mt-4">
          <ThemeToggle variant="ghost" size="sm" showLabel />
        </div>
      </div>
    </div>
  )
}
