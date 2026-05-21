'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export interface InterviewItem {
  id: string
  company: string
  position: string
  scheduledAt: string | null
  duration: number | null
  status: string
  transcript: string | null
  aiHints: string | null
  aiSummary: string | null
  vacancyTitle: string | null
  resumeContext: string | null
  createdAt: string
  updatedAt: string
}

export interface InterviewStats {
  scheduled: number
  inProgress: number
  completed: number
  total: number
}

async function fetchInterviewsAPI(status?: string): Promise<{ interviews: InterviewItem[]; stats: InterviewStats }> {
  const params = new URLSearchParams({ userId: 'mock-user-001' })
  if (status) params.set('status', status)
  const res = await fetch(`/api/interviews?${params}`)
  if (!res.ok) throw new Error('Failed to fetch interviews')
  return res.json()
}

async function createInterviewAPI(data: {
  company: string
  position: string
  scheduledAt?: string
  vacancyTitle?: string
}): Promise<InterviewItem> {
  const res = await fetch('/api/interviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, userId: 'mock-user-001' }),
  })
  if (!res.ok) throw new Error('Failed to create interview')
  const result = await res.json()
  return result.interview
}

async function updateInterviewAPI(data: {
  id: string
  status?: string
  transcript?: string
  aiHints?: string
  aiSummary?: string
}): Promise<void> {
  const res = await fetch('/api/interviews', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, userId: 'mock-user-001' }),
  })
  if (!res.ok) throw new Error('Failed to update interview')
}

async function deleteInterviewAPI(id: string): Promise<void> {
  const res = await fetch('/api/interviews', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, userId: 'mock-user-001' }),
  })
  if (!res.ok) throw new Error('Failed to delete interview')
}

export function useInterviews(status?: string) {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['interviews', status],
    queryFn: () => fetchInterviewsAPI(status),
    staleTime: 30 * 1000,
  })

  const createMutation = useMutation({
    mutationFn: createInterviewAPI,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['interviews'] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateInterviewAPI,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['interviews'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteInterviewAPI,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['interviews'] })
    },
  })

  return {
    interviews: data?.interviews ?? [],
    stats: data?.stats ?? { scheduled: 0, inProgress: 0, completed: 0, total: 0 },
    isLoading,
    create: createMutation.mutate,
    isCreating: createMutation.isPending,
    update: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteInterview: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  }
}
