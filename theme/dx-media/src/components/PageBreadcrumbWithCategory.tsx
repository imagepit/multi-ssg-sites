'use client'

import type { ComponentProps } from 'react'
import { useMemo } from 'react'
import Link from 'fumadocs-core/link'
import { ChevronRight } from 'lucide-react'
import { getBreadcrumbItemsFromPath, type BreadcrumbOptions } from 'fumadocs-core/breadcrumb'
import { useTreeContext, useTreePath } from 'fumadocs-ui/contexts/tree'
import { cn } from '@/lib/utils'
import { getCategoryHref } from '@/lib/content-utils'

type PageBreadcrumbWithCategoryProps = BreadcrumbOptions &
  ComponentProps<'div'> & {
    category?: string | null
  }

export function PageBreadcrumbWithCategory({
  category,
  includeRoot,
  includeSeparator,
  includePage,
  className,
  ...props
}: PageBreadcrumbWithCategoryProps) {
  const path = useTreePath()
  const { root } = useTreeContext()

  const items = useMemo(() => {
    return getBreadcrumbItemsFromPath(root, path, {
      includeRoot,
      includeSeparator,
      includePage,
    })
  }, [includePage, includeRoot, includeSeparator, path, root])

  const categoryLabel = typeof category === 'string' ? category.trim() : ''
  const categoryUrl = categoryLabel ? getCategoryHref(categoryLabel) : null

  const mergedItems = useMemo(() => {
    if (!categoryUrl) return items

    const updated = items.map((item) => ({ ...item }))
    let applied = false
    const normalizedCategory = categoryLabel.toLocaleLowerCase()
    for (let i = 0; i < updated.length; i += 1) {
      if (typeof updated[i].name !== 'string') continue
      if (updated[i].name.toLocaleLowerCase() !== normalizedCategory) continue
      updated[i].name = categoryLabel
      updated[i].url = categoryUrl
      applied = true
      break
    }

    if (!applied) {
      const insertIndex = includePage && updated.length > 0 ? Math.max(updated.length - 1, 0) : updated.length
      updated.splice(insertIndex, 0, { name: categoryLabel, url: categoryUrl })
    }

    return updated
  }, [categoryLabel, categoryUrl, includePage, items])

  if (mergedItems.length === 0) return null

  return (
    <div {...props} className={cn('flex items-center gap-1.5 text-sm text-fd-muted-foreground', className)}>
      {mergedItems.map((item, i) => {
        const isLast = i === mergedItems.length - 1
        const itemClassName = cn('truncate', isLast && 'text-fd-primary font-medium')
        return (
          <span key={`${String(item.name)}-${i}`} className="inline-flex items-center gap-1.5">
            {i !== 0 ? <ChevronRight className="size-3.5 shrink-0" /> : null}
            {item.url ? (
              <Link href={item.url} className={cn(itemClassName, 'transition-opacity hover:opacity-80')}>
                {item.name}
              </Link>
            ) : (
              <span className={itemClassName}>{item.name}</span>
            )}
          </span>
        )
      })}
    </div>
  )
}
