'use client'

import { RootProvider } from 'fumadocs-ui/provider'
import DefaultSearchDialog from 'fumadocs-ui/components/dialog/search-default'
import { DocsLayout } from 'fumadocs-ui/layouts/notebook'
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'
import type { PageTree } from 'fumadocs-core/server'
import { CustomStaticSearchDialog } from '@/components/CustomStaticSearchDialog'

interface LayoutContentProps {
  children: React.ReactNode
  baseOptions: Omit<BaseLayoutProps, 'nav'>
  nav: BaseLayoutProps['nav']
  tree: PageTree.Root
  isStaticSearch: boolean
  siteId: string
}

export function LayoutContent({
  children,
  baseOptions,
  nav,
  tree,
  isStaticSearch,
  siteId,
}: LayoutContentProps) {
  // クライアントコンポーネントで直接環境変数を読み取る
  const isStaticSearchActual = process.env.NEXT_PUBLIC_SEARCH_STATIC === '1'
  const siteIdActual = process.env.NEXT_PUBLIC_SITE_ID || siteId || 'default'

  const searchConfig = isStaticSearchActual
    ? {
        enabled: true,
        // 静的検索にはCustomStaticSearchDialogを使用
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

  return (
    <RootProvider search={searchConfig}>
      <DocsLayout {...baseOptions} nav={nav} tree={tree}>
        {children}
      </DocsLayout>
    </RootProvider>
  )
}