---
title: クイックスタート
slug: quickstart
parent: getting-started
status: not_started
filepath: docs/nextjs/contents/getting-started/quickstart.md
post_type: pages
target: 初学者
goal: Next.jsの基本的な使い方を実際に体験してもらい、次のレベルの学習への意欲を高める
seo_title: Next.jsクイックスタート | 10分で基本をマスター
seo_description: Next.jsの基本を10分で理解できるクイックスタートガイド。実際にアプリを作りながら学習
seo_keywords: Next.js クイックスタート, Next.js 基本, ページ作成, ルーティング
handson_overview: 基本的なページ作成、ファイルベースルーティング、コンポーネント作成、スタイリングの基本操作を確認する手順を掲載
---

## はじめに

Next.jsは、ReactベースのフルスタックWebアプリケーションフレームワークです。このクイックスタートでは、Next.jsの基本的な機能を実際に手を動かしながら体験していただきます。わずか10分で、Next.jsの核心的な概念を理解し、簡単なWebアプリケーションを作成できるようになります。

Next.jsの最大の特徴は、**ファイルベースルーティング**と**サーバーサイドレンダリング**です。従来のReactアプリケーションとは異なり、ファイルの配置だけでページのルーティングが決まり、SEOに優れたWebサイトを簡単に構築できます。

### このページで学べる事

このクイックスタートでは、Next.jsの基本的な使い方を段階的に学習します。実際にコードを書きながら、Next.jsの核心的な機能を体験していただきます。

:::note

- Next.jsプロジェクトの作成と起動方法
- ファイルベースルーティングの仕組み
- Reactコンポーネントの作成と使用
- CSSモジュールを使ったスタイリング
- ページ間のナビゲーション

:::

## Next.jsプロジェクトの作成

まず、Next.jsプロジェクトを作成して開発環境を整えましょう。Next.jsは`create-next-app`という公式ツールを使用することで、簡単にプロジェクトをセットアップできます。

:::note create-next-appとは

`create-next-app`は、Next.jsの公式プロジェクト作成ツールです。TypeScript、ESLint、Tailwind CSSなどの設定を自動で行い、すぐに開発を始められる環境を提供します。

:::

### Next.jsプロジェクトを作成してみよう

それでは、実際にNext.jsプロジェクトを作成して、基本的な動作を確認してみましょう。

:::step

1. プロジェクトディレクトリの準備

任意の場所（デスクトップなど）で`nextjs-quickstart`フォルダを作成し、そのフォルダに移動してください。

_コマンド実行_

```bash
mkdir nextjs-quickstart
cd nextjs-quickstart
```

2. Next.jsプロジェクトの作成

`create-next-app`を使用してNext.jsプロジェクトを作成します。

_コマンド実行_

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

このコマンドでは以下の設定でプロジェクトを作成します：
- TypeScript対応
- Tailwind CSS（スタイリング）
- ESLint（コード品質チェック）
- App Router（新しいルーティングシステム）
- srcディレクトリ構造
- インポートエイリアス設定

3. 開発サーバーの起動

プロジェクトが作成されたら、開発サーバーを起動します。

_コマンド実行_

```bash
npm run dev
```

4. ブラウザで動作確認

ブラウザを開き、`http://localhost:3000`にアクセスします。
Next.jsのデフォルトページが表示されれば成功です。

:::

これでNext.jsプロジェクトの作成と起動が完了しました。開発サーバーが起動している間は、ファイルを編集すると自動的にブラウザが更新される**ホットリロード**機能が働きます。

## ファイルベースルーティング

Next.jsの最大の特徴の一つが**ファイルベースルーティング**です。これは、`src/app`ディレクトリ内のファイル構造がそのままURLの構造になる仕組みです。

:::note ファイルベースルーティングとは

ファイルベースルーティングは、ファイルの配置場所とファイル名によって、自動的にページのルート（URL）が決まる仕組みです。従来のReact Routerのような設定ファイルは不要で、直感的にページを作成できます。

:::

### 新しいページを作成してみよう

ファイルベースルーティングの仕組みを理解するために、新しいページを作成してみましょう。

:::step

1. aboutページの作成

`src/app`ディレクトリ内に`about`フォルダを作成し、その中に`page.tsx`ファイルを作成します。

_ファイルパス_

`src/app/about/page.tsx`

_コード実行_

```tsx
export default function About() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        私たちについて
      </h1>
      <p className="text-lg text-gray-600">
        Next.jsクイックスタートで作成されたページです。
        ファイルベースルーティングの仕組みを体験しています。
      </p>
    </div>
  )
}
```

2. ブラウザで動作確認

ブラウザで`http://localhost:3000/about`にアクセスします。
新しく作成したaboutページが表示されれば成功です。

3. ナビゲーションリンクの追加

ホームページにaboutページへのリンクを追加します。

_ファイルパス_

`src/app/page.tsx`

_コード実行_

```tsx
import Link from 'next/link'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Next.jsクイックスタート
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        Next.jsの基本を学んでいます。
      </p>
      //addstart
      <Link 
        href="/about" 
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        私たちについて
      </Link>
      //addend
    </div>
  )
}
```

4. ナビゲーションの動作確認

ホームページに戻り、新しく追加したリンクをクリックしてaboutページに移動できることを確認します。

:::

このように、`src/app/about/page.tsx`というファイルを作成するだけで、`/about`というURLでアクセスできるページが自動的に作成されます。これがファイルベースルーティングの基本的な仕組みです。

## Reactコンポーネントの作成

Next.jsはReactベースのフレームワークなので、再利用可能なコンポーネントを作成することで、効率的にWebアプリケーションを構築できます。

:::note Reactコンポーネントとは

Reactコンポーネントは、UIの一部を独立した再利用可能な部品として定義したものです。props（プロパティ）を受け取って、動的な内容を表示できます。

:::

### カスタムコンポーネントを作成してみよう

再利用可能なカードコンポーネントを作成して、コンポーネントの基本的な使い方を体験してみましょう。

:::step

1. コンポーネントディレクトリの作成

`src/components`ディレクトリを作成します。

_コマンド実行_

```bash
mkdir src/components
```

2. Cardコンポーネントの作成

`src/components`ディレクトリに`Card.tsx`ファイルを作成します。

_ファイルパス_

`src/components/Card.tsx`

_コード実行_

```tsx
interface CardProps {
  title: string
  description: string
  imageUrl?: string
}

export default function Card({ title, description, imageUrl }: CardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-sm">
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-48 object-cover rounded-md mb-4"
        />
      )}
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        {title}
      </h3>
      <p className="text-gray-600">
        {description}
      </p>
    </div>
  )
}
```

3. ホームページでCardコンポーネントを使用

ホームページを更新して、作成したCardコンポーネントを使用します。

_ファイルパス_

`src/app/page.tsx`

_コード実行_

```tsx
import Link from 'next/link'
//addstart
import Card from '@/components/Card'
//addend

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Next.jsクイックスタート
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        Next.jsの基本を学んでいます。
      </p>
      <Link 
        href="/about" 
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-8 inline-block"
      >
        私たちについて
      </Link>
      
      //addstart
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card 
          title="Next.jsの特徴"
          description="ファイルベースルーティングとサーバーサイドレンダリングを提供するReactフレームワークです。"
        />
        <Card 
          title="TypeScript対応"
          description="型安全性を提供し、開発効率を向上させます。"
        />
        <Card 
          title="Tailwind CSS"
          description="ユーティリティファーストのCSSフレームワークで、素早くスタイリングできます。"
        />
      </div>
      //addend
    </div>
  )
}
```

4. ブラウザで動作確認

ブラウザでホームページを確認し、カードコンポーネントが正しく表示されることを確認します。

:::

このように、再利用可能なコンポーネントを作成することで、同じデザインパターンを複数の場所で使用でき、コードの保守性が向上します。

## スタイリングの基本

Next.jsでは、Tailwind CSSを使用してスタイリングを行います。Tailwind CSSは、ユーティリティクラスを使用して素早くスタイリングできるCSSフレームワークです。

:::note Tailwind CSSとは

Tailwind CSSは、ユーティリティファーストのCSSフレームワークです。`bg-blue-500`、`text-white`、`p-4`などのクラスを組み合わせることで、カスタムCSSを書かずにスタイリングできます。

:::

### レスポンシブデザインを実装してみよう

モバイルファーストのレスポンシブデザインを実装して、Tailwind CSSの基本的な使い方を体験してみましょう。

:::step

1. レスポンシブレイアウトの実装

aboutページを更新して、レスポンシブデザインを実装します。

_ファイルパス_

`src/app/about/page.tsx`

_コード実行_

```tsx
export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6 text-center">
          私たちについて
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              ミッション
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Next.jsの学習を通じて、モダンなWebアプリケーション開発の
              スキルを身につけていただくことが私たちのミッションです。
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              ビジョン
            </h2>
            <p className="text-gray-600 leading-relaxed">
              誰でも簡単に美しく、パフォーマンスの高いWebアプリケーションを
              作成できる世界を目指しています。
            </p>
          </div>
        </div>
        
        <div className="text-center">
          <a 
            href="/" 
            className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            ホームに戻る
          </a>
        </div>
      </div>
    </div>
  )
}
```

2. モバイルでの表示確認

ブラウザの開発者ツールを使用して、モバイル表示でのレイアウトを確認します。
- Chrome: F12キーを押して開発者ツールを開く
- デバイスツールバーをクリックしてモバイル表示に切り替える

3. デスクトップでの表示確認

デスクトップ表示に戻して、レスポンシブレイアウトが正しく動作することを確認します。

:::

Tailwind CSSのレスポンシブクラス（`md:`、`lg:`など）を使用することで、異なる画面サイズに適応するレイアウトを簡単に実装できます。

## まとめ

このクイックスタートでは、Next.jsの基本的な機能を実際に手を動かしながら体験していただきました。Next.jsの核心的な概念を理解し、簡単なWebアプリケーションを作成することができました。

:::note 要点のまとめ

- Next.jsプロジェクトの作成と起動方法を習得
- ファイルベースルーティングの仕組みを理解
- 再利用可能なReactコンポーネントの作成方法を学習
- Tailwind CSSを使ったレスポンシブデザインの実装
- ページ間のナビゲーション機能の実装

:::

Next.jsは、これらの基本機能を組み合わせることで、本格的なWebアプリケーションを効率的に構築できます。次のステップでは、より高度な機能であるサーバーサイドレンダリング、API Routes、データフェッチングなどを学習していきます。

[Next.jsの基本概念](./basic-concepts)では、Next.jsのアーキテクチャと主要な機能について詳しく解説します。

## 関連リンク

- [Next.js公式ドキュメント](https://nextjs.org/docs)
- [React公式ドキュメント](https://react.dev/)
- [Tailwind CSS公式ドキュメント](https://tailwindcss.com/docs)
- [TypeScript公式ドキュメント](https://www.typescriptlang.org/docs/)

## さらに深く学習したい方へ

Next.jsの基本をマスターしたら、より実践的なアプリケーション開発に挑戦してみませんか？私たちの研修プラットフォームでは、Next.jsを使った本格的なWebアプリケーション開発のコースを提供しています。サーバーサイドレンダリング、認証機能、データベース連携など、実務で必要なスキルを体系的に学習できます。