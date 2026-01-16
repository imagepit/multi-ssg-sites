'use client'

import { useState, useCallback, useEffect } from 'react'
import { create, load, search as oramaSearch } from '@orama/orama'
import DefaultSearchDialog from 'fumadocs-ui/components/dialog/search-default'
import type { SharedProps } from 'fumadocs-ui/components/dialog/search'
import { getSearchIndexUrl } from '@/lib/search-index-url'

interface StaticSearchDialogProps extends SharedProps {
  siteId: string
}

export function StaticSearchDialog({ siteId, ...props }: StaticSearchDialogProps) {
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<any>('empty')
  const [error, setError] = useState<Error | undefined>()
  const [db, setDb] = useState<any>(null)

  // Load the search index once
  useEffect(() => {
    async function loadIndex() {
      try {
        setIsLoading(true)
        const response = await fetch(getSearchIndexUrl(siteId))
        if (!response.ok) {
          throw new Error(`Failed to load search index: ${response.statusText}`)
        }
        const data = await response.json()

        // Create Orama DB with the same schema as the index
        const database = await create({
          schema: {
            url: 'string',
            title: 'string',
            description: 'string',
            content: 'string',
            keywords: 'string',
            breadcrumbs: 'string[]'
          },
          language: 'english'
        })

        // Load the saved data into the database
        await load(database, data)
        setDb(database)
        console.log('[StaticSearchDialog] Database loaded successfully')
      } catch (err) {
        console.error('[StaticSearchDialog] Error loading index:', err)
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    loadIndex()
  }, [siteId])

  // Perform search when input changes (with debounce)
  useEffect(() => {
    if (!db || !search || search.length === 0) {
      setResults('empty')
      return
    }

    const timer = setTimeout(async () => {
      try {
        setIsLoading(true)
        console.log('[StaticSearchDialog] Searching for:', search)

        // Perform search using Orama
        const searchResults = await oramaSearch(db, {
          term: search,
          tolerance: 1,
          properties: ['title', 'content', 'description', 'keywords'],
          boost: {
            title: 2
          }
        })

        // Transform results to match Fumadocs format
        const formattedResults = searchResults.hits.map((hit: any) => ({
          type: 'page',
          content: hit.document.title,
          breadcrumbs: hit.document.breadcrumbs || [],
          id: hit.document.url,
          url: hit.document.url
        }))

        setResults(formattedResults.length > 0 ? formattedResults : 'empty')
        console.log('[StaticSearchDialog] Search results:', formattedResults.length)
      } catch (err) {
        console.error('[StaticSearchDialog] Search error:', err)
        setError(err as Error)
        setResults('empty')
      } finally {
        setIsLoading(false)
      }
    }, 200) // 200ms debounce

    return () => clearTimeout(timer)
  }, [search, db])

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value)
    setError(undefined)
  }, [])

  console.log('[StaticSearchDialog] State:', {
    search,
    isLoading,
    hasDb: !!db,
    resultsCount: Array.isArray(results) ? results.length : results
  })

  return (
    <DefaultSearchDialog
      {...props}
      search={search}
      onSearchChange={handleSearchChange}
      results={results}
      isLoading={isLoading}
      type="static"
    />
  )
}
