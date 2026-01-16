export type CommandOptions = {
  cwd?: string
  env?: Record<string, string>
  stdio?: 'inherit' | 'pipe'
}

export type CommandResult = {
  exitCode: number
}

export interface CommandRunner {
  run(command: string, args: string[], options?: CommandOptions): Promise<CommandResult>
}
