export interface EmailMessage {
  to: string | string[]
  subject: string
  html: string
  text?: string
  from?: string
  replyTo?: string
}

export interface EmailAdapter {
  send(message: EmailMessage): Promise<{ id: string }>
}
