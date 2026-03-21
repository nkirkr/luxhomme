'use client'

import { usePathname, useRouter } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const LOCALE_LABELS: Record<string, string> = {
  en: 'EN',
  ru: 'RU',
  de: 'DE',
  fr: 'FR',
  es: 'ES',
  zh: 'ZH',
  ja: 'JA',
  ko: 'KO',
}

export function LanguageSwitcher() {
  const pathname = usePathname()
  const router = useRouter()

  const locales = (process.env.NEXT_PUBLIC_LOCALES || 'en').split(',').map((l) => l.trim())
  const defaultLocale = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'en'

  // Detect current locale from pathname
  const pathSegments = pathname.split('/')
  const currentLocale = locales.includes(pathSegments[1]) ? pathSegments[1] : defaultLocale

  function handleChange(newLocale: string) {
    // Remove current locale prefix if present
    let pathWithoutLocale = pathname
    if (currentLocale !== defaultLocale && pathname.startsWith(`/${currentLocale}`)) {
      pathWithoutLocale = pathname.slice(`/${currentLocale}`.length) || '/'
    }

    // Add new locale prefix (skip for default locale)
    const newPath =
      newLocale === defaultLocale ? pathWithoutLocale : `/${newLocale}${pathWithoutLocale}`

    router.push(newPath)
  }

  if (locales.length <= 1) return null

  return (
    <Select value={currentLocale} onValueChange={handleChange}>
      <SelectTrigger className="h-9 w-[70px] text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {locales.map((locale) => (
          <SelectItem key={locale} value={locale}>
            {LOCALE_LABELS[locale] || locale.toUpperCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
