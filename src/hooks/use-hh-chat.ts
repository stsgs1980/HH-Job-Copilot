'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { isFeatureEnabled } from '@/lib/feature-flags'
import type { ChatItem, HHChat } from '@/types'

// ---- Mock data when FEATURE_HH_CHATIK=false ----

const MOCK_CHATS: ChatItem[] = [
  { name: 'Яндекс — Елена', preview: 'Когда сможете пройти собеседование?', time: '2м', unread: true, color: 'bg-cyan/10 text-cyan' },
  { name: 'Avito — Михаил', preview: 'Расскажите о вашем опыте с Next.js', time: '15м', unread: true, color: 'bg-purple/10 text-purple' },
  { name: 'Тинькофф — Анна', preview: 'Отправьте портфолио', time: '1ч', unread: false, color: 'bg-orange-500/10 text-orange-400' },
  { name: 'VK — Дмитрий', preview: 'Спасибо за отклик! Нам интересен...', time: '2ч', unread: false, color: 'bg-emerald-500/10 text-emerald-400' },
]

/** Convert HHChat (API) to ChatItem (UI) */
function hhChatToChatItem(chat: HHChat): ChatItem {
  const colors = [
    'bg-cyan/10 text-cyan',
    'bg-purple/10 text-purple',
    'bg-orange-500/10 text-orange-400',
    'bg-emerald-500/10 text-emerald-400',
  ]
  return {
    name: chat.name,
    preview: chat.lastMessage ?? '',
    time: formatRelativeTime(chat.updatedAt),
    unread: chat.unreadCount > 0,
    color: colors[Math.abs(hashCode(chat.id)) % colors.length],
  }
}

function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0
  }
  return hash
}

function formatRelativeTime(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMin = Math.floor(diffMs / 60000)
    if (diffMin < 1) return 'сейчас'
    if (diffMin < 60) return `${diffMin}м`
    const diffHrs = Math.floor(diffMin / 60)
    if (diffHrs < 24) return `${diffHrs}ч`
    const diffDays = Math.floor(diffHrs / 24)
    return `${diffDays}д`
  } catch {
    return ''
  }
}

// ---- Fetch helpers ----

async function fetchChatsAPI(): Promise<ChatItem[]> {
  const res = await fetch('/api/hh/chats?userId=mock-user-001')
  if (!res.ok) throw new Error('Failed to fetch chats')
  const data = await res.json()
  const chats: HHChat[] = data.chats ?? []
  return chats.map(hhChatToChatItem)
}

async function sendMessageAPI(chatId: string, text: string): Promise<void> {
  const res = await fetch(`/api/hh/chats/${chatId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: 'mock-user-001', text }),
  })
  if (!res.ok) throw new Error('Failed to send message')
}

async function markReadAPI(chatId: string): Promise<void> {
  const res = await fetch(`/api/hh/chats/${chatId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: 'mock-user-001', action: 'mark_read' }),
  })
  if (!res.ok) throw new Error('Failed to mark as read')
}

// ---- Hook ----

export function useHHChat() {
  const queryClient = useQueryClient()
  const hhChatikEnabled = isFeatureEnabled('hhChatik')
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // React Query for chat list
  const {
    data: chats = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['hh-chats'],
    queryFn: hhChatikEnabled ? fetchChatsAPI : async () => MOCK_CHATS,
    refetchInterval: hhChatikEnabled ? 5000 : false, // Poll every 5s when enabled
    enabled: true,
    staleTime: 3000,
  })

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: ({ chatId, text }: { chatId: string; text: string }) => {
      if (!hhChatikEnabled) return Promise.resolve()
      return sendMessageAPI(chatId, text)
    },
    onSuccess: () => {
      void refetch()
    },
  })

  // Mark read mutation
  const markReadMutation = useMutation({
    mutationFn: (chatId: string) => {
      if (!hhChatikEnabled) return Promise.resolve()
      return markReadAPI(chatId)
    },
    onSuccess: () => {
      void refetch()
    },
  })

  const sendMessage = useCallback(
    (chatId: string, text: string) => {
      sendMessageMutation.mutate({ chatId, text })
    },
    [sendMessageMutation],
  )

  const markRead = useCallback(
    (chatId: string) => {
      markReadMutation.mutate(chatId)
    },
    [markReadMutation],
  )

  return {
    chats,
    isLoading,
    error: error?.message ?? null,
    sendMessage,
    markRead,
    refetch,
  }
}
