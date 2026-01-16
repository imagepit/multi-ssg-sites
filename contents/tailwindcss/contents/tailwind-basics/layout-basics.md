---
title: レイアウト基礎（Flex/Grid/Position）
slug: layout-basics
parent: tailwind-basics
file_path: tailwind-basics/layout-basics
target_user: Tailwind CSS初心者、フロントエンド開発者
goal: "Flexbox、CSS Grid、Positionを使ったモダンなレイアウト手法をTailwind CSSで実装し、実用的なWebコンポーネントの構築方法を習得する"
status: published
post_type: pages
seo_title: Tailwind CSSレイアウト基礎 - Flexbox・Grid・Positionの実践ガイド
seo_keywords: "TailwindCSS,レイアウト,Flexbox,CSS Grid,Position,レスポンシブ,ナビゲーション"
seo_description: "Tailwind CSSでFlexbox、CSS Grid、Positionを使ったモダンなレイアウトを実装。ナビゲーションバー、カードグリッド、サイドバーなど実用的なコンポーネントを手順付きで解説。"
handson_overview: "実際のHTMLコードを書きながらFlexbox、CSS Grid、Positionの各レイアウト手法を体験し、ナビゲーションバーやカードグリッド、サイドバーレイアウトなど実用的なコンポーネントを段階的に構築できます"
---

# 🏗️ レイアウト基礎（Flex/Grid/Position）

WebサイトやWebアプリケーションの構築において、レイアウトは最も重要な要素の一つです。モダンなWeb開発では、Flexbox、CSS Grid、Positionという3つの主要なレイアウト手法を適切に使い分けることで、美しく機能的なデザインを効率的に実装できます。

この章では、Tailwind CSSを使用してこれらのレイアウト手法を実装する方法を学び、実際のWebサイトでよく使われるコンポーネントを構築していきます。従来のfloatやtableを使用したレイアウトとは異なり、これらの手法はレスポンシブデザインにも対応しやすく、コードの保守性も大幅に向上します。

## このページで学べること

このページを完了すると、Tailwind CSSを使用して基本的なレイアウトパターンを実装するスキルが身につきます。

:::note 学習目標

- Flexboxの基本概念とTailwind CSSクラスを理解する
- CSS Gridを使った2次元レイアウトを実装できる
- Positionを使った要素の配置制御を行える
- ナビゲーションバー、カードグリッド、サイドバーレイアウトを構築できる
- 各レイアウト手法の適用場面と使い分けを理解する

:::

## 🎯 Flexboxによる1次元レイアウト

Flexboxは、一方向（行または列）に要素を配置するのに最適なレイアウトシステムです。ナビゲーションバーやボタン配置など、線形なレイアウトに威力を発揮します。

### Flexboxの基本概念

Flexboxでは、**フレックスコンテナ**（親要素）と**フレックスアイテム**（子要素）という概念があります。コンテナに`flex`クラスを適用することで、その子要素が自動的にフレックスアイテムとなり、柔軟な配置が可能になります。

:::note Flexboxの主軸と交差軸

Flexboxには「主軸（main axis）」と「交差軸（cross axis）」という概念があります。デフォルトでは主軸は水平方向、交差軸は垂直方向ですが、`flex-col`を使用すると主軸が垂直方向に変わります。

:::

### 主要なFlexboxクラス

Tailwind CSSでは、Flexboxの各プロパティに対応するクラスが用意されています。

| Tailwindクラス | CSSプロパティ | 説明 |
|---|---|---|
| `flex` | `display: flex` | フレックスコンテナを作成 |
| `flex-col` | `flex-direction: column` | 縦方向に配置 |
| `justify-center` | `justify-content: center` | 主軸方向の中央配置 |
| `items-center` | `align-items: center` | 交差軸方向の中央配置 |
| `flex-1` | `flex: 1 1 0%` | フレックスアイテムが残り空間を占有 |

### Flexboxを使ったナビゲーションバーを作ってみよう

実際にFlexboxを使用して、モダンなナビゲーションバーを構築してみましょう。

:::step

1. 作業ディレクトリの作成

任意の場所（デスクトップなど）で`tailwind-layout-practice`フォルダを作成し、その中に`flexbox-nav.html`ファイルを作成してください。

2. 基本的なナビゲーションバーの実装

`flexbox-nav.html`に以下のコードを追加してください。

_flexbox-nav.html_
```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Flexboxナビゲーション</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
  <!-- ナビゲーションバー -->
  <nav class="bg-white shadow-md">
    <div class="max-w-6xl mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <!-- ロゴ部分 -->
        <div class="flex items-center">
          <div class="bg-blue-600 text-white px-3 py-1 rounded font-bold">
            LOGO
          </div>
        </div>

        <!-- メニュー部分 -->
        <div class="hidden md:flex space-x-8">
          <a href="#" class="text-gray-700 hover:text-blue-600 font-medium">ホーム</a>
          <a href="#" class="text-gray-700 hover:text-blue-600 font-medium">サービス</a>
          <a href="#" class="text-gray-700 hover:text-blue-600 font-medium">会社概要</a>
          <a href="#" class="text-gray-700 hover:text-blue-600 font-medium">お問い合わせ</a>
        </div>

        <!-- ボタン部分 -->
        <div class="flex items-center space-x-4">
          <button class="text-gray-700 hover:text-blue-600 font-medium">ログイン</button>
          <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            サインアップ
          </button>
        </div>
      </div>
    </div>
  </nav>

  <!-- コンテンツエリア -->
  <main class="max-w-6xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-4">Flexboxナビゲーション</h1>
    <p class="text-gray-600">
      ナビゲーションバーがFlexboxを使用して実装されています。
      画面サイズを変更して、レスポンシブな動作を確認してみてください。
    </p>
  </main>
</body>
</html>
```

3. ブラウザで動作確認

作成したHTMLファイルをブラウザで開いて、ナビゲーションバーが正しく表示されることを確認してください。画面幅を変更して、メニューが適切に表示・非表示されることも確認しましょう。

4. カードレイアウトの追加

同じファイルの`main`要素内に、Flexboxを使用したカードレイアウトを追加してください。

_flexbox-nav.html（mainセクション内に追加）_
```html
    <!-- カードレイアウト -->
    <section class="mt-12">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">サービス紹介</h2>
      <div class="flex flex-col md:flex-row gap-6">
        <div class="flex-1 bg-white p-6 rounded-lg shadow-md">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">高速開発</h3>
          <p class="text-gray-600">Tailwind CSSを使用した効率的な開発手法で、短期間での納品を実現します。</p>
        </div>

        <div class="flex-1 bg-white p-6 rounded-lg shadow-md">
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">高品質</h3>
          <p class="text-gray-600">モダンなデザインシステムに基づいた、保守性の高いコードを提供します。</p>
        </div>

        <div class="flex-1 bg-white p-6 rounded-lg shadow-md">
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">ユーザビリティ</h3>
          <p class="text-gray-600">ユーザーの使いやすさを最優先に考えた、直感的なインターフェースを構築します。</p>
        </div>
      </div>
    </section>
```

:::

このハンズオンでは、Flexboxの主要な特徴である要素の配置制御と伸縮性を体験できました。ナビゲーションバーでは`justify-between`で要素を両端に配置し、カードレイアウトでは`flex-1`で各カードが等幅になるよう設定しています。

## 🎨 CSS Gridによる2次元レイアウト

CSS Gridは、行と列の両方向を同時に制御できる2次元レイアウトシステムです。複雑なレイアウトや格子状の配置に最適で、Flexboxでは実現が困難なデザインを簡単に構築できます。

### CSS Gridの基本概念

CSS Gridでは、**グリッドコンテナ**に`grid`クラスを適用し、`grid-cols-{n}`で列数を、`grid-rows-{n}`で行数を指定します。子要素は自動的にグリッドアイテムとなり、指定されたグリッドセルに配置されます。

:::note CSS Gridの特徴

CSS Gridの最大の特徴は、複雑なレイアウトを少ないコードで実現できることです。フラクション単位（`fr`）を使用することで、利用可能な空間を比率で分割でき、レスポンシブなデザインも簡単に実装できます。

:::

### 主要なGridクラス

| Tailwindクラス | CSSプロパティ | 説明 |
|---|---|---|
| `grid` | `display: grid` | グリッドコンテナを作成 |
| `grid-cols-3` | `grid-template-columns: repeat(3, minmax(0, 1fr))` | 3列のグリッドを作成 |
| `col-span-2` | `grid-column: span 2 / span 2` | アイテムが2列分を占有 |
| `gap-4` | `gap: 1rem` | グリッドアイテム間の余白 |
| `grid-rows-4` | `grid-template-rows: repeat(4, minmax(0, 1fr))` | 4行のグリッドを作成 |

### CSS Gridを使ったダッシュボードレイアウトを作ってみよう

管理画面でよく見られるダッシュボードレイアウトをCSS Gridで構築してみましょう。

:::step

1. Gridレイアウトファイルの作成

`tailwind-layout-practice`フォルダ内に`grid-dashboard.html`ファイルを作成してください。

2. ダッシュボードの基本構造を実装

`grid-dashboard.html`に以下のコードを追加してください。

_grid-dashboard.html_
```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CSS Gridダッシュボード</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
  <div class="min-h-screen grid grid-cols-1 lg:grid-cols-4 grid-rows-[auto_1fr] lg:grid-rows-[auto_1fr]">
    <!-- ヘッダー（全幅） -->
    <header class="col-span-full bg-white shadow-sm border-b">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-gray-800">管理ダッシュボード</h1>
          <div class="flex items-center space-x-4">
            <span class="text-gray-600">管理者さん</span>
            <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span class="text-white text-sm font-medium">A</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- サイドバー -->
    <aside class="lg:col-span-1 bg-white border-r">
      <nav class="p-6">
        <ul class="space-y-2">
          <li>
            <a href="#" class="block px-4 py-2 text-blue-600 bg-blue-50 rounded-lg font-medium">
              ダッシュボード
            </a>
          </li>
          <li>
            <a href="#" class="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
              ユーザー管理
            </a>
          </li>
          <li>
            <a href="#" class="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
              売上分析
            </a>
          </li>
          <li>
            <a href="#" class="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
              設定
            </a>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- メインコンテンツエリア -->
    <main class="lg:col-span-3 p-6">
      <!-- 統計カードのグリッド -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-6 rounded-lg shadow-sm border">
          <div class="flex items-center">
            <div class="bg-blue-100 p-3 rounded-lg">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">総ユーザー数</p>
              <p class="text-2xl font-bold text-gray-900">1,234</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm border">
          <div class="flex items-center">
            <div class="bg-green-100 p-3 rounded-lg">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">月間売上</p>
              <p class="text-2xl font-bold text-gray-900">¥567,890</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm border">
          <div class="flex items-center">
            <div class="bg-yellow-100 p-3 rounded-lg">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">注文数</p>
              <p class="text-2xl font-bold text-gray-900">89</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-sm border">
          <div class="flex items-center">
            <div class="bg-purple-100 p-3 rounded-lg">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">コンバージョン率</p>
              <p class="text-2xl font-bold text-gray-900">3.24%</p>
            </div>
          </div>
        </div>
      </div>

      <!-- グラフとテーブルのグリッドレイアウト -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- グラフエリア（2列分） -->
        <div class="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">売上推移</h3>
          <div class="h-64 bg-gradient-to-t from-blue-50 to-white rounded-lg flex items-center justify-center">
            <p class="text-gray-500">グラフエリア（実際のプロジェクトではChart.jsなどを使用）</p>
          </div>
        </div>

        <!-- サイドウィジェット（1列分） -->
        <div class="bg-white p-6 rounded-lg shadow-sm border">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">最近のアクティビティ</h3>
          <div class="space-y-4">
            <div class="flex items-center">
              <div class="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <div>
                <p class="text-sm font-medium text-gray-800">新規ユーザー登録</p>
                <p class="text-xs text-gray-500">2分前</p>
              </div>
            </div>
            <div class="flex items-center">
              <div class="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <div>
                <p class="text-sm font-medium text-gray-800">注文完了</p>
                <p class="text-xs text-gray-500">15分前</p>
              </div>
            </div>
            <div class="flex items-center">
              <div class="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
              <div>
                <p class="text-sm font-medium text-gray-800">システム更新</p>
                <p class="text-xs text-gray-500">1時間前</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</body>
</html>
```

3. ブラウザで動作確認

作成したファイルをブラウザで開いて、ダッシュボードレイアウトが正しく表示されることを確認してください。画面幅を変更して、レスポンシブな動作も確認しましょう。

:::

このダッシュボードでは、CSS Gridの強力な機能を活用しています。`col-span-full`でヘッダーを全幅に配置し、`lg:col-span-2`でグラフエリアを2列分に設定することで、複雑なレイアウトを簡潔に実現しています。

## 📍 Positionによる要素の位置制御

Positionは、要素を文書の通常のフローから取り出して、任意の位置に配置するためのプロパティです。オーバーレイ、固定ナビゲーション、バッジなどの実装に不可欠な機能です。

### Positionの種類と特徴

| Tailwindクラス | CSSプロパティ | 説明 |
|---|---|---|
| `static` | `position: static` | デフォルト（通常のフロー） |
| `relative` | `position: relative` | 元の位置を基準とした相対位置 |
| `absolute` | `position: absolute` | 親要素を基準とした絶対位置 |
| `fixed` | `position: fixed` | ビューポートを基準とした固定位置 |
| `sticky` | `position: sticky` | スクロール位置に応じて固定 |

### Positionを使ったモーダルとバッジを作ってみよう

実際のWebサイトでよく使用されるモーダルダイアログとバッジ機能を実装してみましょう。

:::step

1. Positionレイアウトファイルの作成

`tailwind-layout-practice`フォルダ内に`position-modal.html`ファイルを作成してください。

2. モーダルとバッジの実装

`position-modal.html`に以下のコードを追加してください。

_position-modal.html_
```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Positionレイアウト</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
  <!-- 固定ヘッダー -->
  <header class="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
    <div class="max-w-6xl mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <div class="text-xl font-bold text-gray-800">Position Demo</div>

        <!-- 通知ボタン（バッジ付き） -->
        <button id="notification-btn" class="relative p-2 text-gray-600 hover:text-gray-800">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-3.5-3.5a4.95 4.95 0 01-1.5-3.5V9a6 6 0 10-12 0v1c0 1.28-.53 2.44-1.39 3.29L3 17h5m4 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
          </svg>
          <!-- バッジ -->
          <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            3
          </span>
        </button>

        <!-- モーダル開くボタン -->
        <button id="modal-btn" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          モーダルを開く
        </button>
      </div>
    </div>
  </header>

  <!-- スクロール可能なコンテンツ -->
  <main class="pt-16">
    <!-- Stickyナビゲーション -->
    <nav class="sticky top-16 bg-blue-50 border-b z-40">
      <div class="max-w-6xl mx-auto px-4">
        <div class="flex space-x-8 h-12 items-center">
          <a href="#section1" class="text-blue-600 font-medium">セクション1</a>
          <a href="#section2" class="text-gray-600 hover:text-blue-600">セクション2</a>
          <a href="#section3" class="text-gray-600 hover:text-blue-600">セクション3</a>
        </div>
      </div>
    </nav>

    <!-- コンテンツセクション -->
    <div class="max-w-6xl mx-auto px-4 py-8">
      <section id="section1" class="mb-16">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">セクション1</h2>
        <div class="space-y-4">
          <p class="text-gray-600">ここではPositionプロパティの様々な使用例を確認できます。</p>
          <p class="text-gray-600">上部の固定ヘッダーは`fixed`を使用しており、スクロールしても常に画面上部に表示されます。</p>
          <p class="text-gray-600">通知ボタンのバッジは`absolute`を使用して、ボタンの右上に配置されています。</p>
        </div>

        <!-- 相対位置の例 -->
        <div class="mt-8 p-6 bg-white rounded-lg shadow-sm border">
          <h3 class="text-lg font-semibold mb-4">Relative Positionの例</h3>
          <div class="relative bg-blue-100 p-4 rounded">
            <p>これは相対位置指定のベース要素です</p>
            <div class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
              絶対位置
            </div>
          </div>
        </div>
      </section>

      <section id="section2" class="mb-16">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">セクション2</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white p-6 rounded-lg shadow-sm border h-64">
            <h3 class="text-lg font-semibold mb-2">カード1</h3>
            <p class="text-gray-600">長いコンテンツをスクロールしてSticky Navigationの動作を確認してください。</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-sm border h-64">
            <h3 class="text-lg font-semibold mb-2">カード2</h3>
            <p class="text-gray-600">ヘッダーは固定され、ナビゲーションはスクロール時に上部に固定されます。</p>
          </div>
        </div>
      </section>

      <section id="section3" class="mb-16">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">セクション3</h2>
        <div class="bg-white p-6 rounded-lg shadow-sm border">
          <p class="text-gray-600 mb-4">さらにスクロールして各Positionプロパティの動作の違いを確認してください。</p>
          <p class="text-gray-600">モーダルボタンをクリックすると、`fixed`を使用したオーバーレイが表示されます。</p>
        </div>
      </section>
    </div>
  </main>

  <!-- モーダルオーバーレイ -->
  <div id="modal" class="hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <div class="bg-white rounded-lg p-6 m-4 max-w-md w-full">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">モーダルタイトル</h3>
        <button id="close-modal" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      <p class="text-gray-600 mb-6">
        これは`fixed`ポジションを使用したモーダルダイアログです。
        画面全体をオーバーレイしており、背景をクリックまたはXボタンで閉じることができます。
      </p>
      <div class="flex justify-end space-x-3">
        <button id="cancel-modal" class="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50">
          キャンセル
        </button>
        <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          確認
        </button>
      </div>
    </div>
  </div>

  <!-- スクロールトップボタン -->
  <button id="scroll-top" class="hidden fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 z-40">
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
    </svg>
  </button>

  <script>
    // モーダル制御
    const modal = document.getElementById('modal');
    const modalBtn = document.getElementById('modal-btn');
    const closeModal = document.getElementById('close-modal');
    const cancelModal = document.getElementById('cancel-modal');

    modalBtn.addEventListener('click', () => {
      modal.classList.remove('hidden');
    });

    [closeModal, cancelModal].forEach(btn => {
      btn.addEventListener('click', () => {
        modal.classList.add('hidden');
      });
    });

    // 背景クリックでモーダルを閉じる
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
      }
    });

    // スクロールトップボタン制御
    const scrollTopBtn = document.getElementById('scroll-top');

    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        scrollTopBtn.classList.remove('hidden');
      } else {
        scrollTopBtn.classList.add('hidden');
      }
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  </script>
</body>
</html>
```

3. ブラウザで動作確認

作成したファイルをブラウザで開いて、以下の機能が正しく動作することを確認してください：

- 固定ヘッダーがスクロール時も上部に残る
- Stickyナビゲーションがスクロール時に固定される
- 通知バッジが正しい位置に表示される
- モーダルが画面中央にオーバーレイ表示される
- スクロールトップボタンが一定スクロール後に表示される

:::

このハンズオンでは、Positionプロパティの各種類の実用的な使用例を体験できました。固定ヘッダー、Stickyナビゲーション、絶対位置のバッジ、モーダルオーバーレイなど、現代のWebサイトで必須の機能を実装しています。

## 🎯 レイアウト手法の使い分けガイド

ここまで学習した3つのレイアウト手法には、それぞれ適切な使用場面があります。適切な手法を選択することで、効率的で保守性の高いコードを書くことができます。

### レイアウト手法の比較

| 手法 | 適用場面 | メリット | 注意点 |
|---|---|---|---|
| **Flexbox** | ナビゲーション、ボタン配置、1次元レイアウト | 直感的、要素の整列が簡単 | 2次元レイアウトには不向き |
| **CSS Grid** | ダッシュボード、カードグリッド、2次元レイアウト | 複雑なレイアウトを簡潔に表現 | IE11未対応 |
| **Position** | オーバーレイ、固定要素、バッジ | 要素の重ね合わせが可能 | レスポンシブ対応が複雑 |

### 実用的な組み合わせパターン

実際のWebサイトでは、これらの手法を組み合わせて使用することが一般的です：

:::syntax レイアウト手法の組み合わせ例

```html
<!-- Position（固定ヘッダー） + Flexbox（内部配置） -->
<header class="fixed top-0 left-0 right-0 bg-white">
  <div class="flex justify-between items-center px-4 h-16">
    <div>ロゴ</div>
    <nav class="flex space-x-4">メニュー</nav>
  </div>
</header>

<!-- Grid（メインレイアウト） + Flexbox（カード内部） -->
<main class="grid grid-cols-1 md:grid-cols-3 gap-6">
  <div class="flex flex-col p-4 bg-white rounded">
    <h3>タイトル</h3>
    <p>内容</p>
  </div>
</main>
```

この例では、固定ヘッダーにPosition、ヘッダー内部の配置にFlexbox、メインコンテンツにGrid、各カード内部にFlexboxを使用しています。

:::

## まとめ

この章では、Tailwind CSSを使用した3つの主要なレイアウト手法を学習しました。それぞれの特徴と適用場面を理解することで、効率的で保守性の高いWebサイトを構築できるようになります。

:::note 要点のまとめ

- **Flexbox**は1次元レイアウトに最適で、ナビゲーションやボタン配置に使用
- **CSS Grid**は2次元レイアウトに強力で、ダッシュボードやカードグリッドに最適
- **Position**は要素の重ね合わせや固定配置に不可欠
- 実際のプロジェクトでは複数の手法を組み合わせて使用することが重要
- レスポンシブデザインを意識したクラスの選択が重要

:::

次の章では、[レスポンシブとブレークポイント](breakpoints-responsive.md)について学習します。ここで学んだレイアウト手法を基に、様々なデバイスサイズに対応したレスポンシブデザインの実装方法を習得していきます。

## 関連リンク

- [Tailwind CSS Flexbox公式ドキュメント](https://tailwindcss.com/docs/flex)
- [Tailwind CSS Grid公式ドキュメント](https://tailwindcss.com/docs/grid-template-columns)
- [Tailwind CSS Position公式ドキュメント](https://tailwindcss.com/docs/position)
- [CSS Grid Complete Guide (CSS Tricks)](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [Flexbox Complete Guide (CSS Tricks)](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)

## さらに深く学習したい方へ

より高度なレイアウト技術やデザインパターンについて学習したい方は、当プラットフォームの[レイアウト&デザイン](../layout-design/layout-design.md)コースをお勧めします。実際のプロジェクトで使用される複雑なレイアウトパターンや、パフォーマンスを考慮した実装手法を学習できます。