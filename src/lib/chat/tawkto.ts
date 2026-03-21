import type { ChatAdapter, ChatMessage } from './types'

export const tawktoAdapter: ChatAdapter = {
  async sendMessage(message, _sessionId) {
    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      content: message,
      sender: 'user',
      timestamp: new Date(),
    }
    if (typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).Tawk_API) {
      ;(window as unknown as Record<string, { maximize: () => void }>).Tawk_API.maximize()
    }
    return msg
  },

  async getHistory() {
    return []
  },

  onMessage(_callback) {
    return () => {}
  },
}

export const TAWKTO_PROPERTY_ID = process.env.NEXT_PUBLIC_TAWKTO_PROPERTY_ID ?? ''
export const TAWKTO_WIDGET_ID = process.env.NEXT_PUBLIC_TAWKTO_WIDGET_ID ?? 'default'
