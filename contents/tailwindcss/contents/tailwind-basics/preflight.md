---
title: Preflightとリセットの考え方
slug: preflight
parent: tailwind-basics
file_path: tailwind-basics/preflight
target_user: Tailwind CSS初心者、フロントエンド開発者
goal: "Tailwind CSSのPreflightの役割と重要性を理解し、CSSリセットとの違いを把握して適切に設定・カスタマイズできるようになる"
status: not_started
post_type: pages
seo_title: Tailwind CSS Preflight完全ガイド - CSSリセットとの違いと設定方法
seo_keywords: "TailwindCSS,Preflight,CSSリセット,ブラウザデフォルト,初期化,設定,カスタマイズ"
seo_description: "Tailwind CSSのPreflightの役割と重要性を詳しく解説。従来のCSSリセットとの違い、設定方法、カスタマイズ方法をハンズオンで学習できます。"
handson_overview: "実際にHTMLファイルを作成してPreflightの効果をbefore/afterで確認し、設定の変更やカスタマイズ方法を実践的に学習できます"
---

# ⚡ Preflightとリセットの考え方

Tailwind CSSを使い始めると、デフォルトでブラウザの初期スタイルがリセットされていることに気づくでしょう。これは**Preflight**という機能によるものです。この章では、Preflightが何をしているのか、なぜ重要なのか、そしてどのようにカスタマイズできるのかを詳しく学習します。

PreflightはTailwind CSSが自動的に適用するモダンなCSSリセットで、ブラウザ間の表示差異を解消し、ユーティリティクラスが予測どおりに動作する基盤を提供します。従来のCSSリセットとは異なるアプローチで、開発者がより効率的にスタイリングできる環境を作り出します。

## このページで学べること

このページを完了すると、Tailwind CSSのPreflightの仕組みを理解し、プロジェクトの要件に応じて適切に設定・カスタマイズできるようになります。

:::note 学習目標

- Preflightとは何か、その役割を理解する
- 従来のCSSリセットとの違いを把握する
- Preflightが解決する問題を体験する
- Preflightの無効化方法を覚える
- Preflightをカスタマイズする方法を学ぶ
- 他のCSSライブラリとの競合回避方法を知る

:::

## Preflightとは何か

Preflightは、Tailwind CSSが自動的に適用する**モダンなCSSリセット**です。ブラウザのデフォルトスタイルを一貫性のある状態にリセットし、ユーティリティクラスが予測どおりに動作する基盤を提供します。

### Preflightが行う主な処理

Preflightは以下のような処理を自動的に行います：

1. **マージンとパディングのリセット**: すべての要素のmarginとpaddingを0にする
2. **ボーダーのリセット**: デフォルトのボーダースタイルを統一する
3. **継承の最適化**: フォントサイズやline-heightの継承を改善する
4. **フォームスタイルの正規化**: input、button、selectなどの見た目を統一する
5. **ブラウザ間の差異の解消**: 各ブラウザの独自スタイルを統一する

:::note Preflightの基盤技術

PreflightはModern Normalizeをベースに、Tailwind CSSの哲学に合わせてカスタマイズされたCSSリセットです。

:::

## 従来のCSSリセットとの違い

従来のCSSリセットとPreflightには重要な違いがあります。これらの違いを理解することで、Preflightの利点をより深く理解できます。

### 従来のCSSリセット（CSS Reset）

従来のCSSリセットは、すべてのスタイルを完全にゼロにする「破壊的」なアプローチでした。

```css
/* 従来のCSSリセットの例 */
* {
  margin: 0;
  padding: 0;
  border: 0;
  outline: 0;
  font-size: 100%;
  vertical-align: baseline;
  background: transparent;
}
```

**デメリット：**
- 有用なデフォルトスタイルまで削除してしまう
- 見出しタグ（h1-h6）のサイズがすべて同じになる
- リストの記号が消える
- フォームの基本スタイルが使えなくなる

### Preflightの賢いアプローチ

Preflightは「最適化」のアプローチを取り、有用なデフォルトスタイルは残しつつ、問題のある部分だけを修正します。

```css
/* Preflightの例（実際のコードの一部） */
h1, h2, h3, h4, h5, h6 {
  font-size: inherit;
  font-weight: inherit;
}

button, input, optgroup, select, textarea {
  font-family: inherit;
  font-feature-settings: inherit;
  font-variation-settings: inherit;
  font-size: 100%;
  font-weight: inherit;
  line-height: inherit;
  color: inherit;
  margin: 0;
  padding: 0;
}
```

**メリット：**
- 有用なデフォルトスタイルは保持する
- ユーティリティクラスと相性が良い
- アクセシビリティを考慮した設計
- モダンブラウザに最適化されている

## Preflightが解決する問題を体験してみよう

実際にPreflightの効果を確認して、どのような問題を解決しているのかを体験してみましょう。

:::step

1. プロジェクトフォルダの作成

任意の場所（デスクトップなど）で`preflight-demo`フォルダを作成してください。

2. Preflightなしのページを作成

`preflight-demo`フォルダ内に`without-preflight.html`を作成し、以下の内容を記述してください。

_without-preflight.html_
```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preflightなしのページ</title>
  <style>
    /* ブラウザのデフォルトスタイルのみ */
    body {
      font-family: system-ui, sans-serif;
    }
  </style>
</head>
<body>
  <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
    <h1>見出し1</h1>
    <h2>見出し2</h2>
    <h3>見出し3</h3>

    <p>これは段落テキストです。ブラウザのデフォルトマージンやパディングが適用されています。</p>

    <ul>
      <li>リスト項目1</li>
      <li>リスト項目2</li>
      <li>リスト項目3</li>
    </ul>

    <form>
      <div style="margin-bottom: 10px;">
        <label for="name">名前:</label>
        <input type="text" id="name" name="name">
      </div>
      <div style="margin-bottom: 10px;">
        <label for="email">メール:</label>
        <input type="email" id="email" name="email">
      </div>
      <button type="submit">送信</button>
    </form>

    <hr>

    <blockquote>
      これは引用文です。ブラウザのデフォルトスタイルが適用されています。
    </blockquote>
  </div>
</body>
</html>
```

3. Preflightありのページを作成

`preflight-demo`フォルダ内に`with-preflight.html`を作成し、以下の内容を記述してください。

_with-preflight.html_
```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preflightありのページ</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div class="max-w-4xl mx-auto p-5">
    <h1>見出し1</h1>
    <h2>見出し2</h2>
    <h3>見出し3</h3>

    <p>これは段落テキストです。Preflightによってブラウザのデフォルトスタイルがリセットされています。</p>

    <ul>
      <li>リスト項目1</li>
      <li>リスト項目2</li>
      <li>リスト項目3</li>
    </ul>

    <form>
      <div class="mb-4">
        <label for="name" class="block">名前:</label>
        <input type="text" id="name" name="name" class="border">
      </div>
      <div class="mb-4">
        <label for="email" class="block">メール:</label>
        <input type="email" id="email" name="email" class="border">
      </div>
      <button type="submit" class="bg-blue-500 text-white px-4 py-2">送信</button>
    </form>

    <hr class="my-4">

    <blockquote>
      これは引用文です。Preflightによってブラウザのデフォルトスタイルがリセットされています。
    </blockquote>
  </div>
</body>
</html>
```

4. ブラウザで比較確認

両方のHTMLファイルをブラウザで開いて、以下の違いを確認してください：

- **見出しのサイズ**: Preflightなしでは見出しに階層的なサイズがある
- **マージンの違い**: 段落やリストのマージンが異なる
- **リストの記号**: Preflightありでは記号が消えている
- **フォームの見た目**: input要素のボーダーやスタイルが異なる
- **引用文の見た目**: blockquoteのインデントが異なる

5. デベロッパーツールで詳細確認

ブラウザのデベロッパーツール（F12）を開き、各要素のComputedスタイルを確認して、具体的にどのようなスタイルがリセットされているかを観察してください。

:::

この比較により、Preflightがブラウザの「想定外」のデフォルトスタイルを取り除き、一貫した開発環境を提供していることが確認できます。

## Preflightの詳細な効果

Preflightが具体的にどのような処理を行っているかを詳しく見てみましょう。

### マージンとパディングの正規化

```css
/* Preflightによる処理 */
*, ::before, ::after {
  box-sizing: border-box;
  border-width: 0;
  border-style: solid;
  border-color: theme('borderColor.DEFAULT', currentColor);
}

blockquote, dl, dd, h1, h2, h3, h4, h5, h6, hr, figure, p, pre {
  margin: 0;
}
```

これにより、予期しないマージンやパディングに悩まされることがなくなります。

### フォーム要素の正規化

```css
/* フォーム要素の統一 */
button, input, optgroup, select, textarea {
  font-family: inherit;
  font-size: 100%;
  font-weight: inherit;
  line-height: inherit;
  color: inherit;
  margin: 0;
  padding: 0;
}

button, select {
  text-transform: none;
}
```

これにより、すべてのブラウザでフォーム要素が一貫した見た目になります。

### テーブル要素の最適化

```css
/* テーブルのボーダーモデル */
table {
  text-indent: 0;
  border-color: inherit;
  border-collapse: collapse;
}
```

テーブルの表示が予測しやすくなります。

:::note Preflightの完全なコード

Preflightの完全なCSSコードはGitHubで確認できます：
https://github.com/tailwindlabs/tailwindcss/blob/main/src/css/preflight.css

:::

## Preflightを無効にする方法

プロジェクトによっては、Preflightが既存のスタイルと競合する場合があります。そのような場合は、Preflightを無効にできます。

### 完全無効化

`tailwind.config.js`でPreflightを完全に無効にする方法：

_tailwind.config.js_
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [],
  //addstart
  corePlugins: {
    preflight: false,
  }
  //addend
}
```

### カスタマイズによる部分調整

Preflightを完全に無効にするのではなく、特定の部分だけを調整したい場合は、カスタマイズが可能です。

_tailwind.config.js_
```javascript
const plugin = require('tailwindcss/plugin')

module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [
    //addstart
    plugin(function({ addBase, theme }) {
      addBase({
        // 見出しのデフォルトスタイルを復活
        'h1': { fontSize: theme('fontSize.2xl') },
        'h2': { fontSize: theme('fontSize.xl') },
        'h3': { fontSize: theme('fontSize.lg') },
        // リストの記号を復活
        'ul': { listStyleType: 'disc', paddingLeft: theme('spacing.6') },
        'ol': { listStyleType: 'decimal', paddingLeft: theme('spacing.6') },
      })
    })
    //addend
  ],
}
```

## 他のCSSライブラリとの競合回避

既存のプロジェクトにTailwind CSSを導入する際、他のCSSライブラリとの競合が発生する場合があります。

### Bootstrap との併用

Bootstrap などのCSSフレームワークとTailwind CSSを併用する場合：

```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{html,js}"],
  //addstart
  important: true, // すべてのユーティリティに !important を追加
  //addend
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Preflightを無効にしてBootstrapのリセットを使用
  }
}
```

### CSSモジュールとの併用

CSS Modules を使用している場合の設定例：

```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    //addstart
    preflight: false, // CSS Modulesの影響を避けるため無効化
    //addend
  }
}
```

## 実際の開発での使い分け

実際の開発現場でPreflightをどう扱うかの判断基準を理解しましょう。

### Preflightを有効にすべき場合

- **新規プロジェクト**: ゼロから開発する場合
- **Tailwind CSSメインの開発**: ユーティリティクラス中心の開発
- **モダンなブラウザ対応**: IE11などの古いブラウザをサポートしない場合
- **デザインシステムの統一**: チーム全体で一貫したスタイルを保ちたい場合

### Preflightを無効にすべき場合

- **既存プロジェクトへの段階導入**: 既存のCSSとの競合を避けたい場合
- **他のCSSフレームワークとの併用**: Bootstrap等との同時使用
- **レガシーブラウザ対応**: 古いブラウザとの互換性が必要な場合
- **特殊な要件**: デフォルトのHTMLスタイルを保持したい場合

:::warning Preflightを無効にする際の注意点

Preflightを無効にすると、ユーティリティクラスの動作が予期しないものになる場合があります。特にフォーム要素やタイポグラフィ関連のクラスは、ブラウザのデフォルトスタイルの影響を受けやすくなります。

:::

## 段階的な導入戦略

既存プロジェクトにTailwind CSSを導入する際の実践的な戦略を学びましょう。

### 段階1: Preflightなしで開始

```javascript
// tailwind.config.js - 初期設定
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: false, // 最初は無効
  }
}
```

### 段階2: 特定のコンポーネントでテスト

```html
<!-- 新しいコンポーネントでのみTailwindを使用 -->
<div class="bg-blue-500 text-white p-4 rounded">
  新しいコンポーネント
</div>
```

### 段階3: Preflightの段階的有効化

```javascript
// 段階的にPreflightを有効化
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [
    plugin(function({ addBase }) {
      addBase({
        // 必要な部分のみPreflightを適用
        'button, input, select, textarea': {
          fontFamily: 'inherit',
          fontSize: '100%',
          lineHeight: 'inherit',
        },
      })
    })
  ],
}
```

### 段階4: 完全移行

最終的にPreflightを有効にして、既存のCSSを段階的にTailwindに置き換えます。

## まとめ

Preflightは、Tailwind CSSの優れた機能の一つです。ブラウザ間の差異を解消し、予測可能な開発環境を提供します。適切に理解して使用することで、より効率的で一貫性のあるWebサイト開発が可能になります。

:::note 要点のまとめ

- **Preflight**はTailwind CSSが提供するモダンなCSSリセット
- 従来のCSSリセットとは異なり、有用なスタイルは保持する
- ブラウザのデフォルトスタイルの問題を解決し、一貫した開発環境を提供
- プロジェクトの要件に応じて無効化やカスタマイズが可能
- 既存プロジェクトでは段階的な導入戦略が有効

:::

次の章では、Tailwind CSSの「スペーシング/サイズ/色のスケール」について学習し、デザインの一貫性を保つためのスケール体系を理解していきます。

[スペーシング/サイズ/色のスケール](./scales-spacing-color-size)

## 関連リンク

- [Tailwind CSS公式ドキュメント - Preflight](https://tailwindcss.com/docs/preflight)
- [Modern Normalize](https://github.com/sindresorhus/modern-normalize)
- [ユーティリティクラスの基本](./utility-basics)

## さらに深く学習したい方へ

Tailwind CSSの基礎をしっかりと学習したい方は、実践的なプロジェクトを通じて学べる研修プログラムをご用意しています。ハンズオン形式でPreflightの活用方法から高度なカスタマイズまで、体系的に学習できます。