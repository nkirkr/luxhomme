import { z } from 'zod'

const booleanFlag = z
  .enum(['true', 'false', ''])
  .optional()
  .default('false')
  .transform((v) => v === 'true')

const serverSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  REDIS_URL: z.string().url().optional(),

  BETTER_AUTH_SECRET: z.string().min(1).optional(),
  BETTER_AUTH_URL: z.string().url().optional(),

  CMS_PROVIDER: z.enum(['none', 'wordpress', 'payload']).default('none'),
  WORDPRESS_GRAPHQL_URL: z.string().url().optional(),
  WP_APPLICATION_USER: z.string().optional(),
  WP_APPLICATION_PASSWORD: z.string().optional(),
  WP_PREVIEW_SECRET: z.string().optional(),
  PAYLOAD_API_URL: z.string().url().optional(),
  PAYLOAD_API_KEY: z.string().optional(),

  PAYMENT_PROVIDER: z.enum(['none', 'stripe', 'yookassa']).default('none'),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  YOOKASSA_SHOP_ID: z.string().optional(),
  YOOKASSA_SECRET_KEY: z.string().optional(),
  YOOKASSA_WEBHOOK_SECRET: z.string().optional(),

  CHAT_PROVIDER: z.enum(['none', 'intercom', 'tawkto', 'custom']).default('none'),
  CHAT_API_KEY: z.string().optional(),

  EMAIL_PROVIDER: z.enum(['none', 'resend']).default('none'),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().email().optional(),

  REVALIDATION_SECRET: z.string().optional(),
})

const clientSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_SITE_NAME: z.string().default('My Site'),

  NEXT_PUBLIC_FEATURE_BLOG: booleanFlag,
  NEXT_PUBLIC_FEATURE_AUTH: booleanFlag,
  NEXT_PUBLIC_FEATURE_DASHBOARD: booleanFlag,
  NEXT_PUBLIC_FEATURE_SHOP: booleanFlag,
  NEXT_PUBLIC_FEATURE_CHAT: booleanFlag,
  NEXT_PUBLIC_FEATURE_PAYMENT: booleanFlag,
  NEXT_PUBLIC_FEATURE_I18N: booleanFlag,
  NEXT_PUBLIC_FEATURE_ANALYTICS: booleanFlag,

  NEXT_PUBLIC_GA_ID: z.string().optional(),
  NEXT_PUBLIC_YM_ID: z.string().optional(),

  NEXT_PUBLIC_DEFAULT_LOCALE: z.string().default('en'),
  NEXT_PUBLIC_LOCALES: z.string().default('en,ru'),

  NEXT_PUBLIC_TAWKTO_PROPERTY_ID: z.string().optional(),
  NEXT_PUBLIC_TAWKTO_WIDGET_ID: z.string().default('default'),
  NEXT_PUBLIC_INTERCOM_APP_ID: z.string().optional(),

  STRIPE_PUBLISHABLE_KEY: z.string().optional(),
})

function validateEnv() {
  const serverResult = serverSchema.safeParse(process.env)
  const clientResult = clientSchema.safeParse(process.env)

  if (!serverResult.success && typeof window === 'undefined') {
    console.error('Invalid server environment variables:')
    console.error(serverResult.error.flatten().fieldErrors)
    throw new Error('Invalid server environment variables')
  }

  if (!clientResult.success) {
    console.error('Invalid client environment variables:')
    console.error(clientResult.error.flatten().fieldErrors)
    throw new Error('Invalid client environment variables')
  }

  return {
    server: serverResult.success ? serverResult.data : ({} as z.infer<typeof serverSchema>),
    client: clientResult.data,
  }
}

export const env = validateEnv()
export type ServerEnv = z.infer<typeof serverSchema>
export type ClientEnv = z.infer<typeof clientSchema>
