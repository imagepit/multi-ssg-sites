import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { DevSiteUseCase } from '../../src/application/use-cases/dev-site.js'
import { WorkspacePaths } from '../../src/application/workspace-paths.js'
import { SiteId } from '../../src/domain/value-objects/site-id.js'
import { ThemeId } from '../../src/domain/value-objects/theme-id.js'
import { Port } from '../../src/domain/value-objects/port.js'
import { FakeCommandRunner, FakeFileSystem, FakeInstaller, FakeLogger } from './fakes.js'

const rootDir = '/workspace'

const createUseCase = (paths: string[]) => {
  const runner = new FakeCommandRunner()
  const fileSystem = new FakeFileSystem(paths)
  const installer = new FakeInstaller()
  const logger = new FakeLogger()
  const workspace = new WorkspacePaths(rootDir)
  const useCase = new DevSiteUseCase(runner, installer, fileSystem, logger, workspace)
  return { useCase, runner, fileSystem, installer }
}

describe('DevSiteUseCase', () => {
  it('runs pnpm dev with env', async () => {
    const themeDir = path.join(rootDir, 'theme', 'fumadocs')
    const nodeModules = path.join(themeDir, 'node_modules')
    const zodModule = path.join(themeDir, 'node_modules', 'zod')
    const { useCase, runner, fileSystem, installer } = createUseCase([themeDir, nodeModules, zodModule])

    await useCase.execute({
      siteId: SiteId.create('v0'),
      themeId: ThemeId.create('fumadocs'),
      port: Port.create(4000)
    })

    expect(installer.calls.length).toBe(0)
    expect(runner.calls[0]?.command).toBe('pnpm')
    expect(runner.calls[0]?.args).toEqual(['dev', '-p', '4000'])
    expect(runner.calls[0]?.options?.env).toMatchObject({
      SITE_ID: 'v0',
      THEME_ID: 'fumadocs',
      NEXT_PUBLIC_SITE_ID: 'v0'
    })
    expect(fileSystem.removed).toContain(path.join(themeDir, '.next'))
  })

  it('installs dependencies when node_modules is missing', async () => {
    const themeDir = path.join(rootDir, 'theme', 'fumadocs')
    const { useCase, installer } = createUseCase([themeDir])

    await useCase.execute({
      siteId: SiteId.create('v0'),
      themeId: ThemeId.create('fumadocs'),
      port: Port.create(4000)
    })

    expect(installer.calls.length).toBe(1)
    expect(installer.calls[0]).toMatchObject({
      cwd: themeDir,
      frozenLockfile: false
    })
  })
})
