import { defineRouting } from 'next-intl/routing'

const localesStr = process.env.NEXT_PUBLIC_LOCALES || 'en'
const locales = localesStr.split(',').map((l) => l.trim())
const defaultLocale = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'en'

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
})
