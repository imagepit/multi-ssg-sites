import { docs } from 'fumadocs-mdx:collections/server';
import { type InferPageType, loader } from 'fumadocs-core/source';
import type { PageTree } from 'fumadocs-core/server';
import fs from 'node:fs';
import path from 'node:path';
import { getBranding } from '@/lib/site-config';

// See https://fumadocs.vercel.app/docs/headless/source-api for more info
export const source = loader({
  baseUrl: '/',
  source: docs.toFumadocsSource(),
});

export function getPageImage(_page: InferPageType<typeof source>) {
  const branding = getBranding();
  const og = branding?.ogImage || branding?.logo || null;
  return {
    segments: [],
    url: og ? `/brand/${og}` : '/brand/logo.svg',
  };
}

export async function getLLMText(page: InferPageType<typeof source>) {
  const processed = await page.data.getText('raw');

  return `# ${page.data.title} (${page.url})

${processed}`;
}

// Build sidebar tree from specs/sitemap.md
type SiteNode = {
  title: string;
  href: string | null;
  children: SiteNode[];
};

function parseSitemapMarkdown(markdown: string): SiteNode[] {
  const lines = markdown.split(/\r?\n/);
  const root: SiteNode = { title: '__root__', href: null, children: [] };
  const stack: { level: number; node: SiteNode }[] = [{ level: -1, node: root }];

  const itemRegex = /^(\s*)-\s+\[([^\]]+)\]\(([^)]+)\)/;

  for (const line of lines) {
    const match = line.match(itemRegex);
    if (!match) continue;
    const indent = match[1] ?? '';
    const title = match[2].trim();
    const hrefRaw = match[3].trim();
    const level = Math.floor(indent.length / 2);

    const node: SiteNode = { title, href: hrefRaw, children: [] };

    // adjust stack to current level
    while (stack.length && stack[stack.length - 1].level >= level) {
      stack.pop();
    }
    const parent = stack[stack.length - 1]?.node ?? root;
    parent.children.push(node);
    stack.push({ level, node });
  }

  return root.children;
}

function resolveUrlFromHref(href: string): string {
  // special-case home
  if (href === 'home.md' || href === './home.md') return '/';

  const noExt = href.replace(/\.(md|mdx)$/i, '');
  // ensure it starts without leading './'
  const clean = noExt.replace(/^\.\//, '');
  return `/${clean}`;
}

function createPageItem(title: string, href: string): PageTree.Item {
  // Try to resolve via source to obtain canonical url
  const virtualPath = href === 'home.md' ? 'docs/index.mdx' : `docs/${href}`;
  const resolved = source.getPageByHref(virtualPath);
  const url = resolved?.page?.url ?? resolveUrlFromHref(href);
  return {
    type: 'page',
    name: title,
    url,
  };
}

function convertNodesToPageTree(nodes: SiteNode[]): PageTree.Root {
  function toNode(n: SiteNode): PageTree.Node {
    if (n.children.length === 0) {
      if (!n.href) {
        // orphan folder-like item without href; render as separator
        return { type: 'separator', name: n.title } as PageTree.Separator;
      }
      return createPageItem(n.title, n.href);
    }

    const children: PageTree.Node[] = [];
    // Add index page for folder if href exists
    let index: PageTree.Item | undefined;
    if (n.href) {
      index = createPageItem(n.title, n.href);
    }
    for (const child of n.children) {
      children.push(toNode(child));
    }
    return {
      type: 'folder',
      name: n.title,
      children,
      ...(index ? { index } : {}),
      defaultOpen: false,
    } as PageTree.Folder;
  }

  const children: PageTree.Node[] = nodes.map(toNode);
  const root: PageTree.Root = {
    name: 'ホーム',
    children,
  };
  return root;
}

let sitemapTreeCache: PageTree.Root | null = null;

export function getSitemapTree(): PageTree.Root {
  if (sitemapTreeCache) return sitemapTreeCache;
  // SITE_ID があればワークスペースの contents/[site]/specs/sitemap.md を参照
  const siteId = process.env.SITE_ID;
  const sitemapPath = siteId
    ? path.resolve(process.cwd(), '..', '..', 'contents', siteId, 'specs', 'sitemap.md')
    : path.join(process.cwd(), 'specs', 'sitemap.md');
  let content = '';
  try {
    content = fs.readFileSync(sitemapPath, 'utf8');
  } catch {
    // fallback to default tree when not found
    sitemapTreeCache = source.pageTree as unknown as PageTree.Root;
    return sitemapTreeCache;
  }
  const nodes = parseSitemapMarkdown(content);
  sitemapTreeCache = convertNodesToPageTree(nodes);
  return sitemapTreeCache;
}
