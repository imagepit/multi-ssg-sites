import { loader } from 'fumadocs-core/source';
import { getBranding } from '../site/spec.js';
export function createSource(docs) {
    return loader({
        baseUrl: '/',
        source: docs.toFumadocsSource(),
    });
}
export function getPageImage(page) {
    const branding = getBranding();
    const og = branding?.ogImage || branding?.logo || null;
    return {
        segments: [],
        url: og ? `/brand/${og}` : '/brand/logo.svg',
    };
}
export async function getLLMText(page) {
    const processed = await page.data.getText('raw');
    return `# ${page.data.title} (${page.url})\n\n${processed}`;
}
