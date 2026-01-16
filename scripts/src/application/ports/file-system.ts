export interface FileSystem {
  exists(path: string): Promise<boolean>
  remove(path: string): Promise<void>
}
