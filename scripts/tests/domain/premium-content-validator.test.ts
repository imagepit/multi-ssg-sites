import { describe, it, expect } from 'vitest'
import {
  normalizeSlug,
  validateSlug,
  validatePremiumSections,
  type RawPremiumSection,
} from '../../src/domain/premium-content-validator.js'

describe('normalizeSlug', () => {
  it('removes leading slash', () => {
    expect(normalizeSlug('/foo/bar')).toBe('foo/bar')
  })

  it('removes trailing slash', () => {
    expect(normalizeSlug('foo/bar/')).toBe('foo/bar')
  })

  it('removes .md extension', () => {
    expect(normalizeSlug('foo/bar.md')).toBe('foo/bar')
  })

  it('removes .mdx extension', () => {
    expect(normalizeSlug('foo/bar.mdx')).toBe('foo/bar')
  })

  it('normalizes backslashes to forward slashes', () => {
    expect(normalizeSlug('foo\\bar\\baz')).toBe('foo/bar/baz')
  })

  it('collapses multiple slashes', () => {
    expect(normalizeSlug('foo//bar///baz')).toBe('foo/bar/baz')
  })

  it('handles complex path', () => {
    expect(normalizeSlug('/courses/dx-intro/chapter-1.mdx/')).toBe(
      'courses/dx-intro/chapter-1'
    )
  })
})

describe('validateSlug', () => {
  it('returns no errors for valid slug', () => {
    expect(validateSlug('courses/dx-intro/chapter-1')).toEqual([])
  })

  it('rejects path traversal', () => {
    const errors = validateSlug('courses/../secrets/config')
    expect(errors).toContain('Slug contains path traversal sequence ".."')
  })

  it('rejects double slashes', () => {
    const errors = validateSlug('courses//chapter')
    expect(errors).toContain('Slug contains double slashes "//"')
  })

  it('rejects control characters', () => {
    const errors = validateSlug('courses\x00chapter')
    expect(errors).toContain('Slug contains control characters')
  })

  it('rejects empty slug', () => {
    const errors = validateSlug('')
    expect(errors).toContain('Slug is empty')
  })

  it('rejects whitespace-only slug', () => {
    const errors = validateSlug('   ')
    expect(errors).toContain('Slug is empty')
  })
})

describe('validatePremiumSections', () => {
  it('validates valid sections', () => {
    const sections: RawPremiumSection[] = [
      {
        file: 'course/intro.mdx',
        slug: 'course/intro',
        sectionId: 'section-1',
        productId: 'product:course-dx',
        html: '<p>Premium content</p>',
      },
      {
        file: 'course/chapter-1.mdx',
        slug: 'course/chapter-1',
        sectionId: 'section-1',
        productId: 'product:course-dx',
        html: '<p>More premium content</p>',
      },
    ]

    const result = validatePremiumSections(sections)

    expect(result.errors).toHaveLength(0)
    expect(result.sections).toHaveLength(2)
  })

  it('detects duplicate (slug, sectionId) pairs', () => {
    const sections: RawPremiumSection[] = [
      {
        file: 'course/intro.mdx',
        slug: 'course/intro',
        sectionId: 'section-1',
        productId: 'product:course-dx',
        html: '<p>First</p>',
      },
      {
        file: 'course/intro-copy.mdx',
        slug: 'course/intro',
        sectionId: 'section-1',
        productId: 'product:course-dx',
        html: '<p>Duplicate</p>',
      },
    ]

    const result = validatePremiumSections(sections)

    expect(result.errors).toHaveLength(1)
    expect(result.errors[0].type).toBe('uniqueness')
    expect(result.sections).toHaveLength(1)
  })

  it('allows same sectionId in different slugs', () => {
    const sections: RawPremiumSection[] = [
      {
        file: 'course/intro.mdx',
        slug: 'course/intro',
        sectionId: 'section-1',
        productId: 'product:course-dx',
        html: '<p>First</p>',
      },
      {
        file: 'course/chapter-1.mdx',
        slug: 'course/chapter-1',
        sectionId: 'section-1',
        productId: 'product:course-dx',
        html: '<p>Second</p>',
      },
    ]

    const result = validatePremiumSections(sections)

    expect(result.errors).toHaveLength(0)
    expect(result.sections).toHaveLength(2)
  })

  it('reports JSX component errors', () => {
    const sections: RawPremiumSection[] = [
      {
        file: 'course/intro.mdx',
        slug: 'course/intro',
        sectionId: 'section-1',
        productId: 'product:course-dx',
        html: '<p>Content</p>',
        jsxErrors: ['JSX components are not allowed: CustomComponent'],
      },
    ]

    const result = validatePremiumSections(sections)

    expect(result.errors).toHaveLength(1)
    expect(result.errors[0].type).toBe('jsx_component')
    expect(result.sections).toHaveLength(0)
  })

  it('reports invalid slug errors', () => {
    const sections: RawPremiumSection[] = [
      {
        file: 'course/../secrets.mdx',
        slug: 'course/../secrets',
        sectionId: 'section-1',
        productId: 'product:course-dx',
        html: '<p>Content</p>',
      },
    ]

    const result = validatePremiumSections(sections)

    expect(result.errors).toHaveLength(1)
    expect(result.errors[0].type).toBe('slug_invalid')
    expect(result.sections).toHaveLength(0)
  })

  it('normalizes slugs during validation', () => {
    const sections: RawPremiumSection[] = [
      {
        file: '/course/intro.mdx',
        slug: '/course/intro.mdx',
        sectionId: 'section-1',
        productId: 'product:course-dx',
        html: '<p>Content</p>',
      },
    ]

    const result = validatePremiumSections(sections)

    expect(result.errors).toHaveLength(0)
    expect(result.sections).toHaveLength(1)
    expect(result.sections[0].slug).toBe('course/intro')
  })
})
