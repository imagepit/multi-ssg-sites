export type SearchIndexSyncInput = {
  sourceDir: string
  bucket: string
  prefix: string
  endpoint: string
  accessKeyId: string
  secretAccessKey: string
  diffOnly: boolean
}

export interface SearchIndexRepository {
  syncSearchIndexes(input: SearchIndexSyncInput): Promise<void>
}
