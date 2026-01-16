import path from 'node:path'
import { UseCaseError } from '../errors.js'
import { CommandRunner } from '../ports/command-runner.js'
import { DependencyInstaller } from '../ports/dependency-installer.js'
import { FileSystem } from '../ports/file-system.js'
import { Logger } from '../ports/logger.js'
import { WorkspacePaths } from '../workspace-paths.js'
import { Port } from '../../domain/value-objects/port.js'
import { SiteId } from '../../domain/value-objects/site-id.js'
import { ThemeId } from '../../domain/value-objects/theme-id.js'

export type DevSiteInput = {
  siteId: SiteId
  themeId: ThemeId
  port: Port
}

export class DevSiteUseCase {
  constructor(
    private readonly runner: CommandRunner,
    private readonly installer: DependencyInstaller,
    private readonly fileSystem: FileSystem,
    private readonly logger: Logger,
    private readonly paths: WorkspacePaths
  ) {}

  async execute(input: DevSiteInput): Promise<void> {
    const themeDir = this.paths.themeDir(input.themeId)
    const themeExists = await this.fileSystem.exists(themeDir)
    if (!themeExists) {
      throw new UseCaseError(`theme directory not found: ${themeDir}`)
    }

    const nodeModules = path.join(themeDir, 'node_modules')
    const zodModule = path.join(themeDir, 'node_modules', 'zod')
    const nodeModulesExists = await this.fileSystem.exists(nodeModules)
    const zodExists = await this.fileSystem.exists(zodModule)
    if (!nodeModulesExists || !zodExists) {
      this.logger.info('Installing dependencies (pnpm)...')
      await this.installer.install({ cwd: themeDir, frozenLockfile: false })
    }

    await this.fileSystem.remove(path.join(themeDir, '.next'))
    await this.fileSystem.remove(path.join(themeDir, '.turbo'))
    await this.fileSystem.remove(path.join(themeDir, 'node_modules', '.cache'))

    const env = {
      SITE_ID: input.siteId.toString(),
      THEME_ID: input.themeId.toString(),
      NEXT_PUBLIC_SITE_ID: input.siteId.toString()
    }

    this.logger.info(`Starting dev server on http://localhost:${input.port.toString()}`)
    await this.runner.run('pnpm', ['dev', '-p', input.port.toString()], {
      cwd: themeDir,
      env,
      stdio: 'inherit'
    })
  }
}
