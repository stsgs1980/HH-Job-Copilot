'use client'

import { useState } from 'react'
import { useApplications, type ApplicationItem } from '@/hooks/use-vacancies'
import { Button } from '@/components/ui/button'
import {
  Briefcase, Eye, CheckCircle2, XCircle, Clock, ChevronDown, ChevronUp,
  Building2, FileText, Loader2, ExternalLink,
} from 'lucide-react'

const STATUS_CONFIG: Record<string, { label: string; color: string; bgColor: string; icon: React.ComponentType<{ className?: string }> }> = {
  PENDING: { label: 'На рассмотрении', color: 'text-yellow-400', bgColor: 'bg-yellow-500/10', icon: Clock },
  VIEWED: { label: 'Просмотрено', color: 'text-cyan', bgColor: 'bg-cyan/10', icon: Eye },
  INVITED: { label: 'Приглашение', color: 'text-emerald', bgColor: 'bg-emerald/10', icon: CheckCircle2 },
  REJECTED: { label: 'Отклонено', color: 'text-red-400', bgColor: 'bg-red-500/10', icon: XCircle },
  DISCARDED: { label: 'Удалено', color: 'text-muted-foreground', bgColor: 'bg-muted', icon: XCircle },
}

export function ApplicationTracker() {
  const [statusFilter, setStatusFilter] = useState('')
  const { applications, stats, isLoading, updateStatus, isUpdating } = useApplications(statusFilter || undefined)

  return (
    <main className="flex-1 overflow-y-auto" id="main-content">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {/* Stats */}
        <div className="grid grid-cols-5 gap-1.5">
          {[
            { label: 'Всего', value: stats.total, color: 'text-cyan' },
            { label: 'Ждут', value: stats.pending, color: 'text-yellow-400' },
            { label: 'Смотрят', value: stats.viewed, color: 'text-cyan' },
            { label: 'Приглаш.', value: stats.invited, color: 'text-emerald' },
            { label: 'Отказ', value: stats.rejected, color: 'text-red-400' },
          ].map(s => (
            <div key={s.label} className="bg-muted/30 border border-border/20 rounded-lg p-2 text-center">
              <div className={`text-base font-bold tabular-nums ${s.color}`}>{s.value}</div>
              <div className="text-[9px] text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-1 flex-wrap">
          {[{ value: '', label: 'Все' }, { value: 'PENDING', label: 'Ждут' }, { value: 'VIEWED', label: 'Смотрят' }, { value: 'INVITED', label: 'Приглашения' }, { value: 'REJECTED', label: 'Отказы' }].map(f => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`px-2.5 py-1 text-xs rounded-md transition-all ${
                statusFilter === f.value
                  ? 'bg-muted text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-12 gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin text-cyan" />
            Загрузка...
          </div>
        )}

        {/* Empty */}
        {!isLoading && applications.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Briefcase className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
            <p className="text-sm">Пока нет откликов</p>
            <p className="text-xs mt-1 text-muted-foreground/60">Найдите вакансии в разделе &ldquo;Поиск&rdquo;</p>
          </div>
        )}

        {/* List */}
        {!isLoading && applications.map(app => (
          <ApplicationCard key={app.id} application={app} updateStatus={updateStatus} isUpdating={isUpdating} />
        ))}

        <div className="h-20" />
      </div>
    </main>
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

  return (
    <div className="bg-muted/20 border border-border/30 rounded-xl p-3.5 space-y-2">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg gradient-bg flex items-center justify-center shrink-0">
          <Building2 className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">{application.title}</h3>
              <p className="text-xs text-muted-foreground">{application.company}{application.location ? ` · ${application.location}` : ''}</p>
            </div>
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md shrink-0 ${config.bgColor} ${config.color} flex items-center gap-1`}>
              <StatusIcon className="w-3 h-3" /> {config.label}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs text-muted-foreground ml-12">
        {application.salary && <span className="font-medium text-emerald">{application.salary}</span>}
        {application.matchScore && <span>Совпадение: {application.matchScore}%</span>}
      </div>

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

      <div className="flex gap-2 ml-12">
        {application.vacancyUrl && (
          <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1" asChild>
            <a href={application.vacancyUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-3 h-3" /> Вакансия
            </a>
          </Button>
        )}
        {application.status === 'PENDING' && (
          <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1 text-emerald" onClick={() => updateStatus({ id: application.id, status: 'VIEWED' })} disabled={isUpdating}>
            <Eye className="w-3 h-3" /> Просмотрено
          </Button>
        )}
        {(application.status === 'PENDING' || application.status === 'VIEWED') && (
          <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1 text-emerald" onClick={() => updateStatus({ id: application.id, status: 'INVITED' })} disabled={isUpdating}>
            <CheckCircle2 className="w-3 h-3" /> Приглашение
          </Button>
        )}
      </div>
    </div>
  )
}
