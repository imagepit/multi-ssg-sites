---
title: Astro
slug: astro
parent: installation
file_path: installation/astro
target_user: "Astro開発者、静的サイト開発者"
goal: "AstroプロジェクトにTailwind CSSを導入し、コンテンツ中心の高速なWebサイトを構築する"
status: completed
post_type: pages
seo_title: "AstroでTailwind CSS導入 - 静的サイトジェネレーターでのセットアップガイド"
seo_keywords: "TailwindCSS,Astro,静的サイト,導入方法,セットアップ,コンテンツ中心"
seo_description: "AstroプロジェクトにTailwind CSSを導入する方法を詳しく解説。コンテンツ中心の高速なWebサイトでの実践的な導入手順を紹介します。"
handson_overview: "AstroプロジェクトでTailwind CSSを使用できるよう、実際のプロジェクト作成から設定までハンズオン形式で学習できます"
---

# Astro

Astroは、コンテンツ中心のWebサイト構築に特化した静的サイトジェネレーターです。フレームワークに依存しない設計で、Tailwind CSSとの組み合わせにより、非常に高速で軽量なWebサイトを構築できます。この章では、AstroプロジェクトでのTailwind CSS導入方法について詳しく解説します。

## Astroとは

Astroは、以下の特徴を持つ静的サイトジェネレーターです：

- **コンテンツ中心**: コンテンツファーストの設計思想
- **フレームワーク非依存**: 任意のフレームワークを使用可能
- **静的生成**: 高速な静的サイトの生成
- **部分的なハイドレーション**: 必要な部分のみJavaScriptを実行
- **マルチフレームワーク**: React、Vue、Svelteなどを混在可能
- **軽量**: 最小限のJavaScriptで動作

:::note Astroの利点

Astroを使用することで、以下の利点があります：

- **高速**: 静的生成による最高のパフォーマンス
- **軽量**: 最小限のJavaScriptバンドル
- **柔軟性**: 任意のフレームワークを選択可能
- **SEO**: 静的生成による優れたSEO

:::

## 新規プロジェクトでの導入

### 1. Astroプロジェクトの作成

Tailwind CSSが組み込まれたAstroプロジェクトを作成します。

:::step

1. プロジェクトディレクトリの作成

任意の場所（デスクトップなど）で`my-astro-app`フォルダを作成し、そのディレクトリに移動してください。

_コマンド実行_

```bash
mkdir my-astro-app
cd my-astro-app
```

2. Astroプロジェクトの作成

Astroプロジェクトを作成します。

_コマンド実行_

```bash
npm create astro@latest .
```

3. 依存関係のインストール

プロジェクトの依存関係をインストールします。

_コマンド実行_

```bash
npm install
```

4. Tailwind CSSのインストール

Tailwind CSSとその依存関係をインストールします。

_コマンド実行_

```bash
npm install -D tailwindcss postcss autoprefixer
```

5. 設定ファイルの生成

Tailwind CSSの設定ファイルを生成します。

_コマンド実行_

```bash
npx tailwindcss init -p
```

6. tailwind.config.jsの設定

生成された`tailwind.config.js`ファイルを編集して、Astroのファイル構造に合わせて設定します。

_tailwind.config.js_

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

7. CSSファイルの作成

`src/styles/global.css`ファイルを作成して、Tailwind CSSのディレクティブを追加します。

_src/styles/global.css_

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

8. astro.config.mjsの設定

`astro.config.mjs`ファイルを編集して、CSSファイルを追加します。

_astro.config.mjs_

```javascript
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // 既存の設定...
});
```

9. 開発サーバーの起動

開発サーバーを起動して動作確認を行います。

_コマンド実行_

```bash
npm run dev
```

10. ブラウザで確認

ブラウザで`http://localhost:4321`にアクセスして、Tailwind CSSが適用されたページが表示されることを確認してください。

:::

## ハンズオン: 基本的なコンポーネントの作成

AstroプロジェクトでTailwind CSSを使用した基本的なコンポーネントを作成してみましょう。

:::step

1. メインページの編集

`src/pages/index.astro`ファイルを編集して、Tailwind CSSを使用したコンポーネントを作成します。

_src/pages/index.astro_

```astro
---
// Astroコンポーネントスクリプト（サーバーサイドで実行）
const title = "Welcome to Astro";
const description = "Tailwind CSSとAstroを使用した高速なWebサイト";
---

<html lang="ja">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width" />
    <meta name="generator" content={Astro.generator} />
    <title>{title}</title>
    <meta name="description" content={description} />
  </head>
  <body>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div class="container mx-auto px-4 py-16">
        <div class="text-center mb-12">
          <h1 class="text-5xl font-bold text-gray-900 mb-4">
            {title}
          </h1>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">高速</h3>
            <p class="text-gray-600">
              静的生成により最高のパフォーマンスを実現します。
            </p>
          </div>

          <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">軽量</h3>
            <p class="text-gray-600">
              最小限のJavaScriptで動作する軽量なサイトを構築できます。
            </p>
          </div>

          <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">柔軟</h3>
            <p class="text-gray-600">
              任意のフレームワークを選択して開発できます。
            </p>
          </div>
        </div>

        <div class="text-center mt-12">
          <a
            href="/about"
            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            詳細を見る
          </a>
        </div>
      </div>
    </div>
  </body>
</html>
```

2. アバウトページの作成

`src/pages/about.astro`ファイルを作成して、アバウトページを追加します。

_src/pages/about.astro_

```astro
---
const title = "About - Astro + Tailwind CSS";
const description = "AstroとTailwind CSSについて";
---

<html lang="ja">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width" />
    <meta name="generator" content={Astro.generator} />
    <title>{title}</title>
    <meta name="description" content={description} />
  </head>
  <body>
    <div class="min-h-screen bg-gray-50">
      <div class="container mx-auto px-4 py-16">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-12">
            <h1 class="text-4xl font-bold text-gray-900 mb-4">
              About
            </h1>
            <p class="text-xl text-gray-600">
              AstroとTailwind CSSの組み合わせについて
            </p>
          </div>

          <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4">
              Astroとは
            </h2>
            <p class="text-gray-600 mb-4">
              Astroは、コンテンツ中心のWebサイト構築に特化した静的サイトジェネレーターです。
              フレームワークに依存しない設計で、非常に高速で軽量なWebサイトを構築できます。
            </p>
            <ul class="list-disc list-inside text-gray-600 space-y-2">
              <li>コンテンツ中心の設計</li>
              <li>フレームワーク非依存</li>
              <li>静的サイト生成</li>
              <li>部分的なハイドレーション</li>
              <li>マルチフレームワーク対応</li>
            </ul>
          </div>

          <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 class="text-2xl font-semibold text-gray-800 mb-4">
              Tailwind CSSとの組み合わせ
            </h2>
            <p class="text-gray-600 mb-4">
              Tailwind CSSとAstroの組み合わせにより、以下の利点があります：
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="p-4 bg-blue-50 rounded-lg">
                <h3 class="font-semibold text-blue-800 mb-2">開発効率</h3>
                <p class="text-blue-600 text-sm">
                  ユーティリティクラスによる迅速なスタイリング
                </p>
              </div>
              <div class="p-4 bg-green-50 rounded-lg">
                <h3 class="font-semibold text-green-800 mb-2">パフォーマンス</h3>
                <p class="text-green-600 text-sm">
                  未使用CSSの自動削除による最適化
                </p>
              </div>
              <div class="p-4 bg-purple-50 rounded-lg">
                <h3 class="font-semibold text-purple-800 mb-2">保守性</h3>
                <p class="text-purple-600 text-sm">
                  一貫したデザインシステムの構築
                </p>
              </div>
              <div class="p-4 bg-orange-50 rounded-lg">
                <h3 class="font-semibold text-orange-800 mb-2">レスポンシブ</h3>
                <p class="text-orange-600 text-sm">
                  モバイルファーストのレスポンシブデザイン
                </p>
              </div>
            </div>
          </div>

          <div class="text-center">
            <a
              href="/"
              class="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              ホームに戻る
            </a>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
```

3. 動作確認

開発サーバーを起動して、作成したコンポーネントが正しく表示されることを確認してください。

_コマンド実行_

```bash
npm run dev
```

ブラウザで`http://localhost:4321`にアクセスして、以下の要素が正しく表示されることを確認してください：

- ホームページのカードレイアウト
- ナビゲーションリンク
- レスポンシブデザイン
- ホバー効果

:::

## 次のステップ

AstroプロジェクトでのTailwind CSS導入が完了しました。次は、より高度な機能について学びましょう。

### 学習を続けたい方
- **[Tailwind基礎](../tailwind-basics/tailwind-basics.md)**: ユーティリティクラスの詳細な学習
- **[レイアウト＆デザイン](../layout-design/layout-design.md)**: 高度なレイアウト技術の学習
- **[フレームワーク統合](../frameworks/frameworks.md)**: Astroの実践パターン

### 他のフレームワークも試したい方
- **[Next.js（App Router）](nextjs.md)**: Next.jsプロジェクトでの導入
- **[Viteプロジェクト](vite.md)**: Viteプロジェクトでの導入
- **[Nuxt/Vue](nuxt-vue.md)**: Nuxt/Vueプロジェクトでの導入

AstroとTailwind CSSの組み合わせで、高速で軽量なコンテンツ中心のWebサイトを構築していきましょう。