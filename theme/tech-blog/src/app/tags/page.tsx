import Link from 'next/link'
import { source } from '@/lib/source'

export default async function TagsPage() {
  const pages = source.getPages()
  const tagMap = new Map<string, number>()
  for (const p of pages) {
    const tags = (p.data as any).tags as string[] | undefined
    if (!tags) continue
    for (const t of tags) tagMap.set(t, (tagMap.get(t) || 0) + 1)
  }
  const tags = [...tagMap.entries()].sort((a,b)=> a[0].localeCompare(b[0]))
  return (
    <div>
      <h1>Tags</h1>
      <ul>
        {tags.map(([tag, count]) => (
          <li key={tag}><Link href={`/tags/${encodeURIComponent(tag)}`}>{tag}</Link> ({count})</li>
        ))}
      </ul>
    </div>
  )
}

