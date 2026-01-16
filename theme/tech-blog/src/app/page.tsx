import Link from 'next/link'
import { source } from '@/lib/source'
import PostList from '../components/PostList'

export default async function HomePage() {
  // Simple list of pages; in future sort/filter by date/tags from frontmatter
  const pages = source.getPages().filter(p => p.url !== '/llms-full.txt' && p.url !== '/tags')
  const sorted = pages.sort((a,b) => {
    const da = (a.data as any).date ? new Date((a.data as any).date) : new Date(0)
    const db = (b.data as any).date ? new Date((b.data as any).date) : new Date(0)
    return db.getTime() - da.getTime()
  })
  return (
    <div>
      <h1>Latest Posts</h1>
      <PostList posts={sorted.slice(0, 20) as any} />
      <p><Link href="/tags">Browse by tags →</Link></p>
    </div>
  )
}
