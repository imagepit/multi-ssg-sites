import type { SignedUrlGenerator } from '../../application/paid-content/signed-url-generator.js'

const DEFAULT_EXPIRES_IN_SECONDS = 300 // 5 minutes

export class R2SignedUrlGenerator implements SignedUrlGenerator {
  constructor(
    private readonly bucket: R2Bucket,
    private readonly bucketPublicUrl: string
  ) {}

  async generateSignedUrl(
    key: string,
    expiresInSeconds: number = DEFAULT_EXPIRES_IN_SECONDS
  ): Promise<string> {
    // R2 does not natively support presigned URLs in Workers
    // We use a workaround: generate a temporary access token and include it in the URL
    // The actual implementation depends on your R2 setup

    // For now, we generate a signed URL using the bucket's public URL
    // In production, you might want to use Cloudflare Access or a custom signing mechanism

    const expiresAt = Date.now() + expiresInSeconds * 1000
    const token = await this.generateToken(key, expiresAt)

    const url = new URL(`${this.bucketPublicUrl}/${key}`)
    url.searchParams.set('token', token)
    url.searchParams.set('expires', expiresAt.toString())

    return url.toString()
  }

  async checkExists(key: string): Promise<boolean> {
    const object = await this.bucket.head(key)
    return object !== null
  }

  private async generateToken(key: string, expiresAt: number): Promise<string> {
    // Simple HMAC-based token generation
    // In production, use a proper signing mechanism
    const data = `${key}:${expiresAt}`
    const encoder = new TextEncoder()

    // Use a simple hash for demo purposes
    // In production, use HMAC with a secret key
    const hashBuffer = await crypto.subtle.digest(
      'SHA-256',
      encoder.encode(data)
    )

    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    return hashHex.slice(0, 32)
  }
}

// Factory function to create a content existence checker
export function createContentExistsChecker(bucket: R2Bucket) {
  return async (key: string): Promise<boolean> => {
    const object = await bucket.head(key)
    return object !== null
  }
}
