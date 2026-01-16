---
title: 認証（Auth.js/Clerk等） | Next.jsアプリケーションのセキュリティ実装ガイド
slug: authentication
parent: "app-assembly"
file_path: app-assembly/authentication
target_user: "経験2年以内のフロントエンドエンジニア"
goal: "Next.jsアプリケーションにおける認証システムの実装方法を理解し、Auth.jsとClerkを使ったセキュアなユーザー管理のスキルを習得する"
status: publish
post_type: pages
seo_title: Next.js認証完全ガイド | Auth.jsとClerkによるセキュアなユーザー管理
seo_keywords: "Next.js, 認証, Auth.js, Clerk, セキュリティ, ユーザー管理, ログイン, セッション管理, v0コンポーネント"
seo_description: Next.jsアプリケーションにおける認証システムの包括的ガイド。Auth.jsとClerkを使ったセキュアなユーザー管理手法を学びます。
handson_overview: "Todoアプリを例に、Auth.jsとClerkを使用したユーザー認証、ログインページ、保護されたルートの実装を行うハンズオン。v0コンポーネントとの統合も含む"
---

## 🔐 はじめに

現代のWebアプリケーションでは、セキュアな認証システムが不可欠です。このセクションでは、Next.jsアプリケーションにおける認証の実装方法を学び、Auth.jsとClerkといった主要な認証ソリューションを比較検討します。

### このページで学べる事

:::note このページで学べること

- **認証の基本概念**とセキュリティ考慮事項
- **Auth.js**による認証システムの実装
- **Clerk**を使ったモダンな認証ソリューション
- **セッション管理**とアクセス制御
- **保護されたルート**の実装方法
- **v0コンポーネント**との統合パターン

:::

## 🛡️ 認証の基本概念

### 認証とは

認証は、ユーザーの身元を確認するプロセスです。

:::note 認証の主要要素

- **ユーザー識別**：メールアドレス、ユーザー名、ソーシャルアカウントなど
- **資格情報の検証**：パスワード、OTP、バイオメトリクスなど
- **セッション管理**：ログイン状態の維持と管理
- **アクセス制御**：認証済みユーザーのみがアクセス可能なリソース

:::

### 認証方式の比較

```typescript
// 認証方式の比較
interface AuthComparison {
  method: string
  description: string
  complexity: 'low' | 'medium' | 'high'
  security: 'basic' | 'medium' | 'high'
  useCase: string
}

const authMethods: AuthComparison[] = [
  {
    method: 'メール/パスワード',
    description: '従来の認証方式、最も一般的',
    complexity: 'low',
    security: 'medium',
    useCase: '基本的なユーザー管理'
  },
  {
    method: 'ソーシャルログイン',
    description: 'Google、GitHubなどの外部サービスを使用',
    complexity: 'medium',
    security: 'high',
    useCase: 'ユーザー登録の簡素化'
  },
  {
    method: 'マジックリンク',
    description: 'メール経由でワンタイムリンクを送信',
    complexity: 'medium',
    security: 'high',
    useCase: 'パスワードレス認証'
  },
  {
    method: '多要素認証（MFA）',
    description: '複数の認証要素を組み合わせ',
    complexity: 'high',
    security: 'high',
    useCase: '高セキュリティが要求されるアプリ'
  }
]
```

## 🚀 Auth.jsによる認証実装

### Auth.jsとは

Auth.js（旧NextAuth.js）は、Next.js専用の認証ライブラリです。

:::note Auth.jsの特徴

- **Next.js統合**：App RouterとPages Routerの両方をサポート
- **多様なプロバイダー**：Google、GitHub、Twitterなど40以上のプロバイダー
- **データベースレス**：デフォルトでJWTを使用
- **セッション管理**：クライアントサイドとサーバーサイドの両方をサポート
- **タイポセーフ**：完全なTypeScriptサポート

:::

### Auth.jsの基本設定

:::syntax Auth.jsの基本設定

```typescript
// src/lib/auth.ts
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from '@/lib/prisma'

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
  }
}

export default NextAuth(authOptions)
```

この設定は、Googleプロバイダーと資格情報プロバイダーを設定し、Prismaをデータベースアダプターとして使用します。

:::

### APIルートの設定

```typescript
// src/app/api/auth/[...nextauth]/route.ts
import { authOptions } from '@/lib/auth'
import NextAuth from 'next-auth'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
```

### セッションプロバイダーの設定

```typescript
// src/app/providers.tsx
'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

interface AuthProviderProps {
  children: ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  return <SessionProvider>{children}</SessionProvider>
}
```

## 👥 Clerkによる認証実装

### Clerkとは

Clerkは、モダンな認証・ユーザー管理ソリューションです。

:::note Clerkの特徴

- **セットアップの容易さ**：数分で導入可能
- **プリビルドUIコンポーネント**：ログイン、登録画面など
- **高度なセキュリティ**：MFA、SSO、RBACのサポート
- **ユーザー管理ダッシュボード**：管理画面が標準装備
- **リアルタイム同期**：複数デバイス間での状態同期

:::

### Clerkの基本設定

:::syntax Clerkの基本設定

```typescript
// src/app/(root)/layout.tsx
import { ClerkProvider } from '@clerk/nextjs'
import { jaJP } from '@clerk/localizations'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider localization={jaJP}>
      <html lang="ja">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
```

この設定は、Clerkプロバイダーをアプリケーション全体に適用し、日本語ローカライズを設定します。

:::

### ミドルウェアの設定

```typescript
// middleware.ts
import { authMiddleware } from '@clerk/nextjs'

export default authMiddleware({
  publicRoutes: ['/', '/sign-in', '/sign-up'],
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
```

### ログインコンポーネントの実装

```typescript
// src/components/auth/SignIn.tsx
'use client'

import { SignIn } from '@clerk/nextjs'
import { dark } from '@clerk/themes'

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignIn
        appearance={{
          baseTheme: dark,
          elements: {
            formButtonPrimary: 'bg-blue-600 hover:bg-blue-700',
            card: 'bg-gray-800',
            headerTitle: 'text-white',
            headerSubtitle: 'text-gray-300',
            socialButtonsBlockButtonText: 'text-white',
            socialButtonsBlockButton: 'bg-gray-700 hover:bg-gray-600',
          },
        }}
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
        redirectUrl="/dashboard"
      />
    </div>
  )
}
```

## 🔒 保護されたルートの実装

### Auth.jsを使用した保護

:::syntax Auth.jsによるルート保護

```typescript
// src/components/auth/ProtectedRoute.tsx
'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: string
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // ローディング中は何もしない

    if (!session) {
      router.push('/auth/signin')
      return
    }

    // ロールベースのアクセス制御
    if (requiredRole && session.user.role !== requiredRole) {
      router.push('/unauthorized')
      return
    }
  }, [session, status, router, requiredRole])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    return null // リダイレクト中
  }

  return <>{children}</>
}
```

このコンポーネントは、セッションの状態をチェックし、認証されていないユーザーをリダイレクトします。

:::

### Clerkを使用した保護

```typescript
// src/components/auth/ClerkProtectedRoute.tsx
'use client'

import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, ReactNode } from 'react'

interface ClerkProtectedRouteProps {
  children: ReactNode
  requiredRole?: string
}

export default function ClerkProtectedRoute({
  children,
  requiredRole
}: ClerkProtectedRouteProps) {
  const { isLoaded, userId, sessionId } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoaded) return // ローディング中は何もしない

    if (!userId || !sessionId) {
      router.push('/sign-in')
      return
    }

    // ロールベースのアクセス制御（Clerkの組織機能を使用）
    if (requiredRole) {
      // 実際のロールチェックロジックを実装
      console.log('Role checking would go here')
    }
  }, [isLoaded, userId, sessionId, router, requiredRole])

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!userId || !sessionId) {
    return null // リダイレクト中
  }

  return <>{children}</>
}
```

### サーバーサイドでの認証チェック

```typescript
// app/dashboard/page.tsx
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  // ユーザーデータの取得
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { todos: true }
  })

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">
        ようこそ、{session.user.name}さん！
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">あなたのTodo</h3>
          <p className="text-2xl font-bold text-blue-600">
            {user?.todos.length || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">完了済み</h3>
          <p className="text-2xl font-bold text-green-600">
            {user?.todos.filter(todo => todo.completed).length || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">未完了</h3>
          <p className="text-2xl font-bold text-orange-600">
            {user?.todos.filter(todo => !todo.completed).length || 0}
          </p>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
```

## 🎯 v0コンポーネントとの統合

### 認証UIコンポーネント

v0で生成したコンポーネントに認証機能を統合します。

```typescript
// src/components/ui/auth/AuthButton.tsx
'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useClerk } from '@clerk/nextjs'
import { User, LogOut, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/forms/Button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/navigation/DropdownMenu'

interface AuthButtonProps {
  useClerk?: boolean
}

export default function AuthButton({ useClerk = false }: AuthButtonProps) {
  // Auth.jsの場合
  const { data: session, status } = useSession()

  // Clerkの場合
  const { isLoaded, isSignedIn, user, signOut: clerkSignOut } = useClerk()

  if (useClerk) {
    if (!isLoaded || !isSignedIn) {
      return (
        <Button onClick={() => signIn()} variant="outline">
          <LogIn className="w-4 h-4 mr-2" />
          ログイン
        </Button>
      )
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            {user?.firstName || 'ユーザー'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => clerkSignOut()}>
            <LogOut className="w-4 h-4 mr-2" />
            ログアウト
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Auth.jsの場合
  if (status === 'loading') {
    return <div className="w-20 h-10 bg-gray-200 rounded animate-pulse"></div>
  }

  if (!session) {
    return (
      <Button onClick={() => signIn()} variant="outline">
        <LogIn className="w-4 h-4 mr-2" />
        ログイン
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <User className="w-4 h-4" />
          {session.user?.name || 'ユーザー'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="w-4 h-4 mr-2" />
          ログアウト
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### ログインフォームの統合

```typescript
// src/components/ui/auth/SignInForm.tsx
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/forms/Button'
import { Input } from '@/components/ui/forms/Input'
import { Card } from '@/components/ui/layout/Card'

export default function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('メールアドレスまたはパスワードが間違っています')
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (error) {
      setError('ログインに失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="max-w-md mx-auto">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-center mb-6">ログイン</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              メールアドレス
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              パスワード
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'ログイン中...' : 'ログイン'}
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">または</span>
            </div>
          </div>

          <Button
            onClick={() => signIn('google')}
            variant="outline"
            className="w-full mt-4"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Googleでログイン
          </Button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          アカウントをお持ちでない方は{' '}
          <a href="/auth/signup" className="text-blue-600 hover:underline">
            こちら
          </a>
        </p>
      </div>
    </Card>
  )
}
```

## 🎨 Todoアプリで実践してみよう

それでは、学習した内容を踏まえてTodoアプリに認証機能を実装してみましょう。

:::step

1. Auth.jsのインストール

Auth.jsと関連パッケージをインストールします。

```bash
npm install next-auth bcryptjs @types/bcryptjs
```

2. 環境変数の設定

`.env.local`ファイルを作成し、以下の設定を追加してください。

```bash
# Auth.js設定
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth設定
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# データベース設定（例：SQLite）
DATABASE_URL="file:./dev.db"
```

3. Prismaの設定

`prisma/schema.prisma`を作成し、以下のスキーマを追加してください。

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
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
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  password      String?
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  todos         Todo[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

model Todo {
  id        String   @id @default(cuid())
  title     String
  completed Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

4. Prismaクライアントの生成

```bash
npx prisma generate
npx prisma db push
```

5. Auth設定ファイルの作成

`src/lib/auth.ts`を作成し、以下のコードを追加してください。

```typescript
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
  }
}

export default NextAuth(authOptions)
```

6. APIルートの作成

`src/app/api/auth/[...nextauth]/route.ts`を作成してください。

```typescript
import { authOptions } from '@/lib/auth'
import NextAuth from 'next-auth'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
```

7. セッションプロバイダーの設定

`src/app/providers.tsx`を更新してください。

```typescript
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </SessionProvider>
  )
}
```

8. ログインページの作成

`src/app/auth/signin/page.tsx`を作成してください。

```typescript
import SignInForm from '@/components/ui/auth/SignInForm'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            アカウントにログイン
          </h2>
        </div>
        <SignInForm />
      </div>
    </div>
  )
}
```

9. ダッシュボードページの作成

`src/app/dashboard/page.tsx`を作成してください。

```typescript
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import TodoList from '@/components/TodoList'
import SignOutButton from '@/components/ui/auth/SignOutButton'

async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    include: { todos: true }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Todoアプリ
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                ようこそ、{session.user.name}さん
              </span>
              <SignOutButton />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ダッシュボード
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">あなたのTodo</h3>
              <p className="text-3xl font-bold text-blue-600">
                {user?.todos.length || 0}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">完了済み</h3>
              <p className="text-3xl font-bold text-green-600">
                {user?.todos.filter(todo => todo.completed).length || 0}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">未完了</h3>
              <p className="text-3xl font-bold text-orange-600">
                {user?.todos.filter(todo => !todo.completed).length || 0}
              </p>
            </div>
          </div>
        </div>

        <TodoList userId={user?.id} />
      </main>
    </div>
  )
}

export default DashboardPage
```

10. ホームページの更新

`src/app/page.tsx`を更新して、認証状態に応じた表示を行います。

```typescript
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Next.js + v0 Todoアプリ
        </h2>
        <p className="text-gray-600 mb-8">
          認証機能を実装したTodo管理アプリケーション
        </p>

        {session ? (
          <div>
            <p className="mb-4">
              ようこそ、{session.user.name}さん！
            </p>
            <Link
              href="/dashboard"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              ダッシュボードへ
            </Link>
          </div>
        ) : (
          <div className="flex justify-center space-x-4">
            <Link
              href="/auth/signin"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              ログイン
            </Link>
            <Link
              href="/auth/signup"
              className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
            >
              新規登録
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">ユーザー認証</h3>
          <p className="text-gray-600">
            安全なログイン機能とユーザー管理
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">個人データ</h3>
          <p className="text-gray-600">
            各ユーザーのTodoを個別に管理
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">セキュア設計</h3>
          <p className="text-gray-600">
            最新のセキュリティ対策を実装
          </p>
        </div>
      </div>
    </div>
  )
}
```

11. 開発サーバーの起動

次のコマンドを実行して開発サーバーを起動します。

```bash
npm run dev
```

12. ブラウザで動作確認

ブラウザを開き、`http://localhost:3000`にアクセスします。
ログイン、ユーザー登録、ダッシュボードへのアクセスができれば成功です。

13. コミット

修正した内容をコミットします。

```bash
git add .
git commit -m "Implement authentication with Auth.js"
```

:::

このように、Auth.jsを使用した認証機能を実装することができました。

## 📊 セキュリティベストプラクティス

### 認証セキュリティ

:::warning セキュリティ考慮事項

- **パスワードハッシュ化**：bcryptなどの安全なハッシュアルゴリズムを使用
- **セッションタイムアウト**：適切な有効期限を設定
- **HTTPSの強制**：すべての通信を暗号化
- **CSRF保護**：クロスサイトリクエストフォージェリを防止
- **レート制限**：ブルートフォース攻撃を防止

:::

### データ保護

```typescript
// セキュリティミドルウェアの例
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function securityMiddleware(request: NextRequest) {
  const response = NextResponse.next()

  // セキュリティヘッダーの設定
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
  )

  return response
}
```

## 🎉 まとめ

このページでは、Next.jsアプリケーションにおける認証システムの実装方法を学びました。Auth.jsとClerkという主要な認証ソリューションを使用した実践的な手法を理解し、セキュアなユーザー管理のスキルを習得しました。

:::note 要点のまとめ

- Auth.jsはNext.jsに最適化された認証ライブラリ
- Clerkは簡単に導入できるモダンな認証ソリューション
- セッション管理とアクセス制御がセキュリティの鍵
- v0コンポーネントとの統合で一貫したUIを提供
- セキュリティベストプラクティスの遵守が不可欠

:::

次のページでは、**フォーム/バリデーション/ファイルアップロード**について学び、ユーザー入力処理の高度な手法を理解していきます。

[次のページ：フォーム処理](./forms-validation-upload)

## 🔗 関連リンク

- [Auth.js公式ドキュメント](https://next-auth.js.org/)
- [Clerk公式ドキュメント](https://clerk.com/)
- [Next.js認証ドキュメント](https://nextjs.org/docs/app/building-your-application/authentication)
- [OWASP認証チートシート](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

## 📚 さらに深く学習したい方へ

このページで学ぶ内容は、現代のWebアプリケーション開発において重要なスキルです。より深く学習したい方は、以下のトピックも参照してください：

- 多要素認証（MFA）の実装
- ロールベースアクセス制御（RBAC）
- SSO（シングルサインオン）の統合
- セキュリティ監査とペネトレーションテスト