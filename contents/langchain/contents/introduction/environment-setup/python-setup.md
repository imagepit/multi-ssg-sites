---
title: Python環境セットアップ
slug: python-setup
status: not_started
filepath: contents/introduction/environment-setup/python-setup.md
post_type: pages
goal: Python環境でのLangChainセットアップを完了し、実際にコードを実行できる状態にする。
seo_title: LangChain Python環境構築 | pip・conda・venv設定完全手順
seo_description: Python環境でのLangChainセットアップ手順。pip、conda、仮想環境の作成から必要なパッケージのインストールまで詳しく解説。
seo_keywords: LangChain Python, pip install, conda, venv, Python環境設定
handson_overview: Python仮想環境作成、LangChainインストール、APIキー設定、動作確認を行う手順を掲載
---

## 🐍 はじめに

LangChainを使った開発を始めるには、まず適切なPython環境を構築することが重要です。このページでは、Python環境の基礎から仮想環境の作成、LangChainのインストール、そして依存関係の管理まで、実際に手を動かしながら学習していきます。

適切な環境構築により、プロジェクトごとに独立した環境を維持し、バージョン競合を避けながら効率的な開発が可能になります。

### このページで学べる事

このページでは、LangChain開発に必要なPython環境の構築方法について、実践的なハンズオンを通じて学習します。

:::note

- Python環境管理の基本概念と重要性
- 仮想環境の作成と有効化・無効化の方法
- LangChainとその依存パッケージのインストール手順
- requirements.txtを使った依存関係管理
- プロジェクト構造のベストプラクティス
- トラブルシューティングの基本手法

:::

## 🔧 Python環境管理の基礎知識

Python開発において環境管理は非常に重要な概念です。複数のプロジェクトを扱う際、それぞれ異なるパッケージのバージョンが必要になることがあります。

:::note Python環境管理とは

Python環境管理とは、プロジェクトごとに独立したPythonインタープリターと依存パッケージのセットを管理する仕組みです。これにより、プロジェクト間でのバージョン競合を防ぎ、クリーンな開発環境を維持できます。

:::

### 環境管理のメリット

**プロジェクト独立性の確保**

- 各プロジェクトで異なるパッケージバージョンを使用可能
- 一つのプロジェクトの変更が他に影響しない
- システム全体のPython環境を汚染しない

**依存関係の明確化**

- プロジェクトに必要なパッケージを明確に管理
- 他の開発者との環境共有が容易
- デプロイメント時の再現性が向上

### 主要な環境管理ツール

Python環境管理には複数のツールがありますが、それぞれに特徴があります。

| ツール     | 特徴                 | 適用場面               |
| ---------- | -------------------- | ---------------------- |
| venv       | Python標準ライブラリ | 基本的な仮想環境作成   |
| virtualenv | サードパーティツール | より高機能な仮想環境   |
| conda      | パッケージ・環境管理 | データサイエンス分野   |
| pipenv     | Pipfile使用          | モダンなパッケージ管理 |
| poetry     | pyproject.toml使用   | 依存関係解決に優れる   |

このページでは、Pythonに標準で含まれている`venv`を使用します。

## 🏗️ 仮想環境の構築

仮想環境は、プロジェクトごとに独立したPython環境を作成する仕組みです。LangChain開発においても、プロジェクト専用の環境を作成することで、安定した開発環境を構築できます。

:::syntax 仮想環境作成の基本構文

```bash
python -m venv [環境名]
```

:::

### 仮想環境を作成して確認してみよう

それでは、実際に仮想環境を作成し、有効化してLangChain開発環境を構築してみましょう。

:::step

1. プロジェクトフォルダを作成する

任意の場所（デスクトップなど）で`langchain-tutorial`フォルダを作成し、そのフォルダに移動します。

_ターミナルでコマンド実行_

```bash
mkdir langchain-tutorial
cd langchain-tutorial
```

2. 仮想環境を作成する

`venv`を使用してプロジェクト専用の仮想環境を作成します。

_ターミナルでコマンド実行_

```bash
python -m venv langchain-env
```

このコマンドにより、`langchain-env`という名前の仮想環境が作成されます。

3. 仮想環境を有効化する

作成した仮想環境を有効化します。OSによってコマンドが異なります。

**macOS/Linux の場合:**
_ターミナルでコマンド実行_

```bash
source langchain-env/bin/activate
```

**Windows の場合:**
_コマンドプロンプトで実行_

```cmd
langchain-env\Scripts\activate
```

4. 仮想環境の有効化を確認する

仮想環境が正しく有効化されているか確認します。

_ターミナルでコマンド実行_

```bash
which python
pip list
```

**実行結果例:**

```
/path/to/langchain-tutorial/langchain-env/bin/python
Package    Version
---------- -------
pip        23.2.1
setuptools 68.1.2
```

プロンプトの前に`(langchain-env)`が表示され、`which python`でプロジェクト内のPythonパスが表示されれば成功です。

:::

これで、LangChain開発専用の独立した仮想環境が構築できました。この環境内でインストールしたパッケージは、システム全体やその他のプロジェクトに影響を与えません。

## 📦 LangChainのインストール

仮想環境が構築できたら、次にLangChainとその関連パッケージをインストールします。LangChainは複数のパッケージから構成されており、用途に応じて必要なものを選択してインストールします。

:::note LangChainパッケージの構成

LangChainは以下の主要パッケージから構成されています：

- `langchain-core`: 基本的な抽象化とインターフェース
- `langchain`: メインライブラリ（統合機能含む）
- `langchain-community`: コミュニティ統合パッケージ
- `langchain-openai`: OpenAI統合専用パッケージ

:::

### 基本的なLangChainパッケージの特徴

**langchain-core**

- LangChainの基盤となる抽象化層
- 軽量で他のパッケージの依存関係として使用
- 基本的なデータ構造とインターフェースを提供

**langchain**

- 最も一般的に使用されるメインパッケージ
- 多くの統合機能と便利なユーティリティを含む
- 学習や基本的な開発に適している

**langchain-openai**

- OpenAI APIとの統合に特化
- ChatGPTやGPT-4などのモデルを使用する場合に必要
- 軽量で特定の用途に最適化

### LangChainをインストールして動作確認してみよう

実際にLangChainをインストールし、簡単な動作確認を行ってみましょう。

:::step

1. 基本的なLangChainをインストールする

まず、メインのLangChainパッケージをインストールします。

_ターミナルでコマンド実行_

```bash
pip install langchain
```

2. OpenAI統合パッケージをインストールする

OpenAI APIを使用するために専用パッケージをインストールします。

_ターミナルでコマンド実行_

```bash
pip install langchain-openai
```

3. 追加の便利なパッケージをインストールする

開発に便利な追加パッケージをインストールします。

_ターミナルでコマンド実行_

```bash
pip install python-dotenv jupyter
```

- `python-dotenv`: 環境変数管理
- `jupyter`: 対話的な開発環境

4. インストールの確認

インストールされたパッケージを確認します。

_ターミナルでコマンド実行_

```bash
pip list | grep langchain
```

**実行結果例:**

```
langchain              0.1.0
langchain-community    0.0.10
langchain-core         0.1.0
langchain-openai       0.0.2
```

5. 簡単な動作テストを実行する

LangChainが正しくインストールされているか確認するため、簡単なテストを実行します。

`test_langchain.py`ファイルを作成して以下のコードを追加します。

_test_langchain.py_

```python
from langchain.schema import HumanMessage, SystemMessage
from langchain.schema.messages import BaseMessage

# LangChainの基本的なメッセージクラスをテスト
def test_langchain_basic():
    # システムメッセージを作成
    system_msg = SystemMessage(content="あなたは親切なアシスタントです。")

    # 人間からのメッセージを作成
    human_msg = HumanMessage(content="こんにちは！")

    # メッセージの内容を表示
    print("システムメッセージ:", system_msg.content)
    print("人間のメッセージ:", human_msg.content)
    print("LangChainの基本機能が正常に動作しています！")

if __name__ == "__main__":
    test_langchain_basic()
```

6. テストスクリプトを実行する

作成したテストスクリプトを実行して動作確認します。

_ターミナルでコマンド実行_

```bash
python test_langchain.py
```

**実行結果:**

```
システムメッセージ: あなたは親切なアシスタントです。
人間のメッセージ: こんにちは！
LangChainの基本機能が正常に動作しています！
```

:::

これでLangChainのインストールと基本的な動作確認が完了しました。エラーなく実行できれば、LangChain開発環境が正しく構築されています。

## 📋 依存関係管理

プロジェクトの依存関係を適切に管理することは、チーム開発や本番環境への展開において非常に重要です。Pythonでは`requirements.txt`ファイルを使用して依存関係を管理するのが一般的です。

:::syntax requirements.txtの基本構文

```
パッケージ名==バージョン番号
パッケージ名>=最小バージョン
パッケージ名~=互換バージョン
```

:::

### 依存関係管理の重要性

**再現可能な環境構築**

- 他の開発者が同じ環境を簡単に構築できる
- 本番環境とローカル環境の差異を最小化
- CI/CDパイプラインでの自動化が容易

**バージョン競合の防止**

- 特定のバージョンを固定して安定性を確保
- 予期しないバージョンアップによる問題を回避
- セキュリティアップデートの管理が容易

### requirements.txtを作成して依存関係を管理してみよう

実際にプロジェクトの依存関係を管理するための`requirements.txt`ファイルを作成し、使用方法を学びましょう。

:::step

1. 現在の依存関係を確認する

現在インストールされているパッケージとそのバージョンを確認します。

_ターミナルでコマンド実行_

```bash
pip freeze
```

**実行結果例:**

```
annotated-types==0.6.0
anyio==4.2.0
certifi==2023.11.17
charset-normalizer==3.3.2
dataclasses-json==0.6.3
idna==3.6
jsonpatch==1.33
jsonpointer==2.4
langchain==0.1.0
langchain-community==0.0.10
langchain-core==0.1.0
langchain-openai==0.0.2
marshmallow==3.20.2
mypy-extensions==1.0.0
numpy==1.26.3
packaging==23.2
pydantic==2.5.3
pydantic_core==2.14.6
python-dotenv==1.0.0
PyYAML==6.0.1
requests==2.31.0
sniffio==1.3.0
SQLAlchemy==2.0.25
tenacity==8.2.3
typing_extensions==4.9.0
urllib3==2.1.0
```

2. requirements.txtファイルを作成する

現在の環境の依存関係を`requirements.txt`に出力します。

_ターミナルでコマンド実行_

```bash
pip freeze > requirements.txt
```

3. requirements.txtの内容を確認・編集する

作成された`requirements.txt`の内容を確認し、必要に応じて編集します。

_requirements.txt_

```txt
# LangChain関連パッケージ
langchain==0.1.0
langchain-openai==0.0.2
langchain-community==0.0.10

# 開発支援ツール
python-dotenv==1.0.0
jupyter==1.0.0

# データ処理
numpy>=1.24.0
pydantic>=2.0.0

# HTTP通信
requests>=2.28.0
```

主要なパッケージのみを記載し、コメントを追加して管理しやすくします。

4. 新しい仮想環境でテストする

`requirements.txt`が正しく動作するか、新しい仮想環境で確認してみましょう。

まず、現在の仮想環境を無効化します。

_ターミナルでコマンド実行_

```bash
deactivate
```

新しいテスト用仮想環境を作成します。

_ターミナルでコマンド実行_

```bash
python -m venv test-env
source test-env/bin/activate  # macOS/Linux
# test-env\Scripts\activate  # Windows
```

5. requirements.txtからパッケージをインストールする

作成した`requirements.txt`を使用してパッケージをインストールします。

_ターミナルでコマンド実行_

```bash
pip install -r requirements.txt
```

6. インストール結果を確認する

正しくインストールされたか確認します。

_ターミナルでコマンド実行_

```bash
pip list
python test_langchain.py
```

同じ結果が得られれば、依存関係管理が成功しています。

7. プロジェクト構造を整理する

最終的なプロジェクト構造を確認します。

_ターミナルでコマンド実行_

```bash
ls -la
```

**プロジェクト構造例:**

```
langchain-tutorial/
├── langchain-env/          # メイン仮想環境
├── test-env/              # テスト用仮想環境
├── requirements.txt       # 依存関係定義
├── test_langchain.py      # テストスクリプト
└── .env                   # 環境変数（後で作成）
```

:::

これで、プロジェクトの依存関係を適切に管理できるようになりました。`requirements.txt`により、他の開発者やデプロイメント環境で同じ依存関係を簡単に再現できます。

## 📝 まとめ

このページでは、LangChain開発に必要なPython環境の構築方法について学習しました。適切な環境管理により、安定した開発環境を維持し、効率的なLangChainアプリケーション開発が可能になります。

:::note 要点のまとめ

- 仮想環境により、プロジェクトごとに独立したPython環境を構築できる
- LangChainは用途に応じて複数のパッケージから選択してインストールする
- requirements.txtを使用して依存関係を明確に管理する
- 環境の再現性を確保することで、チーム開発や本番展開が円滑になる
- トラブルシューティングでは仮想環境の再作成が有効な手段となる

:::

次のページでは、構築したPython環境でAPIキーを安全に管理する方法について学習します。環境変数の設定や`.env`ファイルの活用により、セキュアなLangChainアプリケーション開発を実現しましょう。

[APIキー管理](./api-key-management)

## 🔗 関連リンク

- [Python公式ドキュメント - venv](https://docs.python.org/ja/3/library/venv.html)
- [LangChain公式ドキュメント](https://python.langchain.com/docs/get_started/introduction)
- [pip公式ドキュメント](https://pip.pypa.io/en/stable/)
- [Python仮想環境のベストプラクティス](https://realpython.com/python-virtual-environments-a-primer/)

## 🚀 さらに深く学習したい方へ

LangChainを使ったより高度なアプリケーション開発や、本格的なAIシステム構築について学びたい方は、私たちの研修プラットフォームをご利用ください。実践的なプロジェクトベースの学習により、エンタープライズレベルのLangChainアプリケーション開発スキルを習得できます。
