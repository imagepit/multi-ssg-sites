import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { DeploySiteUseCase } from '../../src/application/use-cases/deploy-site.js'
import { WorkspacePaths } from '../../src/application/workspace-paths.js'
import { SiteId } from '../../src/domain/value-objects/site-id.js'
import { ThemeId } from '../../src/domain/value-objects/theme-id.js'
import { FakeCommandRunner, FakeFileSystem, FakeLogger } from './fakes.js'

class StubBuildSiteUseCase {
  calls: Array<{ siteId: SiteId; themeId: ThemeId }> = []

  async execute(input: { siteId: SiteId; themeId: ThemeId }): Promise<void> {
    this.calls.push(input)
  }
}

class StubSyncAssetsUseCase {
  calls: Array<{ sourceDir: string; bucket: string; prefix: string }> = []

  async execute(input: { sourceDir: string; bucket: string; prefix: string }): Promise<void> {
    this.calls.push(input)
  }
}

class StubSyncSearchIndexesUseCase {
  calls: Array<{ sourceDir: string; bucket: string; prefix: string }> = []

  async execute(input: { sourceDir: string; bucket: string; prefix: string }): Promise<void> {
    this.calls.push(input)
  }
}

describe('DeploySiteUseCase', () => {
  it('runs build, sync, and deploy for preview', async () => {
    const runner = new FakeCommandRunner()
    const logger = new FakeLogger()
    const fileSystem = new FakeFileSystem()
    const paths = new WorkspacePaths('/workspace')
    const buildSite = new StubBuildSiteUseCase()
    const syncAssets = new StubSyncAssetsUseCase()
    const syncSearchIndexes = new StubSyncSearchIndexesUseCase()

    const useCase = new DeploySiteUseCase(
      runner,
      logger,
      fileSystem,
      paths,
      buildSite as any,
      syncAssets as any,
      syncSearchIndexes as any
    )

    await useCase.execute({
      siteId: SiteId.create('v0'),
      themeId: ThemeId.create('fumadocs'),
      production: false,
      syncAssets: true,
      syncSearchIndexes: false,
      r2Config: {
        bucket: 'bucket',
        endpoint: 'https://r2.example.com',
        accessKeyId: 'key',
        secretAccessKey: 'secret',
        prefix: 'v0/nextImageExportOptimizer',
        diffOnly: true
      }
    })

    expect(buildSite.calls.length).toBe(1)
    expect(syncAssets.calls.length).toBe(1)

    const deployCall = runner.calls[0]
    expect(deployCall?.command).toBe('wrangler')
    expect(deployCall?.args).toContain('pages')
    expect(deployCall?.args).toContain('deploy')
    expect(deployCall?.args).toContain('--branch')
    expect(deployCall?.args).toContain('preview')

    const outputDir = path.join('/workspace', 'theme', 'fumadocs', 'out')
    expect(deployCall?.args).toContain(outputDir)
  })

  it('deploys without branch for production', async () => {
    const runner = new FakeCommandRunner()
    const logger = new FakeLogger()
    const fileSystem = new FakeFileSystem()
    const paths = new WorkspacePaths('/workspace')
    const buildSite = new StubBuildSiteUseCase()
    const syncAssets = new StubSyncAssetsUseCase()
    const syncSearchIndexes = new StubSyncSearchIndexesUseCase()

    const useCase = new DeploySiteUseCase(
      runner,
      logger,
      fileSystem,
      paths,
      buildSite as any,
      syncAssets as any,
      syncSearchIndexes as any
    )

    await useCase.execute({
      siteId: SiteId.create('v0'),
      themeId: ThemeId.create('fumadocs'),
      production: true,
      syncAssets: false,
      syncSearchIndexes: false
    })

    const deployCall = runner.calls[0]
    expect(deployCall?.args).not.toContain('--branch')
  })
})
