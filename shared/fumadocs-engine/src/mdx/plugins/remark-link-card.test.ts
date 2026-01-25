import { describe, it, expect, vi, beforeEach } from 'vitest'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkMdx from 'remark-mdx'
import { remarkLinkCard } from './remark-link-card.js'
import * as ogpFetcher from '../utils/ogp-fetcher.js'

// OGP fetcherをモック
vi.mock('../utils/ogp-fetcher')

describe('remarkLinkCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // fetchOgpBatchのモック実装
    vi.mocked(ogpFetcher.fetchOgpBatch).mockImplementation(async (urls: string[]) => {
      const map = new Map<string, ogpFetcher.OgpData>()
      for (const url of urls) {
        try {
          const urlObj = new URL(url)
          map.set(url, {
            url,
            title: `Title for ${url}`,
            description: `Description for ${url}`,
            image: `${url}/og-image.png`,
            siteName: urlObj.hostname,
            favicon: `${urlObj.origin}/favicon.ico`,
            fetchedAt: Date.now(),
          })
        } catch {
          map.set(url, {
            url,
            fetchedAt: Date.now(),
          })
        }
      }
      return map
    })
  })

  const process = async (markdown: string) => {
    const processor = unified()
      .use(remarkParse)
      .use(remarkMdx)
      .use(remarkLinkCard)

    const result = await processor.run(processor.parse(markdown))
    return result
  }

  describe('ベタ貼りURL検出', () => {
    it('should convert standalone URL to LinkCard', async () => {
      const markdown = `## 参考URL

https://example.com/article`

      const result = await process(markdown)

      // LinkCard要素が生成されていることを確認
      const linkCard = (result as any).children.find(
        (child: any) => child.type === 'mdxJsxFlowElement' && child.name === 'LinkCard'
      )

      expect(linkCard).toBeDefined()
      expect(linkCard.attributes).toContainEqual({
        type: 'mdxJsxAttribute',
        name: 'url',
        value: 'https://example.com/article',
      })
    })

    it('should convert multiple standalone URLs', async () => {
      const markdown = `https://example.com/first

https://example.com/second`

      const result = await process(markdown)

      const linkCards = (result as any).children.filter(
        (child: any) => child.type === 'mdxJsxFlowElement' && child.name === 'LinkCard'
      )

      expect(linkCards).toHaveLength(2)
    })

    it('should handle URL with query params and hash', async () => {
      const markdown = `https://example.com/page?foo=bar&baz=qux#section`

      const result = await process(markdown)

      const linkCard = (result as any).children.find(
        (child: any) => child.type === 'mdxJsxFlowElement' && child.name === 'LinkCard'
      )

      expect(linkCard).toBeDefined()
      expect(linkCard.attributes).toContainEqual({
        type: 'mdxJsxAttribute',
        name: 'url',
        value: 'https://example.com/page?foo=bar&baz=qux#section',
      })
    })
  })

  describe('変換しないケース', () => {
    it('should NOT convert markdown link [text](url)', async () => {
      const markdown = `くわしくは[ここ](https://example.com/page)を確認してください。`

      const result = await process(markdown)

      const linkCard = (result as any).children.find(
        (child: any) => child.type === 'mdxJsxFlowElement' && child.name === 'LinkCard'
      )

      expect(linkCard).toBeUndefined()
    })

    it('should NOT convert markdown link [url](url)', async () => {
      const markdown = `[https://example.com/page](https://example.com/page)`

      const result = await process(markdown)

      const linkCard = (result as any).children.find(
        (child: any) => child.type === 'mdxJsxFlowElement' && child.name === 'LinkCard'
      )

      expect(linkCard).toBeUndefined()
    })

    it('should NOT convert URL in text', async () => {
      const markdown = `詳細は https://example.com/page を参照してください。`

      const result = await process(markdown)

      const linkCard = (result as any).children.find(
        (child: any) => child.type === 'mdxJsxFlowElement' && child.name === 'LinkCard'
      )

      expect(linkCard).toBeUndefined()
    })

    it('should NOT convert URL in inline code', async () => {
      const markdown = '`https://example.com/page`'

      const result = await process(markdown)

      const linkCard = (result as any).children.find(
        (child: any) => child.type === 'mdxJsxFlowElement' && child.name === 'LinkCard'
      )

      expect(linkCard).toBeUndefined()
    })
  })

  describe('OGP属性の設定', () => {
    it('should include OGP attributes in LinkCard', async () => {
      const markdown = `https://example.com/article`

      const result = await process(markdown)

      const linkCard = (result as any).children.find(
        (child: any) => child.type === 'mdxJsxFlowElement' && child.name === 'LinkCard'
      )

      expect(linkCard.attributes).toContainEqual({
        type: 'mdxJsxAttribute',
        name: 'title',
        value: 'Title for https://example.com/article',
      })
      expect(linkCard.attributes).toContainEqual({
        type: 'mdxJsxAttribute',
        name: 'description',
        value: 'Description for https://example.com/article',
      })
      expect(linkCard.attributes).toContainEqual({
        type: 'mdxJsxAttribute',
        name: 'image',
        value: 'https://example.com/article/og-image.png',
      })
      expect(linkCard.attributes).toContainEqual({
        type: 'mdxJsxAttribute',
        name: 'siteName',
        value: 'example.com',
      })
      expect(linkCard.attributes).toContainEqual({
        type: 'mdxJsxAttribute',
        name: 'favicon',
        value: 'https://example.com/favicon.ico',
      })
    })
  })

  describe('混在ケース', () => {
    it('should convert only standalone URLs in mixed content', async () => {
      const markdown = `## 本文

くわしくは[ここ](https://example.com/docs)を確認してください。

## 参考URL

https://example.com/reference

[もう一つのリンク](https://example.com/another)`

      const result = await process(markdown)

      const linkCards = (result as any).children.filter(
        (child: any) => child.type === 'mdxJsxFlowElement' && child.name === 'LinkCard'
      )

      expect(linkCards).toHaveLength(1)
      expect(linkCards[0].attributes).toContainEqual({
        type: 'mdxJsxAttribute',
        name: 'url',
        value: 'https://example.com/reference',
      })
    })
  })

  describe('X/Twitter URL分岐', () => {
    it('should convert X/Twitter URL to XTweetCard', async () => {
      const markdown = `https://x.com/nya3_neko2/status/1881610508526178633`

      const result = await process(markdown)

      const xTweetCard = (result as any).children.find(
        (child: any) => child.type === 'mdxJsxFlowElement' && child.name === 'XTweetCard'
      )

      expect(xTweetCard).toBeDefined()
      expect(xTweetCard.attributes).toContainEqual({
        type: 'mdxJsxAttribute',
        name: 'tweetId',
        value: '1881610508526178633',
      })
      expect(xTweetCard.attributes).toContainEqual({
        type: 'mdxJsxAttribute',
        name: 'url',
        value: 'https://x.com/nya3_neko2/status/1881610508526178633',
      })
    })

    it('should convert twitter.com URL to XTweetCard', async () => {
      const markdown = `https://twitter.com/user/status/123456789`

      const result = await process(markdown)

      const xTweetCard = (result as any).children.find(
        (child: any) => child.type === 'mdxJsxFlowElement' && child.name === 'XTweetCard'
      )

      expect(xTweetCard).toBeDefined()
      expect(xTweetCard.attributes).toContainEqual({
        type: 'mdxJsxAttribute',
        name: 'tweetId',
        value: '123456789',
      })
    })

    it('should NOT call fetchOgpBatch for X/Twitter URLs', async () => {
      const markdown = `https://x.com/user/status/123456789`

      await process(markdown)

      // fetchOgpBatchが空配列で呼ばれるか、呼ばれないことを確認
      const calls = vi.mocked(ogpFetcher.fetchOgpBatch).mock.calls
      if (calls.length > 0) {
        // 呼ばれた場合、X/Twitter URLが含まれていないことを確認
        const allUrls = calls.flatMap(call => call[0])
        expect(allUrls).not.toContain('https://x.com/user/status/123456789')
      }
    })

    it('should handle mixed X/Twitter and generic URLs', async () => {
      const markdown = `https://x.com/user/status/123456789

https://example.com/article`

      const result = await process(markdown)

      const xTweetCards = (result as any).children.filter(
        (child: any) => child.type === 'mdxJsxFlowElement' && child.name === 'XTweetCard'
      )
      const linkCards = (result as any).children.filter(
        (child: any) => child.type === 'mdxJsxFlowElement' && child.name === 'LinkCard'
      )

      expect(xTweetCards).toHaveLength(1)
      expect(linkCards).toHaveLength(1)

      // OGP取得は通常URLのみ
      const calls = vi.mocked(ogpFetcher.fetchOgpBatch).mock.calls
      expect(calls.length).toBe(1)
      expect(calls[0][0]).toEqual(['https://example.com/article'])
    })

    it('should convert X URL with query params to XTweetCard', async () => {
      const markdown = `https://x.com/user/status/123456789?s=20`

      const result = await process(markdown)

      const xTweetCard = (result as any).children.find(
        (child: any) => child.type === 'mdxJsxFlowElement' && child.name === 'XTweetCard'
      )

      expect(xTweetCard).toBeDefined()
      expect(xTweetCard.attributes).toContainEqual({
        type: 'mdxJsxAttribute',
        name: 'tweetId',
        value: '123456789',
      })
    })

    it('should NOT convert X profile URL (not a tweet)', async () => {
      const markdown = `https://x.com/nya3_neko2`

      const result = await process(markdown)

      // プロフィールURLはXTweetCardにならない（statusがないため）
      const xTweetCard = (result as any).children.find(
        (child: any) => child.type === 'mdxJsxFlowElement' && child.name === 'XTweetCard'
      )

      expect(xTweetCard).toBeUndefined()

      // 通常のLinkCardになる
      const linkCard = (result as any).children.find(
        (child: any) => child.type === 'mdxJsxFlowElement' && child.name === 'LinkCard'
      )

      expect(linkCard).toBeDefined()
    })
  })
})
