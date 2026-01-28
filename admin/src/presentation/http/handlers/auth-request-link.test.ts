import { describe, it, expect } from 'vitest'
import { validateCallbackUrl } from './auth-request-link.js'
import type { Env } from '../../../env.js'

describe('validateCallbackUrl', () => {
  const env = (overrides: Partial<Env>): Env => ({ ...overrides })

  it('allows localhost in dev', () => {
    expect(validateCallbackUrl('http://localhost:3000/auth/callback', env({ ENV: 'dev' }))).toBe(true)
    expect(validateCallbackUrl('http://127.0.0.1:3000/auth/callback', env({ ENV: 'dev' }))).toBe(true)
  })

  it('rejects localhost in non-dev', () => {
    expect(validateCallbackUrl('http://localhost:3000/auth/callback', env({ ENV: 'prod' }))).toBe(false)
  })

  it('allows exact origin match', () => {
    const e = env({ ALLOWED_CALLBACK_ORIGINS: 'https://example.com' })
    expect(validateCallbackUrl('https://example.com/auth/callback', e)).toBe(true)
    expect(validateCallbackUrl('https://example.com:443/auth/callback', e)).toBe(true)
    expect(validateCallbackUrl('https://example.com.evil.com/auth/callback', e)).toBe(false)
  })

  it('allows wildcard origin match with scheme', () => {
    const e = env({ ALLOWED_CALLBACK_ORIGINS: 'https://*.dx-media.pages.dev' })
    expect(validateCallbackUrl('https://pr-123.dx-media.pages.dev/auth/callback', e)).toBe(true)
    expect(validateCallbackUrl('https://dx-media.pages.dev/auth/callback', e)).toBe(true)
    expect(validateCallbackUrl('http://pr-123.dx-media.pages.dev/auth/callback', e)).toBe(false)
  })

  it('rejects wildcard bypass via suffix match', () => {
    const e = env({ ALLOWED_CALLBACK_ORIGINS: 'https://*.dx-media.pages.dev' })
    expect(validateCallbackUrl('https://dx-media.pages.dev.evil.com/auth/callback', e)).toBe(false)
    expect(validateCallbackUrl('https://evil-dx-media.pages.dev/auth/callback', e)).toBe(false)
  })
})

