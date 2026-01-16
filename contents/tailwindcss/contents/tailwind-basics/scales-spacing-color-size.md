---
title: スペーシング/サイズ/色のスケール
slug: scales-spacing-color-size
parent: tailwind-basics
file_path: tailwind-basics/scales-spacing-color-size
target_user: "Tailwind CSS初学者"
goal: "Tailwind CSSのデザインシステムの核心となるスケール概念を理解し、スペーシング、サイズ、色のスケールを実際のUIコンポーネントで活用できるようになる"
status: publish
post_type: pages
seo_title: "Tailwind CSSのスペーシング・サイズ・色のスケール完全ガイド | 一貫性のあるデザインシステムを構築"
seo_keywords: "Tailwind CSS, スペーシングスケール, カラーパレット, サイズスケール, デザインシステム, 色階層, レスポンシブデザイン"
seo_description: "Tailwind CSSのスペーシング、サイズ、色のスケール概念を実践的に学習。0.25rem刻みのスペーシングや50〜950の色階層を使って、一貫性のあるUIコンポーネントを作る方法を解説します。"
handson_overview: "実際のUIカードコンポーネントを作成しながら、スペーシングスケール（0.25rem刻み）、サイズスケール（sm/md/lg）、カラーパレット（50〜950）の使い分けを実践的に学習します。"
---

## 🎨 はじめに

Tailwind CSSの魅力の一つは、一貫性のあるデザインシステムを簡単に実現できることです。その核心となるのがスケール概念です。スペーシング、サイズ、色のそれぞれに体系的なスケールが用意されており、これらを理解することで美しく統一感のあるUIを効率的に構築できます。

### このページで学べること

:::note 学習内容

- Tailwind CSSのスケール概念とデザインシステムにおける重要性
- スペーシングスケール（0.25rem刻み）の仕組みと実践的な使い方
- カラーパレットの階層構造（50〜950）とアクセシビリティを考慮した色選択
- サイズスケールの一貫性とレスポンシブデザインへの応用
- 実際のUIコンポーネントでスケールを活用する具体的な手法

:::

## 📏 スペーシングスケールの理解

Tailwind CSSのスペーシングシステムは、`0.25rem`（4px）を基本単位とした体系的なスケールを採用しています。これにより視覚的に美しく、開発効率の高いレイアウトを実現できます。

:::note スペーシングスケールとは

Tailwind CSSでは、マージン（`m-*`）、パディング（`p-*`）、幅（`w-*`）、高さ（`h-*`）などに使用される数値が統一されたスケールに基づいています。この仕組みにより、デザイナーと開発者が同じ言語で対話でき、一貫性のあるUIを効率的に構築できます。

:::

### スペーシングスケールの基本単位

```css
/* Tailwind CSSのスペーシングスケール例 */
.space-1  { /* 4px */  }
.space-2  { /* 8px */  }
.space-4  { /* 16px */ }
.space-8  { /* 32px */ }
.space-16 { /* 64px */ }
```

スケールは指数関数的に増加し、小さな調整から大きなレイアウトまで柔軟に対応できます。特に`space-4`（16px）は多くのデザインシステムで基準となる値として使われます。

### よく使用されるスペーシング値

:::syntax スペーシングクラスの構文

```html
<!-- パディング -->
<div class="p-4">16pxのパディング</div>
<div class="px-6 py-4">水平24px、垂直16pxのパディング</div>

<!-- マージン -->
<div class="m-8">32pxのマージン</div>
<div class="mt-2 mb-4">上8px、下16pxのマージン</div>

<!-- 間隔 -->
<div class="space-y-4">子要素間に16pxの垂直間隔</div>
```

- `p-*`: パディング（内側の余白）
- `m-*`: マージン（外側の余白）
- `space-*`: 子要素間の間隔

:::

## 🌈 カラーパレットの階層システム

Tailwind CSSの色システムは、各色に対して50から950までの明度レベルを提供します。この階層的なアプローチにより、アクセシブルで美しい配色を簡単に実現できます。

### 色階層の構造

```html
<!-- Blue色の階層例 -->
<div class="bg-blue-50">最も明るい青（#eff6ff）</div>
<div class="bg-blue-100">より明るい青（#dbeafe）</div>
<div class="bg-blue-500">標準的な青（#3b82f6）</div>
<div class="bg-blue-700">より暗い青（#1d4ed8）</div>
<div class="bg-blue-950">最も暗い青（#172554）</div>
```

### アクセシビリティを考慮した色選択

:::important コントラスト比の重要性

WCAG 2.1のガイドラインに従い、テキストと背景色のコントラスト比を適切に保つことが重要です。一般的に以下の組み合わせが推奨されます：

- 明るい背景（50-200）には暗いテキスト（700-950）
- 暗い背景（700-950）には明るいテキスト（50-200）
- 中間色（400-600）は注意深く使用する

:::

## 📐 サイズスケールの一貫性

Tailwind CSSでは、テキストサイズ、幅、高さなどに一貫したサイズスケールが適用されています。これにより視覚的なリズムと階層を作り出せます。

### テキストサイズのスケール

```html
<h1 class="text-4xl">見出し1（36px）</h1>
<h2 class="text-2xl">見出し2（24px）</h2>
<h3 class="text-xl">見出し3（20px）</h3>
<p class="text-base">本文（16px）</p>
<small class="text-sm">小さなテキスト（14px）</small>
```

### 幅と高さのスケール

```html
<!-- 固定サイズ -->
<div class="w-64 h-32">幅256px、高さ128px</div>

<!-- レスポンシブサイズ -->
<div class="w-full md:w-1/2 lg:w-1/3">レスポンシブ幅</div>
```

## 🛠️ スケールを活用したUIコンポーネント制作

実際にスケールを使ってプロフィールカードコンポーネントを作成し、スケールの実践的な活用方法を学習しましょう。

### スケールを使ったプロフィールカードを作ってみよう

それでは、学習した内容を活用してプロフィールカードコンポーネントを作成してみましょう。スペーシング、色、サイズのスケールを組み合わせて一貫性のあるUIを構築します。

:::step

1. **基本的なHTMLファイルを作成**

作業用のHTMLファイルを作成し、Tailwind CSSをCDNで読み込みます。

_profile-card.html_
```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>プロフィールカード - Tailwind CSSスケール学習</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 p-8">
  <!-- ここにプロフィールカードを作成していきます -->
</body>
</html>
```

2. **基本的なカード構造を作成**

スペーシングスケールを使用してカードの基本構造を作成します。

_profile-card.html（bodyタグ内に追加）_
```html
<div class="max-w-md mx-auto">
  <!-- //addstart -->
  <div class="bg-white rounded-lg shadow-lg p-6">
    <h2 class="text-2xl font-bold text-gray-900 mb-4">プロフィールカード</h2>
    <p class="text-gray-600">基本的なカード構造</p>
  </div>
  <!-- //addend -->
</div>
```

この段階で以下のスケールを使用しています：
- `p-6`: 24pxのパディング（スペーシングスケール）
- `mb-4`: 16pxの下マージン（スペーシングスケール）
- `text-2xl`: 24pxのテキストサイズ（サイズスケール）

3. **ユーザー情報セクションを追加**

アバター画像とユーザー情報を追加し、カラーパレットを活用します。

_profile-card.html（カード内のコンテンツを更新）_
```html
<div class="bg-white rounded-lg shadow-lg p-6">
  <!-- //addstart -->
  <!-- ヘッダー部分 -->
  <div class="flex items-center space-x-4 mb-6">
    <div class="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
      <span class="text-white text-xl font-bold">YT</span>
    </div>
    <div>
      <h3 class="text-xl font-bold text-gray-900">山田 太郎</h3>
      <p class="text-gray-600">フロントエンドエンジニア</p>
    </div>
  </div>
  <!-- //addend -->

  <!-- //delstart -->
  <h2 class="text-2xl font-bold text-gray-900 mb-4">プロフィールカード</h2>
  <p class="text-gray-600">基本的なカード構造</p>
  <!-- //delend -->
</div>
```

ここで使用したスケール：
- `w-16 h-16`: 64px × 64pxのアバター（サイズスケール）
- `space-x-4`: 水平方向に16pxの間隔（スペーシングスケール）
- `mb-6`: 24pxの下マージン（スペーシングスケール）
- `bg-blue-500`: 標準的な青色（カラーパレット）
- `text-gray-600`: 中間的なグレー（カラーパレット）

4. **統計情報セクションを追加**

数値情報を表示するセクションを追加し、さらにスケールを活用します。

_profile-card.html（ヘッダー部分の下に追加）_
```html
<!-- ヘッダー部分の下に追加 -->
<!-- //addstart -->
<!-- 統計情報 -->
<div class="grid grid-cols-3 gap-4 mb-6">
  <div class="text-center">
    <div class="text-2xl font-bold text-blue-600">128</div>
    <div class="text-sm text-gray-500">プロジェクト</div>
  </div>
  <div class="text-center">
    <div class="text-2xl font-bold text-green-600">89%</div>
    <div class="text-sm text-gray-500">完了率</div>
  </div>
  <div class="text-center">
    <div class="text-2xl font-bold text-purple-600">4.8</div>
    <div class="text-sm text-gray-500">評価</div>
  </div>
</div>
<!-- //addend -->
```

新しく使用したスケール：
- `gap-4`: グリッド要素間に16pxの間隔（スペーシングスケール）
- `text-blue-600`, `text-green-600`, `text-purple-600`: 異なる色の同じ明度レベル（カラーパレット）
- `text-sm`: 14pxの小さなテキスト（サイズスケール）

5. **スキルタグセクションを追加**

スキルを表示するタグコンポーネントを追加します。

_profile-card.html（統計情報の下に追加）_
```html
<!-- 統計情報の下に追加 -->
<!-- //addstart -->
<!-- スキル -->
<div class="mb-6">
  <h4 class="text-lg font-semibold text-gray-900 mb-3">スキル</h4>
  <div class="flex flex-wrap gap-2">
    <span class="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">React</span>
    <span class="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Vue.js</span>
    <span class="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">JavaScript</span>
    <span class="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">TypeScript</span>
    <span class="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">Tailwind CSS</span>
  </div>
</div>
<!-- //addend -->
```

タグで使用したスケール：
- `px-3 py-1`: 水平12px、垂直4pxのパディング（スペーシングスケール）
- `gap-2`: タグ間に8pxの間隔（スペーシングスケール）
- `mb-3`: 12pxの下マージン（スペーシングスケール）
- `bg-*-100` と `text-*-800`: 明るい背景と暗いテキストの組み合わせ（カラーパレット）

6. **アクションボタンを追加**

最後にアクションボタンを追加して、カードを完成させます。

_profile-card.html（スキルセクションの下に追加）_
```html
<!-- スキルセクションの下に追加 -->
<!-- //addstart -->
<!-- アクションボタン -->
<div class="flex space-x-3">
  <button class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
    メッセージ
  </button>
  <button class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors">
    詳細表示
  </button>
</div>
<!-- //addend -->
```

ボタンで使用したスケール：
- `space-x-3`: ボタン間に12pxの間隔（スペーシングスケール）
- `py-2 px-4`: 垂直8px、水平16pxのパディング（スペーシングスケール）
- `bg-blue-600` と `hover:bg-blue-700`: ホバー時の色変化（カラーパレット）

7. **ブラウザで動作確認**

作成したHTMLファイルをブラウザで開き、プロフィールカードの表示を確認します。

:::

### 完成したプロフィールカードの分析

作成したプロフィールカードでは、以下のスケール活用パターンを実践しました：

:::note スケール活用のポイント

**スペーシングスケール**
- 一貫した余白（`p-6`, `mb-4`, `space-x-4`）により統一感のあるレイアウト
- 階層に応じた間隔調整（ヘッダー：`mb-6`、スキル：`mb-3`）

**カラーパレット**
- 同じ明度レベルでの色分け（`*-600`系統での統一）
- アクセシブルな色組み合わせ（`*-100`背景 + `*-800`テキスト）

**サイズスケール**
- 視覚的階層の明確化（`text-2xl` > `text-xl` > `text-base` > `text-sm`）
- 統一されたコンポーネントサイズ（`w-16 h-16`のアバター）

:::

## 🎯 レスポンシブデザインでのスケール活用

スケールシステムはレスポンシブデザインとも密接に連携しています。ブレークポイントに応じてスペーシングやサイズを調整する方法を学習しましょう。

### レスポンシブスペーシングの実践

```html
<!-- モバイル：小さなパディング、デスクトップ：大きなパディング -->
<div class="p-4 md:p-8 lg:p-12">
  レスポンシブパディング
</div>

<!-- モバイル：密な間隔、デスクトップ：広い間隔 -->
<div class="space-y-2 md:space-y-4 lg:space-y-6">
  <div>アイテム1</div>
  <div>アイテム2</div>
  <div>アイテム3</div>
</div>
```

### レスポンシブタイポグラフィ

```html
<!-- 画面サイズに応じたテキストサイズ調整 -->
<h1 class="text-2xl md:text-4xl lg:text-6xl">
  レスポンシブ見出し
</h1>

<p class="text-sm md:text-base lg:text-lg">
  レスポンシブ本文
</p>
```

## 🎨 カスタムスケールの拡張

プロジェクトの要件に応じて、Tailwind CSSのスケールをカスタマイズすることも可能です。

### tailwind.config.jsでのスケール拡張

```javascript
module.exports = {
  theme: {
    extend: {
      spacing: {
        '18': '4.5rem',    // 72px
        '88': '22rem',     // 352px
      },
      fontSize: {
        'xs': '0.75rem',   // 12px
        '2.5xl': '1.75rem', // 28px
      },
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          900: '#0c4a6e',
        }
      }
    }
  }
}
```

## まとめ

Tailwind CSSのスケールシステムは、一貫性のあるデザインシステムを構築するための強力な基盤です。スペーシング、色、サイズの各スケールを理解し適切に活用することで、美しく保守性の高いUIを効率的に開発できます。

:::note 要点のまとめ

- **スペーシングスケール**: 0.25rem刻みの体系的な余白システムで統一感のあるレイアウトを実現
- **カラーパレット**: 50〜950の明度階層でアクセシブルで美しい配色を簡単に構築
- **サイズスケール**: 一貫したテキストサイズと要素サイズで視覚的階層を明確化
- **レスポンシブ対応**: ブレークポイントに応じたスケール調整で最適なUXを提供
- **カスタマイズ性**: プロジェクト要件に応じてスケールを拡張可能

:::

次章では、これらのスケールを基盤として、タイポグラフィの詳細な設定方法について学習します。フォント、行間、字間の最適化により、さらに読みやすく美しいテキスト表現を実現していきましょう。

[タイポグラフィ基礎（フォント/行間/字間）](./typography-basics)

## 関連リンク

- [ユーティリティクラスの基本](./utility-basics)
- [レイアウト基礎（Flex/Grid/Position）](./layout-basics)
- [レスポンシブとブレークポイント](./breakpoints-responsive)
- [Tailwind CSS公式ドキュメント - Spacing](https://tailwindcss.com/docs/spacing)
- [Tailwind CSS公式ドキュメント - Colors](https://tailwindcss.com/docs/colors)

## さらに深く学習したい方へ

Tailwind CSSのスケールシステムをマスターしたら、次はより高度なレイアウト設計やコンポーネント実装に挑戦してみましょう。当サイトの上級編では、実際のプロダクト開発で使える実践的なテクニックを豊富な事例とともに解説しています。