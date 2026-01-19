import { getPageImage, source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/mdx-components';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { Suspense } from 'react';
import { SearchHighlighter } from '@/components/SearchHighlighter';
import Link from 'next/link';
import { PageBreadcrumbWithCategory } from '@/components/PageBreadcrumbWithCategory';
import ExportedImage from '@/components/ExportedImage';
import {
  filterIndexPages,
  formatDate,
  getPrimaryCategory,
  getRelatedPages,
  resolvePageCover,
} from '@/lib/content-utils';

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const page = source.getPage(params.slug || []);
  if (!page) notFound();

  const MDX = page.data.body;
  const category = getPrimaryCategory(page.data as Record<string, unknown>);
  const relatedPages = getRelatedPages(filterIndexPages(source.getPages()), page, 6);
  const relatedWithCovers = await Promise.all(
    relatedPages.map(async (related) => ({
      page: related,
      cover: await resolvePageCover(related),
    })),
  );

  return (
    <DocsPage 
    toc={page.data.toc} 
    full={page.data.full}
    breadcrumb={{
      component: (
        <PageBreadcrumbWithCategory
          category={category}
          includeRoot
          includePage
          includeSeparator
        />
      ),
    }}>
      <DocsTitle className="mt-4 text-bold text-4xl">{page.data.title}</DocsTitle>
      <DocsDescription className="page-description mb-0 mt-4 text-md text-fd-muted-foreground">{page.data.description}</DocsDescription>
      <DocsBody>
        <Suspense fallback={null}>
          <SearchHighlighter />
        </Suspense>
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
      {relatedWithCovers.length > 0 ? (
        <section className="mt-10 border-t border-fd-border/70 pt-6">
          <h2 className="text-lg font-semibold text-fd-foreground">関連記事</h2>
          <div className="mt-4 grid gap-4">
            {relatedWithCovers.map(({ page: related, cover }) => {
              const data = related.data as Record<string, any>;
              const date = formatDate(data.date as string | null | undefined);
              return (
                <Link
                  key={related.url}
                  href={related.url}
                  className="group flex gap-4 rounded-xl border border-fd-border/70 bg-fd-card/70 p-4 transition hover:border-fd-border hover:bg-fd-card"
                >
                  <div className="relative w-24 shrink-0 overflow-hidden rounded-lg border border-fd-border/60 bg-fd-card aspect-[4/3]">
                    <ExportedImage
                      src={cover}
                      alt={data.title || ''}
                      fill
                      sizes="(max-width: 640px) 96px, 128px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="text-xs text-fd-muted-foreground flex gap-3">
                      {date ? <span>{date}</span> : null}
                      {data.author ? <span>{data.author}</span> : null}
                    </div>
                    <h3 className="text-base font-semibold text-fd-foreground group-hover:opacity-90">
                      {data.title || related.url}
                    </h3>
                    {data.description ? (
                      <p className="text-sm text-fd-muted-foreground line-clamp-2">{data.description}</p>
                    ) : null}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(
  props: { params: Promise<{ slug?: string[] }> },
): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug || []);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImage(page).url,
    },
  };
}
