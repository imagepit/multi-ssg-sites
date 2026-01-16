import { UseCaseError } from '../errors.js';
export class DeploySiteUseCase {
    runner;
    logger;
    fileSystem;
    paths;
    buildSite;
    syncAssetsUseCase;
    syncSearchIndexesUseCase;
    constructor(runner, logger, fileSystem, paths, buildSite, syncAssetsUseCase, syncSearchIndexesUseCase) {
        this.runner = runner;
        this.logger = logger;
        this.fileSystem = fileSystem;
        this.paths = paths;
        this.buildSite = buildSite;
        this.syncAssetsUseCase = syncAssetsUseCase;
        this.syncSearchIndexesUseCase = syncSearchIndexesUseCase;
    }
    async execute(input) {
        await this.buildSite.execute({
            siteId: input.siteId,
            themeId: input.themeId,
            publicEnv: input.searchIndexBaseUrl
                ? { NEXT_PUBLIC_SEARCH_INDEX_BASE_URL: input.searchIndexBaseUrl }
                : undefined
        });
        if (input.syncAssets && !input.r2Config) {
            throw new UseCaseError('R2 configuration is required when asset sync is enabled');
        }
        if (input.syncAssets && input.r2Config) {
            const assetsDir = this.paths.optimizedImagesDir(input.themeId);
            await this.syncAssetsUseCase.execute({
                sourceDir: assetsDir,
                bucket: input.r2Config.bucket,
                endpoint: input.r2Config.endpoint,
                accessKeyId: input.r2Config.accessKeyId,
                secretAccessKey: input.r2Config.secretAccessKey,
                prefix: input.r2Config.prefix,
                diffOnly: input.r2Config.diffOnly
            });
        }
        if (input.syncSearchIndexes && !input.searchIndexConfig) {
            throw new UseCaseError('search index configuration is required when sync is enabled');
        }
        if (input.syncSearchIndexes && input.searchIndexConfig) {
            const searchIndexesDir = this.paths.searchIndexesDir(input.themeId);
            await this.syncSearchIndexesUseCase.execute({
                sourceDir: searchIndexesDir,
                bucket: input.searchIndexConfig.bucket,
                endpoint: input.searchIndexConfig.endpoint,
                accessKeyId: input.searchIndexConfig.accessKeyId,
                secretAccessKey: input.searchIndexConfig.secretAccessKey,
                prefix: input.searchIndexConfig.prefix,
                diffOnly: input.searchIndexConfig.diffOnly
            });
            await this.fileSystem.remove(searchIndexesDir);
        }
        const outputDir = this.paths.themeOutputDir(input.themeId);
        const projectName = input.projectName ?? input.siteId.toString();
        const args = ['pages', 'deploy', outputDir, '--project-name', projectName];
        if (!input.production) {
            const branch = input.branch ?? 'preview';
            args.push('--branch', branch);
        }
        this.logger.info(`Deploying Pages project: ${projectName}`);
        await this.runner.run('wrangler', args, { stdio: 'inherit' });
    }
}
