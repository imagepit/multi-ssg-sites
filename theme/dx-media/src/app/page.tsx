import Link from 'next/link'
import { source } from '@/lib/source'
import { baseOptions } from '@/lib/layout.shared'
import { HomeContent } from '@/app/HomeContent'
import ExportedImage from '@/components/ExportedImage'

type PageEntry = ReturnType<typeof source.getPages>[number]

const fallbackCover = '/brand/logos/nextjs.svg'

function parseDate(input?: string | null) {
  return input ? new Date(input) : new Date(0)
}

function getCategoryLabel(data: any) {
  if (Array.isArray(data?.categories) && data.categories.length > 0) {
    return data.categories[0]
  }
  if (typeof data?.categories === 'string' && data.categories) return data.categories
  if (typeof data?.category === 'string' && data.category) return data.category
  return null
}

function normalizeCoverUrl(input: string) {
  const trimmed = input.trim().replace(/^<|>$/g, '').replace(/^['"]|['"]$/g, '')
  const withoutHash = trimmed.split('#')[0]
  const withoutQuery = withoutHash.split('?')[0]
  if (!withoutQuery) return null
  if (withoutQuery.startsWith('http://') || withoutQuery.startsWith('https://')) return withoutQuery
  if (withoutQuery.startsWith('/')) return withoutQuery
  const idx = withoutQuery.indexOf('images/')
  if (idx >= 0) return `/${withoutQuery.slice(idx)}`
  return withoutQuery
}

async function deriveCoverFromBody(page: PageEntry) {
  const raw = await (page.data as any).getText?.('raw')
  if (!raw || typeof raw !== 'string') return null

  // Markdown image: ![alt](url "title")
  const md = raw.match(/!\[[^\]]*\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/m)
  if (md?.[1]) return normalizeCoverUrl(md[1])

  // HTML image: <img src="...">
  const html = raw.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i)
  if (html?.[1]) return normalizeCoverUrl(html[1])

  return null
}

async function resolveCover(page: PageEntry) {
  const data: any = page.data
  if (data?.cover) return data.cover as string
  return (await deriveCoverFromBody(page)) ?? fallbackCover
}

function pickFeatured(pages: PageEntry[]) {
  const featured = pages.find((p) => (p.data as any)?.featured === true)
  return featured || pages[0] || null
}

function byDateDesc(a: PageEntry, b: PageEntry) {
  return parseDate((b.data as any)?.date).getTime() - parseDate((a.data as any)?.date).getTime()
}

function groupByCategory(pages: PageEntry[]) {
  const groups = new Map<string, PageEntry[]>()
  for (const p of pages) {
    const label = getCategoryLabel(p.data as any) ?? 'Other'
    const cat = typeof label === 'string' ? label : 'Other'
    if (!groups.has(cat)) groups.set(cat, [])
    groups.get(cat)!.push(p)
  }
  return groups
}

function formatDate(input?: string | null) {
  if (!input) return ''
  const d = new Date(input)
  if (Number.isNaN(d.getTime())) return ''
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`
}

function ArticleCard({ page, cover, large = false }: { page: PageEntry; cover?: string; large?: boolean }) {
  const data: any = page.data
  const resolvedCover = cover || data.cover || fallbackCover
  const category = getCategoryLabel(data) || 'Topics'
  const description = data.description || ''
  const date = formatDate(data.date)
  return (
    <Link
      href={page.url}
      className="group block rounded-2xl border border-fd-border/70 bg-fd-card/70 hover:border-fd-border hover:bg-fd-card transition overflow-hidden"
    >
      <div className={`relative ${large ? 'aspect-[16/9]' : 'aspect-[4/2]'}`}>
        <ExportedImage
          src={resolvedCover}
          alt={data.title || ''}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority={large}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-fd-background/90 via-fd-background/40 to-transparent" />
      </div>
      <div className="p-4 space-y-2">
        <p className="text-xs font-semibold tracking-wide text-fd-primary">{category}</p>
        <h3 className={`text-fd-foreground font-bold leading-tight ${large ? 'text-xl md:text-2xl' : 'text-lg'}`}>
          {data.title}
        </h3>
        <p className="text-sm text-fd-muted-foreground line-clamp-2">{description}</p>
        <div className="text-xs text-fd-muted-foreground flex gap-3">
          {date ? <span>{date}</span> : null}
          {data.author ? <span>{data.author}</span> : null}
        </div>
      </div>
    </Link>
  )
}

function SideCard({ page, cover }: { page: PageEntry; cover?: string }) {
  const data: any = page.data
  const resolvedCover = cover || data.cover || fallbackCover
  const category = getCategoryLabel(data) || 'Topics'
  const description = data.description || ''
  const date = formatDate(data.date)
  return (
    <Link
      href={page.url}
      className="group flex flex-col gap-4 border-b border-fd-border/70 pb-6 sm:flex-row sm:items-start"
    >
      <div className="relative w-44 shrink-0 overflow-hidden rounded-2xl border border-fd-border/60 bg-fd-card aspect-[4/3] sm:w-48">
        <ExportedImage
          src={resolvedCover}
          alt={data.title || ''}
          fill
          sizes="(max-width: 640px) 176px, 192px"
          className="object-cover"
        />
      </div>
      <div className="space-y-2">
        <p className="text-xs font-semibold tracking-wide text-fd-primary">{category}</p>
        <h3 className="text-lg font-semibold text-fd-foreground leading-snug">{data.title}</h3>
        <p className="text-sm text-fd-muted-foreground line-clamp-2">{description}</p>
        <div className="text-xs text-fd-muted-foreground flex gap-3">
          {date ? <span>{date}</span> : null}
          {data.author ? <span>{data.author}</span> : null}
        </div>
      </div>
    </Link>
  )
}

function CategoryListItem({ page, cover }: { page: PageEntry; cover?: string }) {
  const data: any = page.data
  const resolvedCover = cover || data.cover || fallbackCover
  const description = data.description || ''
  const date = formatDate(data.date)
  return (
    <Link
      href={page.url}
      className="group flex flex-col gap-4 border-b border-fd-border/70 pb-6 sm:flex-row sm:items-start"
    >
      <div className="relative w-48 shrink-0 overflow-hidden rounded-2xl border border-fd-border/60 bg-fd-card aspect-[4/3] sm:w-52">
        <ExportedImage
          src={resolvedCover}
          alt={data.title || ''}
          fill
          sizes="(max-width: 640px) 192px, 208px"
          className="object-cover"
        />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-fd-foreground leading-snug">{data.title}</h3>
        <p className="text-sm text-fd-muted-foreground line-clamp-3">{description}</p>
        <div className="text-xs text-fd-muted-foreground flex gap-3">
          {data.author ? <span>{data.author}</span> : null}
          {date ? <span>{date}</span> : null}
        </div>
      </div>
    </Link>
  )
}

export default async function HomePage() {
  const base = baseOptions()
  const isStaticSearch = process.env.NEXT_PUBLIC_SEARCH_STATIC === '1'
  const siteId = process.env.NEXT_PUBLIC_SITE_ID || 'default'
  const all = source
    .getPages()
    .filter((p) => p.url !== '/llms-full.txt' && p.url !== '/tags')
    .sort(byDateDesc)

  const hero = pickFeatured(all)
  const latest = all.filter((p) => p !== hero).slice(0, 3)
  const categories = groupByCategory(all.filter((p) => p !== hero))

  const coverMap = new Map<string, string>()
  const displayed = [
    ...(hero ? [hero] : []),
    ...latest,
    ...[...categories.values()].flatMap((pages) => pages.slice(0, 6)),
  ]
  await Promise.all(
    displayed.map(async (p) => {
      if (!coverMap.has(p.url)) coverMap.set(p.url, await resolveCover(p))
    }),
  )

  return (
    <HomeContent baseOptions={base} isStaticSearch={isStaticSearch} siteId={siteId}>
      <div className="min-h-screen bg-fd-background text-fd-foreground">
        <div className="mx-auto max-w-(--fd-layout-width) px-4 space-y-10">
          <section className="pt-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-fd-muted-foreground">DX Tech Media</p>
                <h1 className="text-3xl md:text-4xl font-bold">最新ニュース</h1>
              </div>
            </div>
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-start">
              <div className="space-y-4">
                {hero ? <ArticleCard page={hero} cover={coverMap.get(hero.url)} large /> : null}
              </div>
              <div className="space-y-6">
                {latest.map((p) => (
                  <SideCard key={p.url} page={p} cover={coverMap.get(p.url)} />
                ))}
              </div>
            </div>
          </section>

          {[...categories.entries()].map(([cat, pages]) => (
            <section key={cat} className="space-y-6 border-t border-fd-border/70 pt-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{cat}</h2>
                <Link
                  href="/tags"
                  className="text-sm text-fd-muted-foreground hover:text-fd-foreground transition inline-flex items-center gap-1"
                >
                  すべて見る &gt;
                </Link>
              </div>
              <div className="grid gap-8 lg:grid-cols-2">
                {pages.slice(0, 6).map((p) => (
                  <CategoryListItem key={p.url} page={p} cover={coverMap.get(p.url)} />
                ))}
              </div>
            </section>
          ))}
        </div>

        <footer className="mt-14 border-t border-fd-border/70 bg-fd-muted/30">
          <div className="mx-auto max-w-(--fd-layout-width) px-4 md:px-6 lg:px-8 py-8 text-sm text-fd-muted-foreground flex flex-col gap-6 md:flex-row md:justify-between">
            <div>
              <p className="font-semibold text-fd-foreground">DX Tech Media</p>
              <p className="text-fd-muted-foreground mt-1">最新のデジタルトランスフォーメーション情報をお届けします。</p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="font-semibold text-fd-foreground">カテゴリー</p>
                <ul className="space-y-1 text-fd-muted-foreground">
                  {[...categories.keys()].map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-fd-foreground">リンク</p>
                <ul className="space-y-1 text-fd-muted-foreground">
                  <li>ホーム</li>
                  <li>人気記事</li>
                  <li>お問い合わせ</li>
                  <li>プライバシーポリシー</li>
                </ul>
              </div>
            </div>
            <div className="space-y-3">
              <p className="font-semibold text-fd-foreground">お問い合わせ</p>
              <p className="text-fd-muted-foreground">ご質問やアドバイスがございましたらお気軽にご連絡ください。</p>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-fd-primary px-4 py-2 text-sm font-semibold text-fd-primary-foreground hover:opacity-90 transition"
              >
                お問い合わせ
              </Link>
            </div>
          </div>
          <div className="text-center text-xs text-fd-muted-foreground pb-6">
            © 2025 DX Tech Media. All rights reserved.
          </div>
        </footer>
      </div>
    </HomeContent>
  )
}
