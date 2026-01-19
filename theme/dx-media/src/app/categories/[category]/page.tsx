import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { source } from '@/lib/source'
import { baseOptions } from '@/lib/layout.shared'
import { HomeContent } from '@/app/HomeContent'
import { filterIndexPages, getCategoryList, hasCategory, normalizeCategoryParam } from '@/lib/content-utils'
import { PostIndexLayout } from '@/components/PostIndexLayout'

export default async function CategoryPage(props: { params: Promise<{ category: string }> }) {
  const params = await props.params
  const category = normalizeCategoryParam(params.category)
  const pages = filterIndexPages(source.getPages())
  const matches = pages.filter((page) => hasCategory(page.data, category))

  if (matches.length === 0) notFound()

  const base = baseOptions()
  const isStaticSearch = process.env.NEXT_PUBLIC_SEARCH_STATIC === '1'
  const siteId = process.env.NEXT_PUBLIC_SITE_ID || 'default'

  return (
    <HomeContent baseOptions={base} isStaticSearch={isStaticSearch} siteId={siteId}>
      <PostIndexLayout pages={matches} header={{ kicker: 'カテゴリー', title: category }} />
    </HomeContent>
  )
}

export async function generateStaticParams() {
  const pages = filterIndexPages(source.getPages())
  const categories = new Set<string>()
  for (const page of pages) {
    for (const category of getCategoryList(page.data)) categories.add(category)
  }
  return [...categories].map((category) => ({ category }))
}

export async function generateMetadata(
  props: { params: Promise<{ category: string }> },
): Promise<Metadata> {
  const params = await props.params
  const category = normalizeCategoryParam(params.category)
  return {
    title: category,
  }
}
