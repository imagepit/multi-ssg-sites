---
title: PostCSS/CLIセットアップ
slug: postcss-cli
parent: installation
file_path: installation/postcss-cli
target_user: "上級開発者、カスタムビルド環境を構築する開発者"
goal: "PostCSSとCLIを使用してTailwind CSSのカスタムビルド環境を構築し、高度なカスタマイズを実現する"
status: completed
post_type: pages
seo_title: "PostCSS/CLIでTailwind CSSセットアップ - カスタムビルド環境の構築ガイド"
seo_keywords: "TailwindCSS,PostCSS,CLI,カスタムビルド,セットアップ,ビルド環境"
seo_description: "PostCSSとCLIを使用してTailwind CSSのカスタムビルド環境を構築する方法を詳しく解説。高度なカスタマイズと最適化の実現方法を紹介します。"
handson_overview: "PostCSSとCLIを使用してTailwind CSSのカスタムビルド環境を構築し、高度なカスタマイズと最適化を実現できます"
---

# PostCSS/CLIセットアップ

PostCSSとCLIを使用したTailwind CSSのセットアップは、最も柔軟で高度なカスタマイズが可能な方法です。フレームワークに依存せず、独自のビルドプロセスを構築できます。この章では、PostCSSとCLIを使用したTailwind CSSの導入方法について詳しく解説します。

## PostCSSとは

PostCSSは、JavaScriptプラグインを使用してCSSを変換するツールです。以下の特徴があります：

- **プラグインエコシステム**: 豊富なプラグインが利用可能
- **モジュラー設計**: 必要な機能のみを選択
- **高度なカスタマイズ**: 独自の変換処理を実装可能
- **パフォーマンス**: 高速なCSS変換処理
- **標準準拠**: CSS標準に準拠した処理

:::note PostCSSの利点

PostCSSを使用することで、以下の利点があります：

- **柔軟性**: 任意のビルドプロセスに組み込み可能
- **カスタマイズ性**: 独自のプラグインや設定を実装可能
- **パフォーマンス**: 必要な処理のみを実行
- **互換性**: 様々なツールとの連携が可能

:::

## 基本的なセットアップ

### 1. プロジェクトの初期化

PostCSSとCLIを使用したTailwind CSSプロジェクトを作成します。

:::step

1. プロジェクトディレクトリの作成

任意の場所（デスクトップなど）で`my-postcss-project`フォルダを作成し、そのディレクトリに移動してください。

_コマンド実行_

```bash
mkdir my-postcss-project
cd my-postcss-project
```

2. package.jsonの初期化

プロジェクトのpackage.jsonファイルを初期化します。

_コマンド実行_

```bash
npm init -y
```

3. 依存関係のインストール

Tailwind CSS、PostCSS、およびその関連パッケージをインストールします。

_コマンド実行_

```bash
npm install -D tailwindcss postcss postcss-cli autoprefixer
```

4. 設定ファイルの生成

Tailwind CSSとPostCSSの設定ファイルを生成します。

_コマンド実行_

```bash
npx tailwindcss init -p
```

5. プロジェクト構造の作成

基本的なプロジェクト構造を作成します。

_コマンド実行_

```bash
mkdir src dist
touch src/input.css src/index.html
```

6. 入力CSSファイルの作成

`src/input.css`ファイルにTailwind CSSのディレクティブを追加します。

_src/input.css_

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* カスタムスタイル */
@layer components {
  .btn-primary {
    @apply bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded;
  }
  
  .card {
    @apply bg-white shadow-md rounded-lg p-6;
  }
}

@layer utilities {
  .text-shadow {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  }
}
```

7. HTMLファイルの作成

`src/index.html`ファイルを作成して、Tailwind CSSをテストします。

_src/index.html_

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PostCSS + Tailwind CSS</title>
  <link href="../dist/output.css" rel="stylesheet">
</head>
<body class="bg-gray-100 min-h-screen">
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold text-center text-gray-800 mb-8">
      PostCSS + Tailwind CSS
    </h1>
    
    <div class="max-w-md mx-auto">
      <div class="card mb-6">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">カスタムコンポーネント</h2>
        <p class="text-gray-600 mb-4">
          PostCSSとTailwind CSSを使用してカスタムコンポーネントを作成しました。
        </p>
        <button class="btn-primary">
          カスタムボタン
        </button>
      </div>
      
      <div class="bg-white shadow-md rounded-lg p-6">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">ユーティリティクラス</h3>
        <p class="text-gray-600 text-shadow">
          カスタムユーティリティクラスも使用できます。
        </p>
      </div>
    </div>
  </div>
</body>
</html>
```

8. package.jsonのスクリプト設定

`package.json`ファイルにビルドスクリプトを追加します。

_package.json_

```json
{
  "name": "my-postcss-project",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "build": "postcss src/input.css -o dist/output.css",
    "watch": "postcss src/input.css -o dist/output.css --watch",
    "dev": "postcss src/input.css -o dist/output.css --watch"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "postcss-cli": "^11.0.0",
    "tailwindcss": "^3.3.6"
  }
}
```

9. ビルドの実行

CSSファイルをビルドします。

_コマンド実行_

```bash
npm run build
```

10. 動作確認

`src/index.html`ファイルをブラウザで開いて、Tailwind CSSが正しく適用されることを確認してください。

:::

## 次のステップ

PostCSSとCLIを使用したTailwind CSSのセットアップが完了しました。次は、より高度な機能について学びましょう。

### 学習を続けたい方
- **[開発・運用](../dev-ops/dev-ops.md)**: パフォーマンス最適化とデザインシステム化
- **[拡張/プラグイン](../extensions/extensions.md)**: カスタムプラグインの作成
- **[フレームワーク統合](../frameworks/frameworks.md)**: 各種フレームワークとの統合

### 他の導入方法も試したい方
- **[Next.js（App Router）](nextjs.md)**: Next.jsプロジェクトでの導入
- **[Viteプロジェクト](vite.md)**: Viteプロジェクトでの導入
- **[Play CDNで試す（最速）](play-cdn.md)**: 環境構築なしでの体験

PostCSSとCLIを使用したカスタムビルドシステムで、高度にカスタマイズされたTailwind CSS環境を構築していきましょう。