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
    async read(path) {
        return fs.readFile(path, 'utf-8');
    }
    async readdir(path) {
        return fs.readdir(path);
    }
    async stat(path) {
        const stat = await fs.stat(path);
        return {
            isDirectory: () => stat.isDirectory(),
            isFile: () => stat.isFile()
        };
    }
}
