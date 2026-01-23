#!/usr/bin/env node
import { Command } from 'commander';
import { DomainError } from '../domain/errors.js';
import { SiteId } from '../domain/value-objects/site-id.js';
import { ThemeId } from '../domain/value-objects/theme-id.js';
import { Port } from '../domain/value-objects/port.js';
import { WorkspacePaths } from '../application/workspace-paths.js';
import { DevSiteUseCase } from '../application/use-cases/dev-site.js';
import { BuildSiteUseCase } from '../application/use-cases/build-site.js';
import { SyncAssetsUseCase } from '../application/use-cases/sync-assets.js';
import { DeploySiteUseCase } from '../application/use-cases/deploy-site.js';
import { SyncSearchIndexesUseCase } from '../application/use-cases/sync-search-indexes.js';
import { NodeCommandRunner } from '../infra/command/node-command-runner.js';
import { NodeFileSystem } from '../infra/fs/node-file-system.js';
import { ConsoleLogger } from '../infra/logging/console-logger.js';
import { PnpmInstaller } from '../infra/deps/pnpm-installer.js';
import { AwsS3AssetRepository } from '../infra/assets/aws-s3-asset-repository.js';
import { AwsS3SearchIndexRepository } from '../infra/search-index/aws-s3-search-index-repository.js';
import { loadEnvFile } from '../infra/env/dotenv-loader.js';
const program = new Command();
const buildDependencies = (rootDir) => {
    const runner = new NodeCommandRunner();
    const fileSystem = new NodeFileSystem();
    const logger = new ConsoleLogger();
    const paths = new WorkspacePaths(rootDir);
    const installer = new PnpmInstaller(runner);
    const assets = new AwsS3AssetRepository(runner);
    const searchIndexes = new AwsS3SearchIndexRepository(runner);
    const buildSite = new BuildSiteUseCase(runner, installer, fileSystem, logger, paths);
    const syncAssets = new SyncAssetsUseCase(assets, fileSystem, logger);
    const syncSearchIndexes = new SyncSearchIndexesUseCase(searchIndexes, fileSystem, logger);
    const deploySite = new DeploySiteUseCase(runner, logger, fileSystem, paths, buildSite, syncAssets, syncSearchIndexes);
    const devSite = new DevSiteUseCase(runner, installer, fileSystem, logger, paths);
    return { runner, fileSystem, logger, paths, buildSite, syncAssets, syncSearchIndexes, deploySite, devSite };
};
const requireEnv = (name) => {
    const value = process.env[name];
    if (!value) {
        throw new Error(`missing environment variable: ${name}`);
    }
    return value;
};
const parseSiteId = (value) => SiteId.create(value);
const parseThemeId = (value) => ThemeId.create(value);
const parsePort = (value) => Port.create(value);
const resolveSearchIndexBaseUrl = (siteId, override) => {
    if (override)
        return override;
    if (process.env.NEXT_PUBLIC_SEARCH_INDEX_BASE_URL) {
        return process.env.NEXT_PUBLIC_SEARCH_INDEX_BASE_URL;
    }
    const publicBase = process.env.R2_PUBLIC_BASE_URL;
    if (!publicBase)
        return undefined;
    return `${publicBase.replace(/\/$/, '')}/${siteId.toString()}`;
};
program.name('techdoc').description('Techdoc CLI');
program
    .command('dev')
    .argument('<siteId>', 'site id')
    .option('--theme <themeId>', 'theme id', 'fumadocs')
    .option('--port <port>', 'port', '4000')
    .option('--root <rootDir>', 'workspace root', process.cwd())
    .action(async (siteIdRaw, options) => {
    try {
        loadEnvFile(options.root);
        const siteId = parseSiteId(siteIdRaw);
        const themeId = parseThemeId(options.theme);
        const port = parsePort(options.port);
        const { devSite } = buildDependencies(options.root);
        await devSite.execute({ siteId, themeId, port });
    }
    catch (error) {
        handleError(error);
    }
});
program
    .command('build')
    .argument('<siteId>', 'site id')
    .option('--theme <themeId>', 'theme id', 'fumadocs')
    .option('--search-index-base-url <url>', 'search index base url')
    .option('--root <rootDir>', 'workspace root', process.cwd())
    .action(async (siteIdRaw, options) => {
    try {
        loadEnvFile(options.root);
        const siteId = parseSiteId(siteIdRaw);
        const themeId = parseThemeId(options.theme);
        const { buildSite } = buildDependencies(options.root);
        const searchIndexBaseUrl = resolveSearchIndexBaseUrl(siteId, options.searchIndexBaseUrl);
        await buildSite.execute({
            siteId,
            themeId,
            publicEnv: searchIndexBaseUrl
                ? { NEXT_PUBLIC_SEARCH_INDEX_BASE_URL: searchIndexBaseUrl }
                : undefined
        });
    }
    catch (error) {
        handleError(error);
    }
});
program
    .command('deploy')
    .argument('<siteId>', 'site id')
    .option('--theme <themeId>', 'theme id', 'fumadocs')
    .option('--production', 'deploy as production', false)
    .option('--branch <branch>', 'preview branch name')
    .option('--project <projectName>', 'pages project name')
    .option('--skip-assets', 'skip R2 asset sync', false)
    .option('--assets-prefix <prefix>', 'R2 prefix override')
    .option('--skip-search-index', 'skip R2 search index sync', false)
    .option('--search-index-prefix <prefix>', 'search index prefix override')
    .option('--search-index-base-url <url>', 'search index base url')
    .option('--sync-products', 'sync products with X promotion to admin API', false)
    .option('--root <rootDir>', 'workspace root', process.cwd())
    .action(async (siteIdRaw, options) => {
    try {
        loadEnvFile(options.root);
        const siteId = parseSiteId(siteIdRaw);
        const themeId = parseThemeId(options.theme);
        const { deploySite } = buildDependencies(options.root);
        const syncAssets = !options.skipAssets;
        const syncSearchIndexes = !options.skipSearchIndex;
        const syncProducts = Boolean(options.syncProducts);
        const searchIndexBaseUrl = resolveSearchIndexBaseUrl(siteId, options.searchIndexBaseUrl);
        if (syncSearchIndexes && !searchIndexBaseUrl) {
            throw new Error('missing environment variable: NEXT_PUBLIC_SEARCH_INDEX_BASE_URL or R2_PUBLIC_BASE_URL');
        }
        const r2Config = syncAssets
            ? {
                bucket: requireEnv('R2_BUCKET'),
                endpoint: requireEnv('R2_ENDPOINT'),
                accessKeyId: requireEnv('R2_ACCESS_KEY_ID'),
                secretAccessKey: requireEnv('R2_SECRET_ACCESS_KEY'),
                prefix: options.assetsPrefix ?? `${siteId.toString()}/nextImageExportOptimizer`,
                diffOnly: true
            }
            : undefined;
        const searchIndexConfig = syncSearchIndexes
            ? {
                bucket: requireEnv('R2_BUCKET'),
                endpoint: requireEnv('R2_ENDPOINT'),
                accessKeyId: requireEnv('R2_ACCESS_KEY_ID'),
                secretAccessKey: requireEnv('R2_SECRET_ACCESS_KEY'),
                prefix: options.searchIndexPrefix ?? `${siteId.toString()}/search-indexes`,
                diffOnly: true
            }
            : undefined;
        const adminApiConfig = syncProducts
            ? {
                baseUrl: requireEnv('ADMIN_API_BASE_URL'),
                apiKey: requireEnv('ADMIN_API_KEY'),
            }
            : undefined;
        await deploySite.execute({
            siteId,
            themeId,
            production: Boolean(options.production),
            branch: options.branch,
            projectName: options.project,
            syncAssets,
            syncSearchIndexes,
            syncProducts,
            searchIndexBaseUrl,
            r2Config,
            searchIndexConfig,
            adminApiConfig
        });
    }
    catch (error) {
        handleError(error);
    }
});
const handleError = (error) => {
    if (error instanceof DomainError) {
        console.error(`Validation error: ${error.message}`);
    }
    else if (error instanceof Error) {
        console.error(error.message);
    }
    else {
        console.error('Unknown error');
    }
    process.exitCode = 1;
};
program.parseAsync(process.argv);
