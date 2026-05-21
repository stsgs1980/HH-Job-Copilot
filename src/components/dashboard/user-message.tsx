'use client'

import { User } from 'lucide-react'

interface UserMessageProps {
  text: string
}

export function UserMessage({ text }: UserMessageProps) {
  return (
    <div className="flex gap-3 flex-row-reverse">
      <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
        <User className="w-4 h-4 text-foreground" />
      </div>
      <div className="bg-muted border border-border rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[80%]">
        <p className="text-sm">{text}</p>
      </div>
    </div>
  )
}
