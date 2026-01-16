'use client'

import { useEffect, useState, useCallback } from 'react'
import type { SharedProps } from 'fumadocs-ui/components/dialog/search'

interface SearchIndex {
  id: string
  title: string
  description: string
  url: string
  content: string
  structuredData: {
    headings: any[]
    contents: Array<{
      heading: string
      content: string
    }>
  }
}

interface SearchResult {
  id: string
  type: 'page'
  content: string
  url: string
}

// Simple Japanese-aware tokenizer
function tokenize(text: string): string[] {
  if (!text) return []

  text = text.toLowerCase().trim()
  const tokens: string[] = []
  const words = text.split(/\s+/)

  for (const word of words) {
    if (/[\u3040-\u30ff\u3400-\u9fff]/.test(word)) {
      tokens.push(...word.split(''))
      tokens.push(word)
    } else {
      tokens.push(word)
    }
  }

  return Array.from(new Set(tokens.filter(Boolean)))
}

function matchScore(query: string, item: SearchIndex): number {
  const queryTokens = tokenize(query)
  if (queryTokens.length === 0) return 0

  let score = 0

  const titleTokens = tokenize(item.title)
  for (const qt of queryTokens) {
    if (titleTokens.some(tt => tt.includes(qt) || qt.includes(tt))) {
      score += 10
    }
  }

  if (item.description) {
    const descTokens = tokenize(item.description)
    for (const qt of queryTokens) {
      if (descTokens.some(dt => dt.includes(qt) || qt.includes(dt))) {
        score += 5
      }
    }
  }

  if (item.content) {
    const contentLower = item.content.toLowerCase()
    for (const qt of queryTokens) {
      if (contentLower.includes(qt)) {
        score += 1
      }
    }
  }

  return score
}

let searchIndexCache: SearchIndex[] | null = null

async function loadSearchIndex(siteId: string): Promise<SearchIndex[]> {
  if (searchIndexCache) {
    console.log('[StaticSearch] Using cached index, entries:', searchIndexCache.length)
    return searchIndexCache
  }

  try {
    console.log('[StaticSearch] Loading search index for site:', siteId)
    const response = await fetch(`/search-indexes/${siteId}.json`)
    if (!response.ok) {
      console.error('[StaticSearch] Failed to load search index:', response.statusText)
      return []
    }

    searchIndexCache = await response.json()
    console.log('[StaticSearch] Loaded search index, entries:', searchIndexCache?.length || 0)
    return searchIndexCache!
  } catch (error) {
    console.error('[StaticSearch] Error loading search index:', error)
    return []
  }
}

export function useStaticSearch(siteId: string): SharedProps['search'] {
  const [index, setIndex] = useState<SearchIndex[] | null>(null)

  useEffect(() => {
    loadSearchIndex(siteId).then(setIndex)
  }, [siteId])

  const search = useCallback(
    async (query: string): Promise<SearchResult[]> => {
      console.log('[StaticSearch] Search called with query:', query, 'index loaded:', !!index, 'index length:', index?.length || 0)

      if (!query || !query.trim() || !index) {
        console.log('[StaticSearch] Early return - query empty or index not loaded')
        return []
      }

      const scoredResults = index.map(item => ({
        item,
        score: matchScore(query, item),
      }))

      console.log('[StaticSearch] Scored results:', scoredResults.filter(r => r.score > 0).length, 'matches out of', index.length)

      const results = scoredResults
        .filter(r => r.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
        .map(r => ({
          id: r.item.id,
          type: 'page' as const,
          content: r.item.title,
          url: `${r.item.url}?q=${encodeURIComponent(query)}`,
        }))

      console.log('[StaticSearch] Returning', results.length, 'results')
      return results
    },
    [index]
  )

  return search
}