import { Inter, JetBrains_Mono } from 'next/font/google'
import localFont from 'next/font/local'

export const fontSans = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-sans',
})

export const fontInter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
})

export const fontMono = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-mono',
})

export const fontGogol = localFont({
  src: '../../public/fonts/Gogol-Regular.woff2',
  display: 'swap',
  variable: '--font-gogol-var',
  weight: '400',
})
