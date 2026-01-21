/**
 * PremiumSection - Domain model for paid content sections
 *
 * Represents a premium content section extracted from MDX during build time.
 * The section will be stored in R2 and replaced with a placeholder in the SSG output.
 */

export interface PremiumSection {
  /** Unique section identifier within the page (e.g., "section-1") */
  sectionId: string
  /** Product ID for access control (e.g., "product:course-dx-intro") */
  productId: string
  /** Rendered HTML content of the premium section */
  html: string
}

export interface PremiumPlaceholder {
  /** Unique section identifier matching the PremiumSection */
  sectionId: string
  /** Product ID for access control */
  productId: string
}

export interface PremiumExtractionResult {
  /** Premium sections extracted from the document */
  sections: PremiumSection[]
  /** Metadata for placeholders inserted into the document */
  placeholders: PremiumPlaceholder[]
}

/**
 * Creates a new PremiumSection with validation
 * @throws Error if sectionId or productId is empty
 */
export function createPremiumSection(params: {
  sectionId: string
  productId: string
  html: string
}): PremiumSection {
  const { sectionId, productId, html } = params

  if (!sectionId || sectionId.trim() === '') {
    throw new Error('sectionId is required')
  }
  if (!productId || productId.trim() === '') {
    throw new Error('productId is required')
  }

  return {
    sectionId: sectionId.trim(),
    productId: productId.trim(),
    html,
  }
}

/**
 * Creates a placeholder metadata object
 */
export function createPremiumPlaceholder(params: {
  sectionId: string
  productId: string
}): PremiumPlaceholder {
  const { sectionId, productId } = params

  if (!sectionId || sectionId.trim() === '') {
    throw new Error('sectionId is required')
  }
  if (!productId || productId.trim() === '') {
    throw new Error('productId is required')
  }

  return {
    sectionId: sectionId.trim(),
    productId: productId.trim(),
  }
}
