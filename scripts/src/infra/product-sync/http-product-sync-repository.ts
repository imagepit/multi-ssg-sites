import type {
  ProductSyncRepository,
  SyncProductsPayload,
  SyncProductsResult,
  AdminApiConfig
} from '../../domain/ports/product-sync-repository.js'

/**
 * HTTP implementation of ProductSyncRepository
 * Calls the admin API to sync products
 */
export class HttpProductSyncRepository implements ProductSyncRepository {
  async syncProducts(
    payload: SyncProductsPayload,
    config: AdminApiConfig
  ): Promise<SyncProductsResult> {
    const url = `${config.baseUrl.replace(/\/$/, '')}/admin/sync/products`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Api-Key': config.apiKey
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error(`Failed to sync products: ${response.status} ${text}`)
    }

    return response.json() as Promise<SyncProductsResult>
  }
}
