import { describe, it, expect } from 'vitest'
import {
  createXPromotionRedemption,
  type XPromotionRedemption,
} from './x-promotion-redemption.js'

describe('createXPromotionRedemption', () => {
  it('creates a redemption with valid input', () => {
    const redemption = createXPromotionRedemption({
      id: 'redemption-123',
      campaignId: 'campaign-456',
      userId: 'user-789',
      xUserId: '12345678901234567',
      repostId: '1881632785927586251',
      entitlementId: 'ent-abc',
    })

    expect(redemption.id).toBe('redemption-123')
    expect(redemption.campaignId).toBe('campaign-456')
    expect(redemption.userId).toBe('user-789')
    expect(redemption.xUserId).toBe('12345678901234567')
    expect(redemption.repostId).toBe('1881632785927586251')
    expect(redemption.entitlementId).toBe('ent-abc')
    expect(redemption.verifiedAt).toBeDefined()
  })

  it('throws error when id is missing', () => {
    expect(() =>
      createXPromotionRedemption({
        id: '',
        campaignId: 'campaign-456',
        userId: 'user-789',
        xUserId: '12345678901234567',
        repostId: '1881632785927586251',
        entitlementId: 'ent-abc',
      })
    ).toThrow('id is required')
  })

  it('throws error when campaignId is missing', () => {
    expect(() =>
      createXPromotionRedemption({
        id: 'redemption-123',
        campaignId: '',
        userId: 'user-789',
        xUserId: '12345678901234567',
        repostId: '1881632785927586251',
        entitlementId: 'ent-abc',
      })
    ).toThrow('campaignId is required')
  })

  it('throws error when userId is missing', () => {
    expect(() =>
      createXPromotionRedemption({
        id: 'redemption-123',
        campaignId: 'campaign-456',
        userId: '',
        xUserId: '12345678901234567',
        repostId: '1881632785927586251',
        entitlementId: 'ent-abc',
      })
    ).toThrow('userId is required')
  })

  it('throws error when xUserId is missing', () => {
    expect(() =>
      createXPromotionRedemption({
        id: 'redemption-123',
        campaignId: 'campaign-456',
        userId: 'user-789',
        xUserId: '',
        repostId: '1881632785927586251',
        entitlementId: 'ent-abc',
      })
    ).toThrow('xUserId is required')
  })

  it('throws error when repostId is missing', () => {
    expect(() =>
      createXPromotionRedemption({
        id: 'redemption-123',
        campaignId: 'campaign-456',
        userId: 'user-789',
        xUserId: '12345678901234567',
        repostId: '',
        entitlementId: 'ent-abc',
      })
    ).toThrow('repostId is required')
  })

  it('throws error when entitlementId is missing', () => {
    expect(() =>
      createXPromotionRedemption({
        id: 'redemption-123',
        campaignId: 'campaign-456',
        userId: 'user-789',
        xUserId: '12345678901234567',
        repostId: '1881632785927586251',
        entitlementId: '',
      })
    ).toThrow('entitlementId is required')
  })
})
