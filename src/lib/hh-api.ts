// ============================================================
// HH.ru Chatik API Client
// ============================================================
// Endpoints: https://chatik.hh.ru/chatik/api/
// Auth: cookies (hhtoken, hhuid, crypted_hhuid, _xsrf) + X-XSRFToken header
// ============================================================

const CHATIK_BASE = 'https://chatik.hh.ru/chatik/api'

interface ChatikCookies {
  hhtoken: string
  hhuid: string
  crypted_hhuid: string
  _xsrf: string
}

interface ChatikChat {
  id: string
  name: string
  lastMessage?: string
  unreadCount: number
  updatedAt: string
}

interface ChatikMessage {
  id: string
  text: string
  from: 'employer' | 'applicant'
  createdAt: string
}

/** Build headers for Chatik API requests */
function buildHeaders(cookies: ChatikCookies): Record<string, string> {
  return {
    'Cookie': `hhtoken=${cookies.hhtoken}; hhuid=${cookies.hhuid}; crypted_hhuid=${cookies.crypted_hhuid}; _xsrf=${cookies._xsrf}`,
    'X-XSRFToken': cookies._xsrf,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    'Origin': 'https://hh.ru',
    'Referer': 'https://hh.ru/',
  }
}

/** Get list of chats */
export async function getChats(cookies: ChatikCookies): Promise<ChatikChat[]> {
  const res = await fetch(`${CHATIK_BASE}/chats`, {
    headers: buildHeaders(cookies),
  })
  if (!res.ok) throw new Error(`Chatik API error: ${res.status}`)
  const data = await res.json()
  return data?.chats ?? data ?? []
}

/** Get messages for a specific chat */
export async function getChatData(
  cookies: ChatikCookies,
  chatId: string,
  limit = 50,
  offset = 0,
): Promise<ChatikMessage[]> {
  const params = new URLSearchParams({ id: chatId, limit: String(limit), offset: String(offset) })
  const res = await fetch(`${CHATIK_BASE}/chat_data?${params}`, {
    headers: buildHeaders(cookies),
  })
  if (!res.ok) throw new Error(`Chatik API error: ${res.status}`)
  const data = await res.json()
  return data?.messages ?? data ?? []
}

/** Send a message in a chat */
export async function sendMessage(
  cookies: ChatikCookies,
  chatId: string,
  text: string,
): Promise<{ success: boolean }> {
  const res = await fetch(`${CHATIK_BASE}/send`, {
    method: 'POST',
    headers: buildHeaders(cookies),
    body: JSON.stringify({ chat_id: chatId, text }),
  })
  if (!res.ok) throw new Error(`Chatik API error: ${res.status}`)
  return { success: true }
}

/** Mark chat messages as read */
export async function markRead(
  cookies: ChatikCookies,
  chatId: string,
): Promise<{ success: boolean }> {
  const res = await fetch(`${CHATIK_BASE}/mark_read`, {
    method: 'POST',
    headers: buildHeaders(cookies),
    body: JSON.stringify({ chat_id: chatId }),
  })
  if (!res.ok) throw new Error(`Chatik API error: ${res.status}`)
  return { success: true }
}

export type { ChatikCookies, ChatikChat, ChatikMessage }
