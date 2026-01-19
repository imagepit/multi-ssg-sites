import { baseOptions } from '@/lib/layout.shared'
import { getSitemapTree } from '@/lib/source'
import { LayoutContent } from '@/app/LayoutContent'
import { getProfileConfig } from '@/lib/site-config'
export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const { nav, ...base } = baseOptions()
  const isStaticSearch = process.env.NEXT_PUBLIC_SEARCH_STATIC === '1'
  const siteId = process.env.NEXT_PUBLIC_SITE_ID || 'default'
  const profile = getProfileConfig()

  return (
    <LayoutContent
      baseOptions={base}
      nav={{ ...nav, mode: 'top' }}
      tree={getSitemapTree()}
      isStaticSearch={isStaticSearch}
      siteId={siteId}
      profile={profile}
      profileSidebar
      sidebar={{
        collapsible: true,
        className: 'bg-fd-background border-0 border-e-0',
      }}
    >
      {children}
    </LayoutContent>
  )
}
