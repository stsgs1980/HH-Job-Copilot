'use client'

import { MessageSquare, X, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ChatItem } from '@/types'

const chatList: ChatItem[] = [
  { name: 'Яндекс — Елена', preview: 'Когда сможете пройти собеседование?', time: '2м', unread: true, color: 'bg-cyan/10 text-cyan' },
  { name: 'Avito — Михаил', preview: 'Расскажите о вашем опыте с Next.js', time: '15м', unread: true, color: 'bg-emerald/10 text-emerald' },
  { name: 'Тинькофф — Анна', preview: 'Отправьте портфолио', time: '1ч', unread: false, color: 'bg-orange-500/10 text-orange-400' },
  { name: 'VK — Дмитрий', preview: 'Спасибо за отклик! Нам интересен...', time: '2ч', unread: false, color: 'bg-emerald-500/10 text-emerald-400' },
]

interface ChatPanelProps {
  onClose: () => void
  chats?: ChatItem[]
  isLoading?: boolean
}

export function ChatPanel({ onClose, chats: _chats, isLoading: _isLoading }: ChatPanelProps) {
  return (
    <aside className="hidden lg:flex flex-col w-[340px] border-l border-border/50 bg-background/80 backdrop-blur-xl shrink-0">
      <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
        <span className="text-sm font-semibold flex items-center gap-1.5"><MessageSquare className="w-4 h-4 text-cyan" /> Активные чаты</span>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}><X className="w-3 h-3" /></Button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {chatList.map((c, i) => (
          <div key={i} className={`flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 cursor-pointer transition-all duration-200 hover:translate-x-0.5 ${c.unread ? 'bg-muted/30' : ''}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${c.color}`}>
              {c.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium truncate">{c.name}</span>
                <span className="text-[10px] text-muted-foreground">{c.time}</span>
              </div>
              <p className="text-[11px] text-muted-foreground truncate">{c.preview}</p>
            </div>
            {c.unread && <div className="w-2 h-2 rounded-full bg-cyan shrink-0" />}
          </div>
        ))}
      </div>
      {/* Profile Card */}
      <div className="border-t border-border/50 p-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold">Сергей Т.</p>
            <p className="text-[10px] text-muted-foreground">Pro тариф</p>
          </div>
          <div className="flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded streak-glow">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[10px] font-medium text-emerald-400">7 дней streak</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
