import { describe, expect, it } from 'vitest'
import { canAccessSite } from '../../src/domain/auth/site-scope.js'

describe('canAccessSite', () => {
  it('allows when siteId is in the allowed list', () => {
    expect(canAccessSite(['v0', 'nextjs'], 'v0')).toBe(true)
  })

  it('denies when siteId is not in the allowed list', () => {
    expect(canAccessSite(['v0'], 'cloudflare')).toBe(false)
  })

  it('denies when allowed list is empty', () => {
    expect(canAccessSite([], 'v0')).toBe(false)
  })

  it('denies when siteId is empty', () => {
    expect(canAccessSite(['v0'], '')).toBe(false)
  })
})
