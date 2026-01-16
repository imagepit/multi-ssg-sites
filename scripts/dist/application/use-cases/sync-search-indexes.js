import { UseCaseError } from '../errors.js';
export class SyncSearchIndexesUseCase {
    repository;
    fileSystem;
    logger;
    constructor(repository, fileSystem, logger) {
        this.repository = repository;
        this.fileSystem = fileSystem;
        this.logger = logger;
    }
    async execute(input) {
        const exists = await this.fileSystem.exists(input.sourceDir);
        if (!exists) {
            throw new UseCaseError(`search indexes directory not found: ${input.sourceDir}`);
        }
        this.logger.info(`Syncing search indexes to R2: ${input.bucket}/${input.prefix}`);
        await this.repository.syncSearchIndexes({
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
