import { Resend } from 'resend'
import type { EmailAdapter } from './types'

function getClient() {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('RESEND_API_KEY is not set')
  return new Resend(key)
}

export const resendAdapter: EmailAdapter = {
  async send({ to, subject, html, text, from, replyTo }) {
    const client = getClient()
    const defaultFrom = process.env.EMAIL_FROM ?? 'noreply@example.com'

    const { data, error } = await client.emails.send({
      from: from ?? defaultFrom,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
      replyTo,
    })

    if (error) throw new Error(error.message)
    return { id: data?.id ?? '' }
  },
}
