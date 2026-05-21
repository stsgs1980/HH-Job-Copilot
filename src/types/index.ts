// ============================================================
// HH Job Copilot — Shared Types
// ============================================================

/** SaaS subscription plans */
export type Plan = 'STARTER' | 'PRO' | 'ULTRA'

/** Message sender role */
export type MessageRole = 'USER' | 'EMPLOYER' | 'AI'

/** How a message was sent */
export type SentVia = 'MANUAL' | 'AI' | 'HUMANIZED_AI'

/** Application status */
export type AppStatus = 'PENDING' | 'VIEWED' | 'INVITED' | 'REJECTED'

/** Dashboard mode tabs */
export type DashboardMode = 'chat' | 'search' | 'vacancies' | 'interview' | 'analytics'

/** Chat item in sidebar */
export interface ChatItem {
  name: string
  preview: string
  time: string
  unread: boolean
  color: string
}

/** Vacancy card data */
export interface VacancyCard {
  title: string
  company: string
  location: string
  salary: string
  match: number
}

/** Stat item for dashboard */
export interface StatItem {
  value: string
  label: string
  color: string
}

/** Feature card for landing */
export interface FeatureCard {
  icon: React.ComponentType<{ className?: string }>
  title: string
  desc: string
  accent: string
}

/** Pricing tier */
export interface PricingTier {
  name: string
  price: string
  period: string
  desc: string
  features: string[]
  cta: string
  popular: boolean
}

/** How-it-works step */
export interface StepItem {
  step: string
  icon: React.ComponentType<{ className?: string }>
  title: string
  desc: string
}

/** HH.ru Chatik API types */
export interface HHChat {
  id: string
  name: string
  lastMessage?: string
  unreadCount: number
  updatedAt: string
}

export interface HHMessage {
  id: string
  chatId: string
  role: MessageRole
  content: string
  sentVia?: SentVia
  createdAt: string
}
