import Link from 'next/link'
import ExportedImage from '@/components/ExportedImage'
import {
  byDateDesc,
  fallbackCover,
  formatDate,
  getCategoryHref,
  getPrimaryCategory,
  groupByCategory,
  resolvePageCover,
} from '@/lib/content-utils'

type PageEntry = {
  url: string
  data: Record<string, any>
}

type PostIndexLayoutProps = {
  pages: PageEntry[]
  header?: {
    kicker?: string
    title?: string
  }
}

const getCategoryLabel = (data: Record<string, unknown>): string => {
  return getPrimaryCategory(data) ?? 'Topics'
}

const pickFeatured = (pages: PageEntry[]): PageEntry | null => {
  const featured = pages.find((page) => page.data?.featured === true)
  return featured || pages[0] || null
}

function ArticleCard({ page, cover, large = false }: { page: PageEntry; cover?: string; large?: boolean }) {
  const data = page.data
  const resolvedCover = cover || (data.cover as string | undefined) || fallbackCover
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
  const data = page.data
  const resolvedCover = cover || (data.cover as string | undefined) || fallbackCover
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
  const data = page.data
  const resolvedCover = cover || (data.cover as string | undefined) || fallbackCover
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

export async function PostIndexLayout({ pages, header }: PostIndexLayoutProps) {
  const sorted = [...pages].sort(byDateDesc)
  const hero = pickFeatured(sorted)
  const latest = sorted.filter((page) => page !== hero).slice(0, 3)
  const categories = groupByCategory(sorted.filter((page) => page !== hero))

  const coverMap = new Map<string, string>()
  const displayed = [
    ...(hero ? [hero] : []),
    ...latest,
    ...[...categories.values()].flatMap((items) => items.slice(0, 6)),
  ]
  await Promise.all(
    displayed.map(async (page) => {
      if (!coverMap.has(page.url)) coverMap.set(page.url, await resolvePageCover(page))
    }),
  )

  return (
    <div className="min-h-screen bg-fd-background text-fd-foreground">
      <div className="mx-auto max-w-(--fd-layout-width) px-4 space-y-10">
        <section className="pt-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              {header?.kicker ? <p className="text-sm text-fd-muted-foreground">{header.kicker}</p> : null}
              {header?.title ? <h1 className="text-3xl md:text-4xl font-bold">{header.title}</h1> : null}
            </div>
          </div>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-start">
            <div className="space-y-4">
              {hero ? <ArticleCard page={hero} cover={coverMap.get(hero.url)} large /> : null}
            </div>
            <div className="space-y-6">
              {latest.map((page) => (
                <SideCard key={page.url} page={page} cover={coverMap.get(page.url)} />
              ))}
            </div>
          </div>
        </section>

        {[...categories.entries()].map(([cat, items]) => (
          <section key={cat} className="space-y-6 border-t border-fd-border/70 pt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{cat}</h2>
              <Link
                href={getCategoryHref(cat)}
                className="text-sm text-fd-muted-foreground hover:text-fd-foreground transition inline-flex items-center gap-1"
              >
                すべて見る &gt;
              </Link>
            </div>
            <div className="grid gap-8 lg:grid-cols-2">
              {items.slice(0, 6).map((page) => (
                <CategoryListItem key={page.url} page={page} cover={coverMap.get(page.url)} />
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
                {[...categories.keys()].map((category) => (
                  <li key={category}>{category}</li>
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
  )
}
