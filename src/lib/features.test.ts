import { describe, it, expect, beforeEach } from 'vitest'
import { withEnv } from '@/test/helpers'

describe('features', () => {
  let cleanup: () => void

  beforeEach(() => {
    // Reset module cache so features re-reads env
    vi.resetModules()
  })

  afterEach(() => {
    cleanup?.()
  })

  it('all features default to false', async () => {
    cleanup = withEnv({
      NEXT_PUBLIC_FEATURE_BLOG: 'false',
      NEXT_PUBLIC_FEATURE_AUTH: 'false',
      NEXT_PUBLIC_FEATURE_SHOP: 'false',
    })

    const { features } = await import('./features')
    expect(features.blog).toBe(false)
    expect(features.auth).toBe(false)
    expect(features.shop).toBe(false)
  })

  it('reads enabled features from env', async () => {
    cleanup = withEnv({
      NEXT_PUBLIC_FEATURE_BLOG: 'true',
      NEXT_PUBLIC_FEATURE_AUTH: 'true',
    })

    const { features } = await import('./features')
    expect(features.blog).toBe(true)
    expect(features.auth).toBe(true)
  })

  it('isEnabled returns correct value', async () => {
    cleanup = withEnv({
      NEXT_PUBLIC_FEATURE_BLOG: 'true',
      NEXT_PUBLIC_FEATURE_SHOP: 'false',
    })

    const { isEnabled } = await import('./features')
    expect(isEnabled('blog')).toBe(true)
    expect(isEnabled('shop')).toBe(false)
  })

  it('getEnabledFeatures returns only enabled', async () => {
    cleanup = withEnv({
      NEXT_PUBLIC_FEATURE_BLOG: 'true',
      NEXT_PUBLIC_FEATURE_I18N: 'true',
      NEXT_PUBLIC_FEATURE_AUTH: 'false',
      NEXT_PUBLIC_FEATURE_DASHBOARD: 'false',
      NEXT_PUBLIC_FEATURE_SHOP: 'false',
      NEXT_PUBLIC_FEATURE_CHAT: 'false',
      NEXT_PUBLIC_FEATURE_PAYMENT: 'false',
      NEXT_PUBLIC_FEATURE_ANALYTICS: 'false',
    })

    const { getEnabledFeatures } = await import('./features')
    const enabled = getEnabledFeatures()
    expect(enabled).toContain('blog')
    expect(enabled).toContain('i18n')
    expect(enabled).not.toContain('auth')
  })

  it('cmsProvider reads from env', async () => {
    cleanup = withEnv({ CMS_PROVIDER: 'wordpress' })

    const { cmsProvider, hasCMS } = await import('./features')
    expect(cmsProvider).toBe('wordpress')
    expect(hasCMS).toBe(true)
  })

  it('cmsProvider defaults to none', async () => {
    cleanup = withEnv({ CMS_PROVIDER: undefined })

    const { cmsProvider, hasCMS } = await import('./features')
    expect(cmsProvider).toBe('none')
    expect(hasCMS).toBe(false)
  })
})
