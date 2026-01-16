---
title: CLAUDE.mdファイルの設定
slug: claude-md-setup
parent: initial-setup
status: published
filepath: contents/getting-started/initial-setup/claude-md-setup.md
post_type: pages
goal: CLAUDE.mdファイルを適切に設定し、プロジェクト固有のコンテキストと指示を効果的に活用できるようにする
seo_title: CLAUDE.mdファイル設定ガイド | プロジェクトコンテキスト最適化
seo_description: CLAUDE.mdファイルの効果的な設定方法を詳しく解説。プロジェクトコンテキストの記述からルール設定まで、開発効率を最大化する設定テクニックを提供します。
seo_keywords: CLAUDE.md, プロジェクト設定, コンテキスト, 指示文書, 設定ファイル
handson_overview: 実際のプロジェクトでCLAUDE.mdファイルを作成し、効果を確認する実践
---

# CLAUDE.mdファイルの設定ガイド

このガイドでは、Claude Codeの核心機能であるCLAUDE.mdファイルの設定方法を詳しく解説します。プロジェクト固有のコンテキストや開発ルールを効果的に記述することで、AIによる開発支援の精度と効率を劇的に向上させることができます。

:::note このガイドで学べること

- CLAUDE.mdファイルの基本的な構造と目的
- プロジェクトコンテキストの効果的な記述方法
- 開発ルールやコーディング規約の設定方法
- 環境変数や設定値の管理
- ベストプラクティスと実践的なテンプレート

:::

## CLAUDE.mdファイルとは

### 基本概念

CLAUDE.mdファイルは、プロジェクトのルートディレクトリに配置される特別な設定ファイルです。このファイルには以下の情報を記述します。

- **プロジェクト概要**: プロジェクトの目的、技術スタック、アーキテクチャ
- **開発ルール**: コーディング規約、命名規則、アーキテクチャパターン
- **環境設定**: 使用するツール、フレームワーク、依存関係
- **ワークフロー**: 開発プロセス、テスト戦略、デプロイ方法

### ファイルの目的

:::important CLAUDE.mdの重要性

CLAUDE.mdファイルは、AIがプロジェクトの文脈を理解するための「羅針盤」です。適切に設定することで：

- プロジェクト固有の要件を正確に理解
- 一貫性のあるコード生成
- 開発チームのルールを自動適用
- 環境に合わせた最適な提案

:::

## 基本的なファイル構造

### 最小構成の例

```markdown
# プロジェクト名

## プロジェクト概要
[プロジェクトの目的と背景]

## 技術スタック
- 使用言語: [言語名]
- フレームワーク: [フレームワーク名]
- データベース: [データベース名]

## 開発ルール
- コーディング規約: [規約名]
- テストフレームワーク: [フレームワーク名]
- コミットメッセージ: [ルール]
```

### 詳細な構成の例

```markdown
# プロジェクト名

## 概要
このプロジェクトは[目的]を実現するために開発されています。

## 技術スタック
### フロントエンド
- React 18.2
- TypeScript 5.0
- Tailwind CSS 3.3

### バックエンド
- Node.js 18.0
- Express 4.18
- PostgreSQL 15.0

## 開発ルール
### コーディング規約
- ESLintとPrettierを使用
- コンポーネントは関数型で実装
- 状態管理はZustandを使用

### 命名規則
- 変数名: camelCase
- コンポーネント名: PascalCase
- ファイル名: kebab-case

## 環境設定
### 開発環境
- Node.js 18.0+
- npm 9.0+

### ツール設定
- VS Code推奨
- Gitフック: Husky
- テスト: Jest + React Testing Library
```

## 設定項目の詳細解説

### プロジェクト概要セクション

:::step

1. プロジェクト概要の作成

プロジェクトの基本情報を明確に記述します。

_プロジェクト概要の例_
```markdown
# Eコマースサイト構築プロジェクト

## 概要
このプロジェクトは、中小企業向けのB2B Eコマースプラットフォームを構築することを目的としています。主な機能として、商品管理、注文処理、顧客管理、決済統合を実装します。

## ビジネスゴール
- 月間取引額1000万円達成
- 顧客満足度90%以上
- システム稼働率99.9%

## ターゲットユーザー
- 中小企業の経営者
- 商品管理担当者
- 営業担当者
```

2. 技術的背景の追加

技術的な選定理由や制約事項を記述します。

_技術的背景の例_
```markdown
## 技術的選定理由
- React: コンポーネントの再利用性と豊富なエコシステム
- TypeScript: 型安全性によるバグ削減
- PostgreSQL: トランザクション処理の信頼性
- Express: 軽量で柔軟なAPI開発

## 制約事項
- レスポンシブデザイン必須
- モバイルファースト設計
- PCI DSS準拠の決済処理
```

:::

### 技術スタックセクション

:::step

1. 技術スタックの詳細設定

使用する技術スタックをバージョン含めて詳細に記述します。

_技術スタックの例_
```markdown
## 技術スタック

### フロントエンド
- React 18.2.0
- TypeScript 5.0.4
- Tailwind CSS 3.3.3
- React Router 6.11.2
- Axios 1.4.0
- React Hook Form 7.45.2

### バックエンド
- Node.js 18.17.0
- Express 4.18.2
- TypeORM 0.3.17
- PostgreSQL 15.3
- Redis 7.0.12
- Bull 4.11.3 (キューシステム)

### 開発ツール
- ESLint 8.45.0
- Prettier 3.0.0
- Husky 8.0.3
- Jest 29.6.1
- Docker 24.0.2
```

2. 依存関係の管理

パッケージ管理に関するルールを記述します。

_依存関係管理の例_
```markdown
## 依存関係管理

### パッケージ管理
- npmを使用
- package.jsonでバージョン固定
- セキュリティアップデートはnpm auditで定期確認

### 開発依存関係
```json
{
  "devDependencies": {
    "@types/node": "^20.4.5",
    "@types/react": "^18.2.15",
    "typescript": "^5.0.4",
    "eslint": "^8.45.0",
    "prettier": "^3.0.0"
  }
}
```

### 本番依存関係
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "express": "^4.18.2",
    "pg": "^8.11.1"
  }
}
```
```

:::

### 開発ルールセクション

:::step

1. コーディング規約の設定

コーディング規約を具体的に記述します。

_コーディング規約の例_
```markdown
## 開発ルール

### コーディング規約
- ESLintルール: Airbnbベース
- Prettier設定: 2スペースインデント
- 行長: 100文字まで
- セミコロン: 必須
- 引用符: シングルクォート
- 末尾カンマ: 必須

### ESLint設定
```javascript
module.exports = {
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'prettier'
  ],
  rules: {
    'no-unused-vars': 'error',
    'prefer-const': 'error',
    'no-var': 'error'
  }
}
```

### Prettier設定
```json
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```
```

2. 命名規則の設定

命名規則を明確に定義します。

_命名規則の例_
```markdown
## 命名規則

### 変数名
- camelCaseを使用
```typescript
const userName: string = 'John';
const itemCount: number = 10;
```

### 関数名
- 動詞から始めるcamelCase
```typescript
function getUserData(): UserData;
function calculateTotal(items: Item[]): number;
function validateInput(input: string): boolean;
```

### コンポーネント名
- PascalCase
```typescript
const UserProfile: React.FC<UserProps> = ({ user }) => {
  // コンポーネント実装
};
```

### ファイル名
- kebab-case
```
src/components/user-profile.tsx
src/utils/format-date.ts
src/services/api-client.ts
```
```

:::

### アーキテクチャセクション

:::step

1. アーキテクチャパターンの定義

プロジェクトのアーキテクチャを明確に定義します。

_アーキテクチャの例_
```markdown
## アーキテクチャ

### 全体構造
```
src/
├── components/     # UIコンポーネント
├── pages/          # ページコンポーネント
├── hooks/          # カスタムフック
├── services/       # APIサービス
├── utils/          # ユーティリティ関数
├── types/          # TypeScript型定義
├── constants/      # 定数
└── styles/         # スタイル定義
```

### データフロー
- コンポーネント → カスタムフック → サービス → API
- 状態管理: コンポーネントローカル状態 + カスタムフック
- エラーハンドリング: 例外境界とエラーコンポーネント

### ステート管理
- ローカル状態: useState + useReducer
- グローバル状態: Zustand
- サーバー状態: React Query
```

2. API設計のルール

APIに関するルールを定義します。

_API設計の例_
```markdown
## API設計

### RESTful API
- エンドポイント: /api/v1/{resource}
- HTTPメソッド: GET, POST, PUT, DELETE
- レスポンス形式: JSON

### 認証
- JWTトークンを使用
- Authorizationヘッダー: Bearer {token}
- リフレッシュトークンによる自動更新

### エラーレスポンス
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "入力値が不正です",
    "details": {
      "email": "メールアドレスの形式が正しくありません"
    }
  }
}
```

### 成功レスポンス
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```
```

:::

## 環境設定セクション

:::step

1. 開発環境の設定

開発環境に関する設定を記述します。

_開発環境設定の例_
```markdown
## 環境設定

### 開発環境
- Node.js: 18.17.0以上
- npm: 9.0以上
- PostgreSQL: 15.0以上
- Redis: 7.0以上

### 環境変数
```bash
# .env.example
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
API_BASE_URL=http://localhost:3000/api
```

### Docker設定
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### docker-compose.yml
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - db
      - redis

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: ecommerce
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```
```

2. テスト環境の設定

テストに関する設定を記述します。

_テスト環境設定の例_
```markdown
## テスト設定

### テストフレームワーク
- Jest: ユニットテスト
- React Testing Library: コンポーネントテスト
- Playwright: E2Eテスト

### テストカバレッジ
- カバレッジ目標: 80%以上
- CI/CDでの自動実行
- カバレッジレポートの生成

### テストデータ
```typescript
// tests/fixtures/user.ts
export const mockUser = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  role: 'user'
};

// tests/helpers/setup.ts
export const setupTestDatabase = async () => {
  // テスト用データベースのセットアップ
};
```

### テストコマンド
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test"
  }
}
```
```

:::

## 実践的なCLAUDE.mdの作成

:::step

1. サンプルプロジェクト用CLAUDE.mdの作成

実際のプロジェクトで使用するCLAUDE.mdを作成します。

_サンプルCLAUDE.md_
```markdown
# タスク管理アプリケーション

## 概要
このプロジェクトは、個人およびチーム向けのタスク管理アプリケーションを開発するものです。主な機能としてタスクの作成、編集、削除、状態管理、担当者割り当てを実装します。

## 技術スタック
- React 18.2.0 + TypeScript 5.0.4
- Vite 4.4.5
- Tailwind CSS 3.3.3
- React Router 6.14.2
- Zustand 4.4.1
- React Hook Form 7.45.2

## 開発ルール
### コーディング規約
- ESLint + Prettierを使用
- コンポーネントは関数型で実装
- カスタムフックでロジックを分離
- 型安全性を重視

### 命名規則
- コンポーネント: PascalCase
- ファイル名: kebab-case
- 変数・関数: camelCase
- 定数: UPPER_SNAKE_CASE

## プロジェクト構造
```
src/
├── components/
│   ├── ui/           # 基本UIコンポーネント
│   ├── features/     # 機能コンポーネント
│   └── layout/       # レイアウトコンポーネント
├── hooks/           # カスタムフック
├── stores/          # Zustandストア
├── types/           # TypeScript型
├── utils/           # ユーティリティ
└── constants/       # 定数
```

## API設計
- RESTful APIを想定
- React Queryでデータフェッチ
- 楽観的更新を実装
- エラーハンドリングは例外境界で

## データモデル
### Task
```typescript
interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assigneeId?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

## 開発ワークフロー
1. 機能ブランチの作成: feature/xxx
2. コミットメッセージ: conventional commits
3. プルリクエストでのコードレビュー
4. CI/CDでの自動テスト
5. mainブランチへのマージ

## 環境設定
- Node.js 18.0+
- npm 9.0+
- ブラウザ: Chrome 90+ / Firefox 88+ / Safari 14+

## デプロイ
- Vercelでのデプロイを想定
- 環境変数はVercelの環境変数で管理
- 本番ビルド: `npm run build`
```

2. ファイルの保存

作成したCLAUDE.mdをプロジェクトルートに保存します。

_コマンド実行_
```bash
# プロジェクトルートに移動
cd ~/Desktop/claude-tutorial

# CLAUDE.mdファイルの作成
cat > CLAUDE.md << 'EOF'
# タスク管理アプリケーション

## 概要
このプロジェクトは、個人およびチーム向けのタスク管理アプリケーションを開発するものです。主な機能としてタスクの作成、編集、削除、状態管理、担当者割り当てを実装します。

## 技術スタック
- React 18.2.0 + TypeScript 5.0.4
- Vite 4.4.5
- Tailwind CSS 3.3.3
- React Router 6.14.2
- Zustand 4.4.1
- React Hook Form 7.45.2

[残りの内容...]
EOF
```

:::

## CLAUDE.mdの活用方法

### コード生成時の活用

:::step

1. CLAUDE.mdを活用したコード生成

CLAUDE.mdが設定された状態でコード生成を試します。

_コマンド実行_
```bash
claude "タスク一覧表示用のコンポーネントを生成してください"
```

2. 生成結果の確認

CLAUDE.mdの設定に基づいたコードが生成されることを確認します。

_期待される出力例_
```typescript
// src/components/features/TaskList.tsx
import React from 'react';
import { useTaskStore } from '@/stores/taskStore';
import { Task } from '@/types/task';

interface TaskListProps {
  tasks: Task[];
}

export const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  // CLAUDE.mdに基づいた実装
  return (
    <div className="space-y-4">
      {/* タスクリストの実装 */}
    </div>
  );
};
```

:::

### リファクタリング時の活用

:::step

1. リファクタリングの依頼

CLAUDE.mdのルールに基づいたリファクタリングを依頼します。

_コマンド実行_
```bash
claude "現在のタスク管理コンポーネントをCLAUDE.mdの命名規則に従ってリファクタリングしてください"
```

2. 変更内容の確認

ルールに基づいた変更が適用されることを確認します。

:::

## 高度な設定テクニック

### 条件分岐の設定

プロジェクトの状態によって動作を変化させる設定：

```markdown
## 開発フェーズ
- 現在のフェーズ: development
- 次のフェーズ: testing
- 機能追加: 可能
- バグ修正のみ: false

## チーム情報
- チームサイズ: 5人
- 開発経験: 中級者以上
- 使用しているIDE: VS Code
- コードレビュー: 必須
```

### 環境別の設定

開発環境と本番環境で異なる設定：

```markdown
## 開発環境
- ログレベル: debug
- ホットリロード: 有効
- ソースマップ: 有効

## 本番環境
- ログレベル: error
- ホットリロード: 無効
- ソースマップ: 無効
- 圧縮: 有効
```

### 外部ファイルの参照

設定ファイルの外部化：

```markdown
## 設定ファイル
- ESLint設定: .eslintrc.js
- Prettier設定: .prettierrc
- TypeScript設定: tsconfig.json
- 環境変数: .env.example

## 参照ドキュメント
- アーキテクチャ設計: docs/architecture.md
- API仕様: docs/api-spec.md
- コーディング規約: docs/coding-standards.md
```

## メンテナンスと更新

### 定期的な更新

プロジェクトの進展に合わせてCLAUDE.mdを更新：

:::tip 更新のタイミング

- 新しい技術スタックの追加時
- 開発ルールの変更時
- チームメンバーの追加時
- プロジェクトフェーズの移行時

:::

### バージョン管理

CLAUDE.mdの変更履歴を管理：

```markdown
## 更新履歴
### v1.2.0 (2023-07-15)
- テストフレームワークをJestに変更
- コードカバレッジ目標を追加

### v1.1.0 (2023-07-01)
- Zustandをステート管理ライブラリに追加
- API設計ガイドラインを更新

### v1.0.0 (2023-06-15)
- 初版作成
```

## ベストプラクティス

### 効果的な記述のコツ

1. **具体的に記述**: 抽象的な表現を避け、具体的なルールを記述
2. **一貫性を保つ**: 全体で一貫した表現と構造を維持
3. **過剰な設定を避ける**: 必要最小限の設定に留める
4. **更新を容易に**: セクション分けを明確にし、更新しやすい構造に

### よくある間違い

:::warning 避けるべき間違い

- **情報が古い**: プロジェクトの現状と合わない情報
- **矛盾した設定**: 異なるセクションでの矛盾
- **過剰な詳細**: 必要以上に詳細な設定
- **曖昧な表現**: 解釈が分かれる表現

:::

## 次のステップ

CLAUDE.mdの設定が完了したら、次のステップに進みましょう。

1. [高度な機能の学習](../../advanced-features/advanced-features.md)
2. [実践的なプロジェクトの作成](../../practical-projects/practical-projects.md)
3. [プロンプトエンジニアリング](../../prompt-engineering/prompt-engineering.md)

---

## まとめ

:::note 要点のまとめ

- CLAUDE.mdはプロジェクトの「羅針盤」となる重要な設定ファイル
- プロジェクト概要、技術スタック、開発ルールを明確に記述
- 適切な設定によりAIの開発支援精度が劇的に向上
- 定期的な更新とメンテナンスが重要
- チーム全体での共有と理解が効果を最大化

:::

## 関連記事

[高度な機能](../../advanced-features/advanced-features.md)
[プロンプトエンジニアリング](../../prompt-engineering/prompt-engineering.md)
[実践的なプロジェクト](../../practical-projects/practical-projects.md)
[プロジェクト管理ベストプラクティス](../../practical-projects/project-management.md)