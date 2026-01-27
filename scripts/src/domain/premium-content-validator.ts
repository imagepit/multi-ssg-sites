/**
 * Validation error for premium content extraction
 */
export interface ValidationError {
  type: 'uniqueness' | 'slug_invalid' | 'jsx_component'
  message: string
  file?: string
  sectionId?: string
  slug?: string
}

/**
 * Extracted premium section before validation
 */
export interface RawPremiumSection {
  file: string
  slug: string
  sectionId: string
  productId: string
  html: string
  jsxErrors?: string[]
}

/**
 * Validated premium section ready for upload
 */
export interface ValidatedPremiumSection {
  slug: string
  sectionId: string
  productId: string
  html: string
}

/**
 * Validation result
 */
export interface ValidationResult {
  sections: ValidatedPremiumSection[]
  errors: ValidationError[]
}

/**
 * Normalize a slug for consistent storage
 *
 * - Remove leading/trailing slashes
 * - Normalize path separators (backslash to forward slash)
 * - Remove .md/.mdx extensions
 *
 * @param slug - Raw slug from file path
 * @returns Normalized slug
 */
export function normalizeSlug(slug: string): string {
  let normalized = slug
    // Replace backslashes with forward slashes
    .replace(/\\/g, '/')
    // Remove leading slash
    .replace(/^\/+/, '')
    // Remove trailing slash
    .replace(/\/+$/, '')
    // Remove .md or .mdx extension
    .replace(/\.(mdx?|md)$/, '')
    // Collapse multiple slashes
    .replace(/\/+/g, '/')

  return normalized
}

/**
 * Validate a slug for security issues
 *
 * @param slug - Normalized slug to validate
 * @returns Array of error messages (empty if valid)
 */
export function validateSlug(slug: string): string[] {
  const errors: string[] = []

  // Check for path traversal
  if (slug.includes('..')) {
    errors.push('Slug contains path traversal sequence ".."')
  }

  // Check for double slashes
  if (slug.includes('//')) {
    errors.push('Slug contains double slashes "//"')
  }

  // Check for control characters
  // eslint-disable-next-line no-control-regex
  if (/[\x00-\x1f\x7f]/.test(slug)) {
    errors.push('Slug contains control characters')
  }

  // Check for empty slug
  if (!slug || slug.trim() === '') {
    errors.push('Slug is empty')
  }

  return errors
}

/**
 * Validate extracted premium sections
 *
 * Checks for:
 * 1. (slug, sectionId) uniqueness
 * 2. Valid slug format (no path traversal, control characters, etc.)
 * 3. JSX component errors from rendering
 *
 * @param sections - Raw sections to validate
 * @returns Validation result with valid sections and errors
 */
export function validatePremiumSections(sections: RawPremiumSection[]): ValidationResult {
  const errors: ValidationError[] = []
  const validSections: ValidatedPremiumSection[] = []
  const seenKeys = new Map<string, string>() // key -> file

  for (const section of sections) {
    const slug = normalizeSlug(section.slug)

    // Validate slug format
    const slugErrors = validateSlug(slug)
    if (slugErrors.length > 0) {
      for (const error of slugErrors) {
        errors.push({
          type: 'slug_invalid',
          message: error,
          file: section.file,
          slug: section.slug,
          sectionId: section.sectionId,
        })
      }
      continue
    }

    // Check for JSX component errors
    if (section.jsxErrors && section.jsxErrors.length > 0) {
      for (const error of section.jsxErrors) {
        errors.push({
          type: 'jsx_component',
          message: error,
          file: section.file,
          slug: slug,
          sectionId: section.sectionId,
        })
      }
      continue
    }

    // Check for uniqueness
    const key = `${slug}/${section.sectionId}`
    if (seenKeys.has(key)) {
      errors.push({
        type: 'uniqueness',
        message: `Duplicate (slug, sectionId) pair: "${slug}" + "${section.sectionId}" - first seen in "${seenKeys.get(key)}"`,
        file: section.file,
        slug: slug,
        sectionId: section.sectionId,
      })
      continue
    }

    seenKeys.set(key, section.file)

    validSections.push({
      slug,
      sectionId: section.sectionId,
      productId: section.productId,
      html: section.html,
    })
  }

  return { sections: validSections, errors }
}
