import fs from 'node:fs';
import path from 'node:path';
import { config } from 'dotenv';
export const loadEnvFile = (rootDir) => {
    const envPath = path.join(rootDir, '.env');
    if (!fs.existsSync(envPath)) {
        return;
    }
    const result = config({ path: envPath, override: false });
    if (result.error) {
        throw result.error;
    }
};
