import { promises as fs } from 'node:fs'
import { FileSystem } from '../../application/ports/file-system.js'

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
}
