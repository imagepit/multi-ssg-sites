import { Logger } from '../ports/logger.js'
import { FileSystem } from '../ports/file-system.js'
import * as path from 'path'
import * as fs from 'fs'
import matter from 'gray-matter'

export type CollectedProduct = {
  id: string
  name: string
  x_promotion?: {
    tweet_id: string
    label?: string
    starts_at?: string
    ends_at?: string
  }
}

export type CollectProductsInput = {
  /** Site identifier */
  siteId: string
  /** Contents directory path */
  contentsDir: string
}

export type CollectProductsResult = {
  /** Unique products collected from all pages */
  products: CollectedProduct[]
  /** Number of pages scanned */
  pagesScanned: number
}

/**
 * Use case for collecting products from MDX frontmatter
 *
 * Scans all MDX files in the contents directory and extracts
 * unique products with their configurations.
 */
export class CollectProductsUseCase {
  constructor(
    private readonly fileSystem: FileSystem,
    private readonly logger: Logger
  ) {}

  async execute(input: CollectProductsInput): Promise<CollectProductsResult> {
    this.logger.info(`Collecting products from: ${input.contentsDir}`)

    const mdxFiles = await this.findMdxFiles(input.contentsDir)
    const productMap = new Map<string, CollectedProduct>()

    for (const filePath of mdxFiles) {
      const products = await this.extractProductsFromFile(filePath)
      for (const product of products) {
        // Use the latest definition if product appears multiple times
        productMap.set(product.id, product)
      }
    }

    const products = Array.from(productMap.values())

    this.logger.info(
      `Collected ${products.length} unique product(s) from ${mdxFiles.length} page(s)`
    )

    return {
      products,
      pagesScanned: mdxFiles.length,
    }
  }

  private async findMdxFiles(dir: string): Promise<string[]> {
    const results: string[] = []

    const entries = await fs.promises.readdir(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        const subFiles = await this.findMdxFiles(fullPath)
        results.push(...subFiles)
      } else if (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) {
        results.push(fullPath)
      }
    }

    return results
  }

  private async extractProductsFromFile(
    filePath: string
  ): Promise<CollectedProduct[]> {
    try {
      const content = await fs.promises.readFile(filePath, 'utf-8')
      const { data: frontmatter } = matter(content)

      if (!frontmatter.products || !Array.isArray(frontmatter.products)) {
        return []
      }

      return frontmatter.products
        .filter((p: any) => p && typeof p.id === 'string')
        .map((p: any) => {
          const product: CollectedProduct = {
            id: p.id,
            name: p.name || p.id,
          }

          if (p.x_promotion?.tweet_id) {
            product.x_promotion = {
              tweet_id: p.x_promotion.tweet_id,
              label: p.x_promotion.label,
              starts_at: p.x_promotion.starts_at,
              ends_at: p.x_promotion.ends_at,
            }
          }

          return product
        })
    } catch (error) {
      // Skip files that can't be read
      return []
    }
  }
}
