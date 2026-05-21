'use client'

import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export interface VacancySearchResult {
  title: string
  company: string
  location: string
  salary: string
  match: number
  description: string
  requirements: string[]
  url: string
}

export interface ApplicationItem {
  id: string
  title: string
  company: string
  location: string | null
  salary: string | null
  matchScore: number | null
  status: string
  coverLetter: string | null
  vacancyUrl: string | null
  createdAt: string
  viewedAt: string | null
  invitedAt: string | null
  rejectedAt: string | null
}

export interface ApplicationStats {
  total: number
  pending: number
  viewed: number
  invited: number
  rejected: number
}

/** Search vacancies via AI */
async function searchVacanciesAPI(query: string, location?: string): Promise<VacancySearchResult[]> {
  const res = await fetch('/api/vacancies', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, location, userId: 'mock-user-001' }),
  })
  if (!res.ok) throw new Error('Failed to search vacancies')
  const data = await res.json()
  return data.vacancies ?? []
}

/** Fetch saved applications */
async function fetchApplicationsAPI(status?: string): Promise<{ applications: ApplicationItem[]; stats: ApplicationStats }> {
  const params = new URLSearchParams({ userId: 'mock-user-001' })
  if (status) params.set('status', status)
  const res = await fetch(`/api/applications?${params}`)
  if (!res.ok) throw new Error('Failed to fetch applications')
  return res.json()
}

/** Apply to a vacancy (create application) */
async function applyToVacancyAPI(data: {
  title: string
  company: string
  location?: string
  salary?: string
  matchScore?: number
  generateCoverLetter?: boolean
}): Promise<ApplicationItem> {
  const res = await fetch('/api/applications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, userId: 'mock-user-001' }),
  })
  if (!res.ok) throw new Error('Failed to apply')
  const result = await res.json()
  return result.application
}

/** Update application status */
async function updateApplicationAPI(id: string, status: string): Promise<void> {
  const res = await fetch('/api/applications', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, status, userId: 'mock-user-001' }),
  })
  if (!res.ok) throw new Error('Failed to update application')
}

export function useVacancies() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchLocation, setSearchLocation] = useState('')

  const searchMutation = useMutation({
    mutationFn: ({ query, location }: { query: string; location?: string }) =>
      searchVacanciesAPI(query, location),
  })

  const search = useCallback((query: string, location?: string) => {
    setSearchQuery(query)
    setSearchLocation(location ?? '')
    searchMutation.mutate({ query, location })
  }, [searchMutation])

  return {
    searchResults: searchMutation.data ?? [],
    isSearching: searchMutation.isPending,
    searchError: searchMutation.error?.message ?? null,
    search,
    searchQuery,
    searchLocation,
  }
}

export function useApplications(status?: string) {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['applications', status],
    queryFn: () => fetchApplicationsAPI(status),
    staleTime: 30 * 1000,
  })

  const applyMutation = useMutation({
    mutationFn: applyToVacancyAPI,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['applications'] })
      void queryClient.invalidateQueries({ queryKey: ['analytics'] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateApplicationAPI(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['applications'] })
      void queryClient.invalidateQueries({ queryKey: ['analytics'] })
    },
  })

  return {
    applications: data?.applications ?? [],
    stats: data?.stats ?? { total: 0, pending: 0, viewed: 0, invited: 0, rejected: 0 },
    isLoading,
    apply: applyMutation.mutate,
    isApplying: applyMutation.isPending,
    updateStatus: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  }
}
