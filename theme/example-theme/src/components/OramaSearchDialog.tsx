'use client'

import { useDocsSearch } from 'fumadocs-core/search/client'
import { create } from '@orama/orama'
import DefaultSearchDialog from 'fumadocs-ui/components/dialog/search-default'
import type { SharedProps } from 'fumadocs-ui/components/dialog/search'

// Orama初期化関数（日本語対応）
function initOrama(locale?: string) {
  return create({
    schema: {
      url: 'string',
      title: 'string',
      description: 'string',
      content: 'string',
      keywords: 'string',
      breadcrumbs: 'string[]' // Required by Fumadocs simple search
    },
    // 日本語はenglishにフォールバック（Oramaの制限）
    language: 'english'
  })
}

interface OramaSearchDialogProps extends SharedProps {
  siteId: string
}

export function OramaSearchDialog({ siteId, ...props }: OramaSearchDialogProps) {
  // Fumadocs公式のuseDocsSearchを使用
  const { search, setSearch, query } = useDocsSearch({
    type: 'static',
    // 静的検索インデックスのURL（プレビルドされたOrama形式のインデックス）
    from: `/search-indexes/${siteId}.json`,
    // Orama初期化
    initOrama,
    delayMs: 200,
  })

  console.log('[OramaSearchDialog] search:', search, 'query:', query, 'siteId:', siteId)

  return (
    <DefaultSearchDialog
      {...props}
      search={search}
      onSearchChange={setSearch}
      isLoading={query.isLoading}
      api="/api/search"
      type="static"
      delayMs={200}
    />
  )
}