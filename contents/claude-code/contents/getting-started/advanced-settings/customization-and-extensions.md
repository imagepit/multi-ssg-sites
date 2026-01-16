---
title: カスタマイズと拡張
slug: customization-and-extensions
parent: advanced-settings
status: published
filepath: contents/getting-started/advanced-settings/customization-and-extensions.md
post_type: pages
goal: Claude Codeをカスタマイズし、拡張機能を活用して開発効率を最大化できるようにする
seo_title: Claude Codeカスタマイズと拡張 | 機能拡張ガイド
seo_description: Claude Codeのカスタマイズ方法と拡張機能を詳しく解説。プラグイン、スクリプト、統合機能を使って開発環境を最適化する実践的なガイドです。
seo_keywords: Claude Code カスタマイズ, 拡張機能, プラグイン, スクリプト, 統合
handson_overview: 実際に拡張機能を作成し、カスタマイズの効果を体験する実践
---

# カスタマイズと拡張

このガイドでは、Claude Codeをカスタマイズし、拡張機能を活用する方法を詳しく解説します。プラグインの作成からスクリプトの統合まで、開発環境を最適化するための実践的な手法を学びます。

:::note このガイドで学べること

- Claude Codeのカスタマイズ基本
- プラグインの作成と管理
- スクリプトの統合と自動化
- 外部ツールとの連携
- カスタムコマンドの作成

:::

## カスタマイズの基本

### 設定ファイルのカスタマイズ

:::step

1. 設定ファイルの構造

Claude Codeの設定ファイル構造を理解します。

_コマンド実行_
```bash
# 設定ファイルの場所を確認
claude config debug

# 設定ファイルの中身を確認
cat ~/.config/claude-code/config.json
```

2. カスタム設定の追加

独自の設定を追加します。

_コマンド実行_
```bash
# カスタム設定を追加
claude config set custom.theme dark
claude config set custom.editor vscode
claude config set custom.terminal iterm2
```

3. 設定の検証

設定が正しく反映されているか確認します。

_コマンド実行_
```bash
# 設定の確認
claude config list

# 設定のテスト
claude --version
```

:::

### ユーザーインターフェースのカスタマイズ

:::step

1. 出力形式のカスタマイズ

コマンドの出力形式をカスタマイズします。

_コマンド実行_
```bash
# 出力形式をJSONに設定
claude config set output-format json

# 出力を色付きに設定
claude config set colored-output true

# 詳細出力を有効化
claude config set verbose true
```

2. プロンプトのカスタマイズ

対話プロンプトをカスタマイズします。

_コマンド実行_
```bash
# プロンプトテンプレートを設定
claude config set prompt-template "[{cwd}]({branch})$ "

# プロンプトの色を設定
claude config set prompt-color blue
```

3. ログのカスタマイズ

ログ出力をカスタマイズします。

_コマンド実行_
```bash
# ログレベルを設定
claude config set log-level debug

# ログファイルを設定
claude config set log-file ~/.claude-code/custom.log
```

:::

## プラグインの作成と管理

### 基本的なプラグインの作成

:::step

1. プラグインの基本構造

プラグインの基本構造を作成します。

_コマンド実行_
```bash
# プラグインディレクトリの作成
mkdir -p ~/.claude-code/plugins

# 基本的なプラグインファイルを作成
claude "基本的なプラグインのテンプレートを作成してください。
要件：
- プラグインのメタデータ
- 初期化関数
- コマンドハンドラ
- ヘルプ機能"
```

2. プラグインの登録

作成したプラグインを登録します。

_コマンド実行_
```bash
# プラグインを登録
claude plugin register ~/.claude-code/plugins/my-plugin.js

# プラグインの有効化
claude plugin enable my-plugin
```

3. プラグインのテスト

プラグインが正しく動作するかテストします。

_コマンド実行_
```bash
# プラグインの実行
claude my-plugin --help

# プラグインのステータス確認
claude plugin status my-plugin
```

:::

### 高度なプラグインの開発

:::step

1. データ処理プラグイン

データ処理を行うプラグインを作成します。

_コマンド実行_
```bash
claude "CSVファイルを処理するプラグインを作成してください。
機能：
- CSVファイルの読み込み
- データのフィルタリング
- 統計情報の計算
- JSON形式での出力"
```

2. API連携プラグイン

外部APIと連携するプラグインを作成します。

_コマンド実行_
```bash
claude "GitHub APIと連携するプラグインを作成してください。
機能：
- リポジトリ情報の取得
- イシューの管理
- プルリクエストの作成
- コミット履歴の表示"
```

3. 自動化プラグイン

開発プロセスを自動化するプラグインを作成します。

_コマンド実行_
```bash
claude "開発自動化プラグインを作成してください。
機能：
- ファイル変更の監視
- 自動テストの実行
- ビルドの自動化
- デプロイのトリガー"
```

:::

## スクリプトの統合と自動化

### シェルスクリプトの統合

:::step

1. 基本的なシェルスクリプト

Claude Codeと連携するシェルスクリプトを作成します。

_コマンド実行_
```bash
# スクリプトファイルの作成
cat > claude-helper.sh << 'EOF'
#!/bin/bash

# Claude Codeヘルパースクリプト
echo "Claude Codeヘルパーを起動します..."

# プロジェクトの分析
claude "現在のプロジェクトを分析し、改善点を提案してください" > analysis.txt

# 結果の表示
echo "分析結果："
cat analysis.txt

# ファイルのクリーンアップ
rm analysis.txt
EOF

# 実行権限の付与
chmod +x claude-helper.sh
```

2. 環境変数の利用

環境変数を活用したスクリプトを作成します。

_コマンド実行_
```bash
# 環境変数を利用したスクリプト
cat > env-aware-script.sh << 'EOF'
#!/bin/bash

# 環境変数の確認
if [ -z "$ANTHROPIC_API_KEY" ]; then
  echo "APIキーが設定されていません"
  exit 1
fi

# 環境に応じた処理
case "$NODE_ENV" in
  "development")
    claude "開発環境用のコード生成を行います"
    ;;
  "production")
    claude "本番環境用のコード最適化を行います"
    ;;
  *)
    claude "デフォルトの処理を行います"
    ;;
esac
EOF

# 実行権限の付与
chmod +x env-aware-script.sh
```

3. バッチ処理スクリプト

バッチ処理を行うスクリプトを作成します。

_コマンド実行_
```bash
# バッチ処理スクリプト
cat > batch-process.sh << 'EOF'
#!/bin/bash

# ディレクトリ内のファイルをバッチ処理
for file in src/components/*.js; do
  echo "処理中: $file"
  claude "このファイルをリファクタリングしてください" "$file"
done

echo "バッチ処理が完了しました"
EOF

# 実行権限の付与
chmod +x batch-process.sh
```

:::

### Pythonスクリプトの統合

:::step

1. Pythonスクリプトの作成

Claude Codeを利用するPythonスクリプトを作成します。

_コマンド実行_
```bash
# Pythonスクリプトの作成
cat > claude_automation.py << 'EOF'
#!/usr/bin/env python3
import subprocess
import json
import os

class ClaudeAutomation:
    def __init__(self):
        self.claude_cmd = "claude"

    def analyze_project(self, project_path):
        """プロジェクトを分析する"""
        cmd = f"{self.claude_cmd} \"{project_path}を分析してください\""
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        return result.stdout

    def generate_code(self, prompt, output_file=None):
        """コードを生成する"""
        cmd = f"{self.claude_cmd} \"{prompt}\""
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)

        if output_file:
            with open(output_file, 'w') as f:
                f.write(result.stdout)

        return result.stdout

# 使用例
if __name__ == "__main__":
    automation = ClaudeAutomation()

    # プロジェクト分析
    analysis = automation.analyze_project(".")
    print("分析結果:", analysis)

    # コード生成
    code = automation.generate_code("簡単な計算機クラスを作成してください")
    print("生成されたコード:", code)
EOF

# 実行権限の付与
chmod +x claude_automation.py
```

2. 高度な自動化スクリプト

複雑な処理を行うスクリプトを作成します。

_コマンド実行_
```bash
# 高度な自動化スクリプト
cat > advanced_automation.py << 'EOF'
#!/usr/bin/env python3
import subprocess
import json
import time
import logging
from pathlib import Path

class AdvancedClaudeAutomation:
    def __init__(self, config_file="config.json"):
        self.config = self.load_config(config_file)
        self.setup_logging()

    def load_config(self, config_file):
        """設定ファイルを読み込む"""
        try:
            with open(config_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return self.create_default_config()

    def setup_logging(self):
        """ログ設定を行う"""
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('claude_automation.log'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)

    def process_project(self, project_path):
        """プロジェクトを処理する"""
        self.logger.info(f"プロジェクト処理を開始: {project_path}")

        # ファイルの分析
        files = self.analyze_files(project_path)

        # コード品質のチェック
        quality_report = self.check_code_quality(files)

        # 最適化の提案
        optimizations = self.suggest_optimizations(quality_report)

        # レポートの生成
        self.generate_report(optimizations)

        self.logger.info("プロジェクト処理が完了しました")

    def analyze_files(self, project_path):
        """ファイルを分析する"""
        project_path = Path(project_path)
        files = []

        for file_path in project_path.rglob("*.js"):
            files.append(str(file_path))

        return files

    def check_code_quality(self, files):
        """コード品質をチェックする"""
        quality_report = {}

        for file_path in files:
            cmd = f"claude \"{file_path}のコード品質をチェックしてください\""
            result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
            quality_report[file_path] = result.stdout

        return quality_report

    def suggest_optimizations(self, quality_report):
        """最適化を提案する"""
        optimizations = []

        for file_path, issues in quality_report.items():
            if issues:
                cmd = f"claude \"{file_path}の最適化を提案してください\""
                result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
                optimizations.append({
                    'file': file_path,
                    'suggestions': result.stdout
                })

        return optimizations

    def generate_report(self, optimizations):
        """レポートを生成する"""
        report = {
            'timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
            'optimizations': optimizations
        }

        with open('optimization_report.json', 'w') as f:
            json.dump(report, f, indent=2)

        self.logger.info("最適化レポートを生成しました")

if __name__ == "__main__":
    automation = AdvancedClaudeAutomation()
    automation.process_project(".")
EOF

# 実行権限の付与
chmod +x advanced_automation.py
```

:::

## 外部ツールとの連携

### Gitとの連携

:::step

1. Gitフックの設定

Gitと連携するフックを設定します。

_コマンド実行_
```bash
# pre-commitフックの作成
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash

# Claude Codeによるコミット前チェック
echo "コミット前チェックを実行します..."

# 変更ファイルのチェック
changed_files=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(js|py|ts)$')

if [ -n "$changed_files" ]; then
  echo "変更されたファイル: $changed_files"

  # 各ファイルの品質チェック
  for file in $changed_files; do
    echo "チェック中: $file"
    claude "このファイルのコード品質をチェックしてください" "$file"
  done

  # テストの実行
  echo "テストを実行します..."
  npm test

  if [ $? -ne 0 ]; then
    echo "テストに失敗しました。コミットを中止します。"
    exit 1
  fi
fi

echo "コミット前チェックが完了しました"
EOF

# 実行権限の付与
chmod +x .git/hooks/pre-commit
```

2. コミットメッセージの生成

コミットメッセージを自動生成します。

_コマンド実行_
```bash
# コミットメッセージ生成スクリプト
cat > generate-commit-message.sh << 'EOF'
#!/bin/bash

# 変更内容の分析
changes=$(git diff --cached --stat)

# Claude Codeでコミットメッセージを生成
commit_message=$(claude "以下の変更内容に基づいてコミットメッセージを生成してください：

変更内容：
$changes

形式：
- タイプ（feat/fix/docs/style/refactor/test/chore）
- 簡潔な説明
- 詳細な説明（必要な場合）")

# コミットメッセージの設定
if [ -n "$commit_message" ]; then
  git commit -m "$commit_message"
else
  echo "コミットメッセージの生成に失敗しました"
  exit 1
fi
EOF

# 実行権限の付与
chmod +x generate-commit-message.sh
```

3. プルリクエストの自動化

プルリクエストの作成を自動化します。

_コマンド実行_
```bash
# プルリクエスト作成スクリプト
cat > create-pr.sh << 'EOF'
#!/bin/bash

# ブランチ名の取得
current_branch=$(git branch --show-current)
target_branch=${1:-main}

# 変更内容の分析
changes=$(git log --oneline $target_branch..$current_branch)

# Claude CodeでPR説明を生成
pr_description=$(claude "以下の変更内容に基づいてプルリクエストの説明を生成してください：

変更内容：
$changes

セクション：
- 変更概要
- 主な機能
- 変更理由
- テスト方法
- 関連課題")

# GitHub CLIでPR作成
gh pr create --title "Merge $current_branch into $target_branch" --body "$pr_description"

echo "プルリクエストを作成しました"
EOF

# 実行権限の付与
chmod +x create-pr.sh
```

:::

### CI/CDツールとの連携

:::step

1. GitHub Actionsの統合

GitHub Actionsと連携します。

_コマンド実行_
```bash
# GitHub Actionsワークフローの作成
mkdir -p .github/workflows

cat > .github/workflows/claude-analysis.yml << 'EOF'
name: Claude Code Analysis

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  claude-analysis:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Install Claude Code
      run: npm install -g @anthropic-ai/claude-code

    - name: Configure Claude Code
      run: |
        echo "${{ secrets.ANTHROPIC_API_KEY }}" | claude config set api-key
        claude config set output-format json

    - name: Analyze Code Quality
      run: |
        claude "コード品質を分析してください" > quality-report.json
        cat quality-report.json

    - name: Generate Documentation
      run: |
        claude "APIドキュメントを生成してください" > docs/api.md

    - name: Upload Artifacts
      uses: actions/upload-artifact@v3
      with:
        name: analysis-results
        path: |
          quality-report.json
          docs/api.md
EOF
```

2. Jenkinsとの連携

Jenkinsパイプラインを作成します。

_コマンド実行_
```bash
# Jenkinsfileの作成
cat > Jenkinsfile << 'EOF'
pipeline {
    agent any

    environment {
        ANTHROPIC_API_KEY = credentials('anthropic-api-key')
    }

    stages {
        stage('Setup') {
            steps {
                sh 'npm install -g @anthropic-ai/claude-code'
                sh 'claude config set api-key $ANTHROPIC_API_KEY'
            }
        }

        stage('Code Analysis') {
            steps {
                sh 'claude "コードを分析してください" --output analysis.json'
                archiveArtifacts artifacts: 'analysis.json'
            }
        }

        stage('Generate Tests') {
            steps {
                sh 'claude "テストを生成してください" --output tests/'
                sh 'npm test'
            }
        }

        stage('Documentation') {
            steps {
                sh 'claude "ドキュメントを生成してください" --output docs/'
                archiveArtifacts artifacts: 'docs/**/*'
            }
        }
    }
}
EOF
```

3. Dockerとの連携

Dockerコンテナ内でClaude Codeを実行します。

_コマンド実行_
```bash
# Dockerfileの作成
cat > Dockerfile << 'EOF'
FROM node:18-alpine

# Claude Codeのインストール
RUN npm install -g @anthropic-ai/claude-code

# 作業ディレクトリの設定
WORKDIR /app

# 設定ファイルのコピー
COPY config.json ~/.config/claude-code/

# エントリーポイントの設定
ENTRYPOINT ["claude"]
CMD ["--help"]
EOF

# docker-compose.ymlの作成
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  claude-code:
    build: .
    environment:
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
    volumes:
      - ./:/app
      - ~/.config/claude-code:/root/.config/claude-code
    working_dir: /app
EOF
```

:::

## カスタムコマンドの作成

### 基本的なカスタムコマンド

:::step

1. カスタムコマンドの登録

独自のコマンドを登録します。

_コマンド実行_
```bash
# カスタムコマンドの登録
claude config set custom.commands.analyze "claude \"現在のプロジェクトを分析してください\""
claude config set custom.commands.test "claude \"テストを作成してください\""
claude config set custom.commands.docs "claude \"ドキュメントを生成してください\""
```

2. カスタムコマンドの実行

登録したコマンドを実行します。

_コマンド実行_
```bash
# カスタムコマンドの実行
claude custom:analyze
claude custom:test
claude custom:docs
```

3. コマンドエイリアスの作成

コマンドのエイリアスを作成します。

_コマンド実行_
```bash
# エイリアスの設定
claude config set alias.a "custom:analyze"
claude config set alias.t "custom:test"
claude config set alias.d "custom:docs"

# エイリアスの使用
claude a
claude t
claude d
```

:::

### 高度なカスタムコマンド

:::step

1. パラメータ付きコマンド

パラメータを受け取るコマンドを作成します。

_コマンド実行_
```bash
# パラメータ付きコマンドの登録
claude config set custom.commands.refactor "claude \"{file}をリファクタリングしてください\""
claude config set custom.commands.optimize "claude \"{file}のパフォーマンスを最適化してください\""

# パラメータを指定して実行
claude custom:refactor --file src/components/UserList.js
claude custom:optimize --file src/utils/dataProcessor.js
```

2. 条件分岐コマンド

条件に応じて動作を変えるコマンドを作成します。

_コマンド実行_
```bash
# 条件分岐コマンドの登録
claude config set custom.commands.build "claude \"ビルドスクリプトを作成してください\""
claude config set custom.commands.deploy "claude \"デプロイスクリプトを作成してください\""

# 環境に応じた実行
if [ "$NODE_ENV" = "production" ]; then
  claude custom:build --env production
  claude custom:deploy --env production
else
  claude custom:build --env development
fi
```

3. チェーンコマンド

複数のコマンドを連鎖させます。

_コマンド実行_
```bash
# チェーンコマンドの登録
claude config set custom.chain.dev-flow "analyze -> test -> build"
claude config set custom.chain.prod-flow "analyze -> test -> build -> deploy"

# チェーンコマンドの実行
claude chain:dev-flow
claude chain:prod-flow
```

:::

## 次のステップ

カスタマイズと拡張を学習したら、次のステップに進みましょう。

1. [セキュリティベストプラクティス](security-best-practices.md)
2. [高度な機能の学習](../../advanced-features/advanced-features.md)
3. [実践的なプロジェクトの作成](../../practical-projects/practical-projects.md)

---

## まとめ

:::note 要点のまとめ

- Claude Codeのカスタマイズ基本と設定ファイルの操作を習得
- プラグインの作成と管理方法を理解
- スクリプト統合による自動化の手法を学習
- 外部ツール（Git、CI/CD、Docker）との連携を習得
- カスタムコマンドの作成と活用方法を理解

:::

## 関連記事

[セキュリティベストプラクティス](security-best-practices.md)
[高度な機能](../../advanced-features/advanced-features.md)
[実践的なプロジェクト](../../practical-projects/practical-projects.md)
[環境設定の最適化](environment-configuration.md)