---
title: トースト/通知/Empty/エラー状態
slug: feedback-empty-error
parent: "components"
file_path: components/feedback-empty-error.md
target_user: フロントエンド開発者、UI/UXデザイナー、Reactエンジニア
goal: "v0で生成したフィードバックコンポーネントを実装し、トースト通知、Empty状態、エラー表示などユーザーへの状態フィードバックを適切に表示するスキルを習得する"
status: published
post_type: pages
seo_title: v0フィードバックコンポーネント実装ガイド | トースト通知からエラー表示まで
seo_description: "v0で生成したフィードバックコンポーネントの実装方法を学ぶ完全ガイド。トースト通知、Empty状態、エラー表示、ローディング状態など、ユーザーエクスペリエンスを向上させるフィードバックUIの実践的な開発手法を習得できます。"
seo_keywords: "v0, Reactコンポーネント, トースト通知, フィードバックUI, Empty状態, エラー表示, アクセシビリティ, shadcn/ui, ユーザーエクスペリエンス"
handson_overview: "v0で生成したフィードバックコンポーネントを実際に実装し、トースト通知システム、Empty状態の表示、エラー処理などをハンズオンで学びます。shadcn/uiのToastコンポーネントを活用した実践的な開発手法を習得します。"
---

## はじめに

🔔 ユーザーインターフェースにおけるフィードバックは、ユーザーがシステムの状態を理解し、次のアクションを決定するために不可欠です。このセクションでは、v0で生成したフィードバックコンポーネントを実装し、効果的な状態表示の方法を学びます。

### このページで学べる事

フィードバックコンポーネントは、ユーザーがアプリケーションの状態を直感的に理解するための重要な要素です。

:::note

- トースト通知の実装と管理方法
- Empty状態の効果的な表示とデザインパターン
- エラー状態のユーザーフレンドリーな表示方法
- ローディング状態とアニメーションの実装
- フィードバックコンポーネントのアクセシビリティ対応
- v0プロンプトによるコンポーネント生成のコツ

:::

## 🎯 フィードバックコンポーネントの重要性

ユーザーインターフェースにおけるフィードバックは、ユーザーエクスペリエンスを大きく左右する要素です。適切なフィードバックにより、ユーザーはシステムの状態を把握し、次のアクションを決定できます。

### フィードバックの種類と目的

**トースト通知**: 成功、エラー、情報などの一時的な通知を表示
**Empty状態**: データが存在しない場合の空の状態を視覚的に表現
**エラー状態**: エラー発生時の状況と解決策を明確に表示
**ローディング状態**: 処理中であることを視覚的に示す

:::note フィードバックデザインパターンとは

フィードバックデザインパターンは、ユーザーにシステムの状態を効果的に伝えるためのUI設計手法です。適切なタイミングで適切なフィードバックを提供することで、ユーザーの不安を軽減し、スムーズな操作体験を実現します。

:::

## 🍞 トースト通知の実装

トースト通知は、ユーザーの操作結果やシステムからの重要な情報を一時的に表示するためのコンポーネントです。

### v0でのトースト通知プロンプト設計

効果的なトースト通知をv0で生成するためのプロンプト例：

```bash
成功時の緑色、エラー時の赤色、情報時の青色のトースト通知コンポーネントを作成。
右下からスライドインし、自動的に閉じる機能を実装。
閉じるボタンとプログレスバー付き。
```

### shadcn/uiのToastコンポーネントを動かして確認してみよう

実際にshadcn/uiのToastコンポーネントを導入し、トースト通知システムを実装してみましょう。

:::step

1. プロジェクトの準備

任意の場所（デスクトップなど）で`v0-toast-demo`フォルダを作成し、Next.jsプロジェクトをセットアップします。

```bash
npx create-next-app@latest v0-toast-demo --typescript --tailwind --eslint --app
cd v0-toast-demo
```

2. shadcn/uiのToastコンポーネントをインストール

```bash
npx shadcn-ui@latest add toast
```

3. Toastプロバイダーの設定

`src/app/layout.tsx`にToastプロバイダーを追加します。

```tsx
// src/app/layout.tsx
import { Toaster } from "@/components/ui/toaster"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
```

4. トースト通知の実装

`src/components/FeedbackDemo.tsx`を作成し、トースト通知の実装例を記述します。

```tsx
'use client'

import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export function FeedbackDemo() {
  const showSuccessToast = () => {
    toast.success("操作が完了しました！", {
      description: "データが正常に保存されました。",
      duration: 3000,
    })
  }

  const showErrorToast = () => {
    toast.error("エラーが発生しました", {
      description: "ネットワーク接続を確認してください。",
      duration: 5000,
    })
  }

  const showInfoToast = () => {
    toast.info("新しい機能が利用可能です", {
      description: "アップデートして最新機能をお試しください。",
      duration: 4000,
    })
  }

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-2xl font-bold">トースト通知デモ</h2>
      <div className="flex gap-4">
        <Button onClick={showSuccessToast} variant="default">
          成功通知
        </Button>
        <Button onClick={showErrorToast} variant="destructive">
          エラー通知
        </Button>
        <Button onClick={showInfoToast} variant="outline">
          情報通知
        </Button>
      </div>
    </div>
  )
}
```

5. カスタムトーストの実装

より複雑なトースト通知を実装します。

```tsx
// src/components/CustomToast.tsx
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Info } from "lucide-react"

export function CustomToastDemo() {
  const showCustomToast = () => {
    toast.custom(
      (t) => (
        <div className="flex items-center gap-4 p-4 bg-white border rounded-lg shadow-lg">
          <CheckCircle className="h-6 w-6 text-green-500" />
          <div className="flex-1">
            <h4 className="font-semibold">カスタムトースト</h4>
            <p className="text-sm text-gray-600">
              これはカスタマイズされたトースト通知です
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.dismiss(t)}
          >
            閉じる
          </Button>
        </div>
      ),
      {
        duration: Infinity, // 自動で閉じない
      }
    )
  }

  return (
    <Button onClick={showCustomToast} variant="secondary">
      カスタムトースト表示
    </Button>
  )
}
```

6. アプリケーションへの統合

`src/app/page.tsx`でコンポーネントを使用します。

```tsx
import { FeedbackDemo } from "@/components/FeedbackDemo"
import { CustomToastDemo } from "@/components/CustomToast"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">フィードバックコンポーネントデモ</h1>
        <FeedbackDemo />
        <div className="mt-8">
          <CustomToastDemo />
        </div>
      </div>
    </main>
  )
}
```

7. 開発サーバーの起動

```bash
npm run dev
```

8. ブラウザで確認

`http://localhost:3000`にアクセスし、各ボタンをクリックしてトースト通知の動作を確認します。

:::

このようにshadcn/uiのToastコンポーネントを使用することで、簡単に高品質なトースト通知システムを実装できます。

## 📭 Empty状態の実装

Empty状態は、データが存在しない場合にユーザーに適切なフィードバックを提供する重要なUIパターンです。

### v0でのEmpty状態プロンプト設計

```bash
データが存在しない場合のEmpty状態コンポーネントを作成。
アイコン、タイトル、説明文、アクションボタンを含む。
明るい色調で親しみやすいデザイン。
```

### Empty状態コンポーネントを動かして確認してみよう

:::step

1. Empty状態コンポーネントの作成

`src/components/EmptyState.tsx`を作成します。

```tsx
import { Button } from "@/components/ui/button"
import { Inbox, Plus, Search } from "lucide-react"

interface EmptyStateProps {
  type: 'no-data' | 'no-results' | 'no-items'
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({
  type,
  title,
  description,
  actionLabel,
  onAction
}: EmptyStateProps) {
  const getConfig = () => {
    switch (type) {
      case 'no-data':
        return {
          icon: Inbox,
          defaultTitle: 'データがありません',
          defaultDescription: '最初のデータを作成して始めましょう',
          defaultActionLabel: '作成する'
        }
      case 'no-results':
        return {
          icon: Search,
          defaultTitle: '検索結果がありません',
          defaultDescription: '別の検索語句でお試しください',
          defaultActionLabel: '検索条件を変更'
        }
      case 'no-items':
        return {
          icon: Plus,
          defaultTitle: 'アイテムがありません',
          defaultDescription: '新しいアイテムを追加してください',
          defaultActionLabel: '追加する'
        }
    }
  }

  const config = getConfig()
  const Icon = config.icon

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 p-3 bg-gray-100 rounded-full">
        <Icon className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold mb-2">
        {title || config.defaultTitle}
      </h3>
      <p className="text-gray-600 mb-6 max-w-md">
        {description || config.defaultDescription}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
```

2. Empty状態の使用例

`src/components/EmptyStateDemo.tsx`を作成します。

```tsx
'use client'

import { useState } from 'react'
import { EmptyState } from './EmptyState'
import { Button } from '@/components/ui/button'

export function EmptyStateDemo() {
  const [showType, setShowType] = useState<'no-data' | 'no-results' | 'no-items'>('no-data')

  const handleAction = () => {
    alert('アクションが実行されました！')
  }

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">Empty状態デモ</h2>

      <div className="flex gap-2 mb-8">
        <Button
          variant={showType === 'no-data' ? 'default' : 'outline'}
          onClick={() => setShowType('no-data')}
        >
          データなし
        </Button>
        <Button
          variant={showType === 'no-results' ? 'default' : 'outline'}
          onClick={() => setShowType('no-results')}
        >
          検索結果なし
        </Button>
        <Button
          variant={showType === 'no-items' ? 'default' : 'outline'}
          onClick={() => setShowType('no-items')}
        >
          アイテムなし
        </Button>
      </div>

      <div className="border rounded-lg p-8 bg-gray-50">
        <EmptyState
          type={showType}
          onAction={handleAction}
        />
      </div>
    </div>
  )
}
```

3. データ取得時のEmpty状態制御

実際のデータ取得ロジックと組み合わせた例：

```tsx
// src/components/DataList.tsx
import { EmptyState } from './EmptyState'
import { Card, CardContent } from '@/components/ui/card'

interface DataItem {
  id: number
  title: string
  description: string
}

interface DataListProps {
  data: DataItem[]
  isLoading: boolean
  onCreateNew: () => void
}

export function DataList({ data, isLoading, onCreateNew }: DataListProps) {
  if (isLoading) {
    return <div className="text-center py-8">読み込み中...</div>
  }

  if (data.length === 0) {
    return (
      <EmptyState
        type="no-data"
        title="データが見つかりません"
        description="新しいデータを作成してください"
        actionLabel="データを作成"
        onAction={onCreateNew}
      />
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {data.map((item) => (
        <Card key={item.id}>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-600 text-sm">{item.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
```

:::

## ⚠️ エラー状態の実装

エラー状態は、問題が発生した際にユーザーに状況を明確に伝え、可能な解決策を提供するための重要なコンポーネントです。

### v0でのエラー状態プロンプト設計

```bash
エラー状態コンポーネントを作成。
エラーアイコン、エラーメッセージ、詳細説明、再試行ボタンを含む。
ユーザーフレンドリーなデザインで、技術的な詳細は隠す。
```

### エラー状態コンポーネントを動かして確認してみよう

:::step

1. エラー状態コンポーネントの作成

`src/components/ErrorState.tsx`を作成します。

```tsx
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from "lucide-react"

interface ErrorStateProps {
  title?: string
  description?: string
  error?: Error | string
  retryLabel?: string
  onRetry?: () => void
  showHomeButton?: boolean
  showBackButton?: boolean
}

export function ErrorState({
  title = "エラーが発生しました",
  description = "予期せぬエラーが発生しました。時間をおいて再度お試しください。",
  error,
  retryLabel = "再試行",
  onRetry,
  showHomeButton = true,
  showBackButton = false
}: ErrorStateProps) {
  const errorMessage = error instanceof Error ? error.message : error

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center max-w-md mx-auto">
      <div className="mb-4 p-3 bg-red-100 rounded-full">
        <AlertTriangle className="h-12 w-12 text-red-600" />
      </div>

      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>

      {errorMessage && process.env.NODE_ENV === 'development' && (
        <div className="mb-6 p-3 bg-gray-100 rounded text-sm font-mono text-left w-full">
          <div className="font-semibold mb-1">エラー詳細:</div>
          <div className="text-gray-700">{errorMessage}</div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        {onRetry && (
          <Button onClick={onRetry} variant="default">
            <RefreshCw className="h-4 w-4 mr-2" />
            {retryLabel}
          </Button>
        )}

        {showBackButton && (
          <Button onClick={() => window.history.back()} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            戻る
          </Button>
        )}

        {showHomeButton && (
          <Button onClick={() => window.location.href = '/'} variant="outline">
            <Home className="h-4 w-4 mr-2" />
            ホームに戻る
          </Button>
        )}
      </div>
    </div>
  )
}
```

2. エラーハンドリングフックの作成

`src/hooks/useErrorHandler.ts`を作成します。

```tsx
import { useState, useCallback } from 'react'

export function useErrorHandler() {
  const [error, setError] = useState<Error | string | null>(null)

  const handleError = useCallback((err: Error | string) => {
    setError(err)
    console.error('Error:', err)
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const retry = useCallback(async (fn: () => Promise<void>) => {
    try {
      clearError()
      await fn()
    } catch (err) {
      handleError(err as Error)
    }
  }, [clearError, handleError])

  return {
    error,
    handleError,
    clearError,
    retry
  }
}
```

3. エラー状態の使用例

`src/components/ErrorStateDemo.tsx`を作成します。

```tsx
'use client'

import { useState } from 'react'
import { ErrorState } from './ErrorState'
import { Button } from '@/components/ui/button'
import { useErrorHandler } from '@/hooks/useErrorHandler'

export function ErrorStateDemo() {
  const { error, handleError, clearError, retry } = useErrorHandler()
  const [isSimulating, setIsSimulating] = useState(false)

  const simulateError = () => {
    setIsSimulating(true)
    setTimeout(() => {
      handleError(new Error('ネットワーク接続に失敗しました'))
      setIsSimulating(false)
    }, 1000)
  }

  const simulateSuccess = () => {
    setIsSimulating(true)
    setTimeout(() => {
      clearError()
      setIsSimulating(false)
      alert('操作が成功しました！')
    }, 1000)
  }

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">エラー状態デモ</h2>

      <div className="flex gap-2">
        <Button onClick={simulateError} disabled={isSimulating}>
          エラーをシミュレート
        </Button>
        <Button onClick={simulateSuccess} disabled={isSimulating} variant="outline">
          成功をシミュレート
        </Button>
      </div>

      {error && (
        <div className="border rounded-lg p-8 bg-red-50">
          <ErrorState
            title="データの取得に失敗しました"
            description="サーバーとの通信中にエラーが発生しました。ネットワーク接続を確認して再度お試しください。"
            error={error}
            onRetry={() => retry(simulateSuccess)}
            retryLabel="再試行"
          />
        </div>
      )}

      {isSimulating && !error && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">処理中...</p>
        </div>
      )}
    </div>
  )
}
```

:::

## ⏳ ローディング状態とアニメーション

ローディング状態は、処理中であることをユーザーに視覚的に伝えるための重要なフィードバックです。

### v0でのローディング状態プロンプト設計

```bash
ローディング状態コンポーネントを作成。
スピナー、プログレスバー、スケルトンローディングを含む。
滑らかなアニメーションと適切なサイズバリエーションを実装。
```

### ローディング状態を動かして確認してみよう

:::step

1. ローディングコンポーネントの作成

`src/components/LoadingState.tsx`を作成します。

```tsx
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  return (
    <div className={cn("animate-spin rounded-full border-2 border-gray-300 border-t-blue-600", sizeClasses[size], className)} />
  )
}

interface ProgressBarProps {
  progress: number
  className?: string
}

export function ProgressBar({ progress, className }: ProgressBarProps) {
  return (
    <div className={cn("w-full bg-gray-200 rounded-full h-2", className)}>
      <div
        className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

interface SkeletonProps {
  lines?: number
  className?: string
}

export function Skeleton({ lines = 3, className }: SkeletonProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-full"></div>
        </div>
      ))}
    </div>
  )
}
```

2. ローディングデモコンポーネント

`src/components/LoadingDemo.tsx`を作成します。

```tsx
'use client'

import { useState, useEffect } from 'react'
import { LoadingSpinner, ProgressBar, Skeleton } from './LoadingState'
import { Button } from '@/components/ui/button'

export function LoadingDemo() {
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [showSkeleton, setShowSkeleton] = useState(false)

  // プログレスバーのデモ
  useEffect(() => {
    if (isLoading && progress < 100) {
      const timer = setTimeout(() => {
        setProgress(prev => Math.min(prev + Math.random() * 10, 100))
      }, 200)
      return () => clearTimeout(timer)
    } else if (progress >= 100) {
      setTimeout(() => {
        setIsLoading(false)
        setProgress(0)
      }, 1000)
    }
  }, [isLoading, progress])

  const startProgress = () => {
    setIsLoading(true)
    setProgress(0)
  }

  const toggleSkeleton = () => {
    setShowSkeleton(!showSkeleton)
  }

  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold">ローディング状態デモ</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">スピナー</h3>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <LoadingSpinner size="sm" />
              <span className="text-sm">Small</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <LoadingSpinner size="md" />
              <span className="text-sm">Medium</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <LoadingSpinner size="lg" />
              <span className="text-sm">Large</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">プログレスバー</h3>
          <div className="space-y-4">
            <ProgressBar progress={progress} />
            <div className="flex items-center gap-4">
              <Button onClick={startProgress} disabled={isLoading}>
                {isLoading ? '処理中...' : 'プログレス開始'}
              </Button>
              <span className="text-sm text-gray-600">
                {Math.round(progress)}% 完了
              </span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">スケルトンローディング</h3>
          <div className="space-y-4">
            <Button onClick={toggleSkeleton} variant="outline">
              {showSkeleton ? 'コンテンツを表示' : 'スケルトンを表示'}
            </Button>
            <div className="border rounded-lg p-4">
              {showSkeleton ? (
                <div className="space-y-4">
                  <Skeleton lines={1} className="w-1/3" />
                  <Skeleton lines={3} />
                  <Skeleton lines={2} className="w-2/3" />
                </div>
              ) : (
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">実際のコンテンツ</h4>
                  <p className="text-gray-600">
                    これは実際のコンテンツです。スケルトンローディングは、コンテンツが読み込まれるまでの間、
                    ユーザーにレイアウトの予測を提供します。
                  </p>
                  <p className="text-gray-600">
                    これにより、ユーザーはコンテンツの読み込み中もレイアウトの変化を感じることなく、
                    快適なユーザーエクスペリエンスを享受できます。
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

:::

## ♿ アクセシビリティの考慮

フィードバックコンポーネントは、すべてのユーザーが情報を適切に受け取れるようにアクセシビリティを考慮する必要があります。

### アクセシビリティ対応のポイント

**ARIA属性**: 適切なrole、aria-live、aria-atomicを使用
**キーボード操作**: Escキーでの閉じる、Tabキーでのナビゲーション
**スクリーンリーダー**: 音声読み上げに対応した設計
**色覚多様性**: 色だけに依存しない情報伝達

### アクセシブルなトースト通知の実装例

```tsx
import { useEffect, useRef } from 'react'
import { toast } from "sonner"

export function AccessibleToastDemo() {
  const toastIdRef = useRef<string | null>(null)

  const showAccessibleToast = () => {
    // 既存のトーストをクリア
    if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current)
    }

    // 新しいトーストを表示
    toastIdRef.current = toast.success("操作が完了しました", {
      description: "データが正常に保存されました。",
      duration: 5000,
      // アクセシビリティ対応のオプション
      action: {
        label: "閉じる",
        onClick: () => {
          if (toastIdRef.current) {
            toast.dismiss(toastIdRef.current)
          }
        },
      },
      // キーボード操作のサポート
      onDismiss: () => {
        toastIdRef.current = null
      },
    })
  }

  return (
    <button
      onClick={showAccessibleToast}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      アクセシブルなトースト表示
    </button>
  )
}
```

## 🔄 状態管理の統合

複数のフィードバックコンポーネントを効果的に管理するための状態管理戦略を学びます。

### フィードバックコンテキストの作成

`src/contexts/FeedbackContext.tsx`を作成します。

```tsx
'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { toast } from "sonner"

interface FeedbackState {
  loading: boolean
  error: Error | string | null
  progress: number
}

interface FeedbackContextType extends FeedbackState {
  setLoading: (loading: boolean) => void
  setError: (error: Error | string | null) => void
  setProgress: (progress: number) => void
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void
  clearFeedback: () => void
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined)

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<FeedbackState>({
    loading: false,
    error: null,
    progress: 0
  })

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }))
  }, [])

  const setError = useCallback((error: Error | string | null) => {
    setState(prev => ({ ...prev, error }))
    if (error) {
      toast.error(typeof error === 'string' ? error : error.message)
    }
  }, [])

  const setProgress = useCallback((progress: number) => {
    setState(prev => ({ ...prev, progress }))
  }, [])

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    switch (type) {
      case 'success':
        toast.success(message)
        break
      case 'error':
        toast.error(message)
        break
      case 'info':
        toast.info(message)
        break
    }
  }, [])

  const clearFeedback = useCallback(() => {
    setState({
      loading: false,
      error: null,
      progress: 0
    })
  }, [])

  return (
    <FeedbackContext.Provider value={{
      ...state,
      setLoading,
      setError,
      setProgress,
      showToast,
      clearFeedback
    }}>
      {children}
    </FeedbackContext.Provider>
  )
}

export function useFeedback() {
  const context = useContext(FeedbackContext)
  if (context === undefined) {
    throw new Error('useFeedback must be used within a FeedbackProvider')
  }
  return context
}
```

## 🎯 v0プロンプトの最適化

効果的なフィードバックコンポーネントをv0で生成するためのプロンプト設計のコツを学びます。

### プロンプト設計のベストプラクティス

1. **具体的なコンポーネント名を指定**: 「トースト通知」のように具体的に
2. **使用する技術スタックを明記**: 「shadcn/uiとTailwind CSSを使用」
3. **機能要件を詳細に**: 「自動で閉じる」「閉じるボタン付き」など
4. **デザインの方向性**: 「ミニマル」「モダン」「アクセシブル」など
5. **レスポンシブ対応**: 「モバイルファースト」「ブレークポイント指定」

### v0プロンプトの具体例

```bash
shadcn/uiとTailwind CSSを使用した、アクセシブルなトースト通知システムを作成。
成功・エラー・情報の3種類のタイプに対応。
右下からスライドインし、5秒後に自動で閉じる。
手動で閉じるボタンとキーボード操作（Escキー）に対応。
スクリーンリーダーで正しく読み上げられるようにARIA属性を実装。
```

## まとめ

このセクションでは、v0で生成したフィードバックコンポーネントの実装方法について学びました。トースト通知、Empty状態、エラー表示、ローディング状態など、ユーザーエクスペリエンスを向上させるための重要なコンポーネントを実装するスキルを習得しました。

:::note 要点のまとめ

- フィードバックコンポーネントはユーザーエクスペリエンスを向上させる重要な要素
- shadcn/uiのToastコンポーネントで高品質なトースト通知を簡単に実装可能
- Empty状態はデータがない場合の適切なフィードバックを提供する
- エラー状態はユーザーフレンドリーなエラー表示と解決策を提示する
- ローディング状態は処理中であることを視覚的に伝える
- アクセシビリティ対応はすべてのユーザーが情報を受け取れるために不可欠
- 状態管理の統合により複数のフィードバックコンポーネントを効果的に管理可能

:::

これらのフィードバックコンポーネントを組み合わせることで、ユーザーがシステムの状態を直感的に理解し、快適に操作できるアプリケーションを構築できます。次は[チャート/アイコン/アニメーション](./charts-icons-animations.md)セクションで、データの視覚的表現について学びましょう。

## 関連リンク

- [shadcn/ui Toastドキュメント](https://ui.shadcn.com/docs/components/toast)
- [Sonner Toastライブラリ](https://sonner.emilkowal.ski/)
- [React ARIAガイドライン](https://react-spectrum.adobe.com/react-aria/introduction.html)
- [アクセシビリティデザインパターン](https://www.w3.org/WAI/ARIA/apg/)
- [ローディング状態のベストプラクティス](https://uxdesign.cc/designing-better-loading-states-4b5d4e9f5e5c)

## さらに深く学習したい方へ

このコンテンツは、フィードバックコンポーネント開発の基礎を学ぶための導入編です。より深く学習したい方には、以下の研修プログラムをおすすめします：

- **アクセシブルUI開発コース**: 包括的なアクセシビリティ対応技術
- **React状態管理実践講座**: 大規模アプリケーションの状態管理設計
- **UXデザイン思考ワークショップ**: ユーザー中心のUI設計手法
- **パフォーマンス最適化コース**: 高速なフィードバックコンポーネントの実装

詳細はお問い合わせください。