'use client'

import { useEffect, useRef, type ReactNode, type ComponentType } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { Callout as DefaultCallout } from 'fumadocs-ui/components/callout'
import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock'
import { Files as FdFiles, File as FdFile, Folder as FdFolder } from 'fumadocs-ui/components/files'
import type { PaywallOptions, SubscriptionPriceOption } from '../../lib/types'
import { usePaidSection } from '../../hooks/usePaidSection'
import { PaidSkeleton } from './PaidSkeleton'
import { SpeechCallout as DefaultSpeechCallout } from './SpeechCallout'

export type PaidSectionComponents = {
  /**
   * テーマ固有の Speech UI を使いたい場合の差し替え用。
   * 注意: Server Component から直接 function を渡すと Next.js のシリアライズ制約によりビルドが落ちるため、
   * 差し替えは「Client Component 内でラップして渡す」運用が必要。
   */
  SpeechCallout?: ComponentType<{ side: 'left' | 'right'; title?: string; children: ReactNode }>
  Callout?: ComponentType<{ type?: string; title?: string; children: ReactNode }>
}

export interface PaidSectionProps {
  sectionId: string
  productId: string
  /**
   * 未指定の場合は `NEXT_PUBLIC_SITE_ID` を使用
   */
  siteId?: string
  /**
   * 未指定の場合は `NEXT_PUBLIC_API_BASE_URL` を使用
   */
  apiBaseUrl?: string
  /**
   * テーマ固有の見た目/機能を差し込む拡張ポイント
   */
  components?: PaidSectionComponents
}

/**
 * 有料コンテンツセクションコンポーネント（共通）
 *
 * - 購入状況に応じたPaywall表示
 * - R2に保存されたHTML（premium section）を取得して表示
 * - `fd-*` プレースホルダや `pre.shiki` を fumadocs-ui コンポーネントへ置換して無料側と揃える
 */
export function PaidSection({
  sectionId,
  productId,
  siteId = process.env.NEXT_PUBLIC_SITE_ID || '',
  apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '',
  components,
}: PaidSectionProps) {
  const {
    paywallInfo,
    paywallLoading,
    paywallError,
    loadPaywallInfo,
    content,
    contentLoading,
    contentError,
    loadContent,
    checkoutLoading,
    checkoutError,
    handlePurchase,
    isAuthenticated,
  } = usePaidSection({
    siteId,
    apiBaseUrl,
    sectionId,
    productId,
  })

  const contentContainerRef = useRef<HTMLDivElement | null>(null)
  const enhancedRootsRef = useRef<Root[]>([])

  useEffect(() => {
    const container = contentContainerRef.current
    if (!container) return

    let disposed = false

    const unmountAll = () => {
      for (const root of enhancedRootsRef.current) root.unmount()
      enhancedRootsRef.current = []
    }

    unmountAll()

    const runEnhancements = () => {
      if (disposed) return
      const roots: Root[] = [...enhancedRootsRef.current]
      enhancePaidCallouts(container, roots, components)
      enhancePaidFiles(container, roots)
      enhancePaidCodeBlocks(container, roots)
      enhancedRootsRef.current = roots
    }

    runEnhancements()
    const t = window.setTimeout(runEnhancements, 0)

    return () => {
      disposed = true
      window.clearTimeout(t)
      unmountAll()
    }
  }, [content, components])

  if (paywallLoading) return <PaidSkeleton />

  if (paywallError) {
    return <ErrorDisplay message="商品情報の取得に失敗しました" onRetry={loadPaywallInfo} />
  }

  if (content) {
    return (
      <div
        className="paid-content my-4"
        data-section-id={sectionId}
        data-product-id={productId}
        dangerouslySetInnerHTML={{ __html: content }}
        ref={contentContainerRef}
      />
    )
  }

  if (isAuthenticated && contentLoading) return <PaidSkeleton />

  if (contentError && (contentError.type === 'network' || contentError.type === 'not_found')) {
    return (
      <ErrorDisplay
        message={contentError.type === 'not_found'
          ? 'コンテンツが見つかりません。しばらく経ってから再度お試しください。'
          : contentError.message}
        onRetry={loadContent}
      />
    )
  }

  return (
    <PaywallDisplay
      sectionId={sectionId}
      productId={productId}
      paywallInfo={paywallInfo}
      isAuthenticated={isAuthenticated}
      onLogin={defaultHandleLogin}
      onPurchase={handlePurchase}
      isCheckoutLoading={checkoutLoading}
      checkoutError={checkoutError}
    />
  )
}

function enhancePaidCallouts(container: HTMLElement, roots: Root[], components?: PaidSectionComponents) {
  const Callout = components?.Callout || ((props: any) => <DefaultCallout {...props} />)
  const SpeechCallout = components?.SpeechCallout || DefaultSpeechCallout

  const nodes = Array.from(container.querySelectorAll('fd-callout')) as HTMLElement[]
  for (const el of nodes) {
    const type = el.dataset.type || 'info'
    const title = el.dataset.title
    const innerHtml = el.innerHTML

    const mountPoint = document.createElement('div')
    mountPoint.dataset.paidReactRoot = 'callout'

    el.replaceWith(mountPoint)

    const root = createRoot(mountPoint)
    const child = <div dangerouslySetInnerHTML={{ __html: innerHtml }} />

    if (type === 'speech-left' || type === 'speech-right') {
      root.render(
        <SpeechCallout side={type === 'speech-left' ? 'left' : 'right'} title={title}>
          {child}
        </SpeechCallout>
      )
    } else {
      root.render(
        <Callout type={type} title={title}>
          {child}
        </Callout>
      )
    }

    roots.push(root)
  }
}

function enhancePaidFiles(container: HTMLElement, roots: Root[]) {
  const nodes = Array.from(container.querySelectorAll('fd-files')) as HTMLElement[]
  for (const el of nodes) {
    const mountPoint = document.createElement('div')
    mountPoint.dataset.paidReactRoot = 'files'

    const tree = buildFilesTree(el)
    el.replaceWith(mountPoint)

    const root = createRoot(mountPoint)
    root.render(tree)
    roots.push(root)
  }
}

function buildFilesTree(rootEl: HTMLElement) {
  return <FdFiles>{buildFilesChildren(rootEl)}</FdFiles>
}

function buildFilesChildren(parentEl: HTMLElement): ReactNode[] {
  const children = Array.from(parentEl.children) as HTMLElement[]
  const out: ReactNode[] = []

  children.forEach((child, index) => {
    const tag = child.tagName.toLowerCase()
    const name = child.dataset.name || ''

    if (tag === 'fd-file') {
      out.push(<FdFile key={`${index}:${name}`} name={name} />)
      return
    }

    if (tag === 'fd-folder') {
      out.push(
        <FdFolder key={`${index}:${name}`} name={name} defaultOpen>
          {buildFilesChildren(child)}
        </FdFolder>
      )
    }
  })

  return out
}

function enhancePaidCodeBlocks(container: HTMLElement, roots: Root[]) {
  const preNodes = Array.from(container.querySelectorAll('pre.shiki')) as HTMLPreElement[]
  for (const pre of preNodes) {
    if (pre.closest('[data-paid-react-root=\"codeblock\"]')) continue

    const mountPoint = document.createElement('div')
    mountPoint.dataset.paidReactRoot = 'codeblock'

    const preHtml = pre.innerHTML
    const props = htmlAttributesToCodeBlockProps(pre)

    pre.replaceWith(mountPoint)

    const root = createRoot(mountPoint)
    root.render(
      <CodeBlock {...props}>
        <Pre dangerouslySetInnerHTML={{ __html: preHtml }} />
      </CodeBlock>
    )
    roots.push(root)
  }
}

function htmlAttributesToCodeBlockProps(pre: HTMLPreElement): Record<string, any> {
  const props: Record<string, any> = {}

  for (const attr of Array.from(pre.attributes)) {
    const name = attr.name
    const value = attr.value

    if (name === 'class') {
      props.className = value
      continue
    }
    if (name === 'style') {
      props.style = parseInlineStyle(value)
      continue
    }
    if (name === 'icon') {
      props.icon = value
      continue
    }
    if (name === 'title') {
      props.title = value
      continue
    }
    if (name.startsWith('data-')) {
      props[name] = value === '' ? true : value
      continue
    }

    props[name] = value
  }

  return props
}

function parseInlineStyle(styleText: string): Record<string, string> {
  const style: Record<string, string> = {}
  for (const part of styleText.split(';')) {
    const trimmed = part.trim()
    if (!trimmed) continue
    const idx = trimmed.indexOf(':')
    if (idx === -1) continue
    const prop = trimmed.slice(0, idx).trim()
    const value = trimmed.slice(idx + 1).trim()
    if (!prop) continue
    style[prop] = value
  }
  return style
}

function defaultHandleLogin() {
  if (typeof window !== 'undefined') {
    const returnUrl = window.location.href
    window.location.href = `/login?next=${encodeURIComponent(returnUrl)}`
  }
}

function ErrorDisplay({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="rounded-lg border-2 border-red-500/30 bg-red-50 dark:bg-red-950/20 p-6 my-4">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-red-700 dark:text-red-400">エラーが発生しました</h3>
          <p className="text-sm text-red-600 dark:text-red-300">{message}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 transition"
      >
        再試行
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>
  )
}

function PaywallDisplay({
  sectionId,
  productId,
  paywallInfo,
  isAuthenticated,
  onLogin,
  onPurchase,
  isCheckoutLoading,
  checkoutError,
}: {
  sectionId: string
  productId: string
  paywallInfo: PaywallOptions | null
  isAuthenticated: boolean
  onLogin: () => void
  onPurchase: (stripePriceId: string, mode: 'payment' | 'subscription', billingPeriod?: 'monthly' | 'yearly') => void
  isCheckoutLoading: boolean
  checkoutError: Error | null
}) {
  const defaultMessage = isAuthenticated
    ? 'このセクションは有料コンテンツです。購入するとアクセスできるようになります。'
    : 'このセクションは有料コンテンツです。ログインして購入状況を確認するか、新規購入してください。'

  const singlePurchase = paywallInfo?.singlePurchase
  const subscription = paywallInfo?.subscription

  return (
    <div
      className="premium-placeholder rounded-lg border-2 border-dashed border-fd-primary/30 bg-fd-primary/5 p-6 my-4"
      data-section-id={sectionId}
      data-product-id={productId}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-fd-primary/20 flex items-center justify-center">
          <svg className="w-5 h-5 text-fd-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-fd-foreground">有料コンテンツ</h3>
          <p className="text-sm text-fd-muted-foreground">{defaultMessage}</p>
        </div>
      </div>

      {!isAuthenticated ? (
        <button
          type="button"
          onClick={onLogin}
          className="w-full rounded-lg bg-fd-primary px-4 py-2 text-sm font-semibold text-fd-primary-foreground hover:opacity-90 transition"
        >
          ログインして確認する
        </button>
      ) : (
        <div className="space-y-4">
          {checkoutError && (
            <div className="rounded-lg border border-red-500/30 bg-red-50 dark:bg-red-950/20 p-3 text-sm text-red-600 dark:text-red-300">
              {checkoutError.message}
            </div>
          )}

          <div className="grid grid-cols-1 gap-3">
            {singlePurchase && (
              <div className="rounded-lg border border-fd-border bg-fd-card p-4">
                <h4 className="font-semibold text-fd-foreground mb-1">単体購入</h4>
                {singlePurchase.description && (
                  <p className="text-xs text-fd-muted-foreground mb-3">{singlePurchase.description}</p>
                )}
                <div className="mb-3">
                  {singlePurchase.sale ? (
                    <SalePriceDisplay
                      originalPrice={singlePurchase.sale.originalPrice}
                      salePrice={singlePurchase.sale.price}
                      saleLabel={singlePurchase.sale.label}
                      saleEndsAt={singlePurchase.sale.endsAt}
                    />
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-fd-foreground">¥{singlePurchase.price.toLocaleString()}</span>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => onPurchase(singlePurchase.stripePriceId, 'payment')}
                  disabled={isCheckoutLoading}
                  className={`w-full rounded-lg px-4 py-2 text-sm font-semibold transition ${singlePurchase.sale
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-fd-primary text-fd-primary-foreground hover:opacity-90'} disabled:opacity-50`}
                >
                  {isCheckoutLoading ? '処理中...' : '購入する'}
                </button>
              </div>
            )}

            {subscription && (
              <div className="rounded-lg border-2 border-fd-primary bg-fd-card p-4">
                <h4 className="font-semibold text-fd-foreground mb-1">{subscription.name}</h4>
                {subscription.description && (
                  <p className="text-xs text-fd-muted-foreground mb-3">{subscription.description}</p>
                )}
                <div className="space-y-2">
                  {subscription.prices.map((price: SubscriptionPriceOption) => (
                    <button
                      key={price.billingPeriod}
                      type="button"
                      onClick={() => onPurchase(price.stripePriceId, 'subscription', price.billingPeriod)}
                      disabled={isCheckoutLoading}
                      className="w-full rounded-lg border border-fd-border bg-fd-background px-4 py-3 text-sm hover:bg-fd-accent transition disabled:opacity-50"
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <span className="font-semibold text-fd-foreground">
                            ¥{price.price.toLocaleString()}
                            <span className="font-normal text-fd-muted-foreground">/{price.billingPeriod === 'monthly' ? '月' : '年'}</span>
                          </span>
                          {price.badge && (
                            <span className="inline-flex items-center rounded-full bg-fd-primary/10 px-2 py-0.5 text-xs font-medium text-fd-primary">
                              {price.badge}
                            </span>
                          )}
                        </span>
                        <span className="text-fd-muted-foreground">
                          {price.label || (price.billingPeriod === 'monthly' ? '月額プラン' : '年額プラン')}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function SalePriceDisplay({
  originalPrice,
  salePrice,
  saleLabel,
  saleEndsAt,
}: {
  originalPrice: number
  salePrice: number
  saleLabel?: string
  saleEndsAt?: string
}) {
  const formatEndDate = (isoString: string) => {
    const date = new Date(isoString)
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${month}月${day}日 ${hours}:${minutes}`
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center rounded-full bg-red-500 px-2 py-0.5 text-xs font-medium text-white">
          {saleLabel || 'セール中'}
        </span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-sm text-fd-muted-foreground line-through">¥{originalPrice.toLocaleString()}</span>
        <span className="text-2xl font-bold text-red-500">¥{salePrice.toLocaleString()}</span>
      </div>
      {saleEndsAt && (
        <p className="text-xs text-fd-muted-foreground">〜 {formatEndDate(saleEndsAt)} まで</p>
      )}
    </div>
  )
}
