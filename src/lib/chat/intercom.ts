import type { ChatAdapter, ChatMessage } from './types'

export const intercomAdapter: ChatAdapter = {
  async sendMessage(message, _sessionId) {
    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      content: message,
      sender: 'user',
      timestamp: new Date(),
    }
    if (typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).Intercom) {
      ;(window as unknown as Record<string, (cmd: string, msg: string) => void>).Intercom(
        'showNewMessage',
        message,
      )
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

export const INTERCOM_APP_ID = process.env.NEXT_PUBLIC_INTERCOM_APP_ID ?? ''
