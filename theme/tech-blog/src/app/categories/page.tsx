import Link from 'next/link'
import { source } from '@/lib/source'

export default async function CategoriesPage() {
  const pages = source.getPages()
  const map = new Map<string, number>()
  for (const p of pages) {
    const c = (p.data as any).category as string | undefined
    if (!c) continue
    map.set(c, (map.get(c) || 0) + 1)
  }
  const cats = [...map.entries()].sort((a,b)=> a[0].localeCompare(b[0]))
  return (
    <div>
      <h1>Categories</h1>
      <ul>
        {cats.map(([c, count]) => (
          <li key={c}><Link href={`/categories/${encodeURIComponent(c)}`}>{c}</Link> ({count})</li>
        ))}
      </ul>
    </div>
  )
}

