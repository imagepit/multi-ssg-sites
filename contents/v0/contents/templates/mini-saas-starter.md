---
title: "ミニSaaSスターター | v0で本格的なSaaSプロダクト基盤を構築"
slug: mini-saas-starter
parent: "templates"
file_path: templates/mini-saas-starter
target_user: "Web開発者、スタートアップ創業者、プロダクトマネージャー"
goal: "v0で作成した認証、課金、ダッシュボード機能を備えたSaaSスターターテンプレートを提供し、本格的なSaaSプロダクト開発の基盤を構築する方法を学ぶ"
status: publish
post_type: pages
seo_title: "ミニSaaSスターター | v0で本格的なSaaSプロダクト基盤を構築"
seo_description: "v0 by Vercelで作成したSaaSスターターテンプレート。認証、課金、ダッシュボード機能を備えた完全なSaaS基盤を提供し、プロダクト開発を加速します。"
seo_keywords: "v0, SaaS, スターター, 認証, 課金, ダッシュボード, Next.js, Stripe, テンプレート"
handson_overview: "ミニSaaSスターターテンプレートをv0でカスタマイズし、実際のSaaS機能を実装するハンズオンを行います。"
---

## 🚀 ミニSaaSスターター

v0で作成したミニSaaSスターターは、本格的なSaaSプロダクト開発の基盤となるテンプレートです。認証、課金、ダッシュボード機能が統合されており、アイデアからプロダクトリリースまでの時間を大幅に短縮できます。

### このページで学べること

:::note

このページでは、ミニSaaSスターターテンプレートの機能とカスタマイズ方法を学びます。

- SaaSプロダクトの基本アーキテクチャ
- ユーザー認証と権限管理の実装
- Stripeとの連携による課金システム
- ダッシュボードとデータ可視化
- ユーザー管理とプロフィール設定
- API連携とデータベース設計

:::

## 🎯 SaaSスターターの基本構造

効果的なSaaSプロダクトには、ユーザー管理、課金、データ管理などの基本機能が不可欠です。

### テンプレートの特徴

- **完全な認証システム**: ログイン、サインアップ、パスワードリセット
- **柔軟な課金モデル**: サブスクリプション、従量課金、フリートライアル
- **直感的なダッシュボード**: ユーザーが日常操作を行う主要インターフェース
- **スケーラブルなアーキテクチャ**: ユーザー増加に対応できる設計
- **モバイル対応**: あらゆるデバイスで快適に利用可能

:::note SaaSの基本概念

SaaS（Software as a Service）は、クラウドベースでソフトウェアを提供するモデルです。ユーザーはインストール不要で、サブスクリプション形式で利用できます。このスターターは、SaaS開発に必要な基本的な機能をすべて含んでいます。

:::

## 📝 プロンプト設計パターン

SaaSスターターの各要素を作成するためのプロンプト例を見ていきましょう。

### 認証システムのプロンプト

```bash
SaaSアプリケーションの認証システムを作成してください。

認証要件:
- メールアドレスとパスワードでのログイン
- Google OAuthでのソーシャルログイン
- パスワードリセット機能
- 二要素認証（オプション）
- セッション管理とトークンリフレッシュ

ユーザーロール:
- オーナー: 全ての機能にアクセス可能
- アドミン: ユーザー管理と設定変更
- メンバー: 基本的な機能のみ利用可能
- 閲覧者: 閲覧のみ可能

セキュリティ要件:
- パスワードのハッシュ化
- レート制限による攻撃防止
- セキュアクッキーの設定
- CORS設定
- APIエンドポイントの保護

デザイン要件:
- クリーンでプロフェッショナルなデザイン
- エラーメッセージの表示
- ローディング状態の表示
- レスポンシブ対応
```

### 課金システムのプロンプト

```bash
SaaSの課金システムとプラン選択画面を作成してください。

プラン構成:
- フリープラン: 基本機能のみ
- スタータープラン: 中規模チーム向け
- プロフェッショナルプラン: 大規模組織向け
- エンタープライズプラン: カスタマイズ可能

課金機能:
- 月額/年額支払いの選択
- Stripeとの連携
- 請求書の生成
- クレジットカード情報の保存
- 解約機能
- アップグレード/ダウングレード

プラン比較テーブル:
- 機能の明確な比較
- ハイライト表示（推奨プラン）
- ユーザー数制限の表示
- カスタマーサポートレベルの表示

UI要件:
- 直感的なプラン選択
- 現在のプランの表示
- アップグレードボタン
- 解約確認ダイアログ
- 請求履歴の表示
```

### ダッシュボードのプロンプト

```bash
SaaSアプリケーションのメインダッシュボードを作成してください。

ダッシュボード要素:
- ウェルカムセクション（ユーザー名、プラン情報）
- 統計カード（アクティブユーザー、使用量、請求額など）
- アクティビティタイムライン
- クイックアクションボタン
- 最近のファイル/プロジェクト
- ヘルプとサポートセクション

データ可視化:
- 折れ線グラフ（ユーザー増加トレンド）
- 円グラフ（機能利用率）
- 棒グラフ（月次比較）
- リアルタイムデータ更新

パーソナライゼーション:
- ユーザーに合わせた表示
- お気に入り機能のショートカット
- 通知設定
- テーマ切り替え（ライト/ダーク）

レスポンシブ対応:
- モバイルファーストデザイン
- タブレット最適化
- デスクトップでの多カラム表示
```

## 🛠️ ミニSaaSスターターをカスタマイズしてみよう

実際にv0を使ってミニSaaSスターターをカスタマイズしてみましょう。

:::step

1. プロジェクトのセットアップ

まずはテンプレートをクローンして基本設定を行います。

```bash
# リポジトリのクローン
git clone https://github.com/your-repo/mini-saas-starter.git
cd mini-saas-starter

# 依存関係のインストール
pnpm install

# 環境変数の設定
cp .env.example .env.local
```

環境変数の設定：

```bash
# .env.local
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# データベース
DATABASE_URL="postgresql://username:password@localhost:5432/mini_saas"

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# OAuthプロバイダー
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

2. データベースのセットアップ

Prismaを使ってデータベースを設定します。

```typescript
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  image     String?
  role      Role     @default(MEMBER)
  plan      Plan     @default(FREE)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  accounts Account[]
  sessions Session[]
  projects Project[]
  subscriptions Subscription[]

  @@map("users")
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model Project {
  id          String   @id @default(cuid())
  name        String
  description String?
  status      Status   @default(ACTIVE)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  userId      String

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("projects")
}

model Subscription {
  id              String    @id @default(cuid())
  userId          String
  stripePriceId   String
  stripeSubscriptionId String
  status          SubscriptionStatus
  currentPeriodStart DateTime
  currentPeriodEnd   DateTime
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([stripeSubscriptionId])
  @@map("subscriptions")
}

enum Role {
  OWNER
  ADMIN
  MEMBER
  VIEWER
}

enum Plan {
  FREE
  STARTER
  PROFESSIONAL
  ENTERPRISE
}

enum Status {
  ACTIVE
  INACTIVE
  ARCHIVED
}

enum SubscriptionStatus {
  ACTIVE
  CANCELED
  INCOMPLETE
  INCOMPLETE_EXPIRED
  PAST_DUE
  TRIALING
  UNPAID
}
```

```bash
# データベースのマイグレーション
npx prisma generate
npx prisma db push
```

3. 認証システムの実装

NextAuth.jsを使って認証システムを実装します。

```typescript
// src/lib/auth.ts
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/lib/prisma"

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id
      session.user.role = user.role
      session.user.plan = user.plan
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.plan = user.plan
      }
      return token
    },
  },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
  },
})

// src/types/next-auth.d.ts
import { Role, Plan } from "@prisma/client"
import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: Role
      plan: Plan
    } & DefaultSession["user"]
  }

  interface User {
    role: Role
    plan: Plan
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: Role
    plan: Plan
  }
}
```

4. 課金システムの実装

Stripeとの連携による課金システムを実装します。

```typescript
// src/lib/stripe.ts
import Stripe from "stripe"
import { headers } from "next/headers"
import prisma from "@/lib/prisma"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

export async function createCheckoutSession(userId: string, priceId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    throw new Error("User not found")
  }

  const session = await stripe.checkout.sessions.create({
    customer_email: user.email,
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${process.env.NEXTAUTH_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/billing/cancel`,
    metadata: {
      userId: userId,
    },
  })

  return session
}

export async function createPortalSession(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user || !user.stripeCustomerId) {
    throw new Error("User not found or no Stripe customer")
  }

  const session = await stripe.billing.portal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.NEXTAUTH_URL}/billing`,
  })

  return session
}

// src/pages/api/webhooks/stripe.ts
import { buffer } from "micro"
import { NextApiRequest, NextApiResponse } from "next"
import stripe from "@/lib/stripe"
import prisma from "@/lib/prisma"

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const buf = await buffer(req)
  const sig = req.headers["stripe-signature"]!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated":
      const subscription = event.data.object as Stripe.Subscription
      await prisma.subscription.upsert({
        where: {
          stripeSubscriptionId: subscription.id,
        },
        create: {
          stripeSubscriptionId: subscription.id,
          userId: subscription.metadata.userId,
          stripePriceId: subscription.items.data[0].price.id,
          status: subscription.status as any,
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
        update: {
          status: subscription.status as any,
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
      })
      break
    case "customer.subscription.deleted":
      const deletedSubscription = event.data.object as Stripe.Subscription
      await prisma.subscription.update({
        where: {
          stripeSubscriptionId: deletedSubscription.id,
        },
        data: {
          status: "CANCELED",
        },
      })
      break
    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  res.json({ received: true })
}
```

5. ダッシュボードコンポーネントの実装

ユーザーが日常操作を行う主要インターフェースを実装します。

```typescript
// src/components/dashboard/Dashboard.tsx
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Activity, Users, DollarSign, TrendingUp } from "lucide-react"

interface DashboardStats {
  totalUsers: number
  activeUsers: number
  monthlyRevenue: number
  growthRate: number
}

export default function Dashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<any[]>([])

  useEffect(() => {
    // ダッシュボードデータの取得
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, activityResponse] = await Promise.all([
          fetch("/api/dashboard/stats"),
          fetch("/api/dashboard/activity")
        ])

        const statsData = await statsResponse.json()
        const activityData = await activityResponse.json()

        setStats(statsData)
        setRecentActivity(activityData)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      }
    }

    fetchDashboardData()
  }, [])

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "FREE": return "bg-gray-100 text-gray-800"
      case "STARTER": return "bg-blue-100 text-blue-800"
      case "PROFESSIONAL": return "bg-purple-100 text-purple-800"
      case "ENTERPRISE": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">ダッシュボード</h1>
          <p className="text-gray-600">
            ようこそ、{session?.user?.name}さん
          </p>
        </div>
        <Badge className={getPlanColor(session?.user?.plan || "FREE")}>
          {session?.user?.plan} プラン
        </Badge>
      </div>

      {/* 統計カード */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">総ユーザー数</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                今月の新規ユーザー: +12%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">アクティブユーザー</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeUsers}</div>
              <p className="text-xs text-muted-foreground">
                活性率: {((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">月次売上</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">¥{stats.monthlyRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                先月比: +{stats.growthRate}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">成長率</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{stats.growthRate}%</div>
              <p className="text-xs text-muted-foreground">
                順調な成長を継続中
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 最近のアクティビティ */}
      <Card>
        <CardHeader>
          <CardTitle>最近のアクティビティ</CardTitle>
          <CardDescription>
            直近のユーザーアクティビティとシステムイベント
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{activity.time}</p>
                  <Badge variant={activity.type === "success" ? "default" : "secondary"}>
                    {activity.type}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

6. ユーザー管理コンポーネントの実装

管理者がユーザーを管理するためのインターフェースを実装します。

```typescript
// src/components/admin/UserManagement.tsx
import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import { User } from "@prisma/client"

interface UserManagementProps {
  users: User[]
  onEdit: (user: User) => void
  onDelete: (userId: string) => void
  onCreate: () => void
}

export default function UserManagement({ users, onEdit, onDelete, onCreate }: UserManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users)

  useEffect(() => {
    const filtered = users.filter(user =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredUsers(filtered)
  }, [users, searchTerm])

  const getRoleColor = (role: string) => {
    switch (role) {
      case "OWNER": return "bg-red-100 text-red-800"
      case "ADMIN": return "bg-orange-100 text-orange-800"
      case "MEMBER": return "bg-blue-100 text-blue-800"
      case "VIEWER": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* ヘッダーと検索 */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">ユーザー管理</h2>
        <Button onClick={onCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          新規ユーザー作成
        </Button>
      </div>

      {/* 検索バー */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="ユーザーを検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* ユーザーテーブル */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ユーザー</TableHead>
              <TableHead>メールアドレス</TableHead>
              <TableHead>役割</TableHead>
              <TableHead>プラン</TableHead>
              <TableHead>登録日</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      {user.name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="font-medium">{user.name || "未設定"}</p>
                      <p className="text-sm text-gray-500">ID: {user.id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge className={getRoleColor(user.role)}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {user.plan}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString("ja-JP")}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(user.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
```

:::

## 📊 パフォーマンス最適化

SaaSアプリケーションのパフォーマンスを最適化するためのテクニックを実装します。

```typescript
// src/lib/performance.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // キャッシュヘッダーの設定
  if (request.nextUrl.pathname.startsWith("/api")) {
    const response = NextResponse.next()

    // 静的データは1時間キャッシュ
    if (request.nextUrl.pathname.includes("/stats")) {
      response.headers.set("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=60")
    }

    return response
  }
}

// src/lib/database-optimizer.ts
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

// クエリの最適化
export class DatabaseOptimizer {
  static async getUserWithStats(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        plan: true,
        createdAt: true,
        _count: {
          select: {
            projects: true,
            subscriptions: true,
          },
        },
      },
    })
  }
}
```

## 🚀 デプロイと監視

SaaSアプリケーションのデプロイと監視を設定します。

```typescript
// src/lib/monitoring.ts
export class Monitoring {
  private static metrics: Map<string, number> = new Map()

  static incrementMetric(name: string, value = 1) {
    const current = this.metrics.get(name) || 0
    this.metrics.set(name, current + value)
  }

  static getMetrics() {
    return Object.fromEntries(this.metrics)
  }

  static logError(error: Error, context?: any) {
    console.error({
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    })
  }
}

// src/middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { Monitoring } from "@/lib/monitoring"

export function middleware(request: NextRequest) {
  // メトリクスの記録
  Monitoring.incrementMetric("requests")

  // レスポンス時間の計測
  const start = Date.now()

  const response = NextResponse.next()

  response.headers.set("X-Response-Time", `${Date.now() - start}ms`)

  return response
}
```

## まとめ

ミニSaaSスターターは、本格的なSaaSプロダクト開発の基盤となる強力なテンプレートです。v0で作成したこのテンプレートをカスタマイズすることで、アイデアからプロダクトリリースまでの時間を大幅に短縮できます。

:::note 要点のまとめ

- 認証、課金、ダッシュボード機能が統合された完全なSaaS基盤
- Next.js + Prisma + Stripeのモダンな技術スタック
- スケーラブルなアーキテクチャとセキュリティ対策
- パフォーマンス最適化と監視機能の実装
- プロダクトに合わせたカスタマイズが容易

:::

次は「[ダッシュボードスターター](./dashboard-starter.md)」を学び、データ可視化と管理画面の構築方法を習得しましょう。

## 📚 関連リンク

- [Next.js公式ドキュメント](https://nextjs.org/docs)
- [Stripe公式ドキュメント](https://stripe.com/docs)
- [Prisma公式ドキュメント](https://prisma.io/docs)
- [認証機能の詳細実装](../level4-app-assembly/authentication.md)
- [課金システムの実装](../level6-integration-deploy/external-apis-db.md)