import { promises as fs } from 'node:fs'
import { FileSystem, FileStat } from '../../application/ports/file-system.js'

export class NodeFileSystem implements FileSystem {
  async exists(path: string): Promise<boolean> {
    try {
      await fs.access(path)
      return true
    } catch {
      return false
    }
  }

  async remove(path: string): Promise<void> {
    await fs.rm(path, { recursive: true, force: true })
  }

  async read(path: string): Promise<string> {
    return fs.readFile(path, 'utf-8')
  }

  async readdir(path: string): Promise<string[]> {
    return fs.readdir(path)
  }

  async stat(path: string): Promise<FileStat> {
    const stat = await fs.stat(path)
    return {
      isDirectory: () => stat.isDirectory(),
      isFile: () => stat.isFile()
    }
  }
}
