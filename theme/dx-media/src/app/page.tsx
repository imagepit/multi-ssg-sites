import { source } from '@/lib/source'
import { baseOptions } from '@/lib/layout.shared'
import { HomeContent } from '@/app/HomeContent'
import { filterIndexPages } from '@/lib/content-utils'
import { PostIndexLayout } from '@/components/PostIndexLayout'

export default async function HomePage() {
  const base = baseOptions()
  const isStaticSearch = process.env.NEXT_PUBLIC_SEARCH_STATIC === '1'
  const siteId = process.env.NEXT_PUBLIC_SITE_ID || 'default'
  const pages = filterIndexPages(source.getPages())

  return (
    <HomeContent baseOptions={base} isStaticSearch={isStaticSearch} siteId={siteId}>
      <PostIndexLayout
        pages={pages}
        header={{ kicker: 'DX Tech Media', title: '最新ニュース' }}
      />
    </HomeContent>
  )
}
