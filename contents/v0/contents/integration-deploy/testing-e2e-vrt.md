---
title: "E2Eテストとビジュアルリグレッションテスト | Playwright/VRTの実践ガイド"
slug: testing-e2e-vrt
status: publish
post_type: page
seo_keywords: "E2Eテスト, ビジュアルリグレッション, Playwright, VRT, 自動テスト, v0"
seo_description: "v0プロジェクトのE2Eテストとビジュアルリグレッションテストに関する包括的なガイド。Playwrightを使った自動テストの実装方法とVRTによる品質保証を解説します。"
tags: ["E2Eテスト", "ビジュアルリグレッション", "Playwright", "VRT", "自動テスト", "v0"]
image: "/images/v0/testing-e2e-vrt.jpg"
parent: "integration-deploy"
---

## 🧪 はじめに

v0プロジェクトの品質を保証し、リリース後の回帰を防ぐためには、包括的なテスト戦略が不可欠です。E2E（End-to-End）テストはユーザーの操作をシミュレートし、ビジュアルリグレッションテスト（VRT）はUIの意図しない変更を検出します。このページでは、Playwrightを使ったE2EテストとVRTの実装方法について、実践的なノウハウを詳しく解説します。

### このページで学べる事

- E2Eテストの基本概念と重要性
- Playwrightを使った自動テストの実装方法
- ビジュアルリグレッションテストの導入と運用
- CI/CDパイプラインへのテスト統合
- テストカバレッジの向上とメンテナンス

:::note 学習目標

- E2Eテストの設計と実装ができる
- Playwrightの機能を最大限に活用できる
- VRTによるUI品質保証を実現できる
- CI/CDでの自動テストを構築できる
- テストのメンテナンスコストを最適化できる

:::

## 🔍 E2Eテストの基本

E2Eテストは、アプリケーションのフロントエンドからバックエンドまで、ユーザーの操作を完全にシミュレートするテスト手法です。

### E2Eテストの利点

- **現実的なシナリオテスト**: ユーザーの実際の操作を再現
- **統合テスト**: フロントエンドとバックエンドの連携を確認
- **回帰テスト**: 新機能追加による既存機能の影響を検出
- **信頼性向上**: 本番環境での問題を事前に発見

### E2Eテストの種類

1. **ハッピーパステスト**: 正常系フローのテスト
2. **エラーハンドリングテスト**: 異常系の処理確認
3. **パフォーマンステスト**: レスポンス時間の計測
4. **クロスブラウザテスト**: 複数ブラウザでの動作確認

:::note E2Eテストの重要性

E2Eテストは、ユーザー体験を直接検証できる最も効果的なテスト手法です。v0プロジェクトでは、複雑なユーザーインタラクションや外部サービス連携など、ユニットテストだけでは検証できない部分をE2Eテストでカバーすることで、製品の品質と信頼性を大幅に向上させることができます。

:::

## 🎭 Playwrightのセットアップ

Playwrightは、Microsoftが開発したモダンなE2Eテストフレームワークで、高速で信頼性の高いテストを実現します。

### Playwrightのインストールと設定

:::step

1. Playwrightのインストール

```bash
# Playwrightのインストール
npm install -D @playwright/test

# Playwrightブラウザのインストール
npx playwright install
```

2. 設定ファイルの作成

```javascript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

3. テスト用環境変数の設定

```bash
# .env.test
NEXT_PUBLIC_API_URL=http://localhost:3000/api
DATABASE_URL=postgresql://test:test@localhost:5432/test_db
```

4. テスト用データベースのセットアップ

```typescript
// tests/setup.ts
import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';

export async function setupTestDatabase() {
  // テスト用データベースの作成
  execSync('createdb test_db || true');

  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: 'postgresql://test:test@localhost:5432/test_db',
      },
    },
  });

  // マイグレーションの実行
  await prisma.$executeRaw`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(255),
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;

  await prisma.$disconnect();
}

export async function teardownTestDatabase() {
  // テスト用データベースのクリーンアップ
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: 'postgresql://test:test@localhost:5432/test_db',
      },
    },
  });

  await prisma.user.deleteMany();
  await prisma.$disconnect();
}
```

:::

## 🧪 基本的なE2Eテストの実装

それでは、実際にE2Eテストを実装してみましょう。

### ログイン機能のテスト

:::step

1. ログインページのテスト

```typescript
// tests/auth/login.spec.ts
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // テスト前にデータベースをクリーンアップ
  await page.goto('/login');
});

test.describe('ログイン機能', () => {
  test('正常なログインができること', async ({ page }) => {
    // ログインフォームに値を入力
    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="password"]', 'password123');

    // ログインボタンをクリック
    await page.click('[data-testid="login-button"]');

    // ダッシュボードにリダイレクトされることを確認
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('無効な認証情報でエラーが表示されること', async ({ page }) => {
    // 無効な認証情報を入力
    await page.fill('[data-testid="email"]', 'invalid@example.com');
    await page.fill('[data-testid="password"]', 'wrongpassword');

    // ログインボタンをクリック
    await page.click('[data-testid="login-button"]');

    // エラーメッセージが表示されることを確認
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toHaveText(
      'メールアドレスまたはパスワードが正しくありません'
    );
  });

  test('必須フィールドが空の場合にバリデーションエラーが表示されること', async ({ page }) => {
    // 空のままログインボタンをクリック
    await page.click('[data-testid="login-button"]');

    // バリデーションエラーが表示されることを確認
    await expect(page.locator('[data-testid="email-error"])).toBeVisible();
    await expect(page.locator('[data-testid="password-error"])).toBeVisible();
  });
});
```

2. ユーザー登録機能のテスト

```typescript
// tests/auth/register.spec.ts
import { test, expect } from '@playwright/test';

test.describe('ユーザー登録機能', () => {
  test('新しいユーザーが登録できること', async ({ page }) => {
    await page.goto('/register');

    // 登録フォームに値を入力
    await page.fill('[data-testid="name"]', 'テストユーザー');
    await page.fill('[data-testid="email"]', 'newuser@example.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.fill('[data-testid="confirm-password"]', 'password123');

    // 登録ボタンをクリック
    await page.click('[data-testid="register-button"]');

    // 登録成功メッセージが表示されることを確認
    await expect(page.locator('[data-testid="success-message"])).toBeVisible();
    await expect(page.locator('[data-testid="success-message"])).toHaveText(
      '登録が完了しました'
    );
  });

  test('既に使用されているメールアドレスで登録できないこと', async ({ page }) => {
    await page.goto('/register');

    // 既存のメールアドレスで登録を試みる
    await page.fill('[data-testid="name"]', 'テストユーザー');
    await page.fill('[data-testid="email"]', 'existing@example.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.fill('[data-testid="confirm-password"]', 'password123');

    // 登録ボタンをクリック
    await page.click('[data-testid="register-button"]');

    // エラーメッセージが表示されることを確認
    await expect(page.locator('[data-testid="error-message"])).toBeVisible();
  });
});
```

:::

### 製品ページのテスト

:::step

1. 製品一覧ページのテスト

```typescript
// tests/products/products.spec.ts
import { test, expect } from '@playwright/test';

test.describe('製品ページ', () => {
  test.beforeEach(async ({ page }) => {
    // テスト用データのセットアップ
    await page.goto('/products');
  });

  test('製品一覧が正しく表示されること', async ({ page }) => {
    // 製品カードが表示されることを確認
    const productCards = page.locator('[data-testid="product-card"]');
    await expect(productCards).toHaveCount(3); // 3つの製品が表示されるはず

    // 最初の製品の情報を確認
    const firstProduct = productCards.first();
    await expect(firstProduct.locator('[data-testid="product-name"])).toBeVisible();
    await expect(firstProduct.locator('[data-testid="product-price"])).toBeVisible();
  });

  test('製品の詳細ページに移動できること', async ({ page }) => {
    // 最初の製品をクリック
    await page.click('[data-testid="product-card"]:first-child');

    // 詳細ページに移動したことを確認
    await expect(page).toHaveURL(/\/products\/.+/);
    await expect(page.locator('[data-testid="product-detail"])).toBeVisible();
  });

  test('製品を検索できること', async ({ page }) => {
    // 検索ボックスに製品名を入力
    await page.fill('[data-testid="search-input"]', 'テスト製品');

    // 検索結果が更新されることを確認
    const productCards = page.locator('[data-testid="product-card"]');
    await expect(productCards).toHaveCount(1); // 1つの製品に絞り込まれるはず
  });

  test('製品を価格順にソートできること', async ({ page }) => {
    // 価格の高い順にソート
    await page.selectOption('[data-testid="sort-select"]', 'price-desc');

    // 価格が降順に表示されることを確認
    const prices = await page.locator('[data-testid="product-price"]').allTextContents();
    const numericPrices = prices.map(p => parseInt(p.replace(/[^0-9]/g, '')));

    // 価格が降順であることを確認
    for (let i = 0; i < numericPrices.length - 1; i++) {
      expect(numericPrices[i]).toBeGreaterThanOrEqual(numericPrices[i + 1]);
    }
  });
});
```

2. 製品購入フローのテスト

```typescript
// tests/products/checkout.spec.ts
import { test, expect } from '@playwright/test';

test.describe('購入フロー', () => {
  test.beforeEach(async ({ page }) => {
    // テスト用ユーザーでログイン
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="login-button"]');

    // 製品ページに移動
    await page.goto('/products');
  });

  test('製品をカートに追加できること', async ({ page }) => {
    // 最初の製品をカートに追加
    await page.click('[data-testid="add-to-cart-button"]:first-child');

    // カートアイコンに数量が表示されることを確認
    await expect(page.locator('[data-testid="cart-count"])).toHaveText('1');
  });

  test('カートから購入できること', async ({ page }) => {
    // 製品をカートに追加
    await page.click('[data-testid="add-to-cart-button"]:first-child');

    // カートページに移動
    await page.click('[data-testid="cart-button"]');

    // 購入ボタンをクリック
    await page.click('[data-testid="checkout-button"]');

    // 決済ページに移動したことを確認
    await expect(page).toHaveURL('/checkout');
    await expect(page.locator('[data-testid="checkout-form"])).toBeVisible();
  });
});
```

:::

## 🎨 ビジュアルリグレッションテストの実装

ビジュアルリグレッションテスト（VRT）は、UIの意図しない変更を自動的に検出する強力な手法です。

### VRTのセットアップ

:::step

1. VRT用ライブラリのインストール

```bash
npm install -D @playwright/test pixelmatch
```

2. VRT設定の追加

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // 既存の設定...

  use: {
    // 既存の設定...
    screenshot: 'only-on-failure',
  },

  // VRT用の設定を追加
  expect: {
    toMatchSnapshot: {
      threshold: 0.2, // 20%までの差異を許容
      maxDiffPixels: 100, // 最大100ピクセルまでの差異を許容
    },
  },
});
```

3. VRTユーティリティの作成

```typescript
// tests/utils/visual-testing.ts
import { Page, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export class VisualTesting {
  private screenshotsDir = path.join(__dirname, '..', 'screenshots');

  constructor(private page: Page) {
    // スクリーンショットディレクトリの作成
    if (!fs.existsSync(this.screenshotsDir)) {
      fs.mkdirSync(this.screenshotsDir, { recursive: true });
    }
  }

  async takeScreenshot(name: string, options?: {
    fullPage?: boolean;
    selector?: string;
  }) {
    const screenshotPath = path.join(this.screenshotsDir, `${name}.png`);

    if (options?.selector) {
      const element = this.page.locator(options.selector);
      await element.screenshot({ path: screenshotPath });
    } else {
      await this.page.screenshot({
        path: screenshotPath,
        fullPage: options?.fullPage ?? false,
      });
    }

    return screenshotPath;
  }

  async compareWithBaseline(name: string, options?: {
    fullPage?: boolean;
    selector?: string;
    threshold?: number;
  }) {
    const baselinePath = path.join(this.screenshotsDir, 'baseline', `${name}.png`);
    const currentPath = path.join(this.screenshotsDir, 'current', `${name}.png`);
    const diffPath = path.join(this.screenshotsDir, 'diff', `${name}.png`);

    // ディレクトリの作成
    [
      path.join(this.screenshotsDir, 'baseline'),
      path.join(this.screenshotsDir, 'current'),
      path.join(this.screenshotsDir, 'diff'),
    ].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    // 現在のスクリーンショットを撮影
    await this.takeScreenshot(name, options);

    // ベースラインが存在しない場合は作成
    if (!fs.existsSync(baselinePath)) {
      fs.copyFileSync(currentPath, baselinePath);
      console.log(`ベースラインを作成しました: ${name}`);
      return;
    }

    // スクリーンショットを移動
    fs.renameSync(currentPath, path.join(this.screenshotsDir, 'current', `${name}.png`));

    // 比較ロジックをここに実装
    // 実際の実装ではpixelmatchなどのライブラリを使用
    console.log(`VRT比較を実行: ${name}`);
  }
}
```

:::

### VRTテストの実装

:::step

1. ページ全体のVRT

```typescript
// tests/visual/home-page.spec.ts
import { test, expect } from '@playwright/test';
import { VisualTesting } from '../utils/visual-testing';

test.describe('ホームページのVRT', () => {
  test('ホームページのビジュアルリグレッションを検出', async ({ page }) => {
    await page.goto('/');

    const visualTesting = new VisualTesting(page);
    await visualTesting.compareWithBaseline('home-page', {
      fullPage: true,
      threshold: 0.1,
    });
  });

  test('モバイル表示のVRT', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const visualTesting = new VisualTesting(page);
    await visualTesting.compareWithBaseline('home-page-mobile', {
      fullPage: true,
      threshold: 0.15, // モバイルは少し許容度を広げる
    });
  });
});
```

2. コンポーネント単位のVRT

```typescript
// tests/visual/components.spec.ts
import { test, expect } from '@playwright/test';
import { VisualTesting } from '../utils/visual-testing';

test.describe('コンポーネントのVRT', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components');
  });

  test('ボタンコンポーネントのVRT', async ({ page }) => {
    const visualTesting = new VisualTesting(page);
    await visualTesting.compareWithBaseline('button-component', {
      selector: '[data-testid="button-group"]',
      threshold: 0.05,
    });
  });

  test('カードコンポーネントのVRT', async ({ page }) => {
    const visualTesting = new VisualTesting(page);
    await visualTesting.compareWithBaseline('card-component', {
      selector: '[data-testid="product-card"]:first-child',
      threshold: 0.1,
    });
  });

  test('フォームコンポーネントのVRT', async ({ page }) => {
    const visualTesting = new VisualTesting(page);
    await visualTesting.compareWithBaseline('form-component', {
      selector: '[data-testid="login-form"]',
      threshold: 0.08,
    });
  });
});
```

3. 異なる状態のVRT

```typescript
// tests/visual/states.spec.ts
import { test, expect } from '@playwright/test';
import { VisualTesting } from '../utils/visual-testing';

test.describe('状態ごとのVRT', () => {
  test('エラー状態のVRT', async ({ page }) => {
    await page.goto('/login');

    // エラー状態をトリガー
    await page.click('[data-testid="login-button"]');

    const visualTesting = new VisualTesting(page);
    await visualTesting.compareWithBaseline('login-error-state', {
      selector: '[data-testid="login-form"]',
      threshold: 0.05,
    });
  });

  test('ローディング状態のVRT', async ({ page }) => {
    await page.goto('/products');

    // ローディング状態をシミュレート
    await page.evaluate(() => {
      document.querySelector('[data-testid="loading-spinner"]')?.classList.remove('hidden');
    });

    const visualTesting = new VisualTesting(page);
    await visualTesting.compareWithBaseline('loading-state', {
      selector: '[data-testid="loading-spinner"]',
      threshold: 0.1,
    });
  });

  test('ダークモードのVRT', async ({ page }) => {
    await page.goto('/');

    // ダークモードを有効化
    await page.click('[data-testid="theme-toggle"]');
    await page.waitForTimeout(500); // テーマ切り替えアニメーション待ち

    const visualTesting = new VisualTesting(page);
    await visualTesting.compareWithBaseline('dark-mode', {
      fullPage: true,
      threshold: 0.1,
    });
  });
});
```

:::

## 🔄 CI/CDへの統合

テストをCI/CDパイプラインに統合することで、コードの品質を継続的に保証できます。

### GitHub Actionsの設定

```yaml
# .github/workflows/e2e-tests.yml
name: E2E Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  e2e-tests:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: test
          POSTGRES_USER: test
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Install Playwright
      run: npx playwright install --with-deps

    - name: Setup environment
      run: |
        echo "DATABASE_URL=postgresql://test:test@localhost:5432/test_db" >> $GITHUB_ENV
        echo "NEXT_PUBLIC_API_URL=http://localhost:3000/api" >> $GITHUB_ENV

    - name: Run database migrations
      run: npx prisma db push

    - name: Start application
      run: npm run build && npm start &
      env:
        PORT: 3000

    - name: Wait for application
      run: |
        for i in {1..30}; do
          if curl -f http://localhost:3000 > /dev/null 2>&1; then
            echo "Application is ready"
            break
          fi
          echo "Waiting for application..."
          sleep 1
        done

    - name: Run E2E tests
      run: npx playwright test

    - name: Upload test results
      if: always()
      uses: actions/upload-artifact@v3
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

### VRT用のGitHub Actions

```yaml
# .github/workflows/vrt-tests.yml
name: Visual Regression Tests

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  vrt-tests:
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

    - name: Install Playwright
      run: npx playwright install --with-deps

    - name: Download baseline screenshots
      if: github.event_name == 'pull_request'
      run: |
        aws s3 sync s3://v0-screenshots/baseline/ tests/screenshots/baseline/ --delete
      env:
        AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
        AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        AWS_REGION: ${{ secrets.AWS_REGION }}

    - name: Start application
      run: npm run build && npm start &
      env:
        PORT: 3000

    - name: Wait for application
      run: |
        for i in {1..30}; do
          if curl -f http://localhost:3000 > /dev/null 2>&1; then
            echo "Application is ready"
            break
          fi
          echo "Waiting for application..."
          sleep 1
        done

    - name: Run VRT tests
      run: npx playwright test --grep "VRT"

    - name: Upload baseline screenshots
      if: github.ref == 'refs/heads/main'
      run: |
        aws s3 sync tests/screenshots/baseline/ s3://v0-screenshots/baseline/ --delete
      env:
        AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
        AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        AWS_REGION: ${{ secrets.AWS_REGION }}

    - name: Upload VRT results
      if: always()
      uses: actions/upload-artifact@v3
      with:
        name: vrt-results
        path: |
          tests/screenshots/current/
          tests/screenshots/diff/
        retention-days: 30
```

## 🛠️ テストの最適化とメンテナンス

テストを長期的に運用するためのベストプラクティスを紹介します。

### テストのパフォーマンス最適化

```typescript
// tests/utils/test-helpers.ts
import { Page } from '@playwright/test';

export class TestHelpers {
  // 共通のセットアップ処理
  static async setupTestUser(page: Page) {
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('[data-testid="login-button"]');
  }

  // 待機処理のヘルパー
  static async waitForStableDOM(page: Page, timeout = 5000) {
    await page.waitForFunction(() => {
      return document.readyState === 'complete';
    }, { timeout });

    await page.waitForTimeout(100); // 追加の安定化待機
  }

  // ネットワーク待機のヘルパー
  static async waitForNetworkIdle(page: Page, timeout = 5000) {
    await page.waitForLoadState('networkidle', { timeout });
  }

  // スクリーンショット比較のヘルパー
  static async expectScreenshot(page: Page, name: string, options?: {
    threshold?: number;
    selector?: string;
  }) {
    const threshold = options?.threshold ?? 0.1;

    if (options?.selector) {
      const element = page.locator(options.selector);
      await expect(element).toHaveScreenshot(name, {
        threshold,
        maxDiffPixels: 100,
      });
    } else {
      await expect(page).toHaveScreenshot(name, {
        threshold,
        maxDiffPixels: 100,
      });
    }
  }
}
```

### テストデータの管理

```typescript
// tests/fixtures/test-data.ts
export const testUsers = [
  {
    email: 'test@example.com',
    password: 'password123',
    name: 'テストユーザー',
  },
  {
    email: 'admin@example.com',
    password: 'admin123',
    name: '管理者',
  },
];

export const testProducts = [
  {
    name: 'テスト製品1',
    description: 'これはテスト製品です',
    price: 1000,
  },
  {
    name: 'テスト製品2',
    description: 'これは別のテスト製品です',
    price: 2000,
  },
];

export const testScenarios = {
  successfulLogin: {
    email: 'test@example.com',
    password: 'password123',
    expectedUrl: '/dashboard',
  },
  failedLogin: {
    email: 'invalid@example.com',
    password: 'wrongpassword',
    expectedError: 'メールアドレスまたはパスワードが正しくありません',
  },
};
```

### カスタムマッチャーの実装

```typescript
// tests/utils/custom-matchers.ts
import { expect } from '@playwright/test';

// カスタムマッチャー：アクセシビリティチェック
expect.extend({
  async toBeAccessible(page: Page, selector: string) {
    const element = page.locator(selector);
    const isAccessible = await element.evaluate((el) => {
      // 簡単なアクセシビリティチェック
      const hasAlt = el.tagName === 'IMG' && el.hasAttribute('alt');
      const hasLabel = el.tagName === 'INPUT' && el.hasAttribute('aria-label');
      const hasRole = el.hasAttribute('role');

      return hasAlt || hasLabel || hasRole;
    });

    return {
      pass: isAccessible,
      message: () => `Expected element ${selector} to be accessible`,
    };
  },
});

// カスタムマッチャー：レスポンシブチェック
expect.extend({
  async toBeResponsive(page: Page, selector: string) {
    const viewports = [
      { width: 375, height: 667 },  // Mobile
      { width: 768, height: 1024 },  // Tablet
      { width: 1920, height: 1080 }, // Desktop
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      const element = page.locator(selector);
      const isVisible = await element.isVisible();

      if (!isVisible) {
        return {
          pass: false,
          message: () => `Element ${selector} is not visible at ${viewport.width}x${viewport.height}`,
        };
      }
    }

    return {
      pass: true,
      message: () => `Element ${selector} is responsive`,
    };
  },
});
```

## 🎯 実践演習：包括的なテストスイートの構築

それでは、これまで学んだ技術を組み合わせて、包括的なテストスイートを構築してみましょう。

:::step

1. テストプロジェクトのセットアップ

```bash
# 新しいプロジェクトの作成
npx create-next-app@latest v0-testing --typescript --tailwind --eslint --app

# 必要なパッケージのインストール
cd v0-testing
npm install -D @playwright/test @prisma/client
npx playwright install
```

2. テスト設定ファイルの作成

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

3. 統合テストスイートの実装

```typescript
// tests/integration/complete-flow.spec.ts
import { test, expect } from '@playwright/test';
import { TestHelpers } from '../utils/test-helpers';

test.describe('統合テスト：完全なユーザーフロー', () => {
  test('新規ユーザー登録から購入までの完全なフロー', async ({ page }) => {
    // 1. ホームページにアクセス
    await page.goto('/');
    await expect(page).toHaveTitle(/v0 Testing/);

    // 2. 新規登録ページに移動
    await page.click('[data-testid="register-link"]');
    await expect(page).toHaveURL('/register');

    // 3. ユーザー登録
    await page.fill('[data-testid="name"]', '統合テストユーザー');
    await page.fill('[data-testid="email"]', 'integration@example.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.fill('[data-testid="confirm-password"]', 'password123');
    await page.click('[data-testid="register-button"]');

    // 4. 登録成功を確認
    await expect(page.locator('[data-testid="success-message"])).toBeVisible();
    await page.click('[data-testid="continue-to-dashboard"]');

    // 5. ダッシュボードを確認
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="welcome-message"])).toContainText('統合テストユーザー');

    // 6. 製品ページに移動
    await page.click('[data-testid="products-link"]');
    await expect(page).toHaveURL('/products');

    // 7. 製品を検索
    await page.fill('[data-testid="search-input"]', 'テスト');
    await page.waitForTimeout(1000); // 検索結果待機

    // 8. 製品をカートに追加
    await page.click('[data-testid="add-to-cart-button"]:first-child');
    await expect(page.locator('[data-testid="cart-count"])).toHaveText('1');

    // 9. カートを確認
    await page.click('[data-testid="cart-button"]');
    await expect(page).toHaveURL('/cart');
    await expect(page.locator('[data-testid="cart-item"])).toHaveCount(1);

    // 10. 購入プロセスを開始
    await page.click('[data-testid="checkout-button"]');
    await expect(page).toHaveURL('/checkout');

    // 11. 配送情報を入力
    await page.fill('[data-testid="shipping-name"]', 'テストユーザー');
    await page.fill('[data-testid="shipping-address"]', '東京都渋谷区');
    await page.fill('[data-testid="shipping-postal-code"]', '150-0002');

    // 12. 注文を確定
    await page.click('[data-testid="place-order-button"]');

    // 13. 注文完了を確認
    await expect(page).toHaveURL('/order-confirmation');
    await expect(page.locator('[data-testid="order-confirmation"])).toBeVisible();

    // 14. VRT：注文完了画面
    await TestHelpers.expectScreenshot(page, 'order-confirmation', {
      threshold: 0.1,
    });
  });

  test('エラーハンドリングの統合テスト', async ({ page }) => {
    // 1. 不正なメールアドレスで登録を試みる
    await page.goto('/register');
    await page.fill('[data-testid="email"]', 'invalid-email');
    await page.fill('[data-testid="password"]', 'password123');
    await page.fill('[data-testid="confirm-password"]', 'password123');
    await page.click('[data-testid="register-button"]');

    // 2. バリデーションエラーを確認
    await expect(page.locator('[data-testid="email-error"])).toBeVisible();
    await expect(page.locator('[data-testid="email-error"])).toHaveText(
      '有効なメールアドレスを入力してください'
    );

    // 3. VRT：エラー状態
    await TestHelpers.expectScreenshot(page, 'registration-error', {
      selector: '[data-testid="register-form"]',
      threshold: 0.05,
    });
  });
});
```

4. パフォーマンステストの実装

```typescript
// tests/performance/performance.spec.ts
import { test, expect } from '@playwright/test';

test.describe('パフォーマンステスト', () => {
  test('ページ読み込み時間の計測', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');

    const loadTime = Date.now() - startTime;
    console.log(`ページ読み込み時間: ${loadTime}ms`);

    // 3秒以内に読み込みが完了することを確認
    expect(loadTime).toBeLessThan(3000);
  });

  test('APIレスポンスタイムの計測', async ({ page }) => {
    await page.goto('/products');

    // APIリクエストの監視
    const apiResponse = page.waitForResponse(response =>
      response.url().includes('/api/products') && response.status() === 200
    );

    await page.click('[data-testid="refresh-button"]');

    const response = await apiResponse;
    const responseTime = response.timing().responseEnd - response.timing().requestStart;

    console.log(`APIレスポンスタイム: ${responseTime}ms`);

    // 1秒以内にレスポンスが返ることを確認
    expect(responseTime).toBeLessThan(1000);
  });

  test('LCPメトリクスの計測', async ({ page }) => {
    await page.goto('/');

    // LCPの計測
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lcpEntry = entries.find(entry => entry.name === 'LCP');
          if (lcpEntry) {
            resolve(lcpEntry.startTime);
          }
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      });
    });

    console.log(`LCP: ${lcp}ms`);

    // 2.5秒以内にLCPが発生することを確認
    expect(lcp).toBeLessThan(2500);
  });
});
```

5. アクセシビリティテストの実装

```typescript
// tests/accessibility/accessibility.spec.ts
import { test, expect } from '@playwright/test';

test.describe('アクセシビリティテスト', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('すべての画像にaltテキストがあること', async ({ page }) => {
    const images = await page.locator('img').all();

    for (const image of images) {
      const altText = await image.getAttribute('alt');
      expect(altText).not.toBeNull();
      expect(altText).not.toBe('');
    }
  });

  test('フォームに適切なラベルがあること', async ({ page }) => {
    await page.click('[data-testid="login-link"]');

    const inputs = await page.locator('input').all();

    for (const input of inputs) {
      const id = await input.getAttribute('id');
      if (id) {
        const label = await page.locator(`label[for="${id}"]`);
        await expect(label).toBeVisible();
      }
    }
  });

  test('キーボードナビゲーションが可能であること', async ({ page }) => {
    // Tabキーでフォーカスを移動
    await page.keyboard.press('Tab');

    const focusedElement = await page.locator(':focus');
    await expect(focusedElement).toBeVisible();

    // 複数のフォーカス可能な要素を確認
    const focusableElements = await page.locator(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ).all();

    expect(focusableElements.length).toBeGreaterThan(0);
  });

  test('カラーのコントラスト比が十分であること', async ({ page }) => {
    const contrastResults = await page.evaluate(() => {
      const results = [];
      const elements = document.querySelectorAll('*');

      elements.forEach(element => {
        const style = window.getComputedStyle(element);
        const color = style.color;
        const backgroundColor = style.backgroundColor;

        if (color && backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)') {
          // 簡易的なコントラスト比計算
          const colorRGB = color.match(/\d+/g);
          const bgRGB = backgroundColor.match(/\d+/g);

          if (colorRGB && bgRGB) {
            const colorLuminance = (0.299 * parseInt(colorRGB[0]) +
                                   0.587 * parseInt(colorRGB[1]) +
                                   0.114 * parseInt(colorRGB[2])) / 255;
            const bgLuminance = (0.299 * parseInt(bgRGB[0]) +
                                0.587 * parseInt(bgRGB[1]) +
                                0.114 * parseInt(bgRGB[2])) / 255;

            const contrast = (Math.max(colorLuminance, bgLuminance) + 0.05) /
                           (Math.min(colorLuminance, bgLuminance) + 0.05);

            results.push({
              element: element.tagName,
              contrast: contrast,
              passes: contrast >= 4.5,
            });
          }
        }
      });

      return results;
    });

    const failingContrasts = contrastResults.filter(r => !r.passes);
    console.log('コントラスト比テスト結果:', contrastResults);

    // 失敗した要素がないことを確認
    expect(failingContrasts.length).toBe(0);
  });
});
```

6. テストの実行

```bash
# すべてのテストを実行
npx playwright test

# VRTテストのみを実行
npx playwright test --grep "VRT"

# 特定のファイルのテストを実行
npx playwright test tests/integration/complete-flow.spec.ts

# ヘッドレスモードで実行
npx playwright test --headed

--レポート生成
npx playwright show-report
```

:::

## 📚 まとめ

E2Eテストとビジュアルリグレッションテストは、v0プロジェクトの品質を保証するための強力なツールです。Playwrightを使うことで、高速で信頼性の高いテストを実現し、VRTによってUIの意図しない変更を自動的に検出できます。

:::note 要点のまとめ

- E2Eテストはユーザー体験を直接検証できる最も効果的な手法
- Playwrightは高速で信頼性の高いテストを提供する
- VRTはUIの意図しない変更を自動的に検出する
- CI/CDへの統合で継続的な品質保証を実現する
- パフォーマンスやアクセシビリティのテストも重要

:::

次のページでは、CI/CDパイプラインの構築について学んでいきましょう。

[CI/CDパイプライン構築ガイドへ進む](./ci-cd)

## 関連リンク

- [Playwright公式ドキュメント](https://playwright.dev/)
- [ビジュアルリグレッションテストのベストプラクティス](https://playwright.dev/docs/test-snapshots)
- [CI/CD統合ガイド](https://playwright.dev/docs/ci-introduction)
- [アクセシビリティテスト](https://playwright.dev/docs/accessibility-testing)

## さらに深く学習したい方へ

E2EテストとVRTの専門知識をさらに深めたい方は、以下の研修プログラムをご検討ください：

- **Playwrightマスターコース**: 高度なE2Eテスト技術とパフォーマンス最適化
- **ビジュアルリグレッションテストエキスパート講座**: VRTの高度な技術と運用方法
- **テスト自動化アーキテクトコース**: 大規模プロジェクトのテスト戦略設計