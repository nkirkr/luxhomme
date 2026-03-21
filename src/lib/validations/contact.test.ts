import { describe, it, expect } from 'vitest'
import { contactSchema } from './contact'

describe('contactSchema', () => {
  it('accepts valid input', () => {
    const result = contactSchema.safeParse({
      name: 'John',
      email: 'john@example.com',
      message: 'This is a test message.',
    })
    expect(result.success).toBe(true)
  })

  it('accepts with optional subject', () => {
    const result = contactSchema.safeParse({
      name: 'John',
      email: 'john@example.com',
      subject: 'Hello',
      message: 'This is a test message.',
    })
    expect(result.success).toBe(true)
  })

  it('rejects short name', () => {
    const result = contactSchema.safeParse({
      name: 'J',
      email: 'john@example.com',
      message: 'This is a test message.',
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid email', () => {
    const result = contactSchema.safeParse({
      name: 'John',
      email: 'not-an-email',
      message: 'This is a test message.',
    })
    expect(result.success).toBe(false)
  })

  it('rejects short message', () => {
    const result = contactSchema.safeParse({
      name: 'John',
      email: 'john@example.com',
      message: 'Short',
    })
    expect(result.success).toBe(false)
  })

  it('rejects short subject when provided', () => {
    const result = contactSchema.safeParse({
      name: 'John',
      email: 'john@example.com',
      subject: 'Hi',
      message: 'This is a test message.',
    })
    expect(result.success).toBe(false)
  })

  it('allows missing subject', () => {
    const result = contactSchema.safeParse({
      name: 'John',
      email: 'john@example.com',
      message: 'This is a test message.',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.subject).toBeUndefined()
    }
  })
})
