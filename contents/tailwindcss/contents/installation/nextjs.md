---
title: Next.js（App Router）
slug: nextjs
parent: installation
file_path: installation/nextjs
target_user: "React/Next.js開発者、フロントエンド開発者"
goal: "Next.js App RouterプロジェクトにTailwind CSSを導入し、本格的な開発環境を構築する"
status: completed
post_type: pages
seo_title: "Next.js App RouterでTailwind CSS導入 - React開発環境のセットアップガイド"
seo_keywords: "TailwindCSS,Next.js,App Router,React,導入方法,セットアップ,開発環境"
seo_description: "Next.js App RouterプロジェクトにTailwind CSSを導入する方法を詳しく解説。新規プロジェクト作成から既存プロジェクトへの追加まで、実践的な手順を紹介します。"
handson_overview: "Next.js App RouterプロジェクトでTailwind CSSを使用できるよう、実際のプロジェクト作成から設定までハンズオン形式で学習できます"
---

# Next.js（App Router）

Next.js App Routerは、Reactの最新のフルスタックフレームワークです。Tailwind CSSとの相性が非常に良く、本格的なWebアプリケーション開発に最適な組み合わせです。この章では、Next.js App RouterプロジェクトでのTailwind CSS導入方法について詳しく解説します。

## Next.js App Routerとは

Next.js App Routerは、Next.js 13以降で導入された新しいルーティングシステムです。以下の特徴があります：

- **App Directory**: `app/`ディレクトリベースのルーティング
- **Server Components**: サーバーサイドでのコンポーネント実行
- **Streaming**: 段階的なコンテンツ配信
- **Layouts**: ネストしたレイアウトシステム
- **Loading UI**: ローディング状態の管理

:::note App RouterとPages Routerの違い

Next.jsには2つのルーティングシステムがあります：

- **App Router**: 新しいシステム（推奨）
- **Pages Router**: 従来のシステム

この章では、App Routerでの導入方法を説明します。Pages Routerを使用している場合は、設定方法が若干異なります。

:::

## 新規プロジェクトでの導入

### 1. Next.jsプロジェクトの作成

Tailwind CSSが組み込まれたNext.jsプロジェクトを一括で作成する方法が最も簡単です。

:::step

1. プロジェクトディレクトリの作成

任意の場所（デスクトップなど）で`my-tailwind-app`フォルダを作成し、そのディレクトリに移動してください。

_コマンド実行_

```bash
mkdir my-tailwind-app
cd my-tailwind-app
```

2. Next.jsプロジェクトの作成

Tailwind CSSが組み込まれたNext.jsプロジェクトを作成します。

_コマンド実行_

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

3. 依存関係のインストール

プロジェクトの依存関係をインストールします。

_コマンド実行_

```bash
npm install
```

4. 開発サーバーの起動

開発サーバーを起動して動作確認を行います。

_コマンド実行_

```bash
npm run dev
```

5. ブラウザで確認

ブラウザで`http://localhost:3000`にアクセスして、Tailwind CSSが適用されたページが表示されることを確認してください。

:::

### 2. プロジェクト構造の確認

作成されたプロジェクトの構造を確認しましょう。

```
my-tailwind-app/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── components/
├── public/
├── tailwind.config.ts
├── postcss.config.mjs
├── next.config.mjs
└── package.json
```

### 3. 設定ファイルの確認

#### tailwind.config.ts

_tailwind.config.ts_

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
    },
  },
  plugins: [],
}
export default config
```

#### globals.css

_src/app/globals.css_

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

body {
  color: var(--foreground);
  background: var(--background);
  font-family: Arial, Helvetica, sans-serif;
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

## 既存プロジェクトへの追加

既存のNext.jsプロジェクトにTailwind CSSを追加する場合の手順です。

:::step

1. 依存関係のインストール

既存のNext.jsプロジェクトのルートディレクトリで、Tailwind CSSとその依存関係をインストールします。

_コマンド実行_

```bash
npm install -D tailwindcss postcss autoprefixer
```

2. 設定ファイルの生成

Tailwind CSSの設定ファイルを生成します。

_コマンド実行_

```bash
npx tailwindcss init -p
```

3. tailwind.config.jsの設定

生成された`tailwind.config.js`ファイルを編集して、Next.jsのファイル構造に合わせて設定します。

_tailwind.config.js_

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

4. CSSファイルの設定

`src/app/globals.css`ファイルにTailwind CSSのディレクティブを追加します。

_src/app/globals.css_

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

5. 動作確認

開発サーバーを起動して、Tailwind CSSが正しく動作することを確認します。

_コマンド実行_

```bash
npm run dev
```

:::

## 次のステップ

Next.js App RouterでのTailwind CSS導入が完了しました。次は、より高度な機能について学びましょう。

### 学習を続けたい方
- **[Tailwind基礎](../tailwind-basics/tailwind-basics.md)**: ユーティリティクラスの詳細な学習
- **[レイアウト＆デザイン](../layout-design/layout-design.md)**: 高度なレイアウト技術の学習
- **[フレームワーク統合](../frameworks/frameworks.md)**: React/Next.jsの実践パターン

### 他のフレームワークも試したい方
- **[Viteプロジェクト](vite.md)**: Viteを使用したプロジェクトでの導入
- **[Nuxt/Vue](nuxt-vue.md)**: Vue.js/Nuxtプロジェクトでの導入

Next.js App RouterとTailwind CSSの組み合わせで、モダンで高性能なWebアプリケーションを構築していきましょう。