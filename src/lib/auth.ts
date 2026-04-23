import path from 'node:path'
import Database from 'better-sqlite3'
import { betterAuth } from 'better-auth'
import { phoneNumber } from 'better-auth/plugins/phone-number'
import { normalizeRuPhone } from '@/lib/sms/normalize-phone'
import { sendSmscSms } from '@/lib/sms/smsc-send'

/** Путь к файлу SQLite для Better Auth (DATABASE_URL: пусто / file:./auth.db → auth.db в корне проекта). */
function resolveAuthSqlitePath(): string {
  const raw = process.env.DATABASE_URL?.trim()
  if (!raw || raw === 'file:./auth.db') {
    return path.join(process.cwd(), 'auth.db')
  }
  if (!raw.startsWith('file:')) {
    return path.join(process.cwd(), 'auth.db')
  }
  const rest = raw.slice('file:'.length)
  if (rest.startsWith('//')) {
    try {
      let pathname = decodeURIComponent(new URL(raw).pathname)
      if (process.platform === 'win32' && /^\/[A-Za-z]:/.test(pathname)) {
        pathname = pathname.slice(1)
      }
      return pathname
    } catch {
      return path.join(process.cwd(), 'auth.db')
    }
  }
  const rel = rest.replace(/^\.\//, '')
  if (path.isAbsolute(rel)) return rel
  return path.join(process.cwd(), rel)
}

const authSqlite = new Database(resolveAuthSqlitePath())

function buildSmsOtpMessage(code: string): string {
  const template = process.env.SMSC_OTP_MESSAGE?.trim() || 'Luxhomme: код {code}'
  return template.includes('{code}') ? template.replaceAll('{code}', code) : `${template} ${code}`
}

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  secret: process.env.BETTER_AUTH_SECRET,

  database: authSqlite,

  plugins: [
    phoneNumber({
      otpLength: 6,
      expiresIn: 300,
      allowedAttempts: 5,
      phoneNumberValidator: async (phone) => normalizeRuPhone(phone) !== null,
      sendOTP: async ({ phoneNumber, code }) => {
        const normalized = normalizeRuPhone(phoneNumber)
        if (!normalized) return
        await sendSmscSms({
          phones: normalized,
          message: buildSmsOtpMessage(code),
        })
      },
      signUpOnVerification: {
        getTempEmail: (phone) => {
          const digits = (normalizeRuPhone(phone) ?? phone).replace(/\D/g, '')
          return `sms${digits}@phone-auth.invalid`
        },
        getTempName: (phone) => normalizeRuPhone(phone) ?? phone,
      },
    }),
  ],

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignIn: true,
  },

  socialProviders: {
    ...(process.env.GITHUB_CLIENT_ID
      ? {
          github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
          },
        }
      : {}),
    ...(process.env.GOOGLE_CLIENT_ID
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          },
        }
      : {}),
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },

  trustedOrigins: [process.env.BETTER_AUTH_URL || 'http://localhost:3000'],
})

export type Auth = typeof auth
