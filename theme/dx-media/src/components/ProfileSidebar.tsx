'use client'

import { UserPlus } from 'lucide-react'

const profile = {
  name: 'Ryosuke',
  role: 'AI / DX',
  bio:
    'クラウドネイティブやアーキテクチャ設計の講師として活動しながら、ITエンジニアのDXを推進するために新しい技術やベストプラクティスを常に学び、エンジニアの生産性と開発品質の向上に貢献することを目指しています。猫5匹飼っています。山奥のポツンと一軒家に住んでいて、事務所は海の近くです。',
}

export function ProfileSidebar() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-fd-muted text-fd-muted-foreground flex items-center justify-center">
          <span className="text-xs font-semibold">RT</span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-fd-foreground">{profile.name}</p>
          <p className="text-xs text-fd-muted-foreground">{profile.role}</p>
        </div>
      </div>

      <p className="text-xs leading-relaxed text-fd-muted-foreground">{profile.bio}</p>

      <button
        type="button"
        className="inline-flex items-center justify-center gap-2 rounded-full bg-fd-foreground px-3 py-2 text-xs font-semibold text-fd-background transition hover:opacity-90"
      >
        <UserPlus className="h-3.5 w-3.5" />
        フォロー
      </button>
    </div>
  )
}
