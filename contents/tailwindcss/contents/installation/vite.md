---
title: Viteプロジェクト
slug: vite
parent: installation
file_path: installation/vite
target_user: "Vite開発者、フロントエンド開発者"
goal: "ViteプロジェクトにTailwind CSSを導入し、高速な開発環境を構築する"
status: completed
post_type: pages
seo_title: "ViteでTailwind CSS導入 - 高速ビルドツールでのセットアップガイド"
seo_keywords: "TailwindCSS,Vite,高速ビルド,導入方法,セットアップ,開発環境"
seo_description: "ViteプロジェクトにTailwind CSSを導入する方法を詳しく解説。新規プロジェクト作成から既存プロジェクトへの追加まで、実践的な手順を紹介します。"
handson_overview: "ViteプロジェクトでTailwind CSSを使用できるよう、実際のプロジェクト作成から設定までハンズオン形式で学習できます"
---

# Viteプロジェクト

Viteは、モダンなフロントエンド開発のための高速なビルドツールです。Tailwind CSSとの組み合わせにより、開発効率が大幅に向上します。この章では、ViteプロジェクトでのTailwind CSS導入方法について詳しく解説します。

## Viteとは

Viteは、以下の特徴を持つ次世代のビルドツールです：

- **高速な開発サーバー**: ES modulesを活用した即座の起動
- **HMR（Hot Module Replacement）**: ファイル変更の即座な反映
- **最適化されたビルド**: Rollupベースの本番ビルド
- **豊富なプラグイン**: 様々なフレームワークに対応
- **TypeScript対応**: 設定なしでTypeScriptをサポート

:::note Viteの利点

Viteを使用することで、以下の利点があります：

- **開発サーバーの起動が高速**: 従来のWebpackと比較して10倍以上高速
- **ホットリロードが高速**: ファイル変更の反映が即座
- **設定が簡単**: 最小限の設定で動作
- **フレームワーク非依存**: React、Vue、Svelteなどに対応

:::

## 新規プロジェクトでの導入

### 1. Viteプロジェクトの作成

Tailwind CSSが組み込まれたViteプロジェクトを作成する方法です。

:::step

1. プロジェクトディレクトリの作成

任意の場所（デスクトップなど）で`my-vite-app`フォルダを作成し、そのディレクトリに移動してください。

_コマンド実行_

```bash
mkdir my-vite-app
cd my-vite-app
```

2. Viteプロジェクトの作成

Reactテンプレートを使用してViteプロジェクトを作成します。

_コマンド実行_

```bash
npm create vite@latest . -- --template react-ts
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

6. 設定ファイルの編集

生成された`tailwind.config.js`ファイルを編集します。

_tailwind.config.js_

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

7. CSSファイルの設定

`src/index.css`ファイルにTailwind CSSのディレクティブを追加します。

_src/index.css_

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

8. 開発サーバーの起動

開発サーバーを起動して動作確認を行います。

_コマンド実行_

```bash
npm run dev
```

9. ブラウザで確認

ブラウザで`http://localhost:5173`にアクセスして、Tailwind CSSが適用されたページが表示されることを確認してください。

:::

### 2. プロジェクト構造の確認

作成されたプロジェクトの構造を確認しましょう。

```
my-vite-app/
├── src/
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── public/
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
└── package.json
```

### 3. 設定ファイルの詳細

#### vite.config.ts

_vite.config.ts_

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',
  },
})
```

#### postcss.config.js

_postcss.config.js_

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## 既存プロジェクトへの追加

既存のViteプロジェクトにTailwind CSSを追加する場合の手順です。

:::step

1. 依存関係のインストール

既存のViteプロジェクトのルートディレクトリで、Tailwind CSSとその依存関係をインストールします。

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

生成された`tailwind.config.js`ファイルを編集して、Viteのファイル構造に合わせて設定します。

_tailwind.config.js_

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

4. CSSファイルの設定

`src/index.css`ファイルにTailwind CSSのディレクティブを追加します。

_src/index.css_

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

5. vite.config.tsの更新

`vite.config.ts`ファイルにPostCSSの設定を追加します。

_vite.config.ts_

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',
  },
})
```

6. 動作確認

開発サーバーを起動して、Tailwind CSSが正しく動作することを確認します。

_コマンド実行_

```bash
npm run dev
```

:::

## ハンズオン: 基本的なコンポーネントの作成

ViteプロジェクトでTailwind CSSを使用した基本的なコンポーネントを作成してみましょう。

:::step

1. App.tsxの編集

`src/App.tsx`ファイルを編集して、Tailwind CSSを使用したコンポーネントを作成します。

_src/App.tsx_

```tsx
import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Vite + React + Tailwind CSS
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            高速な開発環境でモダンなWebアプリケーションを構築
          </p>
        </div>

        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold text-white">{count}</span>
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              カウンター
            </h2>
            
            <div className="space-y-4">
              <button
                onClick={() => setCount((count) => count + 1)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                カウントアップ
              </button>
              
              <button
                onClick={() => setCount((count) => count - 1)}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                カウントダウン
              </button>
              
              <button
                onClick={() => setCount(0)}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                リセット
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">高速開発</h3>
            <p className="text-gray-600">
              Viteの高速な開発サーバーで効率的な開発が可能
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">モダンなUI</h3>
            <p className="text-gray-600">
              Tailwind CSSで美しくレスポンシブなUIを構築
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">TypeScript</h3>
            <p className="text-gray-600">
              型安全性を保ちながら開発効率を向上
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
```

2. App.cssの削除

`src/App.css`ファイルは不要になるため、削除または空にします。

_src/App.css_

```css
/* Tailwind CSSを使用するため、このファイルは不要 */
```

3. 動作確認

開発サーバーを起動して、作成したコンポーネントが正しく表示されることを確認してください。

_コマンド実行_

```bash
npm run dev
```

ブラウザで`http://localhost:5173`にアクセスして、以下の要素が正しく表示されることを確認してください：

- グラデーション背景
- カウンター機能
- カードレイアウト
- ホバー効果
- レスポンシブデザイン

:::

## フレームワーク別の設定

### React + TypeScript

上記の手順でReact + TypeScriptプロジェクトでの導入が完了します。

### Vue.js

Vue.jsプロジェクトでの導入方法です。

:::step

1. Vue.jsプロジェクトの作成

_コマンド実行_

```bash
npm create vite@latest my-vue-app -- --template vue-ts
cd my-vue-app
```

2. 依存関係のインストール

_コマンド実行_

```bash
npm install
npm install -D tailwindcss postcss autoprefixer
```

3. 設定ファイルの生成と編集

_コマンド実行_

```bash
npx tailwindcss init -p
```

4. CSSファイルの設定

_src/style.css_

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

:::

### Svelte

Svelteプロジェクトでの導入方法です。

:::step

1. Svelteプロジェクトの作成

_コマンド実行_

```bash
npm create vite@latest my-svelte-app -- --template svelte-ts
cd my-svelte-app
```

2. 依存関係のインストール

_コマンド実行_

```bash
npm install
npm install -D tailwindcss postcss autoprefixer
```

3. 設定ファイルの生成と編集

_コマンド実行_

```bash
npx tailwindcss init -p
```

4. CSSファイルの設定

_src/app.css_

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

:::

## パフォーマンス最適化

### 1. 本番ビルドの最適化

_vite.config.ts_

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
})
```

### 2. CSS最適化の確認

本番ビルドでCSSファイルサイズを確認します。

_コマンド実行_

```bash
npm run build
npm run preview
```

## トラブルシューティング

### よくある問題

#### 1. スタイルが適用されない
- `index.css`にTailwindディレクティブが含まれているか確認
- `tailwind.config.js`のcontentパスが正しいか確認
- 開発サーバーを再起動

#### 2. ホットリロードが効かない
- ファイルの保存を確認
- 開発サーバーを再起動
- ブラウザのキャッシュをクリア

#### 3. ビルドエラー
- Node.jsのバージョンを確認（16.0.0以上）
- 依存関係を再インストール
- `package.json`のスクリプトを確認

## 次のステップ

ViteプロジェクトでのTailwind CSS導入が完了しました。次は、より高度な機能について学びましょう。

### 学習を続けたい方
- **[Tailwind基礎](../tailwind-basics/tailwind-basics.md)**: ユーティリティクラスの詳細な学習
- **[レイアウト＆デザイン](../layout-design/layout-design.md)**: 高度なレイアウト技術の学習
- **[フレームワーク統合](../frameworks/frameworks.md)**: Viteの実践パターン

### 他のフレームワークも試したい方
- **[Next.js（App Router）](nextjs.md)**: Next.jsプロジェクトでの導入
- **[Nuxt/Vue](nuxt-vue.md)**: Vue.js/Nuxtプロジェクトでの導入
- **[PostCSS/CLIセットアップ](postcss-cli.md)**: 汎用的な環境での導入

ViteとTailwind CSSの組み合わせで、高速で効率的な開発環境を構築していきましょう。