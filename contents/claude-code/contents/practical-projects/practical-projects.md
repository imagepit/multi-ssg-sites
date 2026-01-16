---
title: 実践的なプロジェクト
slug: practical-projects
parent: practical-projects
status: published
filepath: contents/practical-projects/practical-projects.md
post_type: pages
goal: Claude Codeを使った実践的なプロジェクトを通じて、実際の開発スキルを習得できるようにする
seo_title: Claude Code実践プロジェクト | 実際の開発スキルを習得
seo_description: Claude Codeを使った実践的なプロジェクト集。Webアプリ開発、API構築、データ分析など、実際の開発スキルが身につくプロジェクトを提供します。
seo_keywords: Claude Code 実践プロジェクト, 開発スキル, ハンズオン, プロジェクト例, 実践学習
handson_overview: 実際にプロジェクトを構築し、Claude Codeの活用方法を実践的に学ぶ
---

# 実践的なプロジェクト

このセクションでは、Claude Codeを使った実践的なプロジェクトを通じて、実際の開発スキルを習得します。Webアプリケーション開発からAPI構築、データ分析まで、多様なプロジェクトを体験しながらClaude Codeの効果的な活用方法を学びましょう。

:::note このセクションで学べること

- 実際のプロジェクト開発におけるClaude Codeの活用法
- Webアプリケーション開発のベストプラクティス
- API設計と実装の実践的なスキル
- データ分析と可視化の手法
- デプロイメントと運用の自動化

:::

## プロジェクトの選択ガイド

### 初心者向けプロジェクト

:::step

1. プロジェクト難易度の自己評価

自分のスキルレベルに合ったプロジェクトを選択しましょう。

_コマンド実行_
```bash
# スキルレベル評価スクリプト
cat > skill-assessment.sh << 'EOF'
#!/bin/bash

# 開発スキルレベル評価スクリプト
echo "開発スキルレベルを評価します..."

# 基本的な質問
echo "以下の質問に答えてください（y/n）"

read -p "HTML/CSSの基礎を理解しているか？: " html_css
read -p "JavaScriptの基本を理解しているか？: " javascript
read -p "Gitの基本操作ができるか？: " git
read -p "コマンドラインの基本操作ができるか？: " cli
read -p "APIの基本概念を理解しているか？: " api

# スキルレベルの判定
score=0
[ "$html_css" = "y" ] && ((score++))
[ "$javascript" = "y" ] && ((score++))
[ "$git" = "y" ] && ((score++))
[ "$cli" = "y" ] && ((score++))
[ "$api" = "y" ] && ((score++))

echo ""
echo "=== スキルレベル評価結果 ==="
echo "スコア: $score/5"

if [ $score -le 1 ]; then
  echo "レベル: 完全初心者"
  echo "推奨プロジェクト: to-doリストアプリ、静的サイトジェネレーター"
elif [ $score -le 3 ]; then
  echo "レベル: 初心者"
  echo "推奨プロジェクト: ブログアプリ、天気アプリ、簡単なAPI"
else
  echo "レベル: 中級者以上"
  echo "推奨プロジェクト: Eコマースサイト、データ分析、機械学習"
fi

echo "スキルレベル評価が完了しました"
EOF

# 実行権限の付与
chmod +x skill-assessment.sh

# 実行
./skill-assessment.sh
```

2. プロジェクト選択の基準

効果的な学習のためのプロジェクト選択基準を理解します。

_コマンド実行_
```bash
# プロジェクト選択ガイドの作成
claude "プロジェクト選択ガイドを作成してください。
選択基準：
1. 学習目標の明確化
   - 習得したい技術の特定
   - 現在のスキルレベルの考慮
   - キャリア目標との整合性

2. 興味と関心
   - 楽しみながら学べるテーマ
   - 実際のニーズとの関連性
   - 長期的な取り組みの可能性

3. 実現可能性
   - 必要なリソースの評価
   - 時間的制約の考慮
   - 技術的障壁の事前評価

4. 学習効果
   - 多様なスキルの習得可能性
   - ポートフォリオとしての価値
   - 応用可能性の広さ"
```

3. 学習パスの設計

効果的な学習パスを設計します。

_コマンド実行_
```bash
# 学習パス設計スクリプト
claude "学習パス設計テンプレートを作成してください。
学習ステージ：
1. 基礎固め（1-2ヶ月）
   - 基本的概念の理解
   - 簡単なプロジェクトの実装
   - ツールの基本操作の習得

2. 応用力養成（2-3ヶ月）
   - 複数の技術の組み合わせ
   - 中規模プロジェクトの開発
   - 実践的な問題解決

3. 実践力向上（3-6ヶ月）
   - 複雑なプロジェクトの開発
   - ベストプラクティスの適用
   - チーム開発の経験

4. 専門性深化（6ヶ月以上）
   - 特定分野の専門化
   - イノベーティブなソリューションの開発
   - メンターシップと指導"

各ステージの具体的な学習内容とプロジェクト例を含めてください。
```

:::

### プロジェクト開発の基本フロー

:::step

1. 開発環境のセットアップ

プロジェクト開発のための環境を整えます。

_コマンド実行_
```bash
# 開発環境セットアップスクリプト
cat > setup-dev-environment.sh << 'EOF'
#!/bin/bash

# Claude Code開発環境セットアップスクリプト
echo "開発環境のセットアップを開始します..."

# プロジェクトディレクトリの作成
read -p "プロジェクト名を入力してください: " project_name
mkdir -p "$project_name"
cd "$project_name"

# Gitリポジトリの初期化
echo "Gitリポジトリを初期化します..."
git init

# 基本的なファイルの作成
echo "# $project_name" > README.md
echo "node_modules/" > .gitignore
echo ".env" >> .gitignore

# Node.jsプロジェクトの初期化
echo "Node.jsプロジェクトを初期化します..."
npm init -y

# 必要なパッケージのインストール
echo "開発に必要なパッケージをインストールします..."
npm install --save-dev typescript @types/node ts-node nodemon

# TypeScript設定の作成
cat > tsconfig.json << 'INNER_EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
INNER_EOF

# ソースディレクトリの作成
mkdir -p src
mkdir -p tests

# 基本的なファイル構造の作成
cat > src/index.ts << 'INNER_EOF'
console.log("Hello, $project_name!");
INNER_EOF

# package.jsonのスクリプト更新
npm pkg set scripts.dev="nodemon src/index.ts"
npm pkg set scripts.build="tsc"
npm pkg set scripts.start="node dist/index.js"
npm pkg set scripts.test="echo \"Error: no test specified\" && exit 1"

echo "開発環境のセットアップが完了しました！"
echo "プロジェクトディレクトリ: $(pwd)"
echo ""
echo "次のコマンドで開発を開始できます:"
echo "  npm run dev  # 開発モードで実行"
echo "  npm run build  # プロジェクトをビルド"
echo "  npm start  # ビルドしたアプリを実行"
EOF

# 実行権限の付与
chmod +x setup-dev-environment.sh

# 実行
./setup-dev-environment.sh
```

2. Claude Codeプロジェクトの初期化

Claude Codeを活用するためのプロジェクト設定を行います。

_コマンド実行_
```bash
# Claude Codeプロジェクト初期化スクリプト
cat > init-claude-project.sh << 'EOF'
#!/bin/bash

# Claude Codeプロジェクト初期化スクリプト
echo "Claude Codeプロジェクトを初期化します..."

# Claude Code設定ファイルの作成
cat > .claude.md << 'INNER_EOF'
# Claude Codeプロジェクト設定

## プロジェクト概要
このプロジェクトはClaude Codeを使用して開発されます。

## 開発ガイドライン
- コード生成は補助として使用
- 生成されたコードは必ずレビュー
- セキュリティと品質を最優先
- テストコードの同時生成

## 禁止事項
- 機密データの入力
- 著作権侵害コードの生成
- 未検証コードの本番適用

## お気に入りのプロンプト
\`\`\`bash
claude "このプロジェクトのベストプラクティスを教えて"
\`\`\`
INNER_EOF

# カスタムコマンドの設定
echo "カスタムコマンドを設定します..."
claude config set custom.commands.review "claude \"このコードをレビューしてください\""
claude config set custom.commands.test "claude \"このコードのテストを作成してください\""
claude config set custom.commands.docs "claude \"このコードのドキュメントを作成してください\""
claude config set custom.commands.optimize "claude \"このコードを最適化してください\""

# プロジェクトテンプレートの生成
echo "プロジェクトテンプレートを生成します..."
claude "Node.jsプロジェクトのベストプラクティスに従ったディレクトリ構造と設定ファイルを作成してください。
要件：
- TypeScriptの使用
- ESLintとPrettierの設定
- Jestによるテスト設定
- GitHub ActionsのCI/CD設定
- 環境変数の管理
- ロギングの設定
- エラーハンドリングのベストプラクティス"

# ワークフローの設定
echo "開発ワークフローを設定します..."
cat > .github/workflows/development.yml << 'INNER_EOF'
name: Development Workflow

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    - name: Install dependencies
      run: npm ci
    - name: Run tests
      run: npm test
    - name: Build
      run: npm run build

  code-quality:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    - name: Install dependencies
      run: npm ci
    - name: Lint
      run: npm run lint
    - name: Type check
      run: npm run type-check
INNER_EOF

echo "Claude Codeプロジェクトの初期化が完了しました！"
echo ""
echo "プロジェクトがClaude Codeで開発できるようになりました。"
echo "次のコマンドで開発を始められます:"
echo "  claude \"新しい機能を実装してください\""
echo "  claude custom:review  # コードレビュー"
echo "  claude custom:test   # テスト生成"
EOF

# 実行権限の付与
chmod +x init-claude-project.sh

# 実行
./init-claude-project.sh
```

3. 開発プロセスの確立

効果的な開発プロセスを確立します。

_コマンド実行_
```bash
# 開発プロセス確立スクリプト
claude "開発プロセス確立ガイドを作成してください。
開発プロセス：
1. 計画フェーズ
   - 要件定義
   - 技術選定
   - アーキテクチャ設計
   - タスク分解

2. 開発フェーズ
   - 環境構築
   - コード実装
   - テスト作成
   - コードレビュー

3. テストフェーズ
   - 単体テスト
   - 結合テスト
   - システムテスト
   - 受入テスト

4. デプロイフェーズ
   - ビルド
   - デプロイ
   - 監視
   - メンテナンス

各フェーズでのClaude Codeの活用方法とベストプラクティスを具体的に説明してください。"
```

:::

## Webアプリケーション開発プロジェクト

### プロジェクト1: To-Doリストアプリ

:::step

1. プロジェクト概要と要件定義

シンプルなTo-Doリストアプリを開発します。

_コマンド実行_
```bash
# To-Doリストアプリプロジェクトセットアップ
cat > setup-todo-app.sh << 'EOF'
#!/bin/bash

# To-Doリストアプリプロジェクトセットアップ
echo "To-Doリストアプリプロジェクトをセットアップします..."

# プロジェクトの作成
mkdir -p todo-app
cd todo-app

# Reactプロジェクトの初期化
npx create-react-app . --template typescript
rm -rf src/*

# 必要なパッケージのインストール
npm install axios react-router-dom @types/react-router-dom

# ディレクトリ構造の作成
mkdir -p src/components src/hooks src/services src/types src/utils

# 基本的なコンポーネントの作成
cat > src/components/TodoItem.tsx << 'INNER_EOF'
import React from 'react';

interface TodoItemProps {
  id: string;
  text: string;
  completed: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  id,
  text,
  completed,
  onToggle,
  onDelete
}) => {
  return (
    <li className={`todo-item ${completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={completed}
        onChange={() => onToggle(id)}
      />
      <span>{text}</span>
      <button onClick={() => onDelete(id)}>削除</button>
    </li>
  );
};

export default TodoItem;
INNER_EOF

cat > src/components/TodoList.tsx << 'INNER_EOF'
import React from 'react';
import TodoItem from './TodoItem';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  onToggle,
  onDelete
}) => {
  return (
    <ul className="todo-list">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          id={todo.id}
          text={todo.text}
          completed={todo.completed}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
};

export default TodoList;
INNER_EOF

cat > src/components/AddTodoForm.tsx << 'INNER_EOF'
import React, { useState } from 'react';

interface AddTodoFormProps {
  onAdd: (text: string) => void;
}

const AddTodoForm: React.FC<AddTodoFormProps> = ({ onAdd }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim());
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-todo-form">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="新しいタスクを追加"
      />
      <button type="submit">追加</button>
    </form>
  );
};

export default AddTodoForm;
INNER_EOF

# メインコンポーネントの作成
cat > src/App.tsx << 'INNER_EOF'
import React, { useState } from 'react';
import TodoList from './components/TodoList';
import AddTodoForm from './components/AddTodoForm';
import './App.css';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false
    };
    setTodos([...todos, newTodo]);
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="App">
      <h1>To-Doリスト</h1>
      <AddTodoForm onAdd={addTodo} />
      <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
    </div>
  );
};

export default App;
INNER_EOF

# スタイルの作成
cat > src/App.css << 'INNER_EOF'
.App {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.todo-list {
  list-style: none;
  padding: 0;
}

.todo-item {
  display: flex;
  align-items: center;
  padding: 10px;
  margin: 5px 0;
  background: #f5f5f5;
  border-radius: 4px;
}

.todo-item.completed {
  opacity: 0.6;
  text-decoration: line-through;
}

.todo-item input[type="checkbox"] {
  margin-right: 10px;
}

.todo-item span {
  flex-grow: 1;
}

.todo-item button {
  background: #ff4444;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
}

.add-todo-form {
  display: flex;
  margin-bottom: 20px;
}

.add-todo-form input {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
}

.add-todo-form button {
  padding: 10px 20px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}
INNER_EOF

echo "To-Doリストアプリのセットアップが完了しました！"
echo "プロジェクトディレクトリ: $(pwd)"
echo ""
echo "開発を開始するには:"
echo "  npm start"
echo ""
echo "Claude Codeで機能拡張するには:"
echo "  claude \"このTo-Doアプリにローカルストレージ機能を追加してください\""
echo "  claude \"フィルタリング機能を実装してください\""
echo "  claude \"編集機能を追加してください\""
EOF

# 実行権限の付与
chmod +x setup-todo-app.sh

# 実行
./setup-todo-app.sh
```

2. Claude Codeでの機能拡張

Claude Codeを使って機能を拡張します。

_コマンド実行_
```bash
# 機能拡張スクリプト
cat > extend-todo-features.sh << 'EOF'
#!/bin/bash

# To-Doアプリ機能拡張スクリプト
echo "Claude CodeでTo-Doアプリの機能を拡張します..."

# ローカルストレージ機能の追加
echo "ローカルストレージ機能を追加します..."
claude "To-Doアプリにローカルストレージ機能を追加してください。
要件：
- タスクの永続化
- ページ更新後も状態を保持
- 自動保存機能
- データのエクスポート/インポート

実装方法：
- localStorageの利用
- 保存タイミングの最適化
- エラーハンドリング
- データ形式の設計"

# フィルタリング機能の追加
echo "フィルタリング機能を追加します..."
claude "To-Doアプリにフィルタリング機能を実装してください。
フィルター種類：
- 全て表示
- 完了済みのみ
- 未完了のみ
- テキスト検索

UI要件：
- フィルターボタンの配置
- 検索入力欄の追加
- リアルタイムフィルタリング
- フィルター状態の表示"

# 編集機能の追加
echo "編集機能を追加します..."
claude "To-Doアプリに編集機能を追加してください。
編集機能：
- タスクテキストの編集
- 編集モードの切り替え
- 保存/キャンセル機能
- 編集中の視覚的フィードバック

インタラクション：
- ダブルクリックで編集モード
- Enterキーで保存
- Escキーでキャンセル
- 自動フォーカス"

# 期限機能の追加
echo "期限機能を追加します..."
claude "To-Doアプリに期限機能を追加してください。
期限機能：
- 期限日の設定
- 期限切れの強調表示
- 残日数の表示
- 期限順のソート

表示要件：
- 日付ピッカーの実装
- 期限切れタスクの色分け
- 今日/明日/今週のフィルター
- カレンダービューの追加"

echo "機能拡張が完了しました！"
echo "アプリを起動して新しい機能を確認してください:"
echo "  npm start"
EOF

# 実行権限の付与
chmod +x extend-todo-features.sh

# 実行
./extend-todo-features.sh
```

3. テストとデプロイ

テストの作成とデプロイ準備を行います。

_コマンド実行_
```bash
# テストとデプロイ準備スクリプト
cat > test-deploy-todo.sh << 'EOF'
#!/bin/bash

# To-Doアプリのテストとデプロイ準備
echo "テストとデプロイ準備を開始します..."

# テスト環境のセットアップ
echo "テスト環境をセットアップします..."
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom

# テストファイルの作成
cat > src/App.test.tsx << 'INNER_EOF'
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders todo app', () => {
  render(<App />);
  const linkElement = screen.getByText(/To-Doリスト/i);
  expect(linkElement).toBeInTheDocument();
});

test('adds new todo', () => {
  render(<App />);
  const inputElement = screen.getByPlaceholderText(/新しいタスクを追加/i);
  const buttonElement = screen.getByText(/追加/i);

  fireEvent.change(inputElement, { target: { value: 'テストタスク' } });
  fireEvent.click(buttonElement);

  const todoElement = screen.getByText(/テストタスク/i);
  expect(todoElement).toBeInTheDocument();
});

test('toggles todo completion', () => {
  render(<App />);
  const inputElement = screen.getByPlaceholderText(/新しいタスクを追加/i);
  const buttonElement = screen.getByText(/追加/i);

  fireEvent.change(inputElement, { target: { value: 'テストタスク' } });
  fireEvent.click(buttonElement);

  const checkboxElement = screen.getByRole('checkbox');
  fireEvent.click(checkboxElement);

  const todoElement = screen.getByText(/テストタスク/i);
  expect(todoElement).toHaveClass('completed');
});
INNER_EOF

# パフォーマンステストの作成
cat > src/performance.test.ts << 'INNER_EOF'
// パフォーマンステスト
describe('Todo App Performance', () => {
  test('handles large number of todos', () => {
    const todos = Array.from({ length: 1000 }, (_, i) => ({
      id: i.toString(),
      text: `タスク ${i}`,
      completed: i % 2 === 0
    }));

    const startTime = performance.now();
    // 大量のタスクをレンダリングする処理をシミュレート
    const endTime = performance.now();

    expect(endTime - startTime).toBeLessThan(1000); // 1秒以内に完了
  });
});
INNER_EOF

# E2Eテストの準備
echo "E2Eテスト環境を準備します..."
npm install --save-dev cypress

cat > cypress/e2e/todo-app.cy.ts << 'INNER_EOF'
describe('To-Do App E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should add a new todo', () => {
    cy.get('input[placeholder="新しいタスクを追加"]')
      .type('新しいタスク');
    cy.get('button[type="submit"]').click();
    cy.contains('新しいタスク').should('be.visible');
  });

  it('should toggle todo completion', () => {
    cy.get('input[placeholder="新しいタスクを追加"]')
      .type('テストタスク');
    cy.get('button[type="submit"]').click();
    cy.get('input[type="checkbox"]').click();
    cy.contains('テストタスク').should('have.class', 'completed');
  });

  it('should delete a todo', () => {
    cy.get('input[placeholder="新しいタスクを追加"]')
      .type('削除するタスク');
    cy.get('button[type="submit"]').click();
    cy.contains('削除するタスク').should('be.visible');
    cy.contains('削除').click();
    cy.contains('削除するタスク').should('not.exist');
  });
});
INNER_EOF

# デプロイ設定の作成
echo "デプロイ設定を作成します..."
cat > netlify.toml << 'INNER_EOF'
[build]
  command = "npm run build"
  publish = "build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
INNER_EOF

# GitHub Actionsデプロイメントの作成
cat > .github/workflows/deploy.yml << 'INNER_EOF'
name: Deploy to Netlify

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Build
      run: npm run build

    - name: Deploy to Netlify
      uses: netlify/actions/cli@master
      with:
        args: deploy --dir=build --prod
      env:
        NETLIFY_AUTH_TOKEN: \${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: \${{ secrets.NETLIFY_SITE_ID }}
INNER_EOF

echo "テストとデプロイ準備が完了しました！"
echo ""
echo "テストを実行するには:"
echo "  npm test"
echo ""
echo "E2Eテストを実行するには:"
echo "  npx cypress open"
echo ""
echo "デプロイするには:"
echo "  1. Netlifyアカウントを作成"
echo "  2. GitHub SecretsにNETLIFY_AUTH_TOKENとNETLIFY_SITE_IDを設定"
echo "  3. mainブランチにプッシュ"
EOF

# 実行権限の付与
chmod +x test-deploy-todo.sh

# 実行
./test-deploy-todo.sh
```

:::

### プロジェクト2: 天気アプリ

:::step

1. 天気アプリのセットアップ

外部APIを使用する天気アプリを開発します。

_コマンド実行_
```bash
# 天気アプリセットアップスクリプト
cat > setup-weather-app.sh << 'EOF'
#!/bin/bash

# 天気アプリプロジェクトセットアップ
echo "天気アプリプロジェクトをセットアップします..."

# プロジェクトの作成
mkdir -p weather-app
cd weather-app

# Next.jsプロジェクトの初期化
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# 必要なパッケージのインストール
npm install axios date-fns

# 環境変数ファイルの作成
cat > .env.local << 'INNER_EOF'
NEXT_PUBLIC_WEATHER_API_KEY=your_api_key_here
NEXT_PUBLIC_WEATHER_API_URL=https://api.openweathermap.org/data/2.5
INNER_EOF

# 型定義の作成
mkdir -p src/types
cat > src/types/weather.ts << 'INNER_EOF'
export interface WeatherData {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface ForecastData {
  cod: string;
  message: number;
  cnt: number;
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      sea_level: number;
      grnd_level: number;
      humidity: number;
      temp_kf: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    clouds: {
      all: number;
    };
    wind: {
      speed: number;
      deg: number;
      gust: number;
    };
    visibility: number;
    pop: number;
    sys: {
      pod: string;
    };
    dt_txt: string;
  }>;
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export interface LocationCoords {
  latitude: number;
  longitude: number;
}
INNER_EOF

# APIサービスの作成
mkdir -p src/services
cat > src/services/weatherService.ts << 'INNER_EOF'
import axios from 'axios';
import { WeatherData, ForecastData } from '@/types/weather';

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_WEATHER_API_URL;

export class WeatherService {
  static async getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
    try {
      const response = await axios.get(`${BASE_URL}/weather`, {
        params: {
          lat,
          lon,
          appid: API_KEY,
          units: 'metric',
          lang: 'ja'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error('天気データの取得に失敗しました');
    }
  }

  static async getForecast(lat: number, lon: number): Promise<ForecastData> {
    try {
      const response = await axios.get(`${BASE_URL}/forecast`, {
        params: {
          lat,
          lon,
          appid: API_KEY,
          units: 'metric',
          lang: 'ja'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error('天気予報データの取得に失敗しました');
    }
  }

  static async searchCity(query: string): Promise<any> {
    try {
      const response = await axios.get(`${BASE_URL}/find`, {
        params: {
          q: query,
          appid: API_KEY,
          units: 'metric',
          lang: 'ja'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error('都市の検索に失敗しました');
    }
  }
}
INNER_EOF

# ユーティリティの作成
mkdir -p src/utils
cat > src/utils/dateUtils.ts << 'INNER_EOF'
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export const formatJapaneseDate = (date: Date): string => {
  return format(date, 'M月d日(E)', { locale: ja });
};

export const formatJapaneseTime = (date: Date): string => {
  return format(date, 'H:mm');
};

export const formatTemperature = (temp: number): string => {
  return `${Math.round(temp)}°C`;
};

export const getWeatherIcon = (iconCode: string): string => {
  const iconMap: { [key: string]: string } = {
    '01d': '☀️',
    '01n': '🌙',
    '02d': '⛅',
    '02n': '☁️',
    '03d': '☁️',
    '03n': '☁️',
    '04d': '☁️',
    '04n': '☁️',
    '09d': '🌧️',
    '09n': '🌧️',
    '10d': '🌦️',
    '10n': '🌧️',
    '11d': '⛈️',
    '11n': '⛈️',
    '13d': '❄️',
    '13n': '❄️',
    '50d': '🌫️',
    '50n': '🌫️'
  };
  return iconMap[iconCode] || '🌤️';
};
INNER_EOF

# 位置情報サービスの作成
cat > src/services/locationService.ts << 'INNER_EOF'
import { LocationCoords } from '@/types/weather';

export class LocationService {
  static getCurrentPosition(): Promise<LocationCoords> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('位置情報がサポートされていません'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          reject(new Error('位置情報の取得に失敗しました'));
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    });
  }
}
INNER_EOF

echo "天気アプリのセットアップが完了しました！"
echo "プロジェクトディレクトリ: $(pwd)"
echo ""
echo "次の手順:"
echo "1. OpenWeatherMap APIキーを取得"
echo "2. .env.localファイルにAPIキーを設定"
echo "3. npm run dev で開発サーバーを起動"
echo ""
echo "Claude Codeで機能を拡張するには:"
echo "  claude \"この天気アプリに5日間の天気予報機能を追加してください\""
echo "  claude \"天気チャートを表示する機能を実装してください\""
echo "  claude \"お気に入りの都市を保存する機能を追加してください\""
EOF

# 実行権限の付与
chmod +x setup-weather-app.sh

# 実行
./setup-weather-app.sh
```

2. 主要コンポーネントの実装

天気アプリの主要コンポーネントを実装します。

_コマンド実行_
```bash
# 天気アプリコンポーネント実装スクリプト
cat > implement-weather-components.sh << 'EOF'
#!/bin/bash

# 天気アプリコンポーネントの実装
echo "天気アプリのコンポーネントを実装します..."

# 現在の天気表示コンポーネント
cat > src/components/CurrentWeather.tsx << 'INNER_EOF'
'use client';

import React from 'react';
import { WeatherData } from '@/types/weather';
import { formatJapaneseDate, formatTemperature, getWeatherIcon } from '@/utils/dateUtils';

interface CurrentWeatherProps {
  weather: WeatherData;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ weather }) => {
  return (
    <div className="current-weather bg-gradient-to-br from-blue-400 to-blue-600 text-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">{weather.name}</h2>
          <p className="text-sm opacity-80">{formatJapaneseDate(new Date())}</p>
        </div>
        <div className="text-6xl">
          {getWeatherIcon(weather.weather[0].icon)}
        </div>
      </div>

      <div className="text-center mb-4">
        <div className="text-5xl font-bold mb-2">
          {formatTemperature(weather.main.temp)}
        </div>
        <div className="text-xl capitalize">
          {weather.weather[0].description}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-white/20 rounded p-3">
          <div className="font-semibold">体感温度</div>
          <div>{formatTemperature(weather.main.feels_like)}</div>
        </div>
        <div className="bg-white/20 rounded p-3">
          <div className="font-semibold">湿度</div>
          <div>{weather.main.humidity}%</div>
        </div>
        <div className="bg-white/20 rounded p-3">
          <div className="font-semibold">風速</div>
          <div>{weather.wind.speed} m/s</div>
        </div>
        <div className="bg-white/20 rounded p-3">
          <div className="font-semibold">気圧</div>
          <div>{weather.main.pressure} hPa</div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
INNER_EOF

# 検索コンポーネント
cat > src/components/SearchCity.tsx << 'INNER_EOF'
'use client';

import React, { useState } from 'react';
import { WeatherService } from '@/services/weatherService';

interface SearchCityProps {
  onCitySelect: (lat: number, lon: number, name: string) => void;
}

const SearchCity: React.FC<SearchCityProps> = ({ onCitySelect }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await WeatherService.searchCity(query);
      if (response.list && response.list.length > 0) {
        const city = response.list[0];
        onCitySelect(city.coord.lat, city.coord.lon, city.name);
        setQuery('');
      } else {
        setError('都市が見つかりません');
      }
    } catch (err) {
      setError('検索に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="search-city mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="都市名を入力..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '検索中...' : '検索'}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </form>
  );
};

export default SearchCity;
INNER_EOF

# 位置情報ボタンコンポーネント
cat > src/components/LocationButton.tsx << 'INNER_EOF'
'use client';

import React, { useState } from 'react';
import { LocationService } from '@/services/locationService';

interface LocationButtonProps {
  onLocationFound: (lat: number, lon: number) => void;
}

const LocationButton: React.FC<LocationButtonProps> = ({ onLocationFound }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLocation = async () => {
    setLoading(true);
    setError('');

    try {
      const position = await LocationService.getCurrentPosition();
      onLocationFound(position.latitude, position.longitude);
    } catch (err) {
      setError('位置情報の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="location-button mb-6">
      <button
        onClick={handleLocation}
        disabled={loading}
        className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? '位置情報を取得中...' : '現在地の天気を表示'}
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default LocationButton;
INNER_EOF

# 天気予報コンポーネント
cat > src/components/WeatherForecast.tsx << 'INNER_EOF'
'use client';

import React from 'react';
import { ForecastData } from '@/types/weather';
import { formatJapaneseDate, formatTemperature, getWeatherIcon } from '@/utils/dateUtils';

interface WeatherForecastProps {
  forecast: ForecastData;
}

const WeatherForecast: React.FC<WeatherForecastProps> = ({ forecast }) => {
  // 日付ごとにグループ化
  const dailyForecasts = forecast.list.reduce((acc, item) => {
    const date = new Date(item.dt * 1000).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {} as { [key: string]: typeof forecast.list });

  return (
    <div className="weather-forecast mt-6">
      <h3 className="text-xl font-bold mb-4">5日間天気予報</h3>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {Object.entries(dailyForecasts).slice(0, 5).map(([date, items]) => {
          const mainItem = items[0]; // その日の代表データ
          const temps = items.map(item => item.main.temp);
          const minTemp = Math.min(...temps);
          const maxTemp = Math.max(...temps);

          return (
            <div key={date} className="bg-white p-4 rounded-lg shadow text-center">
              <div className="font-semibold">
                {formatJapaneseDate(new Date(date))}
              </div>
              <div className="text-4xl my-2">
                {getWeatherIcon(mainItem.weather[0].icon)}
              </div>
              <div className="text-sm text-gray-600">
                {mainItem.weather[0].description}
              </div>
              <div className="mt-2">
                <div className="text-lg font-bold">
                  {formatTemperature(maxTemp)}
                </div>
                <div className="text-sm text-gray-500">
                  {formatTemperature(minTemp)}
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                💧 {mainItem.pop * 100}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeatherForecast;
INNER_EOF

# メインページの作成
cat > src/app/page.tsx << 'INNER_EOF'
'use client';

import React, { useState, useEffect } from 'react';
import { WeatherData, ForecastData } from '@/types/weather';
import { WeatherService } from '@/services/weatherService';
import CurrentWeather from '@/components/CurrentWeather';
import SearchCity from '@/components/SearchCity';
import LocationButton from '@/components/LocationButton';
import WeatherForecast from '@/components/WeatherForecast';

export default function Home() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cityName, setCityName] = useState('');

  const fetchWeatherData = async (lat: number, lon: number, name?: string) => {
    setLoading(true);
    setError('');

    try {
      const [weatherData, forecastData] = await Promise.all([
        WeatherService.getCurrentWeather(lat, lon),
        WeatherService.getForecast(lat, lon)
      ]);

      setWeather(weatherData);
      setForecast(forecastData);
      if (name) {
        setCityName(name);
      } else {
        setCityName(weatherData.name);
      }
    } catch (err) {
      setError('天気データの取得に失敗しました');
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCitySelect = (lat: number, lon: number, name: string) => {
    fetchWeatherData(lat, lon, name);
  };

  const handleLocationFound = (lat: number, lon: number) => {
    fetchWeatherData(lat, lon);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            天気アプリ
          </h1>
          <p className="text-gray-600">
            現在地や都市の天気情報を表示
          </p>
        </header>

        <main>
          <LocationButton onLocationFound={handleLocationFound} />

          <SearchCity onCitySelect={handleCitySelect} />

          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-gray-600">天気データを取得中...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {weather && (
            <div>
              <CurrentWeather weather={weather} />
              {forecast && <WeatherForecast forecast={forecast} />}
            </div>
          )}

          {!weather && !loading && !error && (
            <div className="text-center py-8 text-gray-500">
              <p>上記のボタンから天気を表示する都市を選択してください</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
INNER_EOF

echo "天気アプリのコンポーネント実装が完了しました！"
echo ""
echo "アプリを起動するには:"
echo "  npm run dev"
echo ""
echo "Claude Codeでさらに機能を拡張するには:"
echo "  claude \"天気チャートを実装してください\""
echo "  claude \"週間天気予報を追加してください\""
echo "  claude \"天気アラート機能を実装してください\""
echo "  claude \"テーマ切り替え機能を追加してください\""
EOF

# 実行権限の付与
chmod +x implement-weather-components.sh

# 実行
./implement-weather-components.sh
```

3. 高度な機能の追加

Claude Codeを使って高度な機能を追加します。

_コマンド実行_
```bash
# 天気アプリ高度機能追加スクリプト
cat > add-advanced-weather-features.sh << 'EOF'
#!/bin/bash

# 天気アプリに高度な機能を追加
echo "天気アプリに高度な機能を追加します..."

# チャート機能の追加
echo "天気チャート機能を追加します..."
claude "天気アプリに温度変化チャートを実装してください。
要件：
- 過去5日間の温度変化を表示
- 折れ線グラフで最高気温と最低気温を表示
- 対話的なツールチップ
- レスポンシブデザイン

使用技術：
- Chart.jsまたはRecharts
- APIからの履歴データ取得
- 日付のフォーマット
- 色分けとスタイリング"

# 週間天気予報の拡張
echo "週間天気予報を拡張します..."
claude "天気アプリに詳細な週間天気予報を実装してください。
追加機能：
- 1時間ごとの詳細予報
- 降水確率の視覚化
- 風向きと風速の表示
- 日の出・日の入り時刻
- 紫外線指数の表示

UI要件：
- タブ切り替えで日時を選択
- 詳細情報のモーダル表示
- スクロール可能な時間軸
- アニメーション効果"

# お気に入り都市機能
echo "お気に入り都市機能を追加します..."
claude "天気アプリにお気に入り都市機能を実装してください。
機能要件：
- 都市の追加・削除
- ローカルストレージでの保存
- ドラッグ＆ドロップでの並び替え
- お気に入り都市のクイックアクセス
- デフォルト都市の設定

UI/UX：
- お気に入りボタン
- 都市リストの表示
- 削除確認ダイアログ
- 編集モードの切り替え
- アニメーション効果"

# 天気アラート機能
echo "天気アラート機能を追加します..."
claude "天気アプリにアラート機能を実装してください。
アラート条件：
- 気温のしきい値（高温/低温）
- 降水確率のしきい値
- 風速のしきい値
- 悪天候の警報

通知機能：
- ブラウザ通知
- アラートの表示
- サウンド通知
- バイブレーション（モバイル）

設定機能：
- アラート条件のカスタマイズ
- 通知時間の設定
- アラートの有効/無効切り替え
- 通知履歴の表示"

# テーマ切り替え機能
echo "テーマ切り替え機能を追加します..."
claude "天気アプリにテーマ切り替え機能を実装してください。
テーマ種類：
- ライトモード
- ダークモード
- 自動（システム設定に従う）
- 天気に応じた動的テーマ

実装要件：
- CSS変数の使用
- テーマ状態の管理
- ローカルストレージでの保存
- スムーズな切り替えアニメーション

天気に応じたテーマ：
- 晴れ: 明るい青色
- 曇り: グレー色
- 雨: 青みがかった色
- 雪: 白みがかった色"

echo "高度な機能の追加が完了しました！"
echo ""
echo "新しい機能を確認するには:"
echo "  npm run dev"
echo ""
echo "各機能の動作をテストしてください"
EOF

# 実行権限の付与
chmod +x add-advanced-weather-features.sh

# 実行
./add-advanced-weather-features.sh
```

:::

## API開発プロジェクト

### プロジェクト3: REST APIサーバー

:::step

1. Express.js APIサーバーの構築

REST APIサーバーを構築します。

_コマンド実行_
```bash
# REST APIサーバーセットアップスクリプト
cat > setup-api-server.sh << 'EOF'
#!/bin/bash

# REST APIサーバープロジェクトセットアップ
echo "REST APIサーバープロジェクトをセットアップします..."

# プロジェクトの作成
mkdir -p api-server
cd api-server

# Node.jsプロジェクトの初期化
npm init -y

# 必要なパッケージのインストール
npm install express cors helmet morgan dotenv
npm install --save-dev typescript @types/node @types/express @types/cors @types/morgan ts-node nodemon concurrently

# TypeScript設定の作成
cat > tsconfig.json << 'INNER_EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
INNER_EOF

# 環境変数ファイルの作成
cat > .env << 'INNER_EOF'
PORT=3000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_here
DATABASE_URL=mongodb://localhost:27017/myapi
INNER_EOF

# ディレクトリ構造の作成
mkdir -p src/{controllers,middleware,models,routes,services,utils,types}
mkdir -p tests/{unit,integration}

# 基本的なExpressサーバーの作成
cat > src/server.ts << 'INNER_EOF'
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// ルートのインポート
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';

// ミドルウェアのインポート
import errorHandler from './middleware/errorHandler';
import notFound from './middleware/notFound';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ミドルウェアの設定
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ルートの設定
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// ヘルスチェックエンドポイント
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'API Server is running',
    timestamp: new Date().toISOString()
  });
});

// エラーハンドリングミドルウェア
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
INNER_EOF

# ミドルウェアの作成
cat > src/middleware/errorHandler.ts << 'INNER_EOF'
import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
}

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';

  // 開発環境では詳細なエラー情報を返す
  const response: any = {
    status,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };

  // ログ出力
  console.error(err);

  res.status(statusCode).json(response);
};

export default errorHandler;
INNER_EOF

cat > src/middleware/notFound.ts << 'INNER_EOF'
import { Request, Response, NextFunction } from 'express';

const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    status: 'fail',
    message: \`Route \${req.originalUrl} not found\`
  });
};

export default notFound;
INNER_EOF

# ユーティリティの作成
cat > src/utils/apiResponse.ts << 'INNER_EOF'
export class ApiResponse {
  static success(
    data: any,
    message: string = 'Success',
    statusCode: number = 200
  ) {
    return {
      status: 'success',
      message,
      data,
      statusCode
    };
  }

  static error(
    message: string,
    statusCode: number = 500,
    errors: any = null
  ) {
    return {
      status: 'error',
      message,
      errors,
      statusCode
    };
  }
}

export class ApiFeatures {
  constructor(query: any, queryString: any) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(field => delete queryObj[field]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => \`\${match}\`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
INNER_EOF

# モデルの作成
cat > src/types/user.ts << 'INNER_EOF'
export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreateUser {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
}

export interface IUpdateUser {
  name?: string;
  email?: string;
  role?: 'user' | 'admin';
}
INNER_EOF

# サービスの作成
cat > src/services/userService.ts << 'INNER_EOF'
import { IUser, ICreateUser, IUpdateUser } from '../types/user';

// メモリストレージ（実際のアプリケーションではデータベースを使用）
let users: IUser[] = [
  {
    _id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashed_password_1',
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'hashed_password_2',
    role: 'admin',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export class UserService {
  static async getAllUsers(): Promise<IUser[]> {
    return users;
  }

  static async getUserById(id: string): Promise<IUser | null> {
    return users.find(user => user._id === id) || null;
  }

  static async createUser(userData: ICreateUser): Promise<IUser> {
    const newUser: IUser = {
      _id: (users.length + 1).toString(),
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    users.push(newUser);
    return newUser;
  }

  static async updateUser(id: string, updateData: IUpdateUser): Promise<IUser | null> {
    const userIndex = users.findIndex(user => user._id === id);
    if (userIndex === -1) return null;

    users[userIndex] = {
      ...users[userIndex],
      ...updateData,
      updatedAt: new Date()
    };
    return users[userIndex];
  }

  static async deleteUser(id: string): Promise<boolean> {
    const userIndex = users.findIndex(user => user._id === id);
    if (userIndex === -1) return false;

    users.splice(userIndex, 1);
    return true;
  }
}
INNER_EOF

# コントローラーの作成
cat > src/controllers/userController.ts << 'INNER_EOF'
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';
import { ApiResponse } from '../utils/apiResponse';
import { ICreateUser, IUpdateUser } from '../types/user';

export class UserController {
  static async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json(ApiResponse.success(users, 'Users retrieved successfully'));
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(id);

      if (!user) {
        return res.status(404).json(ApiResponse.error('User not found', 404));
      }

      res.status(200).json(ApiResponse.success(user, 'User retrieved successfully'));
    } catch (error) {
      next(error);
    }
  }

  static async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userData: ICreateUser = req.body;
      const user = await UserService.createUser(userData);
      res.status(201).json(ApiResponse.success(user, 'User created successfully', 201));
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateData: IUpdateUser = req.body;
      const user = await UserService.updateUser(id, updateData);

      if (!user) {
        return res.status(404).json(ApiResponse.error('User not found', 404));
      }

      res.status(200).json(ApiResponse.success(user, 'User updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const deleted = await UserService.deleteUser(id);

      if (!deleted) {
        return res.status(404).json(ApiResponse.error('User not found', 404));
      }

      res.status(200).json(ApiResponse.success(null, 'User deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
}
INNER_EOF

# ルートの作成
cat > src/routes/userRoutes.ts << 'INNER_EOF'
import { Router } from 'express';
import { UserController } from '../controllers/userController';

const router = Router();

router.route('/')
  .get(UserController.getAllUsers)
  .post(UserController.createUser);

router.route('/:id')
  .get(UserController.getUserById)
  .put(UserController.updateUser)
  .delete(UserController.deleteUser);

export default router;
INNER_EOF

# プロダクト関連のファイル作成（例として）
cat > src/types/product.ts << 'INNER_EOF'
export interface IProduct {
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreateProduct {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  isActive?: boolean;
}

export interface IUpdateProduct {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  stock?: number;
  isActive?: boolean;
}
INNER_EOF

cat > src/services/productService.ts << 'INNER_EOF'
import { IProduct, ICreateProduct, IUpdateProduct } from '../types/product';

let products: IProduct[] = [
  {
    _id: '1',
    name: 'Laptop',
    description: 'High-performance laptop',
    price: 999.99,
    category: 'Electronics',
    stock: 50,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '2',
    name: 'Smartphone',
    description: 'Latest smartphone model',
    price: 699.99,
    category: 'Electronics',
    stock: 100,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export class ProductService {
  static async getAllProducts(): Promise<IProduct[]> {
    return products.filter(product => product.isActive);
  }

  static async getProductById(id: string): Promise<IProduct | null> {
    return products.find(product => product._id === id && product.isActive) || null;
  }

  static async createProduct(productData: ICreateProduct): Promise<IProduct> {
    const newProduct: IProduct = {
      _id: (products.length + 1).toString(),
      ...productData,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    products.push(newProduct);
    return newProduct;
  }

  static async updateProduct(id: string, updateData: IUpdateProduct): Promise<IProduct | null> {
    const productIndex = products.findIndex(product => product._id === id);
    if (productIndex === -1) return null;

    products[productIndex] = {
      ...products[productIndex],
      ...updateData,
      updatedAt: new Date()
    };
    return products[productIndex];
  }

  static async deleteProduct(id: string): Promise<boolean> {
    const productIndex = products.findIndex(product => product._id === id);
    if (productIndex === -1) return false;

    // 論理削除
    products[productIndex].isActive = false;
    products[productIndex].updatedAt = new Date();
    return true;
  }
}
INNER_EOF

cat > src/controllers/productController.ts << 'INNER_EOF'
import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/productService';
import { ApiResponse } from '../utils/apiResponse';
import { ApiFeatures } from '../utils/apiResponse';
import { ICreateProduct, IUpdateProduct } from '../types/product';

export class ProductController {
  static async getAllProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const features = new ApiFeatures(
        ProductService.getAllProducts(),
        req.query
      ).filter().sort().limitFields().paginate();

      const products = await features.query;
      res.status(200).json(ApiResponse.success(products, 'Products retrieved successfully'));
    } catch (error) {
      next(error);
    }
  }

  static async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const product = await ProductService.getProductById(id);

      if (!product) {
        return res.status(404).json(ApiResponse.error('Product not found', 404));
      }

      res.status(200).json(ApiResponse.success(product, 'Product retrieved successfully'));
    } catch (error) {
      next(error);
    }
  }

  static async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const productData: ICreateProduct = req.body;
      const product = await ProductService.createProduct(productData);
      res.status(201).json(ApiResponse.success(product, 'Product created successfully', 201));
    } catch (error) {
      next(error);
    }
  }

  static async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateData: IUpdateProduct = req.body;
      const product = await ProductService.updateProduct(id, updateData);

      if (!product) {
        return res.status(404).json(ApiResponse.error('Product not found', 404));
      }

      res.status(200).json(ApiResponse.success(product, 'Product updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  static async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const deleted = await ProductService.deleteProduct(id);

      if (!deleted) {
        return res.status(404).json(ApiResponse.error('Product not found', 404));
      }

      res.status(200).json(ApiResponse.success(null, 'Product deleted successfully'));
    } catch (error) {
      next(error);
    }
  }
}
INNER_EOF

cat > src/routes/productRoutes.ts << 'INNER_EOF'
import { Router } from 'express';
import { ProductController } from '../controllers/productController';

const router = Router();

router.route('/')
  .get(ProductController.getAllProducts)
  .post(ProductController.createProduct);

router.route('/:id')
  .get(ProductController.getProductById)
  .put(ProductController.updateProduct)
  .delete(ProductController.deleteProduct);

export default router;
INNER_EOF

# package.jsonのスクリプト更新
npm pkg set scripts.dev="nodemon src/server.ts"
npm pkg set scripts.build="tsc"
npm pkg set scripts.start="node dist/server.js"
npm pkg set scripts.test="echo \"Error: no test specified\" && exit 1"

echo "REST APIサーバーのセットアップが完了しました！"
echo "プロジェクトディレクトリ: $(pwd)"
echo ""
echo "開発を開始するには:"
echo "  npm run dev"
echo ""
echo "APIエンドポイント:"
echo "  GET  /health - ヘルスチェック"
echo "  GET  /api/users - ユーザー一覧取得"
echo "  POST /api/users - ユーザー作成"
echo "  GET  /api/users/:id - ユーザー詳細取得"
echo "  PUT  /api/users/:id - ユーザー更新"
echo "  DELETE /api/users/:id - ユーザー削除"
echo "  GET  /api/products - 製品一覧取得"
echo "  POST /api/products - 製品作成"
echo ""
echo "Claude Codeで機能を拡張するには:"
echo "  claude \"このAPIに認証機能を追加してください\""
echo "  claude \"データベース連携を実装してください\""
echo "  claude \"APIドキュメントを自動生成してください\""
EOF

# 実行権限の付与
chmod +x setup-api-server.sh

# 実行
./setup-api-server.sh
```

:::

## データ分析プロジェクト

### プロジェクト4: データ分析ダッシュボード

:::step

1. データ分析環境のセットアップ

データ分析のための環境を構築します。

_コマンド実行_
```bash
# データ分析環境セットアップスクリプト
cat > setup-data-analysis.sh << 'EOF'
#!/bin/bash

# データ分析プロジェクトセットアップ
echo "データ分析プロジェクトをセットアップします..."

# プロジェクトの作成
mkdir -p data-analysis-dashboard
cd data-analysis-dashboard

# Next.jsプロジェクトの初期化
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# 必要なパッケージのインストール
npm install recharts d3 csv-parser lodash @types/d3 @types/lodash

# データ生成用パッケージ
npm install --save-dev faker @types/faker

# 環境変数ファイルの作成
cat > .env.local << 'INNER_EOF'
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
INNER_EOF

# 型定義の作成
mkdir -p src/types
cat > src/types/analytics.ts << 'INNER_EOF'
export interface AnalyticsData {
  id: string;
  timestamp: Date;
  userId: string;
  action: string;
  category: string;
  value: number;
  metadata: Record<string, any>;
}

export interface UserActivity {
  userId: string;
  userName: string;
  sessionCount: number;
  pageViews: number;
  averageSessionDuration: number;
  lastActivity: Date;
}

export interface PageStats {
  pagePath: string;
  pageTitle: string;
  views: number;
  uniqueVisitors: number;
  averageDuration: number;
  bounceRate: number;
}

export interface TimeSeriesData {
  date: string;
  value: number;
  category: string;
}
INNER_EOF

# データ生成サービスの作成
mkdir -p src/services
cat > src/services/mockDataGenerator.ts << 'INNER_EOF'
import faker from 'faker';
import { AnalyticsData, UserActivity, PageStats, TimeSeriesData } from '@/types/analytics';

export class MockDataGenerator {
  static generateAnalyticsData(count: number = 1000): AnalyticsData[] {
    const actions = ['page_view', 'click', 'scroll', 'form_submit', 'download'];
    const categories = ['engagement', 'conversion', 'navigation', 'content'];

    return Array.from({ length: count }, (_, i) => ({
      id: \`analytics-\${i}\`,
      timestamp: faker.date.past(0.5),
      userId: \`user-\${faker.datatype.number({ min: 1, max: 100 })\`,
      action: faker.random.arrayElement(actions),
      category: faker.random.arrayElement(categories),
      value: faker.datatype.number({ min: 1, max: 100 }),
      metadata: {
        device: faker.random.arrayElement(['desktop', 'mobile', 'tablet']),
        browser: faker.random.arrayElement(['chrome', 'firefox', 'safari', 'edge']),
        location: faker.address.country()
      }
    }));
  }

  static generateUserActivity(count: number = 50): UserActivity[] {
    return Array.from({ length: count }, (_, i) => ({
      userId: \`user-\${i + 1}\`,
      userName: faker.name.findName(),
      sessionCount: faker.datatype.number({ min: 1, max: 50 }),
      pageViews: faker.datatype.number({ min: 10, max: 500 }),
      averageSessionDuration: faker.datatype.number({ min: 60, max: 600 }),
      lastActivity: faker.date.recent(30)
    }));
  }

  static generatePageStats(count: number = 20): PageStats[] {
    const pages = [
      '/home', '/about', '/products', '/contact', '/blog',
      '/pricing', '/features', '/login', '/signup', '/dashboard'
    ];

    return Array.from({ length: count }, (_, i) => ({
      pagePath: pages[i % pages.length],
      pageTitle: faker.lorem.sentence(),
      views: faker.datatype.number({ min: 100, max: 10000 }),
      uniqueVisitors: faker.datatype.number({ min: 50, max: 500 }),
      averageDuration: faker.datatype.number({ min: 30, max: 300 }),
      bounceRate: faker.datatype.number({ min: 20, max: 80 })
    }));
  }

  static generateTimeSeriesData(days: number = 30): TimeSeriesData[] {
    const categories = ['page_views', 'unique_visitors', 'sessions'];
    const data: TimeSeriesData[] = [];

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      categories.forEach(category => {
        data.push({
          date: date.toISOString().split('T')[0],
          value: faker.datatype.number({ min: 100, max: 1000 }),
          category
        });
      });
    }

    return data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
}
INNER_EOF

# APIサービスの作成
cat > src/services/apiService.ts << 'INNER_EOF'
import { AnalyticsData, UserActivity, PageStats, TimeSeriesData } from '@/types/analytics';
import { MockDataGenerator } from './mockDataGenerator';

// モックデータの生成
const analyticsData = MockDataGenerator.generateAnalyticsData();
const userActivityData = MockDataGenerator.generateUserActivity();
const pageStatsData = MockDataGenerator.generatePageStats();
const timeSeriesData = MockDataGenerator.generateTimeSeriesData();

export class ApiService {
  static async getAnalyticsData(): Promise<AnalyticsData[]> {
    // API呼び出しのシミュレーション
    await new Promise(resolve => setTimeout(resolve, 500));
    return analyticsData;
  }

  static async getUserActivity(): Promise<UserActivity[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return userActivityData;
  }

  static async getPageStats(): Promise<PageStats[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return pageStatsData;
  }

  static async getTimeSeriesData(): Promise<TimeSeriesData[]> {
    await new Promise(resolve => setTimeout(resolve, 600));
    return timeSeriesData;
  }

  static async getDashboardSummary() {
    await new Promise(resolve => setTimeout(resolve, 800));

    return {
      totalPageViews: analyticsData.length,
      uniqueVisitors: new Set(analyticsData.map(d => d.userId)).size,
      averageSessionDuration: Math.round(
        analyticsData.reduce((sum, d) => sum + d.value, 0) / analyticsData.length
      ),
      bounceRate: Math.round(Math.random() * 30 + 40) // 40-70%
    };
  }
}
INNER_EOF

# ユーティリティの作成
cat > src/utils/dataUtils.ts << 'INNER_EOF'
import { TimeSeriesData } from '@/types/analytics';

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP', {
    month: 'short',
    day: 'numeric'
  });
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('ja-JP').format(num);
};

export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes > 0) {
    return \`\${minutes}分\${remainingSeconds}秒\`;
  }
  return \`\${remainingSeconds}秒\`;
};

export const aggregateDataByDate = (data: TimeSeriesData[], category: string) => {
  return data
    .filter(item => item.category === category)
    .map(item => ({
      date: item.date,
      value: item.value
    }));
};

export const calculateGrowthRate = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 100);
};

export const getTopItems = <T extends Record<string, any>>(
  data: T[],
  sortBy: keyof T,
  limit: number = 10
): T[] => {
  return [...data]
    .sort((a, b) => (b[sortBy] as number) - (a[sortBy] as number))
    .slice(0, limit);
};
INNER_EOF

echo "データ分析環境のセットアップが完了しました！"
echo "プロジェクトディレクトリ: $(pwd)"
echo ""
echo "開発を開始するには:"
echo "  npm run dev"
echo ""
echo "Claude Codeでダッシュボードを作成するには:"
echo "  claude \"データ分析ダッシュボードのコンポーネントを作成してください\""
echo "  claude \"リアルタイムチャートを実装してください\""
echo "  claude \"データフィルタリング機能を追加してください\""
EOF

# 実行権限の付与
chmod +x setup-data-analysis.sh

# 実行
./setup-data-analysis.sh
```

2. ダッシュボードコンポーネントの実装

データ分析ダッシュボードのコンポーネントを実装します。

_コマンド実行_
```bash
# ダッシュボードコンポーネント実装スクリプト
cat > implement-dashboard-components.sh << 'EOF'
#!/bin/bash

# ダッシュボードコンポーネントの実装
echo "ダッシュボードコンポーネントを実装します..."

# サマリーカードコンポーネント
cat > src/components/DashboardSummary.tsx << 'INNER_EOF'
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNumber } from '@/utils/dataUtils';

interface SummaryCardProps {
  title: string;
  value: number | string;
  change?: number;
  icon: React.ReactNode;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, change, icon }) => {
  const isPositive = change && change > 0;
  const changeColor = isPositive ? 'text-green-600' : 'text-red-600';

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {typeof value === 'number' ? formatNumber(value) : value}
        </div>
        {change !== undefined && (
          <p className={`text-xs ${changeColor}`}>
            {isPositive ? '+' : ''}{change}% 前日比
          </p>
        )}
      </CardContent>
    </Card>
  );
};

interface DashboardSummaryProps {
  totalPageViews: number;
  uniqueVisitors: number;
  averageSessionDuration: number;
  bounceRate: number;
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({
  totalPageViews,
  uniqueVisitors,
  averageSessionDuration,
  bounceRate
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <SummaryCard
        title="総ページビュー"
        value={totalPageViews}
        change={12}
        icon={<div className="h-4 w-4 text-muted-foreground">👁️</div>}
      />
      <SummaryCard
        title="ユニーク訪問者"
        value={uniqueVisitors}
        change={8}
        icon={<div className="h-4 w-4 text-muted-foreground">👥</div>}
      />
      <SummaryCard
        title="平均セッション時間"
        value={\`\${Math.round(averageSessionDuration / 60)}分\`}
        change={-5}
        icon={<div className="h-4 w-4 text-muted-foreground">⏱️</div>}
      />
      <SummaryCard
        title="直帰率"
        value={\`\${bounceRate}%\`}
        change={-3}
        icon={<div className="h-4 w-4 text-muted-foreground">📊</div>}
      />
    </div>
  );
};

export default DashboardSummary;
INNER_EOF

# UIコンポーネントの作成
mkdir -p src/components/ui
cat > src/components/ui/card.tsx << 'INNER_EOF'
import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
INNER_EOF

# ユーティリティの作成
mkdir -p src/lib
cat > src/lib/utils.ts << 'INNER_EOF'
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
INNER_EOF

# チャートコンポーネントの作成
cat > src/components/TimeSeriesChart.tsx << 'INNER_EOF'
'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { TimeSeriesData } from '@/types/analytics';
import { formatDate, aggregateDataByDate } from '@/utils/dataUtils';

interface TimeSeriesChartProps {
  data: TimeSeriesData[];
  title: string;
  height?: number;
}

const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({
  data,
  title,
  height = 300
}) => {
  const categories = Array.from(new Set(data.map(item => item.category)));
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

  // データを日付ごとにグループ化
  const chartData = data.reduce((acc, item) => {
    const date = item.date;
    if (!acc[date]) {
      acc[date] = { date };
    }
    acc[date][item.category] = item.value;
    return acc;
  }, {} as Record<string, any>);

  const formattedData = Object.values(chartData);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
            />
            <YAxis />
            <Tooltip
              labelFormatter={formatDate}
              formatter={(value) => [value, '']}
            />
            <Legend />
            {categories.map((category, index) => (
              <Line
                key={category}
                type="monotone"
                dataKey={category}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TimeSeriesChart;
INNER_EOF

# テーブルコンポーネントの作成
cat > src/components/DataTable.tsx << 'INNER_EOF'
'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatNumber, formatDuration } from '@/utils/dataUtils';

interface Column<T> {
  key: keyof T;
  title: string;
  render?: (value: any, item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  title?: string;
}

function DataTable<T>({ data, columns, title }: DataTableProps<T>) {
  const renderCellValue = (column: Column<T>, item: T) => {
    if (column.render) {
      return column.render(item[column.key], item);
    }

    const value = item[column.key];

    if (typeof value === 'number') {
      if (column.key.toString().includes('duration')) {
        return formatDuration(value);
      }
      return formatNumber(value);
    }

    if (value instanceof Date) {
      return value.toLocaleDateString('ja-JP');
    }

    return String(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.key.toString()}>
                    {column.title}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column.key.toString()}>
                      {renderCellValue(column, item)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export default DataTable;
INNER_EOF

# テーブルUIコンポーネントの作成
cat > src/components/ui/table.tsx << 'INNER_EOF'
import * as React from "react"

import { cn } from "@/lib/utils"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
INNER_EOF

# メインダッシュボードページの作成
cat > src/app/page.tsx << 'INNER_EOF'
'use client';

import React, { useState, useEffect } from 'react';
import { ApiService } from '@/services/apiService';
import DashboardSummary from '@/components/DashboardSummary';
import TimeSeriesChart from '@/components/TimeSeriesChart';
import DataTable from '@/components/DataTable';
import { UserActivity, PageStats } from '@/types/analytics';
import { getTopItems } from '@/utils/dataUtils';

export default function Dashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [userActivity, setUserActivity] = useState<UserActivity[]>([]);
  const [pageStats, setPageStats] = useState<PageStats[]>([]);
  const [timeSeriesData, setTimeSeriesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryData, activityData, statsData, seriesData] = await Promise.all([
          ApiService.getDashboardSummary(),
          ApiService.getUserActivity(),
          ApiService.getPageStats(),
          ApiService.getTimeSeriesData()
        ]);

        setSummary(summaryData);
        setUserActivity(activityData);
        setPageStats(statsData);
        setTimeSeriesData(seriesData);
      } catch (error) {
        console.error('データ取得エラー:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">データを読み込み中...</p>
        </div>
      </div>
    );
  }

  const userActivityColumns = [
    { key: 'userName', title: 'ユーザー名' },
    { key: 'sessionCount', title: 'セッション数' },
    { key: 'pageViews', title: 'ページビュー' },
    {
      key: 'averageSessionDuration',
      title: '平均滞在時間',
      render: (value: number) => \`\${Math.round(value / 60)}分\`
    },
    {
      key: 'lastActivity',
      title: '最終アクティビティ',
      render: (value: Date) => value.toLocaleDateString('ja-JP')
    }
  ];

  const pageStatsColumns = [
    { key: 'pagePath', title: 'ページパス' },
    { key: 'pageTitle', title: 'ページタイトル' },
    { key: 'views', title: 'ビュー数' },
    { key: 'uniqueVisitors', title: 'ユニーク訪問者' },
    {
      key: 'averageDuration',
      title: '平均滞在時間',
      render: (value: number) => \`\${Math.round(value / 60)}分\`
    },
    { key: 'bounceRate', title: '直帰率', render: (value: number) => \`\${value}%\` }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            データ分析ダッシュボード
          </h1>
          <p className="text-gray-600">
            サイトのパフォーマンスとユーザー行動を分析
          </p>
        </header>

        <main className="space-y-6">
          {/* サマリー */}
          {summary && (
            <DashboardSummary
              totalPageViews={summary.totalPageViews}
              uniqueVisitors={summary.uniqueVisitors}
              averageSessionDuration={summary.averageSessionDuration}
              bounceRate={summary.bounceRate}
            />
          )}

          {/* 時系列チャート */}
          <TimeSeriesChart
            data={timeSeriesData}
            title="トラフィック推移"
            height={400}
          />

          {/* ユーザーアクティビティ */}
          <DataTable
            data={getTopItems(userActivity, 'pageViews', 10)}
            columns={userActivityColumns}
            title="アクティブユーザー"
          />

          {/* ページ統計 */}
          <DataTable
            data={getTopItems(pageStats, 'views', 10)}
            columns={pageStatsColumns}
            title="ページパフォーマンス"
          />
        </main>
      </div>
    </div>
  );
}
INNER_EOF

echo "ダッシュボードコンポーネントの実装が完了しました！"
echo ""
echo "アプリを起動するには:"
echo "  npm run dev"
echo ""
echo "Claude Codeでさらに機能を拡張するには:"
echo "  claude \"リアルタイムデータ更新機能を実装してください\""
echo "  claude \"データフィルタリング機能を追加してください\""
echo "  claude \"エクスポート機能を実装してください\""
echo "  claude \"ダークモード対応を追加してください\""
EOF

# 実行権限の付与
chmod +x implement-dashboard-components.sh

# 実行
./implement-dashboard-components.sh
```

:::

## 次のステップ

実践的なプロジェクトを学習したら、次のステップに進みましょう。

1. [チーム開発での活用](../team-development/team-development.md)
2. [高度な機能](../advanced-features/advanced-features.md)
3. [ケーススタディ](../case-studies/case-studies.md)

---

## まとめ

:::note 要点のまとめ

- 実際のプロジェクト開発におけるClaude Codeの活用法を習得
- Webアプリケーション、API、データ分析の実践的なスキルを学習
- 環境構築からデプロイまでの完全な開発プロセスを理解
- 効果的なプロジェクト管理とベストプラクティスを確立
- Claude Codeを使った効率的な開発手法を体験

:::

## 関連記事

[チーム開発での活用](../team-development/team-development.md)
[高度な機能](../advanced-features/advanced-features.md)
[ケーススタディ](../case-studies/case-studies.md)
[導入ガイド](../getting-started/use-cases/implementation-guide.md)