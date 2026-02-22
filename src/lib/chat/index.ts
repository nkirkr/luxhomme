import type { ChatAdapter } from './types'
export type { ChatAdapter, ChatMessage } from './types'

type ChatProvider = 'none' | 'intercom' | 'tawkto' | 'custom'

const CHAT_PROVIDER: ChatProvider =
  (process.env.CHAT_PROVIDER as ChatProvider) ?? 'none'

const mockAdapter: ChatAdapter = {
  async sendMessage() {
    throw new Error('Chat provider not configured')
  },
  async getHistory() {
    return []
  },
  onMessage() {
    return () => {}
  },
}

let _chat: ChatAdapter | null = null

export async function getChat(): Promise<ChatAdapter> {
  if (_chat) return _chat

  switch (CHAT_PROVIDER) {
    // Future: import chat adapters
    default:
      _chat = mockAdapter
  }

  return _chat
}
