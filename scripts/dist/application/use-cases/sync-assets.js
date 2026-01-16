import { UseCaseError } from '../errors.js';
export class SyncAssetsUseCase {
    assets;
    fileSystem;
    logger;
    constructor(assets, fileSystem, logger) {
        this.assets = assets;
        this.fileSystem = fileSystem;
        this.logger = logger;
    }
    async execute(input) {
        const exists = await this.fileSystem.exists(input.sourceDir);
        if (!exists) {
            throw new UseCaseError(`assets directory not found: ${input.sourceDir}`);
        }
        this.logger.info(`Syncing assets to R2: ${input.bucket}/${input.prefix}`);
        await this.assets.syncOptimizedImages({
            sourceDir: input.sourceDir,
            bucket: input.bucket,
            prefix: input.prefix,
            endpoint: input.endpoint,
            accessKeyId: input.accessKeyId,
            secretAccessKey: input.secretAccessKey,
            diffOnly: input.diffOnly
        });
    }
}
