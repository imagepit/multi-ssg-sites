---
title: ボタン/バッジ/タグの実装 | React+Tailwind+shadcn/uiで学ぶUIコンポーネント開発
slug: buttons-badges-tags
parent: components
file_path: components/buttons-badges-tags.md
target_user: フロントエンド開発者、UI/UXデザイナー、Reactエンジニア
goal: "v0で生成したボタン、バッジ、タグコンポーネントをReactとshadcn/uiで実装し、アクセシブルで再利用可能なUI要素を開発するスキルを習得する"
status: publish
post_type: pages
seo_title: v0ボタン/バッジ/タグ実装ガイド | React+Tailwind+shadcn/uiで学ぶUIコンポーネント開発
seo_description: "v0で生成したボタン、バッジ、タグコンポーネントを実装する完全ガイド。Reactとshadcn/uiを活用したアクセシブルで再利用可能なUI要素の開発方法を学びます。"
seo_keywords: "v0, Reactコンポーネント, Tailwind CSS, shadcn/ui, ボタン, バッジ, タグ, UI実装, アクセシビリティ, フロントエンド開発"
handson_overview: "v0で生成したボタン、バッジ、タグコンポーネントを実際にカスタマイズし、Reactプロジェクトに統合するハンズオン。スタイルバリエーション、状態管理、アクセシビリティ対応を学びます。"
---

## はじめに

🔘 ボタン、バッジ、タグはWebアプリケーションで最も頻繁に使用されるUIコンポーネントです。v0で生成したこれらの基本要素を、Reactとshadcn/uiを使って実践的に実装する方法を学びましょう。

### このページで学べる事

このセクションでは、ボタン、バッジ、タグコンポーネントの設計から実装までを学びます。

:::note

- v0で生成したボタンコンポーネントのカスタマイズ方法
- バッジの状態表示と通知パターンの実装
- タグのフィルタリングとカテゴリ表示の最適化
- アクセシビリティ対応とキーボードナビゲーション
- 状態管理とインタラクティブなUI要素の作成

:::

## 🎯 ボタンコンポーネントの基礎

ボタンはユーザー操作の基本要素であり、様々なバリエーションと状態を持つ重要なコンポーネントです。v0で生成したボタンを拡張し、実践的な実装パターンを学びましょう。

### ボタンの基本構造とバリエーション

:::note ボタンコンポーネントとは

ボタンコンポーネントは、ユーザーがクリックやタップによってアクションをトリガーするためのUI要素です。shadcn/uiはRadix UIをベースにしたアクセシブルなボタンコンポーネントを提供し、様々なバリエーションを簡単に実装できます。

:::

### ボタンバリエーションを実装してみよう

v0で生成したボタンコンポーネントを実際にカスタマイズし、様々なスタイルを実装してみましょう。

:::step

1. shadcn/uiボタンコンポーネントのインストール

```bash
npx shadcn-ui@latest add button
```

2. カスタムボタンコンポーネントの作成

`src/components/ui/custom-button.tsx`ファイルを作成し、拡張されたボタンコンポーネントを実装します：

```tsx
import { Button as ShadcnButton, buttonVariants } from "@/components/ui/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { forwardRef } from "react"

// カスタムバリアントの定義
const customButtonVariants = cva("", {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
      // カスタムバリアント
      gradient: "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700",
      glow: "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30",
    },
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
      // カスタムサイズ
      xl: "h-12 rounded-lg px-10 text-lg",
      xs: "h-7 rounded px-2 text-xs",
    },
    loading: {
      true: "cursor-not-allowed opacity-70",
      false: "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
    loading: false,
  },
})

export interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof customButtonVariants> {
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const CustomButton = forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ className, children, variant, size, loading, leftIcon, rightIcon, disabled, ...props }, ref) => {
    return (
      <ShadcnButton
        className={cn(customButtonVariants({ variant, size, loading }), className)}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {leftIcon && !loading && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </ShadcnButton>
    )
  }
)

CustomButton.displayName = "CustomButton"

export { CustomButton, customButtonVariants }
```

3. ボタンコンポーネントの使用例

```tsx
import { CustomButton } from "@/components/ui/custom-button"
import { Check, X, Plus, Download } from "lucide-react"

export function ButtonDemo() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">基本バリエーション</h3>
        <div className="flex flex-wrap gap-3">
          <CustomButton>デフォルト</CustomButton>
          <CustomButton variant="destructive">破棄</CustomButton>
          <CustomButton variant="outline">アウトライン</CustomButton>
          <CustomButton variant="secondary">セカンダリ</CustomButton>
          <CustomButton variant="ghost">ゴースト</CustomButton>
          <CustomButton variant="link">リンク</CustomButton>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">カスタムバリエーション</h3>
        <div className="flex flex-wrap gap-3">
          <CustomButton variant="gradient">グラデーション</CustomButton>
          <CustomButton variant="glow">グロー効果</CustomButton>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">サイズバリエーション</h3>
        <div className="flex flex-wrap items-center gap-3">
          <CustomButton size="xs">XS</CustomButton>
          <CustomButton size="sm">SM</CustomButton>
          <CustomButton size="default">Default</CustomButton>
          <CustomButton size="lg">LG</CustomButton>
          <CustomButton size="xl">XL</CustomButton>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">アイコン付きボタン</h3>
        <div className="flex flex-wrap gap-3">
          <CustomButton leftIcon={<Plus className="h-4 w-4" />}>
            新規作成
          </CustomButton>
          <CustomButton rightIcon={<Download className="h-4 w-4" />} variant="outline">
            ダウンロード
          </CustomButton>
          <CustomButton leftIcon={<Check className="h-4 w-4" />} variant="secondary">
            保存
          </CustomButton>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">ローディング状態</h3>
        <div className="flex flex-wrap gap-3">
          <CustomButton loading>処理中...</CustomButton>
          <CustomButton variant="outline" loading>
            読み込み中
          </CustomButton>
        </div>
      </div>
    </div>
  )
}
```

:::

これで様々なスタイルと機能を持つボタンコンポーネントを実装できました。

## 🏷️ バッジコンポーネントの実装

バッジは状態、カウント、カテゴリ情報などを視覚的に表示する小さなコンポーネントです。通知バッジやステータス表示など、様々な用途で活用されます。

### バッジのパターンと用途

:::note バッジコンポーネントとは

バッジコンポーネントは、小さなラベルやインジケーターとして情報を表示するUI要素です。未読メッセージ数、ユーザーステータス、フィルタリング状態などを視覚的に伝えるために使用されます。

:::

### バッジコンポーネントを動かして確認してみよう

実際にバッジコンポーネントを実装し、様々な表示パターンを試してみましょう。

:::step

1. shadcn/uiバッジコンポーネントのインストール

```bash
npx shadcn-ui@latest add badge
```

2. 拡張バッジコンポーネントの作成

`src/components/ui/custom-badge.tsx`ファイルを作成します：

```tsx
import { Badge as ShadcnBadge, badgeVariants } from "@/components/ui/badge"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { forwardRef } from "react"

// カスタムバッジバリアントの定義
const customBadgeVariants = cva("", {
  variants: {
    variant: {
      default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
      secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
      destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
      outline: "text-foreground",
      // カスタムバリアント
      success: "border-transparent bg-green-500 text-white hover:bg-green-600",
      warning: "border-transparent bg-yellow-500 text-white hover:bg-yellow-600",
      info: "border-transparent bg-blue-500 text-white hover:bg-blue-600",
      error: "border-transparent bg-red-500 text-white hover:bg-red-600",
      // パステルカラー
      pastel: "border-transparent bg-gray-100 text-gray-700 hover:bg-gray-200",
    },
    size: {
      default: "px-2.5 py-0.5 text-xs",
      sm: "px-2 py-0.5 text-xs",
      lg: "px-3 py-1 text-sm",
      // カスタムサイズ
      xl: "px-4 py-1.5 text-base",
    },
    shape: {
      default: "rounded-full",
      rounded: "rounded-md",
      square: "rounded-none",
    },
    dot: {
      true: "relative pl-4 before:content-[''] before:absolute before:left-1.5 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:rounded-full",
      false: "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
    shape: "default",
    dot: false,
  },
})

export interface CustomBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof customBadgeVariants> {
  count?: number
  maxCount?: number
}

const CustomBadge = forwardRef<HTMLDivElement, CustomBadgeProps>(
  ({ className, children, variant, size, shape, dot, count, maxCount = 99, ...props }, ref) => {
    const displayCount = count && count > maxCount ? `${maxCount}+` : count

    return (
      <ShadcnBadge
        ref={ref}
        className={cn(
          customBadgeVariants({ variant, size, shape, dot }),
          // ドットインジケーターの色設定
          dot && {
            "before:bg-green-500": variant === "success" || variant === "default",
            "before:bg-yellow-500": variant === "warning",
            "before:bg-blue-500": variant === "info",
            "before:bg-red-500": variant === "error" || variant === "destructive",
          },
          className
        )}
        {...props}
      >
        {displayCount && (
          <span className="mr-1 font-semibold">{displayCount}</span>
        )}
        {children}
      </ShadcnBadge>
    )
  }
)

CustomBadge.displayName = "CustomBadge"

export { CustomBadge, customBadgeVariants }
```

3. バッジコンポーネントの使用例

```tsx
import { CustomBadge } from "@/components/ui/custom-badge"
import { Bell, Mail, MessageSquare, Users, AlertCircle, CheckCircle } from "lucide-react"

export function BadgeDemo() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">基本バリエーション</h3>
        <div className="flex flex-wrap gap-2">
          <CustomBadge>デフォルト</CustomBadge>
          <CustomBadge variant="secondary">セカンダリ</CustomBadge>
          <CustomBadge variant="destructive">エラー</CustomBadge>
          <CustomBadge variant="outline">アウトライン</CustomBadge>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">ステータスバリエーション</h3>
        <div className="flex flex-wrap gap-2">
          <CustomBadge variant="success">成功</CustomBadge>
          <CustomBadge variant="warning">警告</CustomBadge>
          <CustomBadge variant="info">情報</CustomBadge>
          <CustomBadge variant="error">エラー</CustomBadge>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">カウント付きバッジ</h3>
        <div className="flex flex-wrap gap-2">
          <CustomBadge count={5}>新着</CustomBadge>
          <CustomBadge count={23} variant="secondary">メッセージ</CustomBadge>
          <CustomBadge count={150} maxCount={99} variant="destructive">通知</CustomBadge>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">通知アイコンとの組み合わせ</h3>
        <div className="flex items-center gap-6">
          <div className="relative">
            <Bell className="h-6 w-6" />
            <CustomBadge
              count={3}
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            />
          </div>
          <div className="relative">
            <Mail className="h-6 w-6" />
            <CustomBadge
              count={12}
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            />
          </div>
          <div className="relative">
            <MessageSquare className="h-6 w-6" />
            <CustomBadge
              variant="success"
              dot
              className="absolute -top-1 -right-1 h-3 w-3 p-0"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">サイズと形状</h3>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <CustomBadge size="xs">XS</CustomBadge>
            <CustomBadge size="sm">SM</CustomBadge>
            <CustomBadge size="default">Default</CustomBadge>
            <CustomBadge size="lg">LG</CustomBadge>
            <CustomBadge size="xl">XL</CustomBadge>
          </div>
          <div className="flex flex-wrap gap-2">
            <CustomBadge shape="default">丸型</CustomBadge>
            <CustomBadge shape="rounded">角丸</CustomBadge>
            <CustomBadge shape="square">四角</CustomBadge>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">ドットインジケーター</h3>
        <div className="flex flex-wrap gap-4">
          <CustomBadge dot variant="success">オンライン</CustomBadge>
          <CustomBadge dot variant="warning">保留中</CustomBadge>
          <CustomBadge dot variant="error">オフライン</CustomBadge>
          <CustomBadge dot>未読</CustomBadge>
        </div>
      </div>
    </div>
  )
}
```

:::

これで様々な用途に対応できるバッジコンポーネントを実装できました。

## 🏷️ タグコンポーネントの実装

タグはコンテンツの分類、フィルタリング、ナビゲーションに使用されるインタラクティブなコンポーネントです。選択・削除可能なタググループや、クリック可能なタグリンクなど、様々なパターンを実装します。

### タグの用途とパターン

:::note タグコンポーネントとは

タグコンポーネントは、コンテンツの分類やフィルタリング機能を提供するUI要素です。ブログのカテゴリータグ、タスク管理のラベル、検索フィルターなど、ユーザーが情報を整理・検索するための重要なインターフェース要素です。

:::

### タグコンポーネントを動かして確認してみよう

インタラクティブなタグコンポーネントを実装し、実際の使用シーンを体験してみましょう。

:::step

1. タグコンポーネントの作成

`src/components/ui/tag.tsx`ファイルを作成します：

```tsx
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, Plus } from "lucide-react"
import { useState } from "react"

export interface Tag {
  id: string
  label: string
  color?: "default" | "secondary" | "destructive" | "success" | "warning" | "info"
  selected?: boolean
}

export interface TagProps {
  tag: Tag
  onClick?: (tag: Tag) => void
  onRemove?: (tag: Tag) => void
  removable?: boolean
  className?: string
}

export function Tag({ tag, onClick, onRemove, removable = false, className }: TagProps) {
  const getVariant = () => {
    if (tag.color === "success") return "default"
    if (tag.color === "warning") return "secondary"
    if (tag.color === "info") return "outline"
    if (tag.color === "destructive") return "destructive"
    return tag.selected ? "default" : "outline"
  }

  return (
    <Badge
      variant={getVariant()}
      className={`
        cursor-pointer transition-colors
        ${tag.selected ? "bg-primary text-primary-foreground" : ""}
        ${onClick ? "hover:bg-accent hover:text-accent-foreground" : ""}
        ${removable ? "pr-1" : ""}
        ${className}
      `}
      onClick={() => onClick?.(tag)}
    >
      {tag.label}
      {removable && (
        <Button
          variant="ghost"
          size="icon"
          className="h-4 w-4 ml-1 hover:bg-transparent"
          onClick={(e) => {
            e.stopPropagation()
            onRemove?.(tag)
          }}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </Badge>
  )
}

export interface TagGroupProps {
  tags: Tag[]
  onTagClick?: (tag: Tag) => void
  onTagRemove?: (tag: Tag) => void
  onTagAdd?: (label: string) => void
  multiSelect?: boolean
  removable?: boolean
  addable?: boolean
  className?: string
}

export function TagGroup({
  tags,
  onTagClick,
  onTagRemove,
  onTagAdd,
  multiSelect = true,
  removable = false,
  addable = false,
  className
}: TagGroupProps) {
  const [newTagLabel, setNewTagLabel] = useState("")

  const handleTagClick = (clickedTag: Tag) => {
    if (!multiSelect) {
      // 単一選択モードの場合、他のタグの選択を解除
      const updatedTags = tags.map(tag => ({
        ...tag,
        selected: tag.id === clickedTag.id
      }))
      onTagClick?.({ ...clickedTag, selected: true })
    } else {
      // 複数選択モードの場合、選択状態を切り替え
      const updatedTag = { ...clickedTag, selected: !clickedTag.selected }
      onTagClick?.(updatedTag)
    }
  }

  const handleAddTag = () => {
    if (newTagLabel.trim() && onTagAdd) {
      onTagAdd(newTagLabel.trim())
      setNewTagLabel("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTag()
    }
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Tag
            key={tag.id}
            tag={tag}
            onClick={handleTagClick}
            onRemove={onTagRemove}
            removable={removable}
          />
        ))}
      </div>

      {addable && (
        <div className="flex gap-2">
          <input
            type="text"
            value={newTagLabel}
            onChange={(e) => setNewTagLabel(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="新しいタグを追加..."
            className="px-3 py-1 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddTag}
            disabled={!newTagLabel.trim()}
          >
            <Plus className="h-4 w-4 mr-1" />
            追加
          </Button>
        </div>
      )}
    </div>
  )
}
```

2. タグコンポーネントの使用例

```tsx
import { Tag, TagGroup, type Tag as TagType } from "@/components/ui/tag"
import { useState } from "react"

export function TagDemo() {
  // フィルタリング用のタグ
  const [filterTags, setFilterTags] = useState<TagType[]>([
    { id: "1", label: "React", selected: false },
    { id: "2", label: "TypeScript", selected: true },
    { id: "3", label: "Next.js", selected: false },
    { id: "4", label: "Tailwind CSS", selected: true },
    { id: "5", label: "shadcn/ui", selected: false },
  ])

  // カテゴリータグ
  const [categoryTags, setCategoryTags] = useState<TagType[]>([
    { id: "frontend", label: "フロントエンド", color: "info", selected: true },
    { id: "backend", label: "バックエンド", color: "warning", selected: false },
    { id: "design", label: "デザイン", color: "success", selected: false },
    { id: "devops", label: "DevOps", color: "destructive", selected: false },
  ])

  // 管理可能なタグ
  const [manageableTags, setManageableTags] = useState<TagType[]>([
    { id: "bug", label: "バグ", color: "destructive" },
    { id: "feature", label: "機能", color: "success" },
    { id: "improvement", label: "改善", color: "info" },
    { id: "documentation", label: "ドキュメント", color: "warning" },
  ])

  const handleFilterTagClick = (tag: TagType) => {
    setFilterTags(prev =>
      prev.map(t => t.id === tag.id ? { ...t, selected: !t.selected } : t)
    )
  }

  const handleCategoryTagClick = (tag: TagType) => {
    setCategoryTags(prev =>
      prev.map(t => ({ ...t, selected: t.id === tag.id }))
    )
  }

  const handleTagRemove = (tag: TagType) => {
    setManageableTags(prev => prev.filter(t => t.id !== tag.id))
  }

  const handleTagAdd = (label: string) => {
    const newTag: TagType = {
      id: Date.now().toString(),
      label,
      color: "default"
    }
    setManageableTags(prev => [...prev, newTag])
  }

  return (
    <div className="space-y-8 p-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">フィルタリングタグ（複数選択）</h3>
        <p className="text-sm text-muted-foreground mb-4">
          技術スタックでフィルタリング：{filterTags.filter(t => t.selected).map(t => t.label).join(", ") || "なし"}
        </p>
        <TagGroup
          tags={filterTags}
          onTagClick={handleFilterTagClick}
          multiSelect={true}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">カテゴリータグ（単一選択）</h3>
        <p className="text-sm text-muted-foreground mb-4">
          選択中のカテゴリー：{categoryTags.find(t => t.selected)?.label || "なし"}
        </p>
        <TagGroup
          tags={categoryTags}
          onTagClick={handleCategoryTagClick}
          multiSelect={false}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">管理可能なタグ</h3>
        <p className="text-sm text-muted-foreground mb-4">
          タグの追加・削除が可能です
        </p>
        <TagGroup
          tags={manageableTags}
          onTagRemove={handleTagRemove}
          onTagAdd={handleTagAdd}
          removable={true}
          addable={true}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">ブログ記事のタグ</h3>
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-2">v0でコンポーネントを生成する方法</h4>
            <div className="flex flex-wrap gap-2">
              <Tag tag={{ id: "1", label: "v0" }} />
              <Tag tag={{ id: "2", label: "React", color: "info" }} />
              <Tag tag={{ id: "3", label: "コンポーネント" }} />
              <Tag tag={{ id: "4", label: "チュートリアル", color: "success" }} />
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-2">shadcn/uiのカスタマイズ</h4>
            <div className="flex flex-wrap gap-2">
              <Tag tag={{ id: "5", label: "shadcn/ui" }} />
              <Tag tag={{ id: "6", label: "Tailwind CSS", color: "warning" }} />
              <Tag tag={{ id: "7", label: "カスタマイズ" }} />
              <Tag tag={{ id: "8", label: "デザインシステム", color: "info" }} />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">タスク管理のラベル</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 border rounded">
            <span>ログイン機能の実装</span>
            <div className="flex gap-1">
              <Tag tag={{ id: "9", label: "機能", color: "success" }} />
              <Tag tag={{ id: "10", label: "認証", color: "info" }} />
            </div>
          </div>
          <div className="flex items-center justify-between p-2 border rounded">
            <span>バグ修正：ボタンのスタイル</span>
            <div className="flex gap-1">
              <Tag tag={{ id: "11", label: "バグ", color: "destructive" }} />
              <Tag tag={{ id: "12", label: "UI", color: "warning" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

:::

これでインタラクティブなタグコンポーネントを実装できました。

## ♿ アクセシビリティの考慮

ボタン、バッジ、タグコンポーネントは、すべてのユーザーが利用できるようにアクセシビリティ対応が重要です。キーボード操作、スクリーンリーダー対応、コントラスト比などを実装しましょう。

### アクセシビリティ対応の実装

:::note アクセシビリティとは

アクセシビリティとは、障害のあるユーザーを含むすべてのユーザーがWebコンテンツを利用できるようにする設計アプローチです。WAI-ARIA仕様に準拠し、キーボード操作やスクリーンリーダー対応を実装します。

:::

### アクセシブルなコンポーネントを動かして確認してみよう

アクセシビリティ対応を強化したコンポーネントを実装してみましょう。

:::step

1. アクセシブルなボタンの実装

```tsx
import { Button } from "@/components/ui/button"
import { forwardRef } from "react"

export interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  loadingText?: string
  tooltip?: string
  ariaDescription?: string
}

const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({
    children,
    loading = false,
    loadingText = "読み込み中",
    tooltip,
    ariaDescription,
    disabled,
    ...props
  }, ref) => {
    return (
      <Button
        ref={ref}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        aria-busy={loading}
        aria-label={loading ? loadingText : undefined}
        aria-describedby={ariaDescription ? `${props.id || 'button'}-description` : undefined}
        title={tooltip}
        {...props}
      >
        {loading ? (
          <span className="flex items-center">
            <svg
              className="animate-spin h-4 w-4 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {loadingText}
          </span>
        ) : children}
      </Button>
    )
  }
)

AccessibleButton.displayName = "AccessibleButton"
```

2. アクセシブルなタググループの実装

```tsx
import { TagGroup as BaseTagGroup, type Tag as TagType } from "@/components/ui/tag"
import { useId } from "react"

export interface AccessibleTagGroupProps {
  tags: TagType[]
  onTagChange?: (selectedTags: TagType[]) => void
  label: string
  description?: string
  multiSelect?: boolean
  required?: boolean
}

export function AccessibleTagGroup({
  tags,
  onTagChange,
  label,
  description,
  multiSelect = true,
  required = false
}: AccessibleTagGroupProps) {
  const groupId = useId()
  const descriptionId = useId()

  const handleTagClick = (clickedTag: TagType) => {
    let updatedTags: TagType[]

    if (multiSelect) {
      updatedTags = tags.map(tag =>
        tag.id === clickedTag.id ? { ...tag, selected: !tag.selected } : tag
      )
    } else {
      updatedTags = tags.map(tag =>
        ({ ...tag, selected: tag.id === clickedTag.id })
      )
    }

    onTagChange?.(updatedTags.filter(t => t.selected))
  }

  return (
    <div role="group" aria-labelledby={groupId} className="space-y-2">
      <label
        id={groupId}
        className="text-sm font-medium"
      >
        {label}
        {required && <span className="text-red-500 ml-1" aria-label="必須">*</span>}
      </label>

      {description && (
        <p
          id={descriptionId}
          className="text-sm text-muted-foreground"
        >
          {description}
        </p>
      )}

      <div
        role="listbox"
        aria-multiselectable={multiSelect}
        aria-describedby={description ? descriptionId : undefined}
        aria-required={required}
        className="flex flex-wrap gap-2"
      >
        {tags.map((tag) => (
          <button
            key={tag.id}
            role="option"
            aria-selected={tag.selected}
            aria-label={`${tag.label}タグ`}
            onClick={() => handleTagClick(tag)}
            className={`
              px-3 py-1 rounded-full text-sm border transition-colors
              ${tag.selected
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-foreground border-input hover:bg-accent'
              }
              focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
            `}
          >
            {tag.label}
          </button>
        ))}
      </div>
    </div>
  )
}
```

3. アクセシビリティテストの使用例

```tsx
import { AccessibleButton } from "@/components/ui/accessible-button"
import { AccessibleTagGroup } from "@/components/ui/accessible-tag-group"
import { useState } from "react"

export function AccessibilityDemo() {
  const [selectedSkills, setSelectedSkills] = useState<TagType[]>([])

  const skills: TagType[] = [
    { id: "react", label: "React", selected: false },
    { id: "typescript", label: "TypeScript", selected: false },
    { id: "nextjs", label: "Next.js", selected: false },
    { id: "tailwind", label: "Tailwind CSS", selected: false },
    { id: "nodejs", label: "Node.js", selected: false },
  ]

  return (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">アクセシブルなボタン</h3>
        <div className="space-y-4">
          <div>
            <AccessibleButton
              tooltip="このボタンはフォームを送信します"
              ariaDescription="クリックすると入力内容が送信されます"
            >
              送信する
            </AccessibleButton>
          </div>

          <div>
            <AccessibleButton
              variant="outline"
              loading
              loadingText="処理中です。お待ちください..."
            >
              通常のテキスト
            </AccessibleButton>
          </div>

          <div>
            <AccessibleButton
              variant="destructive"
              tooltip="この操作は元に戻せません"
            >
              削除する
            </AccessibleButton>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">アクセシブルなタググループ</h3>
        <div className="space-y-4">
          <AccessibleTagGroup
            tags={skills}
            onTagChange={setSelectedSkills}
            label="スキルセット"
            description="使用できる技術スタックを選択してください（複数選択可）"
            multiSelect={true}
          />

          <div className="text-sm text-muted-foreground">
            選択されたスキル: {selectedSkills.map(s => s.label).join(", ") || "なし"}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">アクセシビリティのテスト方法</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Tabキーでフォーカスを移動できるか確認</li>
          <li>• スクリーンリーダーで正しく読み上げられるか確認</li>
          <li>• キーボードのみで操作できるか確認</li>
          <li>• 十分なコントラスト比が確保されているか確認</li>
          <li>• ホバー状態が視覚的に認識できるか確認</li>
        </ul>
      </div>
    </div>
  )
}
```

:::

これでアクセシビリティに対応したコンポーネントを実装できました。

## 🎨 v0プロンプトの最適化

v0で高品質なボタン、バッジ、タグコンポーネントを生成するためのプロンプト設計テクニックを学びましょう。

### 効果的なプロンプトパターン

:::note v0プロンプト設計のコツ

v0のプロンプト設計では、具体的な要件を明確に伝えることが重要です。デザインの意図、使用目的、スタイル要件、アクセシビリティ要件などを詳細に記述することで、より正確なコードを生成できます。

:::

### v0プロンプトを動かして確認してみよう

実際のプロンプト例を使って、v0でコンポーネントを生成してみましょう。

:::step

1. ボタンコンポーネント生成プロンプト

```bash
Create a modern button component with React and Tailwind CSS. The button should have:

Variants:
- Default (primary blue background)
- Secondary (gray background)
- Destructive (red background)
- Outline (border only)
- Ghost (no background, hover effect)
- Link (styled as link)

Sizes:
- Small (h-8 px-3 text-sm)
- Medium (h-10 px-4 text-sm) - default
- Large (h-11 px-8 text-base)
- Icon (square, h-10 w-10)

Features:
- Loading state with spinner
- Disabled state
- Left and right icon support
- Hover and focus states
- Keyboard navigation support
- Accessibility attributes (aria-label, etc.)

Please use shadcn/ui patterns and TypeScript. Include proper type definitions and export the component as default.
```

2. バッジコンポーネント生成プロンプト

```bash
Create a flexible badge component with React and Tailwind CSS. The badge should support:

Variants:
- Default (primary color)
- Secondary (gray color)
- Success (green color)
- Warning (yellow/orange color)
- Error (red color)
- Outline (border only)

Features:
- Different sizes (small, medium, large)
- Dot indicator for status
- Count badge with max display (e.g., 99+)
- Removable badges with X button
- Clickable badges
- Shape variations (rounded, square, pill)

Use Cases:
- Notification badges
- Status indicators
- Category labels
- Count indicators

Please implement with TypeScript, proper accessibility attributes, and smooth hover transitions. Use shadcn/ui Badge as base and extend it.
```

3. タグコンポーネント生成プロンプト

```bash
Create an interactive tag component system with React and TypeScript. The system should include:

1. Individual Tag Component:
- Clickable tags
- Removable tags
- Different color variants
- Size variations
- Hover and active states

2. Tag Group Component:
- Multi-select support
- Single-select support
- Add new tags functionality
- Search/filter within tags
- Keyboard navigation
- Drag and drop reordering (optional)

3. Features:
- Tag management (add/remove/edit)
- Selected state management
- Accessibility support (ARIA attributes)
- Responsive design
- Smooth animations

4. Use Cases:
- Blog post tags
- Product categories
- Skill tags
- Task labels
- Filter controls

Please use modern React patterns, proper TypeScript typing, and Tailwind CSS for styling. Include example usage and documentation.
```

4. 統合コンポーネント生成プロンプト

```bash
Create a comprehensive UI component library page that demonstrates:

1. Button variations with:
   - Different styles and states
   - Loading examples
   - Icon integration
   - Size variations
   - Accessibility features

2. Badge examples showing:
   - Status indicators
   - Count badges
   - Notification dots
   - Color variations

3. Tag implementations for:
   - Content categorization
   - Filter controls
   - Tag management
   - Interactive selection

The page should be a demo/showcase page with:
- Clean, modern design
- Interactive examples
- Code snippets for each component
- Proper documentation
- Responsive layout
- Dark mode support

Please use Next.js, Tailwind CSS, and shadcn/ui. Make it visually impressive and highly functional.
```

:::

これでv0で効果的なコンポーネントを生成するためのプロンプト設計を学びました。

## 🚀 ベストプラクティスとパフォーマンス

ボタン、バッジ、タグコンポーネントを実装する際のベストプラクティスとパフォーマンス最適化テクニックを学びましょう。

### コンポーネント設計のベストプラクティス

:::note コンポーネント設計の原則

良いコンポーネント設計は、再利用性、保守性、パフォーマンスのバランスが重要です。Propsの設計、状態管理、スタイリングの分離、アクセシビリティ対応など、様々な要素を考慮する必要があります。

:::

### 最適化されたコンポーネントを実装してみよう

パフォーマンスを考慮したコンポーネント実装を試してみましょう。

:::step

1. メモ化されたコンポーネントの実装

```tsx
import React, { memo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// 高コストな計算を避けるためのメモ化
export const MemoizedButton = memo(function MemoizedButton({
  onClick,
  children,
  variant = "default",
  size = "default",
  disabled = false,
  loading = false,
}: {
  onClick: () => void
  children: React.ReactNode
  variant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  disabled?: boolean
  loading?: boolean
}) {
  // コールバックのメモ化
  const handleClick = useCallback(() => {
    if (!disabled && !loading) {
      onClick()
    }
  }, [onClick, disabled, loading])

  return (
    <Button
      variant={variant}
      size={size}
      disabled={disabled || loading}
      onClick={handleClick}
    >
      {loading ? "Loading..." : children}
    </Button>
  )
})

// タグの最適化された実装
export interface OptimizedTag {
  id: string
  label: string
  color: string
  count?: number
}

interface OptimizedTagProps {
  tag: OptimizedTag
  isSelected: boolean
  onToggle: (tagId: string) => void
  className?: string
}

export const OptimizedTag = memo(function OptimizedTag({
  tag,
  isSelected,
  onToggle,
  className = "",
}: OptimizedTagProps) {
  const handleClick = useCallback(() => {
    onToggle(tag.id)
  }, [tag.id, onToggle])

  return (
    <Badge
      variant={isSelected ? "default" : "outline"}
      className={`
        cursor-pointer transition-colors
        ${isSelected ? "bg-primary text-primary-foreground" : "hover:bg-accent"}
        ${className}
      `}
      onClick={handleClick}
    >
      {tag.label}
      {tag.count && (
        <span className="ml-1 text-xs opacity-70">({tag.count})</span>
      )}
    </Badge>
  )
})

// 仮想化されたタグリスト
import { FixedSizeList as List } from "react-window"

interface VirtualizedTagListProps {
  tags: OptimizedTag[]
  selectedTagIds: string[]
  onTagToggle: (tagId: string) => void
  height: number
  itemSize: number
}

export function VirtualizedTagList({
  tags,
  selectedTagIds,
  onTagToggle,
  height,
  itemSize,
}: VirtualizedTagListProps) {
  const Row = React.memo(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const tag = tags[index]
    const isSelected = selectedTagIds.includes(tag.id)

    return (
      <div style={style}>
        <OptimizedTag
          tag={tag}
          isSelected={isSelected}
          onToggle={onTagToggle}
        />
      </div>
    )
  })

  return (
    <List
      height={height}
      itemCount={tags.length}
      itemSize={itemSize}
      width="100%"
    >
      {Row}
    </List>
  )
}
```

2. 状態管理の最適化

```tsx
import { useState, useCallback, useMemo } from "react"

interface TagState {
  tags: OptimizedTag[]
  selectedIds: Set<string>
}

// カスタムフックによる状態管理の最適化
export function useOptimizedTagState(initialTags: OptimizedTag[]) {
  const [state, setState] = useState<TagState>({
    tags: initialTags,
    selectedIds: new Set(),
  })

  const toggleTag = useCallback((tagId: string) => {
    setState(prev => {
      const newSelectedIds = new Set(prev.selectedIds)
      if (newSelectedIds.has(tagId)) {
        newSelectedIds.delete(tagId)
      } else {
        newSelectedIds.add(tagId)
      }
      return { ...prev, selectedIds: newSelectedIds }
    })
  }, [])

  const clearSelection = useCallback(() => {
    setState(prev => ({ ...prev, selectedIds: new Set() }))
  }, [])

  const selectAll = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedIds: new Set(prev.tags.map(tag => tag.id)),
    }))
  }, [])

  const getSelectedTags = useCallback(() => {
    return state.tags.filter(tag => state.selectedIds.has(tag.id))
  }, [state.tags, state.selectedIds])

  const isSelected = useCallback((tagId: string) => {
    return state.selectedIds.has(tagId)
  }, [state.selectedIds])

  // メモ化された計算値
  const selectedCount = useMemo(() => state.selectedIds.size, [state.selectedIds.size])
  const totalCount = useMemo(() => state.tags.length, [state.tags.length])

  return {
    tags: state.tags,
    selectedCount,
    totalCount,
    toggleTag,
    clearSelection,
    selectAll,
    getSelectedTags,
    isSelected,
  }
}
```

3. パフォーマンスモニタリングの実装

```tsx
import { useEffect, useRef } from "react"

// コンポーネントのレンダリング時間を計測するフック
export function useRenderTime(componentName: string) {
  const renderCount = useRef(0)
  const lastRenderTime = useRef<number | null>(null)

  useEffect(() => {
    renderCount.current += 1
    const now = performance.now()

    if (lastRenderTime.current) {
      const renderTime = now - lastRenderTime.current
      console.log(`${componentName} rendered #${renderCount.current}: ${renderTime.toFixed(2)}ms`)
    }

    lastRenderTime.current = now
  })

  return { renderCount: renderCount.current }
}

// 使用例
export function PerformanceMonitoredTagGroup({ tags }: { tags: OptimizedTag[] }) {
  useRenderTime("TagGroup")

  const { toggleTag, isSelected } = useOptimizedTagState(tags)

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map(tag => (
        <OptimizedTag
          key={tag.id}
          tag={tag}
          isSelected={isSelected(tag.id)}
          onToggle={toggleTag}
        />
      ))}
    </div>
  )
}
```

:::

これでパフォーマンスを最適化したコンポーネント実装を学びました。

## まとめ

このページでは、ボタン、バッジ、タグコンポーネントの実装について学びました。v0で生成したコンポーネントを基に、実践的なカスタマイズと最適化の手法を習得しました。

:::note 要点のまとめ

- ボタンコンポーネントは様々なバリエーションと状態をサポートし、ユーザー操作の基本要素
- バッジコンポーネントは状態表示や通知に使用され、視覚的な情報伝達に効果的
- タグコンポーネントはフィルタリングやカテゴリ表示に使用され、インタラクティブな機能を実装
- アクセシビリティ対応はすべてのコンポーネントに必須で、キーボード操作やスクリーンリーダー対応を実装
- パフォーマンス最適化により、大量のコンポーネントを効率的にレンダリング可能
- v0プロンプトの設計により、高品質なコンポーネントコードを生成可能

:::

これらの基本コンポーネントは、より複雑なUIを構築するための基礎となります。次は[フォーム（react-hook-form + zod）](./forms-rhf-zod.md)を学び、データ入力とバリデーションの実装方法を習得していきましょう。

## 関連リンク

- [shadcn/ui Buttonコンポーネント](https://ui.shadcn.com/docs/components/button)
- [shadcn/ui Badgeコンポーネント](https://ui.shadcn.com/docs/components/badge)
- [Tailwind CSSボタンデザイン](https://tailwindcomponents.com/component/buttons)
- [Reactアクセシビリティガイド](https://react.dev/learn/accessibility)
- [WAI-ARIAオーサリングプラクティス](https://www.w3.org/WAI/ARIA/apg/)
- [Reactパフォーマンス最適化](https://react.dev/learn/render-and-commit)

## さらに深く学習したい方へ

このコンテンツは、v0とReactコンポーネント開発の基礎を学ぶための導入編です。より深く学習したい方には、以下の研修プログラムをおすすめします：

- **v0実践コース**: プロンプト設計から本番環境へのデプロイまで
- **Reactデザインシステム構築**: エンタープライズ向けコンポーネント開発
- **アクセシビリティ実践講座**: 包括的UI開発の専門知識
- **パフォーマンス最適化コース**: 高速なReactアプリケーション開発

詳細はお問い合わせください。