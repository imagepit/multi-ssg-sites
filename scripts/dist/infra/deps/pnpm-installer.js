export class PnpmInstaller {
    runner;
    constructor(runner) {
        this.runner = runner;
    }
    async install(options) {
        if (!options.frozenLockfile) {
            await this.runner.run('pnpm', ['install', '--no-frozen-lockfile'], { cwd: options.cwd, stdio: 'inherit' });
            return;
        }
        try {
            await this.runner.run('pnpm', ['install', '--frozen-lockfile'], { cwd: options.cwd, stdio: 'inherit' });
        }
        catch {
            await this.runner.run('pnpm', ['install', '--no-frozen-lockfile'], { cwd: options.cwd, stdio: 'inherit' });
        }
    }
}
