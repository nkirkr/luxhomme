/// <reference types="@testing-library/jest-dom" />

// Default env vars for tests
process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000'
process.env.NEXT_PUBLIC_SITE_NAME = 'Test Site'
process.env.NEXT_PUBLIC_FEATURE_BLOG = 'false'
process.env.NEXT_PUBLIC_FEATURE_AUTH = 'false'
process.env.NEXT_PUBLIC_FEATURE_DASHBOARD = 'false'
process.env.NEXT_PUBLIC_FEATURE_SHOP = 'false'
process.env.NEXT_PUBLIC_FEATURE_CHAT = 'false'
process.env.NEXT_PUBLIC_FEATURE_PAYMENT = 'false'
process.env.NEXT_PUBLIC_FEATURE_I18N = 'false'
process.env.NEXT_PUBLIC_FEATURE_ANALYTICS = 'false'
process.env.NEXT_PUBLIC_FEATURE_SENTRY = 'false'
process.env.NEXT_PUBLIC_DEFAULT_LOCALE = 'en'
process.env.NEXT_PUBLIC_LOCALES = 'en,ru'
process.env.CMS_PROVIDER = 'none'
process.env.PAYMENT_PROVIDER = 'none'
process.env.CHAT_PROVIDER = 'none'
process.env.EMAIL_PROVIDER = 'none'

// Mock localStorage for cart and other client-side storage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
    get length() {
      return Object.keys(store).length
    },
    key: (index: number) => Object.keys(store)[index] ?? null,
  }
})()

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock })

// Mock matchMedia
Object.defineProperty(globalThis, 'matchMedia', {
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
})
