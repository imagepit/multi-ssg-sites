'use client'

import { type ReactNode, useState } from 'react'

/**
 * LinkCardコンポーネントのProps
 */
export interface LinkCardProps {
  /** リンク先URL */
  url: string
  /** ページタイトル */
  title?: string
  /** ページの説明 */
  description?: string
  /** OGP画像URL */
  image?: string
  /** サイト名 */
  siteName?: string
  /** ファビコンURL */
  favicon?: string
  /** カスタムクラス名 */
  className?: string
  /** カスタムレンダリング用render prop */
  children?: (props: LinkCardRenderProps) => ReactNode
}

/**
 * render prop用のProps
 */
export interface LinkCardRenderProps {
  url: string
  title?: string
  description?: string
  image?: string
  siteName?: string
  favicon?: string
  hostname: string
}

/**
 * URLからホスト名を抽出
 */
function getHostname(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

/**
 * リンクカードコンポーネント
 *
 * MarkdownのベタリンクURLをOGP情報付きカード形式で表示する。
 * Zennのリンクカードスタイルを参考にしたデザイン。
 *
 * @example
 * ```tsx
 * <LinkCard
 *   url="https://example.com/article"
 *   title="記事タイトル"
 *   description="記事の説明文"
 *   image="https://example.com/og-image.png"
 *   siteName="Example Site"
 *   favicon="https://example.com/favicon.ico"
 * />
 * ```
 */
export function LinkCard({
  url,
  title,
  description,
  image,
  siteName,
  favicon,
  className = '',
  children,
}: LinkCardProps) {
  const hostname = getHostname(url)
  const [imageError, setImageError] = useState(false)
  const [faviconError, setFaviconError] = useState(false)

  // render propが提供された場合はそれを使用
  if (children) {
    return (
      <>
        {children({
          url,
          title,
          description,
          image,
          siteName,
          favicon,
          hostname,
        })}
      </>
    )
  }

  // 表示用タイトル（OGPタイトルがない場合はURLを表示）
  const displayTitle = title || url

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        link-card
        group
        flex
        overflow-hidden
        rounded-xl
        border
        border-fd-border
        bg-fd-card
        transition-colors
        hover:bg-fd-accent/50
        hover:border-fd-accent-foreground/20
        not-prose
        my-4
        ${className}
      `}
    >
      {/* テキストコンテンツ */}
      <div className="flex flex-1 flex-col justify-center gap-1 p-4 min-w-0">
        {/* タイトル */}
        <span
          className="font-semibold text-fd-foreground line-clamp-2 group-hover:text-fd-primary transition-colors"
          title={displayTitle}
        >
          {displayTitle}
        </span>

        {/* 説明文 */}
        {description && (
          <span
            className="text-sm text-fd-muted-foreground line-clamp-1"
            title={description}
          >
            {description}
          </span>
        )}

        {/* サイト情報 */}
        <span className="flex items-center gap-1.5 mt-1">
          {/* ファビコン */}
          {favicon && !faviconError ? (
            <img
              src={favicon}
              alt=""
              width={14}
              height={14}
              className="w-3.5 h-3.5 rounded-sm"
              onError={() => setFaviconError(true)}
              loading="lazy"
            />
          ) : (
            <svg
              className="w-3.5 h-3.5 text-fd-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
              />
            </svg>
          )}
          {/* サイト名またはホスト名 */}
          <span className="text-xs text-fd-muted-foreground truncate">
            {siteName || hostname}
          </span>
        </span>
      </div>

      {/* OGP画像 */}
      {image && !imageError && (
        <div className="relative w-[120px] sm:w-[160px] flex-shrink-0">
          <img
            src={image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        </div>
      )}
    </a>
  )
}
