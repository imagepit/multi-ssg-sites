---
title: Remix
slug: remix
parent: installation
file_path: installation/remix
target_user: "Remix開発者、フルスタック開発者"
goal: "RemixプロジェクトにTailwind CSSを導入し、フルスタックWebアプリケーションを構築する"
status: completed
post_type: pages
seo_title: "RemixでTailwind CSS導入 - フルスタックフレームワークでのセットアップガイド"
seo_keywords: "TailwindCSS,Remix,フルスタック,導入方法,セットアップ,Webアプリケーション"
seo_description: "RemixプロジェクトにTailwind CSSを導入する方法を詳しく解説。フルスタックWebアプリケーションでの実践的な導入手順を紹介します。"
handson_overview: "RemixプロジェクトでTailwind CSSを使用できるよう、実際のプロジェクト作成から設定までハンズオン形式で学習できます"
---

# Remix

Remixは、Web標準に基づいたフルスタックフレームワークです。サーバーサイドレンダリング（SSR）とクライアントサイドの両方で動作し、Tailwind CSSとの組み合わせにより、高性能なWebアプリケーションを構築できます。この章では、RemixプロジェクトでのTailwind CSS導入方法について詳しく解説します。

## Remixとは

Remixは、以下の特徴を持つフルスタックフレームワークです：

- **Web標準準拠**: HTML、CSS、JavaScriptの標準に基づく
- **サーバーサイドレンダリング**: 高速な初期表示
- **ネストしたルーティング**: 直感的なルート構造
- **データローディング**: 効率的なデータ取得
- **フォーム処理**: 標準的なフォームハンドリング
- **エラーハンドリング**: 堅牢なエラー処理

:::note Remixの利点

Remixを使用することで、以下の利点があります：

- **パフォーマンス**: サーバーサイドレンダリングによる高速表示
- **SEO**: 検索エンジン最適化が容易
- **ユーザー体験**: プログレッシブエンハンスメント
- **開発効率**: フルスタック開発の統合

:::

## 新規プロジェクトでの導入

### 1. Remixプロジェクトの作成

Tailwind CSSが組み込まれたRemixプロジェクトを作成します。

:::step

1. プロジェクトディレクトリの作成

任意の場所（デスクトップなど）で`my-remix-app`フォルダを作成し、そのディレクトリに移動してください。

_コマンド実行_

```bash
mkdir my-remix-app
cd my-remix-app
```

2. Remixプロジェクトの作成

Remixプロジェクトを作成します。

_コマンド実行_

```bash
npx create-remix@latest . --template remix-run/remix/templates/remix
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

生成された`tailwind.config.js`ファイルを編集して、Remixのファイル構造に合わせて設定します。

_tailwind.config.js_

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

7. CSSファイルの設定

`app/root.tsx`ファイルにTailwind CSSのディレクティブを追加します。

_app/root.tsx_

```tsx
import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import stylesheet from "~/tailwind.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export default function App() {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
```

8. tailwind.cssファイルの作成

`app/tailwind.css`ファイルを作成して、Tailwind CSSのディレクティブを追加します。

_app/tailwind.css_

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
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

RemixプロジェクトでのTailwind CSS導入が完了しました。次は、より高度な機能について学びましょう。

### 学習を続けたい方
- **[Tailwind基礎](../tailwind-basics/tailwind-basics.md)**: ユーティリティクラスの詳細な学習
- **[レイアウト＆デザイン](../layout-design/layout-design.md)**: 高度なレイアウト技術の学習
- **[フレームワーク統合](../frameworks/frameworks.md)**: Remixの実践パターン

### 他のフレームワークも試したい方
- **[Next.js（App Router）](nextjs.md)**: Next.jsプロジェクトでの導入
- **[Viteプロジェクト](vite.md)**: Viteプロジェクトでの導入
- **[PostCSS/CLIセットアップ](postcss-cli.md)**: 汎用的な環境での導入

RemixとTailwind CSSの組み合わせで、高性能で堅牢なフルスタックWebアプリケーションを構築していきましょう。