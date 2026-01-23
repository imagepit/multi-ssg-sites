'use client'

import { RootProvider } from 'fumadocs-ui/provider/next'
import DefaultSearchDialog from 'fumadocs-ui/components/dialog/search-default'
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'
import { CustomStaticSearchDialog } from '@/components/CustomStaticSearchDialog'
import { SharedNavbar } from '@/components/SharedNavbar'

interface HomeContentProps {
  children: React.ReactNode
  baseOptions: BaseLayoutProps
  isStaticSearch: boolean
  siteId: string
}

export function HomeContent({ children, baseOptions, isStaticSearch, siteId }: HomeContentProps) {
  const isStaticSearchActual = process.env.NEXT_PUBLIC_SEARCH_STATIC === '1'
  const siteIdActual = process.env.NEXT_PUBLIC_SITE_ID || siteId || 'default'

  const searchConfig = isStaticSearchActual
    ? {
        enabled: true,
        SearchDialog: CustomStaticSearchDialog,
        options: {
          siteId: siteIdActual,
        },
      }
    : {
        enabled: true,
        SearchDialog: DefaultSearchDialog,
        options: {
          type: 'fetch' as const,
          api: '/api/search',
          delayMs: 120,
        },
      }

  // PostIndexLayout は独自のルートラッパーを持つため、HomeLayout は不要
  return (
    <RootProvider search={searchConfig}>
      <SharedNavbar title={baseOptions.nav?.title} links={baseOptions.links} />
      {children}
    </RootProvider>
  )
}
