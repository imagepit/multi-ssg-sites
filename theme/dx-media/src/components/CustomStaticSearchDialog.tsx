'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { create, load, search as oramaSearch, getByID } from '@orama/orama'
import { useRouter } from 'next/navigation'
import {
  SearchDialog,
  SearchDialogHeader,
  SearchDialogInput,
  SearchDialogContent,
  SearchDialogList,
  SearchDialogListItem,
  SearchDialogFooter,
  SearchDialogClose,
  SearchDialogIcon,
  SearchDialogOverlay
} from 'fumadocs-ui/components/dialog/search'
import type { SharedProps, SearchItemType } from 'fumadocs-ui/components/dialog/search'
import { getSearchIndexUrl } from '@/lib/search-index-url'

// Create content highlighter for search term highlighting
function createContentHighlighter(query: string) {
  const buildRegex = (q: string) => {
    try {
      // 検索語を単語ごとに分割してエスケープ
      const terms = q.trim().split(/\s+/).filter(Boolean)
      if (terms.length === 0) return null

      const pattern = terms.map(term =>
        term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      ).join('|')

      return new RegExp(pattern, 'gi')
    } catch {
      return null
    }
  }

  const regex = buildRegex(query)

  return {
    highlight(content: string) {
      if (!regex) return [{ type: 'text' as const, content }]

      const out: Array<{ type: 'text', content: string, styles?: { highlight?: boolean } }> = []
      let lastIndex = 0

      for (const match of content.matchAll(regex)) {
        if (match.index !== undefined && lastIndex < match.index) {
          out.push({
            type: 'text',
            content: content.substring(lastIndex, match.index)
          })
        }
        out.push({
          type: 'text',
          content: match[0],
          styles: { highlight: true }
        })
        lastIndex = (match.index || 0) + match[0].length
      }

      if (lastIndex < content.length) {
        out.push({
          type: 'text',
          content: content.substring(lastIndex)
        })
      }

      return out
    }
  }
}

interface CustomStaticSearchDialogProps extends SharedProps {
  siteId: string
  links?: Array<[string, string]>
}

export function CustomStaticSearchDialog({ siteId, links = [], ...props }: CustomStaticSearchDialogProps) {
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<SearchItemType[]>([])
  const [db, setDb] = useState<any>(null)
  const router = useRouter()

  // Load the search index once
  useEffect(() => {
    async function loadIndex() {
      try {
        const response = await fetch(getSearchIndexUrl(siteId))
        if (!response.ok) {
          throw new Error(`Failed to load search index: ${response.statusText}`)
        }
        const data = await response.json()

        // Create Orama DB with the same schema as the index
        const database = await create({
          schema: {
            id: 'string',
            type: 'string',
            page_id: 'string',
            url: 'string',
            title: 'string',
            description: 'string',
            content: 'string',
            keywords: 'string',
            breadcrumbs: 'string[]'
          }
        })

        // Load the saved data into the database
        await load(database, data)
        setDb(database)
      } catch (err) {
        console.error('[CustomStaticSearchDialog] Error loading index:', err)
      }
    }

    if (props.open) {
      loadIndex()
    }
  }, [siteId, props.open])

  // Perform search when input changes (with debounce)
  useEffect(() => {
    if (!db || !search || search.length === 0) {
      setResults([])
      return
    }

    const timer = setTimeout(async () => {
      try {
        setIsLoading(true)

        // Perform search using Orama with groupBy (advanced search pattern)
        const searchResults = await oramaSearch(db, {
          term: search,
          tolerance: 2,
          properties: ['title', 'content', 'description', 'keywords'],
          boost: {
            title: 3,
            description: 2,
            keywords: 2,
            content: 1
          },
          groupBy: {
            properties: ['page_id'],
            maxResult: 8
          },
          threshold: 0.0
        })

        // Create highlighter for the current search query
        const highlighter = createContentHighlighter(search)

        // Format results using advanced search pattern (page + headings)
        const formattedResults: SearchItemType[] = []

        for (const group of (searchResults as any).groups ?? []) {
          const pageId = group.values[0]

          // Get page document by ID using Orama's getByID
          const pageDoc = getByID(db, pageId)
          if (!pageDoc) continue

          // Add page entry
          const pageEntry = {
            type: 'page' as const,
            content: pageDoc.title || pageDoc.content,
            contentWithHighlights: highlighter.highlight(pageDoc.title || pageDoc.content),
            breadcrumbs: pageDoc.breadcrumbs || [],
            id: pageId,
            url: pageDoc.url
          }
          formattedResults.push(pageEntry)

          // Add heading entries for this page
          for (const hit of group.result ?? []) {
            const doc = hit.document
            if (doc.type === 'page') continue // Skip page type in group results

            const headingEntry = {
              type: doc.type as 'heading',
              content: doc.content,
              contentWithHighlights: highlighter.highlight(doc.content),
              breadcrumbs: [], // Empty breadcrumbs for headings (only show on page)
              id: doc.id,
              url: doc.url
            }
            formattedResults.push(headingEntry)
          }
        }

        setResults(formattedResults)
      } catch (err) {
        console.error('[CustomStaticSearchDialog] Search error:', err)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 200)

    return () => clearTimeout(timer)
  }, [search, db])

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value)
  }, [])

  // デフォルトリンク（検索が空の時に表示）
  const defaultItems = links.length > 0
    ? links.map(([name, link]) => ({
        type: 'page' as const,
        id: name,
        content: name,
        url: link,
      }))
    : null

  return (
    <SearchDialog
      {...props}
      search={search}
      onSearchChange={handleSearchChange}
      isLoading={isLoading}
    >
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput
            placeholder="検索..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          <SearchDialogClose />
        </SearchDialogHeader>

        <SearchDialogList
          items={results.length > 0 ? results : (search.length === 0 ? defaultItems : null)}
          Empty={() => (
            <div className="py-12 text-center text-sm text-muted-foreground">
              {search ? '検索結果がありません' : 'キーワードを入力してください'}
            </div>
          )}
          Item={(itemProps) => (
            <SearchDialogListItem
              {...itemProps}
              onClick={() => {
                const url = new URL(itemProps.item.url, window.location.origin)
                // itemProps.item.url already contains the full path with hash
                // e.g., "/getting-started/overview#ビルド"
                // Add search query parameter for highlighting
                if (search) {
                  // Parse to add query parameter while preserving hash                
                  url.searchParams.set('q', search)
                }
                router.push(url.pathname + url.search + url.hash)
                props.onOpenChange?.(false)
              }}
            />
          )}
        />

        <SearchDialogFooter>
          <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
            <span>Enter</span>
            <span>選択</span>
            <span className="ml-2">Esc</span>
            <span>閉じる</span>
          </div>
        </SearchDialogFooter>
      </SearchDialogContent>
    </SearchDialog>
  )
}
