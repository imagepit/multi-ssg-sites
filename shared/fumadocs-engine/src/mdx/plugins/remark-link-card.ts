import type { Root, Paragraph, Text } from 'mdast'
import type { VFile } from 'vfile'
import { visit } from 'unist-util-visit'
import { fetchOgpBatch, type OgpData, type OgpFetcherOptions } from '../utils/ogp-fetcher.js'

/**
 * リンクカードプラグインのオプション
 */
export interface RemarkLinkCardOptions extends OgpFetcherOptions {
  /** リンクカードコンポーネント名（デフォルト: LinkCard） */
  componentName?: string
}

/**
 * ベタ貼りURLをリンクカードに変換するRemarkプラグイン
 *
 * 変換対象:
 * - 段落内に単独で存在するURL（textノードのみ）
 *
 * 変換しない:
 * - Markdownリンク形式: [text](url) や [url](url)
 * - 文章中のURL
 */
export function remarkLinkCard(options: RemarkLinkCardOptions = {}) {
  const componentName = options.componentName ?? 'LinkCard'

  return async (tree: Root, vfile: VFile) => {
    // 1. 候補となる段落を収集
    const candidates: Array<{
      node: Paragraph
      index: number
      parent: { children: any[] }
      url: string
    }> = []

    visit(tree, 'paragraph', (node: Paragraph, index, parent) => {
      if (index === undefined || !parent) return

      const url = extractStandaloneUrl(node, vfile)
      if (url) {
        candidates.push({ node, index: index as number, parent: parent as any, url })
      }
    })

    if (candidates.length === 0) return

    // 2. URLをdedupeしてOGP一括取得
    const urls = candidates.map((c) => c.url)
    const ogpMap = await fetchOgpBatch(urls, options)

    // 3. treeを置換（逆順で処理してインデックスのズレを防ぐ）
    for (let i = candidates.length - 1; i >= 0; i--) {
      const { index, parent, url } = candidates[i]
      const ogpData = ogpMap.get(url) || { url, fetchedAt: Date.now() }

      const linkCardElement = createLinkCardElement(componentName, ogpData)
      parent.children.splice(index, 1, linkCardElement)
    }
  }
}

/**
 * 段落からベタ貼りURLを抽出
 * - 段落の子要素が1つのみ
 * - 子要素がtextノード
 * - textの内容がURLのみ
 * - 元Markdownが [ で始まらない（[url](url)形式を除外）
 */
function extractStandaloneUrl(paragraph: Paragraph, vfile: VFile): string | null {
  // 子要素が1つのみ
  if (paragraph.children.length !== 1) return null

  const child = paragraph.children[0]

  // textノードのみ対象
  if (child.type !== 'text') return null

  const text = (child as Text).value.trim()

  // URLパターンにマッチするか
  if (!/^https?:\/\/\S+$/.test(text)) return null

  // 保険: 元Markdownが [ で始まる場合は除外（[url](url)形式）
  if (paragraph.position && vfile.value) {
    const source = typeof vfile.value === 'string' ? vfile.value : vfile.value.toString()
    const raw = source.slice(
      paragraph.position.start.offset,
      paragraph.position.end.offset
    )
    if (raw.trim().startsWith('[')) return null
  }

  return text
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
