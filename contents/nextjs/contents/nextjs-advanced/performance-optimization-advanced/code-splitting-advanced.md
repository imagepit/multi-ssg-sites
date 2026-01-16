---
title: コード分割
slug: code-splitting-advanced
parent: performance-optimization-advanced
status: not_started
filepath: docs/nextjs/contents/nextjs-advanced/performance-optimization-advanced/code-splitting-advanced.md
post_type: pages
target: 実践者
goal: 高度なコード分割戦略。ルートベース、コンポーネントベース、動的インポートの最適化
seo_title: 高度コード分割戦略 | ルート・コンポーネント・動的インポート
seo_description: 高度なコード分割戦略でバンドルサイズを最適化し、初期読み込み時間を短縮
seo_keywords: コード分割, 動的インポート, バンドル最適化
handson_overview: コード分割設定、動的インポート、バンドル分析、読み込み最適化の実装手順を掲載
---

## はじめに

現代のWebアプリケーションでは、JavaScriptバンドルのサイズが増大し、初期読み込み時間の悪化につながることが課題となっています。コード分割は、この問題を解決するための強力な最適化手法です。

この章では、Next.jsでの高度なコード分割戦略を学習し、実際のアプリケーションでパフォーマンスを向上させる方法を習得します。

### このページで学べる事

このページでは、Next.jsにおける高度なコード分割の実装方法と最適化戦略について学習します。

:::note

- ルートベースコード分割の詳細設定
- コンポーネントレベルでの動的インポート
- バンドル分析と最適化手法
- サードパーティライブラリの分割戦略
- パフォーマンス測定とモニタリング

:::

## ルートベースコード分割

Next.jsはデフォルトでルートベースのコード分割を提供しており、各ページが自動的に独立したチャンクに分割されます。これにより、ユーザーは現在のページに必要なコードのみをダウンロードします。

:::note ルートベースコード分割とは

ページごとにJavaScriptバンドルを分割し、各ルート（URL）に対応するコードのみを読み込む手法です。ユーザーが特定のページにアクセスした際に、そのページに必要なコードのみを動的に読み込むことで、初期読み込み時間を短縮できます。

:::

### ページレベルでの分割最適化

Next.jsのApp Routerでは、各ページコンポーネントが自動的に分割されますが、さらに細かい制御も可能です。

### ルートベースコード分割を実装してみよう

実際にルートベースのコード分割を実装し、バンドル分析ツールで効果を確認してみましょう。

:::step

1. プロジェクトの作成とセットアップ

任意の場所（デスクトップなど）で`nextjs-code-splitting`フォルダを作成し、Next.jsプロジェクトを初期化します。

```bash
npx create-next-app@latest nextjs-code-splitting --typescript --tailwind --eslint --app
```

```bash
cd nextjs-code-splitting
```

2. バンドル分析ツールのインストール

バンドルサイズを視覚化するためのツールをインストールします。

```bash
npm install @next/bundle-analyzer
```

3. Next.js設定ファイルの更新

`next.config.js`を作成して、バンドル分析を有効にします。

_next.config.js_

```javascript
/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
  // 実験的機能を有効化
  experimental: {
    optimizePackageImports: ['lodash', 'date-fns'],
  },
  // 動的インポートの最適化
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      }
    }
    return config
  },
}

module.exports = withBundleAnalyzer(nextConfig)
```

4. 複数のページコンポーネントの作成

`app`フォルダ内に複数のページを作成します。

_app/dashboard/page.tsx_

```typescript
//addstart
export default function Dashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">ダッシュボード</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-blue-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold">統計情報</h2>
          <p>アプリケーションの統計データ</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold">パフォーマンス</h2>
          <p>パフォーマンス指標</p>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold">レポート</h2>
          <p>詳細レポート</p>
        </div>
      </div>
    </div>
  )
}
//addend
```

_app/profile/page.tsx_

```typescript
//addstart
export default function Profile() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">プロフィール</h1>
      <div className="max-w-2xl">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
            <div>
              <h2 className="text-2xl font-bold">ユーザー名</h2>
              <p className="text-gray-600">user@example.com</p>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">基本情報</h3>
            <div className="space-y-2">
              <p><span className="font-medium">部署:</span> 開発部</p>
              <p><span className="font-medium">役職:</span> エンジニア</p>
              <p><span className="font-medium">入社日:</span> 2023年4月1日</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
//addend
```

5. ナビゲーションコンポーネントの追加

`app/layout.tsx`を更新してナビゲーションを追加します。

_app/layout.tsx_

```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
//addstart
import Link from 'next/link'
//addend

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Next.js Code Splitting Demo',
  description: 'コード分割のデモアプリケーション',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        //addstart
        <nav className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex space-x-4">
            <Link href="/" className="hover:text-gray-300">
              ホーム
            </Link>
            <Link href="/dashboard" className="hover:text-gray-300">
              ダッシュボード
            </Link>
            <Link href="/profile" className="hover:text-gray-300">
              プロフィール
            </Link>
          </div>
        </nav>
        //addend
        {children}
      </body>
    </html>
  )
}
```

6. バンドル分析の実行

アプリケーションをビルドし、バンドル分析を実行します。

```bash
ANALYZE=true npm run build
```

ブラウザが自動的に開き、バンドルの構成が視覚化されます。各ページが独立したチャンクに分割されていることを確認できます。

:::

このように、Next.jsは自動的にルートベースのコード分割を行い、各ページが独立したバンドルとして配信されます。バンドル分析ツールを使用することで、分割の効果を視覚的に確認できます。

## コンポーネントレベルでの動的インポート

ページレベルの分割に加えて、重いコンポーネントやライブラリを動的にインポートすることで、さらなる最適化が可能です。

:::note 動的インポートとは

JavaScript ES2020で導入された機能で、必要な時にモジュールを非同期で読み込む仕組みです。import()関数を使用して、実行時にモジュールを動的に読み込むことができ、初期バンドルサイズの削減に効果的です。

:::

:::syntax 動的インポートの基本構文

```typescript
// 基本的な動的インポート
const module = await import('./module')

// Next.jsでのコンポーネント動的インポート
const DynamicComponent = dynamic(() => import('./HeavyComponent'))

// 条件付き動的インポート
if (condition) {
  const { heavyFunction } = await import('./heavy-utils')
  heavyFunction()
}
```

:::

### 重いコンポーネントの分割戦略

チャートライブラリやエディタなど、サイズの大きなコンポーネントは動的インポートの恩恵を最も受けやすい要素です。

### 動的インポートを実装してみよう

実際に重いコンポーネントを動的インポートで分割し、パフォーマンスの改善を確認してみましょう。

:::step

1. React Chartjsライブラリのインストール

グラフ表示用の重いライブラリをインストールします。

```bash
npm install react-chartjs-2 chart.js
```

2. 重いチャートコンポーネントの作成

`components/HeavyChart.tsx`に大きなライブラリを使用するコンポーネントを作成します。

_components/HeavyChart.tsx_

```typescript
//addstart
'use client'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export default function HeavyChart() {
  const data = {
    labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
    datasets: [
      {
        label: '売上',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '月別売上グラフ',
      },
    },
  }

  return (
    <div className="w-full h-96">
      <Bar data={data} options={options} />
    </div>
  )
}
//addend
```

3. 動的インポート用のラッパーコンポーネント

`components/DynamicChart.tsx`に動的インポートを実装するコンポーネントを作成します。

_components/DynamicChart.tsx_

```typescript
//addstart
'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

// 動的インポートでHeavyChartを読み込み
const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => (
    <div className="w-full h-96 bg-gray-100 animate-pulse flex items-center justify-center">
      <div className="text-gray-500">チャートを読み込み中...</div>
    </div>
  ),
  ssr: false, // サーバーサイドレンダリングを無効化
})

export default function DynamicChart() {
  const [showChart, setShowChart] = useState(false)

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">パフォーマンスチャート</h3>

      {!showChart ? (
        <div className="text-center">
          <p className="mb-4 text-gray-600">
            チャートを表示するとライブラリが動的に読み込まれます
          </p>
          <button
            onClick={() => setShowChart(true)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            チャートを表示
          </button>
        </div>
      ) : (
        <HeavyChart />
      )}
    </div>
  )
}
//addend
```

4. ダッシュボードページに動的チャートを追加

`app/dashboard/page.tsx`を更新して動的チャートコンポーネントを追加します。

_app/dashboard/page.tsx_

```typescript
//addstart
import DynamicChart from '../../components/DynamicChart'
//addend

export default function Dashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">ダッシュボード</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold">統計情報</h2>
          <p>アプリケーションの統計データ</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold">パフォーマンス</h2>
          <p>パフォーマンス指標</p>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold">レポート</h2>
          <p>詳細レポート</p>
        </div>
      </div>

      //addstart
      <div className="mt-8">
        <DynamicChart />
      </div>
      //addend
    </div>
  )
}
```

5. パフォーマンスの確認

開発サーバーを起動してパフォーマンスを確認します。

```bash
npm run dev
```

ブラウザで`http://localhost:3000/dashboard`にアクセスし、開発者ツールのNetworkタブを開いてチャート表示ボタンをクリックします。Chart.jsライブラリが動的に読み込まれることを確認できます。

6. バンドル分析での確認

再度バンドル分析を実行して、Chart.jsが別チャンクに分離されていることを確認します。

```bash
ANALYZE=true npm run build
```

:::

動的インポートにより、Chart.jsライブラリは必要な時にのみ読み込まれ、初期バンドルサイズを大幅に削減できます。ユーザーがチャートを表示する際にのみライブラリが読み込まれるため、アプリケーション全体のパフォーマンスが向上します。

## サードパーティライブラリの最適化

大きなサードパーティライブラリの分割と最適化は、コード分割の重要な要素です。特にUIライブラリやユーティリティライブラリの tree-shaking と組み合わせることで効果的な最適化が可能です。

:::note Tree-shakingとは

使用されていないコードを自動的に除去する最適化手法です。ES2015モジュール（import/export）を使用している場合、Webpackなどのバンドラーが静的解析を行い、実際に使用されている関数やクラスのみをバンドルに含めます。

:::

### ライブラリの部分インポート戦略

大きなライブラリから必要な機能のみをインポートすることで、バンドルサイズを大幅に削減できます。

### ライブラリの最適化を実装してみよう

実際にLodashライブラリを使用して、部分インポートと動的インポートの最適化を実装してみましょう。

:::step

1. Lodashライブラリのインストール

よく使われるユーティリティライブラリをインストールします。

```bash
npm install lodash
npm install --save-dev @types/lodash
```

2. 非効率なライブラリ使用例の作成

まず、非効率な全体インポートの例を作成します。

_components/DataProcessor.tsx_

```typescript
//addstart
'use client'

// 非効率：ライブラリ全体をインポート
import * as _ from 'lodash'
import { useState } from 'react'

export default function DataProcessor() {
  const [data, setData] = useState([
    { id: 1, name: 'Apple', category: 'fruit', price: 100 },
    { id: 2, name: 'Banana', category: 'fruit', price: 80 },
    { id: 3, name: 'Carrot', category: 'vegetable', price: 60 },
    { id: 4, name: 'Broccoli', category: 'vegetable', price: 120 },
  ])

  const [processedData, setProcessedData] = useState<any>(null)

  const processData = () => {
    // Lodashの機能を少しだけ使用
    const grouped = _.groupBy(data, 'category')
    const sorted = _.mapValues(grouped, (items) =>
      _.sortBy(items, 'price')
    )
    setProcessedData(sorted)
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">データ処理（非効率版）</h3>
      <button
        onClick={processData}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        データを処理する（全体インポート）
      </button>

      {processedData && (
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
          {JSON.stringify(processedData, null, 2)}
        </pre>
      )}
    </div>
  )
}
//addend
```

3. 効率的な部分インポート版の作成

次に、必要な機能のみをインポートする効率的なバージョンを作成します。

_components/OptimizedDataProcessor.tsx_

```typescript
//addstart
'use client'

// 効率的：必要な機能のみをインポート
import groupBy from 'lodash/groupBy'
import mapValues from 'lodash/mapValues'
import sortBy from 'lodash/sortBy'
import { useState } from 'react'

export default function OptimizedDataProcessor() {
  const [data, setData] = useState([
    { id: 1, name: 'Apple', category: 'fruit', price: 100 },
    { id: 2, name: 'Banana', category: 'fruit', price: 80 },
    { id: 3, name: 'Carrot', category: 'vegetable', price: 60 },
    { id: 4, name: 'Broccoli', category: 'vegetable', price: 120 },
  ])

  const [processedData, setProcessedData] = useState<any>(null)

  const processData = () => {
    // 同じ機能だが、必要な関数のみを使用
    const grouped = groupBy(data, 'category')
    const sorted = mapValues(grouped, (items) =>
      sortBy(items, 'price')
    )
    setProcessedData(sorted)
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">データ処理（最適化版）</h3>
      <button
        onClick={processData}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        データを処理する（部分インポート）
      </button>

      {processedData && (
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
          {JSON.stringify(processedData, null, 2)}
        </pre>
      )}
    </div>
  )
}
//addend
```

4. 動的インポートを使用した高度な最適化

さらに、使用頻度の低い機能を動的インポートで読み込む例を作成します。

_components/AdvancedDataProcessor.tsx_

```typescript
//addstart
'use client'

import { useState } from 'react'

export default function AdvancedDataProcessor() {
  const [data, setData] = useState([
    { id: 1, name: 'Apple', category: 'fruit', price: 100 },
    { id: 2, name: 'Banana', category: 'fruit', price: 80 },
    { id: 3, name: 'Carrot', category: 'vegetable', price: 60 },
    { id: 4, name: 'Broccoli', category: 'vegetable', price: 120 },
  ])

  const [processedData, setProcessedData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const processDataAdvanced = async () => {
    setIsLoading(true)

    try {
      // 高度な処理が必要な時のみLodashを動的に読み込み
      const [
        { default: groupBy },
        { default: mapValues },
        { default: sortBy },
        { default: meanBy },
        { default: maxBy },
        { default: minBy }
      ] = await Promise.all([
        import('lodash/groupBy'),
        import('lodash/mapValues'),
        import('lodash/sortBy'),
        import('lodash/meanBy'),
        import('lodash/maxBy'),
        import('lodash/minBy')
      ])

      const grouped = groupBy(data, 'category')
      const analyzed = mapValues(grouped, (items) => {
        const sorted = sortBy(items, 'price')
        const avgPrice = meanBy(items, 'price')
        const maxPrice = maxBy(items, 'price')
        const minPrice = minBy(items, 'price')

        return {
          items: sorted,
          stats: {
            average: Math.round(avgPrice),
            highest: maxPrice,
            lowest: minPrice
          }
        }
      })

      setProcessedData(analyzed)
    } catch (error) {
      console.error('データ処理エラー:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">データ処理（動的インポート版）</h3>
      <button
        onClick={processDataAdvanced}
        disabled={isLoading}
        className="bg-purple-500 hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded mb-4"
      >
        {isLoading ? '処理中...' : '高度な分析を実行（動的読み込み）'}
      </button>

      {processedData && (
        <div className="space-y-4">
          {Object.entries(processedData).map(([category, categoryData]: [string, any]) => (
            <div key={category} className="bg-gray-50 p-4 rounded">
              <h4 className="font-semibold text-lg capitalize mb-2">{category}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium mb-2">商品一覧（価格順）</h5>
                  <ul className="space-y-1 text-sm">
                    {categoryData.items.map((item: any) => (
                      <li key={item.id}>{item.name}: ¥{item.price}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">統計情報</h5>
                  <ul className="space-y-1 text-sm">
                    <li>平均価格: ¥{categoryData.stats.average}</li>
                    <li>最高価格: {categoryData.stats.highest.name} (¥{categoryData.stats.highest.price})</li>
                    <li>最低価格: {categoryData.stats.lowest.name} (¥{categoryData.stats.lowest.price})</li>
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
//addend
```

5. プロフィールページに最適化コンポーネントを追加

`app/profile/page.tsx`を更新して、3つの最適化レベルを比較できるようにします。

_app/profile/page.tsx_

```typescript
//addstart
import DataProcessor from '../../components/DataProcessor'
import OptimizedDataProcessor from '../../components/OptimizedDataProcessor'
import AdvancedDataProcessor from '../../components/AdvancedDataProcessor'
//addend

export default function Profile() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">プロフィール</h1>
      <div className="max-w-2xl mb-8">
        {/* 既存のプロフィール内容 */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
            <div>
              <h2 className="text-2xl font-bold">ユーザー名</h2>
              <p className="text-gray-600">user@example.com</p>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">基本情報</h3>
            <div className="space-y-2">
              <p><span className="font-medium">部署:</span> 開発部</p>
              <p><span className="font-medium">役職:</span> エンジニア</p>
              <p><span className="font-medium">入社日:</span> 2023年4月1日</p>
            </div>
          </div>
        </div>
      </div>

      //addstart
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">ライブラリ最適化の比較</h2>
        <DataProcessor />
        <OptimizedDataProcessor />
        <AdvancedDataProcessor />
      </div>
      //addend
    </div>
  )
}
```

6. バンドル分析での最適化効果の確認

バンドル分析を実行して、最適化の効果を確認します。

```bash
ANALYZE=true npm run build
```

分析結果で、全体インポート版と部分インポート版、動的インポート版のバンドルサイズの違いを比較できます。

:::

この実装により、ライブラリの使用方法がバンドルサイズに与える影響を実際に確認できます。部分インポートでは必要な機能のみがバンドルに含まれ、動的インポートでは使用する時点でのみライブラリが読み込まれます。

## パフォーマンス測定とモニタリング

コード分割の効果を正確に測定し、継続的にモニタリングすることは、最適化戦略の成功に不可欠です。

:::note Core Web Vitalsとは

Googleが定義したWebページのユーザーエクスペリエンスを測定する重要な指標群です。LCP（Largest Contentful Paint）、FID（First Input Delay）、CLS（Cumulative Layout Shift）の3つの指標で構成され、SEOにも影響を与えます。

:::

### パフォーマンス測定のベストプラクティス

リアルタイムでのパフォーマンス測定と、開発時のパフォーマンス分析の両方が重要です。

### パフォーマンス測定を実装してみよう

Web Vitalsを測定し、コード分割の効果をモニタリングする仕組みを実装してみましょう。

:::step

1. Web Vitalsライブラリのインストール

パフォーマンス測定のためのライブラリをインストールします。

```bash
npm install web-vitals
```

2. パフォーマンス測定フックの作成

`hooks/useWebVitals.ts`にパフォーマンス測定用のカスタムフックを作成します。

_hooks/useWebVitals.ts_

```typescript
//addstart
'use client'

import { useEffect, useState } from 'react'
import { onCLS, onFCP, onFID, onLCP, onTTFB } from 'web-vitals'

interface WebVitalsData {
  CLS: number | null
  FCP: number | null
  FID: number | null
  LCP: number | null
  TTFB: number | null
}

export function useWebVitals() {
  const [vitals, setVitals] = useState<WebVitalsData>({
    CLS: null,
    FCP: null,
    FID: null,
    LCP: null,
    TTFB: null,
  })

  useEffect(() => {
    onCLS((metric) => {
      setVitals(prev => ({ ...prev, CLS: metric.value }))
    })

    onFCP((metric) => {
      setVitals(prev => ({ ...prev, FCP: metric.value }))
    })

    onFID((metric) => {
      setVitals(prev => ({ ...prev, FID: metric.value }))
    })

    onLCP((metric) => {
      setVitals(prev => ({ ...prev, LCP: metric.value }))
    })

    onTTFB((metric) => {
      setVitals(prev => ({ ...prev, TTFB: metric.value }))
    })
  }, [])

  return vitals
}
//addend
```

3. パフォーマンスダッシュボードコンポーネントの作成

`components/PerformanceDashboard.tsx`にパフォーマンス情報を表示するコンポーネントを作成します。

_components/PerformanceDashboard.tsx_

```typescript
//addstart
'use client'

import { useWebVitals } from '../hooks/useWebVitals'
import { useEffect, useState } from 'react'

interface BundleInfo {
  totalSize: number
  chunkCount: number
  mainChunkSize: number
}

export default function PerformanceDashboard() {
  const vitals = useWebVitals()
  const [bundleInfo, setBundleInfo] = useState<BundleInfo | null>(null)
  const [navigationTiming, setNavigationTiming] = useState<any>(null)

  useEffect(() => {
    // Navigation Timing APIを使用してパフォーマンス情報を取得
    if (typeof window !== 'undefined' && window.performance) {
      const timing = window.performance.timing
      const navigation = window.performance.navigation

      setNavigationTiming({
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        loadComplete: timing.loadEventEnd - timing.navigationStart,
        firstPaint: window.performance.getEntriesByType('paint')
          .find(entry => entry.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: window.performance.getEntriesByType('paint')
          .find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
      })

      // リソースサイズ情報の取得（概算）
      const resources = window.performance.getEntriesByType('resource')
      const jsResources = resources.filter(resource =>
        resource.name.includes('.js') || resource.name.includes('/_next/')
      )

      setBundleInfo({
        totalSize: jsResources.reduce((total, resource) =>
          total + (resource.transferSize || 0), 0
        ),
        chunkCount: jsResources.length,
        mainChunkSize: jsResources.find(resource =>
          resource.name.includes('main')
        )?.transferSize || 0,
      })
    }
  }, [])

  const formatTime = (time: number | null) => {
    if (time === null) return '-'
    return `${Math.round(time)}ms`
  }

  const formatSize = (size: number) => {
    if (size < 1024) return `${size}B`
    if (size < 1024 * 1024) return `${Math.round(size / 1024)}KB`
    return `${Math.round(size / (1024 * 1024))}MB`
  }

  const getScoreColor = (metric: string, value: number | null) => {
    if (value === null) return 'text-gray-500'

    switch (metric) {
      case 'LCP':
        return value <= 2500 ? 'text-green-600' : value <= 4000 ? 'text-yellow-600' : 'text-red-600'
      case 'FID':
        return value <= 100 ? 'text-green-600' : value <= 300 ? 'text-yellow-600' : 'text-red-600'
      case 'CLS':
        return value <= 0.1 ? 'text-green-600' : value <= 0.25 ? 'text-yellow-600' : 'text-red-600'
      default:
        return 'text-gray-700'
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-6">パフォーマンスダッシュボード</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Core Web Vitals */}
        <div className="space-y-4">
          <h4 className="font-semibold text-lg">Core Web Vitals</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>LCP (読み込み)</span>
              <span className={getScoreColor('LCP', vitals.LCP)}>
                {formatTime(vitals.LCP)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>FID (応答性)</span>
              <span className={getScoreColor('FID', vitals.FID)}>
                {formatTime(vitals.FID)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>CLS (視覚安定性)</span>
              <span className={getScoreColor('CLS', vitals.CLS)}>
                {vitals.CLS !== null ? vitals.CLS.toFixed(3) : '-'}
              </span>
            </div>
          </div>
        </div>

        {/* その他のメトリクス */}
        <div className="space-y-4">
          <h4 className="font-semibold text-lg">読み込み時間</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>FCP</span>
              <span>{formatTime(vitals.FCP)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>TTFB</span>
              <span>{formatTime(vitals.TTFB)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>DOM読み込み</span>
              <span>{formatTime(navigationTiming?.domContentLoaded)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>完全読み込み</span>
              <span>{formatTime(navigationTiming?.loadComplete)}</span>
            </div>
          </div>
        </div>

        {/* バンドル情報 */}
        <div className="space-y-4">
          <h4 className="font-semibold text-lg">バンドル情報</h4>
          {bundleInfo ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>総サイズ</span>
                <span>{formatSize(bundleInfo.totalSize)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>チャンク数</span>
                <span>{bundleInfo.chunkCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>メインチャンク</span>
                <span>{formatSize(bundleInfo.mainChunkSize)}</span>
              </div>
            </div>
          ) : (
            <div className="text-gray-500">計測中...</div>
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded">
        <h5 className="font-medium mb-2">パフォーマンス改善のヒント</h5>
        <ul className="text-sm space-y-1 text-blue-800">
          <li>• LCPが2.5秒以下であることが理想的です</li>
          <li>• FIDは100ms以下を目標にしましょう</li>
          <li>• CLSは0.1以下を維持することが重要です</li>
          <li>• 動的インポートでバンドルサイズを最適化できます</li>
        </ul>
      </div>
    </div>
  )
}
//addend
```

4. ホームページにパフォーマンスダッシュボードを追加

`app/page.tsx`を更新してパフォーマンスダッシュボードを表示します。

_app/page.tsx_

```typescript
//addstart
import PerformanceDashboard from '../components/PerformanceDashboard'
//addend

export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Next.js コード分割デモ</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">プロジェクト概要</h2>
        <p className="text-gray-700 leading-relaxed">
          このアプリケーションは、Next.jsでの高度なコード分割戦略のデモンストレーションです。
          ルートベースの分割、コンポーネントレベルの動的インポート、
          サードパーティライブラリの最適化などの技術を実装しています。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">📊 ダッシュボード</h3>
          <p className="text-gray-700 mb-4">
            動的にChart.jsライブラリを読み込むコンポーネントを体験できます。
          </p>
          <a
            href="/dashboard"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block"
          >
            ダッシュボードを見る
          </a>
        </div>

        <div className="bg-gradient-to-br from-green-100 to-green-200 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">👤 プロフィール</h3>
          <p className="text-gray-700 mb-4">
            Lodashライブラリの様々なインポート手法を比較できます。
          </p>
          <a
            href="/profile"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-block"
          >
            プロフィールを見る
          </a>
        </div>
      </div>

      //addstart
      <PerformanceDashboard />
      //addend
    </div>
  )
}
```

5. パフォーマンステストの実行

プロダクションビルドでパフォーマンスを測定します。

```bash
npm run build
npm start
```

ブラウザで`http://localhost:3000`にアクセスし、パフォーマンスダッシュボードでCore Web Vitalsの値を確認します。

6. Lighthouseでの詳細分析

Chrome DevToolsのLighthouseタブでパフォーマンス監査を実行します。

- Chrome DevToolsを開く（F12）
- Lighthouseタブを選択
- パフォーマンス監査を実行
- コード分割の効果を確認

:::

パフォーマンス測定ダッシュボードにより、コード分割の効果をリアルタイムで確認できます。Core Web Vitalsの改善や、バンドルサイズの最適化効果を数値で把握することで、継続的なパフォーマンス改善が可能になります。

## まとめ

本章では、Next.jsにおける高度なコード分割戦略について学習しました。これらの技術を適切に実装することで、アプリケーションのパフォーマンスを大幅に向上させることができます。

:::note 要点のまとめ

- **ルートベースコード分割**: Next.jsは自動的にページごとのコード分割を行い、必要なコードのみを読み込む
- **動的インポート**: 重いコンポーネントやライブラリを必要な時にのみ読み込み、初期バンドルサイズを削減
- **ライブラリ最適化**: 部分インポートと動的インポートを組み合わせて、サードパーティライブラリのサイズを最適化
- **パフォーマンス測定**: Core Web VitalsとNavigation Timing APIを使用して、最適化効果を定量的に評価
- **継続的モニタリング**: バンドル分析ツールとパフォーマンスダッシュボードで継続的な改善を実施

:::

これらの最適化手法を組み合わせることで、ユーザーエクスペリエンスの向上とSEOパフォーマンスの改善を両立できます。次の章では、さらに高度なパフォーマンス最適化技術について学習します。

[画像の最適化とレスポンシブ対応](./image-optimization-advanced)

## 関連リンク

- [Next.js コード分割公式ドキュメント](https://nextjs.org/docs/advanced-features/dynamic-import)
- [Web Vitals](https://web.dev/vitals/)
- [Webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)
- [Chart.js](https://www.chartjs.org/)
- [Lodash](https://lodash.com/)

## さらに深く学習したい方へ

より高度なNext.jsパフォーマンス最適化技術を学びたい方は、弊社の実践的な研修プログラムをご検討ください。実際のプロジェクトを通じて、コード分割、パフォーマンス測定、最適化戦略の実装方法を体系的に学習できます。