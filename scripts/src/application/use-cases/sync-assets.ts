import { UseCaseError } from '../errors.js'
import { FileSystem } from '../ports/file-system.js'
import { Logger } from '../ports/logger.js'
import { AssetRepository } from '../../domain/ports/asset-repository.js'

export type SyncAssetsInput = {
  sourceDir: string
  bucket: string
  prefix: string
  endpoint: string
  accessKeyId: string
  secretAccessKey: string
  diffOnly: boolean
}

export class SyncAssetsUseCase {
  constructor(
    private readonly assets: AssetRepository,
    private readonly fileSystem: FileSystem,
    private readonly logger: Logger
  ) {}

  async execute(input: SyncAssetsInput): Promise<void> {
    const exists = await this.fileSystem.exists(input.sourceDir)
    if (!exists) {
      throw new UseCaseError(`assets directory not found: ${input.sourceDir}`)
    }

    this.logger.info(`Syncing assets to R2: ${input.bucket}/${input.prefix}`)
    await this.assets.syncOptimizedImages({
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
