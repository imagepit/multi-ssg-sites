'use client'

import { Tweet } from 'react-tweet'

/**
 * XTweetCardコンポーネントのProps
 */
export interface XTweetCardProps {
  /** ツイートID */
  tweetId: string
  /** 元のURL（フォールバック用） */
  url: string
}

/**
 * X（Twitter）の埋め込みツイートを表示するコンポーネント
 *
 * react-tweetを使用してTwitter公式スタイルに近いデザインで表示する。
 * ツイートが削除されている場合などはURLリンクにフォールバック。
 *
 * @example
 * ```tsx
 * <XTweetCard
 *   tweetId="1881610508526178633"
 *   url="https://x.com/nya3_neko2/status/1881610508526178633"
 * />
 * ```
 */
export function XTweetCard({ tweetId, url }: XTweetCardProps) {
  return (
    <div className="x-tweet-card my-4 not-prose flex justify-center">
      <Tweet
        id={tweetId}
        fallback={
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-fd-primary hover:underline"
          >
            {url}
          </a>
        }
      />
    </div>
  )
}
