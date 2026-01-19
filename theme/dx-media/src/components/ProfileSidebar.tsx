'use client'

import { UserPlus } from 'lucide-react'
import type { ProfileConfig } from '@/lib/site-config'
import ExportedImage from '@/components/ExportedImage'

const defaultProfile = {
  name: 'Ryosuke',
  role: 'AI / DX',
  bio:
    'クラウドネイティブやアーキテクチャ設計の講師として活動しながら、ITエンジニアのDXを推進するために新しい技術やベストプラクティスを常に学び、エンジニアの生産性と開発品質の向上に貢献することを目指しています。猫5匹飼っています。山奥のポツンと一軒家に住んでいて、事務所は海の近くです。',
}

type ProfileSidebarProps = {
  profile?: ProfileConfig
}

const buildInitials = (name: string | null) => {
  if (!name) return 'RT'
  const tokens = name.trim().split(/\s+/).filter(Boolean)
  if (tokens.length === 0) return 'RT'
  return tokens
    .map((token) => token[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function ProfileSidebar({ profile }: ProfileSidebarProps) {
  const resolvedProfile = {
    name: profile?.name ?? defaultProfile.name,
    role: profile?.role ?? defaultProfile.role,
    bio: profile?.bio ?? defaultProfile.bio,
    image: profile?.image ?? null,
    xUrl: profile?.xUrl ?? null,
  }
  const initials = buildInitials(resolvedProfile.name)
  const imageAlt = resolvedProfile.name ? `${resolvedProfile.name} profile image` : 'Profile image'

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-fd-muted text-fd-muted-foreground flex items-center justify-center">
          {resolvedProfile.image ? (
            <ExportedImage
              src={resolvedProfile.image}
              alt={imageAlt}
              width={48}
              height={48}
              sizes="48px"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-xs font-semibold">{initials}</span>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-fd-foreground">{resolvedProfile.name}</p>
          <p className="text-xs text-fd-muted-foreground">{resolvedProfile.role}</p>
        </div>
      </div>

      <p className="text-xs leading-relaxed text-fd-muted-foreground">{resolvedProfile.bio}</p>

      {resolvedProfile.xUrl ? (
        <a
          href={resolvedProfile.xUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-fd-foreground px-3 py-2 text-xs font-semibold text-fd-background transition hover:opacity-90"
        >
          <UserPlus className="h-3.5 w-3.5" />
          Xをフォロー
        </a>
      ) : (
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-fd-foreground px-3 py-2 text-xs font-semibold text-fd-background transition hover:opacity-90"
          disabled
        >
          <UserPlus className="h-3.5 w-3.5" />
          Xをフォロー
        </button>
      )}
    </div>
  )
}
