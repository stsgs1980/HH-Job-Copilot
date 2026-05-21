'use client'

import { useState, useEffect, useCallback } from 'react'
import { useProfile } from '@/hooks/use-profile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  User, FileText, MapPin, Building2, Globe, Save, Loader2, Check,
  ArrowLeft, Sparkles,
} from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const router = useRouter()
  const { profile, isLoading, updateProfile, isUpdating } = useProfile()

  const [name, setName] = useState('')
  const [resume, setResume] = useState('')
  const [salaryMin, setSalaryMin] = useState('')
  const [salaryMax, setSalaryMax] = useState('')
  const [location, setLocation] = useState('')
  const [format, setFormat] = useState('remote')
  const [saved, setSaved] = useState(false)

  // Populate form from profile
  useEffect(() => {
    if (profile) {
      setName(profile.name ?? '')
      setResume(profile.resumeText ?? '')

      if (profile.preferences) {
        try {
          const prefs = JSON.parse(profile.preferences)
          setSalaryMin(prefs.salaryMin ? String(prefs.salaryMin) : '')
          setSalaryMax(prefs.salaryMax ? String(prefs.salaryMax) : '')
          setLocation(prefs.location ?? '')
          setFormat(prefs.format ?? 'remote')
        } catch {
          // Ignore parse errors
        }
      }
    }
  }, [profile])

  const handleSave = useCallback(() => {
    const preferences = JSON.stringify({
      salaryMin: salaryMin ? parseInt(salaryMin.replace(/\s/g, ''), 10) : null,
      salaryMax: salaryMax ? parseInt(salaryMax.replace(/\s/g, ''), 10) : null,
      location,
      format,
    })

    updateProfile({ name: name || undefined, resumeText: resume || undefined, preferences })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }, [name, resume, salaryMin, salaryMax, location, format, updateProfile])

  if (isLoading) {
    return (
      <main className="flex-1 overflow-y-auto" id="main-content">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-6 h-6 animate-spin text-cyan" />
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 overflow-y-auto" id="main-content">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Настройки</h2>
            <p className="text-sm text-muted-foreground">Профиль и предпочтения</p>
          </div>
          <Button
            onClick={handleSave}
            disabled={isUpdating}
            className="gradient-bg text-white border-0 hover:opacity-90 gap-1.5"
          >
            {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? 'Сохранено' : 'Сохранить'}
          </Button>
        </div>

        {/* Profile section */}
        <div className="glass-card rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold flex items-center gap-1.5">
            <User className="w-4 h-4 text-cyan" /> Профиль
          </h3>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center shrink-0">
              <span className="text-lg font-bold text-white">{(name || 'С')[0]}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{name || 'Пользователь'}</span>
                <Badge className="text-[10px] h-4 bg-cyan/10 text-cyan border-0">{profile?.plan ?? 'STARTER'}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">{profile?.email ?? 'demo@hhcopilot.ru'}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="settings-name" className="text-xs font-medium">Имя</label>
            <Input
              id="settings-name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ваше имя"
              className="h-9"
            />
          </div>
        </div>

        {/* Resume section */}
        <div className="glass-card rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-emerald" /> Резюме
          </h3>
          <p className="text-xs text-muted-foreground">AI использует резюме для подбора вакансий и составления сопроводительных писем</p>
          <textarea
            value={resume}
            onChange={e => setResume(e.target.value)}
            placeholder="Frontend Developer с 5-летним опытом. Основной стек: React, Next.js, TypeScript..."
            className="w-full min-h-[120px] rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring resize-none"
          />
        </div>

        {/* Preferences section */}
        <div className="glass-card rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple" /> Предпочтения
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="settings-sal-min" className="text-xs font-medium">Зарплата от</label>
              <Input
                id="settings-sal-min"
                placeholder="250 000"
                value={salaryMin}
                onChange={e => setSalaryMin(e.target.value)}
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="settings-sal-max" className="text-xs font-medium">Зарплата до</label>
              <Input
                id="settings-sal-max"
                placeholder="400 000"
                value={salaryMax}
                onChange={e => setSalaryMax(e.target.value)}
                className="h-9"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="settings-loc" className="text-xs font-medium flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Локация
            </label>
            <Input
              id="settings-loc"
              placeholder="Удаленка / Москва / СПб"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="h-9"
            />
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-medium flex items-center gap-1">
              <Globe className="w-3 h-3" /> Формат работы
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'remote', label: 'Удаленка', icon: Globe },
                { id: 'office', label: 'Офис', icon: Building2 },
                { id: 'hybrid', label: 'Гибрид', icon: User },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFormat(f.id)}
                  className={`flex flex-col items-center gap-1 p-2.5 rounded-lg border transition-all text-xs ${
                    format === f.id
                      ? 'border-cyan bg-cyan/5 text-cyan'
                      : 'border-border/50 hover:border-cyan/30 text-muted-foreground'
                  }`}
                >
                  <f.icon className="w-3.5 h-3.5" />
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Integrations section */}
        <div className="glass-card rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-orange-400" /> Интеграции
          </h3>

          <div className="flex items-center justify-between py-2 border-b border-border/50">
            <div>
              <p className="text-sm font-medium">HH.ru OAuth</p>
              <p className="text-xs text-muted-foreground">Доступ к вакансиям и профилю</p>
            </div>
            <Badge className={`text-[10px] border-0 ${profile?.hhToken ? 'bg-emerald/10 text-emerald' : 'bg-muted text-muted-foreground'}`}>
              {profile?.hhToken ? 'Подключено' : 'Не подключено'}
            </Badge>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium">Chatik API</p>
              <p className="text-xs text-muted-foreground">Чаты с HR и автo-ответы</p>
            </div>
            <Badge className={`text-[10px] border-0 ${profile?.hhCookies ? 'bg-emerald/10 text-emerald' : 'bg-muted text-muted-foreground'}`}>
              {profile?.hhCookies ? 'Подключено' : 'Не подключено'}
            </Badge>
          </div>
        </div>

        <div className="h-24" />
      </div>
    </main>
  )
}
