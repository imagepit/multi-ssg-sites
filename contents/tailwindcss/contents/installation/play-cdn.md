---
title: Play CDNで試す（最速）
slug: play-cdn
parent: installation
file_path: installation/play-cdn
target_user: "Tailwind CSS初心者、プロトタイピングを行う開発者"
goal: "環境構築なしでTailwind CSSの基本的な使い方を体験し、ユーティリティファーストの考え方を理解する"
status: completed
post_type: pages
seo_title: "Tailwind CSS Play CDN - 環境構築なしで最速でTailwind CSSを試す方法"
seo_keywords: "TailwindCSS,Play CDN,最速,環境構築なし,プロトタイピング,学習"
seo_description: "Tailwind CSS Play CDNを使用して環境構築なしで最速でTailwind CSSを体験する方法を解説。プロトタイピングや学習に最適な導入方法を紹介します。"
handson_overview: "環境構築なしでTailwind CSSの基本的な使い方をハンズオン形式で体験し、ユーティリティクラスの効果を実感できます"
---

# Play CDNで試す（最速）

Tailwind CSSを最も簡単に体験する方法が、Play CDNを使用することです。環境構築やパッケージのインストールが一切不要で、HTMLファイルにCDNリンクを追加するだけで、すぐにTailwind CSSの機能を試すことができます。

## Play CDNとは

Play CDNは、Tailwind CSSの公式が提供するCDNサービスです。本番環境での使用は推奨されませんが、学習やプロトタイピングには最適な方法です。

### 特徴
- **環境構築不要**: Node.jsやパッケージマネージャーが不要
- **即座に使用可能**: HTMLファイルにリンクを追加するだけ
- **最新版の提供**: 常に最新のTailwind CSSが利用可能
- **JITモード対応**: 動的なクラス生成に対応

:::warning 本番環境での使用について

Play CDNは本番環境での使用は推奨されません。以下の理由があります：

- **パフォーマンス**: 全機能が含まれるためファイルサイズが大きい
- **カスタマイズ不可**: デフォルト設定のみ使用可能
- **依存関係**: CDNの可用性に依存
- **セキュリティ**: 外部リソースへの依存

本番環境では、適切なビルドプロセスを使用してください。

:::

## 基本的な使用方法

### 1. HTMLファイルの作成

任意の場所（デスクトップなど）で`tailwind-play.html`ファイルを作成します。

### 2. CDNリンクの追加

HTMLファイルの`<head>`セクションにTailwind CSSのCDNリンクを追加します。

_tailwind-play.html_

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tailwind CSS Play CDN</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <h1 class="text-4xl font-bold text-blue-600 text-center mt-8">
    Hello Tailwind CSS!
  </h1>
  <p class="text-gray-600 text-center mt-4">
    環境構築なしでTailwind CSSを体験中
  </p>
</body>
</html>
```

### 3. ブラウザで確認

作成したHTMLファイルをブラウザで開いて、Tailwind CSSのスタイルが適用されていることを確認します。

## ハンズオン: 基本的なコンポーネントを作成

それでは、実際にTailwind CSSのユーティリティクラスを使用して、基本的なコンポーネントを作成してみましょう。

:::step

1. HTMLファイルの準備

任意の場所（デスクトップなど）で`tailwind-components.html`ファイルを作成し、以下の基本構造を記述してください。

_tailwind-components.html_

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tailwind CSS コンポーネント</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen">
  <!-- ここにコンポーネントを追加していきます -->
</body>
</html>
```

2. カードコンポーネントの作成

`<body>`タグ内に以下のカードコンポーネントを追加してください。

```html
<div class="max-w-md mx-auto mt-8 bg-white rounded-lg shadow-md overflow-hidden">
  <div class="px-6 py-4">
    <div class="font-bold text-xl mb-2 text-gray-800">カードタイトル</div>
    <p class="text-gray-600 text-base">
      これはTailwind CSSを使用して作成されたカードコンポーネントです。
      ユーティリティクラスを組み合わせることで、美しいデザインを実現しています。
    </p>
  </div>
  <div class="px-6 pt-4 pb-2">
    <span class="inline-block bg-blue-200 rounded-full px-3 py-1 text-sm font-semibold text-blue-800 mr-2 mb-2">
      #tailwind
    </span>
    <span class="inline-block bg-green-200 rounded-full px-3 py-1 text-sm font-semibold text-green-800 mr-2 mb-2">
      #css
    </span>
  </div>
</div>
```

3. ボタンコンポーネントの追加

カードコンポーネントの下に、以下のボタンコンポーネントを追加してください。

```html
<div class="max-w-md mx-auto mt-8 text-center">
  <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4">
    プライマリボタン
  </button>
  <button class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
    セカンダリボタン
  </button>
</div>
```

4. フォームコンポーネントの追加

ボタンコンポーネントの下に、以下のフォームコンポーネントを追加してください。

```html
<div class="max-w-md mx-auto mt-8 bg-white p-6 rounded-lg shadow-md">
  <h2 class="text-2xl font-bold text-gray-800 mb-4">お問い合わせフォーム</h2>
  <form class="space-y-4">
    <div>
      <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
        お名前
      </label>
      <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="お名前を入力してください">
    </div>
    <div>
      <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
        メールアドレス
      </label>
      <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="メールアドレスを入力してください">
    </div>
    <div>
      <label class="block text-gray-700 text-sm font-bold mb-2" for="message">
        メッセージ
      </label>
      <textarea class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="message" rows="4" placeholder="メッセージを入力してください"></textarea>
    </div>
    <div class="text-center">
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
        送信
      </button>
    </div>
  </form>
</div>
```

5. ブラウザで確認

作成したHTMLファイルをブラウザで開いて、以下の要素が正しく表示されることを確認してください：

- カードコンポーネント（白い背景、影、角丸）
- ボタンコンポーネント（ホバー効果付き）
- フォームコンポーネント（入力フィールド、ラベル）

:::

## レスポンシブデザインの体験

Tailwind CSSのレスポンシブ機能を体験してみましょう。

### レスポンシブグリッドの作成

_tailwind-responsive.html_

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>レスポンシブデザイン</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 p-4">
  <div class="max-w-6xl mx-auto">
    <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">
      レスポンシブグリッド
    </h1>
    
    <!-- レスポンシブグリッド -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-xl font-semibold mb-2 text-gray-800">カード 1</h3>
        <p class="text-gray-600">モバイルでは1列、タブレットでは2列、デスクトップでは3列で表示されます。</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-xl font-semibold mb-2 text-gray-800">カード 2</h3>
        <p class="text-gray-600">Tailwind CSSのレスポンシブクラスを使用して実現しています。</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-xl font-semibold mb-2 text-gray-800">カード 3</h3>
        <p class="text-gray-600">ブレークポイントに応じて自動的にレイアウトが変更されます。</p>
      </div>
    </div>
  </div>
</body>
</html>
```

## ダークモードの体験

Tailwind CSSのダークモード機能も体験できます。

### ダークモード対応コンポーネント

_tailwind-dark-mode.html_

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ダークモード対応</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
    }
  </script>
</head>
<body class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
  <div class="max-w-4xl mx-auto p-6">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">ダークモード対応サイト</h1>
      <button onclick="toggleDarkMode()" class="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg">
        ダークモード切り替え
      </button>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
        <h2 class="text-xl font-semibold mb-4">ライトモード</h2>
        <p class="text-gray-600 dark:text-gray-300">
          このコンテンツはライトモードとダークモードの両方に対応しています。
        </p>
      </div>
      <div class="bg-blue-100 dark:bg-blue-900 p-6 rounded-lg">
        <h2 class="text-xl font-semibold mb-4">カラーテーマ</h2>
        <p class="text-blue-800 dark:text-blue-200">
          色も自動的にダークモードに適応されます。
        </p>
      </div>
    </div>
  </div>

  <script>
    function toggleDarkMode() {
      document.documentElement.classList.toggle('dark');
    }
  </script>
</body>
</html>
```

## カスタマイズの体験

Play CDNでも基本的なカスタマイズが可能です。

### カスタム設定の例

_tailwind-custom.html_

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>カスタム設定</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            'brand-blue': '#1e40af',
            'brand-green': '#059669',
          },
          fontFamily: {
            'custom': ['Georgia', 'serif'],
          }
        }
      }
    }
  </script>
</head>
<body class="bg-gray-50 font-custom">
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-4xl font-bold text-brand-blue mb-8 text-center">
      カスタム設定の例
    </h1>
    
    <div class="bg-white p-8 rounded-lg shadow-lg">
      <h2 class="text-2xl font-semibold text-brand-green mb-4">
        カスタムカラーとフォント
      </h2>
      <p class="text-gray-700 leading-relaxed">
        この例では、カスタムカラー（brand-blue、brand-green）とカスタムフォント（Georgia）を定義しています。
        Play CDNでも基本的なカスタマイズが可能です。
      </p>
      
      <div class="mt-6 flex space-x-4">
        <button class="bg-brand-blue hover:bg-blue-800 text-white px-6 py-2 rounded-lg transition-colors">
          ブランドブルー
        </button>
        <button class="bg-brand-green hover:bg-green-800 text-white px-6 py-2 rounded-lg transition-colors">
          ブランドグリーン
        </button>
      </div>
    </div>
  </div>
</body>
</html>
```

## 次のステップ

Play CDNでTailwind CSSの基本的な使い方を体験できましたか？次は、実際のプロジェクトで使用するための環境構築について学びましょう。

### 本格的な開発を始めたい方
- **[Next.js（App Router）](nextjs.md)**: React/Next.jsプロジェクトでの導入
- **[Viteプロジェクト](vite.md)**: Viteを使用したプロジェクトでの導入
- **[PostCSS/CLIセットアップ](postcss-cli.md)**: 汎用的な環境での導入

### 学習を続けたい方
- **[Tailwind基礎](../tailwind-basics/tailwind-basics.md)**: ユーティリティクラスの詳細な学習
- **[レイアウト＆デザイン](../layout-design/layout-design.md)**: 高度なレイアウト技術の学習

Play CDNで体験した内容を基に、より本格的な開発環境でTailwind CSSを活用していきましょう。