'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Building2, Mail, Lock, UserPlus, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const NEXTAUTH_ENABLED = process.env.NEXT_PUBLIC_FEATURE_NEXTAUTH === 'true'

interface AuthFormProps {
  onNavigate: () => void
}

export function AuthForm({ onNavigate }: AuthFormProps) {
  const [authTab, setAuthTab] = useState('signin')
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleCredentialsSignIn() {
    if (!NEXTAUTH_ENABLED) {
      onNavigate()
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
      } else {
        onNavigate()
      }
    } catch {
      setError('Произошла ошибка при входе')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCredentialsSignUp() {
    if (!NEXTAUTH_ENABLED) {
      onNavigate()
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
      } else {
        onNavigate()
      }
    } catch {
      setError('Произошла ошибка при регистрации')
    } finally {
      setIsLoading(false)
    }
  }

  function handleHHSignIn() {
    if (!NEXTAUTH_ENABLED) {
      onNavigate()
      return
    }
    signIn('hh', { callbackUrl: '/dashboard' })
  }

  function handleGoogleSignIn() {
    if (!NEXTAUTH_ENABLED) {
      onNavigate()
      return
    }
    signIn('google', { callbackUrl: '/dashboard' })
  }

  const tabStyle = "flex-1 py-3 rounded-xl font-semibold text-sm transition-all"
  const activeTabStyle = "gradient-bg text-white shadow-lg shadow-cyan/20"
  const inactiveTabStyle = "text-muted-foreground hover:text-foreground"

  return (
    <Tabs value={authTab} onValueChange={setAuthTab}>
      {/* Tab switcher — glassmorphism style */}
      <TabsList className="grid w-full grid-cols-2 p-1 mb-8 glass-card rounded-2xl h-auto">
        <TabsTrigger
          value="signin"
          className={`${tabStyle} ${authTab === 'signin' ? activeTabStyle : inactiveTabStyle}`}
        >
          Вход
        </TabsTrigger>
        <TabsTrigger
          value="signup"
          className={`${tabStyle} ${authTab === 'signup' ? activeTabStyle : inactiveTabStyle}`}
        >
          Регистрация
        </TabsTrigger>
      </TabsList>

      {/* Sign In */}
      <TabsContent value="signin" className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="signin-email" className="text-sm font-semibold text-muted-foreground tracking-wide">Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="signin-email"
              className="pl-11 h-12 glass-card border-border/50 rounded-xl focus:border-cyan/40 focus:ring-cyan/10"
              placeholder="anna@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="signin-password" className="text-sm font-semibold text-muted-foreground tracking-wide">Пароль</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="signin-password"
              className="pl-11 pr-11 h-12 glass-card border-border/50 rounded-xl focus:border-cyan/40 focus:ring-cyan/10"
              placeholder="Введите пароль"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3" role="alert">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}
        <div className="flex justify-between items-center text-sm">
          <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
            <input type="checkbox" className="rounded accent-cyan" defaultChecked /> Запомнить меня
          </label>
          <a href="#" className="text-cyan hover:text-cyan-light transition-colors font-medium">Забыли пароль?</a>
        </div>
        <Button
          className="w-full h-12 gradient-bg text-white border-0 hover:opacity-90 sweep-btn rounded-xl text-base font-bold"
          onClick={handleCredentialsSignIn}
          disabled={isLoading}
        >
          {isLoading ? 'Входим...' : <>Войти <ArrowRight className="ml-2 w-4 h-4" /></>}
        </Button>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex-1 h-px bg-border/50" />
          или
          <div className="flex-1 h-px bg-border/50" />
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 h-11 gap-2 glass-card border-border/50 rounded-xl hover:border-cyan/30 hover-glow"
            onClick={handleHHSignIn}
            disabled={isLoading}
          >
            <Building2 className="w-4 h-4" /> HH.ru
          </Button>
          <Button
            variant="outline"
            className="flex-1 h-11 gap-2 glass-card border-border/50 rounded-xl hover:border-cyan/30 hover-glow"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Google
          </Button>
        </div>
      </TabsContent>

      {/* Sign Up */}
      <TabsContent value="signup" className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="signup-name" className="text-sm font-semibold text-muted-foreground tracking-wide">Имя</label>
          <div className="relative">
            <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="signup-name"
              className="pl-11 h-12 glass-card border-border/50 rounded-xl focus:border-cyan/40 focus:ring-cyan/10"
              placeholder="Ваше имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="signup-email" className="text-sm font-semibold text-muted-foreground tracking-wide">Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="signup-email"
              className="pl-11 h-12 glass-card border-border/50 rounded-xl focus:border-cyan/40 focus:ring-cyan/10"
              placeholder="anna@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="signup-password" className="text-sm font-semibold text-muted-foreground tracking-wide">Пароль</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="signup-password"
              className="pl-11 h-12 glass-card border-border/50 rounded-xl focus:border-cyan/40 focus:ring-cyan/10"
              placeholder="Минимум 8 символов"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
        </div>
        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3" role="alert">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}
        <label className="flex items-start gap-2 text-sm text-muted-foreground">
          <input type="checkbox" className="rounded accent-cyan mt-0.5" />
          <span>Принимаю <a href="#" className="text-cyan hover:text-cyan-light transition-colors">условия использования</a></span>
        </label>
        <Button
          className="w-full h-12 gradient-bg text-white border-0 hover:opacity-90 sweep-btn rounded-xl text-base font-bold"
          onClick={handleCredentialsSignUp}
          disabled={isLoading}
        >
          {isLoading ? 'Создаём...' : <>Создать аккаунт <ArrowRight className="ml-2 w-4 h-4" /></>}
        </Button>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex-1 h-px bg-border/50" />
          или
          <div className="flex-1 h-px bg-border/50" />
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 h-11 gap-2 glass-card border-border/50 rounded-xl hover:border-cyan/30 hover-glow"
            onClick={handleHHSignIn}
            disabled={isLoading}
          >
            <Building2 className="w-4 h-4" /> HH.ru
          </Button>
          <Button
            variant="outline"
            className="flex-1 h-11 gap-2 glass-card border-border/50 rounded-xl hover:border-cyan/30 hover-glow"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Google
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  )
}
