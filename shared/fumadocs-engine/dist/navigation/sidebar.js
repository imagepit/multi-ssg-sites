import fs from 'node:fs';
import path from 'node:path';
function parseSitemapMarkdown(markdown) {
    const lines = markdown.split(/\r?\n/);
    const root = { title: '__root__', href: null, children: [] };
    const stack = [{ level: -1, node: root }];
    const itemRegex = /^(\s*)-\s+\[([^\]]+)\]\(([^)]+)\)/;
    for (const line of lines) {
        const match = line.match(itemRegex);
        if (!match)
            continue;
        const indent = match[1] ?? '';
        const title = match[2].trim();
        const hrefRaw = match[3].trim();
        const level = Math.floor(indent.length / 2);
        const node = { title, href: hrefRaw, children: [] };
        while (stack.length && stack[stack.length - 1].level >= level) {
            stack.pop();
        }
        const parent = stack[stack.length - 1]?.node ?? root;
        parent.children.push(node);
        stack.push({ level, node });
    }
    return root.children;
}
function resolveUrlFromHref(href) {
    if (href === 'home.md' || href === './home.md')
        return '/';
    const noExt = href.replace(/\.(md|mdx)$/i, '');
    const clean = noExt.replace(/^\.\//, '');
    return `/${clean}`;
}
function createPageItem(title, href, source) {
    const virtualPath = href === 'home.md' ? 'docs/index.mdx' : `docs/${href}`;
    const resolved = source.getPageByHref?.(virtualPath);
    const url = resolved?.page?.url ?? resolveUrlFromHref(href);
    return {
        type: 'page',
        name: title,
        url,
    };
}
function convertNodesToPageTree(nodes, source) {
    function toNode(n) {
        if (n.children.length === 0) {
            if (!n.href) {
                return { type: 'separator', name: n.title };
            }
            return createPageItem(n.title, n.href, source);
        }
        const children = [];
        let index;
        if (n.href)
            index = createPageItem(n.title, n.href, source);
        for (const child of n.children)
            children.push(toNode(child));
        return {
            type: 'folder',
            name: n.title,
            children,
            ...(index ? { index } : {}),
            defaultOpen: false,
        };
    }
    const children = nodes.map((n) => toNode(n));
    return { name: 'ホーム', children };
}
export function getSidebarTree(options) {
    const { mode, siteId, rootDir, source } = options;
    if (mode === 'none') {
        return { name: 'ホーム', children: [] };
    }
    if (mode === 'auto') {
        return options.fallback || source.pageTree;
    }
    const baseDir = rootDir || process.cwd();
    const sitemapPath = siteId
        ? path.resolve(baseDir, '..', '..', 'contents', siteId, 'specs', 'sitemap.md')
        : path.join(baseDir, 'specs', 'sitemap.md');
    try {
        const content = fs.readFileSync(sitemapPath, 'utf8');
        const nodes = parseSitemapMarkdown(content);
        return convertNodesToPageTree(nodes, source);
    }
    catch {
        return options.fallback || source.pageTree;
    }
}
