import type { ChatAdapter } from './types'
export type { ChatAdapter, ChatMessage } from './types'

type ChatProvider = 'none' | 'intercom' | 'tawkto' | 'custom'

const CHAT_PROVIDER: ChatProvider = (process.env.CHAT_PROVIDER as ChatProvider) ?? 'none'

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
    case 'tawkto': {
      const { tawktoAdapter } = await import('./tawkto')
      _chat = tawktoAdapter
      break
    }
    case 'intercom': {
      const { intercomAdapter } = await import('./intercom')
      _chat = intercomAdapter
      break
    }
    default:
      _chat = mockAdapter
  }

  return _chat
}

export { CHAT_PROVIDER }
