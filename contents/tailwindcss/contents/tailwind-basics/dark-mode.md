---
title: ダークモード（class/media）
slug: dark-mode
parent: tailwind-basics
file_path: contents/tailwindcss/contents/tailwind-basics/dark-mode.md
target_user: Tailwind CSSを学習している初級〜中級のフロントエンドエンジニア
goal: "Tailwind CSSでダークモードを実装する手法を学び、ユーザー体験を向上させるダークモード対応のWebサイトを作成できるようになる"
status: not_started
post_type: pages
seo_title: Tailwind CSSでダークモード実装｜classベースとmediaベースの使い分け
seo_keywords: "Tailwind CSS, ダークモード, dark mode, class, media, CSS, フロントエンド, Web開発"
seo_description: "Tailwind CSSでダークモードを実装する方法を基礎から学習。classベースとmediaベースの違い、トグル機能の実装、アクセシビリティ対応まで実践的に解説します。"
handson_overview: "Tailwind CSSのダークモード機能を使って、ライト・ダークモードの切り替えができるWebサイトを作成し、ローカルストレージでの状態保存やアクセシビリティ対応を実装する"
---

## はじめに

Webサイトのダークモード対応は、現代のフロントエンド開発において必須の機能となっています。ユーザーの目の疲労軽減や電力消費の削減、視覚的な快適性の向上など、多くのメリットを提供するためです。

Tailwind CSSは、ダークモードの実装を簡潔かつ効率的に行える仕組みを提供しており、わずかな設定でライト・ダークテーマの切り替えが可能になります。

### このページで学べる事

本記事では、Tailwind CSSを使ったダークモード実装の基礎から応用まで、実際に手を動かしながら学習します。

:::note このページで学べる内容

- Tailwind CSSのダークモード設定方法（class/media）
- ライト・ダークテーマの配色設計とコントラスト対応
- JavaScriptを使ったダークモードトグル機能の実装
- ローカルストレージでのテーマ状態保存
- アクセシビリティを考慮したダークモード設計
- 実際のWebサイトでのダークモード実装

:::

## ダークモード実装の基礎知識

Tailwind CSSでは、`dark:`プレフィックスを使用してダークモード専用のスタイルを適用できます。これにより、ライト・ダークテーマの両方に対応したデザインを効率的に実装できます。

ダークモードには「classベース」と「mediaベース」の2つのアプローチがあり、それぞれ異なる用途と特徴を持ちます。

:::note ダークモード実装の2つの方式

- **classベース**: JavaScript制御による手動切り替え（推奨）
- **mediaベース**: OS設定に自動追従する方式

:::

### classベースとmediaベースの選択指針

選択の指針として、ユーザー体験と機能要件を考慮する必要があります。

**classベースが適している場面**：
- ユーザーが自由にテーマを切り替えたい場合
- テーマ設定を保存したい場合
- 複数のテーマオプションを提供したい場合

**mediaベースが適している場面**：
- シンプルな実装で済ませたい場合
- OS設定との一貫性を重視する場合
- JavaScript不要の軽量実装を求める場合

## classベースダークモードの設定

classベースダークモードは、最も柔軟で制御しやすい実装方式です。設定ファイルでの有効化と、HTML要素へのクラス追加によって実現されます。

### Tailwind設定ファイルの構成

まず、`tailwind.config.js`でclassベースダークモードを有効化します。

:::syntax Tailwind設定でのダークモード有効化

```javascript
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{html,js}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

この設定により、HTML要素に`dark`クラスが付与された場合にダークモードが適用されます。

:::

### ダークモード専用スタイルの適用

`dark:`プレフィックスを使用して、ダークモード専用のスタイルを定義できます。

```html
<div class="bg-white text-black dark:bg-gray-900 dark:text-white">
  <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
    サンプルタイトル
  </h1>
  <p class="text-gray-600 dark:text-gray-300">
    このテキストはダークモードで色が変わります。
  </p>
</div>
```

このように、通常のクラスと`dark:`プレフィックス付きのクラスを併記することで、両テーマに対応したスタイルを適用できます。

## mediaベースダークモードの設定

mediaベースダークモードは、OS設定に自動追従する最もシンプルな実装方式です。JavaScript不要で、CSS Media Queriesと同様の動作を提供します。

### 設定ファイルでの有効化

`tailwind.config.js`でmediaベースダークモードを設定します。

```javascript
module.exports = {
  darkMode: 'media',
  content: ['./src/**/*.{html,js}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

この設定により、ユーザーのOS設定が自動的に検出され、ダークモードが適用されます。

### 自動追従の仕組み

mediaベースでは、CSS Media Queryの`prefers-color-scheme`を内部的に使用します。これにより、ユーザーがOS設定でダークモードを有効化した場合、自動的にWebサイトもダークモードになります。

:::info OS設定との連携

- macOS: システム環境設定 → 一般 → 外観
- Windows 10/11: 設定 → 個人用設定 → 色
- iOS/Android: 設定 → ディスプレイ → ダークモード

:::

## ダークモード対応の配色設計

効果的なダークモード実装には、適切な配色設計が不可欠です。単純に色を反転するだけでなく、コントラストや可読性を考慮した配色を設計する必要があります。

### カラーパレットの基本原則

ダークモード対応の配色では、以下の原則を遵守することが重要です。

**コントラスト比の確保**：
- 背景色とテキスト色のコントラスト比を4.5:1以上に保つ
- アクセシビリティガイドライン（WCAG 2.1 AA）への準拠

**視覚的階層の維持**：
- ライトモードとダークモードで同じ視覚的重要度を保持
- 色の明度関係を適切に調整

### 推奨カラー組み合わせ

Tailwind CSSのグレースケールパレットを活用した推奨組み合わせを示します。

```html
<!-- 背景色とテキスト色の組み合わせ -->
<div class="bg-white dark:bg-gray-900">
  <!-- プライマリテキスト -->
  <h1 class="text-gray-900 dark:text-gray-100">メインタイトル</h1>

  <!-- セカンダリテキスト -->
  <p class="text-gray-600 dark:text-gray-300">サブテキスト</p>

  <!-- 境界線・区切り -->
  <hr class="border-gray-200 dark:border-gray-700">

  <!-- カード・パネル -->
  <div class="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
    カードコンテンツ
  </div>
</div>
```

これらの組み合わせにより、ライト・ダークの両テーマで適切なコントラストと可読性を確保できます。

## ダークモードトグル機能の実装

ユーザーが自由にテーマを切り替えられるトグル機能を実装します。この機能により、ユーザー体験が大幅に向上し、個人の好みに応じたカスタマイズが可能になります。

### ダークモードトグル機能を実装してみよう

classベースダークモードを使用して、ユーザーがボタンクリックでライト・ダークテーマを切り替えできる機能を実装してみましょう。

:::step

1. プロジェクトディレクトリの作成

ダークモード実装用のプロジェクトディレクトリを作成します。

_コマンド実行_
```bash
mkdir tailwind-darkmode-demo
cd tailwind-darkmode-demo
```

2. HTMLファイルの作成

基本的なHTMLファイルを作成し、Tailwind CSSを読み込みます。

_index.html_
```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tailwind CSS ダークモードデモ</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {}
      }
    }
  </script>
</head>
<body class="bg-white dark:bg-gray-900 transition-colors duration-300">
  <div class="min-h-screen p-8">
    <!-- ヘッダー部分 -->
    <header class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        ダークモードデモ
      </h1>

      <!-- トグルボタン -->
      <button id="theme-toggle"
              class="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
        <span id="theme-toggle-light-icon" class="hidden">☀️</span>
        <span id="theme-toggle-dark-icon">🌙</span>
      </button>
    </header>

    <!-- メインコンテンツ -->
    <main class="max-w-4xl mx-auto">
      <div class="grid md:grid-cols-2 gap-8">
        <!-- カード1 -->
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            機能紹介
          </h2>
          <p class="text-gray-600 dark:text-gray-300 mb-4">
            このデモでは、Tailwind CSSのダークモード機能を使用して、ライトテーマとダークテーマの切り替えを実装しています。
          </p>
          <button class="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">
            詳細を見る
          </button>
        </div>

        <!-- カード2 -->
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            アクセシビリティ
          </h2>
          <p class="text-gray-600 dark:text-gray-300 mb-4">
            適切なコントラスト比を維持し、すべてのユーザーが快適に利用できるデザインを心がけています。
          </p>
          <div class="flex space-x-2">
            <span class="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded text-sm">
              AA準拠
            </span>
            <span class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm">
              WCAG 2.1
            </span>
          </div>
        </div>
      </div>

      <!-- フォーム例 -->
      <div class="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          フォーム例
        </h2>
        <form class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              お名前
            </label>
            <input type="text"
                   class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                   placeholder="山田太郎">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              メッセージ
            </label>
            <textarea rows="4"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="メッセージを入力してください"></textarea>
          </div>
          <button type="submit"
                  class="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-6 py-2 rounded transition-colors">
            送信
          </button>
        </form>
      </div>
    </main>
  </div>
</body>
</html>
```

3. JavaScriptでトグル機能を実装

HTMLファイルの`</body>`タグの直前に、テーマ切り替え用のJavaScriptコードを追加します。

_index.html（JavaScript部分を追加）_
```html
  <!-- 既存のHTMLコンテンツ -->

  <script>
    // DOM要素の取得
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');
    const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');

    // ローカルストレージからテーマを取得、なければシステム設定を確認
    function getThemeFromStorage() {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme) {
        return storedTheme;
      }
      // システムのダークモード設定を確認
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    // テーマをローカルストレージに保存
    function saveThemeToStorage(theme) {
      localStorage.setItem('theme', theme);
    }

    // テーマを適用
    function applyTheme(theme) {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        themeToggleLightIcon.classList.remove('hidden');
        themeToggleDarkIcon.classList.add('hidden');
      } else {
        document.documentElement.classList.remove('dark');
        themeToggleLightIcon.classList.add('hidden');
        themeToggleDarkIcon.classList.remove('hidden');
      }
    }

    // テーマを切り替え
    function toggleTheme() {
      const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      applyTheme(newTheme);
      saveThemeToStorage(newTheme);
    }

    // 初期化：保存されたテーマまたはシステム設定を適用
    const initialTheme = getThemeFromStorage();
    applyTheme(initialTheme);

    // トグルボタンのイベントリスナー
    themeToggleBtn.addEventListener('click', toggleTheme);

    // システムのカラーテーマ変更を監視
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // ユーザーが手動設定していない場合のみシステム設定に追従
      if (!localStorage.getItem('theme')) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  </script>
</body>
</html>
```

4. ブラウザで動作確認

作成したHTMLファイルをブラウザで開いて動作を確認します。

_コマンド実行_
```bash
# 簡易HTTPサーバーを起動（Python3の場合）
python3 -m http.server 8000

# または、Node.jsのlive-serverを使用する場合
npx live-server
```

ブラウザで`http://localhost:8000`にアクセスし、右上のトグルボタンでテーマが切り替わることを確認してください。

:::

実装により、ユーザーがボタンクリックでテーマを切り替えでき、設定がブラウザのローカルストレージに保存されます。ページをリロードしても、最後に選択したテーマが維持される点が重要です。

## ローカルストレージでの状態保存

ユーザーのテーマ選択を永続化するため、ローカルストレージを活用した状態保存機能を実装します。これにより、ページをリロードしても、ユーザーの好みのテーマが維持されます。

### 状態保存の仕組み

先ほどの実装では、以下の3つの要素でテーマ状態を管理しています。

**1. テーマの取得優先順位**：
- 保存されたユーザー設定
- システムのダークモード設定
- デフォルト（ライトモード）

**2. 状態の永続化**：
- ユーザーがテーマを変更した際にローカルストレージに保存
- アプリケーション起動時に保存された設定を復元

**3. システム設定との連携**：
- ユーザーが手動設定していない場合はシステム設定に追従
- 手動設定がある場合は優先的に適用

### 高度な状態管理

より複雑なアプリケーションでは、以下のような拡張が可能です。

```javascript
// テーマ管理クラス
class ThemeManager {
  constructor() {
    this.storageKey = 'app-theme';
    this.themes = ['light', 'dark', 'system'];
    this.currentTheme = this.getInitialTheme();
    this.init();
  }

  getInitialTheme() {
    const stored = localStorage.getItem(this.storageKey);
    if (stored && this.themes.includes(stored)) {
      return stored;
    }
    return 'system';
  }

  applyTheme(theme) {
    const resolvedTheme = theme === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme;

    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
    this.updateUI(theme);
  }

  setTheme(theme) {
    if (!this.themes.includes(theme)) return;

    this.currentTheme = theme;
    localStorage.setItem(this.storageKey, theme);
    this.applyTheme(theme);
  }

  updateUI(theme) {
    // UI更新ロジック
    const buttons = document.querySelectorAll('[data-theme]');
    buttons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === theme);
    });
  }

  init() {
    this.applyTheme(this.currentTheme);

    // システム設定変更の監視
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (this.currentTheme === 'system') {
        this.applyTheme('system');
      }
    });
  }
}

// 使用例
const themeManager = new ThemeManager();
```

この拡張版では、「システム設定に従う」オプションも含めた3つの選択肢を提供し、より柔軟なテーマ管理を実現できます。

## アクセシビリティを考慮したダークモード設計

ダークモード実装では、視覚的なデザインだけでなく、アクセシビリティへの配慮が重要です。すべてのユーザーが快適に利用できるダークモードを設計する必要があります。

### コントラスト比の確保

WCAG 2.1ガイドラインに基づくコントラスト比の確保は、アクセシブルなダークモード設計の基本です。

:::note WCAG 2.1 コントラスト比要件

- **AAレベル**: 通常テキスト 4.5:1、大きなテキスト 3:1
- **AAAレベル**: 通常テキスト 7:1、大きなテキスト 4.5:1

:::

```css
/* 適切なコントラスト比の例 */
.text-primary-light { color: #1f2937; } /* コントラスト比: 15.13 */
.text-primary-dark { color: #f9fafb; }  /* コントラスト比: 18.69 */

.text-secondary-light { color: #4b5563; } /* コントラスト比: 7.09 */
.text-secondary-dark { color: #d1d5db; }  /* コントラスト比: 12.63 */
```

### 動きや点滅への配慮

一部のユーザーは、動きのあるコンテンツに敏感に反応する場合があります。テーマ切り替え時のアニメーションも、適切に制御する必要があります。

```html
<!-- reduced-motionメディアクエリに対応したトランジション -->
<div class="transition-colors duration-300 motion-reduce:transition-none">
  <!-- コンテンツ -->
</div>
```

```css
/* CSSでの対応例 */
@media (prefers-reduced-motion: reduce) {
  .transition-colors {
    transition: none !important;
  }
}
```

### キーボードナビゲーション対応

テーマ切り替えボタンは、キーボードでも操作できるよう設計します。

```html
<button id="theme-toggle"
        class="p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        aria-label="テーマを切り替え"
        role="switch"
        aria-checked="false">
  <span class="sr-only">ダークモードを切り替え</span>
  <!-- アイコン -->
</button>
```

`aria-label`や`role="switch"`などのARIA属性により、スクリーンリーダーユーザーにも機能が明確に伝わります。

## 実際のWebサイトでダークモード実装を完成させよう

これまで学習した内容を統合して、本格的なWebサイトでダークモード対応を実装してみましょう。

:::step

1. プロジェクト構成の確認

先ほど作成したプロジェクトディレクトリで、より完成度の高い実装を行います。

_コマンド実行_
```bash
cd tailwind-darkmode-demo
ls -la
```

2. CSSファイルの作成

カスタムスタイルを定義するためのCSSファイルを作成します。

_styles.css_
```css
/* カスタムプロパティを使用したテーマ対応 */
:root {
  --color-primary: 59 130 246;
  --color-secondary: 107 114 128;
  --color-success: 34 197 94;
  --color-warning: 245 158 11;
  --color-error: 239 68 68;
}

.dark {
  --color-primary: 96 165 250;
  --color-secondary: 156 163 175;
  --color-success: 74 222 128;
  --color-warning: 251 191 36;
  --color-error: 248 113 113;
}

/* フォーカス時のアウトライン強化 */
.focus-enhanced:focus {
  outline: 2px solid rgb(var(--color-primary));
  outline-offset: 2px;
}

/* 滑らかなテーマ切り替えアニメーション */
.theme-transition {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

/* モーション設定を尊重 */
@media (prefers-reduced-motion: reduce) {
  .theme-transition {
    transition: none;
  }
}

/* 高コントラスト表示への対応 */
@media (prefers-contrast: high) {
  .text-primary {
    color: rgb(0 0 0) !important;
  }

  .dark .text-primary {
    color: rgb(255 255 255) !important;
  }
}
```

3. 高度なHTMLコンポーネントの実装

より実用的なコンポーネントを含むHTMLを作成します。

_index.html（完全版）_
```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tailwind CSS ダークモード完全実装</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="styles.css">
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            primary: {
              50: 'rgb(239 246 255)',
              500: 'rgb(var(--color-primary))',
              600: 'rgb(37 99 235)',
              700: 'rgb(29 78 216)',
            }
          }
        }
      }
    }
  </script>
</head>
<body class="bg-gray-50 dark:bg-gray-900 theme-transition">
  <!-- ナビゲーションバー -->
  <nav class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 theme-transition">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- ロゴ -->
        <div class="flex items-center">
          <div class="text-xl font-bold text-gray-900 dark:text-white">
            TechSite
          </div>
        </div>

        <!-- ナビゲーションメニュー -->
        <div class="hidden md:flex items-center space-x-8">
          <a href="#" class="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white theme-transition focus-enhanced rounded px-2 py-1">
            ホーム
          </a>
          <a href="#" class="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white theme-transition focus-enhanced rounded px-2 py-1">
            サービス
          </a>
          <a href="#" class="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white theme-transition focus-enhanced rounded px-2 py-1">
            お問い合わせ
          </a>

          <!-- テーマ切り替えボタン -->
          <div class="relative">
            <button id="theme-toggle"
                    class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 theme-transition focus-enhanced"
                    aria-label="テーマを切り替え"
                    role="switch"
                    aria-checked="false">
              <svg id="theme-toggle-light-icon" class="hidden w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"></path>
              </svg>
              <svg id="theme-toggle-dark-icon" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>

  <!-- メインコンテンツ -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- ヒーローセクション -->
    <section class="text-center py-12">
      <h1 class="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 theme-transition">
        ダークモード対応<br>
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
          Webサイト
        </span>
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto theme-transition">
        Tailwind CSSを使用したアクセシブルで美しいダークモード実装のデモンストレーションです。
        ユーザビリティとアクセシビリティを両立した設計を体験してください。
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button class="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold theme-transition focus-enhanced">
          今すぐ始める
        </button>
        <button class="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-8 py-3 rounded-lg font-semibold theme-transition focus-enhanced">
          詳細を見る
        </button>
      </div>
    </section>

    <!-- 機能紹介セクション -->
    <section class="py-16">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4 theme-transition">
          主な機能
        </h2>
        <p class="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto theme-transition">
          現代的なWebサイトに必要なダークモード機能をすべて実装しています。
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-8">
        <!-- 機能1 -->
        <div class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 theme-transition">
          <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-6">
            <svg class="w-6 h-6 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 theme-transition">
            高速切り替え
          </h3>
          <p class="text-gray-600 dark:text-gray-300 theme-transition">
            瞬時にライト・ダークテーマを切り替えでき、設定は自動的に保存されます。
          </p>
        </div>

        <!-- 機能2 -->
        <div class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 theme-transition">
          <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-6">
            <svg class="w-6 h-6 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 theme-transition">
            アクセシビリティ
          </h3>
          <p class="text-gray-600 dark:text-gray-300 theme-transition">
            WCAG 2.1準拠のコントラスト比を保ち、すべてのユーザーに配慮した設計です。
          </p>
        </div>

        <!-- 機能3 -->
        <div class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 theme-transition">
          <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-6">
            <svg class="w-6 h-6 text-purple-500 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 theme-transition">
            システム連携
          </h3>
          <p class="text-gray-600 dark:text-gray-300 theme-transition">
            OS設定と自動同期し、ユーザーの好みに応じて適切なテーマを選択します。
          </p>
        </div>
      </div>
    </section>

    <!-- フッター -->
    <footer class="mt-16 py-8 border-t border-gray-200 dark:border-gray-700 theme-transition">
      <div class="text-center">
        <p class="text-gray-600 dark:text-gray-400 theme-transition">
          © 2024 TechSite. Tailwind CSS ダークモード実装デモ
        </p>
      </div>
    </footer>
  </main>

  <script>
    // 高度なテーマ管理システム
    class AdvancedThemeManager {
      constructor() {
        this.storageKey = 'preferred-theme';
        this.currentTheme = this.getStoredTheme();
        this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        this.initializeTheme();
        this.setupEventListeners();
      }

      getStoredTheme() {
        try {
          return localStorage.getItem(this.storageKey) || 'system';
        } catch (error) {
          console.warn('ローカルストレージにアクセスできません:', error);
          return 'system';
        }
      }

      saveTheme(theme) {
        try {
          localStorage.setItem(this.storageKey, theme);
        } catch (error) {
          console.warn('テーマの保存に失敗しました:', error);
        }
      }

      getEffectiveTheme() {
        if (this.currentTheme === 'system') {
          return this.mediaQuery.matches ? 'dark' : 'light';
        }
        return this.currentTheme;
      }

      applyTheme() {
        const effectiveTheme = this.getEffectiveTheme();
        const isDark = effectiveTheme === 'dark';

        document.documentElement.classList.toggle('dark', isDark);
        this.updateToggleButton(isDark);
        this.updateAriaAttributes(isDark);

        // アナリティクスや他のシステムへの通知
        this.notifyThemeChange(effectiveTheme);
      }

      updateToggleButton(isDark) {
        const lightIcon = document.getElementById('theme-toggle-light-icon');
        const darkIcon = document.getElementById('theme-toggle-dark-icon');
        const button = document.getElementById('theme-toggle');

        if (lightIcon && darkIcon) {
          lightIcon.classList.toggle('hidden', !isDark);
          darkIcon.classList.toggle('hidden', isDark);
        }

        if (button) {
          button.setAttribute('aria-checked', isDark.toString());
        }
      }

      updateAriaAttributes(isDark) {
        const toggleButton = document.getElementById('theme-toggle');
        if (toggleButton) {
          toggleButton.setAttribute('aria-label',
            isDark ? 'ライトモードに切り替え' : 'ダークモードに切り替え');
        }
      }

      toggleTheme() {
        const newTheme = this.getEffectiveTheme() === 'dark' ? 'light' : 'dark';
        this.currentTheme = newTheme;
        this.saveTheme(newTheme);
        this.applyTheme();
      }

      notifyThemeChange(theme) {
        // カスタムイベントの発生
        window.dispatchEvent(new CustomEvent('themechange', {
          detail: { theme }
        }));
      }

      initializeTheme() {
        this.applyTheme();
      }

      setupEventListeners() {
        // トグルボタンのクリック
        const toggleButton = document.getElementById('theme-toggle');
        if (toggleButton) {
          toggleButton.addEventListener('click', () => this.toggleTheme());
        }

        // キーボードショートカット (Ctrl/Cmd + Shift + L)
        document.addEventListener('keydown', (e) => {
          if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
            e.preventDefault();
            this.toggleTheme();
          }
        });

        // システム設定の変更監視
        this.mediaQuery.addEventListener('change', () => {
          if (this.currentTheme === 'system') {
            this.applyTheme();
          }
        });

        // ページの可視性変更時の同期
        document.addEventListener('visibilitychange', () => {
          if (!document.hidden) {
            this.applyTheme();
          }
        });
      }
    }

    // テーママネージャーの初期化
    const themeManager = new AdvancedThemeManager();

    // テーマ変更イベントのリスニング例
    window.addEventListener('themechange', (e) => {
      console.log('テーマが変更されました:', e.detail.theme);
      // アナリティクス送信、他のコンポーネントへの通知など
    });

    // ページロード完了時の処理
    document.addEventListener('DOMContentLoaded', () => {
      console.log('Tailwind CSS ダークモード実装が完了しました');
    });
  </script>
</body>
</html>
```

4. 動作確認とテスト

実装したダークモード機能をテストします。

_コマンド実行_
```bash
# 簡易HTTPサーバーを起動
python3 -m http.server 8000
```

以下の項目を確認してください：

- テーマ切り替えボタンの動作
- ローカルストレージでの設定保存
- ページリロード後の設定復元
- キーボードショートカット（Ctrl/Cmd + Shift + L）
- アクセシビリティ（タブナビゲーション、スクリーンリーダー対応）
- システム設定変更時の自動追従

:::

この実装により、プロダクションレベルのダークモード機能が完成しました。ユーザビリティ、アクセシビリティ、パフォーマンスのすべてを考慮した、実用的なダークモード対応サイトが作成できています。

## まとめ

Tailwind CSSを使用したダークモード実装について、基礎から実践まで包括的に学習しました。単なる色の切り替えではなく、ユーザー体験とアクセシビリティを重視した設計が重要であることを理解できたはずです。

:::note 要点のまとめ

- **設定方式**: classベース（推奨）とmediaベースの使い分け
- **配色設計**: コントラスト比とアクセシビリティガイドラインへの準拠
- **状態管理**: ローカルストレージとシステム設定の適切な連携
- **実装技術**: JavaScript制御、キーボード対応、ARIA属性の活用
- **ユーザー体験**: 直感的な操作性と設定の永続化

:::

現代のWebサイトにおいて、ダークモード対応は差別化要因ではなく標準機能となっています。本記事で学習した技術を活用して、ユーザーに配慮した高品質なダークモード実装を心がけてください。

次の学習では、Tailwind CSSの高度なレイアウト技術や、レスポンシブデザインの実装について深掘りしていきます。

[レスポンシブデザイン実装ガイド](./responsive-design)

## 関連リンク

- [Tailwind CSS公式ドキュメント - ダークモード](https://tailwindcss.com/docs/dark-mode)
- [WCAG 2.1 アクセシビリティガイドライン](https://www.w3.org/WAI/WCAG21/Understanding/)
- [MDN Web Docs - prefers-color-scheme](https://developer.mozilla.org/ja/docs/Web/CSS/@media/prefers-color-scheme)
- [カラーコントラストチェッカー](https://webaim.org/resources/contrastchecker/)

## さらに深く学習したい方へ

Tailwind CSSをより深く学習し、実践的なスキルを身につけたい方は、以下の研修プログラムをご検討ください。

**フロントエンド開発実践コース**では、Tailwind CSSを使った大規模サイト開発、パフォーマンス最適化、チーム開発でのベストプラクティスなど、現場で即戦力となるスキルを習得できます。ハンズオン形式の実習により、確実な技術力向上を図れます。