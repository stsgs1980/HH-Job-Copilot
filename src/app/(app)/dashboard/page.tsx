'use client'

import { useState } from 'react'
import { AIDigest, UserMessage, VacancyResponse, InterviewLive, AnalyticsInline, ChatPanel } from '@/components/dashboard'

export default function DashboardPage() {
  const [showPanel, setShowPanel] = useState(true)

  return (
    <>
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          <div className="text-center pt-4 pb-2">
            <h2 className="text-2xl sm:text-3xl font-bold gradient-text">HH Job Copilot</h2>
            <p className="text-muted-foreground text-sm mt-1">Ваш AI-ассистент для поиска работы и прохождения интервью</p>
          </div>

          <AIDigest />
          <UserMessage text="Ответь Елене из Яндекса, что готов на собеседование завтра в 14:00. И покажи новые вакансии по React" />
          <VacancyResponse />
          <InterviewLive />
          <AnalyticsInline />

          <div className="h-24" />
        </div>
      </main>

      {showPanel && <ChatPanel onClose={() => setShowPanel(false)} />}
    </>
  )
}
