import type { ReactNode } from 'react'

type SpeechSide = 'left' | 'right'

export type SpeechCalloutProps = {
  side: SpeechSide
  title?: string
  children?: ReactNode
}

type ParsedTitle = { name?: string; avatar?: string; title?: string; styles?: { bg?: string; color?: string } }

function parseTitle(title?: string): ParsedTitle {
  if (!title) return {}
  // Allow: "Name | avatarUrl | Subtitle | bg=#eee | text=#333"
  const raw = title.split('|').map((s) => s.trim()).filter(Boolean)
  const styles: ParsedTitle['styles'] = {}
  const content: string[] = []
  for (const p of raw) {
    const m = /^(bg|background|text|color|fg)\s*[:=]\s*(.+)$/i.exec(p)
    if (m) {
      const key = m[1].toLowerCase()
      const val = m[2]
      if (key === 'bg' || key === 'background') styles.bg = val
      else styles.color = val
    } else {
      content.push(p)
    }
  }
  if (content.length === 1) return { title: content[0], styles }
  if (content.length === 2) return { name: content[0], avatar: content[1], styles }
  return { name: content[0], avatar: content[1], title: content.slice(2).join(' | '), styles }
}

export function SpeechCallout({ side, title, children }: SpeechCalloutProps) {
  const meta = parseTitle(title)
  const isLeft = side === 'left'

  return (
    <div className={`not-prose my-4 flex items-center gap-3 ${isLeft ? '' : 'flex-row-reverse'}`}>
      <Avatar url={meta.avatar} name={meta.name} />
      <div className="max-w-[85%]">
        {(meta.name || meta.title) && (
          <div className={`mb-1 text-xs text-muted-foreground ${isLeft ? '' : 'text-right'}`}>
            {meta.name && <span className="font-medium mr-2">{meta.name}</span>}
            {meta.title && <span>{meta.title}</span>}
          </div>
        )}
        <div className="relative">
          <span
            className={
              'pointer-events-none absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 rotate-45 z-0 ' +
              (isLeft ? '-left-[6px] bg-fd-secondary' : '-right-[6px] bg-fd-secondary')
            }
            style={meta.styles?.bg ? { backgroundColor: meta.styles.bg } : undefined}
            aria-hidden
          />
          <div
            className={
              'relative z-20 rounded-2xl px-4 py-3 text-sm ' +
              (isLeft
                ? 'bg-fd-secondary text-fd-secondary-foreground'
                : 'bg-fd-secondary text-fd-accent-foreground')
            }
            style={{
              ...(meta.styles?.bg ? { backgroundColor: meta.styles.bg } : {}),
              ...(meta.styles?.color ? { color: meta.styles.color } : {}),
            }}
          >
            <div className="leading-relaxed">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Avatar({ url, name, className = '' }: { url?: string; name?: string; className?: string }) {
  const fallback = (name || 'User').slice(0, 2).toUpperCase()
  return (
    <div className={`w-10 h-10 shrink-0 rounded-full border overflow-hidden bg-background text-muted-foreground flex items-center justify-center ${className}`}>
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={name || 'avatar'} className="block w-full h-full object-cover" />
      ) : (
        <span className="text-xs font-semibold select-none">{fallback}</span>
      )}
    </div>
  )
}

