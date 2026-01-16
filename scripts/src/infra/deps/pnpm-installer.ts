import { DependencyInstaller, DependencyInstallOptions } from '../../application/ports/dependency-installer.js'
import { CommandRunner } from '../../application/ports/command-runner.js'

export class PnpmInstaller implements DependencyInstaller {
  constructor(private readonly runner: CommandRunner) {}

  async install(options: DependencyInstallOptions): Promise<void> {
    if (!options.frozenLockfile) {
      await this.runner.run('pnpm', ['install', '--no-frozen-lockfile'], { cwd: options.cwd, stdio: 'inherit' })
      return
    }

    try {
      await this.runner.run('pnpm', ['install', '--frozen-lockfile'], { cwd: options.cwd, stdio: 'inherit' })
    } catch {
      await this.runner.run('pnpm', ['install', '--no-frozen-lockfile'], { cwd: options.cwd, stdio: 'inherit' })
    }
  }
}
