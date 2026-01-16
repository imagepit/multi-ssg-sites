---
title: LangChainとは？
slug: what-is-langchain
parent: introduction
status: not_started
filepath: contents/introduction/what-is-langchain.md
post_type: pages
goal: LangChainの概念、特徴、利点を理解し、なぜLangChainを学ぶべきかを明確にする。
seo_title: LangChainとは？LLMアプリケーション開発フレームワークの特徴
seo_description: LangChainの基本概念、特徴、LLMアプリケーション開発における位置づけを詳しく解説。他のフレームワークとの比較も含む包括的な概要。
seo_keywords: LangChain 概要, LLMフレームワーク, AI開発ツール
handson_overview: 不要
---

## はじめに

現代のAIアプリケーション開発において、大規模言語モデル（LLM）は革新的な可能性を秘めています。しかし、単純にOpenAI APIやClaude APIを呼び出すだけでは、複雑なアプリケーションを構築することは困難です。そこで登場したのが**LangChain**です。

LangChainは、LLMを使用したアプリケーション開発を劇的に簡素化し、より強力で実用的なAIアプリケーションを構築するためのフレームワークです。従来の開発手法では、プロンプトエンジニアリング、データ統合、メモリ管理、エージェント機能などを一から実装する必要がありましたが、LangChainはこれらの複雑な処理を抽象化し、開発者がビジネスロジックに集中できる環境を提供します。

### このページで学べる事

このページでは、LangChainの基本概念から実際のコード例まで、AI開発の新しいパラダイムを学習します。

:::note

- LangChainの基本概念とアーキテクチャ
- LLMアプリケーション開発における課題と解決策
- LangChainのコアコンポーネントの理解
- 実際のコード例によるハンズオン体験
- LangChainエコシステムの全体像
- 従来の開発手法との違い

:::

[premium payment_type="premium" price="1000"]

## LangChainとは何か

**LangChain**は、大規模言語モデル（LLM）を使用したアプリケーション開発のためのフレームワークです。2022年にHarrison Chaseによって作成され、AI開発コミュニティで急速に普及しています。

LangChainの最大の特徴は、複数のLLMプロバイダー（OpenAI、Anthropic、Google、Hugging Faceなど）を統一的なインターフェースで扱えることです。これにより、プロバイダーの違いを意識することなく、一貫した方法でLLMアプリケーションを開発できます。

:::note LLM（Large Language Model）とは

大規模言語モデルは、膨大なテキストデータで訓練された深層学習モデルです。GPT-4、Claude、PaLMなどが代表例で、自然言語理解と生成において人間レベルの性能を示します。

:::

### LangChainが解決する課題

従来のLLMアプリケーション開発では、以下のような課題がありました：

1. **プロバイダー固有のAPI**: 異なるLLMプロバイダーごとに異なるAPIを学習する必要
2. **プロンプト管理の複雑さ**: 長大で複雑なプロンプトの管理とバージョン管理
3. **データ統合の困難さ**: 外部データソースとの連携における複雑な処理
4. **メモリ管理**: 会話の文脈や状態を適切に管理する仕組みの欠如
5. **エージェント実装の複雑さ**: 自律的に行動するAIエージェントの構築の困難

LangChainは、これらの課題に対して体系的なソリューションを提供します。

### LangChainの核となる設計思想

LangChainは**「Composability」**（組み合わせ可能性）を中心に設計されています。小さな機能単位を組み合わせて、複雑なワークフローを構築できる仕組みです。

:::syntax 基本的な構成要素の組み合わせ

```python
# LangChainの基本的な組み合わせ方式
from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

# コンポーネントの定義
llm = OpenAI(temperature=0.7)
prompt = PromptTemplate(
    input_variables=["topic"],
    template="以下のトピックについて説明してください: {topic}"
)

# チェーンとして組み合わせ
chain = LLMChain(llm=llm, prompt=prompt)
result = chain.run("機械学習")
```

:::

## LangChainのコアアーキテクチャ

LangChainは、以下の主要コンポーネントで構成されています。

### 1. Models（モデル）

LangChainでは、様々なLLMプロバイダーを統一されたインターフェースで扱えます。

```python
from langchain.llms import OpenAI, Anthropic
from langchain.chat_models import ChatOpenAI

# 異なるプロバイダーでも同じインターフェース
openai_llm = OpenAI(model="gpt-3.5-turbo-instruct")
anthropic_llm = Anthropic(model="claude-3-sonnet-20240229")
chat_model = ChatOpenAI(model="gpt-4")

# 全て同じメソッドで実行可能
response1 = openai_llm.invoke("こんにちは")
response2 = anthropic_llm.invoke("こんにちは")
response3 = chat_model.invoke("こんにちは")
```

### 2. Prompts（プロンプト）

プロンプト管理を効率化する機能群です。

```python
from langchain.prompts import PromptTemplate, ChatPromptTemplate

# 基本的なプロンプトテンプレート
basic_prompt = PromptTemplate(
    input_variables=["product", "language"],
    template="{product}の{language}での説明文を作成してください。"
)

# チャット用プロンプトテンプレート
chat_prompt = ChatPromptTemplate.from_messages([
    ("system", "あなたは親切なアシスタントです。"),
    ("user", "{user_input}")
])
```

### 3. Chains（チェーン）

複数の処理を連鎖させて実行する仕組みです。

:::syntax チェーンの基本構造

```python
from langchain.chains import LLMChain, SimpleSequentialChain

# 単一チェーン
chain1 = LLMChain(
    llm=llm,
    prompt=PromptTemplate(
        input_variables=["topic"],
        template="以下のトピックの概要を3行で説明: {topic}"
    ),
    output_key="summary"
)

# 連続チェーン
chain2 = LLMChain(
    llm=llm,
    prompt=PromptTemplate(
        input_variables=["summary"],
        template="以下の内容をより詳しく説明: {summary}"
    ),
    output_key="detailed"
)

# チェーンの連結
overall_chain = SimpleSequentialChain(
    chains=[chain1, chain2],
    verbose=True
)
```

:::

### 4. Memory（メモリ）

会話の履歴や状態を管理する機能です。

```python
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain

# メモリ付き会話チェーン
memory = ConversationBufferMemory()
conversation = ConversationChain(
    llm=llm,
    memory=memory,
    verbose=True
)

# 会話の継続
response1 = conversation.predict(input="私の名前は田中です")
response2 = conversation.predict(input="私の名前を覚えていますか？")
```

### 5. Agents（エージェント）

外部ツールを使用して自律的に行動するエージェントシステムです。

```python
from langchain.agents import initialize_agent, Tool
from langchain.utilities import SerpAPIWrapper

# 検索ツールの定義
search = SerpAPIWrapper()
tools = [
    Tool(
        name="Search",
        func=search.run,
        description="最新の情報を検索する際に使用"
    )
]

# エージェントの初期化
agent = initialize_agent(
    tools,
    llm,
    agent_type="zero-shot-react-description",
    verbose=True
)

# エージェントの実行
result = agent.run("2024年のオリンピックについて教えて")
```

## 従来の開発手法との違い

### 従来のAPIベース開発

従来のLLM活用では、各プロバイダーのAPIを直接呼び出していました：

```python
import openai

# OpenAI直接利用の例
openai.api_key = "your-api-key"

response = openai.ChatCompletion.create(
    model="gpt-4",
    messages=[
        {"role": "user", "content": "機械学習について説明して"}
    ]
)

print(response.choices[0].message.content)
```

この手法の問題点：

- **プロバイダー固有の実装**: 他のLLMに切り替える際に大幅なコード変更が必要
- **機能の重複実装**: プロンプト管理、エラーハンドリング、リトライ処理を都度実装
- **スケーラビリティの課題**: 複雑なワークフローの実装が困難

### LangChainによる開発

LangChainを使用することで、同じ処理がより簡潔かつ柔軟に実装できます：

```python
from langchain.chat_models import ChatOpenAI
from langchain.schema import HumanMessage

# LangChain利用の例
llm = ChatOpenAI(model="gpt-4")
messages = [HumanMessage(content="機械学習について説明して")]
response = llm.invoke(messages)

print(response.content)
```

LangChainのメリット：

- **統一インターフェース**: プロバイダー変更時も最小限の変更
- **豊富な機能**: メモリ、チェーン、エージェントなどを標準提供
- **拡張性**: カスタムコンポーネントの追加が容易

### LangChainの基本概念を動かして確認してみよう

実際にLangChainを使用して、基本的な機能を体験してみましょう。

:::step

1. LangChainのインストール

まず、必要なパッケージをインストールします。

_コマンド実行_

```bash
pip install langchain openai python-dotenv
```

2. 環境変数の設定

API キーを管理するための `.env` ファイルを作成します。

_.env_

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

3. 基本的なLLMの実行

LangChainを使用してLLMと対話する最も基本的な例を実装します。

_basic_llm.py_

```python
from langchain.llms import OpenAI
from dotenv import load_dotenv
import os

# 環境変数の読み込み
load_dotenv()

# LLMインスタンスの作成
llm = OpenAI(
    temperature=0.7,  # 出力の創造性を制御
    openai_api_key=os.getenv("OPENAI_API_KEY")
)

# 基本的な質問
question = "LangChainの主な特徴を3つ挙げてください"
response = llm.invoke(question)

print("質問:", question)
print("回答:", response)
```

4. プロンプトテンプレートの使用

動的にプロンプトを生成する機能を試してみます。

_prompt_template.py_

```python
from langchain.prompts import PromptTemplate
from langchain.llms import OpenAI
from langchain.chains import LLMChain
from dotenv import load_dotenv
import os

load_dotenv()

# プロンプトテンプレートの定義
template = """
あなたは{role}の専門家です。
以下の質問に、{role}の立場から詳しく回答してください：

質問: {question}

回答は以下の形式で提供してください：
1. 概要
2. 詳細説明
3. 実践的なアドバイス
"""

prompt = PromptTemplate(
    input_variables=["role", "question"],
    template=template
)

# LLMとプロンプトをチェーンで結合
llm = OpenAI(temperature=0.5)
chain = LLMChain(llm=llm, prompt=prompt)

# 実行
result = chain.run({
    "role": "データサイエンティスト",
    "question": "機械学習プロジェクトを成功させるためのポイントは？"
})

print(result)
```

5. メモリ機能付き会話

会話の文脈を記憶する機能を体験します。

_conversation_memory.py_

```python
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain
from langchain.llms import OpenAI
from dotenv import load_dotenv

load_dotenv()

# メモリと会話チェーンの設定
memory = ConversationBufferMemory()
llm = OpenAI(temperature=0.7)
conversation = ConversationChain(
    llm=llm,
    memory=memory,
    verbose=True  # 内部処理を表示
)

# 会話の実行
print("=== 会話セッション開始 ===")

responses = []

# 1回目の会話
response1 = conversation.predict(input="こんにちは。私の名前は山田太郎です。")
responses.append(("1回目", response1))

# 2回目の会話（名前を覚えているか確認）
response2 = conversation.predict(input="私の名前を覚えていますか？")
responses.append(("2回目", response2))

# 3回目の会話（関連する質問）
response3 = conversation.predict(input="私に適したプログラミング学習方法を教えてください")
responses.append(("3回目", response3))

# 結果の表示
for turn, response in responses:
    print(f"\n{turn}の応答:")
    print(response)
    print("-" * 50)
```

6. 実行とテスト

各プログラムを実行して、LangChainの動作を確認します。

_コマンド実行_

```bash
python basic_llm.py
```

_コマンド実行_

```bash
python prompt_template.py
```

_コマンド実行_

```bash
python conversation_memory.py
```

:::

これらの実行例を通じて、LangChainが提供する抽象化レイヤーの価値を実感できるでしょう。従来のAPI直接呼び出しと比較して、より構造化された開発アプローチが可能になります。

## LangChainエコシステムの全体像

LangChainは単なるライブラリではなく、包括的なエコシステムを形成しています。

### LangChain Core Libraries

- **langchain-core**: 基本的な抽象化とインターフェース
- **langchain-community**: コミュニティが貢献する統合ライブラリ
- **langchain**: メインパッケージ
- **langserve**: LangChainアプリケーションのサーバー化
- **langgraph**: 複雑なマルチエージェントシステムの構築

### 関連ツールとプラットフォーム

:::note LangChainエコシステムの主要コンポーネント

- **LangSmith**: LLMアプリケーションの監視・デバッグ・テストプラットフォーム
- **LangServe**: API サーバーとしてのデプロイメント支援
- **LangGraph**: 状態管理を伴う複雑なエージェントワークフロー構築
- **LangChain Hub**: プロンプトテンプレートとチェーンの共有プラットフォーム

:::

### 統合可能な外部サービス

LangChainは以下のような幅広いサービスと統合できます：

**LLMプロバイダー**:

- OpenAI (GPT-4, GPT-3.5)
- Anthropic (Claude)
- Google (PaLM, Gemini)
- Cohere
- Hugging Face
- Azure OpenAI

**ベクトルデータベース**:

- Pinecone
- Weaviate
- Chroma
- Qdrant
- FAISS

**外部ツール**:

- Google Search
- Wikipedia
- Wolfram Alpha
- Shell commands
- APIs

## 実際の活用事例

### 1. 知識ベース検索システム

企業の内部文書を活用した質問応答システム：

```python
from langchain.vectorstores import Chroma
from langchain.embeddings import OpenAIEmbeddings
from langchain.chains import RetrievalQA
from langchain.document_loaders import DirectoryLoader
from langchain.text_splitter import CharacterTextSplitter

# 文書の読み込みと分割
loader = DirectoryLoader('./docs/', glob='**/*.txt')
documents = loader.load()
text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
texts = text_splitter.split_documents(documents)

# ベクトルデータベースの構築
embeddings = OpenAIEmbeddings()
vectordb = Chroma.from_documents(texts, embeddings)

# 検索QAチェーンの構築
qa_chain = RetrievalQA.from_chain_type(
    llm=OpenAI(),
    chain_type="stuff",
    retriever=vectordb.as_retriever()
)

# 質問実行
query = "退職手続きについて教えてください"
result = qa_chain.run(query)
```

### 2. マルチステップタスク実行エージェント

複数のツールを組み合わせて複雑なタスクを実行：

```python
from langchain.agents import initialize_agent, Tool
from langchain.utilities import SerpAPIWrapper, PythonREPL

# ツールの定義
search = SerpAPIWrapper()
python_repl = PythonREPL()

tools = [
    Tool(
        name="Search",
        func=search.run,
        description="インターネット検索に使用"
    ),
    Tool(
        name="Python REPL",
        func=python_repl.run,
        description="Python コードの実行に使用"
    )
]

# エージェントの初期化
agent = initialize_agent(
    tools,
    OpenAI(temperature=0),
    agent_type="zero-shot-react-description",
    verbose=True
)

# 複雑なタスクの実行
task = """
最新のビットコイン価格を検索して、
過去1週間の価格変動をPythonで計算し、
グラフで可視化してください。
"""

result = agent.run(task)
```

## LangChainの将来性と学習価値

### 業界への影響

LangChainは、LLMアプリケーション開発の標準的なフレームワークとして急速に普及しています。以下の理由から、長期的な学習価値があります：

1. **標準化の推進**: LLM開発のベストプラクティスを標準化
2. **生産性向上**: 開発効率の大幅な改善
3. **企業導入の加速**: 多くの企業がLangChainベースのソリューションを採用
4. **コミュニティの活発化**: 継続的な機能拡張と改善

### キャリアへの影響

LangChainのスキルは以下の分野で価値があります：

- **AIアプリケーション開発者**: 最新のLLM技術を活用したサービス開発
- **データサイエンティスト**: 高度な分析と洞察の提供
- **プロダクトマネージャー**: AI機能の企画と実装戦略
- **研究者**: 新しいLLM活用手法の研究開発

## まとめ

このページでは、LangChainの基本概念からコアアーキテクチャ、実際の活用事例まで包括的に学習しました。

:::note 要点のまとめ

- LangChainは複数のLLMプロバイダーを統一インターフェースで扱える革新的フレームワーク
- Models、Prompts、Chains、Memory、Agentsの5つのコアコンポーネントで構成
- 従来のAPI直接呼び出しと比較して、より構造化された開発が可能
- 豊富なエコシステムにより、様々なユースケースに対応
- 企業での導入が進み、AI開発の標準となりつつある

:::

LangChainの基本概念を理解したことで、次はより具体的な開発環境の構築に進みましょう。実際にLangChainを使用したアプリケーション開発を通じて、その真の価値を体験していきます。

次のページでは、[LangChainの開発環境構築](./setup)について詳しく解説します。実際の開発に必要なツールのインストールから設定まで、ステップバイステップで進めていきます。

## 関連リンク

- [LangChain公式ドキュメント](https://docs.langchain.com/)
- [LangChain GitHub Repository](https://github.com/langchain-ai/langchain)
- [LangSmith Platform](https://smith.langchain.com/)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Anthropic Claude API](https://www.anthropic.com/api)

## さらに深く学習したい方へ

LangChainをより実践的に学習したい方は、弊社の「**LangChain実践開発講座**」をご検討ください。

本講座では、実際のプロジェクトを通じてLangChainの高度な機能を学習できます：

- **ハンズオン中心の実践学習**: 実際のコードを書きながら習得
- **企業レベルの開発事例**: 商用システムで使用される実装パターン
- **専門講師によるサポート**: 経験豊富なAI開発者が直接指導
- **修了証書の発行**: スキル証明として活用可能

講座の詳細やお申し込みは、[こちら](https://example.com/langchain-course)からご確認いただけます。

[/premium]