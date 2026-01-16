import fs from 'node:fs';
import path from 'node:path';
const specCache = new Map();
function resolveSpecPath(opts) {
    const siteId = opts?.siteId || process.env.SITE_ID || null;
    const rootDir = opts?.rootDir || process.cwd();
    if (siteId) {
        return path.resolve(rootDir, '..', '..', 'contents', siteId, 'specs', 'spec.json');
    }
    return path.join(rootDir, 'specs', 'spec.json');
}
export function readSiteSpec(opts) {
    const specPath = resolveSpecPath(opts);
    const cacheKey = `${specPath}`;
    if (opts?.cache !== false && specCache.has(cacheKey)) {
        return specCache.get(cacheKey) ?? null;
    }
    try {
        const raw = fs.readFileSync(specPath, 'utf8');
        const parsed = JSON.parse(raw);
        if (opts?.cache !== false) {
            specCache.set(cacheKey, parsed);
        }
        return parsed;
    }
    catch {
        if (opts?.cache !== false)
            specCache.set(cacheKey, null);
        return null;
    }
}
export function getThemePrimary(opts) {
    const spec = readSiteSpec(opts);
    return spec?.theme_config?.colors?.primary ?? null;
}
export function getBranding(opts) {
    const spec = readSiteSpec(opts);
    return {
        logo: spec?.theme_config?.branding?.logo ?? null,
        favicon: spec?.theme_config?.branding?.favicon ?? null,
        ogImage: spec?.theme_config?.branding?.og_image ?? null,
    };
}
export function getSiteLanguage(opts) {
    const spec = readSiteSpec(opts);
    return spec?.language ?? null;
}
export function getSiteName(opts) {
    const spec = readSiteSpec(opts);
    return spec?.site_name ?? null;
}
export function getSidebarMode(opts) {
    const spec = readSiteSpec(opts);
    return spec?.theme_config?.navigation?.sidebar_mode ?? opts?.fallback ?? 'sitemap';
}
