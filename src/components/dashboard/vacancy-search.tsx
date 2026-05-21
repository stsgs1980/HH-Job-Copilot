'use client'

import { useState, useCallback } from 'react'
import { useVacancies, type VacancySearchResult } from '@/hooks/use-vacancies'
import { useApplications } from '@/hooks/use-vacancies'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Search, Briefcase, MapPin, Building2, Zap, Loader2, Star,
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* Search bar */}
        <div className="bg-muted/20 border border-border/30 rounded-xl p-3 space-y-2">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="React Developer, Frontend, Data Scientist..."
                className="pl-9 h-10"
                aria-label="Поисковый запрос"
                autoFocus
              />
            </div>
            <div className="w-32 relative hidden sm:block">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={location}
                onChange={e => setLocation(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Город"
                className="pl-9 h-10"
                aria-label="Локация"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={isSearching || !query.trim()}
              className="gradient-bg text-white border-0 hover:opacity-90 h-10 px-5 gap-1.5"
            >
              {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span className="hidden sm:inline">Найти</span>
            </Button>
          </div>

          {/* Quick tags */}
          <div className="flex flex-wrap gap-1">
            {['React', 'Frontend', 'Python', 'Data Science', 'DevOps', 'Product Manager'].map(tag => (
              <button
                key={tag}
                onClick={() => { setQuery(tag); search(tag) }}
                className="px-2 py-0.5 text-[10px] rounded-md bg-muted text-muted-foreground hover:text-foreground transition-all"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {isSearching && (
          <div className="flex items-center justify-center py-12 gap-2 text-muted-foreground text-sm">
            <Loader2 className="w-4 h-4 animate-spin text-cyan" />
            Ищу вакансии по запросу &ldquo;{searchQuery}&rdquo;...
          </div>
        )}

        {/* Results */}
        {!isSearching && searchResults.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-medium text-muted-foreground">Найдено: {searchResults.length}</span>
            {searchResults.map((v, i) => (
              <VacancyCard key={i} vacancy={v} onApply={handleApply} isApplying={isApplying} />
            ))}
          </div>
        )}

        {/* Empty */}
        {!isSearching && searchResults.length === 0 && query === '' && (
          <div className="text-center py-12 text-muted-foreground">
            <Briefcase className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
            <p className="text-sm">Введите запрос для поиска вакансий</p>
            <p className="text-xs mt-1 text-muted-foreground/60">Например: &ldquo;Senior Frontend Developer&rdquo;</p>
          </div>
        )}

        <div className="h-20" />
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
    <div className="bg-muted/20 border border-border/30 rounded-xl p-3.5 space-y-2.5 hover:border-cyan/20 transition-all">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg gradient-bg flex items-center justify-center shrink-0">
          <Building2 className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">{vacancy.title}</h3>
              <p className="text-xs text-muted-foreground">{vacancy.company} &bull; {vacancy.location}</p>
            </div>
            <span className={`text-xs font-bold shrink-0 ${matchColor}`}>
              <Star className="w-3 h-3 inline mr-0.5" />{vacancy.match}%
            </span>
          </div>
        </div>
      </div>

      {vacancy.salary && (
        <span className="text-sm font-semibold text-emerald">{vacancy.salary}</span>
      )}

      {vacancy.description && (
        <p className="text-xs text-muted-foreground leading-relaxed">{vacancy.description}</p>
      )}

      {vacancy.requirements?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {vacancy.requirements.slice(0, 4).map((r, i) => (
            <span key={i} className="px-1.5 py-0.5 text-[9px] rounded bg-muted text-muted-foreground">{r}</span>
          ))}
        </div>
      )}

      <div className="flex gap-2 pt-0.5">
        <Button
          size="sm"
          className="h-8 text-xs gradient-bg text-white border-0 hover:opacity-90 gap-1"
          onClick={() => onApply(vacancy)}
          disabled={isApplying}
        >
          {isApplying ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
          Откликнуться
        </Button>
        <Button size="sm" variant="outline" className="h-8 text-xs" asChild>
          <a href={vacancy.url} target="_blank" rel="noopener noreferrer">На HH.ru</a>
        </Button>
      </div>
    </div>
  )
}
