'use client'

import { useState, useCallback } from 'react'
import { useApplications, type ApplicationItem } from '@/hooks/use-vacancies'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Briefcase, Eye, CheckCircle2, XCircle, Clock, ChevronDown, ChevronUp,
  Building2, MapPin, FileText, Loader2, Trash2, ExternalLink,
} from 'lucide-react'

const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string; icon: React.ComponentType<{ className?: string }> }> = {
  PENDING: { label: 'На рассмотрении', color: 'text-yellow-400', bgColor: 'bg-yellow-500/10', icon: Clock },
  VIEWED: { label: 'Просмотрено', color: 'text-cyan', bgColor: 'bg-cyan/10', icon: Eye },
  INVITED: { label: 'Приглашение', color: 'text-emerald', bgColor: 'bg-emerald/10', icon: CheckCircle2 },
  REJECTED: { label: 'Отклонено', color: 'text-red-400', bgColor: 'bg-red-500/10', icon: XCircle },
  DISCARDED: { label: 'Удалено', color: 'text-muted-foreground', bgColor: 'bg-muted', icon: XCircle },
}

const STATUS_FILTERS = [
  { value: '', label: 'Все' },
  { value: 'PENDING', label: 'На рассмотрении' },
  { value: 'VIEWED', label: 'Просмотрено' },
  { value: 'INVITED', label: 'Приглашение' },
  { value: 'REJECTED', label: 'Отклонено' },
]

export function ApplicationTracker() {
  const [statusFilter, setStatusFilter] = useState('')
  const { applications, stats, isLoading, updateStatus, isUpdating } = useApplications(statusFilter || undefined)

  return (
    <main className="flex-1 overflow-y-auto" id="main-content">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Header */}
        <div className="text-center pt-4 pb-2">
          <h2 className="text-2xl sm:text-3xl font-bold gradient-text">Мои отклики</h2>
          <p className="text-muted-foreground text-sm mt-1">Отслеживайте статусы ваших откликов</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-5 gap-2">
          <StatCard label="Всего" value={stats.total} color="text-cyan" />
          <StatCard label="На рассмотрении" value={stats.pending} color="text-yellow-400" />
          <StatCard label="Просмотрено" value={stats.viewed} color="text-cyan" />
          <StatCard label="Приглашения" value={stats.invited} color="text-emerald" />
          <StatCard label="Отклонено" value={stats.rejected} color="text-red-400" />
        </div>

        {/* Status filter tabs */}
        <div className="flex gap-1 flex-wrap">
          {STATUS_FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
                statusFilter === f.value
                  ? 'glass-card bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Applications list */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12 gap-3 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin text-cyan" />
            <span className="text-sm">Загрузка откликов...</span>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-sm">Пока нет откликов</p>
            <p className="text-xs mt-1">Найдите вакансии в разделе &ldquo;Поиск&rdquo; и откликнитесь</p>
          </div>
        ) : (
          <div className="space-y-2">
            {applications.map(app => (
              <ApplicationCard key={app.id} application={app} updateStatus={updateStatus} isUpdating={isUpdating} />
            ))}
          </div>
        )}

        <div className="h-24" />
      </div>
    </main>
  )
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="glass-card rounded-lg p-2.5 text-center">
      <div className={`text-lg font-bold tabular-nums ${color}`}>{value}</div>
      <div className="text-[9px] text-muted-foreground">{label}</div>
    </div>
  )
}

function ApplicationCard({
  application,
  updateStatus,
  isUpdating,
}: {
  application: ApplicationItem
  updateStatus: (data: { id: string; status: string }) => void
  isUpdating: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  const config = STATUS_CONFIG[application.status] ?? STATUS_CONFIG.PENDING
  const StatusIcon = config.icon

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
    } catch {
      return ''
    }
  }

  return (
    <div className="glass-card rounded-xl p-4 space-y-2 hover-glow transition-all">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center shrink-0">
          <Building2 className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">{application.title}</h3>
              <p className="text-xs text-muted-foreground">{application.company}{application.location ? ` · ${application.location}` : ''}</p>
            </div>
            <Badge className={`text-[10px] h-5 gap-1 border-0 ${config.bgColor}`}>
              <StatusIcon className={`w-3 h-3 ${config.color}`} />
              <span className={config.color}>{config.label}</span>
            </Badge>
          </div>
        </div>
      </div>

      {/* Salary and match */}
      <div className="flex items-center gap-3 ml-13">
        {application.salary && (
          <span className="text-xs font-medium text-emerald">{application.salary}</span>
        )}
        {application.matchScore && (
          <span className="text-xs text-muted-foreground">Совпадение: {application.matchScore}%</span>
        )}
        <span className="text-[10px] text-muted-foreground">{formatDate(application.createdAt)}</span>
      </div>

      {/* Expand/collapse cover letter */}
      {application.coverLetter && (
        <div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-cyan hover:text-cyan/80 transition-colors"
          >
            <FileText className="w-3 h-3" />
            Сопроводительное письмо
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          {expanded && (
            <div className="mt-2 bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground leading-relaxed border-l-2 border-cyan">
              {application.coverLetter}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 ml-13">
        {application.vacancyUrl && (
          <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1" asChild>
            <a href={application.vacancyUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-3 h-3" /> Вакансия
            </a>
          </Button>
        )}
        {application.status === 'PENDING' && (
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-[10px] gap-1 text-emerald hover:text-emerald"
            onClick={() => updateStatus({ id: application.id, status: 'VIEWED' })}
            disabled={isUpdating}
          >
            <Eye className="w-3 h-3" /> Просмотрено
          </Button>
        )}
        {(application.status === 'PENDING' || application.status === 'VIEWED') && (
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-[10px] gap-1 text-emerald hover:text-emerald"
            onClick={() => updateStatus({ id: application.id, status: 'INVITED' })}
            disabled={isUpdating}
          >
            <CheckCircle2 className="w-3 h-3" /> Приглашение
          </Button>
        )}
      </div>
    </div>
  )
}
