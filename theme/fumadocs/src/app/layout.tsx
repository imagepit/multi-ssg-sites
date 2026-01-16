import '@/app/global.css';
import { baseOptions } from '@/lib/layout.shared';
import { getSitemapTree } from '@/lib/source';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import { getBranding, getSiteLanguage, getSiteName, getThemePrimary } from '@/lib/site-config';
import { buildThemeCssFromPrimary } from '@/lib/theme-derive';
import { LayoutContent } from './LayoutContent';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: getSiteName() ?? 'Documentation',
  icons: (() => {
    const { favicon } = getBranding();
    return favicon ? { icon: `/brand/${favicon}` } : undefined;
  })(),
  openGraph: (() => {
    const { ogImage } = getBranding();
    return ogImage ? { images: [`/brand/${ogImage}`] } : undefined;
  })(),
};

export default function Layout({ children }: LayoutProps<'/'>) {
  const { nav, ...base } = baseOptions();
  const lang = getSiteLanguage() ?? 'en';
  const primary = getThemePrimary() ?? undefined;
  const isStaticSearch = process.env.NEXT_PUBLIC_SEARCH_STATIC === '1';
  const siteId = process.env.NEXT_PUBLIC_SITE_ID || 'default';

  return (
    <html lang={lang} className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <style
          // Inject derived theme variables for both light and dark
          dangerouslySetInnerHTML={{ __html: buildThemeCssFromPrimary(primary) }}
        />
        <LayoutContent
          baseOptions={base}
          nav={{ ...nav, mode: 'top' }}
          tree={getSitemapTree()}
          isStaticSearch={isStaticSearch}
          siteId={siteId}
        >
          {children}
        </LayoutContent>
      </body>
    </html>
  );
}
