'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export interface UserProfile {
  id: string
  email: string
  name: string | null
  image: string | null
  plan: string
  resumeText: string | null
  preferences: string | null
  streakDays: number
  lastActiveAt: string
  hhToken: boolean
  hhCookies: boolean
  createdAt: string
}

async function fetchProfile(): Promise<UserProfile> {
  const res = await fetch('/api/profile?userId=mock-user-001')
  if (!res.ok) throw new Error('Failed to fetch profile')
  return res.json()
}

async function updateProfile(data: Partial<Pick<UserProfile, 'name' | 'resumeText'>> & { preferences?: string }): Promise<void> {
  const res = await fetch('/api/profile', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, userId: 'mock-user-001' }),
  })
  if (!res.ok) throw new Error('Failed to update profile')
}

export function useProfile() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    staleTime: 2 * 60 * 1000,
  })

  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['profile'] })
      void queryClient.invalidateQueries({ queryKey: ['analytics'] })
    },
  })

  return {
    profile: data ?? null,
    isLoading,
    updateProfile: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  }
}
