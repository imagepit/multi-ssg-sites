'use client'

import Link from 'next/link'
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'
import { NavRightControls } from '@/components/NavRightControls'

type SharedNavbarProps = {
  title?: BaseLayoutProps['nav'] extends { title?: infer T } ? T : React.ReactNode
  links?: BaseLayoutProps['links']
}

function isPrimaryLink(item: NonNullable<SharedNavbarProps['links']>[number]) {
  if (!('url' in item)) return false
  return item.type === undefined || item.type === 'main'
}

export function SharedNavbar({ title, links = [] }: SharedNavbarProps) {
  return (
    <header id="nd-nav" className="sticky top-0 z-40">
      <div className="border-b bg-fd-background/80 backdrop-blur-lg">
        <nav className="flex h-14 w-full items-center gap-6 px-4">
          <Link href="/" className="flex items-center gap-2.5 font-semibold shrink-0">
            {title ?? 'Home'}
          </Link>

          <div className="hidden lg:flex flex-1 items-center justify-start gap-6 text-sm text-fd-muted-foreground">
            {links.filter(isPrimaryLink).map((item, i) => (
              <Link
                key={`${String(item.url)}-${i}`}
                href={item.url || '#'}
                className="transition-colors hover:text-fd-foreground"
              >
                {item.text}
              </Link>
            ))}
          </div>

          <div className="ms-auto flex items-center gap-2">
            <div className="hidden lg:flex">
              <NavRightControls variant="lg" />
            </div>
            <div className="flex lg:hidden">
              <NavRightControls variant="sm" />
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}
