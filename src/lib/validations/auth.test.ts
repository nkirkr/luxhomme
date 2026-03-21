import { describe, it, expect } from 'vitest'
import { loginSchema, registerSchema } from './auth'

describe('loginSchema', () => {
  it('accepts valid credentials', () => {
    const result = loginSchema.safeParse({ email: 'test@example.com', password: '12345678' })
    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({ email: 'invalid', password: '12345678' })
    expect(result.success).toBe(false)
  })

  it('rejects short password', () => {
    const result = loginSchema.safeParse({ email: 'test@example.com', password: '123' })
    expect(result.success).toBe(false)
  })
})

describe('registerSchema', () => {
  it('accepts valid registration', () => {
    const result = registerSchema.safeParse({
      name: 'John',
      email: 'john@example.com',
      password: '12345678',
      confirmPassword: '12345678',
    })
    expect(result.success).toBe(true)
  })

  it('rejects mismatched passwords', () => {
    const result = registerSchema.safeParse({
      name: 'John',
      email: 'john@example.com',
      password: '12345678',
      confirmPassword: 'different',
    })
    expect(result.success).toBe(false)
  })
})
