---
title: データ処理
slug: data-processing
parent: basics
status: not_started
filepath: contents/basics/data-processing/data-processing.md
post_type: pages
goal: LangChainにおけるデータ処理の全体像を理解し、Document Loaders、Text Splitters等を適切に選択・活用できるようになる。
seo_title: LangChainデータ処理完全ガイド | Document Loaders・Text Splitters・Vector Stores
seo_description: LangChainでのデータ処理フローを詳しく解説。Document Loaders、Text Splitters、Embeddings、Vector Storesの選択と活用法。
seo_keywords: LangChain データ処理, Document Loaders, Text Splitters, Vector Stores
handson_overview: 不要
---

## はじめに

このページでは、LangChainにおけるデータ処理と前処理の重要性について学びます。大規模言語モデル（LLM）を活用したアプリケーション開発では、入力データの品質が最終的な出力の質を大きく左右します。非構造化データを整理し、モデルが理解しやすい形式に変換する一連のプロセスは、効果的なアプリケーションを構築するための不可欠なステップです。

現代のAIアプリケーション開発において、データ処理は単なる前段階ではなく、システム全体の成否を決定する戦略的な要素となっています。特にRAG（Retrieval Augmented Generation）システムや、大規模なドキュメントベースでの質問応答システムでは、適切なデータ処理なしに高品質な結果を得ることはできません。

### このページで学べる事

このページを通じて、LangChainを使った効率的なデータ処理パイプラインの構築方法と、そのパフォーマンスを最適化するための具体的なテクニックを習得します。実際の開発現場で直面する問題を想定した実践的な手法を学び、プロダクション環境で運用可能なシステムの構築スキルを身につけます。

:::note

- データ処理と前処理の基本的な概念と実践的な応用
- LangChainにおけるデータ処理パイプラインの設計と実装
- 様々なデータソースからの効率的なデータ読み込みと変換
- パフォーマンス最適化のベストプラクティス
- エラーハンドリングと品質管理の実装方法
- スケーラブルな処理システムの設計原則

:::

## データ処理と前処理の重要性

LLMは非常に強力ですが、その能力を最大限に引き出すためには、適切に準備されたデータを与える必要があります。「ガベージイン、ガベージアウト（Garbage In, Garbage Out）」の原則は、LLMアプリケーションにおいても同様に当てはまります。データ処理と前処理は、この「ガベージ」を価値ある情報へと変換する重要なプロセスです。

実際の開発プロジェクトにおいて、データ処理の品質は最終的なアプリケーションの性能に直接的な影響を与えます。例えば、不適切にチャンク化されたドキュメントは文脈の断絶を引き起こし、関連性の低い回答を生成する原因となります。一方、適切に処理されたデータは、モデルの推論能力を最大化し、ユーザーにとって価値のある出力を提供します。

:::note データ処理と前処理とは

- **データ処理**: 生のデータ（テキスト、画像、音声など）を収集し、クレンジング、変換、整理して、後続の処理で利用しやすい形式に整えるプロセス全体を指します。これには、データの品質チェック、重複除去、フォーマット統一なども含まれます。
- **前処理**: データ処理の一部であり、特に機械学習モデルやLLMがデータを解釈・学習しやすいように、特定の形式に変換する工程を指します。例えば、テキストの正規化、不要な文字の削除、トークン化、エンベディング生成などが含まれます。

:::

LangChainでは、これらのプロセスを効率化するための様々なコンポーネントが提供されています。これらを組み合わせることで、多様なデータソースに対応した柔軟なデータ処理パイプラインを構築できます。また、各コンポーネントは設定可能なパラメータを持ち、特定のユースケースに応じた細かな調整が可能です。

### データ処理の課題とメリット・デメリット

データ処理を適切に行うことで得られるメリットは大きいですが、同時に考慮すべき課題も存在します。

**メリット**：

- **回答品質の向上**: 適切に処理されたデータにより、より正確で関連性の高い回答が得られます
- **処理効率の最適化**: データサイズの最適化により、計算コストと処理時間を削減できます
- **一貫性の確保**: 統一された形式により、システム全体の一貫した動作が保証されます

**デメリット・課題**：

- **処理時間のオーバーヘッド**: 大量のデータを処理する場合、前処理自体が時間のボトルネックになる可能性があります
- **設定の複雑さ**: 最適な処理設定を見つけるには、試行錯誤と経験が必要です
- **メモリ使用量の増加**: 処理中に一時的に大量のメモリを消費する場合があります

### データ処理パイプラインの設計原則

効果的なデータ処理パイプラインを構築するためには、以下の原則を理解することが重要です。

**モジュラリティ**: 各処理段階を独立したコンポーネントとして設計することで、保守性と拡張性を確保します。LangChainの設計思想もこの原則に基づいており、各コンポーネントは個別に設定・置換が可能です。

**スケーラビリティ**: 小規模なデータセットで動作するパイプラインが、大規模なデータでも効率的に動作するよう設計します。これには、バッチ処理、並列処理、メモリ効率的なアルゴリズムの採用が含まれます。

**監視可能性**: パイプラインの各段階での処理状況や品質指標を追跡できるよう、適切なログ出力と監視機能を組み込みます。

:::syntax データ処理パイプラインの構成要素

- **Document Loaders**: ファイル、Webページ、データベースなど、様々なソースからドキュメントを読み込みます。50以上の異なるローダーが利用可能です。
- **Text Splitters**: 大きなドキュメントを、モデルが処理しやすい小さなチャンク（塊）に分割します。意味的境界を保持する高度な分割アルゴリズムが利用できます。
- **Embedding Models**: テキストチャンクを、意味的な類似性を捉えたベクトル表現（エンベディング）に変換します。OpenAI、Hugging Face、Cohereなど多様なプロバイダーに対応しています。
- **Vector Stores**: 生成されたベクトルを保存し、高速な類似度検索を可能にします。Pinecone、Chroma、FAISSなど、用途に応じた選択肢があります。
- **Document Transformers**: 読み込んだドキュメントを変換・加工します。フィルタリング、マークダウン変換、HTMLクリーニングなどの機能があります。

:::

これらのコンポーネントを組み合わせることで、例えば「PDFファイルを読み込み、内容をチャンクに分割し、ベクトル化してデータベースに保存する」といった一連の処理を自動化できます。また、各段階でのエラーハンドリングや品質チェックも組み込むことで、本格的なプロダクション環境での運用が可能になります。

### データ処理パイプラインを動かして確認してみよう

ここでは、実践的なデータ処理パイプラインを構築し、その動作を確認してみましょう。単純なテキスト処理から始めて、より複雑なドキュメント処理、そして品質チェック機能まで段階的に構築していきます。

:::step

1. **プロジェクトの準備**

任意の場所（デスクトップなど）に `langchain-data-processing` フォルダを作成し、VSCodeで開いてください。

_コマンド実行_

```bash
mkdir langchain-data-processing
cd langchain-data-processing
```

2. **仮想環境の作成とアクティベート**

Python仮想環境を作成して、プロジェクト固有の依存関係を管理します。

_コマンド実行_

```bash
python -m venv venv
source venv/bin/activate  # Windowsの場合: venv\Scripts\activate
```

3. **必要なライブラリのインストール**

LangChainと関連ライブラリ、および追加の便利なツールをインストールします。

_requirements.txt_

```text
langchain==0.1.0
langchain-community==0.0.10
langchain-openai==0.0.5
python-dotenv==1.0.0
chardet==5.2.0
pandas==2.1.4
```

_コマンド実行_

```bash
pip install -r requirements.txt
```

4. **サンプルデータファイルの作成**

実際の文書処理を想定した、より複雑なサンプルファイルを作成します。

_sample_document.txt_

```text
# LangChainデータ処理ガイド

## 概要
LangChainは、大規模言語モデル（LLM）を活用したアプリケーション開発を容易にするためのフレームワークです。

## データ処理の重要性
データ処理と前処理は、その中でも特に重要な要素の一つです。
- 品質の高い入力データは、優れた出力結果を生み出します
- 適切な前処理により、モデルの性能を最大化できます
- エラーハンドリングにより、安定したシステム運用が可能になります

## 実装のベストプラクティス
このプロセスを理解することが、高品質なアプリケーション開発への第一歩となります。

### パフォーマンス最適化
- チャンクサイズの最適化
- 並列処理の活用
- メモリ効率的なアルゴリズムの選択

### エラーハンドリング
エラーが発生した場合の対処方法も重要です。
ログ出力、再試行メカニズム、フォールバック処理を組み込みましょう。
```

5. **基本的なデータ処理パイプラインの実装**

まず、基本的なパイプラインを実装します。

_basic_pipeline.py_

```python
from langchain_community.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
import logging
from typing import List

# ログ設定
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class BasicDataProcessor:
    """基本的なデータ処理パイプラインクラス"""

    def __init__(self, chunk_size: int = 500, chunk_overlap: int = 50):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        //addstart
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            separators=["\n\n", "\n", "。", "．", " ", ""]
        )
        //addend

    def load_document(self, file_path: str):
        """ドキュメントを読み込む"""
        try:
            loader = TextLoader(file_path, encoding='utf-8')
            documents = loader.load()
            logger.info(f"ドキュメント読み込み完了: {file_path}")
            return documents
        except Exception as e:
            logger.error(f"ドキュメント読み込みエラー: {e}")
            return []

    def split_documents(self, documents):
        """ドキュメントをチャンクに分割する"""
        try:
            split_docs = self.text_splitter.split_documents(documents)
            logger.info(f"ドキュメント分割完了: {len(split_docs)}チャンク生成")
            return split_docs
        except Exception as e:
            logger.error(f"ドキュメント分割エラー: {e}")
            return []

    def analyze_chunks(self, chunks):
        """チャンクの品質を分析する"""
        if not chunks:
            return {}

        lengths = [len(chunk.page_content) for chunk in chunks]
        analysis = {
            "total_chunks": len(chunks),
            "avg_length": sum(lengths) / len(lengths),
            "min_length": min(lengths),
            "max_length": max(lengths),
            "total_characters": sum(lengths)
        }

        logger.info(f"チャンク分析結果: {analysis}")
        return analysis

def main():
    # データ処理パイプラインの実行
    processor = BasicDataProcessor(chunk_size=300, chunk_overlap=50)

    # 1. ドキュメント読み込み
    documents = processor.load_document("./sample_document.txt")

    if documents:
        print("=== 元のドキュメント情報 ===")
        print(f"ドキュメント数: {len(documents)}")
        print(f"文字数: {len(documents[0].page_content)}")
        print(f"最初の200文字: {documents[0].page_content[:200]}...")

        # 2. ドキュメント分割
        chunks = processor.split_documents(documents)

        if chunks:
            print("\n=== 分割後のチャンク情報 ===")
            analysis = processor.analyze_chunks(chunks)

            for key, value in analysis.items():
                print(f"{key}: {value}")

            print("\n=== サンプルチャンク（最初の3つ） ===")
            for i, chunk in enumerate(chunks[:3]):
                print(f"\n--- チャンク {i+1} ---")
                print(f"文字数: {len(chunk.page_content)}")
                print(f"内容: {chunk.page_content}")
                print("-" * 50)

if __name__ == "__main__":
    main()
```

6. **基本パイプラインの実行**

作成したパイプラインを実行して、動作を確認します。

_コマンド実行_

```bash
python basic_pipeline.py
```

実行結果から、ドキュメントがどのようにチャンクに分割され、各チャンクの品質指標がどのように表示されるかを確認してください。

7. **高度なデータ処理パイプラインの実装**

次に、より実践的な機能を追加した高度なパイプラインを実装します。

_advanced_pipeline.py_

```python
from langchain_community.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document
import logging
import re
import json
from datetime import datetime
from typing import List, Dict, Any

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class AdvancedDataProcessor:
    """高度なデータ処理パイプライン"""

    def __init__(self, chunk_size: int = 500, chunk_overlap: int = 50):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        //addstart
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            separators=["\n\n", "\n", "。", "．", "！", "？", " ", ""]
        )
        //addend
        self.processing_stats = {
            "processed_documents": 0,
            "total_chunks": 0,
            "errors": 0,
            "processing_time": 0
        }

    def preprocess_text(self, text: str) -> str:
        """テキストの前処理を行う"""
        # 不要な空白の除去
        text = re.sub(r'\s+', ' ', text)

        # 特殊文字の正規化
        text = re.sub(r'[""'']', '"', text)

        # 複数の改行を統一
        text = re.sub(r'\n\s*\n', '\n\n', text)

        return text.strip()

    def load_and_process_document(self, file_path: str) -> List[Document]:
        """ドキュメントを読み込み、前処理を行う"""
        start_time = datetime.now()

        try:
            loader = TextLoader(file_path, encoding='utf-8')
            documents = loader.load()

            # 前処理の適用
            for doc in documents:
                //addstart
                doc.page_content = self.preprocess_text(doc.page_content)
                doc.metadata["file_path"] = file_path
                doc.metadata["processed_at"] = datetime.now().isoformat()
                doc.metadata["original_length"] = len(doc.page_content)
                //addend

            self.processing_stats["processed_documents"] += len(documents)
            logger.info(f"ドキュメント処理完了: {file_path}")

            return documents

        except Exception as e:
            self.processing_stats["errors"] += 1
            logger.error(f"ドキュメント処理エラー: {e}")
            return []

        finally:
            processing_time = (datetime.now() - start_time).total_seconds()
            self.processing_stats["processing_time"] += processing_time

    def split_with_metadata(self, documents: List[Document]) -> List[Document]:
        """メタデータ付きでドキュメントを分割"""
        all_chunks = []

        for doc in documents:
            try:
                chunks = self.text_splitter.split_documents([doc])

                # 各チャンクにメタデータを追加
                for i, chunk in enumerate(chunks):
                    //addstart
                    chunk.metadata.update({
                        "chunk_index": i,
                        "chunk_length": len(chunk.page_content),
                        "source_document": doc.metadata.get("source", "unknown")
                    })
                    //addend

                all_chunks.extend(chunks)

            except Exception as e:
                logger.error(f"チャンク分割エラー: {e}")
                continue

        self.processing_stats["total_chunks"] += len(all_chunks)
        return all_chunks

    def validate_chunks(self, chunks: List[Document]) -> Dict[str, Any]:
        """チャンクの品質検証"""
        if not chunks:
            return {"valid": False, "issues": ["No chunks to validate"]}

        issues = []
        valid_chunks = 0

        for i, chunk in enumerate(chunks):
            chunk_issues = []

            # 長さのチェック
            if len(chunk.page_content) < 10:
                chunk_issues.append(f"チャンク {i}: 文字数が少なすぎます ({len(chunk.page_content)}文字)")

            # 空白のみでないかチェック
            if chunk.page_content.strip() == "":
                chunk_issues.append(f"チャンク {i}: 空のチャンクです")

            # 特定の文字の重複チェック
            if len(set(chunk.page_content)) < len(chunk.page_content) * 0.3:
                chunk_issues.append(f"チャンク {i}: 文字の多様性が低いです")

            if not chunk_issues:
                valid_chunks += 1
            else:
                issues.extend(chunk_issues)

        return {
            "valid": len(issues) == 0,
            "valid_chunks": valid_chunks,
            "total_chunks": len(chunks),
            "issues": issues[:5]  # 最初の5つのみ表示
        }

    def generate_report(self, chunks: List[Document], validation_result: Dict[str, Any]) -> Dict[str, Any]:
        """処理結果のレポート生成"""
        if not chunks:
            return {"error": "No chunks to analyze"}

        lengths = [len(chunk.page_content) for chunk in chunks]

        report = {
            "processing_stats": self.processing_stats,
            "chunk_analysis": {
                "total_chunks": len(chunks),
                "avg_length": round(sum(lengths) / len(lengths), 2),
                "min_length": min(lengths),
                "max_length": max(lengths),
                "total_characters": sum(lengths)
            },
            "validation": validation_result,
            "generated_at": datetime.now().isoformat()
        }

        return report

def main():
    print("=== 高度なデータ処理パイプライン ===\n")

    # プロセッサの初期化
    processor = AdvancedDataProcessor(chunk_size=400, chunk_overlap=50)

    # 1. ドキュメント読み込みと前処理
    print("1. ドキュメント読み込み中...")
    documents = processor.load_and_process_document("./sample_document.txt")

    if not documents:
        print("ドキュメントの読み込みに失敗しました。")
        return

    print(f"✓ {len(documents)}個のドキュメントを読み込みました")

    # 2. ドキュメント分割
    print("\n2. ドキュメント分割中...")
    chunks = processor.split_with_metadata(documents)
    print(f"✓ {len(chunks)}個のチャンクに分割しました")

    # 3. 品質検証
    print("\n3. チャンク品質検証中...")
    validation = processor.validate_chunks(chunks)
    print(f"✓ 検証完了: {validation['valid_chunks']}/{validation['total_chunks']} チャンクが有効")

    if validation["issues"]:
        print("⚠️  検出された問題:")
        for issue in validation["issues"]:
            print(f"   - {issue}")

    # 4. レポート生成
    print("\n4. 処理レポート生成中...")
    report = processor.generate_report(chunks, validation)

    # レポートの保存
    //addstart
    with open("processing_report.json", "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    //addend

    print("✓ レポートを processing_report.json に保存しました")

    # 5. 結果の表示
    print("\n=== 処理結果サマリー ===")
    print(f"処理時間: {report['processing_stats']['processing_time']:.2f}秒")
    print(f"チャンク数: {report['chunk_analysis']['total_chunks']}")
    print(f"平均チャンク長: {report['chunk_analysis']['avg_length']}文字")
    print(f"有効チャンク率: {(validation['valid_chunks']/validation['total_chunks']*100):.1f}%")

    # サンプルチャンクの表示
    print("\n=== サンプルチャンク ===")
    for i, chunk in enumerate(chunks[:2]):
        print(f"\n--- チャンク {i+1} ---")
        print(f"長さ: {chunk.metadata['chunk_length']}文字")
        print(f"内容: {chunk.page_content[:100]}...")
        print(f"メタデータ: {chunk.metadata}")

if __name__ == "__main__":
    main()
```

8. **高度なパイプラインの実行**

実装した高度なパイプラインを実行します。

_コマンド実行_

```bash
python advanced_pipeline.py
```

9. **生成されたレポートの確認**

処理結果として生成されたJSONレポートを確認します。

_コマンド実行_

```bash
cat processing_report.json
```

このレポートには処理統計、チャンク分析結果、品質検証結果が含まれており、データ処理パイプラインの性能を定量的に評価できます。

:::

この高度なパイプラインでは、エラーハンドリング、メタデータ管理、品質検証、レポート生成など、プロダクション環境で必要となる要素を実装しました。これらの機能により、データ処理の品質と信頼性を大幅に向上させることができます。

## パフォーマンス最適化のベストプラクティス

実用的なデータ処理システムを構築するためには、パフォーマンスの最適化が不可欠です。ここでは、LangChainでのデータ処理において重要な最適化手法について詳しく説明します。

### メモリ効率の最適化

大量のドキュメントを処理する際、メモリ使用量の管理は重要な課題となります。

**ストリーミング処理の活用**：
一度に全てのドキュメントをメモリに読み込むのではなく、必要に応じてストリーミング処理を行います。これにより、メモリ使用量を大幅に削減できます。

```python
from langchain_community.document_loaders import DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

# バッチサイズを指定してメモリ効率を向上
def process_documents_in_batches(directory_path: str, batch_size: int = 10):
    loader = DirectoryLoader(directory_path)
    documents = loader.load()

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )

    # バッチごとに処理
    for i in range(0, len(documents), batch_size):
        batch = documents[i:i+batch_size]
        chunks = text_splitter.split_documents(batch)

        # 処理結果を保存またはさらなる処理
        yield chunks
```

### 並列処理による高速化

CPUバウンドなタスクでは、並列処理により処理速度を大幅に向上させることができます。

:::note 並列処理の注意点とは

並列処理を実装する際は、以下の点に注意する必要があります：

- **スレッドプールサイズ**: CPUコア数に基づいて適切に設定
- **共有リソース**: ファイル書き込みやAPI呼び出しのロック管理
- **エラーハンドリング**: 複数のプロセス間でのエラー情報の集約

:::

**実装例**：

```python
from concurrent.futures import ProcessPoolExecutor, as_completed
from multiprocessing import cpu_count
import time

def process_single_document(file_path: str):
    """単一ドキュメントの処理"""
    loader = TextLoader(file_path)
    documents = loader.load()

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )

    chunks = text_splitter.split_documents(documents)
    return len(chunks), file_path

def parallel_processing_demo(file_paths: list):
    """並列処理のデモンストレーション"""
    start_time = time.time()

    # CPUコア数に基づいてワーカー数を決定
    max_workers = min(len(file_paths), cpu_count())

    with ProcessPoolExecutor(max_workers=max_workers) as executor:
        # タスクをサブミット
        future_to_file = {
            executor.submit(process_single_document, file_path): file_path
            for file_path in file_paths
        }

        results = []
        for future in as_completed(future_to_file):
            try:
                chunk_count, file_path = future.result()
                results.append((file_path, chunk_count))
            except Exception as e:
                logger.error(f"処理エラー: {e}")

    processing_time = time.time() - start_time
    logger.info(f"並列処理完了: {processing_time:.2f}秒")

    return results
```

### チャンクサイズの最適化

チャンクサイズは、処理効率と品質のバランスに大きな影響を与えます。

**動的チャンクサイズ調整**：

````python
class AdaptiveChunkProcessor:
    """コンテンツに応じてチャンクサイズを調整するプロセッサ"""

    def __init__(self):
        self.size_mapping = {
            "code": {"chunk_size": 800, "chunk_overlap": 100},
            "prose": {"chunk_size": 500, "chunk_overlap": 50},
            "table": {"chunk_size": 300, "chunk_overlap": 30}
        }

    def detect_content_type(self, text: str) -> str:
        """コンテンツタイプを検出"""
        if "```" in text or "def " in text or "class " in text:
            return "code"
        elif "|" in text and "-" in text:
            return "table"
        else:
            return "prose"

    def process_with_adaptive_chunks(self, documents):
        """適応的チャンクサイズでの処理"""
        results = []

        for doc in documents:
            content_type = self.detect_content_type(doc.page_content)
            settings = self.size_mapping[content_type]

            splitter = RecursiveCharacterTextSplitter(**settings)
            chunks = splitter.split_documents([doc])

            # コンテンツタイプをメタデータに追加
            for chunk in chunks:
                //addstart
                chunk.metadata["content_type"] = content_type
                chunk.metadata["chunk_settings"] = settings
                //addend

            results.extend(chunks)

        return results
````

### キャッシュ機能の実装

同じドキュメントを繰り返し処理する場合、キャッシュ機能により大幅な時間短縮が可能です。

:::syntax キャッシュ実装のポイント

- **ハッシュベース**: ファイル内容のハッシュ値でキャッシュキーを生成
- **TTL（Time To Live）**: キャッシュの有効期限を設定
- **圧縮**: 大きなチャンクデータの圧縮保存
- **永続化**: ディスクベースのキャッシュでプロセス間での共有

:::

```python
import hashlib
import pickle
import os
from datetime import datetime, timedelta

class DocumentCache:
    """ドキュメント処理結果のキャッシュ管理"""

    def __init__(self, cache_dir: str = ".cache", ttl_hours: int = 24):
        self.cache_dir = cache_dir
        self.ttl = timedelta(hours=ttl_hours)
        os.makedirs(cache_dir, exist_ok=True)

    def _get_cache_key(self, file_path: str, processing_params: dict) -> str:
        """キャッシュキーの生成"""
        with open(file_path, 'rb') as f:
            content_hash = hashlib.md5(f.read()).hexdigest()

        params_str = str(sorted(processing_params.items()))
        combined = f"{content_hash}_{params_str}"

        return hashlib.md5(combined.encode()).hexdigest()

    def get(self, file_path: str, processing_params: dict):
        """キャッシュからの取得"""
        cache_key = self._get_cache_key(file_path, processing_params)
        cache_path = os.path.join(self.cache_dir, f"{cache_key}.pkl")

        if not os.path.exists(cache_path):
            return None

        # TTLチェック
        cache_time = datetime.fromtimestamp(os.path.getmtime(cache_path))
        if datetime.now() - cache_time > self.ttl:
            os.remove(cache_path)
            return None

        try:
            with open(cache_path, 'rb') as f:
                return pickle.load(f)
        except Exception as e:
            logger.error(f"キャッシュ読み込みエラー: {e}")
            return None

    def set(self, file_path: str, processing_params: dict, data):
        """キャッシュへの保存"""
        cache_key = self._get_cache_key(file_path, processing_params)
        cache_path = os.path.join(self.cache_dir, f"{cache_key}.pkl")

        try:
            with open(cache_path, 'wb') as f:
                pickle.dump(data, f)
        except Exception as e:
            logger.error(f"キャッシュ保存エラー: {e}")

class CachedDataProcessor(BasicDataProcessor):
    """キャッシュ機能付きデータプロセッサ"""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.cache = DocumentCache()

    def process_with_cache(self, file_path: str):
        """キャッシュを活用した処理"""
        processing_params = {
            "chunk_size": self.chunk_size,
            "chunk_overlap": self.chunk_overlap
        }

        # キャッシュから取得を試行
        cached_result = self.cache.get(file_path, processing_params)
        if cached_result:
            logger.info(f"キャッシュヒット: {file_path}")
            return cached_result

        # キャッシュミスの場合、実際の処理を実行
        logger.info(f"キャッシュミス、処理実行: {file_path}")
        documents = self.load_document(file_path)
        chunks = self.split_documents(documents)

        # 結果をキャッシュに保存
        self.cache.set(file_path, processing_params, chunks)

        return chunks
```

### パフォーマンス最適化を確認してみよう

実装した最適化手法の効果を測定し、比較してみましょう。

:::step

1. **パフォーマンステスト用のファイル作成**

複数のテストファイルを作成します。

_create_test_files.py_

```python
import os

def create_test_files():
    """テスト用の複数ファイルを作成"""
    test_dir = "test_documents"
    os.makedirs(test_dir, exist_ok=True)

    base_content = """
    これはパフォーマンステスト用のドキュメントです。
    LangChainを使用したデータ処理の最適化について学習しています。
    """ * 100  # 内容を100回繰り返し

    for i in range(5):
        with open(f"{test_dir}/test_document_{i}.txt", "w", encoding="utf-8") as f:
            f.write(f"ドキュメント {i}\n{base_content}")

    print(f"テストファイルを {test_dir} フォルダに作成しました")

if __name__ == "__main__":
    create_test_files()
```

2. **パフォーマンス比較スクリプト**

最適化前後の処理時間を比較します。

_performance_comparison.py_

```python
import time
import glob
from concurrent.futures import ProcessPoolExecutor
import os

def sequential_processing(file_paths):
    """逐次処理"""
    start_time = time.time()

    processor = BasicDataProcessor()
    total_chunks = 0

    for file_path in file_paths:
        documents = processor.load_document(file_path)
        chunks = processor.split_documents(documents)
        total_chunks += len(chunks)

    end_time = time.time()

    return {
        "method": "Sequential",
        "total_chunks": total_chunks,
        "processing_time": end_time - start_time,
        "chunks_per_second": total_chunks / (end_time - start_time)
    }

def parallel_processing(file_paths):
    """並列処理"""
    start_time = time.time()

    with ProcessPoolExecutor(max_workers=4) as executor:
        futures = [executor.submit(process_single_file, fp) for fp in file_paths]
        results = [future.result() for future in futures]

    total_chunks = sum(results)
    end_time = time.time()

    return {
        "method": "Parallel",
        "total_chunks": total_chunks,
        "processing_time": end_time - start_time,
        "chunks_per_second": total_chunks / (end_time - start_time)
    }

def cached_processing(file_paths):
    """キャッシュ利用処理"""
    start_time = time.time()

    processor = CachedDataProcessor()
    total_chunks = 0

    # 2回実行してキャッシュ効果を確認
    for _ in range(2):
        for file_path in file_paths:
            chunks = processor.process_with_cache(file_path)
            total_chunks += len(chunks)

    end_time = time.time()

    return {
        "method": "Cached (2 runs)",
        "total_chunks": total_chunks,
        "processing_time": end_time - start_time,
        "chunks_per_second": total_chunks / (end_time - start_time)
    }

def process_single_file(file_path):
    """単一ファイル処理（並列処理用）"""
    processor = BasicDataProcessor()
    documents = processor.load_document(file_path)
    chunks = processor.split_documents(documents)
    return len(chunks)

def main():
    # テストファイルの準備
    if not os.path.exists("test_documents"):
        exec(open("create_test_files.py").read())

    file_paths = glob.glob("test_documents/*.txt")
    print(f"テストファイル数: {len(file_paths)}\n")

    # 各手法でのパフォーマンス測定
    methods = [sequential_processing, parallel_processing, cached_processing]
    results = []

    for method in methods:
        print(f"{method.__name__} を実行中...")
        result = method(file_paths)
        results.append(result)

        print(f"方法: {result['method']}")
        print(f"処理時間: {result['processing_time']:.2f}秒")
        print(f"チャンク数: {result['total_chunks']}")
        print(f"処理速度: {result['chunks_per_second']:.2f} chunks/sec\n")

    # 結果の比較
    print("=== パフォーマンス比較結果 ===")
    baseline = results[0]['processing_time']

    for result in results:
        improvement = ((baseline - result['processing_time']) / baseline) * 100
        print(f"{result['method']}: {improvement:+.1f}% (基準: Sequential)")

if __name__ == "__main__":
    main()
```

3. **パフォーマンステストの実行**

_コマンド実行_

```bash
python create_test_files.py
python performance_comparison.py
```

このテストにより、各最適化手法の効果を定量的に確認できます。

:::

これらの最適化手法を適切に組み合わせることで、大規模なデータ処理タスクでも高いパフォーマンスを実現できます。ただし、最適化は常にプロファイリングと測定に基づいて行い、実際のユースケースに応じて調整することが重要です。

## まとめ

このページでは、LangChainにおけるデータ処理と前処理の包括的な理解と実践的なスキルを習得しました。基本的な概念から始まり、実際のパイプライン構築、そして本格的なプロダクション環境での運用を想定した高度な最適化手法まで、幅広い内容をカバーしました。

データ処理は、LLMアプリケーションの成功を左右する重要な要素です。適切に設計された処理パイプラインは、単にデータを変換するだけでなく、システム全体の品質、性能、保守性を向上させます。また、エラーハンドリング、監視、最適化といった実践的な側面も、本格的なシステム開発では不可欠な要素となります。

:::note 要点のまとめ

- **データ品質の重要性**: LLMアプリケーションの出力品質は、入力データの品質に直接依存します
- **モジュラー設計**: LangChainのコンポーネントベースアーキテクチャにより、柔軟で保守性の高いパイプラインが構築できます
- **段階的な実装**: 基本的な機能から始めて、段階的に高度な機能を追加することで、複雑さを管理できます
- **品質管理**: 自動化された検証とレポート機能により、継続的な品質改善が可能になります
- **パフォーマンス最適化**: 並列処理、キャッシュ、適応的処理により、大規模データでも効率的な処理が実現できます
- **実践的な運用**: エラーハンドリング、ログ出力、監視機能により、プロダクション環境での安定した運用が可能になります

:::

今回学習した内容は、LangChainでのより高度なアプリケーション開発の基盤となります。次のページでは、これらの前処理されたデータを活用した実際のLLMアプリケーションの構築について詳しく学んでいきます。

データ処理パイプラインの構築は一度習得すれば様々なプロジェクトで応用できる汎用的なスキルです。継続的な学習と実践を通じて、より効果的で効率的なデータ処理システムの構築を目指しましょう。

[ドキュメントローダー（Document Loaders）](./document-loaders)

## 関連リンク

- [LangChain Official Documentation - Document loaders](https://python.langchain.com/docs/modules/data_connection/document_loaders/)
- [LangChain Official Documentation - Text splitters](https://python.langchain.com/docs/modules/data_connection/document_transformers/)
- [LangChain Official Documentation - Document transformers](https://python.langchain.com/docs/modules/data_connection/document_transformers/)
- [Python Multiprocessing Documentation](https://docs.python.org/3/library/multiprocessing.html)
- [Concurrent Futures Documentation](https://docs.python.org/3/library/concurrent.futures.html)
- [LangChain Community - GitHub Repository](https://github.com/langchain-ai/langchain)
- [Best Practices for LLM Data Processing](https://python.langchain.com/docs/guides/debugging)

## さらに深く学習したい方へ

より体系的に、実践的にLangChainを学びたい方には、以下の研修プラットフォームのコースがおすすめです。ハンズオン形式で、実務に直結するスキルを習得できます。

**LangChain実践マスターコース**では、本ページで学習した内容をベースに、より高度なデータ処理パイプラインの構築方法を学習できます。プロダクション環境での運用を想定した実践的なプロジェクトを通じて、企業レベルのLLMアプリケーション開発スキルを身につけることができます。

- **実践的なプロジェクトベース学習**: 実際の企業案件を模したプロジェクトで学習
- **メンター制度**: 業界経験豊富なエンジニアによる個別指導
- **継続的なサポート**: 学習期間中および修了後のキャリアサポート
- **最新技術の追従**: 常に最新のLangChainアップデートに対応したカリキュラム
