'use client'

import { RootProvider } from 'fumadocs-ui/provider/next'
import DefaultSearchDialog from 'fumadocs-ui/components/dialog/search-default'
import { DocsLayout } from 'fumadocs-ui/layouts/notebook'
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'
import type { DocsLayoutProps } from 'fumadocs-ui/layouts/notebook'
import type { PageTree } from 'fumadocs-core/server'
import { CustomStaticSearchDialog } from '@/components/CustomStaticSearchDialog'
import { SharedNavbar } from '@/components/SharedNavbar'
import { ProfileSidebar } from '@/components/ProfileSidebar'
import type { ProfileConfig } from '@/lib/site-config'

interface LayoutContentProps {
  children: React.ReactNode
  baseOptions: Omit<BaseLayoutProps, 'nav'>
  nav: BaseLayoutProps['nav']
  tree: PageTree.Root
  isStaticSearch: boolean
  siteId: string
  sidebar?: Omit<DocsLayoutProps['sidebar'], 'components'>
  containerProps?: React.HTMLAttributes<HTMLDivElement>
  profileSidebar?: boolean
  profile?: ProfileConfig
}

export function LayoutContent({
  children,
  baseOptions,
  nav,
  tree,
  isStaticSearch,
  siteId,
  sidebar,
  containerProps,
  profileSidebar = false,
  profile,
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

  const docsNav = {
    ...(nav ?? {}),
    enabled: false,
    title: null,
  }

  function ProfileSidebarHeader(props: React.ComponentProps<'div'>) {
    const { className, children, ...rest } = props
    return (
      <div
        className={['pt-14 flex flex-col gap-3 p-4 pb-2 empty:hidden', className]
          .filter(Boolean)
          .join(' ')}
        {...rest}
      >
        {children}
        <ProfileSidebar profile={profile} />
      </div>
    )
  }

  const sidebarComponents = {
    Item: () => null,
    Folder: () => null,
    Separator: () => null,
  }

  const docsSidebar = sidebar
    ? {
        ...sidebar,
        banner: profileSidebar ? ProfileSidebarHeader : sidebar?.banner,
        components: sidebarComponents,
      }
    : undefined

  const layoutContainerProps = {
    ...containerProps,
    className: ['dx-shared-navbar', containerProps?.className].filter(Boolean).join(' '),
  }

  return (
    <RootProvider search={searchConfig}>
      <SharedNavbar title={nav.title} links={baseOptions.links} />
      <DocsLayout
        {...baseOptions}
        nav={docsNav}
        tree={tree}
        sidebar={docsSidebar}
        containerProps={layoutContainerProps}
        searchToggle={{ enabled: false }}
        themeSwitch={{ enabled: false }}
      >
        {children}
      </DocsLayout>
    </RootProvider>
  )
}
