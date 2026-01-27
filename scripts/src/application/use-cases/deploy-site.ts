import { CommandRunner } from '../ports/command-runner.js'
import { Logger } from '../ports/logger.js'
import { UseCaseError } from '../errors.js'
import { WorkspacePaths } from '../workspace-paths.js'
import { FileSystem } from '../ports/file-system.js'
import { SiteId } from '../../domain/value-objects/site-id.js'
import { ThemeId } from '../../domain/value-objects/theme-id.js'
import { BuildSiteUseCase } from './build-site.js'
import { SyncAssetsUseCase } from './sync-assets.js'
import { SyncSearchIndexesUseCase } from './sync-search-indexes.js'
import { ExtractPaidContentUseCase } from './extract-paid-content.js'
import { SyncPaidContentUseCase } from './sync-paid-content.js'
import { PaidContentStorageConfig } from '../../domain/ports/paid-content-repository.js'

export type DeploySiteInput = {
  siteId: SiteId
  themeId: ThemeId
  production: boolean
  branch?: string
  projectName?: string
  syncAssets: boolean
  syncSearchIndexes: boolean
  searchIndexBaseUrl?: string
  syncPaidContent?: boolean
  contentsDir?: string
  r2Config?: {
    bucket: string
    endpoint: string
    accessKeyId: string
    secretAccessKey: string
    prefix: string
    diffOnly: boolean
  }
  searchIndexConfig?: {
    bucket: string
    endpoint: string
    accessKeyId: string
    secretAccessKey: string
    prefix: string
    diffOnly: boolean
  }
  paidContentConfig?: PaidContentStorageConfig
}

export class DeploySiteUseCase {
  constructor(
    private readonly runner: CommandRunner,
    private readonly logger: Logger,
    private readonly fileSystem: FileSystem,
    private readonly paths: WorkspacePaths,
    private readonly buildSite: BuildSiteUseCase,
    private readonly syncAssetsUseCase: SyncAssetsUseCase,
    private readonly syncSearchIndexesUseCase: SyncSearchIndexesUseCase,
    private readonly extractPaidContentUseCase: ExtractPaidContentUseCase,
    private readonly syncPaidContentUseCase: SyncPaidContentUseCase
  ) {}

  async execute(input: DeploySiteInput): Promise<void> {
    const projectName = input.projectName ?? input.siteId.toString()
    const siteOrigin = input.production
      ? `https://${projectName}.pages.dev`
      : `https://${input.branch ?? 'preview'}.${projectName}.pages.dev`

    const publicEnv: Record<string, string> = {
      NEXT_PUBLIC_SITE_ORIGIN: siteOrigin
    }
    if (input.searchIndexBaseUrl) {
      publicEnv.NEXT_PUBLIC_SEARCH_INDEX_BASE_URL = input.searchIndexBaseUrl
    }

    await this.buildSite.execute({
      siteId: input.siteId,
      themeId: input.themeId,
      publicEnv
    })

    if (input.syncAssets && !input.r2Config) {
      throw new UseCaseError('R2 configuration is required when asset sync is enabled')
    }

    if (input.syncAssets && input.r2Config) {
      const assetsDir = this.paths.optimizedImagesDir(input.themeId)
      await this.syncAssetsUseCase.execute({
        sourceDir: assetsDir,
        bucket: input.r2Config.bucket,
        endpoint: input.r2Config.endpoint,
        accessKeyId: input.r2Config.accessKeyId,
        secretAccessKey: input.r2Config.secretAccessKey,
        prefix: input.r2Config.prefix,
        diffOnly: input.r2Config.diffOnly
      })
    }

    if (input.syncSearchIndexes && !input.searchIndexConfig) {
      throw new UseCaseError('search index configuration is required when sync is enabled')
    }

    if (input.syncSearchIndexes && input.searchIndexConfig) {
      const searchIndexesDir = this.paths.searchIndexesDir(input.themeId)
      await this.syncSearchIndexesUseCase.execute({
        sourceDir: searchIndexesDir,
        bucket: input.searchIndexConfig.bucket,
        endpoint: input.searchIndexConfig.endpoint,
        accessKeyId: input.searchIndexConfig.accessKeyId,
        secretAccessKey: input.searchIndexConfig.secretAccessKey,
        prefix: input.searchIndexConfig.prefix,
        diffOnly: input.searchIndexConfig.diffOnly
      })
      await this.fileSystem.remove(searchIndexesDir)
    }

    // Sync paid content to R2
    if (input.syncPaidContent) {
      if (!input.paidContentConfig) {
        throw new UseCaseError('paid content configuration is required when sync is enabled')
      }
      if (!input.contentsDir) {
        throw new UseCaseError('contents directory is required when paid content sync is enabled')
      }

      // Extract premium sections from MDX files
      const extractResult = await this.extractPaidContentUseCase.execute({
        siteId: input.siteId.toString(),
        contentsDir: input.contentsDir,
      })

      // Fail if there are validation errors
      if (extractResult.errors.length > 0) {
        throw new UseCaseError(
          `Paid content extraction failed with ${extractResult.errors.length} error(s)`
        )
      }

      // Upload to R2
      if (extractResult.sections.length > 0) {
        await this.syncPaidContentUseCase.execute({
          siteId: input.siteId.toString(),
          sections: extractResult.sections,
          storage: input.paidContentConfig,
        })
      }
    }

    const outputDir = this.paths.themeOutputDir(input.themeId)
    const args = ['pages', 'deploy', outputDir, '--project-name', projectName]

    if (!input.production) {
      const branch = input.branch ?? 'preview'
      args.push('--branch', branch)
    }

    this.logger.info(`Deploying Pages project: ${projectName}`)
    await this.runner.run('wrangler', args, { stdio: 'inherit' })
  }
}
