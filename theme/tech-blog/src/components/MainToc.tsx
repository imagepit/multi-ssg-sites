"use client"
import { useEffect, useMemo, useState } from 'react'

type TocItem = { depth: number; value: string; id: string }

export default function MainToc({ toc }: { toc?: TocItem[] }) {
  if (!toc || toc.length === 0) return null
  const [activeId, setActiveId] = useState<string | null>(null)

  // observe headings in the document to update activeId
  useEffect(() => {
    const ids = toc.map((t) => t.id).filter(Boolean)
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el)

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // pick the entry closest to the top that is intersecting
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setActiveId(visible[0].target.id)
        else {
          // when none intersecting, find the last heading above the viewport
          const above = elements
            .filter((el) => el.getBoundingClientRect().top < 80)
            .sort((a, b) => b.getBoundingClientRect().top - a.getBoundingClientRect().top)
          if (above[0]) setActiveId(above[0].id)
        }
      },
      {
        // consider a heading active when it reaches 20% from the top
        rootMargin: '-20% 0% -70% 0%',
        threshold: [0, 0.25, 0.5, 1],
      },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [toc])
  return (
    <aside className="tb-toc">
      <div className="tb-toc-title">On this page</div>
      <ul className="tb-toc-list">
        {toc.map((h, i) => {
          const key = `${h.id || h.value || 'h'}-${i}`
          const isActive = activeId === h.id
          return (
            <li key={key} className={`lvl-${h.depth}`}>
              <a href={`#${h.id}`} className={isActive ? 'active' : undefined}>
                {h.value}
              </a>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
