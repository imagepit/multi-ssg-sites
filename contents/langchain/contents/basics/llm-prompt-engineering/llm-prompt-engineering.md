---
title: LLMプロンプトエンジニアリング
slug: llm-prompt-engineering
parent: basics
status: not_started
filepath: contents/basics/llm-prompt-engineering/llm-prompt-engineering.md
post_type: pages
goal: LLMプロンプトエンジニアリングの技術を習得し、効果的なプロンプト設計とLLMの性能最大化を実現できるようになる。
seo_title: LangChainプロンプトエンジニアリング完全ガイド | 効果的なプロンプト設計
seo_description: LangChainを使ったプロンプトエンジニアリングを詳しく解説。効果的なプロンプト設計からLLM性能の最大化まで実践的に学習。
seo_keywords: LangChain プロンプトエンジニアリング, プロンプト設計, LLM最適化
handson_overview: 不要
---

## はじめに

Large Language Model（LLM）の能力を最大限に活用するためには、効果的なプロンプトの設計が不可欠です。プロンプトエンジニアリングは、LLMから望む出力を得るために、入力されるプロンプトを戦略的に設計・最適化する技術です。

LangChainでは、プロンプトテンプレートやチェーン機能を活用することで、より構造化されたプロンプトエンジニアリングが可能になります。この章では、LLMの基本的な仕組みから実践的なプロンプト設計手法まで、段階的に学習していきます。

### このページで学べる事

プロンプトエンジニアリングの基礎から応用まで、実際に手を動かしながら学習できます。

:::note

- LLMの基本概念と動作原理
- 効果的なプロンプト設計の原則
- LangChainでのプロンプトテンプレートの活用方法
- Few-shot学習とChain-of-Thoughtプロンプティング
- プロンプトの評価と最適化手法

:::

## LLMの基本概念とプロンプトの重要性

Large Language Model（LLM）は、大量のテキストデータで訓練された深層学習モデルで、人間のような文章生成や理解を行うことができます。GPT-4、Claude、Llama 2などが代表的なLLMです。

LLMは与えられたプロンプト（入力テキスト）に基づいて、次に来る可能性が高いテキストを予測して生成します。そのため、プロンプトの質が出力の質に直接影響を与えます。

:::note LLMとは

Large Language Model（大規模言語モデル）は、数十億から数兆のパラメータを持つ深層学習モデルで、Transformerアーキテクチャを基盤としています。事前学習では大量のテキストデータから言語の統計的パターンを学習し、ファインチューニングでは特定タスクに特化した性能を獲得します。

:::

### プロンプトエンジニアリングの価値

プロンプトエンジニアリングには以下のようなメリットがあります：

**メリット：**

- **精度向上**: 曖昧な指示から明確で具体的な指示に変更することで、期待する出力を得やすくなる
- **一貫性確保**: プロンプトテンプレートを使用することで、同じタスクに対して一貫した品質の出力を維持できる
- **コスト削減**: 効率的なプロンプトによりトークン数を削減し、API利用料金を抑えられる
- **時間短縮**: 適切なプロンプト設計により、試行錯誤の回数を減らせる

**デメリット：**

- **学習コスト**: プロンプト設計のベストプラクティスを習得するのに時間がかかる
- **モデル依存**: 異なるLLMでは最適なプロンプトが異なる場合がある
- **維持管理**: プロンプトテンプレートの更新や管理が必要

## プロンプト設計の基本原則

効果的なプロンプトを設計するためには、以下の基本原則を理解する必要があります。

### 1. 明確性と具体性

プロンプトは具体的で明確である必要があります。曖昧な指示ではLLMが意図した通りの出力を生成できません。

```
❌ 悪い例: "文章を書いて"
✅ 良い例: "Python初心者向けの500語のブログ記事を書いて。基本的な変数の使い方について説明し、コード例を3つ含めてください。"
```

### 2. 構造化された指示

複雑なタスクは小さなステップに分解し、構造化して指示します。

```
❌ 悪い例: "データを分析してレポートを作成"
✅ 良い例: "
以下の手順でデータ分析レポートを作成してください：
1. データセットの概要を説明
2. 主要な統計情報を計算
3. 興味深いパターンや傾向を特定
4. ビジネスへの影響を考察
5. 推奨事項を3つ提案
"
```

### 3. コンテキストと例の提供

関連する背景情報や具体例を提供することで、LLMの理解を向上させます。

:::syntax プロンプト設計の基本構造

```
[役割・設定] + [コンテキスト] + [具体的なタスク] + [出力形式] + [制約条件]
```

:::

### プロンプト設計を動かして確認してみよう

基本的なプロンプト設計の原則を実際にLangChainで実装して確認してみましょう。

:::step

1. 開発環境の準備

任意の場所（デスクトップなど）で`langchain-prompt-engineering`フォルダを作成し、以下の手順で環境をセットアップしてください。

```bash
mkdir langchain-prompt-engineering
cd langchain-prompt-engineering
python -m venv venv
source venv/bin/activate  # Windowsの場合: venv\Scripts\activate
```

2. 必要なパッケージのインストール

LangChainとOpenAIのパッケージをインストールします。

```bash
pip install langchain openai python-dotenv
```

3. 環境設定ファイルの作成

`.env`ファイルを作成してOpenAI APIキーを設定します。

_.env_

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

4. 基本的なプロンプト実装

`basic_prompt.py`を作成して基本的なプロンプトを実装します。

_basic_prompt.py_

```python
//addstart
import os
from dotenv import load_dotenv
from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate

# 環境変数の読み込み
load_dotenv()

# LLMの初期化
llm = OpenAI(temperature=0.7)

# 悪い例：曖昧なプロンプト
bad_prompt = "文章を書いて"
bad_result = llm(bad_prompt)
print("悪い例の結果:")
print(bad_result)
print("\n" + "="*50 + "\n")

# 良い例：具体的なプロンプト
good_prompt = """
あなたはプログラミング教育の専門家です。
Python初心者向けの500語程度のブログ記事を作成してください。

テーマ: Pythonでの変数の基本的な使い方
要件:
- 変数とは何かを簡単に説明
- 変数の作成方法を説明
- 実用的なコード例を3つ含める
- 初心者にも理解しやすい言葉遣い

構成:
1. はじめに（変数の重要性）
2. 変数の基本概念
3. コード例と解説
4. まとめ
"""

good_result = llm(good_prompt)
print("良い例の結果:")
print(good_result)
//addend
```

5. プロンプトテンプレートの活用

`prompt_template.py`を作成してプロンプトテンプレートを実装します。

_prompt_template.py_

```python
//addstart
from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate

# LLMの初期化
llm = OpenAI(temperature=0.7)

# プロンプトテンプレートの作成
template = """
あなたは{expertise}の専門家です。
{topic}について{word_count}語程度の{content_type}を作成してください。

対象読者: {target_audience}

要件:
- {requirement1}
- {requirement2}
- {requirement3}

構成:
1. {structure1}
2. {structure2}
3. {structure3}
"""

prompt = PromptTemplate(
    input_variables=[
        "expertise", "topic", "word_count", "content_type",
        "target_audience", "requirement1", "requirement2",
        "requirement3", "structure1", "structure2", "structure3"
    ],
    template=template
)

# テンプレートを使用してプロンプトを生成
formatted_prompt = prompt.format(
    expertise="Web開発",
    topic="ReactのuseStateフック",
    word_count="400",
    content_type="技術解説記事",
    target_audience="React初心者",
    requirement1="useState の基本的な使い方を説明",
    requirement2="実際のコード例を2つ以上含める",
    requirement3="よくある間違いと対処法を紹介",
    structure1="useStateとは",
    structure2="基本的な使用方法",
    structure3="実践的な例と注意点"
)

print("生成されたプロンプト:")
print(formatted_prompt)
print("\n" + "="*50 + "\n")

# LLMに送信
result = llm(formatted_prompt)
print("LLMの回答:")
print(result)
//addend
```

6. 実行とテスト

作成したファイルを実行して結果を確認します。

```bash
python basic_prompt.py
```

```bash
python prompt_template.py
```

:::

このハンズオンにより、明確で具体的なプロンプトがどれだけ出力の質を向上させるかを体感できます。また、プロンプトテンプレートを使用することで、再利用可能で一貫性のあるプロンプトを作成できることを確認できました。

## Few-shot学習とChain-of-Thoughtプロンプティング

プロンプトエンジニアリングの高度な技法として、Few-shot学習とChain-of-Thought（CoT）プロンプティングがあります。これらの手法は、LLMの推論能力を大幅に向上させることができます。

### Few-shot学習とは

Few-shot学習は、少数の例を提示することでLLMにタスクのパターンを理解させる手法です。例を示すことで、期待する出力形式や品質を明確に伝えることができます。

:::note Few-shot学習とは

Few-shot学習は、機械学習において少数のサンプルから学習を行う手法です。LLMの文脈では、プロンプト内に数個の入力-出力の例を含めることで、モデルに期待する動作を示すことを指します。Zero-shot（例なし）、One-shot（1例）、Few-shot（複数例）の段階があります。

:::

**Few-shot学習の利点：**

- **精度向上**: 具体例により期待する出力形式を明確化
- **一貫性**: 複数の例により出力の品質を均一化
- **学習効率**: 少数の例で効果的な学習が可能

**欠点：**

- **プロンプト長**: 例が増えるとトークン数が増加
- **例の選択**: 適切な例の選択が結果に大きく影響

### Chain-of-Thoughtプロンプティング

Chain-of-Thought（CoT）プロンプティングは、LLMに段階的な推論プロセスを明示させる手法です。「ステップバイステップで考えてください」などの指示を追加することで、より論理的で正確な回答を得られます。

:::syntax Chain-of-Thoughtの基本パターン

```
質問 + "ステップバイステップで考えてください" + [推論の例]
```

:::

### 高度なプロンプティング手法を動かして確認してみよう

Few-shot学習とChain-of-Thoughtプロンプティングを実装して、その効果を確認してみましょう。

:::step

1. Few-shot学習の実装

`few_shot_learning.py`を作成してFew-shot学習を実装します。

_few_shot_learning.py_

```python
//addstart
from langchain.llms import OpenAI
from langchain.prompts import FewShotPromptTemplate, PromptTemplate

llm = OpenAI(temperature=0)

# Few-shot の例を定義
examples = [
    {
        "input": "顧客から商品の返品について問い合わせがありました",
        "output": "分類: 返品・交換\n優先度: 中\n対応部署: カスタマーサービス\n推定解決時間: 1-2営業日"
    },
    {
        "input": "システムにログインできないという技術的な問題の報告です",
        "output": "分類: 技術サポート\n優先度: 高\n対応部署: IT部門\n推定解決時間: 4-8時間"
    },
    {
        "input": "新商品の在庫状況について質問されました",
        "output": "分類: 商品情報\n優先度: 低\n対応部署: 営業部\n推定解決時間: 1時間以内"
    }
]

# 例のテンプレート
example_template = """
問い合わせ内容: {input}
分析結果: {output}
"""

example_prompt = PromptTemplate(
    input_variables=["input", "output"],
    template=example_template
)

# Few-shotプロンプトテンプレート
few_shot_prompt = FewShotPromptTemplate(
    examples=examples,
    example_prompt=example_prompt,
    prefix="以下は顧客問い合わせの分析例です：",
    suffix="問い合わせ内容: {input}\n分析結果:",
    input_variables=["input"]
)

# テスト用の新しい問い合わせ
test_input = "注文した商品が破損して届きました。交換を希望します"

# Few-shotプロンプトを生成
formatted_prompt = few_shot_prompt.format(input=test_input)
print("Few-shot プロンプト:")
print(formatted_prompt)
print("\n" + "="*50 + "\n")

# LLMに送信
result = llm(formatted_prompt)
print("分析結果:")
print(result)
//addend
```

2. Chain-of-Thoughtプロンプティングの実装

`chain_of_thought.py`を作成してChain-of-Thoughtプロンプティングを実装します。

_chain_of_thought.py_

```python
//addstart
from langchain.llms import OpenAI

llm = OpenAI(temperature=0)

# 通常のプロンプト（比較用）
normal_prompt = """
問題: レストランで4人のお客様が食事をしました。
- Aさんは1,500円のパスタを注文
- Bさんは2,200円のステーキを注文
- Cさんは1,800円の魚料理を注文
- Dさんは1,200円のサラダを注文
消費税は10%です。割り勘にする場合、一人当たりいくら支払う必要がありますか？
"""

print("通常のプロンプトの結果:")
normal_result = llm(normal_prompt)
print(normal_result)
print("\n" + "="*50 + "\n")

# Chain-of-Thoughtプロンプト
cot_prompt = """
問題: レストランで4人のお客様が食事をしました。
- Aさんは1,500円のパスタを注文
- Bさんは2,200円のステーキを注文
- Cさんは1,800円の魚料理を注文
- Dさんは1,200円のサラダを注文
消費税は10%です。割り勘にする場合、一人当たりいくら支払う必要がありますか？

ステップバイステップで計算してください：

例:
1. 各注文の金額を合計する
2. 消費税を計算する
3. 税込み総額を求める
4. 4人で割り算する
5. 最終的な一人当たりの金額を答える

解答:
"""

print("Chain-of-Thought プロンプトの結果:")
cot_result = llm(cot_prompt)
print(cot_result)
//addend
```

3. 複合的なプロンプティング手法の実装

`advanced_prompting.py`を作成してFew-shotとCoTを組み合わせます。

_advanced_prompting.py_

```python
//addstart
from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate

llm = OpenAI(temperature=0)

# Few-shot + Chain-of-Thoughtの複合プロンプト
complex_prompt = """
あなたは論理的思考に優れた数学教師です。以下の例を参考に、新しい問題を段階的に解いてください。

例1:
問題: 太郎くんは毎日3km走ります。1週間で何km走るでしょうか？
解答手順:
1. 1日に走る距離を確認: 3km
2. 1週間の日数を確認: 7日
3. 計算: 3km × 7日 = 21km
答え: 21km

例2:
問題: 本を120ページ読むのに3日かかりました。1日平均何ページ読んだでしょうか？
解答手順:
1. 読んだ総ページ数を確認: 120ページ
2. かかった日数を確認: 3日
3. 計算: 120ページ ÷ 3日 = 40ページ
答え: 40ページ

新しい問題:
花子さんは1箱12個入りのクッキーを5箱買いました。友達8人と自分で等しく分けたいと思います。一人当たり何個のクッキーがもらえるでしょうか？余りがある場合も教えてください。

上記の例に従って、ステップバイステップで解答してください：
"""

print("複合プロンプトの結果:")
result = llm(complex_prompt)
print(result)
//addend
```

4. 実行とテスト

作成したファイルを順番に実行して効果を比較します。

```bash
python few_shot_learning.py
```

```bash
python chain_of_thought.py
```

```bash
python advanced_prompting.py
```

:::

このハンズオンを通じて、Few-shot学習がタスクのパターン学習に有効であること、Chain-of-Thoughtプロンプティングが複雑な推論タスクの精度を向上させることを確認できます。また、これらの手法を組み合わせることで、より高度なタスクに対応できることも体験できました。

## プロンプトの評価と最適化

効果的なプロンプトエンジニアリングには、プロンプトの性能を客観的に評価し、継続的に改善する仕組みが必要です。ここでは、プロンプトの評価方法と最適化手法について学習します。

### プロンプト評価の指標

プロンプトの品質は以下の観点から評価できます：

**1. 精度（Accuracy）**

- 期待される出力との一致度
- 正解率や適合率での測定

**2. 一貫性（Consistency）**

- 同じ入力に対する出力の安定性
- 複数回実行した際の結果のばらつき

**3. 効率性（Efficiency）**

- トークン使用量
- 実行時間とコスト

**4. 有用性（Usefulness）**

- 実際の業務での活用度
- ユーザー満足度

### プロンプト最適化の戦略

効果的なプロンプト最適化には段階的なアプローチが重要です：

:::syntax プロンプト最適化のサイクル

```
1. ベースラインの確立 → 2. A/Bテスト → 3. メトリクス測定 → 4. 改善点の特定 → 5. プロンプト修正 → (1に戻る)
```

:::

**最適化のテクニック：**

1. **プロンプトの構造化**: 明確なセクション分けと指示の階層化
2. **コンテキストの調整**: 必要な情報量の最適化
3. **出力形式の明確化**: JSONやXMLなどの構造化フォーマットの利用
4. **制約条件の追加**: 文字数制限や禁止事項の明示

### プロンプト評価と最適化を動かして確認してみよう

プロンプトの評価システムを構築し、A/Bテストによる最適化を実践してみましょう。

:::step

1. プロンプト評価システムの作成

`prompt_evaluation.py`を作成してプロンプトの評価システムを実装します。

_prompt_evaluation.py_

```python
//addstart
import json
import time
from typing import List, Dict
from langchain.llms import OpenAI
from langchain.prompts import PromptTemplate

class PromptEvaluator:
    def __init__(self):
        self.llm = OpenAI(temperature=0)

    def evaluate_prompt(self, prompt: str, test_cases: List[Dict], runs: int = 3) -> Dict:
        """プロンプトを評価する"""
        results = {
            'accuracy_scores': [],
            'consistency_scores': [],
            'token_counts': [],
            'response_times': [],
            'responses': []
        }

        for test_case in test_cases:
            case_results = []

            # 同じテストケースを複数回実行
            for run in range(runs):
                start_time = time.time()

                # プロンプトに入力を挿入
                formatted_prompt = prompt.format(**test_case['input'])
                response = self.llm(formatted_prompt)

                end_time = time.time()

                case_results.append({
                    'response': response,
                    'time': end_time - start_time,
                    'tokens': len(formatted_prompt.split()) + len(response.split())
                })

            # 精度の計算（簡易版 - 期待値との部分一致）
            accuracy = self._calculate_accuracy(case_results, test_case['expected'])

            # 一貫性の計算（レスポンスの類似度）
            consistency = self._calculate_consistency(case_results)

            results['accuracy_scores'].append(accuracy)
            results['consistency_scores'].append(consistency)
            results['token_counts'].extend([r['tokens'] for r in case_results])
            results['response_times'].extend([r['time'] for r in case_results])
            results['responses'].extend([r['response'] for r in case_results])

        return self._aggregate_results(results)

    def _calculate_accuracy(self, results: List[Dict], expected: str) -> float:
        """精度を計算（簡易版）"""
        scores = []
        for result in results:
            # キーワードベースの簡易マッチング
            response_words = set(result['response'].lower().split())
            expected_words = set(expected.lower().split())

            if expected_words:
                overlap = len(response_words.intersection(expected_words))
                score = overlap / len(expected_words)
            else:
                score = 0.0

            scores.append(score)

        return sum(scores) / len(scores)

    def _calculate_consistency(self, results: List[Dict]) -> float:
        """一貫性を計算（簡易版）"""
        if len(results) < 2:
            return 1.0

        responses = [r['response'] for r in results]
        similarities = []

        for i in range(len(responses)):
            for j in range(i + 1, len(responses)):
                # 単語レベルの類似度計算
                words1 = set(responses[i].lower().split())
                words2 = set(responses[j].lower().split())

                if words1 or words2:
                    intersection = len(words1.intersection(words2))
                    union = len(words1.union(words2))
                    similarity = intersection / union if union > 0 else 0
                    similarities.append(similarity)

        return sum(similarities) / len(similarities) if similarities else 1.0

    def _aggregate_results(self, results: Dict) -> Dict:
        """結果を集約"""
        return {
            'average_accuracy': sum(results['accuracy_scores']) / len(results['accuracy_scores']),
            'average_consistency': sum(results['consistency_scores']) / len(results['consistency_scores']),
            'average_tokens': sum(results['token_counts']) / len(results['token_counts']),
            'average_response_time': sum(results['response_times']) / len(results['response_times']),
            'total_test_cases': len(results['accuracy_scores'])
        }

# テストケースの定義
test_cases = [
    {
        'input': {'product': 'ノートパソコン', 'issue': 'バッテリーの持ちが悪い'},
        'expected': '電源設定の確認やバッテリーの劣化診断を提案する'
    },
    {
        'input': {'product': 'スマートフォン', 'issue': '画面が割れた'},
        'expected': '修理サービスや画面保護の提案をする'
    }
]

# プロンプトA（基本版）
prompt_a = """
お客様から以下の問い合わせがありました：
商品: {product}
問題: {issue}

適切な対応を提案してください。
"""

# プロンプトB（改良版）
prompt_b = """
あなたはカスタマーサポートの専門家です。以下の顧客問い合わせに対して、親切で具体的な解決策を提案してください。

商品情報: {product}
発生している問題: {issue}

対応方針:
1. 問題の原因を分析
2. 具体的な解決手順を提示
3. 必要に応じて追加サポートを案内

回答形式:
- 原因分析: [原因の説明]
- 解決手順: [ステップバイステップの手順]
- 追加サポート: [必要に応じて]
"""

# 評価実行
evaluator = PromptEvaluator()

print("プロンプトA（基本版）の評価:")
results_a = evaluator.evaluate_prompt(prompt_a, test_cases)
print(json.dumps(results_a, indent=2, ensure_ascii=False))

print("\n" + "="*50 + "\n")

print("プロンプトB（改良版）の評価:")
results_b = evaluator.evaluate_prompt(prompt_b, test_cases)
print(json.dumps(results_b, indent=2, ensure_ascii=False))

# 比較結果の表示
print("\n" + "="*50 + "\n")
print("比較結果:")
print(f"精度: A={results_a['average_accuracy']:.3f} vs B={results_b['average_accuracy']:.3f}")
print(f"一貫性: A={results_a['average_consistency']:.3f} vs B={results_b['average_consistency']:.3f}")
print(f"トークン数: A={results_a['average_tokens']:.1f} vs B={results_b['average_tokens']:.1f}")
print(f"応答時間: A={results_a['average_response_time']:.3f}s vs B={results_b['average_response_time']:.3f}s")
//addend
```

2. 動的プロンプト最適化システムの実装

`dynamic_optimization.py`を作成して動的な最適化システムを実装します。

_dynamic_optimization.py_

```python
//addstart
import random
from typing import List, Dict, Tuple
from langchain.llms import OpenAI

class DynamicPromptOptimizer:
    def __init__(self):
        self.llm = OpenAI(temperature=0)
        self.performance_history = []

    def generate_prompt_variations(self, base_prompt: str) -> List[str]:
        """ベースプロンプトからバリエーションを生成"""
        variations = []

        # パターン1: 役割設定の追加
        role_variations = [
            "あなたは経験豊富な",
            "あなたは専門知識を持つ",
            "あなたは親切で知識豊富な"
        ]

        # パターン2: 出力形式の指定
        format_variations = [
            "\n\n回答は簡潔に答えてください。",
            "\n\n回答は具体例を含めて説明してください。",
            "\n\n回答は段階的に説明してください。"
        ]

        # パターン3: 制約条件の追加
        constraint_variations = [
            "\n\n200字以内で回答してください。",
            "\n\n専門用語は避けて分かりやすく説明してください。",
            "\n\n実用的なアドバイスを中心に回答してください。"
        ]

        # バリエーション生成
        for role in role_variations:
            for format_instr in format_variations:
                for constraint in constraint_variations:
                    if random.random() > 0.7:  # ランダムに選択
                        variation = f"{role}{base_prompt.strip()}{format_instr}{constraint}"
                        variations.append(variation)

        return variations[:5]  # 上位5つを返す

    def evaluate_and_optimize(self, base_prompt: str, test_input: str, iterations: int = 3) -> Tuple[str, float]:
        """プロンプトを評価して最適化"""
        best_prompt = base_prompt
        best_score = 0.0

        for iteration in range(iterations):
            print(f"\n最適化イテレーション {iteration + 1}/{iterations}")

            # バリエーション生成
            variations = self.generate_prompt_variations(best_prompt)
            variations.insert(0, best_prompt)  # 現在のベストも含める

            # 各バリエーションを評価
            for i, prompt in enumerate(variations):
                try:
                    response = self.llm(prompt.format(input=test_input))
                    score = self._simple_quality_score(response)

                    print(f"  バリエーション {i+1}: スコア {score:.3f}")

                    if score > best_score:
                        best_score = score
                        best_prompt = prompt
                        print(f"  *** 新しいベスト発見! ***")

                except Exception as e:
                    print(f"  バリエーション {i+1}: エラー - {e}")
                    continue

        return best_prompt, best_score

    def _simple_quality_score(self, response: str) -> float:
        """簡易的な品質スコア計算"""
        score = 0.0

        # 長さのスコア（適度な長さを評価）
        length = len(response)
        if 50 <= length <= 500:
            score += 0.3
        elif length > 20:
            score += 0.1

        # 構造のスコア（段落や箇条書きがあるか）
        if '\n' in response:
            score += 0.2
        if '。' in response or '.' in response:
            score += 0.2

        # 内容のスコア（キーワードの有無）
        useful_words = ['方法', '手順', 'ステップ', '解決', '対策', '提案', '確認']
        found_words = sum(1 for word in useful_words if word in response)
        score += min(found_words * 0.1, 0.3)

        return min(score, 1.0)

# 最適化実行例
optimizer = DynamicPromptOptimizer()

base_prompt = """
{input}について教えてください。
"""

test_input = "Pythonでファイル読み込みを行う"

print("プロンプトの動的最適化を実行します...")
print(f"ベースプロンプト: {base_prompt}")
print(f"テスト入力: {test_input}")

optimized_prompt, final_score = optimizer.evaluate_and_optimize(
    base_prompt, test_input, iterations=2
)

print("\n" + "="*50)
print("最適化結果:")
print(f"最終スコア: {final_score:.3f}")
print(f"最適化されたプロンプト:")
print(optimized_prompt)

# 最適化されたプロンプトをテスト
print("\n" + "="*50)
print("最適化されたプロンプトのテスト結果:")
final_response = optimizer.llm(optimized_prompt.format(input=test_input))
print(final_response)
//addend
```

3. プロンプト性能レポートの生成

`performance_report.py`を作成してプロンプト性能の詳細レポートを生成します。

_performance_report.py_

```python
//addstart
import json
import matplotlib.pyplot as plt
from datetime import datetime
from langchain.llms import OpenAI

class PromptPerformanceReporter:
    def __init__(self):
        self.llm = OpenAI(temperature=0)

    def generate_comprehensive_report(self, prompt_versions: Dict[str, str], test_cases: List[Dict]) -> Dict:
        """包括的なパフォーマンスレポートを生成"""
        report = {
            'timestamp': datetime.now().isoformat(),
            'test_summary': {
                'total_prompts': len(prompt_versions),
                'total_test_cases': len(test_cases)
            },
            'results': {},
            'recommendations': []
        }

        # 各プロンプトバージョンを評価
        for version_name, prompt in prompt_versions.items():
            print(f"\n{version_name}の評価中...")

            version_results = {
                'accuracy_scores': [],
                'response_qualities': [],
                'efficiency_metrics': {
                    'avg_tokens': 0,
                    'avg_response_time': 0
                },
                'sample_responses': []
            }

            for i, test_case in enumerate(test_cases):
                try:
                    # プロンプト実行
                    start_time = datetime.now()
                    formatted_prompt = prompt.format(**test_case['input'])
                    response = self.llm(formatted_prompt)
                    end_time = datetime.now()

                    # メトリクス計算
                    response_time = (end_time - start_time).total_seconds()
                    token_count = len(formatted_prompt.split()) + len(response.split())
                    quality_score = self._calculate_quality_score(response, test_case.get('expected', ''))

                    version_results['accuracy_scores'].append(quality_score)
                    version_results['response_qualities'].append(quality_score)
                    version_results['efficiency_metrics']['avg_tokens'] += token_count
                    version_results['efficiency_metrics']['avg_response_time'] += response_time

                    if i < 2:  # 最初の2つのレスポンスをサンプルとして保存
                        version_results['sample_responses'].append({
                            'input': test_case['input'],
                            'response': response[:200] + '...' if len(response) > 200 else response,
                            'quality_score': quality_score
                        })

                except Exception as e:
                    print(f"  エラー (テストケース {i+1}): {e}")

            # 平均値の計算
            if test_cases:
                version_results['efficiency_metrics']['avg_tokens'] /= len(test_cases)
                version_results['efficiency_metrics']['avg_response_time'] /= len(test_cases)

            version_results['overall_score'] = sum(version_results['accuracy_scores']) / len(version_results['accuracy_scores']) if version_results['accuracy_scores'] else 0

            report['results'][version_name] = version_results

        # 推奨事項の生成
        report['recommendations'] = self._generate_recommendations(report['results'])

        return report

    def _calculate_quality_score(self, response: str, expected: str) -> float:
        """品質スコアを計算"""
        score = 0.0

        # 基本的な品質チェック
        if len(response.strip()) > 10:
            score += 0.2

        if expected:
            # 期待値との類似度（簡易版）
            response_words = set(response.lower().split())
            expected_words = set(expected.lower().split())
            if expected_words:
                overlap = len(response_words.intersection(expected_words))
                similarity = overlap / len(expected_words)
                score += similarity * 0.5

        # 構造的品質
        if '。' in response or '\n' in response:
            score += 0.2

        # 有用性指標
        useful_indicators = ['方法', '手順', '解決', '対策', '例', '具体的']
        found_indicators = sum(1 for indicator in useful_indicators if indicator in response)
        score += min(found_indicators * 0.02, 0.1)

        return min(score, 1.0)

    def _generate_recommendations(self, results: Dict) -> List[str]:
        """結果に基づいて推奨事項を生成"""
        recommendations = []

        # 最高性能のプロンプトを特定
        best_prompt = max(results.keys(), key=lambda k: results[k]['overall_score'])
        best_score = results[best_prompt]['overall_score']

        recommendations.append(f"最高性能: '{best_prompt}' (スコア: {best_score:.3f})")

        # 効率性の分析
        efficient_prompts = sorted(results.keys(), key=lambda k: results[k]['efficiency_metrics']['avg_tokens'])
        recommendations.append(f"最も効率的: '{efficient_prompts[0]}' (平均トークン数: {results[efficient_prompts[0]]['efficiency_metrics']['avg_tokens']:.1f})")

        # 改善提案
        if best_score < 0.7:
            recommendations.append("全体的にスコアが低いため、プロンプト構造の見直しを推奨")

        if any(results[k]['efficiency_metrics']['avg_tokens'] > 500 for k in results):
            recommendations.append("一部プロンプトのトークン数が多いため、簡潔性の改善を検討")

        return recommendations

    def save_report(self, report: Dict, filename: str = None):
        """レポートを保存"""
        if filename is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"prompt_performance_report_{timestamp}.json"

        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)

        print(f"\nレポートを {filename} に保存しました")

# テスト用プロンプト
prompt_versions = {
    "基本版": "以下について説明してください：{topic}",
    "構造化版": """
以下のトピックについて説明してください：{topic}

説明形式:
1. 概要
2. 主要なポイント
3. 実用的な例
""",
    "詳細版": """
あなたは専門的な知識を持つ教育者です。
以下のトピックについて、初学者にも理解できるよう丁寧に説明してください：{topic}

要求事項:
- 専門用語は定義を含める
- 具体例を2つ以上提示
- 実践的なアドバイスを含める
- 300字程度で簡潔に

構成:
1. トピックの概要と重要性
2. 主要なポイント（3つ程度）
3. 具体例と実践的アドバイス
"""
}

# テストケース
test_cases = [
    {
        'input': {'topic': 'Pythonの辞書型'},
        'expected': '辞書型の基本概念、使用方法、実例を含む説明'
    },
    {
        'input': {'topic': 'Git のブランチ機能'},
        'expected': 'ブランチの概念、作成方法、マージ方法を含む説明'
    }
]

# レポート生成
reporter = PromptPerformanceReporter()
report = reporter.generate_comprehensive_report(prompt_versions, test_cases)

# 結果の表示
print("\n" + "="*60)
print("プロンプト性能レポート")
print("="*60)

for version, results in report['results'].items():
    print(f"\n{version}:")
    print(f"  総合スコア: {results['overall_score']:.3f}")
    print(f"  平均トークン数: {results['efficiency_metrics']['avg_tokens']:.1f}")
    print(f"  平均応答時間: {results['efficiency_metrics']['avg_response_time']:.3f}s")

print(f"\n推奨事項:")
for i, rec in enumerate(report['recommendations'], 1):
    print(f"  {i}. {rec}")

# レポートの保存
reporter.save_report(report)
//addend
```

4. 実行とレポート確認

作成したファイルを実行して評価とレポートを確認します。

```bash
python prompt_evaluation.py
```

```bash
python dynamic_optimization.py
```

```bash
python performance_report.py
```

:::

このハンズオンにより、プロンプトの性能を定量的に評価する方法と、データに基づいた継続的な改善プロセスを体験できます。また、動的最適化システムにより、自動的にプロンプトを改良する仕組みも理解できました。

## まとめ

この章では、LLMとプロンプトエンジニアリングについて包括的に学習しました。基本的なプロンプト設計の原則から高度な技法まで、実際に手を動かしながら体験することができました。

:::note 要点のまとめ

- **LLMの基本理解**: Large Language Modelの動作原理とプロンプトの重要性
- **設計原則**: 明確性、具体性、構造化が効果的なプロンプトの基盤
- **高度な技法**: Few-shot学習とChain-of-Thoughtプロンプティングの実践的な活用
- **評価と最適化**: 定量的な評価指標に基づくプロンプトの継続的改善手法
- **LangChainの活用**: プロンプトテンプレートやチェーン機能による効率的な開発

:::

プロンプトエンジニアリングは、AI アプリケーション開発における重要なスキルです。この章で学んだ技術を基盤として、より複雑なLangChainの機能を活用していくことで、高品質なAIソリューションを構築できるようになります。

次の章では、LangChainのMemoryクラスを使った対話履歴の管理について詳しく学習していきます。

[次のページ: Memoryクラスと対話履歴管理](./memory-conversation-history)

## 関連リンク

- [LangChain公式ドキュメント - Prompts](https://docs.langchain.com/docs/components/prompts/)
- [OpenAI GPT Best Practices](https://platform.openai.com/docs/guides/gpt-best-practices)
- [Anthropic Claude Prompt Engineering](https://docs.anthropic.com/claude/docs/prompt-engineering)
- [Google AI Prompt Engineering Guide](https://developers.generativeai.google/guide/prompt_intro)

## さらに深く学習したい方へ

プロンプトエンジニアリングをより深く学び、実践的なスキルを身につけたい方には、以下の学習プラットフォームでの継続学習をお勧めします：

**LangChain実践コース** - プロンプト設計から本格的なAIアプリケーション開発まで、体系的に学習できる包括的なカリキュラムを提供しています。現役エンジニアによる個別メンタリングサポートで、実務レベルのスキル習得を目指せます。
