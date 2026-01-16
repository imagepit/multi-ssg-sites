---
title: "コーディング規約"
description: "Claude Codeを活用したチーム開発におけるコーディング規約の設定と運用方法を学びます。品質管理、自動化、ベストプラクティスの実践的なガイドです。"
status: "published"
priority: "high"
tags: ["コーディング規約", "品質管理", "自動化", "ベストプラクティス"]
author: "Claude"
category: "team-development"
---

# コーディング規約

Claude Codeを活用した効果的なコーディング規約の設定と運用方法について学びます。このセクションでは、チームで一貫したコード品質を維持するための規約作成、自動化ツールの導入、そしてClaude Codeを活用した品質管理のベストプラクティスを解説します。

## コーディング規約の重要性

チーム開発において、コーディング規約はコードの一貫性、可読性、保守性を確保するための重要な基盤です。

:::note コーディング規約が必要な理由

- **一貫性の維持**: チーム全体で統一されたコーディングスタイル
- **可読性の向上**: 誰が書いても理解しやすいコード構造
- **保守性の向上**: バグの発見と修正が容易になる
- **学習コストの削減**: 新メンバーのオンボーディングが迅速化

:::

## 規約の基本要素

### 命名規則

:::step

1. 命名規則の設定

任意の場所（デスクトップなど）で`coding-standards`フォルダを作成し、命名規則の実践を始めます。

```bash
mkdir coding-standards
cd coding-standards
npm init -y
```

2. 命名規則ガイドの作成

`naming-conventions.md`を作成し、チームで守るべき命名規則を定義します。

_naming-conventions.md_

```markdown
# 命名規約ガイド

## 変数名
- camelCaseを使用: `userName`, `isLoggedIn`
- ブール値はis/has/canで始める: `isLoading`, `hasPermission`
- 定数はUPPER_SNAKE_CASE: `MAX_RETRY_COUNT`, `API_BASE_URL`

## 関数名
- 動詞で始める: `getUserData()`, `validateInput()`
- camelCaseを使用: `calculateTotal()`, `handleSubmit()`
- 非同期関数は接尾辞を付ける: `fetchUserData()`, `loadComponent()`

## クラス名
- PascalCaseを使用: `UserService`, `AuthController`
- 名詞または名詞句: `UserManager`, `DataProcessor`

## ファイル名
- kebab-caseを使用: `user-service.js`, `auth-controller.ts`
- コンポーネントはPascalCase: `UserProfile.jsx`, `LoginForm.tsx`
- テストファイルは*.test.js: `user-service.test.js`

## CSSクラス名
- kebab-caseを使用: `user-profile`, `auth-form`
- BEM記法を推奨: `user-profile__header`, `auth-form--error`

## APIエンドポイント
- kebab-caseを使用: `/api/users`, `/api/auth/login`
- 複数形を使用: `/api/products`, `/api/categories`
```

3. 命名規則の実装

`src/utils/naming-utils.js`を作成し、命名規則をチェックするユーティリティを実装します。

_src/utils/naming-utils.js_

```javascript
/**
 * 命名規則チェックユーティリティ
 * 変数名、関数名、クラス名の命名規則を検証
 */
class NamingConventionChecker {
  static checkVariableName(name) {
    const errors = [];

    // camelCaseチェック
    if (!/^[a-z][a-zA-Z0-9]*$/.test(name)) {
      errors.push('変数名はcamelCaseを使用してください');
    }

    // ブール値の接頭辞チェック
    if (name.startsWith('is') || name.startsWith('has') || name.startsWith('can')) {
      if (!/^(is|has|can)[A-Z]/.test(name)) {
        errors.push('ブール値はis/has/canで始めてください');
      }
    }

    // 予約語チェック
    const reservedWords = ['class', 'function', 'var', 'let', 'const', 'return', 'if', 'else', 'for', 'while'];
    if (reservedWords.includes(name)) {
      errors.push(`${name}は予約語です`);
    }

    return errors;
  }

  static checkFunctionName(name) {
    const errors = [];

    // camelCaseチェック
    if (!/^[a-z][a-zA-Z0-9]*$/.test(name)) {
      errors.push('関数名はcamelCaseを使用してください');
    }

    // 動詞で始まるかチェック
    const commonVerbs = ['get', 'set', 'add', 'remove', 'update', 'delete', 'create', 'find', 'validate', 'handle'];
    const startsWithVerb = commonVerbs.some(verb => name.startsWith(verb));

    if (!startsWithVerb && !name.startsWith('is') && !name.startsWith('has') && !name.startsWith('can')) {
      errors.push('関数名は動詞で始めてください');
    }

    return errors;
  }

  static checkClassName(name) {
    const errors = [];

    // PascalCaseチェック
    if (!/^[A-Z][a-zA-Z0-9]*$/.test(name)) {
      errors.push('クラス名はPascalCaseを使用してください');
    }

    // 名詞または名詞句であることの簡易チェック
    if (name.match(/ing$/) || name.match(/ed$/)) {
      errors.push('クラス名は名詞または名詞句を使用してください');
    }

    return errors;
  }

  static checkFileName(name) {
    const errors = [];

    // kebab-caseチェック
    if (!/^[a-z][a-z0-9-]*[a-z0-9]$/.test(name) && !/^[A-Z][a-zA-Z0-9]*$/.test(name)) {
      errors.push('ファイル名はkebab-caseを使用してください');
    }

    // 特殊文字チェック
    if (/[._]/.test(name)) {
      errors.push('ファイル名にアンダースコアやドットは使用しないでください');
    }

    return errors;
  }

  static validateNaming(type, name) {
    switch (type) {
      case 'variable':
        return this.checkVariableName(name);
      case 'function':
        return this.checkFunctionName(name);
      case 'class':
        return this.checkClassName(name);
      case 'file':
        return this.checkFileName(name);
      default:
        return ['不明なタイプです'];
    }
  }
}

module.exports = { NamingConventionChecker };
```

4. テストファイルの作成

`tests/naming-conventions.test.js`を作成し、命名規則チェックのテストを実装します。

_tests/naming-conventions.test.js_

```javascript
const { NamingConventionChecker } = require('../src/utils/naming-utils');

describe('NamingConventionChecker', () => {
  describe('checkVariableName', () => {
    it('有効な変数名を許可する', () => {
      expect(NamingConventionChecker.checkVariableName('userName')).toEqual([]);
      expect(NamingConventionChecker.checkVariableName('isLoading')).toEqual([]);
    });

    it('無効な変数名を拒否する', () => {
      expect(NamingConventionChecker.checkVariableName('UserName')).toContain('camelCaseを使用してください');
      expect(NamingConventionChecker.checkVariableName('user_name')).toContain('camelCaseを使用してください');
    });
  });

  describe('checkFunctionName', () => {
    it('有効な関数名を許可する', () => {
      expect(NamingConventionChecker.checkFunctionName('getUserData')).toEqual([]);
      expect(NamingConventionChecker.checkFunctionName('validateInput')).toEqual([]);
    });

    it('無効な関数名を拒否する', () => {
      expect(NamingConventionChecker.checkFunctionName('GetUserData')).toContain('camelCaseを使用してください');
      expect(NamingConventionChecker.checkFunctionName('dataProcess')).toContain('動詞で始めてください');
    });
  });

  describe('checkClassName', () => {
    it('有効なクラス名を許可する', () => {
      expect(NamingConventionChecker.checkClassName('UserService')).toEqual([]);
      expect(NamingConventionChecker.checkClassName('AuthController')).toEqual([]);
    });

    it('無効なクラス名を拒否する', () => {
      expect(NamingConventionChecker.checkClassName('userService')).toContain('PascalCaseを使用してください');
      expect(NamingConventionChecker.checkClassName('Processing')).toContain('名詞または名詞句を使用してください');
    });
  });
});
```

:::

### コードスタイルガイド

:::step

1. ESLint設定

`.eslintrc.json`を作成し、コードスタイルのルールを定義します。

_.eslintrc.json_

```json
{
  "extends": [
    "eslint:recommended",
    "@typescript-eslint/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "env": {
    "browser": true,
    "node": true,
    "es2021": true
  },
  "rules": {
    // 命名規則
    "camelcase": ["error", { "properties": "always" }],
    "@typescript-eslint/naming-convention": [
      "error",
      {
        "selector": "variable",
        "format": ["camelCase"],
        "leadingUnderscore": "allow",
        "trailingUnderscore": "allow"
      },
      {
        "selector": "function",
        "format": ["camelCase"]
      },
      {
        "selector": "class",
        "format": ["PascalCase"]
      }
    ],

    // インデント
    "indent": ["error", 2],

    // セミコロン
    "semi": ["error", "always"],

    // クォート
    "quotes": ["error", "single"],

    // 空行
    "padding-line-between-statements": [
      "error",
      { "blankLine": "always", "prev": "*", "next": "return" },
      { "blankLine": "always", "prev": ["const", "let", "var"], "next": "*" },
      { "blankLine": "any", "prev": ["const", "let", "var"], "next": ["const", "let", "var"] }
    ],

    // 複雑さ
    "complexity": ["error", 10],
    "max-depth": ["error", 3],
    "max-lines-per-function": ["error", 50],

    // 未使用変数
    "no-unused-vars": "error",
    "@typescript-eslint/no-unused-vars": "error",

    // セキュリティ
    "no-eval": "error",
    "no-implied-eval": "error",
    "no-new-func": "error",

    // ベストプラクティス
    "eqeqeq": "error",
    "no-var": "error",
    "prefer-const": "error",
    "prefer-template": "error",
    "template-curly-spacing": "error",
    "object-shorthand": "error",

    // エラーハンドリング
    "no-empty": "error",
    "no-fallthrough": "error",
    "no-throw-literal": "error",

    // アクセシビリティ
    "jsx-a11y/alt-text": "error",
    "jsx-a11y/anchor-is-valid": "error"
  }
}
```

2. Prettier設定

`.prettierrc`を作成し、コードフォーマットのルールを定義します。

_.prettierrc_

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

3. EditorConfig設定

`.editorconfig`を作成し、エディタの設定を統一します。

_.editorconfig_

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
indent_size = 2
indent_style = space
insert_final_newline = true
trim_trailing_whitespace = true

[*.{js,jsx,ts,tsx}]
max_line_length = 100

[*.{json,yml,yaml}]
indent_size = 2

[*.md]
trim_trailing_whitespace = false
max_line_length = off
```

:::

## Claude Codeを活用したコード品質管理

### 自動コードレビュー

:::step

1. コード品質チェックツールの作成

`src/utils/code-quality-checker.js`を作成し、Claude Codeと連携するコード品質チェックツールを実装します。

_src/utils/code-quality-checker.js_

```javascript
/**
 * Claude Codeと連携するコード品質チェックツール
 * 自動的にコードの品質を分析し、改善提案を行う
 */
const fs = require('fs');
const path = require('path');

class CodeQualityChecker {
  constructor() {
    this.qualityMetrics = {
      complexity: 0,
      maintainability: 0,
      reliability: 0,
      security: 0,
      performance: 0
    };
  }

  async analyzeFile(filePath) {
    const code = fs.readFileSync(filePath, 'utf8');
    const analysis = {
      filePath,
      issues: [],
      suggestions: [],
      metrics: { ...this.qualityMetrics }
    };

    // 複雑性の分析
    analysis.issues.push(...this.analyzeComplexity(code));

    // セキュリティの分析
    analysis.issues.push(...this.analyzeSecurity(code));

    // パフォーマンスの分析
    analysis.issues.push(...this.analyzePerformance(code));

    // ベストプラクティスの分析
    analysis.issues.push(...this.analyzeBestPractices(code));

    // メトリクスの計算
    analysis.metrics = this.calculateMetrics(analysis.issues);

    return analysis;
  }

  analyzeComplexity(code) {
    const issues = [];
    const lines = code.split('\n');
    let complexity = 0;
    let maxNestingDepth = 0;
    let currentNestingDepth = 0;

    lines.forEach((line, index) => {
      const lineNumber = index + 1;

      // 制御構造の複雑性を分析
      if (line.match(/\b(if|for|while|switch|catch)\b/)) {
        complexity++;
        currentNestingDepth++;
        maxNestingDepth = Math.max(maxNestingDepth, currentNestingDepth);
      }

      if (line.match(/\b(else|finally|})\b/)) {
        currentNestingDepth--;
      }

      // 関数の長さをチェック
      const functionMatch = line.match(/function\s+\w+\s*\(|=>\s*{/);
      if (functionMatch) {
        const functionStart = index;
        let braceCount = 0;
        let functionEnd = index;

        for (let i = functionStart; i < lines.length; i++) {
          if (lines[i].includes('{')) braceCount++;
          if (lines[i].includes('}')) braceCount--;
          if (braceCount === 0) {
            functionEnd = i;
            break;
          }
        }

        const functionLength = functionEnd - functionStart;
        if (functionLength > 50) {
          issues.push({
            type: 'complexity',
            severity: 'medium',
            line: lineNumber,
            message: '関数が長すぎます（50行以上）',
            suggestion: '関数を複数の小さな関数に分割してください'
          });
        }
      }
    });

    // ネストの深さをチェック
    if (maxNestingDepth > 3) {
      issues.push({
        type: 'complexity',
        severity: 'high',
        message: 'ネストが深すぎます',
        suggestion: '複雑なロジックは別の関数に抽出してください'
      });
    }

    return issues;
  }

  analyzeSecurity(code) {
    const issues = [];
    const lines = code.split('\n');

    lines.forEach((line, index) => {
      const lineNumber = index + 1;

      // eval()の使用をチェック
      if (line.includes('eval(')) {
        issues.push({
          type: 'security',
          severity: 'high',
          line: lineNumber,
          message: 'eval()はセキュリティリスクがあります',
          suggestion: 'eval()の使用を避け、代替手段を使用してください'
        });
      }

      // innerHTMLの使用をチェック
      if (line.includes('innerHTML')) {
        issues.push({
          type: 'security',
          severity: 'high',
          line: lineNumber,
          message: 'innerHTMLはXSSの脆弱性があります',
          suggestion: 'textContentやDOM APIを使用してください'
        });
      }

      // ハードコードされたシークレットをチェック
      if (line.match(/(api_key|secret|password|token)\s*=\s*["'][^"']+["']/i)) {
        issues.push({
          type: 'security',
          severity: 'high',
          line: lineNumber,
          message: 'シークレット情報がハードコードされています',
          suggestion: '環境変数や設定ファイルを使用してください'
        });
      }
    });

    return issues;
  }

  analyzePerformance(code) {
    const issues = [];
    const lines = code.split('\n');

    lines.forEach((line, index) => {
      const lineNumber = index + 1;

      // DOM要素の繰り返し検索をチェック
      const querySelectorMatches = line.match(/document\.querySelector/g);
      if (querySelectorMatches && querySelectorMatches.length > 1) {
        issues.push({
          type: 'performance',
          severity: 'medium',
          line: lineNumber,
          message: 'DOM要素の繰り返し検索はパフォーマンスに影響します',
          suggestion: '一度取得した要素をキャッシュしてください'
        });
      }

      // ループ内でのDOM操作をチェック
      if (line.match(/\b(for|while)\b.*\.(innerHTML|appendChild|removeChild)/)) {
        issues.push({
          type: 'performance',
          severity: 'high',
          line: lineNumber,
          message: 'ループ内でのDOM操作はパフォーマンスに影響します',
          suggestion: 'DocumentFragmentを使用してバルク操作してください'
        });
      }
    });

    return issues;
  }

  analyzeBestPractices(code) {
    const issues = [];
    const lines = code.split('\n');

    lines.forEach((line, index) => {
      const lineNumber = index + 1;

      // varの使用をチェック
      if (line.includes('var ')) {
        issues.push({
          type: 'best-practice',
          severity: 'low',
          line: lineNumber,
          message: 'varの使用は避けてください',
          suggestion: 'constまたはletを使用してください'
        });
      }

      // console.logの残存をチェック
      if (line.includes('console.log')) {
        issues.push({
          type: 'best-practice',
          severity: 'low',
          line: lineNumber,
          message: 'console.logが残っています',
          suggestion: '開発用のログは削除してください'
        });
      }

      // TODOコメントのチェック
      if (line.includes('TODO') || line.includes('FIXME')) {
        issues.push({
          type: 'best-practice',
          severity: 'medium',
          line: lineNumber,
          message: '未完了のタスクがあります',
          suggestion: 'TODOやFIXMEコメントを対応してください'
        });
      }
    });

    return issues;
  }

  calculateMetrics(issues) {
    const severityCount = {
      high: issues.filter(i => i.severity === 'high').length,
      medium: issues.filter(i => i.severity === 'medium').length,
      low: issues.filter(i => i.severity === 'low').length
    };

    const totalIssues = issues.length;
    const maxScore = 100;

    // 各メトリクスを計算
    const complexityScore = Math.max(0, maxScore - (severityCount.high * 10 + severityCount.medium * 5 + severityCount.low * 1));
    const securityScore = Math.max(0, maxScore - (severityCount.high * 15 + severityCount.medium * 5));
    const performanceScore = Math.max(0, maxScore - (severityCount.high * 12 + severityCount.medium * 3));
    const maintainabilityScore = Math.max(0, maxScore - (severityCount.medium * 8 + severityCount.low * 2));
    const reliabilityScore = Math.max(0, maxScore - (severityCount.high * 8 + severityCount.medium * 4));

    return {
      complexity: Math.round(complexityScore),
      maintainability: Math.round(maintainabilityScore),
      reliability: Math.round(reliabilityScore),
      security: Math.round(securityScore),
      performance: Math.round(performanceScore),
      overall: Math.round((complexityScore + securityScore + performanceScore + maintainabilityScore + reliabilityScore) / 5)
    };
  }

  generateClaudePrompt(analysis) {
    const { filePath, issues, metrics } = analysis;

    return `
Please analyze the following code file and provide improvement suggestions:

File: ${filePath}
Current Quality Metrics:
- Overall Score: ${metrics.overall}/100
- Complexity: ${metrics.complexity}/100
- Security: ${metrics.security}/100
- Performance: ${metrics.performance}/100
- Maintainability: ${metrics.maintainability}/100
- Reliability: ${metrics.reliability}/100

Found Issues:
${issues.map(issue => `- ${issue.message} (Line ${issue.line}, Severity: ${issue.severity})`).join('\n')}

Please provide:
1. Detailed analysis of the main issues
2. Specific code improvement suggestions
3. Best practices recommendations
4. Refactoring recommendations if needed
`;
  }
}

module.exports = { CodeQualityChecker };
```

2. 使用例

```bash
# コード品質チェックの実行
node src/utils/code-quality-checker.js --file src/components/UserProfile.js

# Claude Codeとの連携
node src/utils/code-quality-checker.js --file src/components/UserProfile.js --claude
```

:::

## CI/CDパイプラインでの品質保証

:::step

1. GitHub Actionsワークフローの作成

`.github/workflows/quality-check.yml`を作成し、自動品質チェックを設定します。

_.github/workflows/quality-check.yml_

```yaml
name: Code Quality Check

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  quality-check:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run ESLint
      run: npm run lint

    - name: Run TypeScript Check
      run: npm run type-check

    - name: Run Tests
      run: npm test

    - name: Run Code Quality Check
      run: npm run quality-check

    - name: Generate Quality Report
      run: npm run quality-report

    - name: Upload Quality Report
      uses: actions/upload-artifact@v3
      with:
        name: quality-report
        path: quality-report.json

  security-scan:
    runs-on: ubuntu-latest
    needs: quality-check

    steps:
    - uses: actions/checkout@v3

    - name: Run Security Scan
      run: npm audit

    - name: Run Snyk Security Scan
      uses: snyk/actions/node@master
      env:
        SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

2. 品質チェックスクリプト

`scripts/quality-check.js`を作成し、品質チェックを実行するスクリプトを実装します。

_scripts/quality-check.js_

```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { CodeQualityChecker } = require('../src/utils/code-quality-checker');

const qualityChecker = new CodeQualityChecker();

async function runQualityCheck() {
  const results = [];
  const srcDir = path.join(__dirname, '../src');

  // ソースディレクトリ内のすべてのJavaScript/TypeScriptファイルをチェック
  const files = getAllFiles(srcDir, ['.js', '.jsx', '.ts', '.tsx']);

  for (const file of files) {
    console.log(`Checking: ${file}`);
    const analysis = await qualityChecker.analyzeFile(file);
    results.push(analysis);
  }

  // 品質レポートの生成
  const report = generateQualityReport(results);

  // レポートをファイルに保存
  fs.writeFileSync('quality-report.json', JSON.stringify(report, null, 2));

  // 結果の表示
  console.log('\n=== Quality Report ===');
  console.log(`Overall Score: ${report.overallScore}/100`);
  console.log(`Files Checked: ${report.filesChecked}`);
  console.log(`Total Issues: ${report.totalIssues}`);

  if (report.totalIssues > 0) {
    console.log('\nIssues by Severity:');
    console.log(`  High: ${report.severityCount.high}`);
    console.log(`  Medium: ${report.severityCount.medium}`);
    console.log(`  Low: ${report.severityCount.low}`);

    process.exit(1); // 問題がある場合はエラー終了
  }
}

function getAllFiles(dir, extensions) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...getAllFiles(fullPath, extensions));
    } else if (extensions.some(ext => entry.name.endsWith(ext))) {
      files.push(fullPath);
    }
  }

  return files;
}

function generateQualityReport(results) {
  const allIssues = results.flatMap(r => r.issues);
  const severityCount = {
    high: allIssues.filter(i => i.severity === 'high').length,
    medium: allIssues.filter(i => i.severity === 'medium').length,
    low: allIssues.filter(i => i.severity === 'low').length
  };

  const avgMetrics = {
    complexity: Math.round(results.reduce((sum, r) => sum + r.metrics.complexity, 0) / results.length),
    security: Math.round(results.reduce((sum, r) => sum + r.metrics.security, 0) / results.length),
    performance: Math.round(results.reduce((sum, r) => sum + r.metrics.performance, 0) / results.length),
    maintainability: Math.round(results.reduce((sum, r) => sum + r.metrics.maintainability, 0) / results.length),
    reliability: Math.round(results.reduce((sum, r) => sum + r.metrics.reliability, 0) / results.length)
  };

  return {
    filesChecked: results.length,
    totalIssues: allIssues.length,
    severityCount,
    overallScore: Math.round((avgMetrics.complexity + avgMetrics.security + avgMetrics.performance + avgMetrics.maintainability + avgMetrics.reliability) / 5),
    metrics: avgMetrics,
    timestamp: new Date().toISOString(),
    files: results.map(r => ({
      path: r.filePath,
      metrics: r.metrics,
      issues: r.issues.length
    }))
  };
}

if (require.main === module) {
  runQualityCheck().catch(console.error);
}

module.exports = { runQualityCheck };
```

:::

## まとめ

このページでは、Claude Codeを活用したコーディング規約の設定と運用方法について学びました。適切なコーディング規約と自動化ツールの導入により、チーム全体で一貫した高品質なコードを維持することができます。

:::note 要点のまとめ

- コーディング規約はチーム開発で一貫性と品質を確保するための基盤
- 命名規則、コードスタイル、ベストプラクティスを明確に定義
- ESLint、Prettier、EditorConfigで自動化を実現
- Claude Codeと連携した品質チェックツールで効率的なレビュー
- CI/CDパイプラインでの自動品質保証で継続的な品質維持

:::

## 関連記事

[チーム開発の基礎](../team-development-basics/team-development-basics.md)
[バージョン管理とGit](../version-control/version-control.md)
[プロジェクト管理](../project-management/project-management.md)
[CI/CDパイプライン](../cicd-pipeline/cicd-pipeline.md)