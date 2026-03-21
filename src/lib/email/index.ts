import type { EmailAdapter } from './types'
import { createLogger } from '@/lib/logger'
export type { EmailAdapter, EmailMessage } from './types'

const log = createLogger('email')

type EmailProvider = 'none' | 'resend'

const EMAIL_PROVIDER: EmailProvider = (process.env.EMAIL_PROVIDER as EmailProvider) ?? 'none'

const mockAdapter: EmailAdapter = {
  async send(message) {
    log.info({ subject: message.subject, to: message.to }, 'Mock email sent')
    return { id: `mock-${Date.now()}` }
  },
}

let _email: EmailAdapter | null = null

export async function getEmail(): Promise<EmailAdapter> {
  if (_email) return _email

  switch (EMAIL_PROVIDER) {
    case 'resend': {
      const { resendAdapter } = await import('./resend')
      _email = resendAdapter
      break
    }
    default:
      _email = mockAdapter
  }

  return _email
}
