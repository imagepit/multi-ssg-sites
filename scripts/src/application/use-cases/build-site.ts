import { UseCaseError } from '../errors.js'
import { CommandRunner } from '../ports/command-runner.js'
import { DependencyInstaller } from '../ports/dependency-installer.js'
import { FileSystem } from '../ports/file-system.js'
import { Logger } from '../ports/logger.js'
import { WorkspacePaths } from '../workspace-paths.js'
import { SiteId } from '../../domain/value-objects/site-id.js'
import { ThemeId } from '../../domain/value-objects/theme-id.js'

export type BuildSiteInput = {
  siteId: SiteId
  themeId: ThemeId
  publicEnv?: Record<string, string>
}

export class BuildSiteUseCase {
  constructor(
    private readonly runner: CommandRunner,
    private readonly installer: DependencyInstaller,
    private readonly fileSystem: FileSystem,
    private readonly logger: Logger,
    private readonly paths: WorkspacePaths
  ) {}

  async execute(input: BuildSiteInput): Promise<void> {
    const themeDir = this.paths.themeDir(input.themeId)
    const themeExists = await this.fileSystem.exists(themeDir)
    if (!themeExists) {
      throw new UseCaseError(`theme directory not found: ${themeDir}`)
    }

    this.logger.info('Installing dependencies (pnpm)...')
    await this.installer.install({ cwd: themeDir, frozenLockfile: true })

    const env: Record<string, string> = {
      SITE_ID: input.siteId.toString(),
      THEME_ID: input.themeId.toString(),
      SSG_EXPORT: '1',
      NEXT_PUBLIC_SEARCH_STATIC: '1',
      NEXT_PUBLIC_SITE_ID: input.siteId.toString()
    }

    if (input.publicEnv) {
      Object.assign(env, input.publicEnv)
    }

    this.logger.info(`Building static site for ${input.siteId.toString()}...`)
    await this.runner.run('pnpm', ['build'], {
      cwd: themeDir,
      env,
      stdio: 'inherit'
    })
  }
}
