import { UseCaseError } from '../errors.js'
import { FileSystem } from '../ports/file-system.js'
import { Logger } from '../ports/logger.js'
import { SearchIndexRepository } from '../../domain/ports/search-index-repository.js'

export type SyncSearchIndexesInput = {
  sourceDir: string
  bucket: string
  prefix: string
  endpoint: string
  accessKeyId: string
  secretAccessKey: string
  diffOnly: boolean
}

export class SyncSearchIndexesUseCase {
  constructor(
    private readonly repository: SearchIndexRepository,
    private readonly fileSystem: FileSystem,
    private readonly logger: Logger
  ) {}

  async execute(input: SyncSearchIndexesInput): Promise<void> {
    const exists = await this.fileSystem.exists(input.sourceDir)
    if (!exists) {
      throw new UseCaseError(`search indexes directory not found: ${input.sourceDir}`)
    }

    this.logger.info(`Syncing search indexes to R2: ${input.bucket}/${input.prefix}`)
    await this.repository.syncSearchIndexes({
      sourceDir: input.sourceDir,
      bucket: input.bucket,
      prefix: input.prefix,
      endpoint: input.endpoint,
      accessKeyId: input.accessKeyId,
      secretAccessKey: input.secretAccessKey,
      diffOnly: input.diffOnly
    })
  }
}
