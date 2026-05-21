export default function AuthLoading() {
  return (
    <div className="min-h-screen flex bg-background relative overflow-hidden">
      {/* NEURO: Mesh blobs */}
      <div className="mesh-blob mesh-blob-1 top-[5%] left-[5%]" />
      <div className="mesh-blob mesh-blob-2 bottom-[10%] right-[5%]" />

      {/* Left panel skeleton */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center" aria-hidden="true">
        <div className="absolute inset-0 gradient-mesh-deep" />
        <div className="relative z-10 p-16 max-w-lg space-y-6">
          <div className="h-12 w-36 shimmer rounded-xl" />
          <div className="h-12 w-80 shimmer rounded-lg" />
          <div className="h-6 w-96 shimmer rounded-lg" />
          <div className="glass-card-elevated p-7 space-y-3">
            <div className="h-4 w-full shimmer rounded" />
            <div className="h-4 w-3/4 shimmer rounded" />
            <div className="flex items-center gap-3 mt-4">
              <div className="w-9 h-9 shimmer rounded-xl" />
              <div className="space-y-2">
                <div className="h-3 w-24 shimmer rounded" />
                <div className="h-2 w-32 shimmer rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right form skeleton */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 relative">
        <div className="relative z-10 w-full max-w-md">
          <div className="glass-card-elevated p-8 space-y-5">
            <div className="grid grid-cols-2 gap-2">
              <div className="h-11 shimmer rounded-xl" />
              <div className="h-11 shimmer rounded-xl" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-12 shimmer rounded" />
              <div className="h-12 shimmer rounded-xl" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-14 shimmer rounded" />
              <div className="h-12 shimmer rounded-xl" />
            </div>
            <div className="h-12 shimmer rounded-xl" />
            <div className="flex gap-3">
              <div className="flex-1 h-11 shimmer rounded-xl" />
              <div className="flex-1 h-11 shimmer rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
