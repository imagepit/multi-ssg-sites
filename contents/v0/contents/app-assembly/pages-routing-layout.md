---
title: ページ/ルーティング/レイアウト構造 | Next.js App Routerで構築するモダンWebアプリケーション
slug: pages-routing-layout
parent: "app-assembly"
file_path: app-assembly/pages-routing-layout
target_user: "経験2年以内のフロントエンドエンジニア"
goal: "Next.js App Routerの基本的なページ構造、ルーティング、レイアウトシステムを理解し、v0コンポーネントを統合した実践的なアプリケーション設計スキルを習得する"
status: publish
post_type: pages
seo_title: Next.js App Router完全ガイド | ページ構造とルーティング設計のベストプラクティス
seo_keywords: "Next.js, App Router, ルーティング, レイアウト, ページ構造, v0コンポーネント, React Server Components"
seo_description: Next.js App Routerを使用したページ構造とルーティング設計の包括的ガイド。v0コンポーネントを統合した実践的なアプリケーション開発手法を学びます。
handson_overview: "Todoアプリを例に、Next.js App Routerの基本的なページ構造、ルーティング、レイアウトシステムを実装するハンズオン。v0コンポーネントを統合した実践的な開発手法を習得"
---

## 🗂️ はじめに

Next.js App Routerは、React Server Componentsをベースにした新しいルーティングシステムです。このセクションでは、App Routerの基本的な概念とv0コンポーネントの統合方法を学びます。

### このページで学べる事

:::note このページで学べること

- **Next.js App Router**の基本概念とファイルベースルーティング
- **ページ構造**の設計と階層化のベストプラクティス
- **レイアウトシステム**を使った共通UIの実装
- **v0コンポーネント**をApp Routerに統合する方法
- **動的ルーティング**と静的ルーティングの使い分け

:::

## 📁 App Routerの基本概念

### App Routerとは

Next.js 13以降で導入されたApp Routerは、以下の特徴を持つ新しいルーティングシステムです。

:::note App Routerの特徴

- **React Server Components**をネイティブサポート
- **ファイルベースルーティング**による直感的なURL構造
- **ネストされたルート**と**レイアウト**の自動適用
- **サーバーサイドレンダリング**の最適化
- **パラレルルート**による高度なUIパターン

:::

### ファイル構造の基本

App Routerでは、`app`ディレクトリ以下のファイル構造が直接URLマッピングされます。

```typescript
// 基本的なファイル構造
app/
├── layout.tsx          // ルートレイアウト
├── page.tsx            // ホームページ
├── about/
│   ├── layout.tsx      // aboutページ専用レイアウト
│   └── page.tsx        // aboutページ
├── blog/
│   ├── layout.tsx      // ブログ全体のレイアウト
│   ├── page.tsx        // ブログ一覧ページ
│   └── [slug]/
│       └── page.tsx    // ブログ詳細ページ（動的ルーティング）
└── (auth)/             // グループ化（URLに影響なし）
    ├── login/
    │   └── page.tsx
    └── register/
        └── page.tsx
```

## 🏗️ レイアウトシステムの設計

### レイアウトの階層構造

レイアウトは、共通のUI要素を複数のページで共有するための仕組みです。

:::syntax レイアウトの基本構造

```typescript
// app/layout.tsx - ルートレイアウト
import { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
```

このコードは、アプリケーション全体の基本構造を定義します。`html`、`body`タグと共通のコンポーネント（Header、Footer）を設定し、各ページのコンテンツが`children`として挿入されます。

:::

### ネストされたレイアウト

特定のセクション専用のレイアウトを作成できます。

```typescript
// app/blog/layout.tsx - ブログ専用レイアウト
import { ReactNode } from 'react'

export default function BlogLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {children}
        </div>
        <aside>
          <BlogSidebar />
        </aside>
      </div>
    </div>
  )
}
```

## 🎯 v0コンポーネントの統合

### v0コンポーネントの配置

v0で生成したコンポーネントを適切な場所に配置します。

```typescript
// src/components/ui/
ui/
├── navigation/
│   ├── Header.tsx          // v0で生成したヘッダー
│   ├── Navigation.tsx      // v0で生成したナビゲーション
│   └── Breadcrumb.tsx     // v0で生成したパンくず
├── layout/
│   ├── Footer.tsx          // v0で生成したフッター
│   ├── Sidebar.tsx         // v0で生成したサイドバー
│   └── Container.tsx       // v0で生成したコンテナ
└── forms/
    ├── Input.tsx           // v0で生成した入力フィールド
    ├── Button.tsx          // v0で生成したボタン
    └── Form.tsx            // v0で生成したフォーム
```

### v0コンポーネントのカスタマイズ

v0で生成したコンポーネントをプロジェクト要件に合わせてカスタマイズします。

```typescript
// src/components/ui/navigation/Header.tsx
'use client' // インタラクティブな場合はClient Component

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

interface HeaderProps {
  logo?: string
  navigation?: Array<{ name: string; href: string }>
}

export default function Header({
  logo = 'Logo',
  navigation = []
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* ロゴ */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-gray-900">
              {logo}
            </Link>
          </div>

          {/* デスクトップナビゲーション */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* モバイルメニューボタン */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-gray-900"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* モバイルメニュー */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
```

## 🔀 動的ルーティングの実装

### 動的ルーティングの基本

動的ルーティングを使用して、ブログ記事詳細ページなどを実装します。

```typescript
// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation'

interface BlogPost {
  id: string
  title: string
  content: string
  createdAt: string
}

// モックデータ（実際にはAPIから取得）
const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Next.js App Router入門',
    content: 'Next.js App Routerについて詳しく解説します...',
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    title: 'v0コンポーネントの活用法',
    content: 'v0で生成したコンポーネントを効果的に使う方法...',
    createdAt: '2024-01-02'
  }
]

export default function BlogPostPage({
  params,
}: {
  params: { slug: string }
}) {
  const post = blogPosts.find(p => p.id === params.slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <time className="text-gray-600 mb-8 block">{post.createdAt}</time>
      <div className="prose prose-lg">
        {post.content}
      </div>
    </article>
  )
}
```

### 生成静的ページ（SSG）

動的ルートを静的に生成する場合は、`generateStaticParams`を使用します。

```typescript
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await getBlogPosts() // 実際のデータ取得関数

  return posts.map((post) => ({
    slug: post.id,
  }))
}
```

## 🎨 Todoアプリで実践してみよう

それでは、学習した内容を踏まえてTodoアプリのページ構造を設計してみましょう。

:::step

1. プロジェクトの準備

任意の場所（デスクトップなど）で`nextjs-todo-app`フォルダを作成し、VSCodeで`nextjs-todo-app`フォルダを開いてください。

```bash
mkdir nextjs-todo-app
cd nextjs-todo-app
npx create-next-app@latest . --typescript --tailwind --app
```

2. 基本的なファイル構造の作成

以下のファイル構造を作成します。

```bash
app/
├── layout.tsx              # ルートレイアウト
├── page.tsx                # ホームページ（Todo一覧）
├── about/
│   └── page.tsx            # Aboutページ
├── (auth)/
│   ├── login/
│   │   └── page.tsx        # ログインページ
│   └── register/
│       └── page.tsx        # 登録ページ
└── api/
    └── todos/
        └── route.ts        # Todo APIエンドポイント
```

3. ルートレイアウトの作成

`app/layout.tsx`を作成し、以下のコードを追加してください。

```typescript
import { ReactNode } from 'react'
import '../styles/globals.css'

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-gray-50">
        <div className="min-h-screen">
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <h1 className="text-xl font-bold text-gray-900">
                  Todoアプリ
                </h1>
                <nav className="flex space-x-4">
                  <a href="/" className="text-gray-700 hover:text-gray-900">
                    ホーム
                  </a>
                  <a href="/about" className="text-gray-700 hover:text-gray-900">
                    About
                  </a>
                </nav>
              </div>
            </div>
          </header>
          <main>
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
```

4. ホームページの作成

`app/page.tsx`を作成し、以下のコードを追加してください。

```typescript
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Next.js + v0 Todoアプリ
        </h2>
        <p className="text-gray-600 mb-8">
          App Routerとv0コンポーネントを使ったTodo管理アプリケーション
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            href="/login"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            ログイン
          </Link>
          <Link
            href="/register"
            className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
          >
            新規登録
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">シンプルな設計</h3>
          <p className="text-gray-600">
            Next.js App Routerを使ったクリーンなアーキテクチャ
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">v0コンポーネント</h3>
          <p className="text-gray-600">
            v0で生成したコンポーネントを効果的に活用
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">レスポンシブ対応</h3>
          <p className="text-gray-600">
            すべてのデバイスで快適に利用できるUI
          </p>
        </div>
      </div>
    </div>
  )
}
```

5. 開発サーバーの起動

次のコマンドを実行して開発サーバーを起動します。

```bash
npm run dev
```

6. ブラウザで動作確認

ブラウザを開き、`http://localhost:3000`にアクセスします。
ページが正しく表示されれば成功です。

7. コミット

修正した内容をコミットします。

```bash
git add .
git commit -m "Add basic page structure with App Router"
```

:::

このように、Next.js App Routerを使った基本的なページ構造を構築することができました。

## 📊 ルーティングのベストプラクティス

### パフォーマンス最適化

:::note パフォーマンス最適化のポイント

- **静的生成**：可能な限り`generateStaticParams`を使用
- **イメージ最適化**：Next.js Imageコンポーネントの活用
- **コード分割**：`React.lazy`や`dynamic import`の適切な使用
- **キャッシュ戦略**：`fetch`のオプション設定

:::

### アクセシビリティの考慮

```typescript
// アクセシビリティを考慮したナビゲーション
<nav aria-label="Main navigation">
  <ul role="menubar">
    {navigation.map((item) => (
      <li role="none" key={item.name}>
        <Link
          href={item.href}
          role="menuitem"
          className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
        >
          {item.name}
        </Link>
      </li>
    ))}
  </ul>
</nav>
```

## 🎉 まとめ

このページでは、Next.js App Routerの基本的な概念と実装方法を学びました。ページ構造、ルーティング、レイアウトシステムの設計パターンを理解し、v0コンポーネントを統合した実践的な開発手法を習得しました。

:::note 要点のまとめ

- App RouterはファイルベースルーティングとReact Server Componentsをサポート
- レイアウトシステムで共通UIを効率的に管理
- v0コンポーネントは適切にカスタマイズしてプロジェクトに統合
- 動的ルーティングで柔軟なページ構造を実現
- パフォーマンスとアクセシビリティを考慮した設計が重要

:::

次のページでは、**サーバーアクション/APIルート**について学び、バックエンド機能の実装方法を理解していきます。

[次のページ：サーバーアクション/APIルート](./server-actions-api)

## 🔗 関連リンク

- [Next.js App Routerドキュメント](https://nextjs.org/docs/app)
- [React Server Componentsドキュメント](https://react.dev/reference/rsc/server-components)
- [Next.js File-based Routing](https://nextjs.org/docs/app/building-your-application/routing/fundamentals)

## 📚 さらに深く学習したい方へ

このページで学ぶ内容は、現代のWebアプリケーション開発において重要な基礎知識です。より深く学習したい方は、以下のトピックも参照してください：

- パラレルルートとインターセプティングルート
- メタデータとSEO最適化
- ミドルウェアによるルート保護
- 大規模アプリケーションのルーティング設計