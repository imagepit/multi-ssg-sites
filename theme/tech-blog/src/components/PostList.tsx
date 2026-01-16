import Link from 'next/link'

type PostLike = {
  url: string
  data: { title?: string; description?: string; date?: string | Date }
}

export default function PostList({ title, posts }: { title?: string; posts: PostLike[] }) {
  const fmt = (d?: string | Date) => {
    if (!d) return ''
    try { const dt = typeof d === 'string' ? new Date(d) : d; return dt.toISOString().slice(0, 10) } catch { return '' }
  }
  return (
    <section className="tb-postlist">
      {title ? <h2 className="tb-postlist-title">{title}</h2> : null}
      <ul className="tb-postlist-items">
        {posts.map((p) => (
          <li key={p.url} className="tb-postlist-item">
            <div><Link href={p.url}>{p.data.title || p.url}</Link></div>
            <div className="tb-postlist-meta">
              {fmt((p.data as any).date)} {p.data.description ? ` — ${p.data.description}` : ''}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

