export type DependencyInstallOptions = {
  cwd: string
  frozenLockfile: boolean
}

export interface DependencyInstaller {
  install(options: DependencyInstallOptions): Promise<void>
}
