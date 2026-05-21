'use client'

import { useDashboardMode } from '@/contexts/dashboard-mode-context'
import { useChatContext } from '@/contexts/chat-context'
import { ChatView } from '@/components/dashboard/chat-view'
import { VacancySearch } from '@/components/dashboard/vacancy-search'
import { ApplicationTracker } from '@/components/dashboard/application-tracker'
import { InterviewManager } from '@/components/dashboard/interview-manager'
import { AnalyticsDashboard } from '@/components/dashboard/analytics-dashboard'

export default function DashboardPage() {
  const { activeMode } = useDashboardMode()

  switch (activeMode) {
    case 'search':
      return <VacancySearch />
    case 'vacancies':
      return <ApplicationTracker />
    case 'interview':
      return <InterviewManager />
    case 'analytics':
      return <AnalyticsDashboard />
    case 'chat':
    default:
      return <ChatView />
  }
}
