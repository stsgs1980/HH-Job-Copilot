'use client'

import { useState } from 'react'
import { Building2, Mail, Lock, UserPlus, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface AuthFormProps {
  onNavigate: () => void
}

export function AuthForm({ onNavigate }: AuthFormProps) {
  const [authTab, setAuthTab] = useState('signin')
  const [showPassword, setShowPassword] = useState(false)

  return (
    <Card className="border-border/50">
      <Tabs value={authTab} onValueChange={setAuthTab}>
        <TabsList className="grid w-full grid-cols-2 m-4 mb-0">
          <TabsTrigger value="signin">Вход</TabsTrigger>
          <TabsTrigger value="signup">Регистрация</TabsTrigger>
        </TabsList>

        <TabsContent value="signin" className="p-6 space-y-4">
          <Button variant="outline" className="w-full h-11 gap-2" onClick={onNavigate}>
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
          <Button className="w-full h-11 gradient-bg text-white border-0 hover:opacity-90" onClick={onNavigate}>
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
          <Button className="w-full h-11 gradient-bg text-white border-0 hover:opacity-90" onClick={onNavigate}>
            Создать аккаунт <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
