---
title: "トラブルシューティング"
description: "Claude Codeを活用したチーム開発におけるトラブルシューティングの実践的な手法を学びます。一般的な問題の解決策と予防策をマスターします。"
status: "published"
priority: "high"
tags: ["トラブルシューティング", "問題解決", "デバッグ", "予防策"]
author: "Claude"
category: "team-development"
---

# トラブルシューティング

Claude Codeを活用したチーム開発におけるトラブルシューティングの実践的なガイドです。このセクションでは、開発プロセスで発生する一般的な問題の特定、解決、そして予防のための体系的なアプローチを学びます。

## トラブルシューティングの重要性

チーム開発では、技術的な問題だけでなく、プロセスやコミュニケーションに関する問題も頻繁に発生します。効果的なトラブルシューティングスキルは、プロジェクトの成功に不可欠です。

:::note トラブルシューティングが必要な理由

- **開発効率の維持**: 問題が発生した際の迅速な解決で開発遅延を防止
- **品質の確保**: 問題の根本原因を特定し、再発を防止
- **チームの信頼性**: 一貫した問題解決能力でステークホルダーの信頼を獲得
- **学習の促進**: 問題解決プロセスを通じてチーム全体の技術力向上
- **予防的アプローチ**: 問題発生前の予防策でリスクを低減

:::

## 体系的な問題解決アプローチ

### 問題解決のフレームワーク

:::step

1. トラブルシューティング環境の構築

任意の場所（デスクトップなど）で`troubleshooting-practice`フォルダを作成し、実践を始めます。

```bash
mkdir troubleshooting-practice
cd troubleshooting-practice
npm init -y
```

2. 問題解決フレームワークの実装

`src/troubleshooting-framework.js`を作成し、Claude Codeを活用した問題解決フレームワークを実装します。

_src/troubleshooting-framework.js_

```javascript
/**
 * Claude Codeを活用したトラブルシューティングフレームワーク
 * 体系的な問題解決アプローチを提供
 */
class TroubleshootingFramework {
  constructor() {
    this.problemHistory = [];
    this.solutions = new Map();
    this.patterns = new Map();
    this.metrics = {
      totalProblems: 0,
      resolvedProblems: 0,
      averageResolutionTime: 0,
      commonProblems: new Map()
    };
  }

  // 問題の報告と分析
  async reportProblem(problemData) {
    const problem = {
      id: this.generateId(),
      title: problemData.title,
      description: problemData.description,
      category: problemData.category || 'general',
      severity: problemData.severity || 'medium',
      environment: problemData.environment || {},
      reproductions: problemData.reproductions || [],
      reportedBy: problemData.reportedBy,
      reportedAt: new Date(),
      status: 'open',
      analysis: null,
      solutions: [],
      rootCause: null
    };

    // 問題の自動分析
    problem.analysis = await this.analyzeProblem(problem);

    // 類似問題の検索
    const similarProblems = this.findSimilarProblems(problem);
    problem.similarProblems = similarProblems;

    // メトリクスの更新
    this.updateMetrics(problem);

    // 問題履歴に追加
    this.problemHistory.push(problem);

    console.log(`🔍 問題を報告しました: ${problem.title} (${problem.id})`);
    console.log(`📊 自動分析結果: ${problem.analysis.confidence}の確信度`);

    return problem;
  }

  // 問題の分析
  async analyzeProblem(problem) {
    const analysis = {
      confidence: 0,
      possibleCauses: [],
      recommendedActions: [],
      estimatedComplexity: 'medium',
      requiredSkills: [],
      impact: {
        users: 0,
        systems: [],
        business: 'low'
      }
    };

    // Claude Codeによる問題分析
    const claudeAnalysis = await this.analyzeWithClaudeCode(problem);
    analysis.possibleCauses = claudeAnalysis.causes || [];
    analysis.recommendedActions = claudeAnalysis.actions || [];
    analysis.confidence = claudeAnalysis.confidence || 0.5;

    // 影響度の評価
    analysis.impact = this.assessImpact(problem);

    // 必要なスキルの特定
    analysis.requiredSkills = this.identifyRequiredSkills(analysis.possibleCauses);

    // 複雑性の見積もり
    analysis.estimatedComplexity = this.estimateComplexity(analysis);

    return analysis;
  }

  // 根本原因の分析
  async performRootCauseAnalysis(problemId) {
    const problem = this.problemHistory.find(p => p.id === problemId);
    if (!problem) {
      throw new Error('問題が見つかりません');
    }

    console.log(`🔍 根本原因分析を開始: ${problem.title}`);

    // 5 Whys手法の適用
    const rootCause = await this.applyFiveWhys(problem);

    // 魚骨図分析
    const fishboneAnalysis = await this.performFishboneAnalysis(problem);

    // システム思考アプローチ
    const systemsAnalysis = await this.analyzeSystemInteractions(problem);

    problem.rootCause = {
      primary: rootCause.primaryCause,
      contributingFactors: rootCause.contributingFactors,
      fishboneCategories: fishboneAnalysis,
      systemInteractions: systemsAnalysis,
      analysisDate: new Date(),
      analyst: 'AI Assistant'
    };

    return problem.rootCause;
  }

  // 解決策の生成と実装
  async generateSolutions(problemId) {
    const problem = this.problemHistory.find(p => p.id === problemId);
    if (!problem) {
      throw new Error('問題が見つかりません');
    }

    console.log(`💡 解決策を生成中: ${problem.title}`);

    // Claude Codeによる解決策の生成
    const solutions = await this.generateSolutionsWithClaudeCode(problem);

    // 各解決策の評価
    const evaluatedSolutions = await this.evaluateSolutions(problem, solutions);

    // 最適な解決策の選定
    const recommendedSolution = this.selectOptimalSolution(evaluatedSolutions);

    problem.solutions = evaluatedSolutions;
    problem.recommendedSolution = recommendedSolution;

    return {
      solutions: evaluatedSolutions,
      recommendation: recommendedSolution
    };
  }

  // 解決策の実装と検証
  async implementSolution(problemId, solutionId, implementation) {
    const problem = this.problemHistory.find(p => p.id === problemId);
    if (!problem) {
      throw new Error('問題が見つかりません');
    }

    const solution = problem.solutions.find(s => s.id === solutionId);
    if (!solution) {
      throw new Error('解決策が見つかりません');
    }

    console.log(`🔧 解決策を実装中: ${solution.title}`);

    // 実装プランの作成
    const implementationPlan = await this.createImplementationPlan(solution, implementation);

    // 安全措置の実施
    const safetyMeasures = await this.implementSafetyMeasures(problem, solution);

    // 解決策の適用
    const implementationResult = await this.applySolution(solution, implementationPlan);

    // 検証テストの実行
    const verification = await this.verifySolution(problem, solution, implementationResult);

    // ドキュメントの更新
    await this.updateDocumentation(problem, solution, implementationResult);

    // 問題のクローズ
    problem.status = 'resolved';
    problem.resolvedAt = new Date();
    problem.resolution = {
      solutionId: solutionId,
      implementation: implementationResult,
      verification,
      resolvedBy: implementation.implementedBy
    };

    console.log(`✅ 問題を解決しました: ${problem.title}`);

    return {
      success: verification.success,
      implementation: implementationResult,
      verification
    };
  }

  // 予防策の実装
  async implementPreventiveMeasures(problemId) {
    const problem = this.problemHistory.find(p => p.id === problemId);
    if (!problem || !problem.rootCause) {
      throw new Error('問題または根本原因分析が見つかりません');
    }

    console.log(`🛡️  予防策を実装中: ${problem.title}`);

    const preventiveMeasures = [];

    // コードレベルの予防策
    if (problem.category === 'code') {
      const codeMeasures = await this.generateCodePreventiveMeasures(problem);
      preventiveMeasures.push(...codeMeasures);
    }

    // プロセスレベルの予防策
    if (problem.category === 'process') {
      const processMeasures = await this.generateProcessPreventiveMeasures(problem);
      preventiveMeasures.push(...processMeasures);
    }

    // 監視とアラートの設定
    const monitoringMeasures = await this.setupMonitoring(problem);
    preventiveMeasures.push(...monitoringMeasures);

    // ドキュメントとトレーニング
    const documentationMeasures = await this.createPreventiveDocumentation(problem);
    preventiveMeasures.push(...documentationMeasures);

    problem.preventiveMeasures = preventiveMeasures;

    console.log(`✅ 予防策を実装しました: ${preventiveMeasures.length}件`);

    return preventiveMeasures;
  }

  // Claude Codeによる問題分析
  async analyzeWithClaudeCode(problem) {
    const prompt = `
以下の問題を分析してください:

問題タイトル: ${problem.title}
問題説明: ${problem.description}
カテゴリー: ${problem.category}
深刻度: ${problem.severity}
環境: ${JSON.stringify(problem.environment, null, 2)}

分析の観点:
1. 考えられる原因の特定
2. 問題の影響範囲の評価
3. 解決に必要なスキル
4. 推奨されるアクション
5. 類似の過去事例からの学び

形式で回答してください:
- causes: [原因1, 原因2, ...]
- actions: [アクション1, アクション2, ...]
- confidence: 0.0〜1.0の確信度
- requiredSkills: [スキル1, スキル2, ...]
`;

    // 実際のClaude Code API呼び出し（モック実装）
    return {
      causes: [
        'ネットワーク接続の問題',
        '設定ファイルの誤り',
        '依存関係の競合'
      ],
      actions: [
        'ネットワーク接続の確認',
        '設定ファイルの検証',
        '依存関係の再インストール'
      ],
      confidence: 0.8,
      requiredSkills: ['ネットワーク', '設定管理', 'デバッグ']
    };
  }

  // 5 Whys手法の適用
  async applyFiveWhys(problem) {
    console.log('🤔 5 Whysで根本原因を分析します...');

    const whys = [];
    let currentQuestion = `なぜ「${problem.description}」が発生したのか？`;

    for (let i = 0; i < 5; i++) {
      const answer = await this.askWhy(currentQuestion, problem);
      whys.push({
        question: currentQuestion,
        answer: answer,
        level: i + 1
      });

      if (i < 4) {
        currentQuestion = `なぜ「${answer}」が発生したのか？`;
      }
    }

    const primaryCause = whys[whys.length - 1].answer;
    const contributingFactors = whys.slice(0, -1).map(w => w.answer);

    return {
      primaryCause,
      contributingFactors,
      analysisChain: whys
    };
  }

  // 魚骨図分析
  async performFishboneAnalysis(problem) {
    const categories = {
      人間: ['スキル不足', 'トレーニング不足', 'コミュニケーション不足'],
      方法: ['プロセスの欠如', '手順の不備', 'ベストプラクティス違反'],
      機械: ['ハードウェア障害', 'ソフトウェアバグ', 'パフォーマンス問題'],
      材料: ['データの不整合', '外部APIの問題', '設定ファイルの誤り'],
      測定: ['モニタリング不足', 'メトリクスの誤り', 'ログの不十分'],
      環境: ['ネットワーク問題', 'サーバー環境', '外部要因']
    };

    const analysis = {};

    for (const [category, causes] of Object.entries(categories)) {
      const relevantCauses = await this.identifyRelevantCauses(problem, causes);
      if (relevantCauses.length > 0) {
        analysis[category] = relevantCauses;
      }
    }

    return analysis;
  }

  // システム思考による分析
  async analyzeSystemInteractions(problem) {
    const interactions = {
      components: [],
      dataFlow: [],
      dependencies: [],
      externalSystems: []
    };

    // 実際のシステム分析ロジックを実装
    // ここではモックデータを返す
    return interactions;
  }

  // Claude Codeによる解決策の生成
  async generateSolutionsWithClaudeCode(problem) {
    const prompt = `
以下の問題に対する解決策を生成してください:

問題: ${problem.title}
説明: ${problem.description}
原因分析: ${JSON.stringify(problem.rootCause, null, 2)}
影響: ${JSON.stringify(problem.analysis.impact, null, 2)}

解決策の要件:
1. 根本原因を解決すること
2. 実装の複雑さを考慮すること
3. 副作用のリスクを評価すること
4. テスト容易性を確保すること
5. 長期的な保守性を考慮すること

各解決策について以下の情報を提供してください:
- title: 解決策のタイトル
- description: 詳細な説明
- complexity: 実装の複雑さ (low/medium/high)
- risk: リスクレベル (low/medium/high)
- timeframe: 実装期間の見積もり
- sideEffects: 考えられる副作用
- testing: 必要なテスト
`;

    // 実際のClaude Code API呼び出し（モック実装）
    return [
      {
        id: this.generateId(),
        title: 'ネットワーク接続の改善',
        description: 'ネットワーク設定を最適化し、再接続メカニズムを実装',
        complexity: 'medium',
        risk: 'low',
        timeframe: '2-3日',
        sideEffects: ['既存のネットワーク設定に影響する可能性'],
        testing: ['接続テスト', '負荷テスト', 'フェイルオーバーテスト'],
        effectiveness: 0.9
      },
      {
        id: this.generateId(),
        title: 'エラーハンドリングの強化',
        description: '包括的なエラーハンドリングとリトライロジックを実装',
        complexity: 'low',
        risk: 'low',
        timeframe: '1-2日',
        sideEffects: ['エラーメッセージの変更が必要'],
        testing: ['エラーケースのテスト', 'リトライロジックのテスト'],
        effectiveness: 0.8
      }
    ];
  }

  // 解決策の評価
  async evaluateSolutions(problem, solutions) {
    const evaluatedSolutions = [];

    for (const solution of solutions) {
      const evaluation = {
        ...solution,
        scores: {
          effectiveness: this.evaluateEffectiveness(solution),
          feasibility: this.evaluateFeasibility(solution),
          risk: this.evaluateRisk(solution),
          cost: this.evaluateCost(solution)
        },
        overallScore: 0
      };

      // 総合スコアの計算
      evaluation.overallScore = (
        evaluation.scores.effectiveness * 0.3 +
        evaluation.scores.feasibility * 0.25 +
        evaluation.scores.risk * 0.25 +
        evaluation.scores.cost * 0.2
      );

      evaluatedSolutions.push(evaluation);
    }

    // スコアでソート
    return evaluatedSolutions.sort((a, b) => b.overallScore - a.overallScore);
  }

  // 最適な解決策の選定
  selectOptimalSolution(solutions) {
    return solutions[0]; // スコアが最も高い解決策
  }

  // 影響度の評価
  assessImpact(problem) {
    return {
      users: this.estimateAffectedUsers(problem),
      systems: this.identifyAffectedSystems(problem),
      business: this.assessBusinessImpact(problem)
    };
  }

  // 必要なスキルの特定
  identifyRequiredSkills(causes) {
    const skillMap = {
      'ネットワーク': ['Network', 'TCP/IP', 'HTTP'],
      'データベース': ['SQL', 'Database Design', 'Indexing'],
      'コード': ['Programming', 'Debugging', 'Testing'],
      '設定': ['Configuration Management', 'YAML/JSON', 'Environment Variables'],
      'パフォーマンス': ['Performance Tuning', 'Profiling', 'Optimization']
    };

    const requiredSkills = new Set();
    causes.forEach(cause => {
      for (const [category, skills] of Object.entries(skillMap)) {
        if (cause.toLowerCase().includes(category.toLowerCase())) {
          skills.forEach(skill => requiredSkills.add(skill));
        }
      }
    });

    return Array.from(requiredSkills);
  }

  // 複雑性の見積もり
  estimateComplexity(analysis) {
    const complexityFactors = {
      causes: analysis.possibleCauses.length,
      systems: analysis.impact.systems.length,
      skills: analysis.requiredSkills.length
    };

    const score = complexityFactors.causes * 2 + complexityFactors.systems * 3 + complexityFactors.skills;

    if (score <= 5) return 'low';
    if (score <= 15) return 'medium';
    return 'high';
  }

  // 類似問題の検索
  findSimilarProblems(problem) {
    return this.problemHistory
      .filter(p => p.id !== problem.id && p.category === problem.category)
      .slice(0, 3)
      .map(p => ({
        id: p.id,
        title: p.title,
        similarity: this.calculateSimilarity(problem, p)
      }))
      .filter(p => p.similarity > 0.5);
  }

  // 類似度の計算
  calculateSimilarity(problem1, problem2) {
    // 簡易的な類似度計算（実際にはより高度なアルゴリズムを使用）
    const titleSimilarity = this.calculateStringSimilarity(problem1.title, problem2.title);
    const descSimilarity = this.calculateStringSimilarity(problem1.description, problem2.description);

    return (titleSimilarity * 0.6 + descSimilarity * 0.4);
  }

  // 文字列類似度の計算
  calculateStringSimilarity(str1, str2) {
    const words1 = str1.toLowerCase().split(/\s+/);
    const words2 = str2.toLowerCase().split(/\s+/);

    const intersection = words1.filter(word => words2.includes(word));
    const union = [...new Set([...words1, ...words2])];

    return intersection.length / union.length;
  }

  // メトリクスの更新
  updateMetrics(problem) {
    this.metrics.totalProblems++;
    this.metrics.commonProblems.set(
      problem.category,
      (this.metrics.commonProblems.get(problem.category) || 0) + 1
    );
  }

  // 5 Whysの質問（モック実装）
  async askWhy(question, problem) {
    // 実際にはClaude Codeや他の分析ツールを使用
    const whyResponses = {
      'なぜ「アプリケーションがクラッシュする」が発生したのか？': 'メモリ不足が発生したため',
      'なぜ「メモリ不足が発生した」が発生したのか？': 'メモリリークがあったため',
      'なぜ「メモリリークがあった」が発生したのか？': 'オブジェクトの解放忘れがあったため',
      'なぜ「オブジェクトの解放忘れがあった」が発生したのか？': '適切なメモリ管理ルールがなかったため',
      'なぜ「適切なメモリ管理ルールがなかった」が発生したのか？': 'コーディング規約とレビュープロセスが不十分だったため'
    };

    return whyResponses[question] || '原因を特定できませんでした';
  }

  // 関連原因の特定
  async identifyRelevantCauses(problem, causes) {
    // 実際には問題の内容に基づいて関連性を評価
    return causes.slice(0, 2); // 最初の2つを関連原因として返す
  }

  // 解決策の評価メソッド
  evaluateEffectiveness(solution) {
    return solution.effectiveness || 0.7;
  }

  evaluateFeasibility(solution) {
    const complexityMap = { low: 0.9, medium: 0.7, high: 0.5 };
    return complexityMap[solution.complexity] || 0.7;
  }

  evaluateRisk(solution) {
    const riskMap = { low: 0.9, medium: 0.7, high: 0.5 };
    return riskMap[solution.risk] || 0.7;
  }

  evaluateCost(solution) {
    const timeframeMap = { '1-2日': 0.9, '2-3日': 0.7, '1週間以上': 0.5 };
    return timeframeMap[solution.timeframe] || 0.7;
  }

  // 影響ユーザー数の見積もり
  estimateAffectedUsers(problem) {
    // 実際の環境からユーザー数を推定
    return Math.floor(Math.random() * 10000) + 100;
  }

  // 影響システムの特定
  identifyAffectedSystems(problem) {
    // 実際のシステム構成から影響を受けるシステムを特定
    return ['auth-service', 'api-gateway', 'database'];
  }

  // ビジネス影響の評価
  assessBusinessImpact(problem) {
    const severityMap = {
      low: 'minimal',
      medium: 'moderate',
      high: 'significant',
      critical: 'critical'
    };
    return severityMap[problem.severity] || 'minimal';
  }

  // 予防策の生成メソッド
  async generateCodePreventiveMeasures(problem) {
    return [
      {
        type: 'code_review',
        description: '関連するコードレビューチェックリストの追加',
        implementation: 'コードレビュープロセスの更新'
      }
    ];
  }

  async generateProcessPreventiveMeasures(problem) {
    return [
      {
        type: 'process',
        description: 'デプロイプロセスの改善',
        implementation: 'デプロイチェックリストの追加'
      }
    ];
  }

  async setupMonitoring(problem) {
    return [
      {
        type: 'monitoring',
        description: '関連メトリクスの監視設定',
        implementation: 'ダッシュボードとアラートの設定'
      }
    ];
  }

  async createPreventiveDocumentation(problem) {
    return [
      {
        type: 'documentation',
        description: 'トラブルシューティングガイドの作成',
        implementation: 'ナレッジベースへの追加'
      }
    ];
  }

  // 実装関連のメソッド
  async createImplementationPlan(solution, implementation) {
    return {
      steps: [
        '現在の状態のバックアップ',
        '変更の適用',
        'テストの実行',
        'デプロイ'
      ],
      rollbackPlan: '変更前の状態にロールバック',
      testPlan: '関連する機能テスト'
    };
  }

  async implementSafetyMeasures(problem, solution) {
    return [
      'データベースのバックアップ',
      'システムのスナップショット作成'
    ];
  }

  async applySolution(solution, plan) {
    // 実際の実装ロジック
    return {
      success: true,
      changes: ['設定ファイルの更新', 'コードの修正'],
      timestamp: new Date()
    };
  }

  async verifySolution(problem, solution, implementation) {
    // 実際の検証ロジック
    return {
      success: true,
      tests: ['機能テスト', 'パフォーマンステスト'],
      results: 'すべてのテストがパス'
    };
  }

  async updateDocumentation(problem, solution, implementation) {
    // ドキュメントの更新ロジック
    console.log('📚 ドキュメントを更新しました');
  }

  // ユーティリティメソッド
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

module.exports = { TroubleshootingFramework };
```

:::

## 一般的な問題と解決策

### よくある開発問題のパターン

:::step

1. 問題パターンデータベースの作成

`src/problem-patterns.js`を作成し、一般的な開発問題のパターンと解決策を定義します。

_src/problem-patterns.js_

```javascript
/**
 * 一般的な開発問題のパターンと解決策
 */
const problemPatterns = {
  // ビルド関連の問題
  build: {
    patterns: [
      {
        name: '依存関係の競合',
        symptoms: ['npm install が失敗する', 'ビルドエラーが発生する'],
        causes: ['バージョンの不一致', '互換性のないパッケージ'],
        solutions: [
          'package.json の依存関係を整理',
          'npm audit で脆弱性をチェック',
          'node_modules と package-lock.json を削除して再インストール'
        ],
        prevention: [
          '依存関係の定期的な更新',
          'セマンティックバージョニングの使用',
          'CI/CDでのビルドテスト'
        ]
      },
      {
        name: 'コンパイルエラー',
        symptoms: ['TypeScript のコンパイルエラー', '構文エラー'],
        causes: ['型の不一致', 'インポートの問題', '設定の誤り'],
        solutions: [
          'エラーメッセージを注意深く読む',
          'TypeScript の設定を確認',
          '型定義ファイルをインストール'
        ],
        prevention: [
          'エディタのリアルタイムチェック',
          '事前の型チェック',
          'コードレビューでの型チェック'
        ]
      }
    ]
  },

  // 実行時の問題
  runtime: {
    patterns: [
      {
        name: 'メモリリーク',
        symptoms: ['アプリケーションの遅延', 'クラッシュ', 'メモリ使用量の増加'],
        causes: ['オブジェクトの解放忘れ', 'イベントリスナーの解除忘れ', '無限ループ'],
        solutions: [
          'メモリプロファイリングツールの使用',
          'イベントリスナーの適切な管理',
          'ガベージコレクションの理解'
        ],
        prevention: [
          'メモリ使用量の監視',
          'コードレビューでのメモリ管理チェック',
          '負荷テストの実施'
        ]
      },
      {
        name: 'パフォーマンス問題',
        symptoms: ['レスポンスが遅い', 'CPU 使用率が高い', 'データベースクエリが遅い'],
        causes: ['非効率なアルゴリズム', 'インデックスの不足', 'N+1 クエリ問題'],
        solutions: [
          'パフォーマンスプロファイリング',
          'クエリの最適化',
          'キャッシュの導入',
          'コードの最適化'
        ],
        prevention: [
          'パフォーマンステストの継続的実施',
          'データベースインデックスの設計',
          'アルゴリズムの複雑性の考慮'
        ]
      }
    ]
  },

  // ネットワーク関連の問題
  network: {
    patterns: [
      {
        name: '接続タイムアウト',
        symptoms: ['API 呼び出しがタイムアウト', 'ネットワークエラー'],
        causes: ['ネットワークの遅延', 'サーバーの過負荷', 'ファイアウォールの問題'],
        solutions: [
          'タイムアウト値の調整',
          'リトライメカニズムの実装',
          '接続プールの使用',
          'ヘルスチェックの実装'
        ],
        prevention: [
          '接続の監視',
          '負荷分散の導入',
          'フェイルオーバーの設定'
        ]
      },
      {
        name: 'CORS エラー',
        symptoms: ['ブラウザコンソールに CORS エラー', 'API 呼び出しが失敗'],
        causes: ['オリジンの不一致', 'CORS 設定の不足'],
        solutions: [
          'サーバー側の CORS 設定',
          'プロキシの使用',
          'JSONP の使用（レガシーシステム用）'
        ],
        prevention: [
          '開発環境での CORS 設定',
          'API ドキュメントでの CORS ポリシーの明記'
        ]
      }
    ]
  },

  // データベース関連の問題
  database: {
    patterns: [
      {
        name: 'デッドロック',
        symptoms: ['トランザクションがハングする', 'タイムアウトエラー'],
        causes: ['トランザクションの順序の問題', 'ロックの競合'],
        solutions: [
          'トランザクションの順序の最適化',
          'ロックタイムアウトの設定',
          'デッドロック検出の有効化'
        ],
        prevention: [
          'トランザクションの短縮',
          '適切なインデックスの設計',
          'クエリの最適化'
        ]
      },
      {
        name: 'データの不整合',
        symptoms: ['データの矛盾', '外部キー制約違反'],
        causes: ['トランザクションの不適切な使用', '同時実行制御の問題'],
        solutions: [
          'トランザクションの適切な使用',
          '楽観的ロックまたは悲観的ロックの使用',
          'データベース制約の強化'
        ],
        prevention: [
          'データベース制約の適切な設計',
          'トランザクション分離レベルの理解',
          '整合性チェックの実装'
        ]
      }
    ]
  },

  // セキュリティ関連の問題
  security: {
    patterns: [
      {
        name: '認証の問題',
        symptoms: ['ログインできない', 'セッションが切れる', '権限エラー'],
        causes: ['トークンの有効期限', '設定の誤り', 'セッション管理の問題'],
        solutions: [
          'トークン有効期限の調整',
          '認証設定の確認',
          'セッション管理の改善'
        ],
        prevention: [
          'セキュリティテストの実施',
          '認証フローの定期的なレビュー',
          'セキュリティアップデートの適用'
        ]
      },
      {
        name: 'SQL インジェクション',
        symptoms: ['データの不正アクセス', 'データベースエラー'],
        causes: ['動的 SQL の不適切な使用', 'ユーザー入力の検証不足'],
        solutions: [
          'プリペアドステートメントの使用',
          'ORM フレームワークの使用',
          '入力検証の強化'
        ],
        prevention: [
          '静的コード分析',
          'セキュリティトレーニング',
          '侵入テストの実施'
        ]
      }
    ]
  }
};

class ProblemPatternMatcher {
  constructor() {
    this.patterns = problemPatterns;
  }

  // 問題のパターンマッチング
  matchProblem(symptoms, category = null) {
    const matches = [];

    const categories = category ? [category] : Object.keys(this.patterns);

    for (const cat of categories) {
      if (this.patterns[cat]) {
        for (const pattern of this.patterns[cat].patterns) {
          const matchScore = this.calculateMatchScore(symptoms, pattern.symptoms);
          if (matchScore > 0.3) { // 30% 以上の一致でマッチと見なす
            matches.push({
              ...pattern,
              category: cat,
              matchScore
            });
          }
        }
      }
    }

    // マッチスコアでソート
    return matches.sort((a, b) => b.matchScore - a.matchScore);
  }

  // 解決策の推奨
  recommendSolutions(symptoms, category = null) {
    const matches = this.matchProblem(symptoms, category);
    const recommendations = [];

    matches.forEach(match => {
      recommendations.push({
        problem: match.name,
        category: match.category,
        confidence: match.matchScore,
        causes: match.causes,
        solutions: match.solutions,
        prevention: match.prevention
      });
    });

    return recommendations;
  }

  // マッチスコアの計算
  calculateMatchScore(symptoms, patternSymptoms) {
    if (!symptoms || !patternSymptoms) return 0;

    const symptomSet = new Set(symptoms.map(s => s.toLowerCase()));
    const patternSet = new Set(patternSymptoms.map(s => s.toLowerCase()));

    const intersection = new Set([...symptomSet].filter(x => patternSet.has(x)));
    const union = new Set([...symptomSet, ...patternSet]);

    return intersection.size / union.size;
  }

  // 予防策の取得
  getPreventionMeasures(category) {
    const measures = [];

    if (this.patterns[category]) {
      this.patterns[category].patterns.forEach(pattern => {
        measures.push(...pattern.prevention);
      });
    }

    return [...new Set(measures)]; // 重複を除去
  }

  // 問題の統計情報
  getProblemStatistics() {
    const stats = {};

    Object.keys(this.patterns).forEach(category => {
      stats[category] = {
        patternCount: this.patterns[category].patterns.length,
        commonSymptoms: this.getCommonSymptoms(category),
        topCauses: this.getTopCauses(category)
      };
    });

    return stats;
  }

  // カテゴリ内の一般的な症状
  getCommonSymptoms(category) {
    const symptomCount = {};

    if (this.patterns[category]) {
      this.patterns[category].patterns.forEach(pattern => {
        pattern.symptoms.forEach(symptom => {
          symptomCount[symptom] = (symptomCount[symptom] || 0) + 1;
        });
      });
    }

    return Object.entries(symptomCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([symptom, count]) => ({ symptom, count }));
  }

  // カテゴリ内の主要な原因
  getTopCauses(category) {
    const causeCount = {};

    if (this.patterns[category]) {
      this.patterns[category].patterns.forEach(pattern => {
        pattern.causes.forEach(cause => {
          causeCount[cause] = (causeCount[cause] || 0) + 1;
        });
      });
    }

    return Object.entries(causeCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([cause, count]) => ({ cause, count }));
  }
}

module.exports = { ProblemPatternMatcher, problemPatterns };
```

2. 使用例

`examples/troubleshooting-example.js`を作成し、実際の使用例を示します。

_examples/troubleshooting-example.js_

```javascript
const { TroubleshootingFramework } = require('../src/troubleshooting-framework');
const { ProblemPatternMatcher } = require('../src/problem-patterns');

async function demonstrateTroubleshooting() {
  console.log('🔧 トラブルシューティングのデモ');
  console.log('=' .repeat(60));

  try {
    // 1. フレームワークの初期化
    console.log('\n1. トラブルシューティングフレームワークの初期化');
    const framework = new TroubleshootingFramework();
    const patternMatcher = new ProblemPatternMatcher();

    // 2. 問題の報告
    console.log('\n2. 問題の報告');
    const problem = await framework.reportProblem({
      title: 'API レスポンスが遅い',
      description: 'ユーザー認証 API のレスポンスタイムが平均 5 秒以上かかる',
      category: 'runtime',
      severity: 'high',
      environment: {
        nodeVersion: '18.16.0',
        database: 'PostgreSQL 14',
        loadBalancer: 'nginx'
      },
      reproductions: [
        '高負荷時に再現',
        '特定のユーザーで発生'
      ],
      reportedBy: '山田太郎'
    });

    console.log('📊 問題分析結果:');
    console.log(`  確信度: ${problem.analysis.confidence}`);
    console.log(`  複雑性: ${problem.analysis.estimatedComplexity}`);
    console.log(`  影響ユーザー: ${problem.analysis.impact.users}人`);
    console.log(`  考えられる原因: ${problem.analysis.possibleCauses.length}件`);

    // 3. パターンマッチング
    console.log('\n3. 問題パターンのマッチング');
    const symptoms = [
      'レスポンスが遅い',
      'API 呼び出しがタイムアウト',
      'CPU 使用率が高い'
    ];

    const matches = patternMatcher.matchProblem(symptoms, 'runtime');
    console.log('🔍 マッチしたパターン:');
    matches.forEach((match, index) => {
      console.log(`  ${index + 1}. ${match.name} (${(match.matchScore * 100).toFixed(1)}% 一致)`);
      console.log(`     カテゴリ: ${match.category}`);
      console.log(`     原因: ${match.causes.join(', ')}`);
    });

    // 4. 根本原因分析
    console.log('\n4. 根本原因分析');
    const rootCause = await framework.performRootCauseAnalysis(problem.id);
    console.log('🎯 根本原因:');
    console.log(`  主要原因: ${rootCause.primary}`);
    console.log(`  寄与要因: ${rootCause.contributingFactors.join(' → ')}`);

    // 5. 解決策の生成
    console.log('\n5. 解決策の生成');
    const solutions = await framework.generateSolutions(problem.id);
    console.log('💡 生成された解決策:');
    solutions.solutions.forEach((solution, index) => {
      console.log(`  ${index + 1}. ${solution.title}`);
      console.log(`     複雑さ: ${solution.complexity}`);
      console.log(`     リスク: ${solution.risk}`);
      console.log(`     期間: ${solution.timeframe}`);
      console.log(`     有効性: ${(solution.effectiveness * 100).toFixed(0)}%`);
    });

    console.log(`\n🎯 推奨解決策: ${solutions.recommendation.title}`);

    // 6. 解決策の実装（シミュレーション）
    console.log('\n6. 解決策の実装（シミュレーション）');
    const implementation = {
      implementedBy: 'システム管理者',
      changes: [
        'データベースインデックスの追加',
        'クエリの最適化',
        'キャッシュの導入'
      ]
    };

    const result = await framework.implementSolution(
      problem.id,
      solutions.recommendation.id,
      implementation
    );

    console.log('✅ 実装結果:');
    console.log(`  成功: ${result.success}`);
    console.log(`  検証: ${result.verification.tests.join(', ')}`);

    // 7. 予防策の実装
    console.log('\n7. 予防策の実装');
    const preventiveMeasures = await framework.implementPreventiveMeasures(problem.id);
    console.log('🛡️  実装された予防策:');
    preventiveMeasures.forEach((measure, index) => {
      console.log(`  ${index + 1}. ${measure.type}: ${measure.description}`);
    });

    // 8. 統計情報の表示
    console.log('\n8. 問題パターンの統計');
    const stats = patternMatcher.getProblemStatistics();
    console.log('📊 カテゴリ別統計:');
    Object.entries(stats).forEach(([category, stat]) => {
      console.log(`  ${category}:`);
      console.log(`    パターン数: ${stat.patternCount}`);
      console.log(`    一般的症状: ${stat.commonSymptoms[0]?.symptom || 'なし'} (${stat.commonSymptoms[0]?.count || 0}件)`);
    });

    console.log('\n🎉 トラブルシューティングデモが完了しました！');

    // 9. 問題解決のレポート生成
    console.log('\n9. 問題解決レポート');
    const report = generateTroubleshootingReport(problem, solutions, result);
    console.log(report);

  } catch (error) {
    console.error('❌ エラーが発生しました:', error.message);
  }
}

function generateTroubleshootingReport(problem, solutions, result) {
  return `
📋 問題解決レポート
==================

問題: ${problem.title}
カテゴリ: ${problem.category}
深刻度: ${problem.severity}
報告者: ${problem.reportedBy}

🎯 根本原因: ${problem.rootCause?.primary || '分析中'}

💡 実施した解決策:
${solutions.recommendation.title}
- 複雑さ: ${solutions.recommendation.complexity}
- 期間: ${solutions.recommendation.timeframe}
- 有効性: ${(solutions.recommendation.effectiveness * 100).toFixed(0)}%

✅ 実装結果:
${result.implementation.changes.map(change => `- ${change}`).join('\n')}

🔧 予防策:
${problem.preventiveMeasures?.map(measure => `- ${measure.description}`).join('\n') || '実装中'}

📊 改善効果:
- 問題解決時間: ${Math.floor((new Date() - problem.reportedAt) / 60000)}分
- 予防的措置: ${problem.preventiveMeasures?.length || 0}件
`;
}

// デモの実行
demonstrateTroubleshooting().catch(console.error);
```

:::

## 予防的トラブルシューティング

問題が発生する前に対策を講じることで、多くの問題を未然に防ぐことができます。

### モニタリングと早期検知

:::step

1. モニタリングシステムの実装

`src/monitoring-system.js`を作成し、予防的モニタリングシステムを実装します。

_src/monitoring-system.js_

```javascript
/**
 * 予防的モニタリングシステム
 * 問題の早期検知と警告
 */
class MonitoringSystem {
  constructor() {
    this.metrics = new Map();
    this.alerts = [];
    this.thresholds = new Map();
    this.trends = new Map();
  }

  // メトリクスの収集
  collectMetric(metricName, value, timestamp = new Date()) {
    if (!this.metrics.has(metricName)) {
      this.metrics.set(metricName, []);
    }

    const metricData = {
      value,
      timestamp,
      quality: this.assessDataQuality(value)
    };

    this.metrics.get(metricName).push(metricData);

    // 閾値のチェック
    this.checkThresholds(metricName, value);

    // トレンドの分析
    this.analyzeTrends(metricName);

    // 異常検知
    this.detectAnomalies(metricName, value);

    console.log(`📊 メトリクス収集: ${metricName} = ${value}`);
  }

  // 閾値の設定
  setThreshold(metricName, warning, critical) {
    this.thresholds.set(metricName, { warning, critical });
    console.log(`⚠️  閾値設定: ${metricName} (警告: ${warning}, 危険: ${critical})`);
  }

  // 予測的分析
  async performPredictiveAnalysis(metricName) {
    const metricData = this.metrics.get(metricName);
    if (!metricData || metricData.length < 10) {
      return null;
    }

    console.log(`🔮 ${metricName} の予測分析を実行します...`);

    // トレンド分析
    const trend = this.calculateTrend(metricData);

    // 季節性の検出
    const seasonality = this.detectSeasonality(metricData);

    // 異常パターンの検出
    const anomalies = this.detectAnomalyPatterns(metricData);

    // 予測モデルの適用
    const prediction = await this.generatePrediction(metricData, trend, seasonality);

    const analysis = {
      metricName,
      currentTrend: trend,
      seasonality,
      anomalies,
      prediction,
      confidence: this.calculatePredictionConfidence(metricData, prediction),
      recommendations: await this.generateRecommendations(metricName, prediction)
    };

    console.log('📈 予測分析結果:');
    console.log(`  現在のトレンド: ${trend.direction} (${trend.strength}%)`);
    console.log(`  予測値: ${prediction.value} (${prediction.timeframe})`);
    console.log(`  確信度: ${(analysis.confidence * 100).toFixed(1)}%`);

    return analysis;
  }

  // リアルタイムアラート
  generateRealtimeAlerts() {
    const currentAlerts = [];
    const now = new Date();

    // 各メトリクスをチェック
    for (const [metricName, data] of this.metrics) {
      if (data.length === 0) continue;

      const latestValue = data[data.length - 1].value;
      const threshold = this.thresholds.get(metricName);

      if (threshold) {
        if (latestValue >= threshold.critical) {
          currentAlerts.push({
            level: 'critical',
            metric: metricName,
            value: latestValue,
            threshold: threshold.critical,
            message: `${metricName} が危険レベルに達しました (${latestValue} >= ${threshold.critical})`,
            timestamp: now
          });
        } else if (latestValue >= threshold.warning) {
          currentAlerts.push({
            level: 'warning',
            metric: metricName,
            value: latestValue,
            threshold: threshold.warning,
            message: `${metricName} が警告レベルに達しました (${latestValue} >= ${threshold.warning})`,
            timestamp: now
          });
        }
      }
    }

    this.alerts.push(...currentAlerts);

    if (currentAlerts.length > 0) {
      console.log(`🚨 ${currentAlerts.length}件のアラートを検出`);
      currentAlerts.forEach(alert => {
        console.log(`  ${alert.level.toUpperCase()}: ${alert.message}`);
      });
    }

    return currentAlerts;
  }

  // データ品質の評価
  assessDataQuality(value) {
    if (value === null || value === undefined) return 'missing';
    if (typeof value !== 'number') return 'invalid_type';
    if (!isFinite(value)) return 'infinite';
    return 'good';
  }

  // 閾値のチェック
  checkThresholds(metricName, value) {
    const threshold = this.thresholds.get(metricName);
    if (!threshold) return;

    const dataQuality = this.assessDataQuality(value);
    if (dataQuality !== 'good') {
      console.warn(`⚠️  ${metricName} のデータ品質が ${dataQuality} です`);
      return;
    }

    if (value >= threshold.critical) {
      this.createAlert('critical', metricName, value, threshold.critical);
    } else if (value >= threshold.warning) {
      this.createAlert('warning', metricName, value, threshold.warning);
    }
  }

  // トレンドの分析
  analyzeTrends(metricName) {
    const metricData = this.metrics.get(metricName);
    if (!metricData || metricData.length < 5) return;

    const recentData = metricData.slice(-20); // 最近20件
    const trend = this.calculateTrend(recentData);

    this.trends.set(metricName, {
      trend,
      lastAnalyzed: new Date()
    });

    if (Math.abs(trend.strength) > 10) { // 10%以上の変化で警告
      console.log(`📈 ${metricName} に顕著なトレンドを検出: ${trend.direction} ${trend.strength}%`);
    }
  }

  // トレンドの計算
  calculateTrend(data) {
    if (data.length < 2) return { direction: 'stable', strength: 0 };

    const values = data.map(d => d.value);
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));

    const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;

    const changePercent = ((secondAvg - firstAvg) / firstAvg) * 100;

    return {
      direction: changePercent > 0 ? 'increasing' : changePercent < 0 ? 'decreasing' : 'stable',
      strength: Math.abs(changePercent),
      changePercent
    };
  }

  // 異常検知
  detectAnomalies(metricName, currentValue) {
    const metricData = this.metrics.get(metricName);
    if (!metricData || metricData.length < 10) return;

    const values = metricData.map(d => d.value);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);

    // 3σルールでの異常検知
    const zScore = (currentValue - mean) / stdDev;

    if (Math.abs(zScore) > 3) {
      console.log(`🚨 ${metricName} で異常値を検出: ${currentValue} (Z-score: ${zScore.toFixed(2)})`);
      this.createAlert('anomaly', metricName, currentValue, null, `異常値検出 (Z-score: ${zScore.toFixed(2)})`);
    }
  }

  // 季節性の検出
  detectSeasonality(data) {
    // 簡易的な季節性検出（実際にはより高度なアルゴリズムを使用）
    if (data.length < 24) return null; // 最低24データポイント必要

    const values = data.map(d => d.value);
    const seasonalPattern = this.findSeasonalPattern(values);

    return seasonalPattern;
  }

  // 季節パターンの検出
  findSeasonalPattern(values) {
    // 周期的なパターンを検出（実装は簡略化）
    const patterns = [];
    const periodLengths = [7, 24, 168]; // 日次、時間次、週次

    for (const period of periodLengths) {
      if (values.length >= period * 2) {
        const correlation = this.calculateAutocorrelation(values, period);
        if (correlation > 0.7) {
          patterns.push({ period, correlation });
        }
      }
    }

    return patterns.length > 0 ? patterns : null;
  }

  // 自己相関の計算
  calculateAutocorrelation(values, lag) {
    const n = values.length - lag;
    if (n <= 0) return 0;

    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    let numerator = 0;
    let denominator = 0;

    for (let i = 0; i < n; i++) {
      numerator += (values[i] - mean) * (values[i + lag] - mean);
      denominator += Math.pow(values[i] - mean, 2);
    }

    return denominator > 0 ? numerator / denominator : 0;
  }

  // 予測の生成
  async generatePrediction(data, trend, seasonality) {
    // 簡易的な予測（実際には機械学習モデルを使用）
    const lastValue = data[data.length - 1].value;
    const trendFactor = trend.changePercent / 100;

    let predictedValue = lastValue * (1 + trendFactor);

    // 季節性の調整
    if (seasonality) {
      const seasonalFactor = this.calculateSeasonalFactor(seasonality);
      predictedValue *= seasonalFactor;
    }

    return {
      value: Math.round(predictedValue * 100) / 100,
      timeframe: '24時間',
      confidence: this.calculatePredictionConfidence(data, { value: predictedValue })
    };
  }

  // 季節性因子の計算
  calculateSeasonalFactor(seasonality) {
    // 季節性パターンに基づいた調整因子を計算
    // 実際の実装ではより複雑な計算を行う
    return 1.0; // 簡略化のため1.0を返す
  }

  // 予測確信度の計算
  calculatePredictionConfidence(data, prediction) {
    // データの品質、トレンドの安定性、履歴の長さに基づいて確信度を計算
    const dataQuality = data.filter(d => d.quality === 'good').length / data.length;
    const trendStability = Math.abs(this.calculateTrend(data).changePercent) < 20 ? 1 : 0.8;
    const historyLength = Math.min(data.length / 100, 1); // 100データポイントで最大1.0

    return (dataQuality * 0.4 + trendStability * 0.3 + historyLength * 0.3);
  }

  // 推奨事項の生成
  async generateRecommendations(metricName, prediction) {
    const threshold = this.thresholds.get(metricName);
    const recommendations = [];

    if (threshold && prediction.value >= threshold.warning) {
      recommendations.push({
        type: 'preventive',
        message: `${metricName} が警告閾値に近づいています。予防的措置を検討してください。`,
        actions: [
          'リソースの追加割り当て',
          'パフォーマンスチューニング',
          '負荷分散の見直し'
        ]
      });
    }

    const trend = this.trends.get(metricName)?.trend;
    if (trend && trend.direction === 'increasing' && trend.strength > 5) {
      recommendations.push({
        type: 'optimization',
        message: `${metricName} が増加傾向にあります。最適化を検討してください。`,
        actions: [
          'キャッシュの導入',
          'クエリの最適化',
          'アーキテクチャの見直し'
        ]
      });
    }

    return recommendations;
  }

  // 異常パターンの検出
  detectAnomalyPatterns(metricData) {
    // 時系列データにおける異常パターンを検出
    const anomalies = [];
    const values = metricData.map(d => d.value);

    // 突発的な変化の検出
    for (let i = 1; i < values.length; i++) {
      const change = Math.abs(values[i] - values[i - 1]);
      const avgChange = values.reduce((sum, val, idx) => {
        if (idx === 0) return 0;
        return sum + Math.abs(val - values[idx - 1]);
      }, 0) / (values.length - 1);

      if (change > avgChange * 3) {
        anomalies.push({
          type: 'sudden_change',
          index: i,
          value: values[i],
          change: change
        });
      }
    }

    return anomalies;
  }

  // アラートの作成
  createAlert(level, metric, value, threshold, customMessage = null) {
    const alert = {
      id: this.generateAlertId(),
      level,
      metric,
      value,
      threshold,
      message: customMessage || `${metric} alert: ${value} ${threshold ? `>= ${threshold}` : ''}`,
      timestamp: new Date(),
      acknowledged: false
    };

    this.alerts.push(alert);
    console.log(`🚨 アラート生成: ${alert.message}`);

    return alert;
  }

  // アラートIDの生成
  generateAlertId() {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // ヘルスチェックの実行
  async performHealthCheck() {
    console.log('🏥 システムヘルスチェックを実行します...');

    const healthStatus = {
      overall: 'healthy',
      metrics: {},
      alerts: [],
      recommendations: []
    };

    // 各メトリクスのヘルスチェック
    for (const [metricName, data] of this.metrics) {
      if (data.length === 0) continue;

      const latest = data[data.length - 1];
      const threshold = this.thresholds.get(metricName);
      const trend = this.trends.get(metricName)?.trend;

      let status = 'healthy';
      if (threshold && latest.value >= threshold.critical) {
        status = 'critical';
      } else if (threshold && latest.value >= threshold.warning) {
        status = 'warning';
      } else if (trend && trend.strength > 15) {
        status = 'degraded';
      }

      healthStatus.metrics[metricName] = {
        status,
        value: latest.value,
        timestamp: latest.timestamp,
        trend: trend?.direction || 'stable'
      };

      if (status !== 'healthy') {
        healthStatus.overall = 'unhealthy';
      }
    }

    // 推奨事項の生成
    healthStatus.recommendations = await this.generateHealthRecommendations(healthStatus);

    // 最近のアラート
    const recentAlerts = this.alerts.filter(a =>
      new Date() - a.timestamp < 24 * 60 * 60 * 1000 // 24時間以内
    );
    healthStatus.alerts = recentAlerts;

    console.log('🏥 ヘルスチェック結果:');
    console.log(`  全体状態: ${healthStatus.overall}`);
    console.log(`  チェックしたメトリクス: ${Object.keys(healthStatus.metrics).length}`);
    console.log(`  アクティブなアラート: ${healthStatus.alerts.length}`);

    return healthStatus;
  }

  // ヘルスチェックに基づいた推奨事項の生成
  async generateHealthRecommendations(healthStatus) {
    const recommendations = [];

    Object.entries(healthStatus.metrics).forEach(([metric, status]) => {
      if (status.status === 'critical') {
        recommendations.push({
          priority: 'high',
          metric,
          message: `${metric} が危険状態です。即時対応が必要です。`,
          actions: ['原因調査', '緊急対策の実施', 'ステークホルダーへの報告']
        });
      } else if (status.status === 'warning') {
        recommendations.push({
          priority: 'medium',
          metric,
          message: `${metric} が警告状態です。監視を強化してください。`,
          actions: ['経過観察', '予防策の検討', 'しきい値の見直し']
        });
      } else if (status.status === 'degraded') {
        recommendations.push({
          priority: 'low',
          metric,
          message: `${metric} のパフォーマンスが低下しています。`,
          actions: ['トレンド分析', '最適化の検討', 'リソース計画']
        });
      }
    });

    return recommendations;
  }

  // レポートの生成
  generateReport(timeRange = '24h') {
    const report = {
      generatedAt: new Date(),
      timeRange,
      summary: {
        totalMetrics: this.metrics.size,
        totalAlerts: this.alerts.length,
        activeThresholds: this.thresholds.size
      },
      metrics: {},
      alerts: this.alerts.slice(-10), // 最近10件
      health: {}
    };

    // 各メトリクスのサマリー
    for (const [metricName, data] of this.metrics) {
      if (data.length === 0) continue;

      const values = data.map(d => d.value);
      const latest = data[data.length - 1];

      report.metrics[metricName] = {
        currentValue: latest.value,
        min: Math.min(...values),
        max: Math.max(...values),
        average: values.reduce((sum, val) => sum + val, 0) / values.length,
        trend: this.trends.get(metricName)?.trend || { direction: 'stable', strength: 0 },
        dataPoints: data.length,
        lastUpdate: latest.timestamp
      };
    }

    return report;
  }
}

module.exports = { MonitoringSystem };
```

2. 使用例

`examples/monitoring-example.js`を作成します。

_examples/monitoring-example.js_

```javascript
const { MonitoringSystem } = require('../src/monitoring-system');

async function demonstrateMonitoring() {
  console.log('📊 予防的モニタリングのデモ');
  console.log('=' .repeat(60));

  try {
    // 1. モニタリングシステムの初期化
    console.log('\n1. モニタリングシステムの初期化');
    const monitoring = new MonitoringSystem();

    // 2. 閾値の設定
    console.log('\n2. 監視閾値の設定');
    monitoring.setThreshold('cpu_usage', 70, 90);
    monitoring.setThreshold('memory_usage', 80, 95);
    monitoring.setThreshold('response_time', 1000, 3000);
    monitoring.setThreshold('error_rate', 1, 5);

    // 3. メトリクスデータのシミュレーション
    console.log('\n3. メトリクス収集のシミュレーション');
    const metrics = ['cpu_usage', 'memory_usage', 'response_time', 'error_rate'];

    for (let i = 0; i < 50; i++) {
      for (const metric of metrics) {
        // 現実的な値の生成
        let value;
        switch (metric) {
          case 'cpu_usage':
            value = Math.random() * 100;
            break;
          case 'memory_usage':
            value = 60 + Math.random() * 40;
            break;
          case 'response_time':
            value = Math.random() * 5000;
            break;
          case 'error_rate':
            value = Math.random() * 10;
            break;
        }

        monitoring.collectMetric(metric, value);

        // 100ミリ秒待機
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    // 4. リアルタイムアラートの生成
    console.log('\n4. リアルタイムアラートのチェック');
    const alerts = monitoring.generateRealtimeAlerts();
    console.log(`🚨 ${alerts.length}件のアラートを検出`);

    // 5. 予測分析の実行
    console.log('\n5. 予測分析の実行');
    for (const metric of metrics) {
      const analysis = await monitoring.performPredictiveAnalysis(metric);
      if (analysis) {
        console.log(`\n📈 ${metric} の分析結果:`);
        console.log(`  予測値: ${analysis.prediction.value} (${analysis.prediction.timeframe})`);
        console.log(`  確信度: ${(analysis.confidence * 100).toFixed(1)}%`);

        if (analysis.recommendations.length > 0) {
          console.log('  推奨事項:');
          analysis.recommendations.forEach(rec => {
            console.log(`    - ${rec.message}`);
          });
        }
      }
    }

    // 6. ヘルスチェックの実行
    console.log('\n6. システムヘルスチェック');
    const health = await monitoring.performHealthCheck();
    console.log(`🏥 全体状態: ${health.overall}`);
    console.log(`📊 メトリクス状態:`);
    Object.entries(health.metrics).forEach(([metric, status]) => {
      const emoji = status.status === 'healthy' ? '✅' :
                   status.status === 'warning' ? '⚠️' : '🚨';
      console.log(`  ${emoji} ${metric}: ${status.value.toFixed(1)} (${status.status})`);
    });

    // 7. 予防的措置の提案
    console.log('\n7. 予防的措置の提案');
    if (health.recommendations.length > 0) {
      health.recommendations.forEach((rec, index) => {
        const priorityEmoji = rec.priority === 'high' ? '🔴' :
                              rec.priority === 'medium' ? '🟡' : '🟢';
        console.log(`${priorityEmoji} ${index + 1}. ${rec.message}`);
        console.log(`   対策: ${rec.actions.join(', ')}`);
      });
    }

    // 8. モニタリングレポートの生成
    console.log('\n8. モニタリングレポート');
    const report = monitoring.generateReport();
    console.log('📋 レポートサマリー:');
    console.log(`  生成時刻: ${report.generatedAt.toLocaleString()}`);
    console.log(`  監視メトリクス: ${report.summary.totalMetrics}`);
    console.log(`  総アラート数: ${report.summary.totalAlerts}`);
    console.log(`  設定済み閾値: ${report.summary.activeThresholds}`);

    console.log('\n🎉 予防的モニタリングデモが完了しました！');

  } catch (error) {
    console.error('❌ エラーが発生しました:', error.message);
  }
}

// デモの実行
demonstrateMonitoring().catch(console.error);
```

:::

## まとめ

このページでは、Claude Codeを活用したトラブルシューティングの体系的なアプローチについて学びました。問題発生時の迅速な対応だけでなく、予防的なアプローチを組み合わせることで、システムの信頼性と安定性を大幅に向上させることができます。

:::note 要点のまとめ

- 体系的な問題解決フレームワークで効果的なトラブルシューティングを実現
- 5 Whysや魚骨図などの分析手法で根本原因を特定
- 問題パターンのデータベースで過去の経験を活用
- 予防的モニタリングで問題を早期検知・防止
- Claude Codeを活用した自動分析で解決効率を向上
- 解決策の実装と検証で確実な問題解決を確保

:::

## 関連記事

[チーム開発の基礎](../team-development-basics/team-development-basics.md)
[バージョン管理とGit](../version-control/version-control.md)
[コーディング規約](../coding-standards/coding-standards.md)
[実践的なワークフロー](../practical-workflows/practical-workflows.md)