/**
 * Sale domain module
 *
 * Handles sale period validation and price calculation for time-limited discounts.
 */

/**
 * Sale configuration from frontmatter/spec.json
 */
export interface SaleConfig {
  /** Sale price */
  price: number
  /** Sale start time (ISO 8601) */
  startsAt: string
  /** Sale end time (ISO 8601) */
  endsAt: string
  /** Sale label (default: "セール中") */
  label?: string
}

/**
 * Active sale information for display
 */
export interface ActiveSale {
  /** Sale price */
  price: number
  /** Original price before discount */
  originalPrice: number
  /** Sale label */
  label: string
  /** Sale start time (ISO 8601) */
  startsAt: string
  /** Sale end time (ISO 8601) */
  endsAt: string
}

/**
 * Price information with sale status
 */
export interface PriceInfo {
  /** Current effective price */
  currentPrice: number
  /** Original price (same as currentPrice if not on sale) */
  originalPrice: number
  /** Whether the product is currently on sale */
  isOnSale: boolean
  /** Active sale information (only present when on sale) */
  sale?: ActiveSale
}

/** Default sale label */
const DEFAULT_SALE_LABEL = 'セール中'

/**
 * Check if a sale is currently active
 *
 * @param sale - Sale configuration
 * @param now - Current time (defaults to now)
 * @returns true if the sale is active
 */
export function isOnSale(sale: SaleConfig, now: Date = new Date()): boolean {
  const startsAt = new Date(sale.startsAt)
  const endsAt = new Date(sale.endsAt)

  return now >= startsAt && now <= endsAt
}

/**
 * Get price information including sale status
 *
 * @param originalPrice - Original product price
 * @param sale - Sale configuration (optional)
 * @param now - Current time (defaults to now)
 * @returns Price information with sale status
 */
export function getPriceInfo(
  originalPrice: number,
  sale?: SaleConfig,
  now: Date = new Date()
): PriceInfo {
  if (!sale) {
    return {
      currentPrice: originalPrice,
      originalPrice,
      isOnSale: false,
      sale: undefined,
    }
  }

  const saleActive = isOnSale(sale, now)

  if (!saleActive) {
    return {
      currentPrice: originalPrice,
      originalPrice,
      isOnSale: false,
      sale: undefined,
    }
  }

  return {
    currentPrice: sale.price,
    originalPrice,
    isOnSale: true,
    sale: {
      price: sale.price,
      originalPrice,
      label: sale.label ?? DEFAULT_SALE_LABEL,
      startsAt: sale.startsAt,
      endsAt: sale.endsAt,
    },
  }
}

/**
 * Frontmatter sale config with snake_case keys
 */
export interface FrontmatterSaleConfig {
  price: number
  starts_at: string
  ends_at: string
  label?: string
}

/**
 * Parse sale config from frontmatter (snake_case to camelCase)
 *
 * @param sale - Sale config from frontmatter
 * @returns Parsed sale config or undefined
 */
export function parseSaleConfig(
  sale: FrontmatterSaleConfig | undefined
): SaleConfig | undefined {
  if (!sale) {
    return undefined
  }

  return {
    price: sale.price,
    startsAt: sale.starts_at,
    endsAt: sale.ends_at,
    label: sale.label,
  }
}
