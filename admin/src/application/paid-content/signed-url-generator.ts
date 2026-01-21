export interface SignedUrlGenerator {
  generateSignedUrl(key: string, expiresInSeconds?: number): Promise<string>
}
