import { describe, expect, test } from 'vitest'
import { SitePhase } from '../../src/domain/value-objects/site-phase.js'

describe('SitePhase', () => {
  test('isPublishable returns true only for "publish"', () => {
    expect(SitePhase.create('publish').isPublishable()).toBe(true)
    expect(SitePhase.create('initialized').isPublishable()).toBe(false)
    expect(SitePhase.create('unknown').isPublishable()).toBe(false)
    expect(SitePhase.create('').isPublishable()).toBe(false)
  })

  test('create trims and normalizes empty to unknown', () => {
    expect(SitePhase.create(' publish ').toString()).toBe('publish')
    expect(SitePhase.create('   ').toString()).toBe('unknown')
  })
})
