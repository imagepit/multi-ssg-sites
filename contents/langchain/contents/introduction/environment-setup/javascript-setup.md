---
title: JavaScript環境セットアップ
slug: javascript-setup
parent: environment-setup
status: not_started
filepath: contents/introduction/environment-setup/javascript-setup.md
post_type: pages
goal: JavaScript/TypeScript環境でのLangChainセットアップを完了し、実際にコードを実行できる状態にする。
seo_title: LangChain JavaScript環境構築 | npm・Node.js設定完全手順
seo_description: JavaScript/TypeScript環境でのLangChainセットアップ手順。Node.js、npm、必要なパッケージのインストールから動作確認まで詳しく解説。
seo_keywords: LangChain JavaScript, npm install, Node.js, TypeScript
handson_overview: Node.js環境準備、LangChainインストール、TypeScript設定、APIキー設定、動作確認を行う手順を掲載
---

# Node.js環境セットアップ

## 🚀 はじめに

近年、大規模言語モデル（LLM）を活用したアプリケーション開発が急速に普及しています。その中でも、LLMとの連携を容易にするフレームワーク「LangChain」は、多くの開発者から注目を集めています。LangChainは元々Pythonで開発されましたが、JavaScript/TypeScriptにも対応した`langchain.js`が登場し、Node.js環境でも利用できるようになりました。

この記事では、Node.jsとTypeScriptを用いてLangChainの開発環境を構築する方法を、ハンズオン形式で詳しく解説します。Web開発で使い慣れたNode.js環境で、LLMアプリケーション開発を始める第一歩を踏み出しましょう。

### このページで学べる事

このページでは、Node.jsを使ったLangChain開発の基礎を学びます。

:::note

- Node.jsプロジェクトの初期設定方法
- TypeScriptの導入と設定
- LangChain関連ライブラリのインストール
- 簡単なLLM呼び出しプログラムの作成と実行

:::

## 📦 Node.jsとTypeScriptによる開発環境の準備

まずはじめに、LangChainを動作させるためのNode.jsプロジェクトを作成し、TypeScriptで開発できる環境を整えます。

### Node.jsプロジェクトの初期化

LangChainプロジェクト用のディレクトリを作成し、npmの`package.json`ファイルを生成します。

:::step

1.  **プロジェクトディレクトリの作成**

任意の場所（デスクトップなど）に`langchain-nodejs-handson`という名前のフォルダを作成し、ターミナルでそのディレクトリに移動します。

```bash
mkdir langchain-nodejs-handson
cd langchain-nodejs-handson
```

2.  **npmプロジェクトの初期化**

次のコマンドを実行して、`package.json`ファイルを生成します。`-y`フラグを付けることで、全ての質問にデフォルト値で回答し、すぐにファイルが作成されます。

```bash
npm init -y
```

これにより、プロジェクトの基本的な設定が記述された`package.json`ファイルが作成されます。

:::

これで、Node.jsプロジェクトの骨格が完成しました。

### TypeScriptの導入

次に、静的型付け言語であるTypeScriptを導入します。TypeScriptを使うことで、コードの品質と開発効率を向上させることができます。

:::step

1.  **TypeScript関連ライブラリのインストール**

開発時のみ必要となるTypeScript本体と、Node.jsの型定義ファイルをインストールします。

```bash
npm install --save-dev typescript @types/node
```

2.  **TypeScript設定ファイルの生成**

次のコマンドで、TypeScriptのコンパイラ設定を記述する`tsconfig.json`ファイルを生成します。

```bash
npx tsc --init
```

3.  **`tsconfig.json`の編集**

生成された`tsconfig.json`を、モダンなNode.js開発向けに編集します。

_tsconfig.json_

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

**主な設定項目の解説:**

- `"target": "ES2020"`: コンパイル後のJavaScriptバージョンを指定します。
- `"module": "NodeNext"`, `"moduleResolution": "NodeNext"`: 最新のNode.jsのモジュール解決方式（ES Modules）に対応させます。
- `"outDir": "./dist"`: コンパイル後のJavaScriptファイルが出力されるディレクトリを指定します。
- `"rootDir": "./src"`: TypeScriptソースファイルを配置するディレクトリを指定します。

4.  **`package.json`の編集**

`package.json`に`"type": "module"`を追加して、プロジェクト全体でES Modulesを使用することを宣言します。また, `scripts`に`build`と`start`を追加します。

_package.json_

```json
{
  "name": "langchain-nodejs-handson",
  "version": "1.0.0",
  "description": "",
  "type": "module",
  "main": "index.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@types/node": "^20.12.12",
    "typescript": "^5.4.5"
  }
}
```

:::

これでTypeScriptで開発する準備が整いました。

## 🦜 LangChainの導入と実行

いよいよLangChainをプロジェクトに導入し、簡単なプログラムを動かしてみましょう。

### LangChainライブラリのインストール

`langchain.js`には、機能ごとに多くのパッケージが分割されています。今回は、OpenAIのモデルを扱うための基本的なパッケージをインストールします。

:::note
OpenAI APIを利用するためには、別途APIキーの取得が必要です。[APIキーの管理](./api-key-management)のページを参考に、APIキーを取得して環境変数に設定しておいてください。
:::

:::step

1.  **LangChain関連パッケージのインストール**

LLMとの基本的なやり取りを行う`@langchain/core`と、OpenAIのモデルを利用するための`@langchain/openai`をインストールします。また、環境変数からAPIキーを読み込むために`dotenv`もインストールします。

```bash
npm install @langchain/core @langchain/openai dotenv
```

:::

### はじめてのLangChainプログラム

準備が整ったので、実際にLangChainを使ってOpenAIのLLMを呼び出すコードを書いてみましょう。

:::step

1.  **ソースコード用ディレクトリの作成**

`tsconfig.json`の`rootDir`で設定した`src`ディレクトリを作成します。

```bash
mkdir src
```

2.  **環境変数ファイル `.env` の作成**

プロジェクトのルートディレクトリに`.env`ファイルを作成し、OpenAIのAPIキーを記述します。

_.env_

```
OPENAI_API_KEY="your-api-key"
```

`your-api-key`の部分は、ご自身のAPIキーに置き換えてください。

3.  **`index.ts`の作成**

`src`ディレクトリに`index.ts`というファイルを作成し、以下のコードを記述します。

_src/index.ts_

```typescript
import { ChatOpenAI } from '@langchain/openai'
import 'dotenv/config'

// 1. モデルのインスタンスを作成
const model = new ChatOpenAI({
  model: 'gpt-3.5-turbo',
  temperature: 0.7,
})

// 2. モデルを呼び出し
async function main() {
  const response = await model.invoke('こんにちは！')
  console.log(response)
}

main()
```

**コードの解説:**

- `import "dotenv/config";`: `.env`ファイルから環境変数を読み込みます。
- `new ChatOpenAI(...)`: OpenAIのチャットモデルを利用するためのインスタンスを生成します。`model`や`temperature`（出力のランダム性）などのパラメータを指定できます。
- `model.invoke(...)`: モデルにプロンプト（入力テキスト）を与えて、応答を生成させます。

4.  **ビルドと実行**

まず、TypeScriptのコードをJavaScriptにコンパイル（ビルド）します。

```bash
npm run build
```

ビルドが成功すると、`dist`ディレクトリに`index.js`が生成されます。次に、そのJavaScriptファイルを実行します。

```bash
npm run start
```

_実行結果の例_

```bash
AIMessage {
  "id": "chatcmpl-CCiHMhX7rhCHVMiP4yE8zo83Hu0nQ",
  "content": "こんにちは！元気ですか？何かお手伝いできることがあれば教えてくださいね。",
  "additional_kwargs": {},
  "response_metadata": {
    "tokenUsage": {
      "promptTokens": 9,
      "completionTokens": 31,
      "totalTokens": 40
    },
    "finish_reason": "stop",
    "model_name": "gpt-3.5-turbo-0125"
  },
  "tool_calls": [],
  "invalid_tool_calls": [],
  "usage_metadata": {
    "output_tokens": 31,
    "input_tokens": 9,
    "total_tokens": 40,
    "input_token_details": {
      "audio": 0,
      "cache_read": 0
    },
    "output_token_details": {
      "audio": 0,
      "reasoning": 0
    }
  }
}
```

上記のように、LLMからの応答が`AIMessage`オブジェクトとしてコンソールに出力されれば成功です！

:::

これで、Node.js環境でLangChainを動かすことができました。

## まとめ

このページでは、Node.jsとTypeScriptを用いてLangChainの開発環境を構築し、簡単なLLM呼び出しプログラムを実行するまでの一連の流れを解説しました。

:::note 要点のまとめ

- `npm init`でNode.jsプロジェクトを作成し、TypeScriptを導入して`tsconfig.json`を設定しました。
- `@langchain/core`と`@langchain/openai`をインストールし、LangChainを利用する準備をしました。
- `ChatOpenAI`クラスを使ってモデルをインスタンス化し、`.invoke()`メソッドでLLMからの応答を取得しました。

:::

これで、あなたもNode.js環境でLLMアプリケーションを開発する準備が整いました。次のページでは、より実践的なLangChainの機能について学んでいきましょう。

[LangChainとは何か？](./what-is-langchain)

## 関連リンク

- [LangChain.js 公式ドキュメント](https://js.langchain.com/docs/get_started/introduction)
- [TypeScript 公式サイト](https://www.typescriptlang.org/)
- [Node.js 公式サイト](https://nodejs.org/)

## さらに深く学習したい方へ

このページで学んだ内容をさらに深く理解し、実践的なスキルを身につけたい方には、以下の研修プラットフォームがおすすめです。ハンズオン形式で、より高度なLangChainの活用方法を学ぶことができます。
