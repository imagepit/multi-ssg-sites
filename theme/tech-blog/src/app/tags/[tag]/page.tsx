import Link from 'next/link'
import { notFound } from 'next/navigation'
import { source } from '@/lib/source'

export default async function TagDetail(props: { params: Promise<{ tag: string }> }) {
  const { tag } = await props.params
  const pages = source.getPages()
  const posts = pages.filter((p) => Array.isArray((p.data as any).tags) && ((p.data as any).tags as string[]).includes(tag))
  if (posts.length === 0) return notFound()
  return (
    <div>
      <h1>Tag: {tag}</h1>
      <ul className="tb-post-list">
        {posts.map((p) => (
          <li key={p.url} className="tb-post-item">
            <div className="tb-post-title"><Link href={p.url}>{p.data.title || p.url}</Link></div>
            {p.data.description ? (
              <div className="tb-post-meta">{p.data.description}</div>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  )
}

export async function generateStaticParams() {
  const pages = source.getPages()
  const tags = new Set<string>()
  for (const p of pages) {
    const t = (p.data as any).tags as string[] | undefined
    if (!t) continue
    for (const x of t) tags.add(x)
  }
  return [...tags].map((tag) => ({ tag }))
}

