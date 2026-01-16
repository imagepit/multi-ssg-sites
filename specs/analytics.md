---
title: マルチサイトプラットフォーム向けGA4分析設計書
---

# マルチサイトプラットフォーム向けGA4分析設計書

## 1. 設計概要

### 1.1 プロジェクト背景

Next.jsベースのマルチサイトプラットフォームにおいて、ConoHa VPS環境でのGA4分析システムを設計する。各テナント（tech-keyword-id）が独立したサイトを運営しつつ、統合的な分析とテナント別分析の両方を実現する。

### 1.2 設計目標

- **統合管理**: 1つのGA4プロパティで全テナントを効率的に管理
- **テナント分離**: 各テナントの独立性を保ちつつデータを分析
- **ビジネス分析**: 課金・コンテンツ・ユーザー行動の総合的な分析
- **スケーラビリティ**: テナント数増加に対応可能な設計

## 2. GA4プロパティ構造設計

### 2.1 統合型アプローチの採用

```
GA4プロパティ: "マルチサイトプラットフォーム"
├── データストリーム: "統合Webストリーム"
│   ├── nextjs.example.com
│   ├── langchain.example.com
│   ├── claude-code.example.com
│   └── [その他全テナントドメイン]
└── 測定ID: G-XXXXXXXXXX (全テナント共通)
```

**採用理由**:
- **コスト効率**: GA4プロパティ制限内での運用
- **横断分析**: テナント間の比較分析が容易
- **管理の簡素化**: 1つの管理画面で全体を把握
- **データ統合**: 全体KPIとテナント別KPIの両立

### 2.2 データストリーム設定

```javascript
// gtag設定例
gtag('config', 'G-XXXXXXXXXX', {
  // クロスドメイントラッキング
  linker: {
    domains: [
      'nextjs.example.com',
      'langchain.example.com',
      'claude-code.example.com'
      // 他のテナントドメイン
    ]
  },
  // カスタムディメンション
  custom_map: {
    'custom_parameter_1': 'tenant_id',
    'custom_parameter_2': 'content_type',
    'custom_parameter_3': 'access_level'
  }
})
```

## 3. カスタムディメンション・メトリクス設計

### 3.1 カスタムディメンション

| 名前 | スコープ | 説明 | 例 |
|------|----------|------|-----|
| `tenant_id` | Event | テナント識別子 | nextjs, langchain, claude-code |
| `content_type` | Event | コンテンツタイプ | free, premium, paywall |
| `theme_type` | User | サイトテーマ | documentation, marketing |
| `access_level` | User | ユーザーアクセス権限 | free, premium, enterprise, admin |
| `subscription_status` | User | サブスクリプション状態 | active, canceled, trial, none |
| `payment_type` | Event | 決済タイプ | subscription, one_time |
| `content_category` | Event | コンテンツカテゴリ | tutorial, api_reference, best_practices |
| `user_tier` | User | ユーザー階層 | anonymous, registered, premium, enterprise |

### 3.2 カスタムメトリクス

| 名前 | 説明 | 計算方法 |
|------|------|----------|
| `premium_content_views` | 有料コンテンツ閲覧数 | premium_content_accessイベント数 |
| `paywall_interactions` | ペイウォール接触数 | paywall_viewイベント数 |
| `subscription_conversions` | サブスクリプション転換数 | subscription_purchaseイベント数 |
| `content_engagement_score` | コンテンツエンゲージメント | 滞在時間 × スクロール率 |
| `trial_to_paid_rate` | トライアル→有料転換率 | 有料転換数 / トライアル開始数 |

### 3.3 計算カスタムメトリクス

```javascript
// GA4で計算される指標例
const calculatedMetrics = {
  // テナント別コンバージョン率
  tenant_conversion_rate: 'conversions / sessions * 100',

  // 有料コンテンツエンゲージメント率
  premium_engagement_rate: 'premium_content_views / page_views * 100',

  // 月間経常収益（MRR）成長率
  mrr_growth_rate: '(current_month_revenue - previous_month_revenue) / previous_month_revenue * 100',

  // 顧客生涯価値（LTV）
  customer_ltv: 'average_revenue_per_user * average_customer_lifespan'
}
```

## 4. イベント追跡戦略

### 4.1 標準イベントの拡張

#### ページビューイベント
```javascript
gtag('event', 'page_view', {
  page_title: document.title,
  page_location: window.location.href,
  tenant_id: 'nextjs',
  content_type: 'free', // or 'premium'
  theme_type: 'documentation',
  content_category: 'tutorial'
})
```

#### ログインイベント
```javascript
gtag('event', 'login', {
  method: 'email', // or 'oauth_google', 'oauth_github'
  tenant_id: 'nextjs',
  user_tier: 'premium',
  subscription_status: 'active'
})
```

#### 購入イベント（Enhanced Ecommerce）
```javascript
gtag('event', 'purchase', {
  transaction_id: 'stripe_payment_intent_id',
  value: 2980,
  currency: 'JPY',
  items: [{
    item_id: 'nextjs_premium_monthly',
    item_name: 'Next.js Premium Monthly',
    category: 'subscription',
    quantity: 1,
    price: 2980
  }],
  tenant_id: 'nextjs',
  payment_type: 'subscription',
  subscription_interval: 'month'
})
```

### 4.2 カスタムイベント

#### プレミアムコンテンツアクセス
```javascript
gtag('event', 'premium_content_access', {
  content_id: 'advanced-nextjs-tutorial',
  content_title: 'Advanced Next.js Tutorial',
  tenant_id: 'nextjs',
  access_level: 'premium',
  content_category: 'tutorial',
  value: 1 // エンゲージメントスコア
})
```

#### ペイウォール表示
```javascript
gtag('event', 'paywall_view', {
  content_id: 'advanced-nextjs-tutorial',
  tenant_id: 'nextjs',
  paywall_position: 'mid_article', // top, mid_article, bottom
  price_shown: 2980,
  currency: 'JPY',
  payment_type: 'subscription'
})
```

#### サブスクリプショントライアル開始
```javascript
gtag('event', 'trial_start', {
  subscription_plan: 'premium_monthly',
  tenant_id: 'nextjs',
  trial_days: 7,
  value: 2980,
  currency: 'JPY'
})
```

#### コンテンツ検索
```javascript
gtag('event', 'search', {
  search_term: 'Next.js SSG',
  tenant_id: 'nextjs',
  search_results_count: 15,
  content_category: 'tutorial'
})
```

#### サイト間移動
```javascript
gtag('event', 'cross_tenant_navigation', {
  source_tenant: 'nextjs',
  destination_tenant: 'langchain',
  navigation_type: 'header_link' // footer_link, content_link, search
})
```

## 5. 技術実装設計

### 5.1 Next.js統合

#### 基本設定
```typescript
// app/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google'
import { AnalyticsProvider } from '@/components/AnalyticsProvider'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AnalyticsProvider>
          {children}
        </AnalyticsProvider>
        {process.env.NODE_ENV === 'production' && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
        )}
      </body>
    </html>
  )
}
```

#### テナント別Analytics Provider
```typescript
// components/AnalyticsProvider.tsx
'use client'
import { createContext, useContext, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'

interface AnalyticsContextType {
  trackEvent: (eventName: string, parameters: any) => void
  trackPageView: (pagePath: string, additionalParams?: any) => void
  trackPremiumAccess: (contentId: string, contentTitle: string) => void
  trackPaywallView: (contentId: string, price: number) => void
  trackPurchase: (transactionData: any) => void
}

export function AnalyticsProvider({
  children,
  tenantId
}: {
  children: React.ReactNode
  tenantId: string
}) {
  const { data: session } = useSession()
  const pathname = usePathname()

  // 自動ページビュー追跡
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        tenant_id: tenantId,
        user_tier: session?.user?.tier || 'anonymous',
        subscription_status: session?.user?.subscriptionStatus || 'none'
      })
    }
  }, [pathname, tenantId, session])

  const trackEvent = (eventName: string, parameters: any) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, {
        ...parameters,
        tenant_id: tenantId,
        user_id: session?.user?.id,
        timestamp: new Date().toISOString()
      })
    }
  }

  // 他のメソッド実装...

  return (
    <AnalyticsContext.Provider value={{ trackEvent, /* 他のメソッド */ }}>
      {children}
    </AnalyticsContext.Provider>
  )
}
```

### 5.2 サーバーサイド追跡

#### Measurement Protocol v4 実装
```typescript
// lib/server-analytics.ts
interface GA4Event {
  client_id: string
  user_id?: string
  events: Array<{
    name: string
    params: Record<string, any>
  }>
}

export class ServerAnalytics {
  private measurementId: string
  private apiSecret: string

  constructor() {
    this.measurementId = process.env.GA_MEASUREMENT_ID!
    this.apiSecret = process.env.GA_API_SECRET!
  }

  async trackEvent(userId: string, eventName: string, params: any) {
    const payload: GA4Event = {
      client_id: this.generateClientId(userId),
      user_id: userId,
      events: [{
        name: eventName,
        params: {
          ...params,
          timestamp_micros: Date.now() * 1000
        }
      }]
    }

    const response = await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${this.measurementId}&api_secret=${this.apiSecret}`,
      {
        method: 'POST',
        body: JSON.stringify(payload)
      }
    )

    return response.ok
  }

  // Stripe Webhook経由での購入追跡
  async trackPurchaseFromWebhook(subscriptionData: any) {
    await this.trackEvent(
      subscriptionData.metadata.user_id,
      'purchase',
      {
        transaction_id: subscriptionData.id,
        value: subscriptionData.items.data[0].price.unit_amount / 100,
        currency: subscriptionData.items.data[0].price.currency.toUpperCase(),
        tenant_id: subscriptionData.metadata.tenant_id,
        payment_type: 'subscription',
        subscription_interval: subscriptionData.items.data[0].price.recurring.interval
      }
    )
  }

  private generateClientId(userId: string): string {
    // 一貫性のあるclient_id生成
    return Buffer.from(userId).toString('base64').substring(0, 32)
  }
}
```

### 5.3 Enhanced Ecommerce統合

#### Stripe連携での購入追跡
```typescript
// app/api/stripe/webhook/route.ts (既存のwebhookに追加)
import { ServerAnalytics } from '@/lib/server-analytics'

const serverAnalytics = new ServerAnalytics()

async function handleSubscriptionCreated(subscription: any) {
  // 既存の処理...

  // GA4への購入イベント送信
  await serverAnalytics.trackPurchaseFromWebhook(subscription)

  // アイテム詳細付きの購入追跡
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: subscription.id,
      value: subscription.items.data[0].price.unit_amount / 100,
      currency: subscription.items.data[0].price.currency.toUpperCase(),
      items: [{
        item_id: subscription.items.data[0].price.id,
        item_name: `${subscription.metadata.tenant_id} Premium Subscription`,
        category: 'subscription',
        category2: subscription.metadata.tenant_id,
        quantity: 1,
        price: subscription.items.data[0].price.unit_amount / 100
      }],
      tenant_id: subscription.metadata.tenant_id,
      payment_type: 'subscription'
    })
  }
}
```

## 6. ビジネス分析フレームワーク

### 6.1 テナント別KPI設計

#### 主要指標
```typescript
interface TenantKPIs {
  // トラフィック指標
  monthly_users: number
  page_views: number
  session_duration: number
  bounce_rate: number

  // エンゲージメント指標
  content_views_per_session: number
  premium_content_ratio: number
  search_usage_rate: number

  // コンバージョン指標
  trial_conversion_rate: number
  purchase_conversion_rate: number
  subscription_retention_rate: number

  // 収益指標
  monthly_recurring_revenue: number
  average_revenue_per_user: number
  customer_lifetime_value: number
  churn_rate: number
}
```

#### 比較分析フレームワーク
```typescript
interface TenantComparison {
  performance_ranking: {
    tenant_id: string
    metric: string
    value: number
    rank: number
    percentage_of_top: number
  }[]

  growth_analysis: {
    tenant_id: string
    current_period: number
    previous_period: number
    growth_rate: number
    trend: 'improving' | 'declining' | 'stable'
  }[]

  content_effectiveness: {
    tenant_id: string
    top_performing_content: string[]
    conversion_drivers: string[]
    optimization_opportunities: string[]
  }[]
}
```

### 6.2 コンテンツ分析設計

#### コンテンツパフォーマンス指標
```typescript
interface ContentAnalytics {
  content_id: string
  tenant_id: string
  title: string
  type: 'free' | 'premium'
  category: string

  metrics: {
    views: number
    unique_viewers: number
    avg_time_on_page: number
    scroll_depth: number
    exit_rate: number

    // プレミアムコンテンツ専用
    paywall_views?: number
    conversion_rate?: number
    revenue_generated?: number
  }

  user_behavior: {
    search_keywords: string[]
    referral_sources: string[]
    next_content_viewed: string[]
  }
}
```

#### A/Bテスト分析
```typescript
interface ABTestAnalytics {
  test_id: string
  tenant_id: string
  test_name: string
  variants: {
    variant_id: string
    traffic_allocation: number
    conversion_rate: number
    statistical_significance: number
  }[]

  results: {
    winner: string
    confidence_level: number
    improvement: number
    recommended_action: string
  }
}
```

### 6.3 収益分析フレームワーク

#### サブスクリプション分析
```typescript
interface SubscriptionAnalytics {
  tenant_id: string
  period: string

  acquisition: {
    new_subscribers: number
    trial_signups: number
    trial_to_paid_rate: number
    acquisition_cost: number
  }

  retention: {
    active_subscribers: number
    churn_rate: number
    retention_rate_by_cohort: number[]
    upgrade_rate: number
    downgrade_rate: number
  }

  revenue: {
    mrr: number
    arr: number
    arpu: number
    ltv: number
    revenue_per_content: number
  }
}
```

## 7. ダッシュボード・レポート設計

### 7.1 ダッシュボード階層

```
1. エグゼクティブダッシュボード
   ├── 全体KPI概要
   ├── テナント別パフォーマンス比較
   └── 収益トレンド

2. テナント管理ダッシュボード
   ├── 個別テナント詳細分析
   ├── コンテンツパフォーマンス
   └── ユーザー行動分析

3. コンテンツ最適化ダッシュボード
   ├── ページ別分析
   ├── ペイウォール効果測定
   └── A/Bテスト結果

4. 収益分析ダッシュボード
   ├── サブスクリプション分析
   ├── コンバージョンファネル
   └── 顧客セグメント分析
```

### 7.2 Looker Studio設定

#### データソース設定
```javascript
// Looker Studioデータソース設定例
const dataSourceConfig = {
  source: 'Google Analytics 4',
  account: 'your-ga4-account',
  property: 'multisite-platform-property',

  // カスタムディメンション マッピング
  customDimensions: {
    'tenant_id': 'customEvent:tenant_id',
    'content_type': 'customEvent:content_type',
    'access_level': 'customUser:access_level'
  },

  // 計算フィールド
  calculatedFields: [
    {
      name: 'Premium Content Engagement Rate',
      formula: 'premium_content_views / page_views * 100'
    },
    {
      name: 'Revenue per Visitor',
      formula: 'purchase_revenue / users'
    }
  ]
}
```

#### 自動レポート生成
```typescript
// 定期レポート自動生成
interface AutoReportConfig {
  recipients: string[]
  frequency: 'daily' | 'weekly' | 'monthly'
  reports: {
    executive_summary: boolean
    tenant_performance: boolean
    content_analytics: boolean
    revenue_analysis: boolean
  }
  filters: {
    tenant_ids?: string[]
    date_range: string
    metrics: string[]
  }
}
```

## 8. プライバシー・コンプライアンス設計

### 8.1 GDPR対応

#### Cookie同意管理
```typescript
// components/CookieConsent.tsx
export function CookieConsent() {
  const handleAccept = () => {
    // GA4同意設定
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'denied', // 広告は使用しないので拒否
        ad_user_data: 'denied',
        ad_personalization: 'denied'
      })
    }
  }

  const handleDecline = () => {
    window.gtag('consent', 'update', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    })
  }

  return (
    <div className="cookie-consent">
      {/* Cookie同意UI */}
    </div>
  )
}
```

#### データ保持ポリシー
```typescript
const dataRetentionPolicy = {
  // GA4データ保持期間
  ga4_retention: '26_months', // 26ヶ月（GA4デフォルト）

  // ユーザーデータ削除
  user_data_deletion: {
    automatic: '36_months', // 36ヶ月後自動削除
    on_request: 'immediate' // リクエスト時即座に削除
  },

  // 匿名化処理
  anonymization: {
    ip_address: true, // IPアドレス匿名化
    user_id: '12_months' // 12ヶ月後にuser_id削除
  }
}
```

### 8.2 データセキュリティ

#### 機密情報の除外
```typescript
// 送信データのサニタイズ
function sanitizeAnalyticsData(data: any) {
  const sanitized = { ...data }

  // 個人情報の除外
  delete sanitized.email
  delete sanitized.password
  delete sanitized.credit_card
  delete sanitized.personal_data

  // IPアドレスの匿名化
  if (sanitized.ip_address) {
    sanitized.ip_address = anonymizeIP(sanitized.ip_address)
  }

  return sanitized
}
```

## 9. 実装ロードマップ

### 9.1 Phase 1: 基盤構築（1-2週間）

- [ ] GA4プロパティ・データストリーム設定
- [ ] Next.js統合（@next/third-parties）
- [ ] 基本的なカスタムディメンション設定
- [ ] 標準イベント追跡実装

### 9.2 Phase 2: 高度な追跡実装（2-3週間）

- [ ] カスタムイベント実装
- [ ] Enhanced Ecommerce統合
- [ ] サーバーサイド追跡（Measurement Protocol）
- [ ] Stripe Webhook連携

### 9.3 Phase 3: 分析・レポート構築（2-3週間）

- [ ] Looker Studioダッシュボード構築
- [ ] 自動レポート生成システム
- [ ] A/Bテスト分析フレームワーク
- [ ] パフォーマンス監視

### 9.4 Phase 4: 最適化・拡張（継続）

- [ ] 機械学習による予測分析
- [ ] リアルタイムアラート
- [ ] 高度なセグメンテーション
- [ ] カスタムAI分析

## 10. 運用・監視

### 10.1 データ品質管理

```typescript
// データ品質チェック
interface DataQualityMetrics {
  event_tracking_rate: number // イベント追跡成功率
  data_completeness: number   // データ完全性
  duplicate_events: number    // 重複イベント数
  error_rate: number         // エラー率
}

// 監視アラート設定
const monitoringAlerts = {
  tracking_failure_rate: { threshold: 5, action: 'email_admin' },
  data_spike: { threshold: 200, action: 'investigate' },
  conversion_drop: { threshold: 20, action: 'urgent_notification' }
}
```

### 10.2 パフォーマンス最適化

```typescript
// Analytics パフォーマンス最適化
const optimizationConfig = {
  // バッチ送信
  batch_events: true,
  batch_size: 10,
  batch_timeout: 5000,

  // サンプリング
  sampling_rate: {
    development: 100, // 開発環境は100%
    production: 100   // 本番環境も100%（小規模のため）
  },

  // キャッシュ
  cache_analytics: true,
  cache_duration: 300 // 5分
}
```

## 11. 成功指標・KPI

### 11.1 実装成功指標

- **データ品質**: イベント追跡成功率 > 95%
- **レポート精度**: データ整合性 > 99%
- **レスポンス性能**: Analytics処理時間 < 200ms
- **ユーザビリティ**: ダッシュボード読み込み時間 < 3秒

### 11.2 ビジネス成功指標

- **分析活用度**: 月次レポート使用率 > 80%
- **意思決定支援**: データ基盤での意思決定 > 60%
- **ROI向上**: Analytics活用による収益改善 > 10%
- **テナント満足度**: 分析機能満足度 > 4.0/5.0

---

この設計書に基づき、段階的にGA4分析システムを実装し、マルチサイトプラットフォームの成長を支援するデータドリブンな意思決定を実現します。