'use client'

import { useState, useCallback } from 'react'
import { useVacancies, type VacancySearchResult } from '@/hooks/use-vacancies'
import { useApplications } from '@/hooks/use-vacancies'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Search, Briefcase, MapPin, Building2, Zap, Loader2, ChevronRight, Send, Star,
} from 'lucide-react'

export function VacancySearch() {
  const { searchResults, isSearching, search, searchQuery } = useVacancies()
  const { apply, isApplying } = useApplications()
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')

  const handleSearch = useCallback(() => {
    if (!query.trim()) return
    search(query.trim(), location.trim() || undefined)
  }, [query, location, search])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }, [handleSearch])

  const handleApply = useCallback((v: VacancySearchResult) => {
    apply({
      title: v.title,
      company: v.company,
      location: v.location,
      salary: v.salary,
      matchScore: v.match,
      generateCoverLetter: true,
    })
  }, [apply])

  return (
    <main className="flex-1 overflow-y-auto" id="main-content">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Header */}
        <div className="text-center pt-4 pb-2">
          <h2 className="text-2xl sm:text-3xl font-bold gradient-text">Поиск вакансий</h2>
          <p className="text-muted-foreground text-sm mt-1">AI найдёт подходящие вакансии по вашему запросу</p>
        </div>

        {/* Search bar */}
        <div className="glass-card rounded-xl p-4 space-y-3">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="React Developer, Frontend, Data Scientist..."
                className="pl-9 h-11"
                aria-label="Поисковый запрос"
              />
            </div>
            <div className="w-36 relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={location}
                onChange={e => setLocation(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Москва"
                className="pl-9 h-11"
                aria-label="Локация"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={isSearching || !query.trim()}
              className="gradient-bg text-white border-0 hover:opacity-90 h-11 px-6"
            >
              {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span className="hidden sm:inline ml-2">Найти</span>
            </Button>
          </div>

          {/* Quick search tags */}
          <div className="flex flex-wrap gap-1.5">
            {['React', 'Frontend', 'Python', 'Data Science', 'DevOps', 'Product Manager'].map(tag => (
              <button
                key={tag}
                onClick={() => { setQuery(tag); search(tag) }}
                className="px-2.5 py-1 text-xs rounded-lg glass-card text-muted-foreground hover:text-foreground hover-glow transition-all"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Search results */}
        {isSearching && (
          <div className="flex items-center justify-center py-12 gap-3 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin text-cyan" />
            <span className="text-sm">Ищу вакансии по запросу &ldquo;{searchQuery}&rdquo;...</span>
          </div>
        )}

        {!isSearching && searchResults.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Найдено: {searchResults.length} вакансий</span>
            </div>
            {searchResults.map((v, i) => (
              <VacancyCard key={i} vacancy={v} onApply={handleApply} isApplying={isApplying} />
            ))}
          </div>
        )}

        {!isSearching && searchResults.length === 0 && query === '' && (
          <div className="text-center py-12 text-muted-foreground">
            <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-sm">Введите запрос для поиска вакансий</p>
            <p className="text-xs mt-1">Например: &ldquo;Senior Frontend Developer&rdquo; или &ldquo;Python Data Engineer&rdquo;</p>
          </div>
        )}

        <div className="h-24" />
      </div>
    </main>
  )
}

function VacancyCard({
  vacancy,
  onApply,
  isApplying,
}: {
  vacancy: VacancySearchResult
  onApply: (v: VacancySearchResult) => void
  isApplying: boolean
}) {
  const matchColor = vacancy.match >= 90 ? 'text-emerald' : vacancy.match >= 75 ? 'text-cyan' : 'text-orange-400'

  return (
    <div className="glass-card rounded-xl p-4 space-y-3 hover-glow transition-all">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center shrink-0">
          <Building2 className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">{vacancy.title}</h3>
              <p className="text-xs text-muted-foreground">{vacancy.company} &bull; {vacancy.location}</p>
            </div>
            <Badge className={`text-xs h-5 shrink-0 ${matchColor} bg-current/10 border-0`} style={{ color: undefined }}>
              <Star className="w-3 h-3 mr-0.5" />
              <span className={matchColor}>{vacancy.match}%</span>
            </Badge>
          </div>
        </div>
      </div>

      {/* Salary */}
      {vacancy.salary && (
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-emerald">{vacancy.salary}</span>
        </div>
      )}

      {/* Description */}
      {vacancy.description && (
        <p className="text-xs text-muted-foreground leading-relaxed">{vacancy.description}</p>
      )}

      {/* Requirements */}
      {vacancy.requirements?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {vacancy.requirements.slice(0, 4).map((r, i) => (
            <span key={i} className="px-2 py-0.5 text-[10px] rounded-md bg-muted text-muted-foreground">{r}</span>
          ))}
          {vacancy.requirements.length > 4 && (
            <span className="px-2 py-0.5 text-[10px] rounded-md bg-muted text-muted-foreground">+{vacancy.requirements.length - 4}</span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <Button
          size="sm"
          className="h-8 text-xs gradient-bg text-white border-0 hover:opacity-90 gap-1"
          onClick={() => onApply(vacancy)}
          disabled={isApplying}
        >
          {isApplying ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
          Откликнуться с AI-письмом
        </Button>
        <Button size="sm" variant="outline" className="h-8 text-xs gap-1" asChild>
          <a href={vacancy.url} target="_blank" rel="noopener noreferrer">
            <Send className="w-3 h-3" /> На HH.ru
          </a>
        </Button>
      </div>
    </div>
  )
}
