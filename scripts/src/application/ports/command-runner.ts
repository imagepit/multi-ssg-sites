export type CommandOptions = {
  cwd?: string
  env?: Record<string, string>
  stdio?: 'inherit' | 'pipe'
  /** Standard input to pass to the command */
  input?: string
}

export type CommandResult = {
  exitCode: number
}

export interface CommandRunner {
  run(command: string, args: string[], options?: CommandOptions): Promise<CommandResult>
}
