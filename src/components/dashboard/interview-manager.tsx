'use client'

import { useState, useCallback } from 'react'
import { useInterviews, type InterviewItem } from '@/hooks/use-interviews'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Mic, Plus, Calendar, Building2, Zap, Loader2, CheckCircle2,
  Play, Trash2, ChevronDown, ChevronUp,
} from 'lucide-react'

const INTERVIEW_STATUS: Record<string, { label: string; color: string; bgColor: string }> = {
  SCHEDULED: { label: 'Запланировано', color: 'text-cyan', bgColor: 'bg-cyan/10' },
  IN_PROGRESS: { label: 'Идёт', color: 'text-red-400', bgColor: 'bg-red-500/10' },
  COMPLETED: { label: 'Завершено', color: 'text-emerald', bgColor: 'bg-emerald/10' },
  CANCELLED: { label: 'Отменено', color: 'text-muted-foreground', bgColor: 'bg-muted' },
}

export function InterviewManager() {
  const { interviews, stats, isLoading, create, isCreating, update, deleteInterview } = useInterviews()
  const [showCreate, setShowCreate] = useState(false)
  const [newInterview, setNewInterview] = useState({ company: '', position: '', scheduledAt: '' })

  const handleCreate = useCallback(() => {
    if (!newInterview.company.trim() || !newInterview.position.trim()) return
    create({
      company: newInterview.company.trim(),
      position: newInterview.position.trim(),
      scheduledAt: newInterview.scheduledAt || undefined,
    })
    setNewInterview({ company: '', position: '', scheduledAt: '' })
    setShowCreate(false)
  }, [newInterview, create])

  return (
    <main className="flex-1 overflow-y-auto" id="main-content">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {/* Stats */}
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { label: 'Запланировано', value: stats.scheduled, color: 'text-cyan' },
            { label: 'В процессе', value: stats.inProgress, color: 'text-red-400' },
            { label: 'Завершено', value: stats.completed, color: 'text-emerald' },
            { label: 'Всего', value: stats.total, color: 'text-purple' },
          ].map(s => (
            <div key={s.label} className="bg-muted/30 border border-border/20 rounded-lg p-2 text-center">
              <div className={`text-base font-bold tabular-nums ${s.color}`}>{s.value}</div>
              <div className="text-[9px] text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Add button */}
        <Button
          onClick={() => setShowCreate(!showCreate)}
          className="gradient-bg text-white border-0 hover:opacity-90 w-full h-10 gap-2 text-sm"
        >
          <Plus className="w-4 h-4" /> Запланировать интервью
        </Button>

        {/* Create form */}
        {showCreate && (
          <div className="bg-muted/20 border border-border/30 rounded-xl p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="int-company" className="text-xs font-medium block mb-1">Компания</label>
                <Input id="int-company" placeholder="Яндекс" value={newInterview.company} onChange={e => setNewInterview(p => ({ ...p, company: e.target.value }))} className="h-9" />
              </div>
              <div>
                <label htmlFor="int-position" className="text-xs font-medium block mb-1">Позиция</label>
                <Input id="int-position" placeholder="Senior Frontend" value={newInterview.position} onChange={e => setNewInterview(p => ({ ...p, position: e.target.value }))} className="h-9" />
              </div>
            </div>
            <div>
              <label htmlFor="int-date" className="text-xs font-medium block mb-1">Дата и время</label>
              <Input id="int-date" type="datetime-local" value={newInterview.scheduledAt} onChange={e => setNewInterview(p => ({ ...p, scheduledAt: e.target.value }))} className="h-9" />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreate} disabled={isCreating || !newInterview.company.trim() || !newInterview.position.trim()} className="gradient-bg text-white border-0 hover:opacity-90 h-9 text-xs gap-1">
                {isCreating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Calendar className="w-3 h-3" />} Создать
              </Button>
              <Button variant="outline" onClick={() => setShowCreate(false)} className="h-9 text-xs">Отмена</Button>
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-12 gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin text-cyan" /> Загрузка...
          </div>
        )}

        {/* Empty */}
        {!isLoading && interviews.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Mic className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
            <p className="text-sm">Пока нет интервью</p>
            <p className="text-xs mt-1 text-muted-foreground/60">Запланируйте, чтобы получать AI-подсказки</p>
          </div>
        )}

        {/* List */}
        {!isLoading && interviews.map(interview => (
          <InterviewCard key={interview.id} interview={interview} update={update} deleteInterview={deleteInterview} />
        ))}

        <div className="h-20" />
      </div>
    </main>
  )
}

function InterviewCard({
  interview,
  update,
  deleteInterview,
}: {
  interview: InterviewItem
  update: (data: { id: string; status?: string; transcript?: string; aiHints?: string; aiSummary?: string }) => void
  deleteInterview: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [hintLoading, setHintLoading] = useState(false)
  const [aiHint, setAiHint] = useState<string | null>(null)
  const statusConfig = INTERVIEW_STATUS[interview.status] ?? INTERVIEW_STATUS.SCHEDULED

  const handleGetHint = useCallback(async () => {
    setHintLoading(true)
    try {
      const res = await fetch('/api/ai/interview-hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interviewId: interview.id,
          question: `Собеседование ${interview.position} в ${interview.company}.`,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setAiHint(data.hint)
      }
    } catch {
      setAiHint('Не удалось получить подсказку.')
    } finally {
      setHintLoading(false)
    }
  }, [interview])

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return ''
    try { return new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) } catch { return '' }
  }

  return (
    <div className="bg-muted/20 border border-border/30 rounded-xl p-3.5 space-y-2">
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${interview.status === 'IN_PROGRESS' ? 'bg-red-500/20' : 'gradient-bg'}`}>
          {interview.status === 'IN_PROGRESS' ? (
            <Mic className="w-4 h-4 text-red-400 animate-pulse" />
          ) : (
            <Building2 className="w-4 h-4 text-white" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">{interview.position}</h3>
              <p className="text-xs text-muted-foreground">{interview.company}</p>
            </div>
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md shrink-0 ${statusConfig.bgColor} ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
          </div>
        </div>
      </div>

      {interview.scheduledAt && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground ml-12">
          <Calendar className="w-3 h-3" /> {formatDate(interview.scheduledAt)}
        </div>
      )}

      {interview.status === 'IN_PROGRESS' && (
        <div className="flex items-center gap-2 ml-12">
          <span className="flex items-center gap-1 text-[10px] font-semibold text-red-400 px-1.5 py-0.5 bg-red-500/10 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" /> LIVE
          </span>
          <Button size="sm" className="h-7 text-[10px] gap-1 text-emerald bg-emerald/10 border-0 hover:bg-emerald/20" onClick={handleGetHint} disabled={hintLoading}>
            {hintLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />} Подсказка
          </Button>
        </div>
      )}

      {aiHint && (
        <div className="ml-12 bg-emerald/5 border border-emerald/15 rounded-lg p-3">
          <p className="text-[10px] text-emerald font-semibold flex items-center gap-1 mb-1"><Zap className="w-3 h-3" /> AI Подсказка</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{aiHint}</p>
        </div>
      )}

      <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-1 text-xs text-cyan hover:text-cyan/80 transition-colors ml-12">
        Подробнее {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>

      {expanded && (
        <div className="ml-12 space-y-2">
          {interview.transcript && (
            <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground leading-relaxed">
              <p className="text-[10px] font-semibold mb-1">Транскрипт:</p>
              {interview.transcript.substring(0, 300)}{interview.transcript.length > 300 ? '...' : ''}
            </div>
          )}
          {interview.aiSummary && (
            <div className="bg-cyan/5 rounded-lg p-3 text-xs text-muted-foreground leading-relaxed">
              <p className="text-[10px] font-semibold mb-1 text-cyan">AI Резюме:</p>
              {interview.aiSummary}
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2 ml-12">
        {interview.status === 'SCHEDULED' && (
          <Button size="sm" className="h-7 text-[10px] gap-1 gradient-bg text-white border-0 hover:opacity-90" onClick={() => update({ id: interview.id, status: 'IN_PROGRESS' })}>
            <Play className="w-3 h-3" /> Начать
          </Button>
        )}
        {interview.status === 'IN_PROGRESS' && (
          <Button size="sm" className="h-7 text-[10px] gap-1 text-emerald bg-emerald/10 border-0" onClick={() => update({ id: interview.id, status: 'COMPLETED' })}>
            <CheckCircle2 className="w-3 h-3" /> Завершить
          </Button>
        )}
        {(interview.status === 'SCHEDULED' || interview.status === 'COMPLETED') && (
          <Button size="sm" variant="ghost" className="h-7 text-[10px] gap-1 text-red-400 hover:text-red-300" onClick={() => deleteInterview(interview.id)}>
            <Trash2 className="w-3 h-3" /> Удалить
          </Button>
        )}
      </div>
    </div>
  )
}
