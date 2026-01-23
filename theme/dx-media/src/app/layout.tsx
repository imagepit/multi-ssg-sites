import '@/app/global.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import { getBranding, getSiteLanguage, getSiteName, getThemePrimary } from '@/lib/site-config';
import { buildThemeCssFromPrimary } from '@/lib/theme-derive';
import { AuthProviderWrapper } from '@/contexts/AuthProviderWrapper';

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

export default function Layout({ children }: { children: React.ReactNode }) {
  const lang = getSiteLanguage() ?? 'en';
  const primary = getThemePrimary() ?? undefined;

  return (
    <html lang={lang} className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <style
          // Inject derived theme variables for both light and dark
          dangerouslySetInnerHTML={{ __html: buildThemeCssFromPrimary(primary) }}
        />
        <AuthProviderWrapper>
          {children}
        </AuthProviderWrapper>
      </body>
    </html>
  );
}
