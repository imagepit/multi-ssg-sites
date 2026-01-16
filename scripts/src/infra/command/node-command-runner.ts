import { spawn } from 'node:child_process'
import { CommandOptions, CommandResult, CommandRunner } from '../../application/ports/command-runner.js'

export class NodeCommandRunner implements CommandRunner {
  async run(command: string, args: string[], options: CommandOptions = {}): Promise<CommandResult> {
    const env = { ...process.env, ...(options.env ?? {}) }

    return new Promise((resolve, reject) => {
      const child = spawn(command, args, {
        cwd: options.cwd,
        env,
        stdio: options.stdio ?? 'inherit'
      })

      child.on('error', (error) => {
        reject(error)
      })

      child.on('close', (code) => {
        const exitCode = code ?? 0
        if (exitCode !== 0) {
          reject(new Error(`${command} ${args.join(' ')} exited with code ${exitCode}`))
          return
        }
        resolve({ exitCode })
      })
    })
  }
}
