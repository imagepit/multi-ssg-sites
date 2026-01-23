import { Logger } from '../ports/logger.js'

export type ProductInput = {
  id: string
  name: string
  x_promotion?: {
    tweet_id: string
    label?: string
    starts_at?: string
    ends_at?: string
  }
}

export type SyncProductsInput = {
  /** Site identifier (e.g., "dx-media") */
  siteId: string
  /** Array of products to sync */
  products: ProductInput[]
  /** Admin API configuration */
  adminApi: {
    baseUrl: string
    apiKey: string
  }
}

export type SyncProductsResult = {
  /** Number of campaigns upserted */
  campaignsUpserted: number
}

/**
 * Use case for syncing products to admin API
 *
 * This use case is called during deploy to sync X promotion campaigns
 * from frontmatter to the admin database.
 */
export class SyncProductsUseCase {
  constructor(private readonly logger: Logger) {}

  async execute(input: SyncProductsInput): Promise<SyncProductsResult> {
    // Filter products that have x_promotion config
    const productsWithPromotion = input.products.filter(
      (p) => p.x_promotion?.tweet_id
    )

    if (productsWithPromotion.length === 0) {
      this.logger.info('No products with X promotion to sync')
      return { campaignsUpserted: 0 }
    }

    this.logger.info(
      `Syncing ${productsWithPromotion.length} product(s) with X promotion for site: ${input.siteId}`
    )

    const response = await fetch(`${input.adminApi.baseUrl}/api/products/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Api-Key': input.adminApi.apiKey,
      },
      body: JSON.stringify({
        siteId: input.siteId,
        products: productsWithPromotion,
      }),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      throw new Error(`Failed to sync products: ${response.status} ${errorBody}`)
    }

    const result = (await response.json()) as {
      campaigns: { upserted: number }
    }

    this.logger.info(
      `Successfully synced ${result.campaigns.upserted} X promotion campaign(s)`
    )

    return {
      campaignsUpserted: result.campaigns.upserted,
    }
  }
}
