---
title: Nuxt/Vue
slug: nuxt-vue
parent: installation
file_path: installation/nuxt-vue
target_user: "Vue.js/Nuxt開発者、フロントエンド開発者"
goal: "Nuxt/VueプロジェクトにTailwind CSSを導入し、Vue.jsエコシステムでモダンなWebアプリケーションを構築する"
status: completed
post_type: pages
seo_title: "Nuxt/VueでTailwind CSS導入 - Vue.jsフレームワークでのセットアップガイド"
seo_keywords: "TailwindCSS,Nuxt,Vue.js,導入方法,セットアップ,フロントエンド開発"
seo_description: "Nuxt/VueプロジェクトにTailwind CSSを導入する方法を詳しく解説。Vue.jsエコシステムでの実践的な導入手順を紹介します。"
handson_overview: "Nuxt/VueプロジェクトでTailwind CSSを使用できるよう、実際のプロジェクト作成から設定までハンズオン形式で学習できます"
---

# Nuxt/Vue

Nuxtは、Vue.jsベースのフルスタックフレームワークです。サーバーサイドレンダリング（SSR）、静的サイト生成（SSG）、そしてシングルページアプリケーション（SPA）のすべてをサポートし、Tailwind CSSとの組み合わせにより、高性能なVue.jsアプリケーションを構築できます。この章では、Nuxt/VueプロジェクトでのTailwind CSS導入方法について詳しく解説します。

## Nuxtとは

Nuxtは、以下の特徴を持つVue.jsフレームワークです：

- **Vue.jsベース**: Vue.jsのエコシステムを活用
- **フルスタック**: フロントエンドとバックエンドの統合
- **自動ルーティング**: ファイルベースのルーティング
- **サーバーサイドレンダリング**: SEOとパフォーマンスの最適化
- **静的サイト生成**: 高速な静的サイトの生成
- **モジュールシステム**: 豊富なモジュールエコシステム

:::note Nuxtの利点

Nuxtを使用することで、以下の利点があります：

- **開発効率**: 設定不要の開発環境
- **パフォーマンス**: 自動最適化とコード分割
- **SEO**: サーバーサイドレンダリングによる検索エンジン最適化
- **スケーラビリティ**: 大規模アプリケーションの構築が容易

:::

## 新規プロジェクトでの導入

### 1. Nuxtプロジェクトの作成

Tailwind CSSが組み込まれたNuxtプロジェクトを作成します。

:::step

1. プロジェクトディレクトリの作成

任意の場所（デスクトップなど）で`my-nuxt-app`フォルダを作成し、そのディレクトリに移動してください。

_コマンド実行_

```bash
mkdir my-nuxt-app
cd my-nuxt-app
```

2. Nuxtプロジェクトの作成

Nuxtプロジェクトを作成します。

_コマンド実行_

```bash
npx nuxi@latest init .
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

生成された`tailwind.config.js`ファイルを編集して、Nuxtのファイル構造に合わせて設定します。

_tailwind.config.js_

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

7. CSSファイルの作成

`assets/css/main.css`ファイルを作成して、Tailwind CSSのディレクティブを追加します。

_assets/css/main.css_

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

8. nuxt.config.tsの設定

`nuxt.config.ts`ファイルを編集して、CSSファイルを追加します。

_nuxt.config.ts_

```typescript
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
})
```

9. 開発サーバーの起動

開発サーバーを起動して動作確認を行います。

_コマンド実行_

```bash
npm run dev
```

10. ブラウザで確認

ブラウザで`http://localhost:3000`にアクセスして、Tailwind CSSが適用されたページが表示されることを確認してください。

:::

## 次のステップ

Nuxt/VueプロジェクトでのTailwind CSS導入が完了しました。次は、より高度な機能について学びましょう。

### 学習を続けたい方
- **[Tailwind基礎](../tailwind-basics/tailwind-basics.md)**: ユーティリティクラスの詳細な学習
- **[レイアウト＆デザイン](../layout-design/layout-design.md)**: 高度なレイアウト技術の学習
- **[フレームワーク統合](../frameworks/frameworks.md)**: Nuxt/Vueの実践パターン

### 他のフレームワークも試したい方
- **[Next.js（App Router）](nextjs.md)**: Next.jsプロジェクトでの導入
- **[Viteプロジェクト](vite.md)**: Viteプロジェクトでの導入
- **[Remix](remix.md)**: Remixプロジェクトでの導入

Nuxt/VueとTailwind CSSの組み合わせで、高性能で保守性の高いVue.jsアプリケーションを構築していきましょう。