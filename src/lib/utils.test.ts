import { describe, it, expect } from 'vitest'
import { cn, formatDate, absoluteUrl, truncate, slugify } from './utils'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('px-2', 'py-1')).toBe('px-2 py-1')
  })

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'extra')).toBe('base extra')
  })

  it('resolves tailwind conflicts', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })

  it('handles empty input', () => {
    expect(cn()).toBe('')
  })
})

describe('formatDate', () => {
  it('formats a date string', () => {
    const result = formatDate('2025-01-15', 'en-US')
    expect(result).toBe('January 15, 2025')
  })

  it('formats a Date object', () => {
    const result = formatDate(new Date('2025-06-01'), 'en-US')
    expect(result).toContain('2025')
  })

  it('respects locale', () => {
    const result = formatDate('2025-01-15', 'ru-RU')
    expect(result).toContain('2025')
  })
})

describe('absoluteUrl', () => {
  it('creates absolute URL from path', () => {
    expect(absoluteUrl('/about')).toBe('http://localhost:3000/about')
  })

  it('works with root path', () => {
    expect(absoluteUrl('/')).toBe('http://localhost:3000/')
  })
})

describe('truncate', () => {
  it('truncates long strings', () => {
    expect(truncate('Hello World', 5)).toBe('Hello...')
  })

  it('does not truncate short strings', () => {
    expect(truncate('Hi', 5)).toBe('Hi')
  })

  it('handles exact length', () => {
    expect(truncate('Hello', 5)).toBe('Hello')
  })
})

describe('slugify', () => {
  it('converts to lowercase kebab-case', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })

  it('removes special characters', () => {
    expect(slugify('Hello! @World#')).toBe('hello-world')
  })

  it('handles multiple spaces', () => {
    expect(slugify('Hello   World')).toBe('hello-world')
  })

  it('trims leading/trailing dashes', () => {
    expect(slugify('  Hello World  ')).toBe('hello-world')
  })

  it('handles underscores', () => {
    expect(slugify('hello_world')).toBe('hello-world')
  })
})
