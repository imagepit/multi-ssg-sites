import { spawn } from 'node:child_process';
export class NodeCommandRunner {
    async run(command, args, options = {}) {
        const env = { ...process.env, ...(options.env ?? {}) };
        const hasInput = options.input !== undefined;
        return new Promise((resolve, reject) => {
            const child = spawn(command, args, {
                cwd: options.cwd,
                env,
                stdio: hasInput ? ['pipe', options.stdio ?? 'inherit', options.stdio ?? 'inherit'] : (options.stdio ?? 'inherit'),
            });
            child.on('error', (error) => {
                reject(error);
            });
            child.on('close', (code) => {
                const exitCode = code ?? 0;
                if (exitCode !== 0) {
                    reject(new Error(`${command} ${args.join(' ')} exited with code ${exitCode}`));
                    return;
                }
                resolve({ exitCode });
            });
            // Write input to stdin if provided
            if (hasInput && child.stdin) {
                child.stdin.write(options.input);
                child.stdin.end();
            }
        });
    }
}
