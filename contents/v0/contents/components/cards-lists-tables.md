---
title: カード/リスト/テーブルの実装 | React+Tailwind+shadcn/uiで学ぶデータ表示コンポーネント
slug: cards-lists-tables
parent: components
file_path: components/cards-lists-tables.md
target_user: フロントエンド開発者、UI/UXデザイナー、Reactエンジニア
goal: "v0で生成したカード、リスト、テーブルコンポーネントをReactとshadcn/uiで実装し、効率的なデータ表示とインタラクティブなUIを開発するスキルを習得する"
status: publish
post_type: pages
seo_title: v0カード/リスト/テーブル実装ガイド | React+Tailwind+shadcn/uiで学ぶデータ表示コンポーネント
seo_description: "v0で生成したカード、リスト、テーブルコンポーネントを実装する完全ガイド。Reactとshadcn/uiを活用した効率的なデータ表示とインタラクティブなUI開発方法を学びます。"
seo_keywords: "v0, Reactコンポーネント, Tailwind CSS, shadcn/ui, カード, リスト, テーブル, データ表示, UI実装, レスポンシブデザイン"
handson_overview: "v0で生成したカード、リスト、テーブルコンポーネントを実際にカスタマイズし、データ表示の最適化やインタラクティブな機能を実装するハンズオン。"
---

## はじめに

🃏 カード、リスト、テーブルはデータを構造的に表示するための重要なコンポーネントです。v0で生成したこれらの表示コンポーネントを、Reactとshadcn/uiを使って実践的に実装する方法を学びましょう。

### このページで学べる事

このセクションでは、データ表示コンポーネントの設計から実装までを学びます。

:::note

- v0で生成したカードコンポーネントのレスポンシブデザイン実装
- リストコンポーネントの仮想化とパフォーマンス最適化
- テーブルコンポーネントのソート・フィルタリング・ページネーション
- データ表示のアクセシビリティ対応
- 大量データの効率的な表示方法

:::

## 🎯 カードコンポーネントの基礎

カードコンポーネントは関連情報をグループ化して表示するための万能なUI要素です。ブログ記事、製品情報、ユーザープロファイルなど、様々なコンテンツに活用できます。

### カードの基本構造とバリエーション

:::note カードコンポーネントとは

カードコンポーネントは、関連する情報をまとめて表示するコンテナ要素です。タイトル、画像、説明文、アクションボタンなどを組み合わせて、情報を視覚的に整理します。shadcn/uiのCardコンポーネントは、アクセシビリティ対応済みで、様々なレイアウトに対応できます。

:::

### カードコンポーネントを動かして確認してみよう

実際にカードコンポーネントを実装し、様々な表示パターンを試してみましょう。

:::step

1. shadcn/uiカードコンポーネントのインストール

```bash
npx shadcn-ui@latest add card
```

2. 拡張カードコンポーネントの作成

`src/components/ui/custom-card.tsx`ファイルを作成します：

```tsx
import { Card as ShadcnCard, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { forwardRef } from "react"

export interface CustomCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outlined" | "elevated" | "filled"
  hover?: boolean
  clickable?: boolean
  loading?: boolean
}

const CustomCard = forwardRef<HTMLDivElement, CustomCardProps>(
  ({ className, variant = "default", hover = false, clickable = false, loading = false, children, ...props }, ref) => {
    return (
      <ShadcnCard
        ref={ref}
        className={cn(
          // 基本スタイル
          "transition-all duration-200",
          // バリアント別スタイル
          {
            "border-2": variant === "outlined",
            "shadow-md hover:shadow-lg": variant === "elevated",
            "bg-muted/50": variant === "filled",
          },
          // ホバー効果
          hover && "hover:shadow-md hover:-translate-y-0.5",
          // クリック可能
          clickable && "cursor-pointer hover:ring-2 hover:ring-primary/20",
          // ローディング状態
          loading && "opacity-50 pointer-events-none",
          className
        )}
        {...props}
      >
        {children}
      </ShadcnCard>
    )
  }
)

CustomCard.displayName = "CustomCard"

// データカードコンポーネント
export interface DataCardProps {
  title: string
  description?: string
  image?: string
  metadata?: { label: string; value: string }[]
  actions?: React.ReactNode
  variant?: "default" | "outlined" | "elevated" | "filled"
  onClick?: () => void
}

export function DataCard({
  title,
  description,
  image,
  metadata,
  actions,
  variant = "default",
  onClick
}: DataCardProps) {
  return (
    <CustomCard variant={variant} clickable={!!onClick} onClick={onClick} className="w-full max-w-sm">
      {image && (
        <div className="aspect-video w-full overflow-hidden rounded-t-lg">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {metadata && metadata.length > 0 && (
          <div className="space-y-2">
            {metadata.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{item.label}:</span>
                <span className="font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      {actions && (
        <CardFooter className="pt-0">
          <div className="flex gap-2 w-full">
            {actions}
          </div>
        </CardFooter>
      )}
    </CustomCard>
  )
}

// 統計カードコンポーネント
export interface StatCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: "increase" | "decrease"
  }
  icon?: React.ReactNode
  description?: string
}

export function StatCard({ title, value, change, icon, description }: StatCardProps) {
  const isPositive = change?.type === "increase"

  return (
    <CustomCard variant="elevated" className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className="text-xs text-muted-foreground">
            <span className={cn(
              "inline-flex items-center",
              isPositive ? "text-green-600" : "text-red-600"
            )}>
              {isPositive ? "↑" : "↓"} {Math.abs(change.value)}%
            </span>{" "}
            前月比
          </p>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
      </CardContent>
    </CustomCard>
  )
}

export { CustomCard }
```

3. カードコンポーネントの使用例

```tsx
import { DataCard, StatCard } from "@/components/ui/custom-card"
import { Button } from "@/components/ui/button"
import { Users, TrendingUp, DollarSign, Activity } from "lucide-react"
import { Star, Eye, Heart } from "lucide-react"

export function CardDemo() {
  // ブログ記事データ
  const blogPosts = [
    {
      title: "v0でコンポーネントを生成する方法",
      description: "v0を使って効率的にReactコンポーネントを生成するテクニックを学びます。",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop",
      metadata: [
        { label: "著者", value: "山田太郎" },
        { label: "公開日", value: "2024-01-15" },
        { label: "読了時間", value: "5分" }
      ],
      actions: (
        <>
          <Button size="sm" variant="outline">
            <Eye className="h-4 w-4 mr-1" />
            読む
          </Button>
          <Button size="sm">
            <Heart className="h-4 w-4 mr-1" />
            保存
          </Button>
        </>
      )
    },
    {
      title: "Reactパフォーマンス最適化ガイド",
      description: "Reactアプリケーションのパフォーマンスを改善するための実践的な手法を紹介します。",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=200&fit=crop",
      metadata: [
        { label: "著者", value: "鈴木花子" },
        { label: "公開日", value: "2024-01-10" },
        { label: "読了時間", value: "8分" }
      ],
      actions: (
        <>
          <Button size="sm" variant="outline">
            <Eye className="h-4 w-4 mr-1" />
            読む
          </Button>
          <Button size="sm">
            <Heart className="h-4 w-4 mr-1" />
            保存
          </Button>
        </>
      )
    }
  ]

  // 統計データ
  const stats = [
    {
      title: "総ユーザー数",
      value: "12,234",
      change: { value: 12, type: "increase" },
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      description: "過去30日間の新規ユーザー"
    },
    {
      title: "売上高",
      value: "¥2,450,000",
      change: { value: 8, type: "increase" },
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
      description: "今月の売上実績"
    },
    {
      title: "コンバージョン率",
      value: "3.2%",
      change: { value: 2, type: "decrease" },
      icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />,
      description: "サイト全体のコンバージョン率"
    },
    {
      title: "アクティブ率",
      value: "68.4%",
      change: { value: 5, type: "increase" },
      icon: <Activity className="h-4 w-4 text-muted-foreground" />,
      description: "デイリーアクティブユーザー率"
    }
  ]

  return (
    <div className="space-y-8 p-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">統計カード</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">ブログ記事カード</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post, index) => (
            <DataCard key={index} {...post} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">カードバリエーション</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CustomCard variant="default" className="p-6">
            <h4 className="font-semibold mb-2">デフォルトカード</h4>
            <p className="text-sm text-muted-foreground">
              標準的なスタイルのカードコンポーネントです。
            </p>
          </CustomCard>

          <CustomCard variant="outlined" className="p-6">
            <h4 className="font-semibold mb-2">アウトラインカード</h4>
            <p className="text-sm text-muted-foreground">
              枠線を強調したカードスタイルです。
            </p>
          </CustomCard>

          <CustomCard variant="elevated" className="p-6">
            <h4 className="font-semibold mb-2">浮き上がりカード</h4>
            <p className="text-sm text-muted-foreground">
              影付きで浮き上がった効果のあるカードです。
            </p>
          </CustomCard>
        </div>
      </div>
    </div>
  )
}
```

:::

これで様々な用途に対応できるカードコンポーネントを実装できました。

## 📋 リストコンポーネントの実装

リストコンポーネントはデータを一覧表示するための基本的なUI要素です。大量データを効率的に表示するための最適化技術も学びましょう。

### リストのパターンと最適化

:::note リストコンポーネントとは

リストコンポーネントは、類似のデータ項目を垂直または水平に配置して表示するUI要素です。ユーザーリスト、ファイル一覧、検索結果など、様々なデータ表示に使用されます。パフォーマンスを考慮した仮想化技術が重要です。

:::

### リストコンポーネントを動かして確認してみよう

仮想化されたリストコンポーネントを実装してみましょう。

:::step

1. 仮想化リストコンポーネントの作成

`src/components/ui/virtualized-list.tsx`ファイルを作成します：

```tsx
import { FixedSizeList as List, VariableSizeList } from 'react-window'
import { useCallback, useEffect, useState } from 'react'
import { cn } from "@/lib/utils"

export interface ListItem {
  id: string
  title: string
  description?: string
  avatar?: string
  metadata?: { label: string; value: string }[]
  actions?: React.ReactNode
}

export interface VirtualizedListProps {
  items: ListItem[]
  height: number
  itemSize: number
  onItemClick?: (item: ListItem) => void
  className?: string
  loading?: boolean
  searchable?: boolean
}

export function VirtualizedList({
  items,
  height,
  itemSize,
  onItemClick,
  className,
  loading = false,
  searchable = false
}: VirtualizedListProps) {
  const [filteredItems, setFilteredItems] = useState(items)
  const [searchTerm, setSearchTerm] = useState("")

  // 検索機能
  useEffect(() => {
    if (!searchable || !searchTerm) {
      setFilteredItems(items)
      return
    }

    const filtered = items.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredItems(filtered)
  }, [items, searchTerm, searchable])

  const Row = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const item = filteredItems[index]

    return (
      <div
        style={style}
        className={cn(
          "flex items-center p-4 border-b hover:bg-muted/50 cursor-pointer transition-colors",
          index % 2 === 0 ? "bg-background" : "bg-muted/20"
        )}
        onClick={() => onItemClick?.(item)}
      >
        {item.avatar && (
          <img
            src={item.avatar}
            alt={item.title}
            className="w-10 h-10 rounded-full mr-4"
          />
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium truncate">{item.title}</h4>
          {item.description && (
            <p className="text-sm text-muted-foreground truncate">
              {item.description}
            </p>
          )}
          {item.metadata && (
            <div className="flex gap-4 mt-1">
              {item.metadata.map((meta, metaIndex) => (
                <span key={metaIndex} className="text-xs text-muted-foreground">
                  {meta.label}: {meta.value}
                </span>
              ))}
            </div>
          )}
        </div>
        {item.actions && (
          <div className="ml-4">
            {item.actions}
          </div>
        )}
      </div>
    )
  }, [filteredItems, onItemClick])

  if (loading) {
    return (
      <div className={cn("flex items-center justify-center", className)} style={{ height }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      {searchable && (
        <div className="p-4 border-b">
          <input
            type="text"
            placeholder="検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      )}
      <List
        height={height}
        itemCount={filteredItems.length}
        itemSize={itemSize}
        width="100%"
      >
        {Row}
      </List>
    </div>
  )
}

// 無限スクロールリスト
export interface InfiniteListProps {
  items: ListItem[]
  height: number
  itemSize: number
  onLoadMore: () => void
  hasMore: boolean
  loading?: boolean
  className?: string
}

export function InfiniteList({
  items,
  height,
  itemSize,
  onLoadMore,
  hasMore,
  loading = false,
  className
}: InfiniteListProps) {
  const Row = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const item = items[index]

    // 最後のアイテムのときに追加読み込みをトリガー
    if (index === items.length - 1 && hasMore && !loading) {
      onLoadMore()
    }

    return (
      <div
        style={style}
        className={cn(
          "flex items-center p-4 border-b hover:bg-muted/50 cursor-pointer transition-colors",
          index % 2 === 0 ? "bg-background" : "bg-muted/20"
        )}
      >
        {item.avatar && (
          <img
            src={item.avatar}
            alt={item.title}
            className="w-10 h-10 rounded-full mr-4"
          />
        )}
        <div className="flex-1">
          <h4 className="font-medium">{item.title}</h4>
          {item.description && (
            <p className="text-sm text-muted-foreground">
              {item.description}
            </p>
          )}
        </div>
      </div>
    )
  }, [items, hasMore, loading, onLoadMore])

  return (
    <div className={className}>
      <List
        height={height}
        itemCount={items.length + (hasMore ? 1 : 0)}
        itemSize={itemSize}
        width="100%"
      >
        {({ index, style }) => {
          if (index === items.length && hasMore) {
            return (
              <div style={style} className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            )
          }
          return Row({ index, style })
        }}
      </List>
    </div>
  )
}
```

2. リストコンポーネントの使用例

```tsx
import { VirtualizedList, InfiniteList, type ListItem } from "@/components/ui/virtualized-list"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { MoreVertical, Edit, Trash2 } from "lucide-react"

export function ListDemo() {
  // ユーザーリストデータの生成
  const generateUsers = (count: number): ListItem[] => {
    return Array.from({ length: count }, (_, index) => ({
      id: `user-${index + 1}`,
      title: `ユーザー ${index + 1}`,
      description: `user${index + 1}@example.com`,
      avatar: `https://ui-avatars.com/api/?name=User${index + 1}&background=random`,
      metadata: [
        { label: "役職", value: index % 3 === 0 ? "管理者" : index % 2 === 0 ? "編集者" : "一般" },
        { label: "ステータス", value: index % 4 === 0 ? "オフライン" : "オンライン" }
      ],
      actions: (
        <div className="flex gap-1">
          <Button size="icon" variant="ghost">
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost">
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      )
    }))
  }

  const [users] = useState(() => generateUsers(1000))
  const [infiniteUsers, setInfiniteUsers] = useState<ListItem[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  // 無限スクロール用のデータ読み込み
  useEffect(() => {
    if (infiniteUsers.length < 5000) {
      setLoading(true)
      // 模擬的なAPI呼び出し
      setTimeout(() => {
        const newUsers = generateUsers(20)
        setInfiniteUsers(prev => [...prev, ...newUsers])
        setLoading(false)
      }, 1000)
    }
  }, [page])

  const handleLoadMore = () => {
    setPage(prev => prev + 1)
  }

  const handleItemClick = (item: ListItem) => {
    console.log('Clicked item:', item.title)
  }

  return (
    <div className="space-y-8 p-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">仮想化リスト</h3>
        <p className="text-sm text-muted-foreground mb-4">
          1000件のユーザーデータを効率的に表示（検索機能付き）
        </p>
        <VirtualizedList
          items={users}
          height={400}
          itemSize={80}
          onItemClick={handleItemClick}
          searchable={true}
          className="border rounded-lg"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">無限スクロールリスト</h3>
        <p className="text-sm text-muted-foreground mb-4">
          スクロールに応じて追加データを読み込むリスト
        </p>
        <InfiniteList
          items={infiniteUsers}
          height={400}
          itemSize={60}
          onLoadMore={handleLoadMore}
          hasMore={infiniteUsers.length < 5000}
          loading={loading}
          className="border rounded-lg"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">パフォーマンス比較</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">仮想化リスト</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• 1000件を高速に表示</li>
              <li>• メモリ使用量が少ない</li>
              <li>• スムーズなスクロール</li>
              <li>• 検索機能付き</li>
            </ul>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">無限スクロール</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• 大規模データセット対応</li>
              <li>• ページネーション不要</li>
              <li>• ユーザビリティ向上</li>
              <li>• 動的なデータ読み込み</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
```

:::

これでパフォーマンス最適化されたリストコンポーネントを実装できました。

## 📊 テーブルコンポーネントの実装

テーブルコンポーネントは構造化されたデータを表形式で表示するための強力なUI要素です。ソート、フィルタリング、ページネーションなどの高度な機能を実装しましょう。

### テーブルの高度な機能

:::note テーブルコンポーネントとは

テーブルコンポーネントは、行と列の構造でデータを整理表示するUI要素です。财务データ、ユーザーリスト、分析結果など、構造化された情報を効果的に表示します。アクセシビリティとパフォーマンスが重要な要素です。

:::

### テーブルコンポーネントを動かして確認してみよう

高度な機能を持つテーブルコンポーネントを実装してみましょう。

:::step

1. shadcn/uiテーブルコンポーネントのインストール

```bash
npx shadcn-ui@latest add table
```

2. 拡張テーブルコンポーネントの作成

`src/components/ui/data-table.tsx`ファイルを作成します：

```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useState, useMemo, useCallback } from "react"
import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, Search, Filter } from "lucide-react"

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchable?: boolean
  filterable?: boolean
  sortable?: boolean
  pagination?: boolean
  className?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchable = true,
  filterable = true,
  sortable = true,
  pagination = true,
  className
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: pagination ? getPaginationRowModel() : undefined,
    getSortedRowModel: sortable ? getSortedRowModel() : undefined,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      globalFilter,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className={cn("space-y-4", className)}>
      {/* テーブルヘッダー（検索・フィルター） */}
      {(searchable || filterable) && (
        <div className="flex items-center justify-between">
          {searchable && (
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="検索..."
                value={globalFilter ?? ""}
                onChange={(event) => setGlobalFilter(event.target.value)}
                className="max-w-sm"
              />
            </div>
          )}
          {filterable && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="ml-auto h-8 lg:flex"
              >
                <Filter className="mr-2 h-4 w-4" />
                フィルター
              </Button>
            </div>
          )}
        </div>
      )}

      {/* テーブル本体 */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  データがありません
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ページネーション */}
      {pagination && (
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} /{" "}
            {table.getFilteredRowModel().rows.length} 行を選択
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              前へ
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              次へ
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// ソート可能なカラムヘルパー
export function createSortableColumn<T>(
  header: string,
  accessorKey: keyof T,
  enableSorting: boolean = true
): ColumnDef<T> {
  return {
    accessorKey: accessorKey as string,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 hover:bg-transparent"
      >
        {header}
        {enableSorting && (
          <ArrowUpDown className="ml-2 h-3 w-3" />
        )}
      </Button>
    ),
    enableSorting,
  }
}

// ステータスバッジカラムヘルパー
export function createStatusColumn<T>(
  header: string,
  accessorKey: keyof T,
  getStatusVariant: (value: any) => "default" | "secondary" | "destructive" | "outline"
): ColumnDef<T> {
  return {
    accessorKey: accessorKey as string,
    header: header,
    cell: ({ row }) => {
      const value = row.getValue(accessorKey as string)
      return (
        <Badge variant={getStatusVariant(value)}>
          {String(value)}
        </Badge>
      )
    },
  }
}

// アクションカラムヘルパー
export function createActionsColumn<T>(
  header: string = "アクション",
  renderActions: (row: T) => React.ReactNode
): ColumnDef<T> {
  return {
    id: "actions",
    header: header,
    cell: ({ row }) => renderActions(row.original),
  }
}
```

3. テーブルコンポーネントの使用例

```tsx
import {
  DataTable,
  createSortableColumn,
  createStatusColumn,
  createActionsColumn
} from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"

// ユーザーデータ型
interface User {
  id: string
  name: string
  email: string
  role: "admin" | "editor" | "user"
  status: "active" | "inactive" | "pending"
  lastLogin: string
  createdAt: string
}

export function TableDemo() {
  // サンプルデータ生成
  const generateUsers = (count: number): User[] => {
    const roles: User["role"][] = ["admin", "editor", "user"]
    const statuses: User["status"][] = ["active", "inactive", "pending"]

    return Array.from({ length: count }, (_, index) => ({
      id: `user-${index + 1}`,
      name: `ユーザー ${index + 1}`,
      email: `user${index + 1}@example.com`,
      role: roles[index % 3],
      status: statuses[index % 3],
      lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }))
  }

  const [users] = useState(() => generateUsers(100))

  // カラム定義
  const columns = [
    createSortableColumn<User>("名前", "name"),
    createSortableColumn<User>("メールアドレス", "email"),
    createStatusColumn<User>(
      "役割",
      "role",
      (role) => {
        switch (role) {
          case "admin": return "destructive"
          case "editor": return "default"
          default: return "secondary"
        }
      }
    ),
    createStatusColumn<User>(
      "ステータス",
      "status",
      (status) => {
        switch (status) {
          case "active": return "default"
          case "pending": return "secondary"
          default: return "outline"
        }
      }
    ),
    createSortableColumn<User>("最終ログイン", "lastLogin"),
    createSortableColumn<User>("作成日", "createdAt"),
    createActionsColumn<User>(
      "アクション",
      (user) => (
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      )
    )
  ]

  return (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">データテーブル</h3>
        <p className="text-sm text-muted-foreground mb-4">
          ソート、検索、ページネーション機能付きの高度なテーブルコンポーネント
        </p>
        <DataTable
          columns={columns}
          data={users}
          searchable={true}
          filterable={true}
          sortable={true}
          pagination={true}
          className="rounded-lg border"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">機能説明</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">ソート機能</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• ヘッダークリックでソート</li>
              <li>• 昇順/降順切替</li>
              <li>• 複数カラムソート</li>
            </ul>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">検索機能</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• 全カラム検索</li>
              <li>• リアルタイムフィルター</li>
              <li>• 大文字小文字無視</li>
            </ul>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">ページネーション</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• 前後ページ移動</li>
              <li>• 選択状態表示</li>
              <li>• 行数カウント表示</li>
            </ul>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">アクション</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• 行選択機能</li>
              <li>• カスタムアクションボタン</li>
              <li>• コンテキストメニュー</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
```

:::

これで高度な機能を持つテーブルコンポーネントを実装できました。

## ♿ アクセシビリティの考慮

データ表示コンポーネントは、すべてのユーザーが情報にアクセスできるようにアクセシビリティ対応が重要です。

### アクセシブルなデータ表示の実装

:::note データ表示のアクセシビリティ

データ表示コンポーネントのアクセシビリティでは、キーボードナビゲーション、スクリーンリーダー対応、適切なARIA属性の使用が重要です。特にテーブルでは、見出しとデータの関連性を正しく伝える必要があります。

:::

### アクセシブルなコンポーネントを動かして確認してみよう

アクセシビリティ対応を強化したデータ表示コンポーネントを実装してみましょう。

:::step

1. アクセシブルなテーブルの実装

```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"

export interface AccessibleTableProps {
  columns: {
    header: string;
    accessor: string;
    isSortable?: boolean;
    type?: 'text' | 'number' | 'date' | 'status'
  }[]
  data: Record<string, any>[]
  caption?: string
  summary?: string
  className?: string
}

export function AccessibleTable({
  columns,
  data,
  caption,
  summary,
  className
}: AccessibleTableProps) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table
        className="w-full caption-bottom text-sm"
        role="table"
        aria-label={caption}
        aria-rowcount={data.length}
        aria-colcount={columns.length}
      >
        {caption && (
          <caption className="mt-4 text-sm text-muted-foreground">
            {caption}
          </caption>
        )}
        {summary && (
          <summary className="sr-only">
            {summary}
          </summary>
        )}
        <thead className="[&_tr]:border-b">
          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
            {columns.map((column, index) => (
              <th
                key={column.accessor}
                scope="col"
                className={cn(
                  "h-12 px-4 text-left align-middle font-medium text-muted-foreground",
                  column.isSortable && "cursor-pointer hover:text-foreground"
                )}
                aria-sort={column.isSortable ? "none" : undefined}
                data-column-index={index}
              >
                {column.header}
                {column.isSortable && (
                  <span className="ml-1 inline-block w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-current" />
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
              role="row"
              aria-rowindex={rowIndex + 1}
            >
              {columns.map((column, colIndex) => {
                const value = row[column.accessor]
                const isHeader = colIndex === 0

                return (
                  <td
                    key={column.accessor}
                    className={cn(
                      "p-4 align-middle",
                      isHeader && "font-medium"
                    )}
                    role={isHeader ? "rowheader" : "cell"}
                    data-label={column.header}
                    {...(column.type === 'number' && { 'data-type': 'number' })}
                    {...(column.type === 'date' && { 'data-type': 'date' })}
                  >
                    {formatCellValue(value, column.type)}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function formatCellValue(value: any, type?: string): React.ReactNode {
  if (value == null) return '-'

  switch (type) {
    case 'date':
      return new Date(value).toLocaleDateString('ja-JP')
    case 'number':
      return new Intl.NumberFormat('ja-JP').format(Number(value))
    case 'status':
      return (
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
            value === 'active' ? 'bg-green-100 text-green-800' :
            value === 'inactive' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}
        >
          {value}
        </span>
      )
    default:
      return String(value)
  }
}

// キーボードナビゲーション対応のリスト
export interface AccessibleListProps {
  items: {
    id: string
    title: string
    description?: string
    actions?: React.ReactNode
  }[]
  title: string
  description?: string
  className?: string
}

export function AccessibleList({
  items,
  title,
  description,
  className
}: AccessibleListProps) {
  const listId = `list-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className={className} role="region" aria-labelledby={listId}>
      <h3 id={listId} className="text-lg font-semibold">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
      )}

      <ul
        role="list"
        className="space-y-2"
        aria-label={title}
      >
        {items.map((item, index) => (
          <li
            key={item.id}
            role="listitem"
            className="p-4 border rounded-lg hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring"
            tabIndex={0}
            aria-posinset={index + 1}
            aria-setsize={items.length}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                // アクションを実行
              }
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-medium">{item.title}</h4>
                {item.description && (
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                )}
              </div>
              {item.actions && (
                <div className="ml-4">
                  {item.actions}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

2. アクセシビリティテストの使用例

```tsx
import { AccessibleTable, AccessibleList } from "@/components/ui/accessible-data-display"
import { Button } from "@/components/ui/button"

export function AccessibilityDemo() {
  // サンプルデータ
  const financialData = [
    {
      month: "2024-01",
      revenue: 1250000,
      expenses: 850000,
      profit: 400000,
      status: "active"
    },
    {
      month: "2024-02",
      revenue: 1180000,
      expenses: 820000,
      profit: 360000,
      status: "active"
    },
    {
      month: "2024-03",
      revenue: 1320000,
      expenses: 880000,
      profit: 440000,
      status: "pending"
    }
  ]

  const tableColumns = [
    { header: "月", accessor: "month", type: "date" as const },
    { header: "売上", accessor: "revenue", type: "number" as const, isSortable: true },
    { header: "経費", accessor: "expenses", type: "number" as const, isSortable: true },
    { header: "利益", accessor: "profit", type: "number" as const, isSortable: true },
    { header: "ステータス", accessor: "status", type: "status" as const }
  ]

  const announcementItems = [
    {
      id: "1",
      title: "システムメンテナンスのお知らせ",
      description: "2024年2月15日 2:00-4:00にメンテナンスを実施します",
      actions: (
        <Button size="sm" variant="outline">
          詳細
        </Button>
      )
    },
    {
      id: "2",
      title: "新機能リリース",
      description: "データエクスポート機能が利用可能になりました",
      actions: (
        <Button size="sm" variant="outline">
          詳細
        </Button>
      )
    },
    {
      id: "3",
      title: "セキュリティアップデート",
      description: "重要なセキュリティアップデートを適用しました",
      actions: (
        <Button size="sm" variant="outline">
          詳細
        </Button>
      )
    }
  ]

  return (
    <div className="space-y-8 p-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">アクセシブルなテーブル</h3>
        <p className="text-sm text-muted-foreground mb-4">
          スクリーンリーダー対応の財務データテーブル
        </p>
        <AccessibleTable
          columns={tableColumns}
          data={financialData}
          caption="月次財務データサマリー"
          summary="このテーブルには2024年1月から3月までの売上、経費、利益データが含まれています"
          className="border rounded-lg"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">アクセシブルなリスト</h3>
        <p className="text-sm text-muted-foreground mb-4">
          キーボードナビゲーション対応のお知らせリスト
        </p>
        <AccessibleList
          items={announcementItems}
          title="システムお知らせ"
          description="重要なシステムに関するお知らせ一覧です"
          className="space-y-2"
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">アクセシビリティ対応機能</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• 適切なARIA属性の実装（role, aria-label, aria-describedby）</li>
          <li>• キーボードナビゲーション対応（Tab, Enter, Space）</li>
          <li>• スクリーンリーダー対応（テーブルキャプション、見出し階層）</li>
          <li>• データ型の適切なフォーマット（数値、日付、ステータス）</li>
          <li>• 十分なコントラスト比とフォーカスインジケーター</li>
        </ul>
      </div>
    </div>
  )
}
```

:::

これでアクセシビリティ対応のデータ表示コンポーネントを実装できました。

## 🎨 v0プロンプトの最適化

v0で高品質なデータ表示コンポーネントを生成するためのプロンプト設計テクニックを学びましょう。

### 効果的なプロンプトパターン

:::note データ表示コンポーネントのプロンプト設計

データ表示コンポーネントのプロンプト設計では、データ構造、表示要件、インタラクティブ機能、アクセシビリティ要件を具体的に記述することが重要です。大量データ対応やパフォーマンス要件も明確に伝えましょう。

:::

### v0プロンプトを動かして確認してみよう

実際のプロンプト例を使って、v0でコンポーネントを生成してみましょう。

:::step

1. カードコンポーネント生成プロンプト

```bash
Create a comprehensive card component library with React and Tailwind CSS. Include:

1. Base Card Component:
- Multiple variants (default, outlined, elevated, filled)
- Hover and focus states
- Loading state
- Clickable functionality
- Responsive design

2. Specialized Card Types:
- Data Card (with title, description, metadata, actions)
- Stat Card (with value, trend indicator, icon)
- Profile Card (with avatar, name, role, stats)
- Product Card (with image, price, rating, actions)

3. Features:
- Consistent spacing and typography
- Accessibility attributes (aria-labels, roles)
- Dark mode support
- Smooth animations and transitions
- Proper TypeScript interfaces

4. Usage Examples:
- Dashboard stat cards
- User profile cards
- Product listing cards
- Blog post cards

Please use shadcn/ui patterns, include proper documentation, and make all components fully responsive and accessible.
```

2. 仮想化リスト生成プロンプト

```bash
Create a high-performance virtualized list component with React and TypeScript. The component should support:

1. Core Features:
- Virtualization for large datasets (1000+ items)
- Customizable item height
- Smooth scrolling performance
- Dynamic item rendering

2. Advanced Features:
- Search and filter functionality
- Infinite scroll loading
- Item selection (single/multiple)
- Keyboard navigation
- Accessibility support

3. List Variants:
- User list with avatars and metadata
- File list with file type icons
- Search results with highlighting
- Task list with checkboxes

4. Performance Optimizations:
- React.memo for item components
- Efficient data filtering
- Debounced search input
- Proper event handling

5. Accessibility:
- ARIA attributes for lists
- Keyboard navigation support
- Screen reader compatibility
- Focus management

Use react-window for virtualization and implement proper TypeScript interfaces. Include comprehensive examples and documentation.
```

3. データテーブル生成プロンプト

```bash
Create a powerful data table component with React, TypeScript, and Tailwind CSS. The table should include:

1. Core Table Features:
- Column sorting (ascending/descending)
- Global search/filter
- Column visibility toggle
- Row selection
- Pagination controls

2. Advanced Functionality:
- Inline editing
- Cell validation
- Row expansion
- Export functionality (CSV/Excel)
- Column resizing
- Drag-and-drop reordering

3. Data Handling:
- TypeScript interfaces for data
- Custom cell renderers
- Data formatting (dates, numbers, currencies)
- Conditional styling
- Status indicators

4. Performance:
- Virtualized scrolling for large datasets
- Efficient data processing
- Optimized re-renders
- Debounced search

5. Accessibility:
- Semantic table structure
- ARIA attributes
- Keyboard navigation
- Screen reader support

Use TanStack Table (React Table) for the core functionality and shadcn/ui for styling. Include comprehensive documentation and examples.
```

4. ダッシュボード生成プロンプト

```bash
Create a comprehensive dashboard page that demonstrates advanced data visualization and management. The dashboard should include:

1. Layout Components:
- Responsive grid layout
- Collapsible sidebar navigation
- Header with user menu and notifications
- Breadcrumb navigation
- Content cards with proper spacing

2. Data Visualization:
- Stat cards with trend indicators
- Interactive charts (line, bar, pie)
- Data tables with sorting/filtering
- Progress indicators and badges
- Timeline components

3. Interactive Features:
- Real-time data updates
- Search and filter across components
- Date range picker
- Export functionality
- Print-friendly layouts

4. Performance:
- Lazy loading for components
- Efficient data fetching
- Optimized re-renders
- Proper state management

5. Accessibility:
- Keyboard navigation
- Screen reader support
- High contrast mode
- Focus indicators

Use Next.js, Tailwind CSS, shadcn/ui, and chart libraries like Recharts. Make it fully responsive and include proper TypeScript interfaces.
```

:::

これでv0で効果的なデータ表示コンポーネントを生成するためのプロンプト設計を学びました。

## 🚀 ベストプラクティスとパフォーマンス

データ表示コンポーネントを実装する際のベストプラクティスとパフォーマンス最適化テクニックを学びましょう。

### データ表示の最適化戦略

:::note データ表示のパフォーマンス

大量データを扱う場合、パフォーマンス最適化が重要です。仮想化、メモ化、効率的なデータ処理などの技術を使用して、スムーズなユーザー体験を提供する必要があります。

:::

### 最適化されたコンポーネントを実装してみよう

パフォーマンスを考慮したデータ表示コンポーネントを実装してみましょう。

:::step

1. メモ化されたデータ表示コンポーネント

```tsx
import React, { memo, useMemo, useCallback } from "react"
import { FixedSizeList as List } from "react-window"

// 高度に最適化されたデータカード
interface OptimizedDataCardProps {
  id: string
  title: string
  description?: string
  metadata?: Record<string, string>
  onClick?: (id: string) => void
  isSelected?: boolean
}

export const OptimizedDataCard = memo(function OptimizedDataCard({
  id,
  title,
  description,
  metadata,
  onClick,
  isSelected = false
}: OptimizedDataCardProps) {
  const handleClick = useCallback(() => {
    onClick?.(id)
  }, [onClick, id])

  // メモ化されたメタデータの表示
  const metadataItems = useMemo(() => {
    if (!metadata) return null
    return Object.entries(metadata).map(([key, value]) => (
      <div key={key} className="text-xs text-muted-foreground">
        <span className="font-medium">{key}:</span> {value}
      </div>
    ))
  }, [metadata])

  return (
    <div
      className={`
        p-4 border rounded-lg cursor-pointer transition-all duration-200
        hover:shadow-md hover:-translate-y-0.5
        ${isSelected ? 'ring-2 ring-primary bg-primary/5' : ''}
      `}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
    >
      <h3 className="font-medium mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mb-2">{description}</p>
      )}
      {metadataItems}
    </div>
  )
})

// 仮想化されたカードグリッド
interface VirtualizedCardGridProps {
  items: OptimizedDataCardProps[]
  columnCount: number
  rowHeight: number
  height: number
  onItemClick?: (id: string) => void
  selectedIds?: Set<string>
}

export function VirtualizedCardGrid({
  items,
  columnCount,
  rowHeight,
  height,
  onItemClick,
  selectedIds = new Set()
}: VirtualizedCardGridProps) {
  const itemCount = Math.ceil(items.length / columnCount)
  const columnWidth = 100 / columnCount

  const Row = memo(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const startIndex = index * columnCount
    const rowItems = items.slice(startIndex, startIndex + columnCount)

    return (
      <div style={style} className="flex">
        {rowItems.map((item, colIndex) => {
          if (!item) return null

          return (
            <div
              key={item.id}
              style={{ width: `${columnWidth}%`, padding: '8px' }}
            >
              <OptimizedDataCard
                {...item}
                onClick={onItemClick}
                isSelected={selectedIds.has(item.id)}
              />
            </div>
          )
        })}
      </div>
    )
  })

  return (
    <List
      height={height}
      itemCount={itemCount}
      itemSize={rowHeight}
      width="100%"
    >
      {Row}
    </List>
  )
}

// データ処理の最適化フック
export function useOptimizedDataProcessor<T extends { id: string }>(
  initialData: T[],
  options: {
    searchableFields?: (keyof T)[]
    filterableFields?: (keyof T)[]
    sortableField?: keyof T
  } = {}
) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const processedData = useMemo(() => {
    let result = [...initialData]

    // 検索処理
    if (searchTerm && options.searchableFields) {
      const term = searchTerm.toLowerCase()
      result = result.filter(item =>
        options.searchableFields!.some(field =>
          String(item[field]).toLowerCase().includes(term)
        )
      )
    }

    // フィルター処理
    Object.entries(filters).forEach(([field, value]) => {
      if (value) {
        result = result.filter(item =>
          String(item[field]).toLowerCase().includes(value.toLowerCase())
        )
      }
    })

    // ソート処理
    if (options.sortableField) {
      result.sort((a, b) => {
        const aValue = String(a[options.sortableField!])
        const bValue = String(b[options.sortableField!])

        if (sortDirection === "asc") {
          return aValue.localeCompare(bValue)
        } else {
          return bValue.localeCompare(aValue)
        }
      })
    }

    return result
  }, [initialData, searchTerm, filters, sortDirection, options])

  const debouncedSearch = useMemo(
    () => debounce((value: string) => setSearchTerm(value), 300),
    []
  )

  return {
    data: processedData,
    searchTerm,
    setSearchTerm: debouncedSearch,
    filters,
    setFilters,
    sortDirection,
    setSortDirection,
    totalCount: initialData.length,
    filteredCount: processedData.length
  }
}

function debounce<T extends (...args: any[]) => void>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout
  return ((...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }) as T
}
```

2. パフォーマンスモニタリングの実装

```tsx
import { useEffect, useRef, useState } from "react"

// コンポーネントのパフォーマンスを監視するフック
export function usePerformanceMonitor(componentName: string) {
  const renderCount = useRef(0)
  const lastRenderTime = useRef<number | null>(null)
  const renderTimes = useRef<number[]>([])
  const [averageRenderTime, setAverageRenderTime] = useState<number>(0)

  useEffect(() => {
    renderCount.current += 1
    const now = performance.now()

    if (lastRenderTime.current) {
      const renderTime = now - lastRenderTime.current
      renderTimes.current.push(renderTime)

      // 最新10回の平均を計算
      if (renderTimes.current.length > 10) {
        renderTimes.current = renderTimes.current.slice(-10)
      }

      const avg = renderTimes.current.reduce((a, b) => a + b, 0) / renderTimes.current.length
      setAverageRenderTime(avg)

      if (renderTime > 16) { // 60fpsの閾値
        console.warn(`${componentName}: Slow render detected (${renderTime.toFixed(2)}ms)`)
      }
    }

    lastRenderTime.current = now
  })

  return {
    renderCount: renderCount.current,
    averageRenderTime,
    lastRenderTime: lastRenderTime.current
  }
}

// データ読み込みの最適化コンポーネント
export function OptimizedDataLoader<T>({
  fetchData,
  renderItem,
  loadingComponent: LoadingComponent,
  errorComponent: ErrorComponent,
  emptyComponent: EmptyComponent,
  deps = []
}: {
  fetchData: () => Promise<T[]>
  renderItem: (item: T, index: number) => React.ReactNode
  loadingComponent: React.ComponentType
  errorComponent: React.ComponentType<{ error: Error }>
  emptyComponent: React.ComponentType
  deps?: any[]
}) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const perfMonitor = usePerformanceMonitor("OptimizedDataLoader")

  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await fetchData()

        if (isMounted) {
          setData(result)
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, deps)

  if (loading) {
    return <LoadingComponent />
  }

  if (error) {
    return <ErrorComponent error={error} />
  }

  if (data.length === 0) {
    return <EmptyComponent />
  }

  return (
    <>
      {data.map((item, index) => (
        <React.Fragment key={item.id || index}>
          {renderItem(item, index)}
        </React.Fragment>
      ))}
    </>
  )
}
```

3. 使用例

```tsx
import {
  VirtualizedCardGrid,
  useOptimizedDataProcessor,
  usePerformanceMonitor
} from "@/components/ui/optimized-data-display"

interface Product {
  id: string
  name: string
  price: number
  category: string
  rating: number
  description?: string
}

export function OptimizedDataDemo() {
  const perfMonitor = usePerformanceMonitor("OptimizedDataDemo")

  // サンプルデータ生成
  const generateProducts = (count: number): Product[] => {
    const categories = ["Electronics", "Clothing", "Books", "Home", "Sports"]

    return Array.from({ length: count }, (_, index) => ({
      id: `product-${index + 1}`,
      name: `商品 ${index + 1}`,
      price: Math.floor(Math.random() * 100000) + 1000,
      category: categories[index % categories.length],
      rating: Math.floor(Math.random() * 50) / 10 + 1,
      description: `これは商品 ${index + 1} の説明文です`
    }))
  }

  const [products] = useState(() => generateProducts(10000))
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const {
    data: processedData,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    totalCount,
    filteredCount
  } = useOptimizedDataProcessor(products, {
    searchableFields: ["name", "description", "category"],
    filterableFields: ["category"],
    sortableField: "name"
  })

  const handleItemClick = useCallback((id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }, [])

  return (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">最適化されたデータ表示</h3>
        <div className="mb-4 space-y-2">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="商品を検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-input rounded-md flex-1"
            />
            <select
              value={filters.category || ""}
              onChange={(e) => setFilters({ category: e.target.value })}
              className="px-3 py-2 border border-input rounded-md"
            >
              <option value="">すべてのカテゴリー</option>
              <option value="Electronics">電子機器</option>
              <option value="Clothing">衣類</option>
              <option value="Books">書籍</option>
              <option value="Home">ホーム</option>
              <option value="Sports">スポーツ</option>
            </select>
          </div>
          <div className="text-sm text-muted-foreground">
            表示: {filteredCount} / {totalCount} 件 | 選択: {selectedIds.size} 件
          </div>
        </div>

        <VirtualizedCardGrid
          items={processedData.map(product => ({
            id: product.id,
            title: product.name,
            description: `${product.category} - ¥${product.price.toLocaleString()}`,
            metadata: {
              評価: `${product.rating}⭐`,
              カテゴリー: product.category
            },
            onClick: handleItemClick
          }))}
          columnCount={3}
          rowHeight={200}
          height={600}
          onItemClick={handleItemClick}
          selectedIds={selectedIds}
        />
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-medium text-green-900 mb-2">パフォーマンス情報</h4>
        <div className="text-sm text-green-800 space-y-1">
          <div>レンダリング回数: {perfMonitor.renderCount}</div>
          <div>平均レンダリング時間: {perfMonitor.averageRenderTime.toFixed(2)}ms</div>
          <div>処理データ数: {filteredCount} 件</div>
          <div>最適化技術: 仮想化、メモ化、デバウンス検索</div>
        </div>
      </div>
    </div>
  )
}
```

:::

これでパフォーマンス最適化されたデータ表示コンポーネントを実装できました。

## まとめ

このページでは、カード、リスト、テーブルコンポーネントの実装について学びました。v0で生成したコンポーネントを基に、実践的なカスタマイズと最適化の手法を習得しました。

:::note 要点のまとめ

- カードコンポーネントは情報をグループ化して表示し、様々なバリエーションを実装可能
- リストコンポーネントは仮想化技術により大量データを効率的に表示
- テーブルコンポーネントはソート、検索、ページネーションなどの高度な機能をサポート
- アクセシビリティ対応はすべてのデータ表示コンポーネントに必須
- パフォーマンス最適化により、スムーズなユーザー体験を提供
- v0プロンプトの設計により、高品質なデータ表示コンポーネントを生成可能

:::

これらのデータ表示コンポーネントは、実際のアプリケーションでデータを効果的に表示するための基礎となります。次は[ナビゲーション](./navigation.md)を学び、サイト構造を支えるコンポーネントの実装方法を習得していきましょう。

## 関連リンク

- [shadcn/ui Cardコンポーネント](https://ui.shadcn.com/docs/components/card)
- [shadcn/ui Tableコンポーネント](https://ui.shadcn.com/docs/components/table)
- [TanStack Tableドキュメント](https://tanstack.com/table/v8)
- [React Windowドキュメント](https://github.com/bvaughn/react-window)
- [データ表示のアクセシビリティガイド](https://www.w3.org/WAI/tutorials/tables/)
- [Reactパフォーマンス最適化](https://react.dev/learn/render-and-commit)

## さらに深く学習したい方へ

このコンテンツは、v0とReactコンポーネント開発の基礎を学ぶための導入編です。より深く学習したい方には、以下の研修プログラムをおすすめします：

- **v0実践コース**: プロンプト設計から本番環境へのデプロイまで
- **Reactデザインシステム構築**: エンタープライズ向けコンポーネント開発
- **アクセシビリティ実践講座**: 包括的UI開発の専門知識
- **パフォーマンス最適化コース**: 高速なReactアプリケーション開発

詳細はお問い合わせください。