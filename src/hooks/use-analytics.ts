'use client'

import { useQuery } from '@tanstack/react-query'
import type { StatItem } from '@/types'

export interface AnalyticsData {
  stats: StatItem[]
  weekChart: number[]
  weekDays: string[]
}

const MOCK_ANALYTICS: AnalyticsData = {
  stats: [
    { value: '47', label: 'Отклики', color: 'text-cyan' },
    { value: '8', label: 'Приглашения', color: 'text-emerald-400' },
    { value: '17%', label: 'Конверсия', color: 'text-purple' },
    { value: '89%', label: 'Совпадение', color: 'text-orange-400' },
  ],
  weekChart: [40, 65, 45, 80, 55, 92, 70],
  weekDays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
}

async function fetchAnalyticsAPI(): Promise<AnalyticsData> {
  // In the future, this will fetch from a real analytics API
  // For now, return mock data
  const res = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: 'Покажи аналитику за неделю' }],
      source: 'analytics',
    }),
  })
  if (!res.ok) throw new Error('Failed to fetch analytics')
  // For now, still return mock data as the AI response isn't structured analytics
  return MOCK_ANALYTICS
}

export function useAnalytics() {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: fetchAnalyticsAPI,
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: MOCK_ANALYTICS,
  })

  return {
    stats: data?.stats ?? MOCK_ANALYTICS.stats,
    weekChart: data?.weekChart ?? MOCK_ANALYTICS.weekChart,
    weekDays: data?.weekDays ?? MOCK_ANALYTICS.weekDays,
    isLoading,
  }
}
