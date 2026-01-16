import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { BuildSiteUseCase } from '../../src/application/use-cases/build-site.js'
import { WorkspacePaths } from '../../src/application/workspace-paths.js'
import { SiteId } from '../../src/domain/value-objects/site-id.js'
import { ThemeId } from '../../src/domain/value-objects/theme-id.js'
import { FakeCommandRunner, FakeFileSystem, FakeInstaller, FakeLogger } from './fakes.js'

const rootDir = '/workspace'

describe('BuildSiteUseCase', () => {
  it('runs pnpm build with export env', async () => {
    const themeDir = path.join(rootDir, 'theme', 'fumadocs')
    const runner = new FakeCommandRunner()
    const fileSystem = new FakeFileSystem([themeDir])
    const installer = new FakeInstaller()
    const logger = new FakeLogger()
    const workspace = new WorkspacePaths(rootDir)
    const useCase = new BuildSiteUseCase(runner, installer, fileSystem, logger, workspace)

    await useCase.execute({
      siteId: SiteId.create('v0'),
      themeId: ThemeId.create('fumadocs')
    })

    expect(installer.calls.length).toBe(1)
    expect(installer.calls[0]?.cwd).toBe(themeDir)
    expect(installer.calls[0]?.frozenLockfile).toBe(true)
    expect(runner.calls[0]?.command).toBe('pnpm')
    expect(runner.calls[0]?.args).toEqual(['build'])
    expect(runner.calls[0]?.options?.env).toMatchObject({
      SSG_EXPORT: '1',
      NEXT_PUBLIC_SEARCH_STATIC: '1',
      NEXT_PUBLIC_SITE_ID: 'v0'
    })
  })

  it('passes public env overrides', async () => {
    const themeDir = path.join(rootDir, 'theme', 'fumadocs')
    const runner = new FakeCommandRunner()
    const fileSystem = new FakeFileSystem([themeDir])
    const installer = new FakeInstaller()
    const logger = new FakeLogger()
    const workspace = new WorkspacePaths(rootDir)
    const useCase = new BuildSiteUseCase(runner, installer, fileSystem, logger, workspace)

    await useCase.execute({
      siteId: SiteId.create('v0'),
      themeId: ThemeId.create('fumadocs'),
      publicEnv: { NEXT_PUBLIC_SEARCH_INDEX_BASE_URL: 'https://r2.example.com/v0' }
    })

    expect(runner.calls[0]?.options?.env).toMatchObject({
      NEXT_PUBLIC_SEARCH_INDEX_BASE_URL: 'https://r2.example.com/v0'
    })
  })
})
