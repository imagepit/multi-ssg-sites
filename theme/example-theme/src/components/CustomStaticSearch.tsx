'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import DefaultSearchDialog from 'fumadocs-ui/components/dialog/search-default'
import type { SharedProps } from 'fumadocs-ui/components/dialog/search'

interface SearchIndex {
  url: string
  title: string
  description: string
  content: string
  keywords: string
}

interface OramaData {
  type: string
  docs?: {
    docs: Array<{
      i: {
        url: string
        title: string
        description: string
        content: string
        keywords: string
      }
    }>
  }
}

// Simple Japanese-aware tokenizer
function tokenize(text: string): string[] {
  if (!text) return []

  text = text.toLowerCase().trim()
  const tokens: string[] = []

  // Split by whitespace and punctuation
  const words = text.split(/[\s\u3000,、。！？\.\!\?]+/)

  for (const word of words) {
    if (!word) continue

    // Japanese text: split into characters and also keep the whole word
    if (/[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9fff]/.test(word)) {
      // Add individual characters for Japanese text
      tokens.push(...word.split(''))
      // Also add the complete word
      tokens.push(word)
    } else {
      // Non-Japanese text: just add the word
      tokens.push(word)
    }
  }

  return Array.from(new Set(tokens.filter(Boolean)))
}

function searchInText(query: string, text: string): boolean {
  if (!query || !text) return false

  const queryLower = query.toLowerCase()
  const textLower = text.toLowerCase()

  // Direct substring match (fastest)
  if (textLower.includes(queryLower)) return true

  // Tokenized match for better Japanese support
  const queryTokens = tokenize(query)
  const textTokens = tokenize(text)

  // Check if all query tokens are found in text tokens
  return queryTokens.every(qt =>
    textTokens.some(tt => tt.includes(qt) || qt.includes(tt))
  )
}

function searchScore(query: string, item: SearchIndex): number {
  let score = 0

  // Title match (highest priority)
  if (searchInText(query, item.title)) {
    score += 100
    // Exact match in title gets bonus
    if (item.title.toLowerCase().includes(query.toLowerCase())) {
      score += 50
    }
  }

  // URL match
  if (searchInText(query, item.url)) {
    score += 30
  }

  // Description match
  if (searchInText(query, item.description)) {
    score += 20
  }

  // Content match (lowest priority)
  if (searchInText(query, item.content)) {
    score += 10
  }

  // Keywords match
  if (searchInText(query, item.keywords)) {
    score += 15
  }

  return score
}

let indexCache: SearchIndex[] | null = null
let loadingPromise: Promise<SearchIndex[]> | null = null

async function loadSearchIndex(siteId: string): Promise<SearchIndex[]> {
  if (indexCache) return indexCache

  // If already loading, wait for it
  if (loadingPromise) return loadingPromise

  loadingPromise = (async () => {
    try {
      const response = await fetch(`/search-indexes/${siteId}.json`)
      if (!response.ok) {
        console.error('[CustomStaticSearch] Failed to load index:', response.statusText)
        return []
      }

      const data: OramaData = await response.json()

      // Extract documents from Orama format
      const docs: SearchIndex[] = []

      if (data.type === 'simple' && data.docs?.docs) {
        // Parse Orama simple format
        for (const doc of data.docs.docs) {
          if (doc.i) {
            docs.push(doc.i)
          }
        }
      }

      console.log('[CustomStaticSearch] Loaded', docs.length, 'documents')
      indexCache = docs
      return docs
    } catch (error) {
      console.error('[CustomStaticSearch] Error loading index:', error)
      return []
    }
  })()

  return loadingPromise
}

export interface CustomStaticSearchProps extends SharedProps {
  siteId: string
}

export function CustomStaticSearch({ siteId, ...props }: CustomStaticSearchProps) {
  const [search, setSearch] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [index, setIndex] = useState<SearchIndex[] | null>(null)

  // Load index on mount
  useEffect(() => {
    loadSearchIndex(siteId).then(setIndex)
  }, [siteId])

  // Perform search when query changes
  useEffect(() => {
    if (!search || !search.trim() || !index) {
      setResults([])
      return
    }

    setIsLoading(true)

    // Debounce search
    const timer = setTimeout(() => {
      const query = search.trim()

      // Score and filter results
      const scored = index
        .map(item => ({
          item,
          score: searchScore(query, item)
        }))
        .filter(r => r.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)

      // Convert to Fumadocs format
      const formattedResults = scored.map(r => ({
        id: r.item.url,
        type: 'page' as const,
        content: r.item.title,
        url: `${r.item.url}?q=${encodeURIComponent(query)}`
      }))

      console.log('[CustomStaticSearch] Found', formattedResults.length, 'results for:', query)
      setResults(formattedResults)
      setIsLoading(false)
    }, 200)

    return () => {
      clearTimeout(timer)
      setIsLoading(false)
    }
  }, [search, index])

  return (
    <DefaultSearchDialog
      {...props}
      type="static"
      api={`/search-indexes/${siteId}.json`}
    />
  )
}