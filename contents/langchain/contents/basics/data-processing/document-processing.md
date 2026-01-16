---
slug: document-processing
parent: data-processing
title: 文書処理
status: draft
post_type: page
seo_title: LangChain文書処理 | ドキュメント読み込みと前処理
seo_keywords: LangChain,文書処理,ドキュメント,読み込み,前処理
seo_description: 様々な形式の文書読み込みと前処理。PDF・Word・Markdown・Webページの効率的な処理。
handson_overview: 各種文書形式の読み込みと前処理実装
---

## はじめに

現代の企業やアプリケーションは、PDF資料、Word文書、Webページ、Markdownファイルなど、多種多様な形式の文書を日常的に扱っています。これらの異なる形式の文書から効率的に情報を抽出し、AI活用可能な形に変換することは、LLMアプリケーションの成功の鍵となります。

LangChainの文書処理機能は、こうした多様な文書形式に対応する強力なドキュメントローダーと前処理機能を提供し、開発者が文書形式の違いを意識することなく、一貫したアプローチで情報抽出を実現できる環境を構築します。

### このページで学べる事

このページでは、実際の業務で頻繁に遭遇する文書処理のニーズに応えるため、LangChainの文書処理機能を包括的に学習します。

:::note

- LangChainの文書処理アーキテクチャと設計思想の理解
- PDF、Word、CSV、JSONなど主要な文書形式への対応方法
- Webページやマークダウンファイルの効率的な読み込み
- 文書メタデータの活用とカスタマイズ技法
- 大量文書の一括処理とバッチ処理の実装
- エラーハンドリングとパフォーマンス最適化

:::

## ドキュメントローダーの基本概念

LLMアプリケーションが実際のビジネス価値を提供するためには、企業内に蓄積された多様な文書資産を有効活用する必要があります。例えば、営業資料のPDF、技術仕様書のWord文書、製品情報のWebページ、APIドキュメントのMarkdownファイルなど、企業には様々な形式の重要な情報が散在しています。

LangChainの**ドキュメントローダー（Document Loaders）**は、これらの異なる文書形式を統一的に扱うための抽象化レイヤーを提供し、開発者がデータ形式の違いを意識することなく、文書処理ロジックに集中できる環境を実現します。

### Documentオブジェクトの設計思想

LangChainの文書処理は、すべてが**Document**オブジェクトを中心とした統一的なデータ構造に基づいています。この設計により、文書の読み込み、変換、保存といった一連の処理を、データソースに依存しない形で実装できます。

:::syntax Documentオブジェクトの構造

```python
class Document:
    page_content: str    # ドキュメントの本文コンテンツ
    metadata: dict      # 付加情報（ソース、作成日時など）
```

- **page_content**: 抽出されたテキストコンテンツ。HTMLタグやフォーマット情報は除去される
- **metadata**: ファイルパス、URL、ページ番号、作成日時、ファイルサイズなどの構造化情報

:::

この標準化されたDocument形式により、後続のテキスト分割、ベクトル化、検索といった処理を、元のデータソースの種類に関わらず一貫したAPIで実行できます。

### ドキュメントローダーのアーキテクチャ

ドキュメントローダーは、**Strategy パターン**を採用した設計となっており、各文書形式に特化した実装を持ちながら、共通のインターフェースを提供しています。

:::note ドキュメントローダーの特徴

- **統一インターフェース**: すべてのローダーが`load()`メソッドを実装
- **遅延読み込み**: `lazy_load()`による大容量ファイルへの対応
- **メタデータ管理**: ファイル情報の自動取得と保持
- **エラーハンドリング**: 不正なファイルや読み込みエラーの適切な処理

:::

### 主要なローダーカテゴリ

LangChainは、100以上のドキュメントローダーを提供しており、以下のカテゴリに分類できます。

**ファイル系ローダー**

- `TextFileLoader`: プレーンテキストファイル
- `PyPDFLoader`: PDFドキュメント
- `UnstructuredWordDocumentLoader`: Word文書
- `CSVLoader`: CSVファイル
- `JSONLoader`: JSON形式データ

**Web系ローダー**

- `WebBaseLoader`: 一般的なWebページ
- `YoutubeLoader`: YouTube動画の字幕
- `GitHubIssuesLoader`: GitHubイシューとPR

**API系ローダー**

- `GoogleDriveLoader`: Google Drive文書
- `SlackDirectoryLoader`: Slackメッセージ履歴
- `NotionDBLoader`: Notionデータベース

**データベース系ローダー**

- `SQLDatabaseLoader`: SQLクエリ結果
- `MongodbLoader`: MongoDBドキュメント
  //addend

//addstart

### 基本的なドキュメントローダーを動かして確認してみよう

実際の開発現場で最も頻繁に使用される、テキストファイル、PDF、Webページの3つのローダーを使って、基本的な文書読み込み処理を実装してみましょう。

:::step

1. プロジェクトの準備

任意の場所（デスクトップなど）に `langchain-document-processing` フォルダを作成し、VSCodeで開いてください。

2. 仮想環境の作成と必要ライブラリのインストール

ターミナルを開き、仮想環境を作成してから必要なライブラリをインストールします。

_コマンド実行_

```bash
python -m venv venv
```

_コマンド実行（Windows）_

```bash
venv\Scripts\activate
```

_コマンド実行（macOS/Linux）_

```bash
source venv/bin/activate
```

_コマンド実行_

```bash
pip install langchain langchain-community pypdf beautifulsoup4 requests python-dotenv
```

3. サンプルデータファイルの作成

まず、異なる形式のサンプルファイルを作成します。

_sample.txt_

```text
//addstart
# 企業向けAI活用ガイド

## はじめに
人工知能（AI）技術は、現代企業の競争力強化において重要な役割を果たしています。
本ガイドでは、実際のビジネス環境でAI技術を効果的に活用するための方法を解説します。

## AI活用の3つの柱
1. データ品質の向上
2. プロセス自動化の推進
3. 意思決定支援システムの構築

## 導入ステップ
段階的な導入により、リスクを最小化しながら効果を最大化できます。
//addend
```

続いて、CSVファイルとJSONファイルも作成します。

_sample.csv_

```csv
//addstart
product_id,product_name,category,price,stock
P001,ノートパソコン,電子機器,89800,45
P002,ワイヤレスマウス,アクセサリ,2980,120
P003,USB-Cハブ,アクセサリ,5500,78
P004,モニター,電子機器,32800,23
P005,キーボード,アクセサリ,8900,67
//addend
```

_sample.json_

```json
//addstart
{
  "company_info": {
    "name": "テクノロジー株式会社",
    "founded": 2020,
    "employees": 150,
    "locations": ["東京", "大阪", "福岡"]
  },
  "products": [
    {
      "name": "AI チャットボット",
      "category": "SaaS",
      "features": ["自然言語処理", "多言語対応", "API連携"]
    },
    {
      "name": "データ分析プラットフォーム",
      "category": "Analytics",
      "features": ["リアルタイム処理", "可視化", "機械学習"]
    }
  ]
}
//addend
```

4. 基本的なローダー実装

基本的な使い方を確認するため、`basic_loaders.py` を作成します。

_basic_loaders.py_

```python
//addstart
import os
from langchain_community.document_loaders import (
    TextFileLoader,
    CSVLoader,
    JSONLoader,
    WebBaseLoader
)

def load_text_file():
    """テキストファイルの読み込み"""
    print("=== テキストファイルの読み込み ===")
    try:
        loader = TextFileLoader("./sample.txt")
        documents = loader.load()

        for doc in documents:
            print(f"Content: {doc.page_content[:200]}...")
            print(f"Metadata: {doc.metadata}")
            print("-" * 50)

    except Exception as e:
        print(f"エラー: {e}")

def load_csv_file():
    """CSVファイルの読み込み"""
    print("=== CSVファイルの読み込み ===")
    try:
        loader = CSVLoader("./sample.csv")
        documents = loader.load()

        print(f"読み込んだ行数: {len(documents)}")
        for i, doc in enumerate(documents[:3]):  # 最初の3行を表示
            print(f"Row {i+1}: {doc.page_content}")
            print(f"Metadata: {doc.metadata}")
            print("-" * 50)

    except Exception as e:
        print(f"エラー: {e}")

def load_json_file():
    """JSONファイルの読み込み"""
    print("=== JSONファイルの読み込み ===")
    try:
        # JSONの特定の配列要素を読み込む
        loader = JSONLoader("./sample.json", jq_schema='.products[]')
        documents = loader.load()

        print(f"読み込んだプロダクト数: {len(documents)}")
        for doc in documents:
            print(f"Content: {doc.page_content}")
            print(f"Metadata: {doc.metadata}")
            print("-" * 50)

    except Exception as e:
        print(f"エラー: {e}")

def load_web_page():
    """Webページの読み込み"""
    print("=== Webページの読み込み ===")
    try:
        loader = WebBaseLoader("https://python.langchain.com/docs/get_started/introduction")
        documents = loader.load()

        print(f"読み込んだページ数: {len(documents)}")
        doc = documents[0]
        print(f"Content: {doc.page_content[:300]}...")
        print(f"Metadata: {doc.metadata}")
        print("-" * 50)

    except Exception as e:
        print(f"エラー: {e}")

if __name__ == "__main__":
    load_text_file()
    load_csv_file()
    load_json_file()
    load_web_page()
//addend
```

5. 実行と結果確認

基本的なローダーの動作を確認します。

_コマンド実行_

```bash
python basic_loaders.py
```

各ローダーが異なるメタデータ構造を持つことや、CSVでは行ごとに、JSONでは指定したスキーマに基づいてDocumentが生成されることを確認してください。

:::

この基本的なハンズオンにより、LangChainの各ローダーが一貫したDocumentオブジェクト形式で、異なる種類のデータソースを統一的に扱える仕組みを理解できました。

## PDF文書の高度な処理技術

企業環境では、契約書、技術仕様書、研究論文、営業資料など、重要な情報がPDF形式で管理されているケースが非常に多く見られます。PDFは視覚的なレイアウトを保持する一方で、テキスト抽出には特有の課題があります。

### PDF処理における課題

PDFファイルからの情報抽出では、以下のような技術的課題に対処する必要があります。

**レイアウトの複雑さ**

- 複数列のレイアウト
- 表組みや図表の混在
- ヘッダー・フッターの識別

**文字認識の問題**

- スキャンされたPDF（OCRが必要）
- 埋め込まれていないフォント
- 文字エンコーディングの問題

**構造化情報の保持**

- ページ番号や章節の関係性
- 図表のキャプション情報
- 脚注や参照の扱い

LangChainは、これらの課題に対応するため、複数のPDFローダーを提供しています。

:::note PDF処理ライブラリの比較

- **PyPDFLoader**: 軽量で高速、基本的なテキスト抽出に適している
- **UnstructuredPDFLoader**: レイアウト解析機能を持ち、構造化された抽出が可能
- **PDFMinerLoader**: 詳細な制御が可能、カスタム処理に適している
- **PDFPlumberLoader**: 表データの抽出に特化、データ分析用途に最適

:::

### PDF処理の実装パターン

異なるPDFローダーの特性を理解するため、実際のPDFファイルを使った比較検証を行います。

:::step

1. PDF処理用ライブラリの追加インストール

PDF処理に必要な追加ライブラリをインストールします。

_コマンド実行_

```bash
pip install unstructured pdfminer.six pdfplumber reportlab
```

2. テスト用PDF作成

複雑なレイアウトを持つテスト用PDFを作成します。

_create_complex_pdf.py_

```python
//addstart
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib import colors

def create_complex_pdf():
    """複雑なレイアウトのテスト用PDFを作成"""
    doc = SimpleDocTemplate("complex_sample.pdf", pagesize=A4)
    styles = getSampleStyleSheet()
    story = []

    # タイトル
    title = Paragraph("企業AI戦略レポート 2024", styles['Title'])
    story.append(title)
    story.append(Spacer(1, 20))

    # 概要セクション
    overview = Paragraph("""
    本レポートは、2024年における企業のAI活用動向を分析し、
    効果的な導入戦略について包括的に検討したものです。
    調査対象企業500社の実態調査に基づき、成功要因を抽出しています。
    """, styles['Normal'])
    story.append(overview)
    story.append(Spacer(1, 20))

    # 表データ
    table_data = [
        ['業界', 'AI導入率', '投資予算', '効果測定'],
        ['製造業', '78%', '¥50M', '生産性向上23%'],
        ['金融業', '85%', '¥120M', 'リスク削減31%'],
        ['小売業', '62%', '¥30M', '売上増加18%'],
        ['医療業', '71%', '¥80M', '診断精度向上27%']
    ]

    table = Table(table_data)
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))

    story.append(table)
    story.append(Spacer(1, 20))

    # まとめ
    conclusion = Paragraph("""
    調査結果から、成功する企業AI戦略の共通要素として、
    1) 段階的導入アプローチ、2) 従業員教育の重視、
    3) ROI測定体制の確立が重要であることが判明しました。
    """, styles['Normal'])
    story.append(conclusion)

    doc.build(story)
    print("complex_sample.pdf を作成しました")

if __name__ == "__main__":
    create_complex_pdf()
//addend
```

3. PDF作成の実行

_コマンド実行_

```bash
python create_complex_pdf.py
```

4. 複数のPDFローダー比較実装

異なるPDFローダーの特徴を比較するコードを実装します。

_pdf_loader_comparison.py_

```python
//addstart
from langchain_community.document_loaders import (
    PyPDFLoader,
    UnstructuredPDFLoader,
    PDFMinerLoader,
    PDFPlumberLoader
)
import time

def compare_pdf_loaders(pdf_path):
    """複数のPDFローダーの性能と結果を比較"""

    loaders = {
        'PyPDF': PyPDFLoader(pdf_path),
        'Unstructured': UnstructuredPDFLoader(pdf_path),
        'PDFMiner': PDFMinerLoader(pdf_path),
        'PDFPlumber': PDFPlumberLoader(pdf_path)
    }

    results = {}

    for name, loader in loaders.items():
        print(f"\n=== {name}ローダーのテスト ===")
        try:
            start_time = time.time()
            documents = loader.load()
            end_time = time.time()

            # パフォーマンス情報
            load_time = end_time - start_time
            doc_count = len(documents)
            total_chars = sum(len(doc.page_content) for doc in documents)

            print(f"処理時間: {load_time:.2f}秒")
            print(f"ドキュメント数: {doc_count}")
            print(f"総文字数: {total_chars}")

            # 最初のドキュメントの内容サンプル
            if documents:
                print(f"内容サンプル: {documents[0].page_content[:200]}...")
                print(f"メタデータ: {documents[0].metadata}")

            results[name] = {
                'load_time': load_time,
                'doc_count': doc_count,
                'total_chars': total_chars,
                'success': True
            }

        except Exception as e:
            print(f"エラー: {e}")
            results[name] = {'success': False, 'error': str(e)}

    return results

def analyze_results(results):
    """結果分析"""
    print("\n" + "="*60)
    print("パフォーマンス比較結果")
    print("="*60)

    for name, result in results.items():
        if result['success']:
            print(f"{name:12}: {result['load_time']:6.2f}秒, "
                  f"{result['doc_count']:2d}文書, "
                  f"{result['total_chars']:5d}文字")
        else:
            print(f"{name:12}: エラー - {result['error']}")

if __name__ == "__main__":
    pdf_path = "./complex_sample.pdf"
    results = compare_pdf_loaders(pdf_path)
    analyze_results(results)
//addend
```

5. 実行と比較分析

_コマンド実行_

```bash
python pdf_loader_comparison.py
```

各ローダーの処理時間、抽出精度、メタデータの違いを確認し、用途に応じた最適なローダーの選択基準を理解してください。

:::

この比較検証により、PDF処理では用途に応じてローダーを適切に選択することの重要性を実感できました。

## 大量文書の効率的な一括処理

実際の企業環境では、数百から数千の文書を一括で処理する必要があります。このような大規模文書処理では、メモリ使用量の管理、処理時間の最適化、エラーハンドリングが重要になります。

### バッチ処理のベストプラクティス

大量文書処理において考慮すべき要素：

**メモリ効率性**

- 遅延読み込み（lazy loading）の活用
- ストリーミング処理による省メモリ化
- バッチサイズの動的調整

**パフォーマンス最適化**

- 並列処理による高速化
- ファイル形式別の最適化
- キャッシング戦略の実装

**エラー耐性**

- 個別ファイルのエラーハンドリング
- リトライ機構の実装
- 進捗状況の保存と復旧

### 大量文書処理システムの実装

実際の企業環境を想定した大量文書処理システムを構築してみましょう。

:::step

1. サンプル文書群の作成

様々な形式の文書ファイルを大量に生成します。

_create_sample_documents.py_

```python
//addstart
import os
import json
import csv
from datetime import datetime, timedelta
import random

def create_sample_documents():
    """テスト用の文書ファイルを大量生成"""

    # ディレクトリ作成
    os.makedirs("sample_docs", exist_ok=True)
    os.makedirs("sample_docs/reports", exist_ok=True)
    os.makedirs("sample_docs/data", exist_ok=True)
    os.makedirs("sample_docs/configs", exist_ok=True)

    # テキストファイル群の作成
    departments = ["営業", "開発", "人事", "財務", "マーケティング"]
    for i in range(20):
        dept = random.choice(departments)
        content = f"""
{dept}部門　週次レポート #{i+1}

日付: {datetime.now() - timedelta(days=i)}

## 今週の活動概要
- 重要な取り組み項目: プロジェクトX進捗管理
- 成果指標: 目標達成率{random.randint(80, 120)}%
- 課題: リソース配分の最適化
- 来週の予定: 戦略会議および四半期レビュー

## 詳細データ
売上: ¥{random.randint(1000, 5000)}万円
コスト: ¥{random.randint(500, 2000)}万円
利益率: {random.randint(10, 30)}%
        """

        with open(f"sample_docs/reports/report_{dept}_{i:02d}.txt", "w", encoding="utf-8") as f:
            f.write(content)

    # CSVデータファイルの作成
    for i in range(10):
        data = []
        for j in range(random.randint(50, 200)):
            data.append({
                "id": f"ID{j:04d}",
                "name": f"商品{j}",
                "category": random.choice(["電子機器", "書籍", "衣料品", "食品"]),
                "price": random.randint(500, 50000),
                "stock": random.randint(0, 100)
            })

        with open(f"sample_docs/data/products_{i:02d}.csv", "w", encoding="utf-8", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=["id", "name", "category", "price", "stock"])
            writer.writeheader()
            writer.writerows(data)

    # JSON設定ファイルの作成
    for i in range(15):
        config = {
            "service_name": f"service_{i}",
            "version": f"1.{i}.0",
            "settings": {
                "max_connections": random.randint(100, 1000),
                "timeout": random.randint(30, 300),
                "retry_count": random.randint(1, 5)
            },
            "features": random.sample(["auth", "cache", "logging", "metrics", "backup"], 3),
            "created_at": str(datetime.now() - timedelta(days=random.randint(1, 365)))
        }

        with open(f"sample_docs/configs/config_{i:02d}.json", "w", encoding="utf-8") as f:
            json.dump(config, f, ensure_ascii=False, indent=2)

    print("サンプル文書の作成完了:")
    print(f"- テキストファイル: 20個")
    print(f"- CSVファイル: 10個")
    print(f"- JSONファイル: 15個")
    print(f"- 合計: 45個のファイル")

if __name__ == "__main__":
    create_sample_documents()
//addend
```

2. サンプル文書の生成

_コマンド実行_

```bash
python create_sample_documents.py
```

3. 大量文書処理システムの実装

効率的な一括処理システムを実装します。

_batch_document_processor.py_

```python
//addstart
import os
import time
import json
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import List, Dict, Any
from dataclasses import dataclass
from langchain_community.document_loaders import (
    TextFileLoader,
    CSVLoader,
    JSONLoader
)

@dataclass
class ProcessResult:
    """処理結果を格納するデータクラス"""
    file_path: str
    success: bool
    doc_count: int = 0
    char_count: int = 0
    processing_time: float = 0.0
    error_message: str = ""

class BatchDocumentProcessor:
    """大量文書の一括処理システム"""

    def __init__(self, max_workers: int = 4):
        self.max_workers = max_workers
        self.supported_extensions = {'.txt', '.csv', '.json'}

    def get_loader_for_file(self, file_path: str):
        """ファイル形式に応じて適切なローダーを返す"""
        extension = Path(file_path).suffix.lower()

        if extension == '.txt':
            return TextFileLoader(file_path)
        elif extension == '.csv':
            return CSVLoader(file_path)
        elif extension == '.json':
            # JSONファイルは全体を読み込む
            return JSONLoader(file_path, jq_schema='.')
        else:
            raise ValueError(f"Unsupported file type: {extension}")

    def process_single_file(self, file_path: str) -> ProcessResult:
        """単一ファイルの処理"""
        start_time = time.time()
        result = ProcessResult(file_path=file_path, success=False)

        try:
            loader = self.get_loader_for_file(file_path)
            documents = loader.load()

            result.success = True
            result.doc_count = len(documents)
            result.char_count = sum(len(doc.page_content) for doc in documents)
            result.processing_time = time.time() - start_time

        except Exception as e:
            result.error_message = str(e)
            result.processing_time = time.time() - start_time

        return result

    def find_supported_files(self, directory: str) -> List[str]:
        """指定ディレクトリから対応ファイルを検索"""
        files = []
        for root, _, filenames in os.walk(directory):
            for filename in filenames:
                if Path(filename).suffix.lower() in self.supported_extensions:
                    files.append(os.path.join(root, filename))
        return files

    def process_directory(self, directory: str) -> Dict[str, Any]:
        """ディレクトリ内のすべての対応ファイルを一括処理"""
        files = self.find_supported_files(directory)
        print(f"処理対象ファイル数: {len(files)}")

        start_time = time.time()
        results = []
        successful_files = 0
        total_documents = 0
        total_characters = 0

        # 並列処理で効率化
        with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            # 全ファイルの処理を並列で開始
            future_to_file = {
                executor.submit(self.process_single_file, file_path): file_path
                for file_path in files
            }

            # 完了順に结果を収集
            for future in as_completed(future_to_file):
                result = future.result()
                results.append(result)

                if result.success:
                    successful_files += 1
                    total_documents += result.doc_count
                    total_characters += result.char_count
                    print(f"✓ {os.path.basename(result.file_path)} "
                          f"({result.doc_count}文書, {result.processing_time:.2f}s)")
                else:
                    print(f"✗ {os.path.basename(result.file_path)} "
                          f"- エラー: {result.error_message}")

        total_time = time.time() - start_time

        return {
            'results': results,
            'summary': {
                'total_files': len(files),
                'successful_files': successful_files,
                'failed_files': len(files) - successful_files,
                'total_documents': total_documents,
                'total_characters': total_characters,
                'total_processing_time': total_time,
                'average_time_per_file': total_time / len(files) if files else 0
            }
        }

    def save_processing_report(self, results: Dict[str, Any], output_path: str):
        """処理結果のレポートを保存"""
        report_data = {
            'timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
            'summary': results['summary'],
            'file_details': []
        }

        for result in results['results']:
            report_data['file_details'].append({
                'file_path': result.file_path,
                'success': result.success,
                'doc_count': result.doc_count,
                'char_count': result.char_count,
                'processing_time': result.processing_time,
                'error_message': result.error_message
            })

        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(report_data, f, ensure_ascii=False, indent=2)

        print(f"\n処理レポートを保存: {output_path}")

def main():
    """メイン処理"""
    processor = BatchDocumentProcessor(max_workers=4)

    print("=== 大量文書一括処理システム ===")
    results = processor.process_directory("./sample_docs")

    # 結果のサマリー表示
    summary = results['summary']
    print("\n" + "="*50)
    print("処理結果サマリー")
    print("="*50)
    print(f"処理ファイル数: {summary['successful_files']}/{summary['total_files']}")
    print(f"取得文書数: {summary['total_documents']}")
    print(f"総文字数: {summary['total_characters']:,}")
    print(f"総処理時間: {summary['total_processing_time']:.2f}秒")
    print(f"平均処理時間: {summary['average_time_per_file']:.2f}秒/ファイル")

    # レポート保存
    processor.save_processing_report(results, "batch_processing_report.json")

if __name__ == "__main__":
    main()
//addend
```

4. バッチ処理の実行

_コマンド実行_

```bash
python batch_document_processor.py
```

処理の並列化により大幅な処理時間短縮が実現されることと、エラーハンドリングにより一部ファイルでエラーが発生しても処理全体が停止しないことを確認してください。

:::

この大規模処理システムにより、実際の企業環境で必要となる大量文書の効率的な処理パターンを理解し、実装できました。

## 文書メタデータの活用とカスタマイズ

文書処理における**メタデータ**は、単なる付加情報ではなく、文書検索、フィルタリング、分類において重要な役割を果たします。LangChainは、標準的なメタデータの自動取得に加え、カスタムメタデータの追加やメタデータベースの高度な処理を可能にします。

### メタデータの戦略的活用

企業の文書管理システムでは、以下のようなメタデータが重要になります。

**基本メタデータ**

- ファイルパス、作成日時、ファイルサイズ
- 文書形式、文字エンコーディング
- ページ数、章節構造

**ビジネスメタデータ**

- 部門、プロジェクト、機密レベル
- 承認状況、バージョン情報
- タグ、カテゴリ、重要度

**処理メタデータ**

- 抽出日時、処理バージョン
- 信頼度スコア、品質指標
- 関連文書、参照情報

### カスタムメタデータの実装

実際のプロジェクトで使える高度なメタデータ処理機能を実装してみましょう。

:::step

1. メタデータ拡張システムの実装

カスタムメタデータ処理機能を実装します。

_metadata_processor.py_

```python
//addstart
import os
import hashlib
import mimetypes
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Optional
from langchain_community.document_loaders import TextFileLoader, CSVLoader, JSONLoader
from langchain.schema import Document

class EnhancedDocumentLoader:
    """メタデータ拡張機能付きドキュメントローダー"""

    def __init__(self,
                 include_content_analysis: bool = True,
                 include_file_analysis: bool = True,
                 custom_extractors: Optional[Dict[str, callable]] = None):
        self.include_content_analysis = include_content_analysis
        self.include_file_analysis = include_file_analysis
        self.custom_extractors = custom_extractors or {}

    def calculate_file_hash(self, file_path: str) -> str:
        """ファイルのハッシュ値を計算"""
        with open(file_path, 'rb') as f:
            return hashlib.sha256(f.read()).hexdigest()

    def analyze_content(self, content: str) -> Dict[str, Any]:
        """コンテンツの分析情報を取得"""
        lines = content.split('\n')
        words = content.split()

        return {
            'char_count': len(content),
            'word_count': len(words),
            'line_count': len(lines),
            'avg_line_length': sum(len(line) for line in lines) / len(lines) if lines else 0,
            'non_empty_lines': len([line for line in lines if line.strip()]),
            'has_email': '@' in content,
            'has_url': 'http' in content.lower(),
            'has_numbers': any(char.isdigit() for char in content)
        }

    def extract_file_metadata(self, file_path: str) -> Dict[str, Any]:
        """ファイルシステムメタデータの抽出"""
        path = Path(file_path)
        stat = path.stat()

        metadata = {
            'file_name': path.name,
            'file_extension': path.suffix,
            'file_size': stat.st_size,
            'created_time': datetime.fromtimestamp(stat.st_ctime),
            'modified_time': datetime.fromtimestamp(stat.st_mtime),
            'mime_type': mimetypes.guess_type(file_path)[0],
            'file_hash': self.calculate_file_hash(file_path),
            'directory': str(path.parent),
            'absolute_path': str(path.absolute())
        }

        return metadata

    def apply_custom_extractors(self, file_path: str, content: str) -> Dict[str, Any]:
        """カスタムメタデータエクストラクターの適用"""
        custom_metadata = {}

        for name, extractor in self.custom_extractors.items():
            try:
                result = extractor(file_path, content)
                custom_metadata[name] = result
            except Exception as e:
                custom_metadata[f"{name}_error"] = str(e)

        return custom_metadata

    def load_with_enhanced_metadata(self, file_path: str) -> List[Document]:
        """拡張メタデータ付きでドキュメントを読み込み"""
        # 基本のローダーで読み込み
        extension = Path(file_path).suffix.lower()

        if extension == '.txt':
            loader = TextFileLoader(file_path)
        elif extension == '.csv':
            loader = CSVLoader(file_path)
        elif extension == '.json':
            loader = JSONLoader(file_path, jq_schema='.')
        else:
            raise ValueError(f"Unsupported file type: {extension}")

        documents = loader.load()

        # メタデータの拡張
        for doc in documents:
            enhanced_metadata = doc.metadata.copy()

            if self.include_file_analysis:
                file_metadata = self.extract_file_metadata(file_path)
                enhanced_metadata.update(file_metadata)

            if self.include_content_analysis:
                content_analysis = self.analyze_content(doc.page_content)
                enhanced_metadata.update(content_analysis)

            # カスタムエクストラクターの適用
            custom_metadata = self.apply_custom_extractors(file_path, doc.page_content)
            enhanced_metadata.update(custom_metadata)

            # メタデータの更新
            doc.metadata = enhanced_metadata

        return documents

# カスタムエクストラクターの例
def extract_department_info(file_path: str, content: str) -> Dict[str, Any]:
    """部門情報の抽出"""
    departments = ["営業", "開発", "人事", "財務", "マーケティング"]

    detected_departments = []
    for dept in departments:
        if dept in content:
            detected_departments.append(dept)

    return {
        'departments': detected_departments,
        'primary_department': detected_departments[0] if detected_departments else 'unknown'
    }

def extract_priority_level(file_path: str, content: str) -> str:
    """優先度レベルの抽出"""
    priority_keywords = {
        'urgent': ['緊急', '至急', 'urgent', '重要'],
        'high': ['高優先', 'high', '優先'],
        'medium': ['中優先', 'medium', '通常'],
        'low': ['低優先', 'low', '参考']
    }

    content_lower = content.lower()

    for level, keywords in priority_keywords.items():
        if any(keyword in content_lower for keyword in keywords):
            return level

    return 'medium'  # デフォルト

def demonstrate_enhanced_loading():
    """拡張メタデータローダーのデモンストレーション"""

    # カスタムエクストラクターの定義
    custom_extractors = {
        'department_info': extract_department_info,
        'priority_level': extract_priority_level,
    }

    # 拡張ローダーの作成
    enhanced_loader = EnhancedDocumentLoader(
        include_content_analysis=True,
        include_file_analysis=True,
        custom_extractors=custom_extractors
    )

    # sample_docsディレクトリのファイルを処理
    sample_files = []
    if os.path.exists("./sample_docs"):
        for root, _, files in os.walk("./sample_docs"):
            for file in files[:5]:  # 最初の5ファイルのみ
                if file.endswith(('.txt', '.csv', '.json')):
                    sample_files.append(os.path.join(root, file))

    for file_path in sample_files:
        print(f"\n=== {os.path.basename(file_path)} の拡張メタデータ ===")
        try:
            documents = enhanced_loader.load_with_enhanced_metadata(file_path)

            for i, doc in enumerate(documents[:1]):  # 最初のドキュメントのみ表示
                print(f"Content preview: {doc.page_content[:100]}...")
                print(f"Enhanced metadata:")

                # メタデータを整理して表示
                for key, value in sorted(doc.metadata.items()):
                    if isinstance(value, (str, int, float)):
                        print(f"  {key}: {value}")
                    elif isinstance(value, list):
                        print(f"  {key}: {', '.join(map(str, value))}")
                    else:
                        print(f"  {key}: {type(value).__name__}")

        except Exception as e:
            print(f"Error processing {file_path}: {e}")

if __name__ == "__main__":
    demonstrate_enhanced_loading()
//addend
```

2. 拡張メタデータローダーの実行

_コマンド実行_

```bash
python metadata_processor.py
```

カスタムエクストラクターにより、標準メタデータに加えて業務固有の情報が抽出されることを確認してください。

:::

この高度なメタデータ処理により、企業の文書管理システムで求められる、文書の自動分類、検索、品質管理を実現できました。

## まとめ

このページでは、LangChainの文書処理機能を包括的に学習しました。基本的なドキュメントローダーから始まり、PDF処理の高度なテクニック、大量文書の効率的な一括処理、そしてメタデータの戦略的活用まで、実際の企業環境で必要とされる文書処理スキルを身につけることができました。

:::note 要点のまとめ

- **統一インターフェース**: LangChainのドキュメントローダーは、多様な文書形式を統一的なDocumentオブジェクトとして処理
- **柔軟性**: PDF、CSV、JSON、Webページなど、100以上のローダーによる幅広いデータソース対応
- **スケーラビリティ**: 並列処理とバッチ処理により、大量文書の効率的な処理が可能
- **拡張性**: カスタムメタデータエクストラクターによる業務要件への柔軟な適応
- **信頼性**: エラーハンドリングと進捗管理による堅牢な処理システム

:::

文書を読み込むことで、次はこれらの情報をLLMが効率的に処理できる形に変換する必要があります。大きな文書をどのように分割し、検索しやすい形にするかが次の重要なステップです。次のページでは、文書の「テキスト分割」技術について詳しく解説します。

[テキスト分割](./text-splitters)

## 関連リンク

- [LangChain Official Documentation - Document loaders](https://python.langchain.com/docs/modules/data_connection/document_loaders/)
- [LangChain Community Document Loaders](https://python.langchain.com/docs/integrations/document_loaders/)

## さらに深く学習したい方へ

このページで学習した文書処理技術をさらに深く理解し、実際のプロジェクトで活用したい方には、以下の学習リソースをおすすめします。

**実践的なスキル習得**

- 大規模企業での文書管理システム構築プロジェクト
- AI活用による業務効率化の実装ワークショップ
- LangChainを使ったRAG（検索拡張生成）システムの開発

**専門知識の深化**

- 自然言語処理とテキストマイニングの理論と実践
- エンタープライズグレードのドキュメント処理パイプライン設計
- セキュリティを考慮した機密文書の取り扱い

これらのトピックについてより体系的に学習したい方は、当社の研修プログラムをご利用ください。実際の企業事例を基にしたハンズオン学習により、即戦力となるスキルを効率的に習得できます。
