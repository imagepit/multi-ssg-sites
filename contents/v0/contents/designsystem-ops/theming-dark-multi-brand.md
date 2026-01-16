---
title: "テーマ管理とダークモード | v0マルチブランド対応"
slug: theming-dark-multi-brand
status: publish
post_type: page
seo_keywords: "v0, テーマ, ダークモード, マルチブランド, カスタマイズ, デザインシステム"
seo_description: "v0でテーマ管理とダークモードを実装する方法を学びます。マルチブランド対応、ユーザー設定の永続化、アクセシビリティの考慮など実践的な手法を解説します。"
tags: ["v0", "テーマ", "ダークモード", "マルチブランド", "CSS", "アクセシビリティ"]
image: "/images/v0/theming-dark-multi-brand.png"
parent: "designsystem-ops"
---

## 🌓 テーマ管理で魅力的なUI体験を提供しよう

現代のWebアプリケーションでは、ダークモード対応やマルチブランド対応が標準機能となっています。v0を使った開発では、適切なテーマ管理を実装することで、ユーザーに快適なUI体験を提供できます。このセクションでは、テーマ管理の実装方法を学びます。

### このページで学べること

:::note

- **テーマシステムの基礎**: CSS変数とJavaScriptによるテーマ管理
- **ダークモードの実装**: ユーザー設定に基づいたテーマ切り替え
- **マルチブランド対応**: 複数のブランドを動的に切り替える方法
- **テーマの永続化**: ユーザー設定の保存と復元
- **アクセシビリティ**: テーマ切り替えのアクセシビリティ対応
- **v0連携**: AI生成コンポーネントのテーマ対応

:::

## テーマシステムの基礎

テーマシステムは、CSS変数（カスタムプロパティ）を使用して実装するのが現代的なアプローチです。CSS変数を使用することで、テーマの切り替えを動的に行うことができます。

### CSS変数によるテーマ定義

CSS変数を使用して、ライトモードとダークモードのテーマを定義します。

```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* カラーシステム */
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

    /* スペーシング */
    --radius: 0.5rem;

    /* タイポグラフィ */
    --font-sans: 'Inter', 'Noto Sans JP', sans-serif;
    --font-mono: 'JetBrains Mono', 'SF Mono', monospace;
  }

  /* ダークモード */
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

  /* ブランドA */
  .brand-a {
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
  }

  /* ブランドB */
  .brand-b {
    --primary: 142.1 76.2% 36.3%;
    --primary-foreground: 355.7 100% 97.3%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 142.1 76.2% 36.3%;
  }

  /* ブランドC */
  .brand-c {
    --primary: 262.1 83.3% 57.8%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 262.1 83.3% 57.8%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-family: var(--font-sans);
  }
}
```

### Tailwind設定の更新

Tailwindの設定ファイルを更新して、CSS変数を使用するように設定します。

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
  theme: {
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
      fontFamily: {
        sans: ["var(--font-sans)", ...require("tailwindcss/defaultTheme").fontFamily.sans],
        mono: ["var(--font-mono)", ...require("tailwindcss/defaultTheme").fontFamily.mono],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
```

### テーマシステムを動かして確認してみよう

基本的なテーマシステムを実際に試してみましょう。

:::step

1. CSS変数の設定

`src/app/globals.css`に先ほどのCSS変数設定を追加します。

2. Tailwind設定の更新

`tailwind.config.ts`を更新して、CSS変数を使用するように設定します。

3. サンプルコンポーネントの作成

テーマシステムをテストするためのサンプルコンポーネントを作成します。

```jsx
// src/components/theme-test.tsx
export default function ThemeTest() {
  return (
    <div className="min-h-screen p-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">テーマシステムテスト</h1>
        <p className="text-lg text-muted-foreground">
          現在のテーマ設定を確認するコンポーネント
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-card border border-border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">カードサンプル</h2>
          <p className="text-muted-foreground mb-4">
            これはカードコンポーネントのサンプルです。
          </p>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded">
            ボタン
          </button>
        </div>

        <div className="p-6 bg-destructive text-destructive-foreground rounded-lg">
          <h2 className="text-xl font-semibold mb-4">デストラクティブ</h2>
          <p className="opacity-90 mb-4">
            これはデストラクティブな配色のサンプルです。
          </p>
          <button className="bg-background text-foreground px-4 py-2 rounded">
            セカンダリ
          </button>
        </div>

        <div className="p-6 bg-muted text-muted-foreground rounded-lg">
          <h2 className="text-xl font-semibold mb-4">ミューテッド</h2>
          <p className="mb-4">
            これはミューテッドな配色のサンプルです。
          </p>
          <button className="bg-accent text-accent-foreground px-4 py-2 rounded">
            アクセント
          </button>
        </div>
      </div>
    </div>
  );
}
```

4. v0でテーマ対応コンポーネントを生成

```
Create a theme-aware dashboard component using CSS variables that automatically adapts to light/dark mode with proper color contrast.
```

5. 生成結果の確認

v0が生成したコードが、テーマシステムに対応しているか確認します。

:::

## ダークモードの実装

ダークモードは、ユーザーの視覚的な快適性を向上させる重要な機能です。適切な実装により、ユーザーは好みに合わせてテーマを切り替えることができます。

### テーマプロバイダーの作成

React Contextを使用して、テーマの状態を管理するプロバイダーを作成します。

```jsx
// src/components/theme-provider.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'v0-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}
```

### テーマ切り替えコンポーネントの作成

ユーザーがテーマを切り替えるためのコンポーネントを作成します。

```jsx
// src/components/theme-toggle.tsx
'use client'

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">テーマ切り替え</span>
    </Button>
  )
}
```

### テーマ切り替えを動かして確認してみよう

ダークモードの実装を実際に試してみましょう。

:::step

1. 必要なパッケージのインストール

```bash
npm install lucide-react
```

2. テーマプロバイダーの作成

`src/components/theme-provider.tsx`を作成します。

3. テーマ切り替えコンポーネントの作成

`src/components/theme-toggle.tsx`を作成します。

4. レイアウトファイルの更新

`app/layout.tsx`を更新して、テーマプロバイダーを追加します。

```jsx
// app/layout.tsx
import { ThemeProvider } from "@/components/theme-provider"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          defaultTheme="system"
          storageKey="v0-ui-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

5. テーマ切り替えのデモ

テーマ切り替え機能をテストするデモページを作成します。

```jsx
// src/app/theme-demo/page.tsx
import { ThemeToggle } from "@/components/theme-toggle"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ThemeDemo() {
  return (
    <div className="min-h-screen p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">テーマ切り替えデモ</h1>
          <p className="text-lg text-muted-foreground">
            ダークモードとライトモードを切り替えてみましょう
          </p>
        </div>
        <ThemeToggle />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>プライマリカラー</CardTitle>
            <CardDescription>
              現在のテーマでのプライマリカラー
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-primary text-primary-foreground p-4 rounded">
              プライマリ
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>セカンダリカラー</CardTitle>
            <CardDescription>
              現在のテーマでのセカンダリカラー
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-secondary text-secondary-foreground p-4 rounded">
              セカンダリ
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>アクセントカラー</CardTitle>
            <CardDescription>
              現在のテーマでのアクセントカラー
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-accent text-accent-foreground p-4 rounded">
              アクセント
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

6. v0でダークモード対応コンポーネントを生成

```
Create a dark mode aware dashboard with theme toggle, charts, and cards that properly adapt to light/dark themes.
```

7. 生成結果の確認

v0が生成したコードが、ダークモードに対応しているか確認します。

:::

## マルチブランド対応

SaaSアプリケーションやホワイトラベルソリューションでは、複数のブランドに対応する必要があります。動的なブランド切り替え機能を実装します。

### ブランドコンテキストの作成

ブランド情報を管理するためのコンテキストを作成します。

```jsx
// src/components/brand-provider.tsx
'use client'

import { createContext, useContext, useState, useEffect } from 'react'

type Brand = 'default' | 'brand-a' | 'brand-b' | 'brand-c'

interface BrandConfig {
  name: string
  primaryColor: string
  secondaryColor: string
  logo: string
}

const brandConfigs: Record<Brand, BrandConfig> = {
  default: {
    name: 'Default',
    primaryColor: '221.2 83.2% 53.3%',
    secondaryColor: '210 40% 96%',
    logo: '/logo-default.svg'
  },
  'brand-a': {
    name: 'Brand A',
    primaryColor: '221.2 83.2% 53.3%',
    secondaryColor: '210 40% 96%',
    logo: '/logo-brand-a.svg'
  },
  'brand-b': {
    name: 'Brand B',
    primaryColor: '142.1 76.2% 36.3%',
    secondaryColor: '210 40% 96%',
    logo: '/logo-brand-b.svg'
  },
  'brand-c': {
    name: 'Brand C',
    primaryColor: '262.1 83.3% 57.8%',
    secondaryColor: '210 40% 96%',
    logo: '/logo-brand-c.svg'
  }
}

type BrandProviderProps = {
  children: React.ReactNode
  defaultBrand?: Brand
}

type BrandProviderState = {
  brand: Brand
  brandConfig: BrandConfig
  setBrand: (brand: Brand) => void
}

const initialState: BrandProviderState = {
  brand: 'default',
  brandConfig: brandConfigs.default,
  setBrand: () => null,
}

const BrandProviderContext = createContext<BrandProviderState>(initialState)

export function BrandProvider({
  children,
  defaultBrand = 'default',
  ...props
}: BrandProviderProps) {
  const [brand, setBrand] = useState<Brand>(defaultBrand)
  const [brandConfig, setBrandConfig] = useState<BrandConfig>(brandConfigs[defaultBrand])

  useEffect(() => {
    const root = window.document.documentElement

    // 既存のブランドクラスを削除
    root.classList.remove('brand-a', 'brand-b', 'brand-c')

    // 新しいブランドクラスを追加
    if (brand !== 'default') {
      root.classList.add(brand)
    }

    // ブランド設定を更新
    setBrandConfig(brandConfigs[brand])
  }, [brand])

  const value = {
    brand,
    brandConfig,
    setBrand: (brand: Brand) => {
      setBrand(brand)
    },
  }

  return (
    <BrandProviderContext.Provider {...props} value={value}>
      {children}
    </BrandProviderContext.Provider>
  )
}

export const useBrand = () => {
  const context = useContext(BrandProviderContext)

  if (context === undefined)
    throw new Error('useBrand must be used within a BrandProvider')

  return context
}
```

### ブランド切り替えコンポーネントの作成

ブランドを切り替えるためのコンポーネントを作成します。

```jsx
// src/components/brand-switcher.tsx
'use client'

import { useBrand } from "@/components/brand-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function BrandSwitcher() {
  const { brand, setBrand, brandConfig } = useBrand()

  const brands = [
    { id: 'default', name: 'Default', description: '標準ブランド' },
    { id: 'brand-a', name: 'Brand A', description: '青系ブランド' },
    { id: 'brand-b', name: 'Brand B', description: '緑系ブランド' },
    { id: 'brand-c', name: 'Brand C', description: '紫系ブランド' },
  ] as const

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>ブランド切り替え</CardTitle>
        <CardDescription>
          現在のブランド: {brandConfig.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {brands.map((brandOption) => (
            <Button
              key={brandOption.id}
              variant={brand === brandOption.id ? "default" : "outline"}
              className="h-auto p-4 flex flex-col items-start space-y-2"
              onClick={() => setBrand(brandOption.id)}
            >
              <div className="flex items-center space-x-2">
                <span className="font-medium">{brandOption.name}</span>
                {brand === brandOption.id && <Badge variant="secondary">現在</Badge>}
              </div>
              <span className="text-sm opacity-70">{brandOption.description}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
```

### マルチブランド対応を動かして確認してみよう

マルチブランド対応を実際に試してみましょう。

:::step

1. ブランドプロバイダーの作成

`src/components/brand-provider.tsx`を作成します。

2. ブランド切り替えコンポーネントの作成

`src/components/brand-switcher.tsx`を作成します。

3. レイアウトファイルの更新

`app/layout.tsx`を更新して、ブランドプロバイダーを追加します。

```jsx
// app/layout.tsx
import { ThemeProvider } from "@/components/theme-provider"
import { BrandProvider } from "@/components/brand-provider"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          defaultTheme="system"
          storageKey="v0-ui-theme"
        >
          <BrandProvider defaultBrand="default">
            {children}
          </BrandProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

4. ブランドデモページの作成

ブランド切り替え機能をテストするデモページを作成します。

```jsx
// src/app/brand-demo/page.tsx
import { BrandSwitcher } from "@/components/brand-switcher"
import { ThemeToggle } from "@/components/theme-toggle"
import { useBrand } from "@/components/brand-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function BrandDemo() {
  const { brandConfig } = useBrand()

  return (
    <div className="min-h-screen p-8 space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold">マルチブランドデモ</h1>
          <p className="text-lg text-muted-foreground">
            現在のブランド: {brandConfig.name}
          </p>
        </div>
        <div className="flex gap-2">
          <ThemeToggle />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <BrandSwitcher />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ブランドカラー</CardTitle>
              <CardDescription>
                現在のブランドのカラーパレット
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="w-full h-16 bg-primary rounded mb-2"></div>
                  <span className="text-sm">プライマリ</span>
                </div>
                <div className="text-center">
                  <div className="w-full h-16 bg-secondary rounded mb-2"></div>
                  <span className="text-sm">セカンダリ</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>コンポーネント例</CardTitle>
              <CardDescription>
                現在のブランドが適用されたコンポーネント
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded">
                  プライマリボタン
                </button>
                <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded">
                  セカンダリボタン
                </button>
              </div>
              <div className="bg-destructive text-destructive-foreground p-4 rounded">
                デストラクティブコンテンツ
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
```

5. v0でマルチブランド対応コンポーネントを生成

```
Create a multi-brand dashboard that dynamically switches between different color schemes and branding while maintaining consistent component structure.
```

6. 生成結果の確認

v0が生成したコードが、マルチブランドに対応しているか確認します。

:::

## テーマの永続化

ユーザーのテーマ設定をlocalStorageに保存することで、次回の訪問時にも同じ設定を復元できます。これにより、ユーザーエクスペリエンスが向上します。

### 設定の永続化

テーマプロバイダーとブランドプロバイダーは、すでにlocalStorageを使用して設定を保存するように実装されています。しかし、サーバーサイドレンダリング（SSR）との統合には追加の考慮が必要です。

### SSR対応の改善

サーバーサイドとクライアントサイドでテーマが一致するように、改善を実装します。

```jsx
// src/components/theme-provider.tsx（改善版）
'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
  attribute?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'v0-ui-theme',
  attribute = 'class',
  enableSystem = true,
  disableTransitionOnChange = false,
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(storageKey) as Theme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const defaultTheme = enableSystem ? 'system' : 'light'

    const _theme = stored || defaultTheme
    setTheme(_theme)
    setMounted(true)
  }, [enableSystem, storageKey])

  useEffect(() => {
    if (!mounted) return

    const root = window.document.documentElement

    root.classList.remove('light', 'dark')

    if (theme === 'system' && enableSystem) {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme, mounted, enableSystem, attribute])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
  }

  // hydrationを防ぐためにマウントされるまでレンダリングしない
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}
```

### テーマ永続化を動かして確認してみよう

テーマの永続化を実際に試してみましょう。

:::step

1. 改善版テーマプロバイダーの実装

`src/components/theme-provider.tsx`を改善版に更新します。

2. ブラウザでのテスト

ブラウザで以下の操作をテストします：

- ページをリロードしてもテーマ設定が保持されるか
- 別のタブで同じ設定が反映されるか
- システムテーマの変更に追従するか

3. 開発者ツールでの確認

開発者ツールのApplicationタブでlocalStorageの値を確認します。

4. v0で永続化対応コンポーネントを生成

```
Create a settings page with theme persistence, user preferences, and local storage integration that survives page refreshes.
```

5. 生成結果の確認

v0が生成したコードが、テーマ永続化に対応しているか確認します。

:::

## アクセシビリティの考慮

テーマ切り替え機能は、すべてのユーザーが利用できるようにアクセシビリティを考慮して実装する必要があります。

### キーボードナビゲーション

テーマ切り替えボタンをキーボードで操作できるようにします。

```jsx
// src/components/accessible-theme-toggle.tsx
'use client'

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AccessibleThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="w-9 h-9">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">テーマ切り替え</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          <span>ライト</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          <span>ダーク</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Monitor className="mr-2 h-4 w-4" />
          <span>システム</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### アナウンスメントの実装

スクリーンリーダーを使用するユーザーにテーマの変更を通知します。

```jsx
// src/components/theme-announcer.tsx
'use client'

import { useTheme } from "@/components/theme-provider"
import { useEffect } from "react"

export function ThemeAnnouncer() {
  const { theme } = useTheme()

  useEffect(() => {
    // スクリーンリーダーにテーマ変更をアナウンス
    const announcement = document.createElement('div')
    announcement.setAttribute('role', 'status')
    announcement.setAttribute('aria-live', 'polite')
    announcement.className = 'sr-only'
    announcement.textContent = `テーマが${theme === 'dark' ? 'ダークモード' : theme === 'light' ? 'ライトモード' : 'システム設定'}に変更されました`

    document.body.appendChild(announcement)

    // 少し後に削除
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }, [theme])

  return null
}
```

### アクセシビリティを動かして確認してみよう

アクセシビリティ対応を実際に試してみましょう。

:::step

1. アクセシブルなテーマ切り替えの実装

`src/components/accessible-theme-toggle.tsx`を作成します。

2. アナウンサーコンポーネントの実装

`src/components/theme-announcer.tsx`を作成します。

3. レイアウトファイルの更新

`app/layout.tsx`を更新して、アナウンサーコンポーネントを追加します。

```jsx
// app/layout.tsx
import { ThemeProvider } from "@/components/theme-provider"
import { BrandProvider } from "@/components/brand-provider"
import { ThemeAnnouncer } from "@/components/theme-announcer"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          defaultTheme="system"
          storageKey="v0-ui-theme"
        >
          <BrandProvider defaultBrand="default">
            {children}
            <ThemeAnnouncer />
          </BrandProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

4. アクセシビリティテスト

以下の方法でアクセシビリティをテストします：

- キーボードでテーマ切り替えメニューを操作できるか
- スクリーンリーダーでテーマ変更がアナウンスされるか
- 十分なコントラスト比が確保されているか

5. v0でアクセシブルなコンポーネントを生成

```
Create an accessible theme switcher with keyboard navigation, screen reader support, and proper ARIA labels.
```

6. 生成結果の確認

v0が生成したコードが、アクセシビリティに対応しているか確認します。

:::

## v0連携のベストプラクティス

v0とテーマシステムを連携させるためのベストプラクティスを学びます。

### プロンプト設計のコツ

v0にテーマ対応のコンポーネントを生成させるための効果的なプロンプト設計です。

```
# 基本的なテーマ対応コンポーネント
Create a theme-aware component using CSS variables that:
- Automatically adapts to light/dark mode
- Uses proper semantic color tokens (primary, secondary, muted, etc.)
- Maintains accessibility with proper contrast ratios
- Includes smooth transitions between theme changes

# 複雑なテーマ対応コンポーネント
Create a multi-brand dashboard component that:
- Dynamically switches between different brand themes
- Preserves user theme preferences in localStorage
- Supports both light and dark modes
- Includes responsive design for mobile devices
- Provides accessible theme switching controls

# フォームコンポーネント
Create a theme-aware form component that:
- Uses semantic color tokens for validation states
- Maintains readability in both light and dark modes
- Includes proper focus indicators for accessibility
- Supports different brand color schemes
- Preserves form state across theme changes
```

### コンポーネントガイドラインの作成

チームで使用するテーマ対応コンポーネントのガイドラインを作成します。

```markdown
# テーマ対応コンポーネントガイドライン

## 基本原則
- 常にCSS変数（カスタムプロパティ）を使用
- ハードコードされた色値は使用しない
- セマンティックなカラートークンを使用（primary, secondary, etc.）
- アクセシビリティを常に考慮

## カラートークンの使用例
```jsx
// 良い例
<div className="bg-primary text-primary-foreground">
  コンテンツ
</div>

// 悪い例
<div className="bg-blue-500 text-white">
  コンテンツ
</div>
```

## テーマ切り替えの実装
- ThemeProviderを使用してテーマ状態を管理
- useThemeフックを使用して現在のテーマにアクセス
- localStorageを使用してユーザー設定を永続化
- SSRとの統合を考慮

## マルチブランド対応
- BrandProviderを使用してブランド状態を管理
- useBrandフックを使用して現在のブランドにアクセス
- 動的なCSSクラスの切り替えを実装
```

### v0連携を動かして確認してみよう

v0との連携を実際に試してみましょう。

:::step

1. プロジェクト設定の確認

テーマプロバイダーとブランドプロバイダーが正しく設定されているか確認します。

2. v0プロンプトの準備

効果的なプロンプトを準備します。

```
Create a comprehensive admin dashboard with:
- Theme-aware sidebar navigation
- Multi-brand support with dynamic branding
- Dark/light mode toggle with persistence
- Responsive design for all screen sizes
- Accessible color contrasts and focus states
- Smooth theme transitions
- Local storage integration for user preferences
```

3. v0でコンポーネントを生成

準備したプロンプトをv0に入力してコンポーネントを生成します。

4. 生成結果の検証

生成されたコンポーネントが、テーマシステムのベストプラクティスに従っているか検証します。

- CSS変数が適切に使用されているか
- テーマ切り替えがスムーズに行われるか
- アクセシビリティが確保されているか
- レスポンシブデザインが考慮されているか

5. 必要に応じて修正

生成されたコードを手動で修正し、品質を向上させます。

:::

## まとめ

テーマ管理とマルチブランド対応は、現代のWebアプリケーションにおいて不可欠な機能です。適切な実装により、以下のメリットが得られます：

:::note テーマ管理のベストプラクティス

- **ユーザーエクスペリエンス**: ユーザーの好みに合わせたUI体験を提供
- **アクセシビリティ**: すべてのユーザーが快適に利用できる環境を構築
- **ブランド対応**: 複数のブランドに対応する柔軟なシステムを実現
- **保守性**: CSS変数を使用した一貫性のあるデザインシステム
- **パフォーマンス**: 動的なテーマ切り替えを軽量に実装

:::

## 関連リンク

- [CSSカスタムプロパティ](https://developer.mozilla.org/ja/docs/Web/CSS/Using_CSS_custom_properties)
- [Tailwind CSSダークモード](https://tailwindcss.com/docs/dark-mode)
- [アクセシビリティガイドライン](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Context API](https://react.dev/reference/react/createContext)
- [localStorage API](https://developer.mozilla.org/ja/docs/Web/API/Window/localStorage)

## さらに深く学習したい方へ

v0とテーマ管理の実践的なスキルを体系的に学びたい方は、弊社の研修プログラムをご利用ください。実際のプロジェクトを通じて、プロフェッショナルな開発スキルを習得できます。