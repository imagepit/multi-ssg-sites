---
title: 状態・擬似クラス（hover/focus/aria/data）
slug: state-pseudo-classes
parent: tailwind-basics
file_path: tailwind-basics/state-pseudo-classes
target_user: "Tailwind CSS初心者、フロントエンド開発者"
goal: "Tailwind CSSの状態バリアントと擬似クラスを習得し、インタラクティブで利用しやすいUIコンポーネントを構築できるようになる"
status: not_started
post_type: pages
seo_title: "Tailwind CSS状態・擬似クラス完全ガイド - インタラクティブUIの実装方法"
seo_keywords: "TailwindCSS,hover,focus,active,擬似クラス,aria,data属性,インタラクティブ,アクセシビリティ"
seo_description: "Tailwind CSSの状態バリアントと擬似クラスの使い方を実践的に学習。hover、focus、activeからaria属性まで、インタラクティブで使いやすいUIの実装方法を習得できます。"
handson_overview: "実際のHTMLコードを書きながらボタン、フォーム、ナビゲーションを構築し、ユーザーインタラクションやアクセシビリティ対応のUIコンポーネントを段階的に実装していきます"
---

# 🎨 状態・擬似クラス（hover/focus/aria/data）

Webサイトがユーザーに愛される理由の一つは、クリックやホバーなどのインタラクションに対する適切な**フィードバック**です。Tailwind CSSでは、様々な状態変化を簡単に実装できる状態バリアント（State Variants）が用意されており、魅力的で使いやすいUIを効率的に構築できます。

この章では、基本的なhover/focus/activeから、現代のWebデザインに欠かせないアクセシビリティ対応（aria属性、data属性）まで、実践的な例を通じて学習していきます。

## このページで学べること

この章を完了すると、Tailwind CSSを使用してインタラクティブで利用しやすいUIコンポーネントを構築するために必要な知識が身につきます。

:::note 学習内容

- 基本的な状態バリアント（hover、focus、active）の使い方
- グループホバーとピアバリアントの活用方法
- キーボードナビゲーション対応とフォーカス管理
- aria属性とdata属性を使用したアクセシビリティ対応
- レスポンシブな状態変化の実装
- 実用的なUIコンポーネントの構築

:::

## 🖱️ 基本的な状態バリアント

Tailwind CSSでは、状態バリアントと呼ばれる修飾子を使用して、要素の状態に応じたスタイルを簡単に適用できます。最も頻繁に使用される基本的な状態バリアントから学習しましょう。

### hover状態の実装

hover状態は、マウスカーソルが要素の上に置かれたときに発動する状態です。ユーザーに対してクリック可能な要素であることを視覚的に伝える重要な役割を果たします。

:::syntax hover状態の基本構文

```html
<element class="hover:{utility-class}">
```

`hover:`プレフィックスを付けることで、ホバー時のスタイルを指定できます。

:::

### focus状態の実装

focus状態は、主にキーボードナビゲーションでタブキーなどで要素にフォーカスが当たったときに発動します。アクセシビリティの観点から非常に重要な状態です。

:::syntax focus状態の基本構文

```html
<element class="focus:{utility-class}">
```

フォーカス時にはアウトラインの表示が推奨されています。

:::

### active状態の実装

active状態は、要素がクリックされた瞬間（マウスボタンが押されている間）に発動する状態です。ユーザーにクリックアクションの反応を即座に提供します。

## 🔄 インタラクティブなボタンを作成してみよう

それでは、学習した状態バリアントを使用して、実際にインタラクティブなボタンコンポーネントを作成してみましょう。

:::step

1. プロジェクトフォルダの作成

任意の場所（デスクトップなど）で`tailwind-states`フォルダを作成し、VSCodeで開いてください。

2. HTMLファイルの作成

プロジェクトフォルダ内に`index.html`を作成して以下の内容を追加してください。

_index.html_
```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tailwind States Demo</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 p-8">
  <div class="max-w-4xl mx-auto space-y-8">
    <h1 class="text-3xl font-bold text-center mb-8">状態バリアントのデモ</h1>

    <!-- 基本的なボタン -->
    <section class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4">基本的な状態変化</h2>
      <div class="flex flex-wrap gap-4">
        //addstart
        <!-- プライマリボタン -->
        <button class="bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 active:bg-blue-800
                       text-white px-6 py-2 rounded-md
                       focus:outline-none focus:ring-2 focus:ring-blue-300
                       transition-colors duration-200">
          プライマリボタン
        </button>

        <!-- セカンダリボタン -->
        <button class="bg-gray-500 hover:bg-gray-600 focus:bg-gray-700 active:bg-gray-800
                       text-white px-6 py-2 rounded-md
                       focus:outline-none focus:ring-2 focus:ring-gray-300
                       transition-colors duration-200">
          セカンダリボタン
        </button>

        <!-- 危険な操作ボタン -->
        <button class="bg-red-500 hover:bg-red-600 focus:bg-red-700 active:bg-red-800
                       text-white px-6 py-2 rounded-md
                       focus:outline-none focus:ring-2 focus:ring-red-300
                       transition-colors duration-200">
          削除
        </button>
        //addend
      </div>
    </section>
  </div>
</body>
</html>
```

3. ブラウザで動作確認

作成したHTMLファイルをブラウザで開き、各ボタンの状態変化を確認してください：

- **hover**: マウスカーソルを乗せたときの色の変化
- **focus**: タブキーでフォーカスしたときのリング表示
- **active**: クリック中の色の変化

:::

上記の例では、各状態で色が段階的に濃くなり、ユーザーに対して明確な視覚的フィードバックを提供しています。また、`transition-colors`クラスによって状態変化をスムーズにアニメーション化しています。

## 👥 グループホバーとピアバリアント

単一要素の状態変化だけでなく、親要素の状態に応じて子要素のスタイルを変更したり、兄弟要素同士で状態を連動させることも可能です。

### グループホバー（group/group-hover）

グループホバーは、親要素にhoverしたときに子要素のスタイルを変更する機能です。カード型UIやナビゲーションメニューでよく使用されます。

:::syntax グループホバーの構文

```html
<div class="group">
  <element class="group-hover:{utility-class}">
</div>
```

親要素に`group`クラス、子要素に`group-hover:`プレフィックスを使用します。

:::

### ピアバリアント（peer/peer-*)

ピアバリアントは、兄弟要素の状態に応じてスタイルを変更する機能です。フォームやトグルスイッチなどで効果的に使用できます。

## 🃏 カード型UIでグループホバーを実装してみよう

グループホバーを使用して、ホバー時に内部要素が連動して変化するカード型UIを作成しましょう。

:::step

1. カードコンポーネントの追加

先ほどの`index.html`に以下の内容を追加してください。

_index.html_
```html
    <!-- グループホバーの例（既存のsectionタグの後に追加） -->
    <section class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4">グループホバーの活用</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        //addstart
        <!-- 製品カード1 -->
        <div class="group bg-white border border-gray-200 rounded-lg overflow-hidden
                    hover:shadow-xl hover:border-blue-300
                    transition-all duration-300 cursor-pointer">
          <div class="aspect-w-16 aspect-h-9 bg-gradient-to-r from-blue-400 to-purple-500
                      group-hover:from-blue-500 group-hover:to-purple-600
                      transition-colors duration-300">
            <div class="flex items-center justify-center">
              <span class="text-white text-2xl font-bold group-hover:scale-110
                           transition-transform duration-300">📱</span>
            </div>
          </div>
          <div class="p-4">
            <h3 class="text-lg font-semibold text-gray-900 group-hover:text-blue-600
                       transition-colors duration-300">
              スマートフォン
            </h3>
            <p class="text-gray-600 text-sm mt-1 group-hover:text-gray-700
                     transition-colors duration-300">
              最新テクノロジーを搭載
            </p>
            <div class="mt-3 flex items-center justify-between">
              <span class="text-2xl font-bold text-gray-900 group-hover:text-blue-600
                           transition-colors duration-300">
                ¥89,800
              </span>
              <button class="bg-blue-500 text-white px-3 py-1 rounded text-sm
                             opacity-0 group-hover:opacity-100
                             group-hover:translate-x-0 translate-x-2
                             transition-all duration-300">
                詳細
              </button>
            </div>
          </div>
        </div>

        <!-- 製品カード2 -->
        <div class="group bg-white border border-gray-200 rounded-lg overflow-hidden
                    hover:shadow-xl hover:border-green-300
                    transition-all duration-300 cursor-pointer">
          <div class="aspect-w-16 aspect-h-9 bg-gradient-to-r from-green-400 to-teal-500
                      group-hover:from-green-500 group-hover:to-teal-600
                      transition-colors duration-300">
            <div class="flex items-center justify-center">
              <span class="text-white text-2xl font-bold group-hover:scale-110
                           transition-transform duration-300">💻</span>
            </div>
          </div>
          <div class="p-4">
            <h3 class="text-lg font-semibold text-gray-900 group-hover:text-green-600
                       transition-colors duration-300">
              ノートパソコン
            </h3>
            <p class="text-gray-600 text-sm mt-1 group-hover:text-gray-700
                     transition-colors duration-300">
              高性能で軽量設計
            </p>
            <div class="mt-3 flex items-center justify-between">
              <span class="text-2xl font-bold text-gray-900 group-hover:text-green-600
                           transition-colors duration-300">
                ¥129,800
              </span>
              <button class="bg-green-500 text-white px-3 py-1 rounded text-sm
                             opacity-0 group-hover:opacity-100
                             group-hover:translate-x-0 translate-x-2
                             transition-all duration-300">
                詳細
              </button>
            </div>
          </div>
        </div>

        <!-- 製品カード3 -->
        <div class="group bg-white border border-gray-200 rounded-lg overflow-hidden
                    hover:shadow-xl hover:border-purple-300
                    transition-all duration-300 cursor-pointer">
          <div class="aspect-w-16 aspect-h-9 bg-gradient-to-r from-purple-400 to-pink-500
                      group-hover:from-purple-500 group-hover:to-pink-600
                      transition-colors duration-300">
            <div class="flex items-center justify-center">
              <span class="text-white text-2xl font-bold group-hover:scale-110
                           transition-transform duration-300">🎧</span>
            </div>
          </div>
          <div class="p-4">
            <h3 class="text-lg font-semibold text-gray-900 group-hover:text-purple-600
                       transition-colors duration-300">
              ワイヤレスヘッドフォン
            </h3>
            <p class="text-gray-600 text-sm mt-1 group-hover:text-gray-700
                     transition-colors duration-300">
              ノイズキャンセリング機能
            </p>
            <div class="mt-3 flex items-center justify-between">
              <span class="text-2xl font-bold text-gray-900 group-hover:text-purple-600
                           transition-colors duration-300">
                ¥34,800
              </span>
              <button class="bg-purple-500 text-white px-3 py-1 rounded text-sm
                             opacity-0 group-hover:opacity-100
                             group-hover:translate-x-0 translate-x-2
                             transition-all duration-300">
                詳細
              </button>
            </div>
          </div>
        </div>
        //addend
      </div>
    </section>
```

2. ブラウザで動作確認

ブラウザを更新し、各カードにマウスカーソルを乗せて以下の動作を確認してください：

- カード全体のシャドウとボーダーの変化
- 背景グラデーションの色の変化
- アイコンのスケールアニメーション
- タイトルと価格の色の変化
- 詳細ボタンのフェードインアニメーション

:::

この例では、親要素（カード）にホバーすることで、内部の複数の子要素が連動して変化します。このようなマイクロインタラクションは、ユーザーエクスペリエンスを大幅に向上させます。

## 📋 フォームとアクセシビリティ

現代のWebデザインでは、美しい見た目だけでなく、すべてのユーザーが利用しやすいアクセシブルなUIを構築することが重要です。Tailwind CSSでは、フォーカス管理やaria属性への対応も簡単に実装できます。

### フォーカス管理の重要性

キーボードナビゲーションを使用するユーザーにとって、フォーカス状態の視覚的な表示は必須です。Tailwind CSSでは`focus:`バリアントと`focus-visible:`バリアントを使い分けることで、適切なフォーカス管理を実現できます。

:::note focus と focus-visible の違い

- **focus**: マウスクリックやタブキーでフォーカスされた際に発動
- **focus-visible**: キーボードナビゲーションでフォーカスされた際のみ発動（推奨）

:::

### aria属性とdata属性の活用

ARIA（Accessible Rich Internet Applications）属性は、スクリーンリーダーなどの支援技術に対して、要素の役割や状態を伝える重要な仕組みです。

## 📝 アクセシブルなフォームを作成してみよう

フォーカス管理とaria属性を活用した、誰でも利用しやすいフォームを作成しましょう。

:::step

1. フォームセクションの追加

`index.html`に以下の内容を追加してください。

_index.html_
```html
    <!-- アクセシブルフォームの例（既存のsectionタグの後に追加） -->
    <section class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4">アクセシブルなフォーム</h2>
      //addstart
      <form class="space-y-6" novalidate>
        <!-- 名前入力フィールド -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
            お名前 <span class="text-red-500" aria-label="必須項目">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            aria-describedby="name-error"
            class="w-full px-3 py-2 border border-gray-300 rounded-md
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                   invalid:border-red-500 invalid:ring-red-500
                   transition-colors duration-200"
            placeholder="田中太郎"
          >
          <p id="name-error" class="mt-1 text-sm text-red-600 hidden" role="alert">
            お名前を入力してください
          </p>
        </div>

        <!-- メールアドレス入力フィールド -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
            メールアドレス <span class="text-red-500" aria-label="必須項目">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            aria-describedby="email-error email-hint"
            class="w-full px-3 py-2 border border-gray-300 rounded-md
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                   invalid:border-red-500 invalid:ring-red-500
                   transition-colors duration-200"
            placeholder="example@email.com"
          >
          <p id="email-hint" class="mt-1 text-sm text-gray-500">
            ログイン時に使用するメールアドレスを入力してください
          </p>
          <p id="email-error" class="mt-1 text-sm text-red-600 hidden" role="alert">
            有効なメールアドレスを入力してください
          </p>
        </div>

        <!-- パスワード入力フィールド -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
            パスワード <span class="text-red-500" aria-label="必須項目">*</span>
          </label>
          <div class="relative">
            <input
              type="password"
              id="password"
              name="password"
              required
              minlength="8"
              aria-describedby="password-hint password-error"
              class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     invalid:border-red-500 invalid:ring-red-500
                     transition-colors duration-200"
              placeholder="8文字以上"
            >
            <button
              type="button"
              class="absolute right-2 top-1/2 transform -translate-y-1/2
                     text-gray-400 hover:text-gray-600 focus:text-gray-600
                     focus:outline-none focus:ring-2 focus:ring-blue-300 rounded
                     transition-colors duration-200"
              aria-label="パスワードを表示"
              onclick="togglePassword()"
            >
              👁️
            </button>
          </div>
          <p id="password-hint" class="mt-1 text-sm text-gray-500">
            8文字以上で、英数字を含めてください
          </p>
          <p id="password-error" class="mt-1 text-sm text-red-600 hidden" role="alert">
            パスワードは8文字以上で入力してください
          </p>
        </div>

        <!-- チェックボックス -->
        <div class="flex items-start">
          <input
            type="checkbox"
            id="terms"
            name="terms"
            required
            aria-describedby="terms-error"
            class="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded
                   focus:ring-2 focus:ring-blue-500
                   invalid:border-red-500 invalid:ring-red-500"
          >
          <label for="terms" class="ml-2 text-sm text-gray-700">
            <a href="#" class="text-blue-600 hover:text-blue-800 hover:underline
                              focus:outline-none focus:ring-2 focus:ring-blue-300 rounded">
              利用規約
            </a>
            に同意します <span class="text-red-500" aria-label="必須項目">*</span>
          </label>
          <p id="terms-error" class="hidden ml-6 text-sm text-red-600" role="alert">
            利用規約への同意が必要です
          </p>
        </div>

        <!-- 送信ボタン -->
        <div>
          <button
            type="submit"
            class="w-full bg-blue-600 hover:bg-blue-700 focus:bg-blue-700
                   disabled:bg-gray-400 disabled:cursor-not-allowed
                   text-white font-medium py-2 px-4 rounded-md
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                   transition-colors duration-200"
          >
            アカウントを作成
          </button>
        </div>
      </form>
      //addend
    </section>
```

2. JavaScriptの追加

HTMLの`</body>`タグの直前に以下のスクリプトを追加してください。

_index.html_
```html
  //addstart
  <script>
    function togglePassword() {
      const passwordInput = document.getElementById('password');
      const button = passwordInput.nextElementSibling;

      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        button.setAttribute('aria-label', 'パスワードを非表示');
        button.textContent = '🙈';
      } else {
        passwordInput.type = 'password';
        button.setAttribute('aria-label', 'パスワードを表示');
        button.textContent = '👁️';
      }
    }

    // フォームバリデーション
    document.querySelector('form').addEventListener('submit', function(e) {
      e.preventDefault();

      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const password = document.getElementById('password');
      const terms = document.getElementById('terms');

      // エラーメッセージをリセット
      document.querySelectorAll('[role="alert"]').forEach(el => el.classList.add('hidden'));

      let hasError = false;

      // 名前のバリデーション
      if (!name.value.trim()) {
        document.getElementById('name-error').classList.remove('hidden');
        hasError = true;
      }

      // メールのバリデーション
      if (!email.value.trim() || !email.validity.valid) {
        document.getElementById('email-error').classList.remove('hidden');
        hasError = true;
      }

      // パスワードのバリデーション
      if (password.value.length < 8) {
        document.getElementById('password-error').classList.remove('hidden');
        hasError = true;
      }

      // 利用規約のバリデーション
      if (!terms.checked) {
        document.getElementById('terms-error').classList.remove('hidden');
        hasError = true;
      }

      if (!hasError) {
        alert('フォームが正常に送信されました！');
      }
    });
  </script>
  //addend
</body>
</html>
```

3. ブラウザで動作確認

ブラウザを更新し、以下の動作を確認してください：

- **キーボードナビゲーション**: タブキーで各要素を移動し、フォーカスリングが表示されること
- **バリデーション**: 空のフィールドで送信しようとするとエラーメッセージが表示されること
- **パスワード表示切り替え**: 眼のアイコンをクリックしてパスワードの表示/非表示が切り替わること
- **aria属性**: スクリーンリーダーを使用している場合、適切に読み上げられること

:::

このフォームは、視覚的な状態変化だけでなく、スクリーンリーダーユーザーや キーボードナビゲーションユーザーにとっても利用しやすい設計になっています。

## 🎯 data属性を使用したカスタム状態管理

data属性を活用することで、JavaScriptと連携したより複雑な状態管理も可能です。Tailwind CSSでは、`data-*`属性に基づいた条件付きスタイリングが行えます。

:::syntax data属性バリアントの構文

```html
<element class="data-[state=open]:bg-blue-500" data-state="open">
```

`data-[attribute=value]:`プレフィックスでdata属性の値に応じたスタイルを適用できます。

:::

## 🔄 トグルスイッチとタブUIを作成してみよう

data属性を活用して、状態管理が必要なインタラクティブコンポーネントを作成しましょう。

:::step

1. インタラクティブコンポーネントの追加

`index.html`に以下の内容を追加してください。

_index.html_
```html
    <!-- data属性を使ったインタラクティブコンポーネント（既存のsectionタグの後に追加） -->
    <section class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4">data属性を使った状態管理</h2>

      //addstart
      <!-- トグルスイッチ -->
      <div class="mb-8">
        <h3 class="text-lg font-medium mb-4">設定項目</h3>
        <div class="space-y-4">
          <!-- 通知設定 -->
          <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 class="font-medium text-gray-900">プッシュ通知</h4>
              <p class="text-sm text-gray-500">新しいメッセージやアップデートの通知を受け取る</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked="false"
              data-state="off"
              onclick="toggleSwitch(this)"
              class="relative inline-flex h-6 w-11 items-center rounded-full
                     transition-colors duration-200
                     data-[state=off]:bg-gray-200 data-[state=on]:bg-blue-600
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span class="sr-only">プッシュ通知の切り替え</span>
              <span
                class="inline-block h-4 w-4 rounded-full bg-white shadow transform
                       transition-transform duration-200
                       data-[state=off]:translate-x-1 data-[state=on]:translate-x-6"
                data-state="off"
              ></span>
            </button>
          </div>

          <!-- ダークモード設定 -->
          <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 class="font-medium text-gray-900">ダークモード</h4>
              <p class="text-sm text-gray-500">画面を暗いテーマで表示する</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked="false"
              data-state="off"
              onclick="toggleSwitch(this)"
              class="relative inline-flex h-6 w-11 items-center rounded-full
                     transition-colors duration-200
                     data-[state=off]:bg-gray-200 data-[state=on]:bg-blue-600
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span class="sr-only">ダークモードの切り替え</span>
              <span
                class="inline-block h-4 w-4 rounded-full bg-white shadow transform
                       transition-transform duration-200
                       data-[state=off]:translate-x-1 data-[state=on]:translate-x-6"
                data-state="off"
              ></span>
            </button>
          </div>
        </div>
      </div>

      <!-- タブUI -->
      <div class="mb-8">
        <h3 class="text-lg font-medium mb-4">プロファイル情報</h3>
        <div data-tab-group="profile">
          <!-- タブヘッダー -->
          <div class="flex border-b border-gray-200">
            <button
              type="button"
              data-tab="personal"
              data-state="active"
              onclick="switchTab(this, 'profile')"
              class="px-4 py-2 text-sm font-medium transition-colors duration-200
                     data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600
                     data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-700"
            >
              個人情報
            </button>
            <button
              type="button"
              data-tab="security"
              data-state="inactive"
              onclick="switchTab(this, 'profile')"
              class="px-4 py-2 text-sm font-medium transition-colors duration-200
                     data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600
                     data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-700"
            >
              セキュリティ
            </button>
            <button
              type="button"
              data-tab="privacy"
              data-state="inactive"
              onclick="switchTab(this, 'profile')"
              class="px-4 py-2 text-sm font-medium transition-colors duration-200
                     data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600
                     data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-700"
            >
              プライバシー
            </button>
          </div>

          <!-- タブコンテンツ -->
          <div class="mt-4">
            <div
              data-tab-content="personal"
              data-state="active"
              class="data-[state=active]:block data-[state=inactive]:hidden"
            >
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">表示名</label>
                  <input type="text" value="田中太郎" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">自己紹介</label>
                  <textarea rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">フロントエンド開発者として5年の経験があります。</textarea>
                </div>
              </div>
            </div>

            <div
              data-tab-content="security"
              data-state="inactive"
              class="data-[state=active]:block data-[state=inactive]:hidden"
            >
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">現在のパスワード</label>
                  <input type="password" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">新しいパスワード</label>
                  <input type="password" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">パスワード確認</label>
                  <input type="password" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
              </div>
            </div>

            <div
              data-tab-content="privacy"
              data-state="inactive"
              class="data-state=active]:block data-[state=inactive]:hidden"
            >
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-700">プロフィールを公開する</span>
                  <input type="checkbox" checked class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500">
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-700">検索結果に表示する</span>
                  <input type="checkbox" class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500">
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-700">アクティビティを表示する</span>
                  <input type="checkbox" checked class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      //addend
    </section>
```

2. JavaScriptの機能追加

既存のscriptタグ内に以下の関数を追加してください。

_index.html_
```javascript
    //addstart
    // トグルスイッチの制御
    function toggleSwitch(button) {
      const currentState = button.getAttribute('data-state');
      const newState = currentState === 'off' ? 'on' : 'off';
      const isChecked = newState === 'on';

      // ボタンの状態を更新
      button.setAttribute('data-state', newState);
      button.setAttribute('aria-checked', isChecked.toString());

      // 内部のスイッチも更新
      const switchElement = button.querySelector('span:last-child');
      switchElement.setAttribute('data-state', newState);

      // 状態変更の通知（実際のアプリでは設定保存など）
      console.log(`設定が変更されました: ${isChecked ? 'ON' : 'OFF'}`);
    }

    // タブの切り替え
    function switchTab(clickedTab, groupName) {
      const tabGroup = document.querySelector(`[data-tab-group="${groupName}"]`);
      const allTabs = tabGroup.querySelectorAll('[data-tab]');
      const allContents = tabGroup.querySelectorAll('[data-tab-content]');
      const targetTab = clickedTab.getAttribute('data-tab');

      // すべてのタブを非アクティブにする
      allTabs.forEach(tab => {
        tab.setAttribute('data-state', 'inactive');
      });

      // すべてのコンテンツを非表示にする
      allContents.forEach(content => {
        content.setAttribute('data-state', 'inactive');
      });

      // クリックされたタブをアクティブにする
      clickedTab.setAttribute('data-state', 'active');

      // 対応するコンテンツを表示する
      const targetContent = tabGroup.querySelector(`[data-tab-content="${targetTab}"]`);
      if (targetContent) {
        targetContent.setAttribute('data-state', 'active');
      }
    }
    //addend
```

3. ブラウザで動作確認

ブラウザを更新し、以下の動作を確認してください：

- **トグルスイッチ**: クリックして状態が切り替わり、視覚的にも変化すること
- **タブUI**: 各タブをクリックして、対応するコンテンツが表示されること
- **キーボードナビゲーション**: タブキーで要素間を移動できること
- **aria属性**: スクリーンリーダーが状態を適切に読み上げること

:::

この例では、data属性を使用してコンポーネントの状態を管理し、Tailwind CSSの`data-[state=value]:`バリアントでスタイルを制御しています。JavaScriptとの連携により、動的で使いやすいUIコンポーネントを実現できます。

## 📱 レスポンシブな状態変化

状態バリアントとレスポンシブバリアントを組み合わせることで、デバイスサイズに応じて異なる状態変化を実装できます。これにより、モバイルとデスクトップで最適化されたユーザーエクスペリエンスを提供できます。

:::syntax レスポンシブ状態バリアントの構文

```html
<element class="hover:bg-blue-500 md:hover:bg-green-500">
```

ブレークポイントと状態バリアントを組み合わせることで、画面サイズに応じた状態変化を実装できます。

:::

## 📲 モバイル対応ナビゲーションを作成してみよう

レスポンシブな状態変化を活用して、デスクトップとモバイルで異なる動作をするナビゲーションを作成しましょう。

:::step

1. レスポンシブナビゲーションの追加

`index.html`に以下の内容を追加してください。

_index.html_
```html
    <!-- レスポンシブナビゲーション（既存のsectionタグの後に追加） -->
    <section class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4">レスポンシブナビゲーション</h2>

      //addstart
      <!-- ナビゲーションバー -->
      <nav class="bg-gray-900 rounded-lg overflow-hidden" data-nav="closed">
        <div class="px-4">
          <!-- ヘッダー部分 -->
          <div class="flex items-center justify-between h-16">
            <!-- ロゴ -->
            <div class="flex items-center">
              <div class="text-white text-xl font-bold">MyApp</div>
            </div>

            <!-- デスクトップメニュー（md以上で表示） -->
            <div class="hidden md:block">
              <div class="flex items-center space-x-4">
                <a href="#"
                   class="text-gray-300 hover:text-white hover:bg-gray-700
                          px-3 py-2 rounded-md text-sm font-medium
                          transition-colors duration-200">
                  ホーム
                </a>
                <a href="#"
                   class="text-gray-300 hover:text-white hover:bg-gray-700
                          px-3 py-2 rounded-md text-sm font-medium
                          transition-colors duration-200">
                  製品
                </a>
                <a href="#"
                   class="text-gray-300 hover:text-white hover:bg-gray-700
                          px-3 py-2 rounded-md text-sm font-medium
                          transition-colors duration-200">
                  サービス
                </a>
                <a href="#"
                   class="text-gray-300 hover:text-white hover:bg-gray-700
                          px-3 py-2 rounded-md text-sm font-medium
                          transition-colors duration-200">
                  お問い合わせ
                </a>
                <!-- ユーザーメニュー -->
                <div class="relative group">
                  <button
                    class="flex items-center text-gray-300 hover:text-white
                           focus:outline-none focus:ring-2 focus:ring-gray-500
                           rounded-full transition-colors duration-200"
                  >
                    <img class="h-8 w-8 rounded-full"
                         src="https://via.placeholder.com/32/6366f1/ffffff?text=U"
                         alt="ユーザーアイコン">
                    <svg class="ml-1 h-4 w-4 group-hover:text-white transition-colors duration-200"
                         fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clip-rule="evenodd" />
                    </svg>
                  </button>
                  <!-- ドロップダウンメニュー -->
                  <div class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg
                              opacity-0 invisible group-hover:opacity-100 group-hover:visible
                              transition-all duration-200 z-10">
                    <div class="py-1">
                      <a href="#"
                         class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100
                                transition-colors duration-200">
                        プロフィール
                      </a>
                      <a href="#"
                         class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100
                                transition-colors duration-200">
                        設定
                      </a>
                      <hr class="my-1">
                      <a href="#"
                         class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100
                                transition-colors duration-200">
                        ログアウト
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- モバイルメニューボタン（mdより小さい画面で表示） -->
            <div class="md:hidden">
              <button
                type="button"
                onclick="toggleMobileMenu()"
                class="text-gray-300 hover:text-white hover:bg-gray-700
                       focus:outline-none focus:ring-2 focus:ring-gray-500
                       p-2 rounded-md transition-colors duration-200"
                aria-expanded="false"
                aria-label="メニューを開く"
              >
                <!-- ハンバーガーアイコン -->
                <svg class="h-6 w-6 data-[nav=closed]:block data-[nav=open]:hidden"
                     data-nav="closed"
                     fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <!-- 閉じるアイコン -->
                <svg class="h-6 w-6 data-[nav=closed]:hidden data-[nav=open]:block"
                     data-nav="closed"
                     fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- モバイルメニュー -->
          <div class="md:hidden data-[nav=closed]:hidden data-[nav=open]:block"
               data-nav="closed">
            <div class="px-2 pt-2 pb-3 space-y-1 border-t border-gray-700">
              <a href="#"
                 class="text-gray-300 hover:text-white hover:bg-gray-700
                        block px-3 py-2 rounded-md text-base font-medium
                        transition-colors duration-200">
                ホーム
              </a>
              <a href="#"
                 class="text-gray-300 hover:text-white hover:bg-gray-700
                        block px-3 py-2 rounded-md text-base font-medium
                        transition-colors duration-200">
                製品
              </a>
              <a href="#"
                 class="text-gray-300 hover:text-white hover:bg-gray-700
                        block px-3 py-2 rounded-md text-base font-medium
                        transition-colors duration-200">
                サービス
              </a>
              <a href="#"
                 class="text-gray-300 hover:text-white hover:bg-gray-700
                        block px-3 py-2 rounded-md text-base font-medium
                        transition-colors duration-200">
                お問い合わせ
              </a>
              <!-- モバイル用ユーザーメニュー -->
              <div class="pt-4 pb-3 border-t border-gray-700">
                <div class="flex items-center px-3">
                  <img class="h-10 w-10 rounded-full"
                       src="https://via.placeholder.com/40/6366f1/ffffff?text=U"
                       alt="ユーザーアイコン">
                  <div class="ml-3">
                    <div class="text-base font-medium text-white">田中太郎</div>
                    <div class="text-sm font-medium text-gray-400">tanaka@example.com</div>
                  </div>
                </div>
                <div class="mt-3 space-y-1">
                  <a href="#"
                     class="text-gray-300 hover:text-white hover:bg-gray-700
                            block px-3 py-2 rounded-md text-base font-medium
                            transition-colors duration-200">
                    プロフィール
                  </a>
                  <a href="#"
                     class="text-gray-300 hover:text-white hover:bg-gray-700
                            block px-3 py-2 rounded-md text-base font-medium
                            transition-colors duration-200">
                    設定
                  </a>
                  <a href="#"
                     class="text-gray-300 hover:text-white hover:bg-gray-700
                            block px-3 py-2 rounded-md text-base font-medium
                            transition-colors duration-200">
                    ログアウト
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <!-- デモ用コンテンツ -->
      <div class="mt-6 p-4 bg-gray-50 rounded-lg">
        <p class="text-sm text-gray-600">
          このナビゲーションは画面サイズに応じて表示が変わります：
        </p>
        <ul class="mt-2 text-sm text-gray-600 list-disc list-inside">
          <li><strong>デスクトップ（768px以上）</strong>: 水平メニューとドロップダウン</li>
          <li><strong>モバイル（767px以下）</strong>: ハンバーガーメニューと垂直リスト</li>
        </ul>
        <p class="mt-2 text-sm text-gray-600">
          ブラウザの幅を変更して動作を確認してみてください。
        </p>
      </div>
      //addend
    </section>
```

2. モバイルメニュー制御の追加

既存のscriptタグ内に以下の関数を追加してください。

_index.html_
```javascript
    //addstart
    // モバイルメニューの制御
    function toggleMobileMenu() {
      const nav = document.querySelector('[data-nav]');
      const mobileMenu = nav.querySelector('.md\\:hidden [data-nav]');
      const button = nav.querySelector('button[aria-expanded]');
      const icons = button.querySelectorAll('svg');

      const currentState = nav.getAttribute('data-nav');
      const newState = currentState === 'closed' ? 'open' : 'closed';
      const isOpen = newState === 'open';

      // ナビゲーションの状態を更新
      nav.setAttribute('data-nav', newState);
      mobileMenu.setAttribute('data-nav', newState);

      // ボタンのaria属性を更新
      button.setAttribute('aria-expanded', isOpen.toString());
      button.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');

      // アイコンの状態を更新
      icons.forEach(icon => {
        icon.setAttribute('data-nav', newState);
      });
    }

    // ウィンドウサイズ変更時の処理
    window.addEventListener('resize', function() {
      const nav = document.querySelector('[data-nav]');
      const mobileMenu = nav.querySelector('.md\\:hidden [data-nav]');
      const button = nav.querySelector('button[aria-expanded]');

      // デスクトップサイズになった場合、モバイルメニューを閉じる
      if (window.innerWidth >= 768) {
        nav.setAttribute('data-nav', 'closed');
        mobileMenu.setAttribute('data-nav', 'closed');
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-label', 'メニューを開く');

        const icons = button.querySelectorAll('svg');
        icons.forEach(icon => {
          icon.setAttribute('data-nav', 'closed');
        });
      }
    });
    //addend
```

3. ブラウザで動作確認

ブラウザを更新し、以下の動作を確認してください：

- **デスクトップ表示**: 水平メニューとホバー時のドロップダウン表示
- **モバイル表示**: ハンバーガーメニューアイコンの表示
- **メニュー切り替え**: モバイルでハンバーガーアイコンをクリックしてメニューの開閉
- **レスポンシブ**: ブラウザ幅を変更して表示が切り替わること
- **キーボードナビゲーション**: タブキーでメニュー項目を移動できること

:::

このナビゲーションは、画面サイズに応じて全く異なるUI/UX を提供します。デスクトップでは効率的な水平メニュー、モバイルでは親指で操作しやすい垂直メニューを実装しています。

## まとめ

この章では、Tailwind CSSの状態バリアントと擬似クラスを使用して、ユーザーとのインタラクションを豊かにするUIコンポーネントの実装方法を学習しました。

:::note 要点のまとめ

- **基本的な状態バリアント**: hover、focus、activeによる視覚的フィードバック
- **グループホバー**: 親要素の状態に応じた子要素のスタイル変更
- **アクセシビリティ対応**: フォーカス管理、aria属性、キーボードナビゲーション
- **data属性活用**: JavaScriptとの連携による動的な状態管理
- **レスポンシブな状態変化**: デバイスサイズに応じた最適なインタラクション

:::

状態バリアントの適切な活用により、ユーザーにとって直感的で使いやすいインターフェースを構築できます。特に、アクセシビリティへの配慮は現代のWebデザインに不可欠な要素です。

次の章では、[ダークモード](dark-mode.md)の実装方法を学習し、現代的なWebサイトに欠かせない機能を習得していきます。

## 関連リンク

- [ユーティリティクラスの基本](utility-basics.md)
- [レスポンシブとブレークポイント](breakpoints-responsive.md)
- [ダークモード](dark-mode.md)

## さらに深く学習したい方へ

今回学習した状態バリアントとアクセシビリティの概念は、実際のプロジェクトでも頻繁に使用される重要な技術です。より複雑なインタラクションやコンポーネント設計について深く学びたい方は、実践的なWeb開発研修での学習をお勧めします。

## 次のステップ

準備はできましたか？次は[ダークモード](dark-mode.md)で、現代のWebデザインに欠かせないテーマ切り替え機能を実装してみましょう。