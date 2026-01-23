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
import { CollectProductsUseCase } from './collect-products.js'
import { SyncProductsUseCase } from './sync-products.js'

export type DeploySiteInput = {
  siteId: SiteId
  themeId: ThemeId
  production: boolean
  branch?: string
  projectName?: string
  syncAssets: boolean
  syncSearchIndexes: boolean
  syncProducts: boolean
  searchIndexBaseUrl?: string
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
  adminApiConfig?: {
    baseUrl: string
    apiKey: string
  }
}

export class DeploySiteUseCase {
  private readonly collectProducts: CollectProductsUseCase
  private readonly syncProducts: SyncProductsUseCase

  constructor(
    private readonly runner: CommandRunner,
    private readonly logger: Logger,
    private readonly fileSystem: FileSystem,
    private readonly paths: WorkspacePaths,
    private readonly buildSite: BuildSiteUseCase,
    private readonly syncAssetsUseCase: SyncAssetsUseCase,
    private readonly syncSearchIndexesUseCase: SyncSearchIndexesUseCase
  ) {
    this.collectProducts = new CollectProductsUseCase(fileSystem, logger)
    this.syncProducts = new SyncProductsUseCase(logger)
  }

  async execute(input: DeploySiteInput): Promise<void> {
    await this.buildSite.execute({
      siteId: input.siteId,
      themeId: input.themeId,
      publicEnv: input.searchIndexBaseUrl
        ? { NEXT_PUBLIC_SEARCH_INDEX_BASE_URL: input.searchIndexBaseUrl }
        : undefined
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

    // Sync products with X promotion to admin API
    if (input.syncProducts && input.adminApiConfig) {
      const contentsDir = this.paths.contentsDir(input.siteId)
      const collectResult = await this.collectProducts.execute({
        siteId: input.siteId.toString(),
        contentsDir,
      })

      if (collectResult.products.length > 0) {
        await this.syncProducts.execute({
          siteId: input.siteId.toString(),
          products: collectResult.products,
          adminApi: input.adminApiConfig,
        })
      }
    }

    const outputDir = this.paths.themeOutputDir(input.themeId)
    const projectName = input.projectName ?? input.siteId.toString()
    const args = ['pages', 'deploy', outputDir, '--project-name', projectName]

    if (!input.production) {
      const branch = input.branch ?? 'preview'
      args.push('--branch', branch)
    }

    this.logger.info(`Deploying Pages project: ${projectName}`)
    await this.runner.run('wrangler', args, { stdio: 'inherit' })
  }
}
