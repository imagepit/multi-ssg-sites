import { promises as fs } from 'node:fs';
export class NodeFileSystem {
    async exists(path) {
        try {
            await fs.access(path);
            return true;
        }
        catch {
            return false;
        }
    }
    async remove(path) {
        await fs.rm(path, { recursive: true, force: true });
    }
}
