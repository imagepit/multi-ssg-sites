---
title: Laravel + Vite
slug: laravel
parent: installation
file_path: installation/laravel
target_user: "Laravel開発者、PHP開発者"
goal: "LaravelプロジェクトにTailwind CSSを導入し、Viteを使用してモダンなWebアプリケーションを構築する"
status: completed
post_type: pages
seo_title: "Laravel + ViteでTailwind CSS導入 - PHPフレームワークでのセットアップガイド"
seo_keywords: "TailwindCSS,Laravel,Vite,PHP,導入方法,セットアップ,Webアプリケーション"
seo_description: "LaravelプロジェクトにTailwind CSSを導入する方法を詳しく解説。Viteを使用したモダンなWebアプリケーションでの実践的な導入手順を紹介します。"
handson_overview: "LaravelプロジェクトでTailwind CSSを使用できるよう、実際のプロジェクト作成から設定までハンズオン形式で学習できます"
---

# Laravel + Vite

Laravelは、PHPで最も人気のあるWebアプリケーションフレームワークです。Laravel 9以降ではViteがデフォルトのビルドツールとして採用され、Tailwind CSSとの組み合わせにより、モダンで高性能なWebアプリケーションを構築できます。この章では、LaravelプロジェクトでのTailwind CSS導入方法について詳しく解説します。

## Laravelとは

Laravelは、以下の特徴を持つPHPフレームワークです：

- **PHPベース**: PHPのエコシステムを活用
- **MVCアーキテクチャ**: モデル・ビュー・コントローラーの設計
- **Eloquent ORM**: 直感的なデータベース操作
- **Bladeテンプレート**: 強力なテンプレートエンジン
- **Artisan CLI**: 開発効率を向上させるコマンドラインツール
- **豊富な機能**: 認証、ルーティング、ミドルウェアなど

:::note Laravelの利点

Laravelを使用することで、以下の利点があります：

- **開発効率**: 豊富な機能とツールによる迅速な開発
- **保守性**: 明確なアーキテクチャとコーディング規約
- **エコシステム**: 豊富なパッケージとコミュニティ
- **スケーラビリティ**: 大規模アプリケーションの構築が容易

:::

## 新規プロジェクトでの導入

### 1. Laravelプロジェクトの作成

Tailwind CSSが組み込まれたLaravelプロジェクトを作成します。

:::step

1. プロジェクトディレクトリの作成

任意の場所（デスクトップなど）で`my-laravel-app`フォルダを作成し、そのディレクトリに移動してください。

_コマンド実行_

```bash
mkdir my-laravel-app
cd my-laravel-app
```

2. Laravelプロジェクトの作成

Laravelプロジェクトを作成します。

_コマンド実行_

```bash
composer create-project laravel/laravel .
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

生成された`tailwind.config.js`ファイルを編集して、Laravelのファイル構造に合わせて設定します。

_tailwind.config.js_

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.vue",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

7. CSSファイルの設定

`resources/css/app.css`ファイルにTailwind CSSのディレクティブを追加します。

_resources/css/app.css_

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

8. Vite設定の確認

`vite.config.js`ファイルでCSSファイルが正しく設定されていることを確認します。

_vite.config.js_

```javascript
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
    ],
});
```

9. Bladeテンプレートの更新

`resources/views/welcome.blade.php`ファイルを更新して、Viteアセットを読み込みます。

_resources/views/welcome.blade.php_

```blade
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Laravel + Tailwind CSS</title>
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    </head>
    <body class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div class="container mx-auto px-4 py-16">
            <div class="text-center mb-12">
                <h1 class="text-5xl font-bold text-gray-900 mb-4">
                    Welcome to Laravel
                </h1>
                <p class="text-xl text-gray-600 max-w-2xl mx-auto">
                    Tailwind CSSとLaravelを使用したモダンなWebアプリケーション
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                    <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-900 mb-2">Laravel</h3>
                    <p class="text-gray-600">
                        PHPで最も人気のあるWebアプリケーションフレームワークです。
                    </p>
                </div>

                <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                    <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-900 mb-2">Vite</h3>
                    <p class="text-gray-600">
                        高速なビルドツールで開発効率を大幅に向上させます。
                    </p>
                </div>

                <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                    <div class="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-900 mb-2">Tailwind CSS</h3>
                    <p class="text-gray-600">
                        ユーティリティファーストのCSSフレームワークです。
                    </p>
                </div>
            </div>
        </div>
    </body>
</html>
```

10. 開発サーバーの起動

開発サーバーを起動して動作確認を行います。

_コマンド実行_

```bash
php artisan serve
```

別のターミナルでViteの開発サーバーも起動します。

_コマンド実行_

```bash
npm run dev
```

11. ブラウザで確認

ブラウザで`http://localhost:8000`にアクセスして、Tailwind CSSが適用されたページが表示されることを確認してください。

:::

## 次のステップ

LaravelプロジェクトでのTailwind CSS導入が完了しました。次は、より高度な機能について学びましょう。

### 学習を続けたい方
- **[Tailwind基礎](../tailwind-basics/tailwind-basics.md)**: ユーティリティクラスの詳細な学習
- **[レイアウト＆デザイン](../layout-design/layout-design.md)**: 高度なレイアウト技術の学習
- **[フレームワーク統合](../frameworks/frameworks.md)**: Laravelの実践パターン

### 他のフレームワークも試したい方
- **[Next.js（App Router）](nextjs.md)**: Next.jsプロジェクトでの導入
- **[Viteプロジェクト](vite.md)**: Viteプロジェクトでの導入
- **[Nuxt/Vue](nuxt-vue.md)**: Nuxt/Vueプロジェクトでの導入

LaravelとTailwind CSSの組み合わせで、モダンで高性能なPHP Webアプリケーションを構築していきましょう。