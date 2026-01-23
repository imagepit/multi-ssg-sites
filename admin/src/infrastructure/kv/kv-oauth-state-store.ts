import type {
  OAuthStateStore as OAuthStateStoreForStart,
  OAuthStateData,
} from '../../application/x-promotion/start-x-oauth-flow.js'
import type { OAuthStateStore as OAuthStateStoreForComplete } from '../../application/x-promotion/complete-x-oauth.js'

/**
 * Combined OAuth state store interface
 */
export interface OAuthStateStore extends OAuthStateStoreForStart, OAuthStateStoreForComplete {}

/**
 * KV-based OAuth state store implementation
 */
export class KVOAuthStateStore implements OAuthStateStore {
  private readonly keyPrefix = 'x_oauth_state:'

  constructor(private readonly kv: KVNamespace) {}

  async set(key: string, value: OAuthStateData, ttlSeconds: number): Promise<void> {
    await this.kv.put(
      this.keyPrefix + key,
      JSON.stringify(value),
      { expirationTtl: ttlSeconds }
    )
  }

  async get(key: string): Promise<OAuthStateData | null> {
    const data = await this.kv.get(this.keyPrefix + key)
    if (!data) {
      return null
    }
    return JSON.parse(data) as OAuthStateData
  }

  async delete(key: string): Promise<void> {
    await this.kv.delete(this.keyPrefix + key)
  }
}
