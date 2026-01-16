---
title: "認証付きアプリケーションスケルトン | v0でユーザー認証機能を実装"
slug: authenticated-skeleton
parent: "recipes"
file_path: recipes/authenticated-skeleton
target_user: "Web開発者、フロントエンドエンジニア、バックエンドエンジニア"
goal: "v0を使って認証機能を持つアプリケーションのスケルトンを作成する方法を学び、ユーザー管理のベストプラクティスを習得する"
status: publish
post_type: pages
seo_title: "認証付きアプリケーションスケルトン | v0でユーザー認証機能を実装"
seo_description: "v0 by Vercelを使って認証機能を持つアプリケーションスケルトンを作成する方法を解説。ログイン、サインアップ、パーミッション管理など認証に必要なコンポーネントを効率的に実装できます。"
seo_keywords: "v0, 認証, ログイン, サインアップ, ユーザー管理, パーミッション, アプリケーションスケルトン"
handson_overview: "実際の認証付きアプリをv0で作成し、ログインフォーム、ダッシュボード、ユーザープロファイルを実装するハンズオンを行います。"
---

## 🔐 認証付きアプリケーションスケルトン

認証機能は現代のWebアプリケーションにおいて不可欠な要素です。v0を使って、安全でスケーラブルな認証システムを持つアプリケーションのスケルトンを効率的に構築する方法を学びましょう。

### このページで学べること

:::note

このページでは、v0を使った認証機能の実装方法を学びます。

- ログイン・サインアップフォームの作成
- ユーザープロファイルと設定管理
- ロールベースのアクセス制御
- パスワードリセットとメール認証
- セッション管理とセキュリティ対策
- マルチファクター認証の実装

:::

## 🎯 認証システムの基本構造

効果的な認証システムには、ユーザー体験とセキュリティの両面を考慮した設計が必要です。

### 必須コンポーネント

- **ログインフォーム**: メールアドレス/パスワードでの認証
- **サインアップフォーム**: 新規ユーザー登録
- **パスワードリセット**: パスワード忘れ対応
- **ユーザーダッシュボード**: 認証後のメイン画面
- **プロファイル設定**: ユーザー情報管理
- **アクセス制御**: 権限に基づく画面表示

:::note 認証フローとは

認証フローはユーザーが自分自身を証明し、アプリケーションがそのユーザーを識別するプロセスです。一般的には以下のステップで構成されます：

1. **認証**: ユーザーが資格情報（メール/パスワード）を提示
2. **認可**: 認証されたユーザーの権限を確認
3. **セッション管理**: ユーザーのログイン状態を維持
4. **ログアウト**: セッションの終了とクリーンアップ

:::

## 📝 プロンプト設計パターン

認証システムの各要素を作成するためのプロンプト例を見ていきましょう。

### ログインページのプロンプト

```bash
モダンなログインページを作成してください。

ページ構成:
- ヘッダーにアプリロゴと「サインアップ」リンク
- 中央にログインフォーム
- フッターに利用規約とプライバシーポリシーリンク

フォーム要素:
- メールアドレス入力（バリデーション付き）
- パスワード入力（表示/非表示切替え）
- 「ログイン状態を保持する」チェックボックス
- 「ログイン」ボタン（ローディング状態付き）
- 「パスワードを忘れた場合」リンク

デザイン要件:
- ミニマルでクリーンなデザイン
- グラデーション背景またはパターン背景
- 入力フォーカス時のアニメーション
- エラーメッセージの表示
- レスポンシブ対応（モバイルファースト）
- ソーシャルログインボタン（Google, GitHub）

バリデーション:
- メール形式チェック
- パスワード必須チェック
- ログイン失敗時のエラー表示
- レート制限対応のUI
```

### ユーザーダッシュボードのプロンプト

```bash
認証後のユーザーダッシュボードを作成してください。

レイアウト:
- サイドバー: ナビゲーションメニュー
- トップバー: ユーザー情報と通知
- メインコンテンツ: ウェルカム情報とクイックアクション
- モバイル: ハンバーガーメニュー対応

サイドバーメニュー:
- ダッシュボード
- プロファイル設定
- アカウント設定
- 請求情報
- チーム管理（管理者のみ）
- 設定
- ログアウト

トップバー要素:
- アプリ名と現在のページ
- 通知ベル（未読数バッジ）
- ユーザーアバターとドロップダウンメニュー
- ダークモード切替え

メインコンテンツ:
- ウェルカムメッセージ（ユーザー名付き）
- 統計情報カード（今月のアクティビティなど）
- クイックアクションボタン
- 最近のアクティビティフィード
- ヘルプとサポートセクション

機能要件:
- ユーザー権限に基づくメニュー表示
- リアルタイム通知
- アクティビティのフィルタリング
- 個人設定の保存
```

## 🛠️ 認証付きアプリを作成してみよう

実際にv0を使って認証機能を持つアプリケーションを作成してみましょう。

:::step

1. ログインページの作成

まずはログインページを作成します。

```bash
SaaSアプリケーションのログインページを作成してください。

アプリ情報:
- アプリ名: TaskFlow
- タイプ: プロジェクト管理ツール
- カラーテーマ: 青（#3B82F6）を基調

ページ要件:
- ヒーローセクションにアプリの価値提案
- 中央にログインフォームカード
- 背景に抽象的なジオメトリックパターン

フォームフィールド:
- メールアドレス（自動フォーカス）
- パスワード（8文字以上、表示/非表示切替え）
- 「ログイン状態を保持」チェックボックス
- 「ログイン」ボタン（プライマリカラー）
- 「パスワードを忘れた」リンク

ソーシャルログイン:
- Googleで続ける
- GitHubで続ける
- Microsoftで続ける

追加要素:
- アカウントをお持ちでない場合：「無料で始める」リンク
- セキュリティバッジ（SSL暗号化済みなど）
- 言語切替え（日本語/英語）

デザイン:
- Tailwind CSSを使用
- カードシャドウとホバー効果
- フォームバリデーションのリアルタイム表示
- ローディングスピナー
- エラー時のシェイクアニメーション
```

2. サインアップページの作成

新規ユーザー登録ページを作成します。

```bash
多段階サインアップフォームを作成してください。

ステップ1: 基本情報
- 名前（姓、名）
- メールアドレス
- パスワード（強度インジケーター付き）
- パスワード確認

ステップ2: 会社情報（オプション）
- 会社名
- 役職
- チームサイズ（選択：1-5, 6-20, 21-50, 50+）

ステップ3: 利用目的
- 主な利用目的（複数選択可能）
- 期待する機能（チェックボックス）
- 参考にした情報源

デザイン要件:
- ステップインジケーター（プログレスバー）
- 各ステップのバリデーション
- 前へ/次へボタン
- 自動保存機能
- オプション項目のスキップ

機能:
- メールアドレスの重複チェック
- パスワード強度のリアルタイム表示
- 利用規約への同意チェック
- アカウント作成後のウェルカムメール
```

3. ユーザーダッシュボードの実装

認証後のメイン画面を作成します。

```bash
プロジェクト管理ツールのユーザーダッシュボードを作成してください。

レイアウト:
- サイドナビゲーション（固定幅）
- トップバー（固定高さ）
- メインコンテンツエリア（残りスペース）

サイドナビゲーション:
- ロゴとアプリ名
- ダッシュボード（現在のページ）
- プロジェクト
- タスク
- チーム
- レポート
- 設定
- ヘルプ
- ログアウト

トップバー:
- 現在のページタイトル
- グローバル検索
- 通知（未読3件）
- ユーザーアバターとメニュー
- ダークモード切替え

メインコンテンツ:
- ウェルカムバナー（ユーザー名、今の日付）
- クイック統計（4つのカード：総プロジェクト、進行中タスク、チームメンバー、今月の完了）
- 最近のプロジェクト（テーブル形式）
- アクティビティタイムライン
- クイックアクションボタン（新規プロジェクト作成など）

機能要件:
- レスポンシブデザイン（モバイルでサイドバーがドロワー）
- リアルタイムデータ更新
- ドラッグ＆ドロップでタスク並べ替え
- フィルタリングと検索
- ユーザー設定の永続化
```

4. パーミッション管理システムの実装

ロールベースのアクセス制御を実装します。

```typescript
// src/lib/permissions.ts
export type Role = 'admin' | 'manager' | 'user' | 'viewer';

export type Permission =
  | 'create:project'
  | 'read:project'
  | 'update:project'
  | 'delete:project'
  | 'create:task'
  | 'read:task'
  | 'update:task'
  | 'delete:task'
  | 'manage:users'
  | 'view:reports'
  | 'export:data';

export const rolePermissions: Record<Role, Permission[]> = {
  admin: [
    'create:project', 'read:project', 'update:project', 'delete:project',
    'create:task', 'read:task', 'update:task', 'delete:task',
    'manage:users', 'view:reports', 'export:data'
  ],
  manager: [
    'create:project', 'read:project', 'update:project',
    'create:task', 'read:task', 'update:task', 'delete:task',
    'view:reports', 'export:data'
  ],
  user: [
    'create:task', 'read:task', 'update:task',
    'read:project'
  ],
  viewer: [
    'read:project', 'read:task'
  ]
};

export function hasPermission(userRole: Role, permission: Permission): boolean {
  return rolePermissions[userRole].includes(permission);
}

export function usePermissions() {
  const { user } = useAuth();
  const userRole = user?.role || 'viewer';

  return {
    can: (permission: Permission) => hasPermission(userRole, permission),
    role: userRole,
    permissions: rolePermissions[userRole]
  };
}
```

5. 認証ミドルウェアの実装

Next.jsのミドルウェアでルート保護を実装します。

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const { pathname } = request.nextUrl;

  // 認証不要のパス
  const publicPaths = ['/login', '/signup', '/forgot-password', '/'];

  // APIルートはミドルウェアを適用しない
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // すでに認証されているユーザーがログインページにアクセスした場合
  if (token && publicPaths.includes(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 認証されていないユーザーが保護されたページにアクセスした場合
  if (!token && !publicPaths.includes(pathname)) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * 以下のパスを除くすべてのリクエストにミドルウェアを適用
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

6. ユーザープロファイルコンポーネントの実装

ユーザー情報管理コンポーネントを作成します。

```typescript
// src/components/user/Profile.tsx
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
    timezone: user?.timezone || 'Asia/Tokyo',
    language: user?.language || 'ja'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setIsEditing(false);
      // 成功メッセージを表示
    } catch (error) {
      // エラーメッセージを表示
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>プロフィール設定</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="edit-button"
        >
          {isEditing ? 'キャンセル' : '編集'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label>プロフィール画像</label>
          <div className="avatar-upload">
            <img
              src={formData.avatar || '/default-avatar.png'}
              alt="プロフィール"
              className="avatar"
            />
            {isEditing && (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // 画像アップロード処理
                  }
                }}
              />
            )}
          </div>
        </div>

        <div className="form-group">
          <label>名前</label>
          {isEditing ? (
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          ) : (
            <p>{formData.name}</p>
          )}
        </div>

        <div className="form-group">
          <label>メールアドレス</label>
          {isEditing ? (
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          ) : (
            <p>{formData.email}</p>
          )}
        </div>

        <div className="form-group">
          <label>タイムゾーン</label>
          {isEditing ? (
            <select
              value={formData.timezone}
              onChange={(e) => setFormData({...formData, timezone: e.target.value})}
            >
              <option value="Asia/Tokyo">日本 (UTC+9)</option>
              <option value="UTC">UTC</option>
              <option value="America/New_York">ニューヨーク (UTC-5)</option>
              <option value="Europe/London">ロンドン (UTC+0)</option>
            </select>
          ) : (
            <p>{formData.timezone}</p>
          )}
        </div>

        {isEditing && (
          <div className="form-actions">
            <button type="submit" className="save-button">
              保存
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
```

7. セキュリティ機能の追加

パスワード強度チェックと二要素認証を実装します。

```typescript
// src/lib/security.ts
export function checkPasswordStrength(password: string): {
  score: number;
  feedback: string[];
  isStrong: boolean;
} {
  const feedback = [];
  let score = 0;

  // 長さチェック
  if (password.length < 8) {
    feedback.push('8文字以上にしてください');
  } else {
    score += 1;
  }

  // 大文字チェック
  if (!/[A-Z]/.test(password)) {
    feedback.push('大文字を含めてください');
  } else {
    score += 1;
  }

  // 小文字チェック
  if (!/[a-z]/.test(password)) {
    feedback.push('小文字を含めてください');
  } else {
    score += 1;
  }

  // 数字チェック
  if (!/\d/.test(password)) {
    feedback.push('数字を含めてください');
  } else {
    score += 1;
  }

  // 特殊文字チェック
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    feedback.push('特殊文字を含めてください');
  } else {
    score += 1;
  }

  return {
    score,
    feedback,
    isStrong: score >= 4
  };
}

// 二要素認証の実装例
export function setupTwoFactorAuth(userId: string): Promise<{
  secret: string;
  qrCodeUrl: string;
}> {
  // 2FAセットアップロジック
  // 実際の実装では speakeasy や otpauth などのライブラリを使用
  return Promise.resolve({
    secret: 'generated-secret',
    qrCodeUrl: 'otpauth://totp/...'
  });
}

export function verifyTwoFactorToken(
  userId: string,
  token: string
): Promise<boolean> {
  // トークン検証ロジック
  return Promise.resolve(true);
}
```

:::

## 🎨 UX最適化の実装

認証システムのユーザーエクスペリエンスを向上させるためのテクニックです。

### パスワードレス認証

```typescript
// src/components/auth/MagicLinkLogin.tsx
import { useState } from 'react';

export default function MagicLinkLogin() {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // マジックリンク送信APIを呼び出し
      const response = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        setIsSent(true);
      }
    } catch (error) {
      console.error('Error sending magic link:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className="magic-link-sent">
        <h3>メールを確認してください</h3>
        <p>
          {email} にログインリンクを送信しました。
          メール内のリンクをクリックしてログインしてください。
        </p>
        <button onClick={() => setIsSent(false)}>
          別のメールアドレスでやり直す
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSendMagicLink} className="magic-link-form">
      <h3>メールでログイン</h3>
      <p>
        パスワードを入力せずに、メールで受信したリンクをクリックするだけでログインできます。
      </p>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="メールアドレスを入力"
        required
      />

      <button type="submit" disabled={isLoading}>
        {isLoading ? '送信中...' : 'ログインリンクを送信'}
      </button>
    </form>
  );
}
```

### セッション管理の最適化

```typescript
// src/lib/session.ts
export class SessionManager {
  private static instance: SessionManager;
  private refreshTimer: NodeJS.Timeout | null = null;

  private constructor() {}

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  async refreshSession(): Promise<boolean> {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        this.scheduleRefresh();
        return true;
      } else {
        this.clearSession();
        return false;
      }
    } catch (error) {
      console.error('Session refresh failed:', error);
      this.clearSession();
      return false;
    }
  }

  private scheduleRefresh(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    // トークンの有効期限が切れる5分前にリフレッシュ
    this.refreshTimer = setTimeout(() => {
      this.refreshSession();
    }, 55 * 60 * 1000); // 55分
  }

  private clearSession(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
    // セッションクリアロジック
    window.location.href = '/login';
  }

  startSession(): void {
    this.scheduleRefresh();
  }

  stopSession(): void {
    this.clearSession();
  }
}
```

## まとめ

v0を使えば、安全でユーザーフレンドリーな認証システムも効率的に実装できます。適切なプロンプト設計とセキュリティベストプラクティスを組み合わせることで、エンタープライズレベルの認証機能を持つアプリケーションを構築できます。

:::note 要点のまとめ

- 認証システムにはログイン、サインアップ、パーミッション管理が必須
- v0のプロンプトはセキュリティ要件とUX要件を明記することが重要
- ロールベースのアクセス制御で適切な権限管理を実装する
- パスワードレス認証や二要素認証でセキュリティを強化する
- セッション管理とトークンリフレッシュで安全な認証を維持する

:::

次は「[モバイルファーストデザイン](./mobile-first.md)」を学び、レスポンシブデザインの高度なテクニックを習得しましょう。

## 📚 関連リンク

- [認証機能の詳細実装](../level4-app-assembly/authentication.md)
- [セキュリティベストプラクティス](../level5-designsystem-ops/performance.md)
- [状態管理のパターン](../level4-app-assembly/state-management.md)