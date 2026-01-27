import { Logger } from '../ports/logger.js'
import { FileSystem } from '../ports/file-system.js'
import type {
  ProductSyncRepository,
  ProductInfo,
  SubscriptionInfo,
  AdminApiConfig,
  SyncProductsResult
} from '../../domain/ports/product-sync-repository.js'
import path from 'node:path'
import matter from 'gray-matter'

export type SyncProductsInput = {
  siteId: string
  contentsDir: string
  adminApiConfig: AdminApiConfig
}

/**
 * Use case for syncing products from MDX frontmatter to admin API
 */
export class SyncProductsUseCase {
  constructor(
    private readonly repository: ProductSyncRepository,
    private readonly fileSystem: FileSystem,
    private readonly logger: Logger
  ) {}

  async execute(input: SyncProductsInput): Promise<SyncProductsResult> {
    this.logger.info(`Extracting products from: ${input.contentsDir}`)

    const { products, subscription } = await this.extractProductsFromContents(input.contentsDir)

    if (products.length === 0 && !subscription) {
      this.logger.info('No products found in contents')
      return {
        products: { upserted: 0, archived: 0 },
        prices: { upserted: 0 },
        warnings: []
      }
    }

    this.logger.info(`Found ${products.length} product(s)${subscription ? ' and 1 subscription' : ''}`)

    const result = await this.repository.syncProducts(
      {
        siteId: input.siteId,
        products,
        subscription
      },
      input.adminApiConfig
    )

    this.logger.info(
      `Sync complete: ${result.products.upserted} products upserted, ${result.products.archived} archived`
    )

    if (result.warnings.length > 0) {
      for (const warning of result.warnings) {
        this.logger.warn(warning)
      }
    }

    return result
  }

  private async extractProductsFromContents(
    contentsDir: string
  ): Promise<{ products: ProductInfo[]; subscription?: SubscriptionInfo }> {
    const productMap = new Map<string, ProductInfo>()
    let subscription: SubscriptionInfo | undefined

    const mdFiles = await this.findMdxFiles(contentsDir)

    for (const filePath of mdFiles) {
      const content = await this.fileSystem.read(filePath)
      const { data: frontmatter } = matter(content)

      // Extract products from frontmatter
      if (Array.isArray(frontmatter.products)) {
        for (const product of frontmatter.products) {
          if (typeof product.id === 'string') {
            const productInfo: ProductInfo = {
              id: product.id
            }

            if (typeof product.price === 'number') {
              productInfo.price = product.price
            }
            if (typeof product.stripe_price_id === 'string') {
              productInfo.stripe_price_id = product.stripe_price_id
            }
            if (typeof product.description === 'string') {
              productInfo.description = product.description
            }
            if (product.sale) {
              productInfo.sale = {
                price: Number(product.sale.price),
                starts_at: String(product.sale.starts_at),
                ends_at: String(product.sale.ends_at)
              }
              if (typeof product.sale.label === 'string') {
                productInfo.sale.label = product.sale.label
              }
            }

            // Merge with existing product (later definitions override)
            const existing = productMap.get(product.id)
            productMap.set(product.id, { ...existing, ...productInfo })
          }
        }
      }

      // Extract subscription from frontmatter
      if (frontmatter.subscription && typeof frontmatter.subscription.id === 'string') {
        const sub: SubscriptionInfo = {
          id: frontmatter.subscription.id,
          name: frontmatter.subscription.name || frontmatter.subscription.id
        }

        if (typeof frontmatter.subscription.stripe_price_id === 'string') {
          sub.stripe_price_id = frontmatter.subscription.stripe_price_id
        }

        if (Array.isArray(frontmatter.subscription.prices)) {
          sub.prices = frontmatter.subscription.prices.map((p: Record<string, unknown>) => {
            const price: NonNullable<SubscriptionInfo['prices']>[number] = {
              billing_period: p.billing_period as 'monthly' | 'yearly',
              price: Number(p.price),
              stripe_price_id: String(p.stripe_price_id)
            }

            if (typeof p.label === 'string') {
              price.label = p.label
            }
            if (typeof p.badge === 'string') {
              price.badge = p.badge
            }
            if (p.sale && typeof p.sale === 'object') {
              const saleData = p.sale as Record<string, unknown>
              price.sale = {
                price: Number(saleData.price),
                starts_at: String(saleData.starts_at),
                ends_at: String(saleData.ends_at)
              }
              if (typeof saleData.label === 'string') {
                price.sale.label = saleData.label
              }
              if (typeof saleData.stripe_coupon_id === 'string') {
                price.sale.stripe_coupon_id = saleData.stripe_coupon_id
              }
            }

            return price
          })
        }

        subscription = sub
      }
    }

    return {
      products: Array.from(productMap.values()),
      subscription
    }
  }

  private async findMdxFiles(dir: string): Promise<string[]> {
    const results: string[] = []

    const entries = await this.fileSystem.readdir(dir)
    for (const entry of entries) {
      const fullPath = path.join(dir, entry)
      const stat = await this.fileSystem.stat(fullPath)

      if (stat.isDirectory()) {
        const nested = await this.findMdxFiles(fullPath)
        results.push(...nested)
      } else if (entry.endsWith('.md') || entry.endsWith('.mdx')) {
        results.push(fullPath)
      }
    }

    return results
  }
}
