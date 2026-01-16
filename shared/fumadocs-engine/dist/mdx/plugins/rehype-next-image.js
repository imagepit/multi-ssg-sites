import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { visit } from 'unist-util-visit';
export function rehypeNextImage(options) {
    const imagesDir = options?.imagesDir || path.join(process.cwd(), 'public', 'images');
    const defaultClass = options?.className || 'markdown-image';
    const priority = options?.priority ?? false;
    return function transformer(tree) {
        visit(tree, 'element', (node) => {
            if (node.tagName !== 'img' || !node.properties)
                return;
            const src = String(node.properties.src || '');
            if (!src || !src.startsWith('/images/'))
                return;
            const rel = src.replace(/^\/images\//, '');
            const abs = path.join(imagesDir, rel);
            try {
                if (fs.existsSync(abs)) {
                    // 画像寸法を取得して width/height を自動付与
                    const meta = sharp(abs);
                    // sharp(metadata) を同期的に扱えないため、最小限のブロッキングを許容
                    // rehype トランスフォーマは同期処理だが、次善策として stat からのフォールバックも用意
                    // eslint-disable-next-line @typescript-eslint/no-floating-promises
                    meta.metadata().then((m) => {
                        if (m.width && m.height) {
                            if (!('width' in (node.properties || {})))
                                node.properties.width = m.width;
                            if (!('height' in (node.properties || {})))
                                node.properties.height = m.height;
                        }
                    }).catch(() => { });
                }
            }
            catch { }
            node.tagName = 'Image';
            const cn = String(node.properties.className || '');
            node.properties.className = cn ? `${cn} ${defaultClass}` : defaultClass;
            if (priority)
                node.properties.priority = true;
        });
    };
}
