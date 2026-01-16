import Link from 'next/link'
import { notFound } from 'next/navigation'
import { source } from '@/lib/source'

export default async function CategoryDetail(props: { params: Promise<{ category: string }> }) {
  const { category } = await props.params
  const pages = source.getPages()
  const posts = pages.filter((p) => (p.data as any).category === category)
  if (posts.length === 0) return notFound()
  return (
    <div>
      <h1>Category: {category}</h1>
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
  const cats = new Set<string>()
  for (const p of pages) {
    const c = (p.data as any).category as string | undefined
    if (c) cats.add(c)
  }
  return [...cats].map((category) => ({ category }))
}

