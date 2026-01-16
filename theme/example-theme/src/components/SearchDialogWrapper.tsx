'use client'

import DefaultSearchDialog from 'fumadocs-ui/components/dialog/search-default'
import { useStaticSearch } from './StaticSearchProvider'

export function SearchDialogWrapper() {
  const siteId = process.env.NEXT_PUBLIC_SITE_ID || 'default'
  const isStatic = process.env.NEXT_PUBLIC_SEARCH_STATIC === '1'

  if (isStatic) {
    const search = useStaticSearch(siteId)
    return <DefaultSearchDialog search={search} />
  }

  return <DefaultSearchDialog api="/api/search" />
}