export interface FileStat {
  isDirectory(): boolean
  isFile(): boolean
}

export interface FileSystem {
  exists(path: string): Promise<boolean>
  remove(path: string): Promise<void>
  read(path: string): Promise<string>
  readdir(path: string): Promise<string[]>
  stat(path: string): Promise<FileStat>
}
