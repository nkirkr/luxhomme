export const features = {
  blog: process.env.NEXT_PUBLIC_FEATURE_BLOG === 'true',
  auth: process.env.NEXT_PUBLIC_FEATURE_AUTH === 'true',
  dashboard: process.env.NEXT_PUBLIC_FEATURE_DASHBOARD === 'true',
  shop: process.env.NEXT_PUBLIC_FEATURE_SHOP === 'true',
  chat: process.env.NEXT_PUBLIC_FEATURE_CHAT === 'true',
  payment: process.env.NEXT_PUBLIC_FEATURE_PAYMENT === 'true',
  i18n: process.env.NEXT_PUBLIC_FEATURE_I18N === 'true',
} as const

export type Feature = keyof typeof features

export function isEnabled(feature: Feature): boolean {
  return features[feature]
}

export function getEnabledFeatures(): Feature[] {
  return (Object.keys(features) as Feature[]).filter((f) => features[f])
}

export const cmsProvider = (process.env.CMS_PROVIDER || 'none') as
  | 'none'
  | 'wordpress'
  | 'payload'

export const hasCMS = cmsProvider !== 'none'
