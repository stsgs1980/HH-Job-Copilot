import { Zap } from 'lucide-react'

export default function DashboardLoading() {
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Title skeleton */}
        <div className="text-center pt-4 pb-2">
          <div className="h-8 w-48 mx-auto rounded-lg shimmer" />
          <div className="h-4 w-64 mx-auto rounded-md shimmer mt-2" />
        </div>

        {/* AI Digest skeleton */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 rounded shimmer" />
              <div className="h-3 w-24 rounded shimmer" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 w-full rounded shimmer" />
            <div className="h-3 w-4/5 rounded shimmer" />
            <div className="h-3 w-3/5 rounded shimmer" />
          </div>
        </div>

        {/* Card skeleton row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="glass-card p-5 space-y-3">
            <div className="h-4 w-28 rounded shimmer" />
            <div className="space-y-2">
              <div className="h-3 w-full rounded shimmer" />
              <div className="h-3 w-3/4 rounded shimmer" />
            </div>
          </div>
          <div className="glass-card p-5 space-y-3">
            <div className="h-4 w-32 rounded shimmer" />
            <div className="space-y-2">
              <div className="h-3 w-full rounded shimmer" />
              <div className="h-3 w-2/3 rounded shimmer" />
            </div>
          </div>
        </div>

        {/* Another card skeleton */}
        <div className="glass-card p-6 space-y-4">
          <div className="h-5 w-40 rounded shimmer" />
          <div className="space-y-2">
            <div className="h-3 w-full rounded shimmer" />
            <div className="h-3 w-5/6 rounded shimmer" />
            <div className="h-3 w-2/3 rounded shimmer" />
            <div className="h-3 w-4/5 rounded shimmer" />
          </div>
        </div>

        {/* Bottom spacer */}
        <div className="h-24" />
      </div>
    </main>
  )
}
