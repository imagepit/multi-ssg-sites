'use client'

import { RootProvider } from 'fumadocs-ui/provider/next'
import { DocsLayout } from 'fumadocs-ui/layouts/notebook'
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'
import { adminTree } from '../lib/admin-tree'
import { SitePicker } from './SitePicker'
import { AdminSidebarHeader } from './AdminSidebarHeader'
import { AdminLink } from './AdminLink'

const baseLayout: BaseLayoutProps = {
  nav: {
    enabled: false,
  },
  searchToggle: {
    enabled: false,
  },
  themeSwitch: {
    enabled: false,
  },
  links: [],
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootProvider
      search={{ enabled: false }}
      theme={{ enabled: false }}
      components={{ Link: AdminLink }}
    >
      <DocsLayout
        {...baseLayout}
        nav={baseLayout.nav}
        tree={adminTree}
        sidebar={{
          collapsible: true,
          defaultOpenLevel: 1,
          banner: <AdminSidebarHeader />,
          footer: (
            <div className="admin-sidebar-footer">
              <SitePicker />
            </div>
          ),
        }}
        containerProps={{ className: 'admin-shell' }}
      >
        <div className="admin-content">{children}</div>
      </DocsLayout>
    </RootProvider>
  )
}
