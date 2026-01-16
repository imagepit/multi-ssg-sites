---
title: Svelte/SvelteKit
slug: sveltekit
parent: installation
file_path: installation/sveltekit
target_user: "Svelte/SvelteKit開発者、フロントエンド開発者"
goal: "Svelte/SvelteKitプロジェクトにTailwind CSSを導入し、軽量で高性能なWebアプリケーションを構築する"
status: completed
post_type: pages
seo_title: "Svelte/SvelteKitでTailwind CSS導入 - 軽量フレームワークでのセットアップガイド"
seo_keywords: "TailwindCSS,Svelte,SvelteKit,導入方法,セットアップ,軽量フレームワーク"
seo_description: "Svelte/SvelteKitプロジェクトにTailwind CSSを導入する方法を詳しく解説。軽量で高性能なWebアプリケーションでの実践的な導入手順を紹介します。"
handson_overview: "Svelte/SvelteKitプロジェクトでTailwind CSSを使用できるよう、実際のプロジェクト作成から設定までハンズオン形式で学習できます"
---

# Svelte/SvelteKit

SvelteKitは、Svelteベースのフルスタックフレームワークです。コンパイル時に最適化される軽量なフレームワークで、Tailwind CSSとの組み合わせにより、非常に軽量で高性能なWebアプリケーションを構築できます。この章では、Svelte/SvelteKitプロジェクトでのTailwind CSS導入方法について詳しく解説します。

## SvelteKitとは

SvelteKitは、以下の特徴を持つSvelteフレームワークです：

- **Svelteベース**: コンパイル時に最適化される軽量フレームワーク
- **フルスタック**: フロントエンドとバックエンドの統合
- **自動ルーティング**: ファイルベースのルーティング
- **サーバーサイドレンダリング**: SEOとパフォーマンスの最適化
- **静的サイト生成**: 高速な静的サイトの生成
- **軽量**: バンドルサイズが非常に小さい

:::note SvelteKitの利点

SvelteKitを使用することで、以下の利点があります：

- **軽量**: 非常に小さなバンドルサイズ
- **高速**: コンパイル時の最適化
- **シンプル**: 学習コストが低い
- **パフォーマンス**: ランタイムオーバーヘッドが最小

:::

## 新規プロジェクトでの導入

### 1. SvelteKitプロジェクトの作成

Tailwind CSSが組み込まれたSvelteKitプロジェクトを作成します。

:::step

1. プロジェクトディレクトリの作成

任意の場所（デスクトップなど）で`my-sveltekit-app`フォルダを作成し、そのディレクトリに移動してください。

_コマンド実行_

```bash
mkdir my-sveltekit-app
cd my-sveltekit-app
```

2. SvelteKitプロジェクトの作成

SvelteKitプロジェクトを作成します。

_コマンド実行_

```bash
npm create svelte@latest .
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

生成された`tailwind.config.js`ファイルを編集して、SvelteKitのファイル構造に合わせて設定します。

_tailwind.config.js_

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,svelte,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

7. CSSファイルの作成

`src/app.css`ファイルを作成して、Tailwind CSSのディレクティブを追加します。

_src/app.css_

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

8. app.htmlの更新

`src/app.html`ファイルを更新して、CSSファイルをインポートします。

_src/app.html_

```html
<!DOCTYPE html>
<html lang="ja">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" href="%sveltekit.assets%/favicon.png" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		%sveltekit.head%
	</head>
	<body data-sveltekit-preload-data="hover">
		<div style="display: contents">%sveltekit.body%</div>
	</body>
</html>
```

9. app.htmlの更新

`src/app.html`ファイルを更新して、CSSファイルをインポートします。

_src/app.html_

```html
<!DOCTYPE html>
<html lang="ja">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" href="%sveltekit.assets%/favicon.png" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		%sveltekit.head%
	</head>
	<body data-sveltekit-preload-data="hover">
		<div style="display: contents">%sveltekit.body%</div>
	</body>
</html>
```

10. 開発サーバーの起動

開発サーバーを起動して動作確認を行います。

_コマンド実行_

```bash
npm run dev
```

11. ブラウザで確認

ブラウザで`http://localhost:5173`にアクセスして、Tailwind CSSが適用されたページが表示されることを確認してください。

:::

## ハンズオン: 基本的なコンポーネントの作成

SvelteKitプロジェクトでTailwind CSSを使用した基本的なコンポーネントを作成してみましょう。

:::step

1. メインページの編集

`src/routes/+page.svelte`ファイルを編集して、Tailwind CSSを使用したコンポーネントを作成します。

_src/routes/+page.svelte_

```svelte
<script>
  let count = 0;
  
  function increment() {
    count += 1;
  }
  
  function decrement() {
    count -= 1;
  }
  
  function reset() {
    count = 0;
  }
</script>

<svelte:head>
  <title>SvelteKit + Tailwind CSS</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
  <div class="container mx-auto px-4 py-16">
    <div class="text-center mb-12">
      <h1 class="text-5xl font-bold text-gray-900 mb-4">
        Welcome to SvelteKit
      </h1>
      <p class="text-xl text-gray-600 max-w-2xl mx-auto">
        Tailwind CSSとSvelteKitを使用した軽量なWebアプリケーション
      </p>
    </div>

    <div class="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 mb-8">
      <div class="text-center">
        <div class="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <span class="text-2xl font-bold text-white">{count}</span>
        </div>
        
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">
          カウンター
        </h2>
        
        <div class="space-y-4">
          <button
            on:click={increment}
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            カウントアップ
          </button>
          
          <button
            on:click={decrement}
            class="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            カウントダウン
          </button>
          
          <button
            on:click={reset}
            class="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            リセット
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="bg-white rounded-lg shadow-lg p-6 text-center">
        <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">軽量</h3>
        <p class="text-gray-600">
          非常に小さなバンドルサイズで高速なアプリケーションを構築
        </p>
      </div>

      <div class="bg-white rounded-lg shadow-lg p-6 text-center">
        <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">シンプル</h3>
        <p class="text-gray-600">
          学習コストが低く、直感的な開発体験を提供
        </p>
      </div>

      <div class="bg-white rounded-lg shadow-lg p-6 text-center">
        <div class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">高性能</h3>
        <p class="text-gray-600">
          コンパイル時の最適化により最高のパフォーマンスを実現
        </p>
      </div>
    </div>
  </div>
</div>
```

2. 動作確認

開発サーバーを起動して、作成したコンポーネントが正しく表示されることを確認してください。

_コマンド実行_

```bash
npm run dev
```

ブラウザで`http://localhost:5173`にアクセスして、以下の要素が正しく表示されることを確認してください：

- カウンター機能
- カードレイアウト
- ホバー効果
- レスポンシブデザイン

:::

## 次のステップ

Svelte/SvelteKitプロジェクトでのTailwind CSS導入が完了しました。次は、より高度な機能について学びましょう。

### 学習を続けたい方
- **[Tailwind基礎](../tailwind-basics/tailwind-basics.md)**: ユーティリティクラスの詳細な学習
- **[レイアウト＆デザイン](../layout-design/layout-design.md)**: 高度なレイアウト技術の学習
- **[フレームワーク統合](../frameworks/frameworks.md)**: Svelte/SvelteKitの実践パターン

### 他のフレームワークも試したい方
- **[Next.js（App Router）](nextjs.md)**: Next.jsプロジェクトでの導入
- **[Viteプロジェクト](vite.md)**: Viteプロジェクトでの導入
- **[Nuxt/Vue](nuxt-vue.md)**: Nuxt/Vueプロジェクトでの導入

Svelte/SvelteKitとTailwind CSSの組み合わせで、軽量で高性能なWebアプリケーションを構築していきましょう。