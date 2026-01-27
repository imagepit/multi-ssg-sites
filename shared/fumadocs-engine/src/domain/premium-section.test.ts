import { describe, it, expect } from 'vitest'
import {
  createPremiumSection,
  createPremiumPlaceholder,
  type PremiumSection,
  type PremiumPlaceholder,
} from './premium-section.ts'

describe('PremiumSection', () => {
  describe('createPremiumSection', () => {
    it('creates a valid PremiumSection', () => {
      const section = createPremiumSection({
        sectionId: 'section-1',
        productId: 'product:course-dx-intro',
        html: '<h2>Premium Content</h2><p>This is paid content.</p>',
      })

      expect(section).toEqual({
        sectionId: 'section-1',
        productId: 'product:course-dx-intro',
        html: '<h2>Premium Content</h2><p>This is paid content.</p>',
      })
    })

    it('trims whitespace from sectionId and productId', () => {
      const section = createPremiumSection({
        sectionId: '  section-1  ',
        productId: '  product:course-dx-intro  ',
        html: '<p>Content</p>',
      })

      expect(section.sectionId).toBe('section-1')
      expect(section.productId).toBe('product:course-dx-intro')
    })

    it('allows empty html content', () => {
      const section = createPremiumSection({
        sectionId: 'section-1',
        productId: 'product:course-dx-intro',
        html: '',
      })

      expect(section.html).toBe('')
    })

    it('throws error when sectionId is empty', () => {
      expect(() =>
        createPremiumSection({
          sectionId: '',
          productId: 'product:course-dx-intro',
          html: '<p>Content</p>',
        })
      ).toThrow('sectionId is required')
    })

    it('throws error when sectionId is whitespace only', () => {
      expect(() =>
        createPremiumSection({
          sectionId: '   ',
          productId: 'product:course-dx-intro',
          html: '<p>Content</p>',
        })
      ).toThrow('sectionId is required')
    })

    it('throws error when productId is empty', () => {
      expect(() =>
        createPremiumSection({
          sectionId: 'section-1',
          productId: '',
          html: '<p>Content</p>',
        })
      ).toThrow('productId is required')
    })

    it('throws error when productId is whitespace only', () => {
      expect(() =>
        createPremiumSection({
          sectionId: 'section-1',
          productId: '   ',
          html: '<p>Content</p>',
        })
      ).toThrow('productId is required')
    })
  })

  describe('createPremiumPlaceholder', () => {
    it('creates a valid PremiumPlaceholder', () => {
      const placeholder = createPremiumPlaceholder({
        sectionId: 'section-1',
        productId: 'product:course-dx-intro',
      })

      expect(placeholder).toEqual({
        sectionId: 'section-1',
        productId: 'product:course-dx-intro',
      })
    })

    it('trims whitespace from sectionId and productId', () => {
      const placeholder = createPremiumPlaceholder({
        sectionId: '  section-1  ',
        productId: '  product:course-dx-intro  ',
      })

      expect(placeholder.sectionId).toBe('section-1')
      expect(placeholder.productId).toBe('product:course-dx-intro')
    })

    it('throws error when sectionId is empty', () => {
      expect(() =>
        createPremiumPlaceholder({
          sectionId: '',
          productId: 'product:course-dx-intro',
        })
      ).toThrow('sectionId is required')
    })

    it('throws error when productId is empty', () => {
      expect(() =>
        createPremiumPlaceholder({
          sectionId: 'section-1',
          productId: '',
        })
      ).toThrow('productId is required')
    })
  })

  describe('type definitions', () => {
    it('PremiumSection has correct shape', () => {
      const section: PremiumSection = {
        sectionId: 'section-1',
        productId: 'product:course-dx-intro',
        html: '<p>Content</p>',
      }

      expect(section).toBeDefined()
    })

    it('PremiumPlaceholder has correct shape', () => {
      const placeholder: PremiumPlaceholder = {
        sectionId: 'section-1',
        productId: 'product:course-dx-intro',
      }

      expect(placeholder).toBeDefined()
    })
  })
})
