import path from 'path';
import { visit } from 'unist-util-visit';
export function rehypeResolveImages(options) {
    const imagesDir = options?.imagesDir || path.join(process.cwd(), 'public', 'images');
    return function transformer(tree, file) {
        const filePath = typeof file?.path === 'string' ? file.path : undefined;
        const baseDir = filePath ? path.dirname(filePath) : process.cwd();
        visit(tree, 'element', (node) => {
            if (node.tagName !== 'img' || !node.properties)
                return;
            const rawSrc = String(node.properties.src || '');
            if (!rawSrc || rawSrc.startsWith('http') || rawSrc.startsWith('data:') || rawSrc.startsWith('blob:'))
                return;
            if (rawSrc.startsWith('/'))
                return;
            const hintIdx = rawSrc.replace(/\\/g, '/').lastIndexOf('images/');
            if (hintIdx >= 0) {
                node.properties.src = '/' + rawSrc.replace(/\\/g, '/').slice(hintIdx);
                return;
            }
            const absResolved = path.resolve(baseDir, rawSrc);
            const inImagesDir = absResolved.startsWith(imagesDir + path.sep);
            if (inImagesDir) {
                const rel = path.relative(imagesDir, absResolved).replace(/\\/g, '/');
                node.properties.src = `/images/${rel}`;
            }
        });
    };
}
