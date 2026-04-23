import { describe, expect, it } from 'vitest'
import { normalizeRuPhone } from './normalize-phone'

describe('normalizeRuPhone', () => {
  it('нормализует +7 и 8', () => {
    expect(normalizeRuPhone('+7 (900) 111-22-33')).toBe('79001112233')
    expect(normalizeRuPhone('89001112233')).toBe('79001112233')
    expect(normalizeRuPhone('79001112233')).toBe('79001112233')
  })

  it('добавляет 7 к 10 цифрам с 9', () => {
    expect(normalizeRuPhone('9001112233')).toBe('79001112233')
  })

  it('возвращает null для пустого или короткого ввода', () => {
    expect(normalizeRuPhone('')).toBe(null)
    expect(normalizeRuPhone('123')).toBe(null)
  })
})
