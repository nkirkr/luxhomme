export interface ChatMessage {
  id: string
  content: string
  sender: 'user' | 'agent'
  timestamp: Date
}

export interface ChatAdapter {
  sendMessage(message: string, sessionId: string): Promise<ChatMessage>
  getHistory(sessionId: string): Promise<ChatMessage[]>
  onMessage(callback: (message: ChatMessage) => void): () => void
}
