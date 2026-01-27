import { describe, it, expect } from 'vitest'
import {
  isOnSale,
  getPriceInfo,
  parseSaleConfig,
  type SaleConfig,
  type ActiveSale,
} from './sale.ts'

describe('sale domain', () => {
  // Test fixtures
  const createSaleConfig = (overrides?: Partial<SaleConfig>): SaleConfig => ({
    price: 100,
    startsAt: '2026-01-07T22:30:00+09:00',
    endsAt: '2026-02-06T22:30:00+09:00',
    label: 'セール中',
    ...overrides,
  })

  describe('isOnSale', () => {
    it('should return true when current time is within sale period', () => {
      const sale = createSaleConfig()
      // 2026-01-15 is within the sale period
      const now = new Date('2026-01-15T12:00:00+09:00')

      expect(isOnSale(sale, now)).toBe(true)
    })

    it('should return false when current time is before sale starts', () => {
      const sale = createSaleConfig()
      // 2026-01-01 is before the sale period
      const now = new Date('2026-01-01T12:00:00+09:00')

      expect(isOnSale(sale, now)).toBe(false)
    })

    it('should return false when current time is after sale ends', () => {
      const sale = createSaleConfig()
      // 2026-03-01 is after the sale period
      const now = new Date('2026-03-01T12:00:00+09:00')

      expect(isOnSale(sale, now)).toBe(false)
    })

    it('should return true at exact start time (inclusive start)', () => {
      const sale = createSaleConfig()
      const now = new Date('2026-01-07T22:30:00+09:00')

      expect(isOnSale(sale, now)).toBe(true)
    })

    it('should return true at exact end time (inclusive end)', () => {
      const sale = createSaleConfig()
      const now = new Date('2026-02-06T22:30:00+09:00')

      expect(isOnSale(sale, now)).toBe(true)
    })

    it('should return false 1ms after end time', () => {
      const sale = createSaleConfig()
      const now = new Date('2026-02-06T22:30:00.001+09:00')

      expect(isOnSale(sale, now)).toBe(false)
    })

    it('should handle different timezones correctly', () => {
      // Sale ends at 2026-02-06T22:30:00+09:00 = 2026-02-06T13:30:00Z
      const sale = createSaleConfig()

      // Same moment in UTC
      const nowUtc = new Date('2026-02-06T13:30:00Z')
      expect(isOnSale(sale, nowUtc)).toBe(true)

      // After end time in UTC
      const afterUtc = new Date('2026-02-06T13:30:01Z')
      expect(isOnSale(sale, afterUtc)).toBe(false)
    })
  })

  describe('getPriceInfo', () => {
    it('should return original price when no sale is provided', () => {
      const result = getPriceInfo(980, undefined)

      expect(result).toEqual({
        currentPrice: 980,
        originalPrice: 980,
        isOnSale: false,
        sale: undefined,
      })
    })

    it('should return sale price when sale is active', () => {
      const sale = createSaleConfig({ price: 100 })
      const now = new Date('2026-01-15T12:00:00+09:00')

      const result = getPriceInfo(980, sale, now)

      expect(result.currentPrice).toBe(100)
      expect(result.originalPrice).toBe(980)
      expect(result.isOnSale).toBe(true)
      expect(result.sale).toBeDefined()
      expect(result.sale?.price).toBe(100)
      expect(result.sale?.originalPrice).toBe(980)
      expect(result.sale?.label).toBe('セール中')
    })

    it('should return original price when sale is not active', () => {
      const sale = createSaleConfig({ price: 100 })
      const now = new Date('2026-03-01T12:00:00+09:00') // After sale period

      const result = getPriceInfo(980, sale, now)

      expect(result.currentPrice).toBe(980)
      expect(result.originalPrice).toBe(980)
      expect(result.isOnSale).toBe(false)
      expect(result.sale).toBeUndefined()
    })

    it('should use default label when not provided', () => {
      const sale: SaleConfig = {
        price: 100,
        startsAt: '2026-01-07T22:30:00+09:00',
        endsAt: '2026-02-06T22:30:00+09:00',
        // label is undefined
      }
      const now = new Date('2026-01-15T12:00:00+09:00')

      const result = getPriceInfo(980, sale, now)

      expect(result.sale?.label).toBe('セール中')
    })

    it('should preserve custom label', () => {
      const sale = createSaleConfig({ label: '初月限定' })
      const now = new Date('2026-01-15T12:00:00+09:00')

      const result = getPriceInfo(980, sale, now)

      expect(result.sale?.label).toBe('初月限定')
    })

    it('should include startsAt and endsAt in active sale info', () => {
      const sale = createSaleConfig()
      const now = new Date('2026-01-15T12:00:00+09:00')

      const result = getPriceInfo(980, sale, now)

      expect(result.sale?.startsAt).toBe('2026-01-07T22:30:00+09:00')
      expect(result.sale?.endsAt).toBe('2026-02-06T22:30:00+09:00')
    })
  })

  describe('parseSaleConfig', () => {
    it('should parse frontmatter sale config with snake_case keys', () => {
      const frontmatterSale = {
        price: 100,
        starts_at: '2026-01-07T22:30:00+09:00',
        ends_at: '2026-02-06T22:30:00+09:00',
        label: 'セール中',
      }

      const result = parseSaleConfig(frontmatterSale)

      expect(result).toEqual({
        price: 100,
        startsAt: '2026-01-07T22:30:00+09:00',
        endsAt: '2026-02-06T22:30:00+09:00',
        label: 'セール中',
      })
    })

    it('should return undefined for undefined input', () => {
      expect(parseSaleConfig(undefined)).toBeUndefined()
    })

    it('should handle missing label', () => {
      const frontmatterSale = {
        price: 100,
        starts_at: '2026-01-07T22:30:00+09:00',
        ends_at: '2026-02-06T22:30:00+09:00',
      }

      const result = parseSaleConfig(frontmatterSale)

      expect(result?.label).toBeUndefined()
    })
  })

  describe('ActiveSale type', () => {
    it('should contain all required fields', () => {
      const activeSale: ActiveSale = {
        price: 100,
        originalPrice: 980,
        label: 'セール中',
        startsAt: '2026-01-07T22:30:00+09:00',
        endsAt: '2026-02-06T22:30:00+09:00',
      }

      // Type check passes if this compiles
      expect(activeSale.price).toBe(100)
      expect(activeSale.originalPrice).toBe(980)
      expect(activeSale.label).toBe('セール中')
      expect(activeSale.startsAt).toBe('2026-01-07T22:30:00+09:00')
      expect(activeSale.endsAt).toBe('2026-02-06T22:30:00+09:00')
    })
  })
})
