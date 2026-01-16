import { UseCaseError } from '../errors.js';
export class BuildSiteUseCase {
    runner;
    installer;
    fileSystem;
    logger;
    paths;
    constructor(runner, installer, fileSystem, logger, paths) {
        this.runner = runner;
        this.installer = installer;
        this.fileSystem = fileSystem;
        this.logger = logger;
        this.paths = paths;
    }
    async execute(input) {
        const themeDir = this.paths.themeDir(input.themeId);
        const themeExists = await this.fileSystem.exists(themeDir);
        if (!themeExists) {
            throw new UseCaseError(`theme directory not found: ${themeDir}`);
        }
        this.logger.info('Installing dependencies (pnpm)...');
        await this.installer.install({ cwd: themeDir, frozenLockfile: true });
        const env = {
            SITE_ID: input.siteId.toString(),
            THEME_ID: input.themeId.toString(),
            SSG_EXPORT: '1',
            NEXT_PUBLIC_SEARCH_STATIC: '1',
            NEXT_PUBLIC_SITE_ID: input.siteId.toString()
        };
        if (input.publicEnv) {
            Object.assign(env, input.publicEnv);
        }
        this.logger.info(`Building static site for ${input.siteId.toString()}...`);
        await this.runner.run('pnpm', ['build'], {
            cwd: themeDir,
            env,
            stdio: 'inherit'
        });
    }
}
