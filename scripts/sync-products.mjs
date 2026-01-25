import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'

/**
 * Sync products from MDX frontmatter and spec.json to Admin API
 *
 * Usage:
 *   ADMIN_APP_BASE_URL=http://localhost:8787 \
 *   ADMIN_API_KEY=test-key \
 *   node scripts/sync-products.mjs --site-id dx-media
 */

async function main() {
  const siteId = getArgValue('--site-id') || process.env.SITE_ID
  if (!siteId) {
    throw new Error('SITE_ID or --site-id is required')
  }

  const repoRoot = process.cwd()
  const siteRoot = process.env.SITE_ROOT || path.join(repoRoot, 'contents', siteId)
  const contentDir = path.join(siteRoot, 'contents')
  const spec = await readSpec(path.join(siteRoot, 'specs', 'spec.json'))

  // Collect products from MDX files
  const products = await collectProducts(contentDir)

  // Get subscription from spec.json
  const subscription = extractSubscription(spec)

  const payload = {
    siteId,
    products,
    subscription
  }

  const adminApiKey = process.env.ADMIN_API_KEY
  if (!adminApiKey) {
    throw new Error('ADMIN_API_KEY is required')
  }

  const syncUrl = process.env.SYNC_URL || buildSyncUrl(process.env.ADMIN_APP_BASE_URL)
  if (!syncUrl) {
    throw new Error('SYNC_URL or ADMIN_APP_BASE_URL is required')
  }

  console.log(`Syncing products for site: ${siteId}`)
  console.log(`  - Single products: ${products.length}`)
  console.log(`  - Subscription: ${subscription ? subscription.name : 'none'}`)

  const response = await fetch(syncUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Api-Key': adminApiKey
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Sync failed: ${response.status} ${text}`)
  }

  const result = await response.json()
  console.log('Sync result:', JSON.stringify(result, null, 2))

  // Output warnings
  if (result.warnings && result.warnings.length > 0) {
    console.warn('Warnings:')
    for (const warning of result.warnings) {
      console.warn(`  - ${warning}`)
    }
  }
}

function getArgValue(name) {
  const index = process.argv.indexOf(name)
  if (index === -1) {
    return null
  }
  return process.argv[index + 1] || null
}

function buildSyncUrl(base) {
  if (!base) {
    return null
  }
  const normalized = base.endsWith('/') ? base.slice(0, -1) : base
  return `${normalized}/admin/sync/products`
}

async function readSpec(filePath) {
  try {
    const raw = await fs.readFile(filePath, 'utf8')
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

async function collectFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(fullPath)))
    } else if (entry.isFile() && (entry.name.endsWith('.md') || entry.name.endsWith('.mdx'))) {
      files.push(fullPath)
    }
  }
  return files
}

async function collectProducts(contentDir) {
  const files = await collectFiles(contentDir)
  const products = new Map() // Use Map to deduplicate by product ID

  for (const file of files) {
    const raw = await fs.readFile(file, 'utf8')
    const { data: frontmatter } = matter(raw)

    // Only process paid content
    if (!frontmatter.paid || !frontmatter.products) {
      continue
    }

    if (!Array.isArray(frontmatter.products)) {
      console.warn(`Skipping ${file}: products should be an array`)
      continue
    }

    for (const product of frontmatter.products) {
      if (!product.id) {
        console.warn(`Skipping product in ${file}: missing id`)
        continue
      }

      // Deduplicate by product ID (later definitions override earlier ones)
      const normalized = normalizeProduct(product)
      if (normalized) {
        products.set(product.id, normalized)
      }
    }
  }

  return Array.from(products.values())
}

function normalizeProduct(product) {
  if (!product || typeof product !== 'object') {
    return null
  }

  const result = {
    id: String(product.id)
  }

  if (typeof product.price === 'number') {
    result.price = product.price
  }

  if (typeof product.stripe_price_id === 'string') {
    result.stripe_price_id = product.stripe_price_id
  }

  if (typeof product.description === 'string') {
    result.description = product.description
  }

  if (product.sale && typeof product.sale === 'object') {
    const sale = {
      price: Number(product.sale.price),
      starts_at: String(product.sale.starts_at),
      ends_at: String(product.sale.ends_at)
    }
    if (typeof product.sale.label === 'string') {
      sale.label = product.sale.label
    }
    result.sale = sale
  }

  return result
}

function extractSubscription(spec) {
  if (!spec.subscription) {
    return undefined
  }

  const sub = spec.subscription
  if (!sub.id || !sub.name) {
    console.warn('Subscription in spec.json requires id and name')
    return undefined
  }

  const result = {
    id: String(sub.id),
    name: String(sub.name)
  }

  if (typeof sub.stripe_price_id === 'string') {
    result.stripe_price_id = sub.stripe_price_id
  }

  if (Array.isArray(sub.prices)) {
    result.prices = sub.prices
      .filter((p) => p && typeof p === 'object')
      .map((price) => {
        const normalized = {
          billing_period: String(price.billing_period),
          price: Number(price.price),
          stripe_price_id: String(price.stripe_price_id)
        }

        if (typeof price.label === 'string') {
          normalized.label = price.label
        }
        if (typeof price.badge === 'string') {
          normalized.badge = price.badge
        }
        if (price.sale && typeof price.sale === 'object') {
          normalized.sale = {
            price: Number(price.sale.price),
            starts_at: String(price.sale.starts_at),
            ends_at: String(price.sale.ends_at)
          }
          if (typeof price.sale.label === 'string') {
            normalized.sale.label = price.sale.label
          }
          if (typeof price.sale.stripe_coupon_id === 'string') {
            normalized.sale.stripe_coupon_id = price.sale.stripe_coupon_id
          }
        }

        return normalized
      })
  }

  return result
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
