/**
 * X/Twitter URL判定・Tweet ID抽出ユーティリティ
 */

/**
 * X/TwitterのポストURLパターン
 * 対応パターン:
 * - twitter.com/user/status/123
 * - x.com/user/status/123
 * - mobile.twitter.com/user/status/123
 * - x.com/i/web/status/123
 * - /status/123/photo/1 等のサフィックス
 * - ?s=20 等のクエリパラメータ
 */
const X_TWEET_PATTERN =
  /^https?:\/\/(www\.)?(twitter\.com|x\.com|mobile\.twitter\.com)\/(i\/web\/status\/\d+|\w+\/status\/\d+)/

/**
 * URLがX/Twitterのポストかどうかを判定
 */
export function isXTweetUrl(url: string): boolean {
  return X_TWEET_PATTERN.test(url)
}

/**
 * X/TwitterのポストURLからTweet IDを抽出
 * @returns Tweet ID または null（抽出失敗時）
 *
 * Note: isXTweetUrl()で判定後に使用することを想定
 * X/Twitter以外のURLでも/status/数字があればIDを返すため、
 * 必ずisXTweetUrl()で事前チェックすること
 */
export function extractTweetId(url: string): string | null {
  // X/TwitterのURLでない場合は早期リターン
  if (!isXTweetUrl(url)) {
    return null
  }

  try {
    const urlObj = new URL(url)
    const match = urlObj.pathname.match(/\/status\/(\d+)/)
    return match ? match[1] : null
  } catch {
    return null
  }
}
