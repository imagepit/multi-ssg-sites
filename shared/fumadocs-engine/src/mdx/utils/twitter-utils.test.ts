import { describe, it, expect } from 'vitest'
import { isXTweetUrl, extractTweetId } from './twitter-utils'

describe('isXTweetUrl', () => {
  describe('有効なX/Twitter URLを検出', () => {
    it('twitter.com/user/status/ID を検出', () => {
      expect(isXTweetUrl('https://twitter.com/nya3_neko2/status/1881610508526178633')).toBe(true)
    })

    it('x.com/user/status/ID を検出', () => {
      expect(isXTweetUrl('https://x.com/nya3_neko2/status/1881610508526178633')).toBe(true)
    })

    it('www.twitter.com を検出', () => {
      expect(isXTweetUrl('https://www.twitter.com/user/status/123456789')).toBe(true)
    })

    it('www.x.com を検出', () => {
      expect(isXTweetUrl('https://www.x.com/user/status/123456789')).toBe(true)
    })

    it('mobile.twitter.com を検出', () => {
      expect(isXTweetUrl('https://mobile.twitter.com/user/status/123456789')).toBe(true)
    })

    it('x.com/i/web/status/ID を検出', () => {
      expect(isXTweetUrl('https://x.com/i/web/status/123456789')).toBe(true)
    })

    it('http:// も検出', () => {
      expect(isXTweetUrl('http://twitter.com/user/status/123456789')).toBe(true)
    })

    it('クエリパラメータ付きURLを検出', () => {
      expect(isXTweetUrl('https://x.com/user/status/123456789?s=20')).toBe(true)
    })

    it('/photo/1 サフィックス付きURLを検出', () => {
      expect(isXTweetUrl('https://x.com/user/status/123456789/photo/1')).toBe(true)
    })
  })

  describe('無効なURLを除外', () => {
    it('一般的なURLを除外', () => {
      expect(isXTweetUrl('https://example.com/article')).toBe(false)
    })

    it('Twitterのプロフィールページを除外', () => {
      expect(isXTweetUrl('https://twitter.com/nya3_neko2')).toBe(false)
    })

    it('Twitterのホームページを除外', () => {
      expect(isXTweetUrl('https://twitter.com/')).toBe(false)
    })

    it('YouTubeのURLを除外', () => {
      expect(isXTweetUrl('https://www.youtube.com/watch?v=abc123')).toBe(false)
    })

    it('不正なURLを除外', () => {
      expect(isXTweetUrl('not-a-url')).toBe(false)
    })

    it('空文字を除外', () => {
      expect(isXTweetUrl('')).toBe(false)
    })
  })
})

describe('extractTweetId', () => {
  describe('Tweet IDを正常に抽出', () => {
    it('twitter.com からTweet IDを抽出', () => {
      expect(extractTweetId('https://twitter.com/nya3_neko2/status/1881610508526178633')).toBe('1881610508526178633')
    })

    it('x.com からTweet IDを抽出', () => {
      expect(extractTweetId('https://x.com/nya3_neko2/status/1881610508526178633')).toBe('1881610508526178633')
    })

    it('クエリパラメータ付きURLからTweet IDを抽出', () => {
      expect(extractTweetId('https://x.com/user/status/123456789?s=20&t=abc')).toBe('123456789')
    })

    it('/photo/1 サフィックス付きURLからTweet IDを抽出', () => {
      expect(extractTweetId('https://x.com/user/status/123456789/photo/1')).toBe('123456789')
    })

    it('mobile.twitter.com からTweet IDを抽出', () => {
      expect(extractTweetId('https://mobile.twitter.com/user/status/987654321')).toBe('987654321')
    })

    it('x.com/i/web/status からTweet IDを抽出', () => {
      expect(extractTweetId('https://x.com/i/web/status/111222333')).toBe('111222333')
    })
  })

  describe('抽出失敗時にnullを返す', () => {
    it('statusパスがないURLでnullを返す', () => {
      expect(extractTweetId('https://twitter.com/nya3_neko2')).toBe(null)
    })

    it('不正なURLでnullを返す', () => {
      expect(extractTweetId('not-a-url')).toBe(null)
    })

    it('空文字でnullを返す', () => {
      expect(extractTweetId('')).toBe(null)
    })

    it('一般的なURLでnullを返す', () => {
      expect(extractTweetId('https://example.com/status/123')).toBe(null)
    })
  })
})
