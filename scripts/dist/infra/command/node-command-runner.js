import { spawn } from 'node:child_process';
export class NodeCommandRunner {
    async run(command, args, options = {}) {
        const env = { ...process.env, ...(options.env ?? {}) };
        return new Promise((resolve, reject) => {
            const child = spawn(command, args, {
                cwd: options.cwd,
                env,
                stdio: options.stdio ?? 'inherit'
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
        });
    }
}
