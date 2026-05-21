'use client'

import { Skeleton } from '@/components/ui/skeleton'

// ──────────────────────────────────────────────
// Shared helpers
// ──────────────────────────────────────────────

/** The gradient icon placeholder used by all AI copilot cards */
function SkeletonIcon() {
  return <Skeleton className="w-9 h-9 rounded-xl shrink-0 shimmer" />
}

/** The "HH Job Copilot" title line under the icon */
function SkeletonTitle() {
  return <Skeleton className="h-4 w-28 mb-1 shimmer" />
}

/** The glass-card wrapper used for all copilot messages */
function SkeletonGlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`glass-card rounded-2xl rounded-tl-sm p-4 space-y-3 ${className}`}>
      {children}
    </div>
  )
}

/** Badge-sized skeleton */
function SkeletonBadge() {
  return <Skeleton className="h-4 w-14 rounded-full shimmer" />
}

/** Timestamp + badge row under a card */
function SkeletonMetaRow() {
  return (
    <div className="flex items-center gap-2 mt-1.5">
      <Skeleton className="h-3 w-8 shimmer" />
      <SkeletonBadge />
    </div>
  )
}

// ──────────────────────────────────────────────
// SkeletonAIDigest
// Matches: icon + glass-card with intro text, 4-stat grid,
//          messages section (3 items) with action buttons
// ──────────────────────────────────────────────

export function SkeletonAIDigest() {
  return (
    <div className="flex gap-3">
      <SkeletonIcon />
      <div className="flex-1 min-w-0">
        <SkeletonTitle />
        <SkeletonGlassCard>
          {/* Intro text line */}
          <Skeleton className="h-4 w-64 shimmer" />

          {/* 4-col stat grid */}
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-muted rounded-lg p-2.5 text-center">
                <Skeleton className="h-5 w-8 mx-auto mb-1 shimmer" />
                <Skeleton className="h-2.5 w-10 mx-auto shimmer" />
              </div>
            ))}
          </div>

          {/* Messages section */}
          <div className="bg-muted/50 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-36 shimmer" />
              <Skeleton className="h-3 w-20 shimmer" />
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2 py-1.5 border-b border-border/50 last:border-0">
                <Skeleton className="w-6 h-6 rounded shrink-0 shimmer" />
                <Skeleton className="h-3 flex-1 shimmer" />
              </div>
            ))}
            <div className="flex gap-2 pt-1">
              <Skeleton className="h-7 w-28 rounded-md shimmer" />
              <Skeleton className="h-7 w-28 rounded-md shimmer" />
            </div>
          </div>
        </SkeletonGlassCard>
        <SkeletonMetaRow />
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────
// SkeletonVacancyResponse
// Matches: icon + glass-card with response text, quote block,
//          badges, vacancy list (3 items) with action buttons
// ──────────────────────────────────────────────

export function SkeletonVacancyResponse() {
  return (
    <div className="flex gap-3">
      <SkeletonIcon />
      <div className="flex-1 min-w-0">
        <SkeletonTitle />
        <SkeletonGlassCard>
          {/* Response text */}
          <Skeleton className="h-4 w-56 shimmer" />

          {/* Quote block */}
          <div className="bg-muted rounded-lg p-3 border-l-2 border-cyan/30">
            <Skeleton className="h-3 w-full shimmer" />
            <Skeleton className="h-3 w-3/4 mt-1.5 shimmer" />
          </div>

          {/* Badges */}
          <div className="flex gap-2 flex-wrap">
            <SkeletonBadge />
            <SkeletonBadge />
          </div>

          {/* Vacancies section */}
          <div className="bg-muted/50 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-40 shimmer" />
              <Skeleton className="h-3 w-14 shimmer" />
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2 py-1.5 border-b border-border/50 last:border-0">
                <Skeleton className="w-7 h-7 rounded shrink-0 shimmer" />
                <div className="flex-1 min-w-0 space-y-1">
                  <Skeleton className="h-3 w-32 shimmer" />
                  <Skeleton className="h-2 w-20 shimmer" />
                </div>
                <Skeleton className="h-3 w-16 shimmer" />
                <Skeleton className="h-4 w-8 rounded-full shimmer" />
              </div>
            ))}
            <div className="flex gap-2 pt-1">
              <Skeleton className="h-7 w-28 rounded-md shimmer" />
              <Skeleton className="h-7 w-32 rounded-md shimmer" />
            </div>
          </div>
        </SkeletonGlassCard>
        <div className="flex items-center gap-2 mt-1.5">
          <Skeleton className="h-3 w-8 shimmer" />
          <SkeletonBadge />
          <SkeletonBadge />
        </div>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────
// SkeletonInterviewLive
// Matches: icon + glass-card with interview mode text,
//          LIVE panel with interviewer question + AI hint + user speech
// ──────────────────────────────────────────────

export function SkeletonInterviewLive() {
  return (
    <div className="flex gap-3">
      <SkeletonIcon />
      <div className="flex-1 min-w-0">
        <SkeletonTitle />
        <SkeletonGlassCard>
          {/* Intro text */}
          <Skeleton className="h-4 w-64 shimmer" />

          {/* Interview panel */}
          <div className="rounded-xl gradient-border bg-gradient-to-br from-cyan/5 to-purple/5 overflow-hidden">
            {/* Header row */}
            <div className="flex items-center gap-2 px-3 py-2 border-b border-cyan/10">
              <Skeleton className="h-4 w-12 rounded shimmer" />
              <Skeleton className="h-3 w-40 shimmer" />
            </div>
            <div className="p-3 space-y-2">
              {/* Interviewer question */}
              <Skeleton className="h-4 w-3/4 shimmer" />

              {/* AI Hint box */}
              <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-lg p-2.5 gradient-border">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-20 shimmer" />
                </div>
                <Skeleton className="h-3 w-full mt-1.5 shimmer" />
                <Skeleton className="h-3 w-2/3 mt-1 shimmer" />
              </div>

              {/* User speech line */}
              <Skeleton className="h-4 w-1/2 shimmer" />
            </div>
          </div>
        </SkeletonGlassCard>

        {/* Controls row */}
        <div className="flex items-center gap-2 mt-1.5">
          <Skeleton className="h-3 w-8 shimmer" />
          <SkeletonBadge />
        </div>
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────
// SkeletonAnalyticsInline
// Matches: icon + glass-card with intro text,
//          chart bars (7 bars + day labels), 4-stat grid
// ──────────────────────────────────────────────

export function SkeletonAnalyticsInline() {
  return (
    <div className="flex gap-3">
      <SkeletonIcon />
      <div className="flex-1 min-w-0">
        <SkeletonTitle />
        <SkeletonGlassCard>
          {/* Intro text */}
          <Skeleton className="h-4 w-44 shimmer" />

          {/* Chart section */}
          <div className="bg-muted/50 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-36 shimmer" />
              <Skeleton className="h-3 w-16 shimmer" />
            </div>
            {/* Bar chart */}
            <div className="flex items-end gap-1 h-20 px-1">
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="flex-1 rounded-t-sm shimmer"
                  style={{ height: `${30 + Math.random() * 60}%` }}
                />
              ))}
            </div>
            {/* Day labels */}
            <div className="flex justify-between px-1">
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="h-2.5 w-4 shimmer" />
              ))}
            </div>
          </div>

          {/* Stat grid */}
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-muted rounded-lg p-2 text-center">
                <Skeleton className="h-4 w-8 mx-auto mb-0.5 shimmer" />
                <Skeleton className="h-2 w-10 mx-auto shimmer" />
              </div>
            ))}
          </div>
        </SkeletonGlassCard>
        <SkeletonMetaRow />
      </div>
    </div>
  )
}

// ──────────────────────────────────────────────
// SkeletonChatPanel
// Matches: sidebar with header, 4 chat list items, profile card
// ──────────────────────────────────────────────

export function SkeletonChatPanel() {
  return (
    <aside className="hidden lg:flex flex-col w-[340px] border-l border-border/50 bg-background/80 backdrop-blur-xl shrink-0">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
        <Skeleton className="h-4 w-28 shimmer" />
        <Skeleton className="h-6 w-6 rounded shimmer" />
      </div>

      {/* Chat list */}
      <div className="flex-1 p-3 space-y-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg">
            <Skeleton className="w-8 h-8 rounded-lg shrink-0 shimmer" />
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-24 shimmer" />
                <Skeleton className="h-2.5 w-6 shimmer" />
              </div>
              <Skeleton className="h-2.5 w-full shimmer" />
            </div>
          </div>
        ))}
      </div>

      {/* Profile card */}
      <div className="border-t border-border/50 p-3">
        <div className="flex items-center gap-3">
          <Skeleton className="w-9 h-9 rounded-xl shrink-0 shimmer" />
          <div className="flex-1 min-w-0 space-y-1">
            <Skeleton className="h-3 w-16 shimmer" />
            <Skeleton className="h-2 w-12 shimmer" />
          </div>
          <Skeleton className="h-4 w-20 rounded-full shimmer" />
        </div>
      </div>
    </aside>
  )
}

// ──────────────────────────────────────────────
// SkeletonChatMessage
// Matches a single chat message bubble (user or assistant)
// ──────────────────────────────────────────────

interface SkeletonChatMessageProps {
  /** 'user' for right-aligned gray bubble, 'assistant' for left-aligned glass-card bubble */
  role?: 'user' | 'assistant'
}

export function SkeletonChatMessage({ role = 'assistant' }: SkeletonChatMessageProps) {
  if (role === 'user') {
    return (
      <div className="flex gap-3 flex-row-reverse">
        <Skeleton className="w-9 h-9 rounded-xl shrink-0 shimmer" />
        <div className="bg-muted border border-border rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[80%] space-y-1.5">
          <Skeleton className="h-4 w-48 shimmer" />
          <Skeleton className="h-4 w-32 shimmer" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-3">
      <SkeletonIcon />
      <div className="flex-1 min-w-0">
        <SkeletonTitle />
        <SkeletonGlassCard>
          <Skeleton className="h-4 w-full shimmer" />
          <Skeleton className="h-4 w-3/4 shimmer" />
          <Skeleton className="h-4 w-1/2 shimmer" />
        </SkeletonGlassCard>
        <SkeletonMetaRow />
      </div>
    </div>
  )
}
