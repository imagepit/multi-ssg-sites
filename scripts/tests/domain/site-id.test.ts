import { describe, expect, it } from 'vitest'
import { SiteId } from '../../src/domain/value-objects/site-id.js'

describe('SiteId', () => {
  it('accepts lowercase ids', () => {
    const siteId = SiteId.create('v0')
    expect(siteId.toString()).toBe('v0')
  })

  it('rejects empty value', () => {
    expect(() => SiteId.create('')).toThrow('siteId is required')
  })

  it('rejects invalid characters', () => {
    expect(() => SiteId.create('MySite')).toThrow('siteId must match')
  })
})
