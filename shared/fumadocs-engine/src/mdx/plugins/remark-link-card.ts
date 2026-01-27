import type { Root, Paragraph, Text } from 'mdast'
import type { VFile } from 'vfile'
import { visit } from 'unist-util-visit'
import { fetchOgpBatch, type OgpData, type OgpFetcherOptions } from '../utils/ogp-fetcher.js'
import { isXTweetUrl, extractTweetId } from '../utils/twitter-utils.js'

/**
 * リンクカードプラグインのオプション
 */
export interface RemarkLinkCardOptions extends OgpFetcherOptions {
  /** リンクカードコンポーネント名（デフォルト: LinkCard） */
  componentName?: string
  /** X/Twitterカードコンポーネント名（デフォルト: XTweetCard） */
  xTweetComponentName?: string
}

/**
 * URL候補の型
 */
interface UrlCandidate {
  node: Paragraph
  index: number
  parent: { children: any[] }
  url: string
}

/**
 * ベタ貼りURLをリンクカードに変換するRemarkプラグイン
 *
 * 変換対象:
 * - 段落内に単独で存在するURL（textノードのみ）
 * - X/TwitterのURLは<XTweetCard>に変換（OGP取得をスキップ）
 * - それ以外のURLは<LinkCard>に変換（OGP情報付き）
 *
 * 変換しない:
 * - Markdownリンク形式: [text](url) や [url](url)
 * - 文章中のURL
 */
export function remarkLinkCard(options: RemarkLinkCardOptions = {}) {
  const componentName = options.componentName ?? 'LinkCard'
  const xTweetComponentName = options.xTweetComponentName ?? 'XTweetCard'

  return async (tree: Root, vfile: VFile) => {
    // 1. 候補となる段落を収集し、X/Twitterとそれ以外に分類
    const xTweetCandidates: UrlCandidate[] = []
    const genericCandidates: UrlCandidate[] = []

    visit(tree, 'paragraph', (node: Paragraph, index, parent) => {
      if (index === undefined || !parent) return

      const url = extractStandaloneUrl(node, vfile)
      if (!url) return

      const candidate: UrlCandidate = {
        node,
        index: index as number,
        parent: parent as any,
        url,
      }

      // X/Twitter URLかどうかで分類
      if (isXTweetUrl(url)) {
        xTweetCandidates.push(candidate)
      } else {
        genericCandidates.push(candidate)
      }
    })

    if (xTweetCandidates.length === 0 && genericCandidates.length === 0) return

    // 2. 通常URLのみOGP一括取得（X/TwitterはOGP取得をスキップ）
    let ogpMap = new Map<string, OgpData>()
    if (genericCandidates.length > 0) {
      const urls = genericCandidates.map((c) => c.url)
      ogpMap = await fetchOgpBatch(urls, options)
    }

    // 3. すべての候補をインデックス順にソートして逆順で処理
    const allCandidates = [...xTweetCandidates, ...genericCandidates].sort(
      (a, b) => b.index - a.index
    )

    for (const { index, parent, url } of allCandidates) {
      let element: any

      if (isXTweetUrl(url)) {
        // X/Twitter URLの場合
        const tweetId = extractTweetId(url)
        if (tweetId) {
          element = createXTweetCardElement(xTweetComponentName, tweetId, url)
        } else {
          // tweetId抽出失敗時はフォールバックとしてLinkCardを使用
          const ogpData = { url, fetchedAt: Date.now() }
          element = createLinkCardElement(componentName, ogpData)
        }
      } else {
        // 通常URLの場合
        const ogpData = ogpMap.get(url) || { url, fetchedAt: Date.now() }
        element = createLinkCardElement(componentName, ogpData)
      }

      parent.children.splice(index, 1, element)
    }
  }
}

/**
 * 段落からベタ貼りURLを抽出
 * - 段落の子要素が1つのみ
 * - 子要素がtextノード または linkノード（GFMのautolink literal）
 * - URLのみ（[text](url) は除外）
 * - 元Markdownが [ で始まらない（[url](url)形式を除外）
 */
function extractStandaloneUrl(paragraph: Paragraph, vfile: VFile): string | null {
  // 子要素が1つのみ
  if (paragraph.children.length !== 1) return null

  const child = paragraph.children[0]

  let url: string | null = null

  if (child.type === 'text') {
    url = (child as Text).value.trim()
  } else if (child.type === 'link') {
    const link = child as any
    const linkText = link.children?.[0]?.type === 'text' ? link.children[0].value.trim() : ''
    // [text](url) のようにテキストとURLが異なる場合は除外
    if (linkText !== link.url) return null
    url = String(link.url || '').trim()
  } else {
    return null
  }

  // URLパターンにマッチするか
  if (!url || !/^https?:\/\/\S+$/.test(url)) return null

  // 保険: 元Markdownが [ で始まる場合は除外（[url](url)形式）
  if (paragraph.position && vfile.value) {
    const source = typeof vfile.value === 'string' ? vfile.value : vfile.value.toString()
    const raw = source.slice(
      paragraph.position.start.offset,
      paragraph.position.end.offset
    )
    if (raw.trim().startsWith('[')) return null
  }

  return url
}

/**
 * XTweetCardのMDX JSX要素を生成
 */
function createXTweetCardElement(componentName: string, tweetId: string, url: string): any {
  return {
    type: 'mdxJsxFlowElement',
    name: componentName,
    attributes: [
      { type: 'mdxJsxAttribute', name: 'tweetId', value: tweetId },
      { type: 'mdxJsxAttribute', name: 'url', value: url },
    ],
    children: [],
  }
}

/**
 * LinkCardのMDX JSX要素を生成
 */
function createLinkCardElement(componentName: string, ogpData: OgpData): any {
  const attributes: any[] = [
    { type: 'mdxJsxAttribute', name: 'url', value: ogpData.url },
  ]

  if (ogpData.title) {
    attributes.push({ type: 'mdxJsxAttribute', name: 'title', value: ogpData.title })
  }

  if (ogpData.description) {
    attributes.push({ type: 'mdxJsxAttribute', name: 'description', value: ogpData.description })
  }

  if (ogpData.image) {
    attributes.push({ type: 'mdxJsxAttribute', name: 'image', value: ogpData.image })
  }

  if (ogpData.siteName) {
    attributes.push({ type: 'mdxJsxAttribute', name: 'siteName', value: ogpData.siteName })
  }

  if (ogpData.favicon) {
    attributes.push({ type: 'mdxJsxAttribute', name: 'favicon', value: ogpData.favicon })
  }

  return {
    type: 'mdxJsxFlowElement',
    name: componentName,
    attributes,
    children: [],
  }
}
