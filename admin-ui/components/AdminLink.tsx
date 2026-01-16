'use client'

import { forwardRef } from 'react'

type AdminLinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href?: string
  prefetch?: boolean
  external?: boolean
}

function isExternalHref(href: string) {
  return /^[a-z][a-z0-9+.-]*:/.test(href) || href.startsWith('//')
}

export const AdminLink = forwardRef<HTMLAnchorElement, AdminLinkProps>(
  ({ href = '#', external, prefetch: _prefetch, rel, target, ...rest }, ref) => {
    const isExternal = external ?? isExternalHref(href)
    if (isExternal) {
      return (
        <a
          ref={ref}
          href={href}
          rel={rel ?? 'noreferrer noopener'}
          target={target ?? '_blank'}
          {...rest}
        />
      )
    }
    return <a ref={ref} href={href} {...rest} />
  },
)

AdminLink.displayName = 'AdminLink'
