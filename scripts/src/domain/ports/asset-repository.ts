export type AssetSyncInput = {
  sourceDir: string
  bucket: string
  prefix: string
  endpoint: string
  accessKeyId: string
  secretAccessKey: string
  diffOnly: boolean
}

export interface AssetRepository {
  syncOptimizedImages(input: AssetSyncInput): Promise<void>
}
