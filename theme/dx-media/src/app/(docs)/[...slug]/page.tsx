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

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const page = source.getPage(params.slug || []);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage 
    toc={page.data.toc} 
    full={page.data.full}
    breadcrumb={{
      enabled: true,
      includeRoot: true,
      includePage: true,
      includeSeparator: true
    }}>
      <DocsTitle className="mt-4 text-bold text-4xl">{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0 mt-4 text-md text-fd-muted-foreground">{page.data.description}</DocsDescription>
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
