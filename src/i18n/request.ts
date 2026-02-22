import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async () => {
  const locale = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'en'

  let messages = {}
  try {
    messages = (await import(`../../messages/${locale}.json`)).default
  } catch {
    // Fallback to empty messages if file not found
  }

  return {
    locale,
    messages,
  }
})
