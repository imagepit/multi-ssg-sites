---
title: "shadcn/uiのカスタマイズとプリセット運用 | v0コンポーネント拡張"
slug: shadcn-customization
status: publish
post_type: page
seo_keywords: "v0, shadcn/ui, カスタマイズ, プリセット, コンポーネント, 拡張"
seo_description: "v0でshadcn/uiコンポーネントをカスタマイズする方法を学びます。テーマカスタマイズ、コンポーネント拡張、プリセット管理の実践的な手法を解説します。"
tags: ["v0", "shadcn/ui", "カスタマイズ", "コンポーネント", "UI", "拡張"]
image: "/images/v0/shadcn-customization.png"
parent: "designsystem-ops"
---

## 🎛️ shadcn/uiをカスタマイズして独自コンポーネントを作ろう

shadcn/uiは、Radix UIをベースにした再利用可能なコンポーネントライブラリです。v0と組み合わせることで、AIが生成するコンポーネントの品質を大幅に向上させることができます。このセクションでは、shadcn/uiのカスタマイズ方法を学びます。

### このページで学べること

:::note

- **shadcn/uiの基本**: コンポーネントライブラリの概要と利点
- **テーマカスタマイズ**: プロジェクトに合わせたテーマの設定方法
- **コンポーネント拡張**: 既存コンポーネントのカスタマイズと拡張
- **プリセット管理**: チームで共有するコンポーネント設定の管理
- **v0との連携**: AI生成コンポーネントの品質向上テクニック
- **ベストプラクティス**: 保守性の高いコンポーネント設計の原則

:::

## shadcn/uiとは

shadcn/uiは、Tailwind CSSとRadix UIをベースにしたコンポーネントライブラリです。特徴として、各コンポーネントが独立してインストールでき、プロジェクトのニーズに合わせてカスタマイズできる点が挙げられます。

:::note shadcn/uiの特徴

- **コピー＆ペースト方式**: コンポーネントのコードを直接コピーして使用
- **完全なカスタマイズ性**: スタイリングや動作を自由に変更可能
- **アクセシビリティ**: Radix UIベースで高いアクセシビリティを確保
- **TypeScript対応**: 型安全なコンポーネントを提供
- **軽量**: 必要なコンポーネントのみをインストール可能

:::

## 基本的なセットアップ

まずはshadcn/uiをプロジェクトにセットアップします。v0プロジェクトでは、適切な設定を行うことでAIがより良いコンポーネントを生成できるようになります。

### インストールと初期設定

shadcn/uiのインストールと基本設定を行います。

```bash
# shadcn/uiの初期化
npx shadcn-ui@latest init

# コンポーネントの追加
npx shadcn-ui@latest add button card input label
```

### 基本的なセットアップを動かして確認してみよう

実際にshadcn/uiをセットアップして動作確認してみましょう。

:::step

1. プロジェクトの初期化

新しいNext.jsプロジェクトを作成し、shadcn/uiを初期化します。

```bash
# プロジェクトの作成
npx create-next-app@latest my-v0-project --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# プロジェクトディレクトリに移動
cd my-v0-project

# shadcn/uiの初期化
npx shadcn-ui@latest init
```

2. 設定ファイルの確認

生成された`components.json`ファイルを確認します。

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

3. 基本コンポーネントの追加

ボタン、カード、入力フォームなどの基本コンポーネントを追加します。

```bash
npx shadcn-ui@latest add button card input label form
```

4. コンポーネントの使用例

追加したコンポーネントを使用したサンプルコードを作成します。

```jsx
// src/app/page.tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Home() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">shadcn/ui デモ</h1>
        <p className="text-lg text-muted-foreground">
          v0とshadcn/uiを組み合わせたコンポーネント例
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>基本コンポーネント</CardTitle>
          <CardDescription>
            shadcn/uiの基本コンポーネントを使用した例
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">名前</Label>
            <Input id="name" placeholder="名前を入力" />
          </div>
          <div className="flex gap-2">
            <Button>プライマリ</Button>
            <Button variant="secondary">セカンダリ</Button>
            <Button variant="outline">アウトライン</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

5. v0でコンポーネントを生成

v0に以下のプロンプトを入力して、shadcn/uiを使用したコンポーネントを生成します。

```
Create a user profile card component using shadcn/ui components. Include user avatar, name, email, and action buttons with proper styling.
```

6. 生成結果の確認

v0が生成したコードが、shadcn/uiのコンポーネントを正しく使用しているか確認します。

:::

## テーマのカスタマイズ

shadcn/uiでは、CSS変数を使用してテーマをカスタマイズできます。プロジェクトのブランドに合わせて色やスタイルを調整することで、一貫性のあるUIを実現できます。

### CSS変数の設定

CSS変数を定義して、プロジェクト全体のテーマをカスタマイズします。

```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 84% 4.9%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 94.1%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### Tailwind設定のカスタマイズ

Tailwindの設定ファイルをカスタマイズして、shadcn/uiのスタイルを調整します。

```javascript
// tailwind.config.ts
import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
```

### テーマカスタマイズを動かして確認してみよう

テーマカスタマイズを実際に試してみましょう。

:::step

1. ブランドカラーの設定

プロジェクトのブランドカラーを設定します。

```css
/* src/app/globals.css にカスタムカラーを追加 */
:root {
  /* 既存の変数... */

  /* カスタムブランドカラー */
  --brand: 240 5.9% 10%;
  --brand-foreground: 0 0% 98%;

  /* 既存のprimaryをbrandに変更 */
  --primary: var(--brand);
  --primary-foreground: var(--brand-foreground);
}
```

2. カスタムボタンコンポーネントの作成

ブランドカラーを使用したカスタムボタンを作成します。

```jsx
// src/components/ui/custom-button.tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        brand: "bg-brand text-brand-foreground hover:bg-brand/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

3. カスタムテーマの適用

作成したカスタムボタンを使用して、テーマが正しく適用されているか確認します。

```jsx
// src/components/theme-showcase.tsx
import { Button } from "@/components/ui/button"

export default function ThemeShowcase() {
  return (
    <div className="p-8 space-y-6">
      <h2 className="text-2xl font-bold">カスタムテーマのデモ</h2>
      <div className="flex flex-wrap gap-4">
        <Button>デフォルト</Button>
        <Button variant="secondary">セカンダリ</Button>
        <Button variant="outline">アウトライン</Button>
        <Button variant="ghost">ゴースト</Button>
        <Button variant="brand">ブランド</Button>
      </div>
    </div>
  );
}
```

4. v0でカスタムテーマコンポーネントを生成

```
Create a component showcase that demonstrates different button variants including a custom brand variant using our theme customization.
```

5. 生成結果の確認

v0が生成したコードが、カスタムテーマを正しく使用しているか確認します。

:::

## コンポーネントの拡張

shadcn/uiの最大の利点は、既存のコンポーネントを拡張して独自の機能を追加できる点です。プロジェクトの要件に合わせてコンポーネントをカスタマイズします。

### 既存コンポーネントの拡張例

既存のボタンコンポーネントを拡張して、ローディング状態を追加する例です。

```jsx
// src/components/ui/loading-button.tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </Comp>
    )
  }
)
LoadingButton.displayName = "LoadingButton"

export { LoadingButton, buttonVariants }
```

### カスタムコンポーネントの作成

複数のshadcn/uiコンポーネントを組み合わせて、より複雑なカスタムコンポーネントを作成します。

```jsx
// src/components/user-profile-card.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface UserProfileCardProps {
  name: string
  email: string
  avatar?: string
  role: string
  status: 'active' | 'inactive'
  onEdit?: () => void
  onDelete?: () => void
}

export function UserProfileCard({
  name,
  email,
  avatar,
  role,
  status,
  onEdit,
  onDelete
}: UserProfileCardProps) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="text-lg">
              {name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        </div>
        <CardTitle className="text-xl">{name}</CardTitle>
        <CardDescription>{email}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">役割:</span>
          <Badge variant="secondary">{role}</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">状態:</span>
          <Badge variant={status === 'active' ? 'default' : 'destructive'}>
            {status === 'active' ? 'アクティブ' : '非アクティブ'}
          </Badge>
        </div>
        <Separator />
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onEdit}
          >
            編集
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            onClick={onDelete}
          >
            削除
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
```

### コンポーネント拡張を動かして確認してみよう

コンポーネント拡張を実際に試してみましょう。

:::step

1. ローディングボタンの作成

先ほどのローディングボタンコンポーネントを作成します。

```bash
# 必要なパッケージのインストール
npm install lucide-react

# コンポーネントファイルの作成
touch src/components/ui/loading-button.tsx
```

2. ローディングボタンの実装

ローディングボタンコンポーネントを実装します。

```jsx
// src/components/ui/loading-button.tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </Comp>
    )
  }
)
LoadingButton.displayName = "LoadingButton"

export { LoadingButton, buttonVariants }
```

3. ローディングボタンのデモ

ローディングボタンを使用したデモコンポーネントを作成します。

```jsx
// src/components/loading-button-demo.tsx
'use client'

import { useState } from "react"
import { LoadingButton } from "@/components/ui/loading-button"

export default function LoadingButtonDemo() {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    setIsLoading(true)
    // 2秒間の処理をシミュレート
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
  }

  return (
    <div className="p-8 space-y-6">
      <h2 className="text-2xl font-bold">ローディングボタンのデモ</h2>
      <div className="space-y-4">
        <LoadingButton
          loading={isLoading}
          onClick={handleClick}
        >
          {isLoading ? '処理中...' : 'クリックしてテスト'}
        </LoadingButton>

        <LoadingButton
          variant="outline"
          loading={isLoading}
          onClick={handleClick}
        >
          {isLoading ? '処理中...' : 'アウトライン版'}
        </LoadingButton>
      </div>
    </div>
  )
}
```

4. v0で拡張コンポーネントを生成

```
Create a form submission component with loading states using our custom loading button component.
```

5. 生成結果の確認

v0が生成したコードが、拡張コンポーネントを正しく使用しているか確認します。

:::

## プリセット管理

チームで開発する場合、コンポーネントの設定を標準化することが重要です。プリセット機能を使用して、共通のコンポーネント設定を管理します。

### コンポーネントプリセットの作成

よく使用するコンポーネントの組み合わせをプリセットとして定義します。

```jsx
// src/components/presets/form-card.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LoadingButton } from "@/components/ui/loading-button"

interface FormCardProps {
  title: string
  description?: string
  children: React.ReactNode
  onSubmit?: () => Promise<void>
  submitText?: string
  cancelText?: string
  onCancel?: () => void
  loading?: boolean
}

export function FormCard({
  title,
  description,
  children,
  onSubmit,
  submitText = "保存",
  cancelText = "キャンセル",
  onCancel,
  loading = false
}: FormCardProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (onSubmit) {
      await onSubmit()
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {children}
          <div className="flex justify-end gap-4 pt-4 border-t">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                {cancelText}
              </Button>
            )}
            <LoadingButton type="submit" loading={loading}>
              {submitText}
            </LoadingButton>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
```

### プリセットの使用例

作成したプリセットを使用して、一貫性のあるフォームを作成します。

```jsx
// src/components/user-form.tsx
import { FormCard } from "@/components/presets/form-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export function UserForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    // APIコールなどをシミュレート
    await new Promise(resolve => setTimeout(resolve, 2000))
    setLoading(false)
    console.log("Form submitted:", { name, email })
  }

  return (
    <FormCard
      title="ユーザー情報の編集"
      description="ユーザーの基本情報を更新します"
      onSubmit={handleSubmit}
      loading={loading}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">名前</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="名前を入力"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">メールアドレス</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="メールアドレスを入力"
          />
        </div>
      </div>
    </FormCard>
  )
}
```

### プリセット管理を動かして確認してみよう

プリセット管理を実際に試してみましょう。

:::step

1. プリセットコンポーネントの作成

フォームカードプリセットを作成します。

```jsx
// src/components/presets/form-card.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LoadingButton } from "@/components/ui/loading-button"

interface FormCardProps {
  title: string
  description?: string
  children: React.ReactNode
  onSubmit?: () => Promise<void>
  submitText?: string
  cancelText?: string
  onCancel?: () => void
  loading?: boolean
}

export function FormCard({
  title,
  description,
  children,
  onSubmit,
  submitText = "保存",
  cancelText = "キャンセル",
  onCancel,
  loading = false
}: FormCardProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (onSubmit) {
      await onSubmit()
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {children}
          <div className="flex justify-end gap-4 pt-4 border-t">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                {cancelText}
              </Button>
            )}
            <LoadingButton type="submit" loading={loading}>
              {submitText}
            </LoadingButton>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
```

2. ユーザーフォームの作成

プリセットを使用したユーザーフォームを作成します。

```jsx
// src/components/user-form.tsx
import { FormCard } from "@/components/presets/form-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export function UserForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    // APIコールなどをシミュレート
    await new Promise(resolve => setTimeout(resolve, 2000))
    setLoading(false)
    console.log("Form submitted:", { name, email })
  }

  return (
    <FormCard
      title="ユーザー情報の編集"
      description="ユーザーの基本情報を更新します"
      onSubmit={handleSubmit}
      loading={loading}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">名前</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="名前を入力"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">メールアドレス</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="メールアドレスを入力"
          />
        </div>
      </div>
    </FormCard>
  )
}
```

3. v0でプリセットコンポーネントを生成

```
Create a user registration form using our FormCard preset with proper validation and loading states.
```

4. 生成結果の確認

v0が生成したコードが、プリセットを正しく使用しているか確認します。

:::

## v0との連携

v0とshadcn/uiを連携させることで、AIが生成するコンポーネントの品質を大幅に向上させることができます。適切な設定とプロンプト設計が重要です。

### v0プロンプトの最適化

v0にshadcn/uiを使用したコンポーネントを生成させるためのプロンプト設計のコツを学びます。

#### 効果的なプロンプトの例

```
# 基本的なコンポーネント生成
Create a user profile card using shadcn/ui components. Include:
- Avatar component for user image
- Card component with proper header and content
- Badge component for user status
- Button components for actions
- Proper spacing and responsive design

# 複雑なコンポーネント生成
Create a data table component using shadcn/ui with:
- Table component with sortable headers
- Pagination controls
- Search and filter functionality
- Loading states for async operations
- Responsive design for mobile devices

# フォームコンポーネント生成
Create a multi-step form using shadcn/ui with:
- Form validation using zod
- Progress indicator
- Proper error handling
- Loading states on submission
- Accessible form controls
```

### v0連携のベストプラクティス

v0とshadcn/uiを効果的に連携させるためのベストプラクティスを学びます。

#### 設定ファイルの準備

v0がプロジェクトの設定を理解できるように、適切な設定ファイルを用意します。

```json
// .v0/config.json
{
  "framework": "nextjs",
  "styling": "tailwind",
  "components": "shadcn/ui",
  "typescript": true,
  "accessibility": true,
  "theme": {
    "colors": {
      "primary": "hsl(var(--primary))",
      "secondary": "hsl(var(--secondary))",
      "accent": "hsl(var(--accent))"
    },
    "spacing": "tailwind-default",
    "typography": "inter"
  }
}
```

#### コンポーネントガイドラインの作成

チームで使用するコンポーネントのガイドラインを作成します。

```markdown
# shadcn/ui コンポーネントガイドライン

## 基本原則
- 常にshadcn/uiのコンポーネントを優先的に使用
- カスタムスタイルはCSS変数を使用
- アクセシビリティを確保
- レスポンシブデザインを考慮

## コンポーネント使用例
- ボタン: `<Button>` を使用し、variantプロパティでスタイルを制御
- フォーム: `<Form>` コンポーネントとバリデーションを組み合わせ
- データ表示: `<Table>`, `<Card>`, `<Badge>` を適切に使用
```

### v0連携を動かして確認してみよう

v0との連携を実際に試してみましょう。

:::step

1. プロジェクト設定の確認

プロジェクトにshadcn/uiが正しく設定されているか確認します。

```bash
# shadcn/uiの設定確認
cat components.json

# インストール済みコンポーネントの確認
ls -la src/components/ui/
```

2. v0プロンプトの準備

効果的なプロンプトを準備します。

```
# ダッシュボードコンポーネントの生成
Create a dashboard overview component using shadcn/ui with:
- Grid layout with responsive cards
- Statistics cards with icons and trends
- Recent activity list
- Quick action buttons
- Loading states for data fetching
- Proper dark mode support
```

3. v0でコンポーネントを生成

準備したプロンプトをv0に入力してコンポーネントを生成します。

4. 生成結果の検証

生成されたコンポーネントが、shadcn/uiのベストプラクティスに従っているか検証します。

- コンポーネントが正しくインポートされているか
- スタイリングがCSS変数を使用しているか
- アクセシビリティが確保されているか
- レスポンシブデザインが考慮されているか

5. 必要に応じて修正

生成されたコードを手動で修正し、品質を向上させます。

:::

## まとめ

shadcn/uiのカスタマイズは、v0を使った開発プロジェクトの品質を大幅に向上させる重要なスキルです。適切なカスタマイズにより、以下のメリットが得られます：

:::note shadcn/uiカスタマイズのベストプラクティス

- **一貫性**: プロジェクト全体で統一されたコンポーネントを実現
- **保守性**: コンポーネントの変更が簡単に反映可能
- **拡張性**: プロジェクトの要件に合わせて柔軟に拡張可能
- **チーム開発**: プリセット機能でチーム全体の品質を維持
- **AI連携**: v0が高品質なコンポーネントを生成

:::

## 関連リンク

- [shadcn/ui公式ドキュメント](https://ui.shadcn.com/)
- [Radix UIドキュメント](https://www.radix-ui.com/)
- [class-variance-authority](https://cva.style/)
- [Tailwind CSS設定ガイド](https://tailwindcss.com/docs/configuration)

## さらに深く学習したい方へ

v0とshadcn/uiの実践的なスキルを体系的に学びたい方は、弊社の研修プログラムをご利用ください。実際のプロジェクトを通じて、プロフェッショナルな開発スキルを習得できます。