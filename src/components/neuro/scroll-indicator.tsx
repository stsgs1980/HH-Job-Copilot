'use client'

export function ScrollIndicator({ label = 'листай вниз' }: { label?: string }) {
  return (
    <div className="scroll-indicator">
      <div className="scroll-indicator-line" />
      <span>{label}</span>
    </div>
  )
}
