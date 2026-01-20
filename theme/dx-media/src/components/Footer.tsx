import Link from 'next/link'
import { getCategoryHref } from '@/lib/content-utils'
import { navCategories } from '@/lib/layout.shared'
import { getProfileConfig, getSiteName } from '@/lib/site-config'

const footerLinks = [
  { label: 'ホーム', href: '/' },
  { label: 'お問い合わせ', href: '/contact' },
  { label: 'プライバシーポリシー', href: '/privacy-policy' },
]

const buildProfileTitle = (name: string | null, role: string | null): string | null => {
  const parts = [name, role].filter((part): part is string => Boolean(part))
  if (parts.length === 0) return null
  return parts.join(' / ')
}

export function Footer() {
  const siteName = getSiteName() ?? 'DX Tech Media'
  const profile = getProfileConfig()
  const profileTitle = buildProfileTitle(profile.name, profile.role)

  return (
    <footer className="mt-14 border-t border-fd-border/70 bg-fd-muted/30">
      <div className="mx-auto max-w-(--fd-layout-width) px-4 md:px-6 lg:px-8 py-8 text-sm text-fd-muted-foreground flex flex-col gap-8 lg:flex-row lg:justify-between">
        <div className="max-w-sm space-y-3">
          <p className="text-base font-semibold text-fd-foreground">{siteName}</p>
          {profileTitle ? (
            <p className="text-xs font-semibold text-fd-foreground">{profileTitle}</p>
          ) : null}
          {profile.bio ? (
            <p className="text-xs leading-relaxed text-fd-muted-foreground line-clamp-3">{profile.bio}</p>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-8 sm:gap-12">
          <div className="space-y-2">
            <p className="font-semibold text-fd-foreground">カテゴリー</p>
            <ul className="space-y-1 text-fd-muted-foreground">
              {navCategories.map((category) => (
                <li key={category}>
                  <Link href={getCategoryHref(category)} className="hover:text-fd-foreground transition">
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-fd-foreground">リンク</p>
            <ul className="space-y-1 text-fd-muted-foreground">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-fd-foreground transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="max-w-xs space-y-3">
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
        © 2025 {siteName}. All rights reserved.
      </div>
    </footer>
  )
}
