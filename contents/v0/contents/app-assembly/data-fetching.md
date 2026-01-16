---
title: データ取得（SWR/React Query/キャッシュ） | Next.jsデータ管理の最適化ガイド
slug: data-fetching
parent: "app-assembly"
file_path: app-assembly/data-fetching
target_user: "経験2年以内のフロントエンドエンジニア"
goal: "Next.jsアプリケーションにおける効率的なデータ取得方法を理解し、SWR、React Query、キャッシュ戦略を活用したパフォーマンス最適化のスキルを習得する"
status: publish
post_type: pages
seo_title: Next.jsデータ取得完全ガイド | SWRとReact Queryによるキャッシュ最適化
seo_keywords: "Next.js, データ取得, SWR, React Query, キャッシュ, パフォーマンス最適化, v0コンポーネント, Server Components"
seo_description: Next.jsアプリケーションにおけるデータ取得の包括的ガイド。SWR、React Query、キャッシュ戦略によるパフォーマンス最適化手法を学びます。
handson_overview: "Todoアプリを例に、SWRとReact Queryを使用した効率的なデータ取得、キャッシュ戦略の実装、Server Componentsとの連携を行うハンズオン。v0コンポーネントとの統合も含む"
---

## 🔄 はじめに

現代のWebアプリケーションでは、効率的なデータ取得とキャッシュ戦略が重要です。このセクションでは、SWR、React Query、Next.jsのキャッシュ機能を使ったデータ管理のベストプラクティスを学びます。

### このページで学べる事

:::note このページで学べること

- **データ取得の基本パターン**と最適化技術
- **SWR**によるシンプルなデータ取得とキャッシュ
- **React Query**による高度な状態管理
- **Next.jsキャッシュ**機能の活用方法
- **Server Components**とのデータ連携
- **パフォーマンス最適化**の実践的な手法

:::

## 📊 データ取得の基本パターン

### データ取得の課題

:::note 現代のデータ取得における課題

- **パフォーマンス**：不要な再取得による遅延
- **キャッシュ管理**：データの一貫性と鮮度の維持
- **状態同期**：複数コンポーネント間のデータ共有
- **エラーハンドリング**：ネットワークエラーへの対応
- **ユーザー体験**：ローディング状態の表示

:::

### Next.jsのデータ取得アプローチ

Next.jsでは、以下のデータ取得方法が利用できます。

```typescript
// 1. Server Componentsでのデータ取得
export default async function ServerComponent() {
  const data = await fetchData() // サーバーサイドで実行
  return <div>{data}</div>
}

// 2. Client Componentsでのデータ取得
'use client'

export default function ClientComponent() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetchData().then(setData) // クライアントサイドで実行
  }, [])

  return <div>{data}</div>
}

// 3. サーバーアクションでのデータ取得
export async function getData() {
  'use server'
  return await fetchData()
}
```

## 🚀 SWRによるデータ取得

### SWRとは

SWR（stale-while-revalidate）は、Vercelが開発したデータ取得ライブラリです。

:::note SWRの特徴

- **自動キャッシュ**：取得したデータを自動的にキャッシュ
- **バックグラウンド更新**：データを定期的に再検証
- **フォーカス時再取得**：ユーザーがタブに戻った時に更新
- **楽観的更新**：UIを先に更新し、後でサーバーと同期
- **シンプルなAPI**：最小限のコードで複雑な機能を実現

:::

### SWRの基本実装

:::syntax SWRの基本的な使用方法

```typescript
// src/hooks/useTodos.ts
import useSWR from 'swr'

interface Todo {
  id: string
  title: string
  completed: boolean
  createdAt: string
}

// フェッチャー関数
const fetcher = (url: string) => fetch(url).then(res => res.json())

// カスタムフック
export function useTodos() {
  const { data, error, mutate, isLoading } = useSWR<Todo[]>(
    '/api/todos',
    fetcher,
    {
      refreshInterval: 30000, // 30秒ごとに再取得
      revalidateOnFocus: true, // フォーカス時に再取得
      revalidateOnReconnect: true, // 再接続時に再取得
    }
  )

  return {
    todos: data || [],
    isLoading,
    isError: error,
    mutate,
  }
}

// フィルタリング用のフック
export function useFilteredTodos(filter: 'all' | 'active' | 'completed') {
  const { data, error, mutate, isLoading } = useSWR<Todo[]>(
    filter === 'all' ? '/api/todos' : `/api/todos?completed=${filter === 'completed'}`,
    fetcher
  )

  return {
    todos: data || [],
    isLoading,
    isError: error,
    mutate,
  }
}
```

このコードは、Todoデータを取得するためのカスタムフックを定義しています。SWRが自動的にキャッシュ管理と再取得を行い、パフォーマンスを最適化します。

:::

### SWRの高度な機能

```typescript
// src/hooks/useTodo.ts
import useSWR, { SWRConfiguration } from 'swr'

interface Todo {
  id: string
  title: string
  completed: boolean
  createdAt: string
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useTodo(id: string, options?: SWRConfiguration) {
  const { data, error, mutate, isLoading } = useSWR<Todo>(
    id ? `/api/todos/${id}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      ...options,
    }
  )

  // Todoを更新する関数
  const updateTodo = async (updatedData: Partial<Todo>) => {
    const response = await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    })

    if (!response.ok) {
      throw new Error('更新に失敗しました')
    }

    // ローカルキャッシュを即時更新
    mutate(await response.json(), false)
  }

  // Todoを削除する関数
  const deleteTodo = async () => {
    const response = await fetch(`/api/todos/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('削除に失敗しました')
    }

    // キャッシュから削除
    mutate(null, false)
  }

  return {
    todo: data,
    isLoading,
    isError: error,
    updateTodo,
    deleteTodo,
    mutate,
  }
}
```

## ⚛️ React Queryによるデータ管理

### React Queryとは

React Queryは、TanStackが開発した強力なデータ取得ライブラリです。

:::note React Queryの特徴

- **高度なキャッシュ管理**：キーベースのキャッシュシステム
- **自動ガベージコレクション**：未使用のキャッシュを自動削除
- **並列クエリ**：複数のクエリを同時に実行
- **依存クエリ**：他のクエリ結果に依存するクエリ
- **楽観的更新**：UIの即時更新とロールバック機能

:::

### React Queryの基本実装

:::syntax React Queryの基本的な使用方法

```typescript
// src/hooks/useTodosQuery.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

interface Todo {
  id: string
  title: string
  completed: boolean
  createdAt: string
}

// API関数
const fetchTodos = async (): Promise<Todo[]> => {
  const response = await fetch('/api/todos')
  if (!response.ok) {
    throw new Error('データ取得に失敗しました')
  }
  return response.json()
}

const createTodo = async (newTodo: { title: string }): Promise<Todo> => {
  const response = await fetch('/api/todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newTodo),
  })
  if (!response.ok) {
    throw new Error('作成に失敗しました')
  }
  return response.json()
}

// クエリフック
export function useTodos() {
  return useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
    staleTime: 5 * 60 * 1000, // 5分間データをfreshと見なす
    cacheTime: 10 * 60 * 1000, // 10分間キャッシュを保持
  })
}

// ミューテーションフック
export function useCreateTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTodo,
    onMutate: async (newTodo) => {
      // 楽観的更新のため、現在のデータをキャッシュ
      await queryClient.cancelQueries({ queryKey: ['todos'] })
      const previousTodos = queryClient.getQueryData<Todo[]>(['todos'])

      // 楽観的に更新
      if (previousTodos) {
        queryClient.setQueryData(['todos'], [
          ...previousTodos,
          { ...newTodo, id: 'temp', completed: false, createdAt: new Date().toISOString() }
        ])
      }

      return { previousTodos }
    },
    onError: (err, newTodo, context) => {
      // エラー時にロールバック
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos)
      }
    },
    onSettled: () => {
      // 成功・失敗に関わらずキャッシュを再検証
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })
}
```

このコードは、React Queryを使用したTodoデータの取得と作成を実装しています。楽観的更新とエラーハンドリングを含め、堅牢なデータ管理を提供します。

:::

### 並列クエリと依存クエリ

```typescript
// src/hooks/useDashboardData.ts
import { useQuery } from '@tanstack/react-query'

interface DashboardStats {
  totalTodos: number
  completedTodos: number
  activeTodos: number
}

interface RecentActivity {
  id: string
  action: string
  timestamp: string
}

const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const response = await fetch('/api/dashboard/stats')
  if (!response.ok) throw new Error('統計データ取得に失敗しました')
  return response.json()
}

const fetchRecentActivity = async (): Promise<RecentActivity[]> => {
  const response = await fetch('/api/dashboard/activity')
  if (!response.ok) throw new Error('アクティビティ取得に失敗しました')
  return response.json()
}

// 並列クエリ
export function useDashboardData() {
  const statsQuery = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: fetchDashboardStats,
  })

  const activityQuery = useQuery({
    queryKey: ['dashboard', 'activity'],
    queryFn: fetchRecentActivity,
  })

  return {
    stats: statsQuery.data,
    activity: activityQuery.data,
    isLoading: statsQuery.isLoading || activityQuery.isLoading,
    isError: statsQuery.isError || activityQuery.isError,
  }
}

// 依存クエリ
export function useUserTodos(userId: string) {
  // ユーザー情報のクエリ
  const userQuery = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetch(`/api/users/${userId}`).then(res => res.json()),
    enabled: !!userId, // userIdがある場合のみ実行
  })

  // ユーザーのTodoリストのクエリ（ユーザー情報に依存）
  const todosQuery = useQuery({
    queryKey: ['todos', 'user', userId],
    queryFn: () => fetch(`/api/users/${userId}/todos`).then(res => res.json()),
    enabled: !!userQuery.data, // ユーザー情報が取得できた場合のみ実行
  })

  return {
    user: userQuery.data,
    todos: todosQuery.data,
    isLoading: userQuery.isLoading || todosQuery.isLoading,
  }
}
```

## 🗃️ Next.jsキャッシュ機能

### Next.jsのキャッシュ戦略

Next.js 13以降では、自動的なキャッシュ機能が提供されています。

:::note Next.jsキャッシュの特徴

- **自動データキャッシュ**：`fetch`リクエストを自動的にキャッシュ
- **静的サイト生成**：ビルド時にページを事前生成
- **インクリメンタル静的再生成**：定期的にページを更新
- **クライアントサイドキャッシュ**：ブラウザでのキャッシュ管理

:::

### キャッシュの設定と制御

:::syntax Next.jsキャッシュの基本設定

```typescript
// app/page.tsx
async function getTodos(): Promise<Todo[]> {
  // 自動的にキャッシュされるfetch
  const response = await fetch('https://api.example.com/todos', {
    cache: 'force-cache', // 強制的にキャッシュを使用
    next: {
      tags: ['todos'], // キャッシュタグ
      revalidate: 60, // 60秒後に再検証
    },
  })

  if (!response.ok) {
    throw new Error('データ取得に失敗しました')
  }

  return response.json()
}

// サーバーコンポーネントでの使用
export default async function TodosPage() {
  const todos = await getTodos()

  return (
    <div>
      <h1>Todoリスト</h1>
      <TodoList todos={todos} />
    </div>
  )
}

// サーバーアクションでのキャッシュ再検証
'use server'

import { revalidateTag, revalidatePath } from 'next/cache'

export async function createTodo(formData: FormData) {
  const title = formData.get('title') as string

  // データベースに保存...

  // タグベースのキャッシュ再検証
  revalidateTag('todos')

  // パスベースのキャッシュ再検証
  revalidatePath('/')
}
```

このコードは、Next.jsのキャッシュ機能を活用したデータ取得と再検証を実装しています。`cache`オプションと`next`オプションでキャッシュ動作を細かく制御できます。

:::

### 動的キャッシュ制御

```typescript
// app/api/todos/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = searchParams.get('page') || '1'
  const limit = searchParams.get('limit') || '10'

  // キャッシュキーに動的パラメータを含める
  const cacheKey = `todos:${page}:${limit}`

  const response = await fetch(
    `https://api.example.com/todos?page=${page}&limit=${limit}`,
    {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
      },
      next: {
        tags: ['todos', `todos:${page}`],
      },
    }
  )

  const data = await response.json()

  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
      'CDN-Cache-Control': 'public, s-maxage=3600',
    },
  })
}
```

## 🎯 v0コンポーネントとの統合

### データフェッチングコンポーネント

v0で生成したコンポーネントにデータ取得機能を統合します。

```typescript
// src/components/ui/data/TodoCard.tsx
'use client'

import { useTodo } from '@/hooks/useTodo'
import { useTodoQuery } from '@/hooks/useTodosQuery'
import Card from './Card'
import Badge from './Badge'

interface TodoCardProps {
  id: string
  showActions?: boolean
}

export default function TodoCard({ id, showActions = true }: TodoCardProps) {
  // React Queryを使用
  const { data: todo, isLoading, isError } = useTodoQuery(id)

  if (isLoading) {
    return (
      <Card>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </Card>
    )
  }

  if (isError || !todo) {
    return (
      <Card className="border-red-200">
        <p className="text-red-600">Todoの読み込みに失敗しました</p>
      </Card>
    )
  }

  return (
    <Card className={todo.completed ? 'opacity-75' : ''}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className={`text-lg font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
            {todo.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            作成日: {new Date(todo.createdAt).toLocaleDateString('ja-JP')}
          </p>
          <div className="mt-2">
            <Badge variant={todo.completed ? 'success' : 'info'}>
              {todo.completed ? '完了' : '未完了'}
            </Badge>
          </div>
        </div>
        {showActions && (
          <TodoActions todo={todo} />
        )}
      </div>
    </Card>
  )
}

// アクションコンポーネント
function TodoActions({ todo }: { todo: any }) {
  const { updateTodo, deleteTodo } = useTodo(todo.id)

  const handleToggle = async () => {
    await updateTodo({ completed: !todo.completed })
  }

  const handleDelete = async () => {
    if (confirm('このTodoを削除してもよろしいですか？')) {
      await deleteTodo()
    }
  }

  return (
    <div className="flex space-x-2 ml-4">
      <button
        onClick={handleToggle}
        className="text-blue-600 hover:text-blue-800"
      >
        {todo.completed ? '未完了にする' : '完了にする'}
      </button>
      <button
        onClick={handleDelete}
        className="text-red-600 hover:text-red-800"
      >
        削除
      </button>
    </div>
  )
}
```

### 無限スクロールの実装

```typescript
// src/components/ui/data/InfiniteTodoList.tsx
'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { useCallback, useRef, useEffect } from 'react'
import TodoCard from './TodoCard'
import Button from './Button'

interface Todo {
  id: string
  title: string
  completed: boolean
  createdAt: string
}

interface TodosResponse {
  todos: Todo[]
  hasMore: boolean
  nextPage: number | null
}

const fetchTodos = async ({ pageParam = 1 }): Promise<TodosResponse> => {
  const response = await fetch(`/api/todos?page=${pageParam}&limit=10`)
  if (!response.ok) throw new Error('データ取得に失敗しました')
  return response.json()
}

export default function InfiniteTodoList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['todos', 'infinite'],
    queryFn: fetchTodos,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  })

  const observer = useRef<IntersectionObserver>()

  const lastTodoRef = useCallback(
    (element: HTMLDivElement) => {
      if (isFetchingNextPage) return

      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage()
        }
      })

      if (element) observer.current.observe(element)
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  )

  if (isLoading) {
    return <div className="text-center py-8">読み込み中...</div>
  }

  if (isError) {
    return <div className="text-center py-8 text-red-600">エラーが発生しました</div>
  }

  return (
    <div className="space-y-4">
      {data?.pages.map((page, pageIndex) => (
        <div key={pageIndex}>
          {page.todos.map((todo, index) => (
            <div
              key={todo.id}
              ref={index === page.todos.length - 1 ? lastTodoRef : undefined}
            >
              <TodoCard id={todo.id} />
            </div>
          ))}
        </div>
      ))}

      {isFetchingNextPage && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {hasNextPage && !isFetchingNextPage && (
        <div className="text-center">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            もっと読み込む
          </Button>
        </div>
      )}
    </div>
  )
}
```

## 🎨 Todoアプリで実践してみよう

それでは、学習した内容を踏まえてTodoアプリのデータ取得機能を最適化してみましょう。

:::step

1. React Queryのインストール

プロジェクトにReact Queryをインストールします。

```bash
npm install @tanstack/react-query
```

2. QueryClientの設定

`src/app/providers.tsx`を作成し、以下のコードを追加してください。

```typescript
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5分
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

3. レイアウトの更新

`app/layout.tsx`を更新してProvidersを追加します。

```typescript
import Providers from '@/app/providers'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-gray-50">
        <div className="min-h-screen">
          <header className="bg-white shadow-sm">
            {/* ヘッダーコンテンツ */}
          </header>
          <main>
            <Providers>{children}</Providers>
          </main>
        </div>
      </body>
    </html>
  )
}
```

4. カスタムフックの作成

`src/hooks/useTodosQuery.ts`を作成し、以下のコードを追加してください。

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

interface Todo {
  id: string
  title: string
  completed: boolean
  createdAt: string
}

const fetchTodos = async (): Promise<Todo[]> => {
  const response = await fetch('/api/todos')
  if (!response.ok) throw new Error('データ取得に失敗しました')
  return response.json()
}

const createTodo = async (newTodo: { title: string }): Promise<Todo> => {
  const response = await fetch('/api/todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newTodo),
  })
  if (!response.ok) throw new Error('作成に失敗しました')
  return response.json()
}

const toggleTodo = async (id: string): Promise<Todo> => {
  const response = await fetch(`/api/todos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ completed: 'toggle' }),
  })
  if (!response.ok) throw new Error('更新に失敗しました')
  return response.json()
}

const deleteTodo = async (id: string): Promise<void> => {
  const response = await fetch(`/api/todos/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('削除に失敗しました')
}

export function useTodos() {
  return useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  })
}

export function useCreateTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTodo,
    onMutate: async (newTodo) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] })
      const previousTodos = queryClient.getQueryData<Todo[]>(['todos'])

      if (previousTodos) {
        queryClient.setQueryData(['todos'], [
          ...previousTodos,
          { ...newTodo, id: 'temp', completed: false, createdAt: new Date().toISOString() }
        ])
      }

      return { previousTodos }
    },
    onError: (err, newTodo, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })
}

export function useToggleTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: toggleTodo,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] })
      const previousTodos = queryClient.getQueryData<Todo[]>(['todos'])

      if (previousTodos) {
        queryClient.setQueryData(['todos'],
          previousTodos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          )
        )
      }

      return { previousTodos }
    },
    onError: (err, id, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })
}

export function useDeleteTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteTodo,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] })
      const previousTodos = queryClient.getQueryData<Todo[]>(['todos'])

      if (previousTodos) {
        queryClient.setQueryData(['todos'],
          previousTodos.filter(todo => todo.id !== id)
        )
      }

      return { previousTodos }
    },
    onError: (err, id, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })
}
```

5. Todoリストコンポーネントの更新

`src/components/TodoList.tsx`を更新してReact Queryを使用します。

```typescript
'use client'

import { useTodos, useCreateTodo, useToggleTodo, useDeleteTodo } from '@/hooks/useTodosQuery'
import TodoItem from './TodoItem'
import { useState } from 'react'

interface Todo {
  id: string
  title: string
  completed: boolean
  createdAt: string
}

export default function TodoList() {
  const { data: todos, isLoading, isError } = useTodos()
  const createTodo = useCreateTodo()
  const toggleTodo = useToggleTodo()
  const deleteTodo = useDeleteTodo()
  const [newTodoTitle, setNewTodoTitle] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTodoTitle.trim()) {
      createTodo.mutate({ title: newTodoTitle.trim() })
      setNewTodoTitle('')
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">読み込み中...</div>
  }

  if (isError) {
    return <div className="text-center py-8 text-red-600">エラーが発生しました</div>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Todoリスト</h2>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            placeholder="新しいTodoを入力..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={createTodo.isPending}
          />
          <button
            type="submit"
            disabled={createTodo.isPending || !newTodoTitle.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {createTodo.isPending ? '追加中...' : '追加'}
          </button>
        </div>
        {createTodo.isError && (
          <p className="text-red-600 text-sm mt-2">Todoの追加に失敗しました</p>
        )}
      </form>

      <ul className="space-y-2">
        {todos?.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={() => toggleTodo.mutate(todo.id)}
            onDelete={() => deleteTodo.mutate(todo.id)}
            isToggling={toggleTodo.isPending}
            isDeleting={deleteTodo.isPending}
          />
        ))}
      </ul>

      {(!todos || todos.length === 0) && (
        <p className="text-gray-500 text-center py-8">
          Todoがまだありません。最初のTodoを追加してください！
        </p>
      )}
    </div>
  )
}
```

6. 開発サーバーの起動

次のコマンドを実行して開発サーバーを起動します。

```bash
npm run dev
```

7. ブラウザで動作確認

ブラウザを開き、`http://localhost:3000`にアクセスします。
Todoの追加、状態切り替え、削除がスムーズに行えれば成功です。

8. コミット

修正した内容をコミットします。

```bash
git add .
git commit -m "Implement React Query for data fetching and caching"
```

:::

このように、React Queryを使用した効率的なデータ取得を実装することができました。

## 📈 パフォーマンス最適化のベストプラクティス

### キャッシュ戦略の最適化

:::note キャッシュ最適化のポイント

- **staleTimeの設定**：データの鮮度に応じた適切な時間を設定
- **refetchOnWindowFocus**：ユーザー体験を考慮した設定
- **キャッシュキーの設計**：階層的で一貫性のあるキー命名
- **ガベージコレクション**：不要なキャッシュの適切な削除
- **事前取得**：ユーザーの行動を予測したデータ取得

:::

### ネットワーク最適化

```typescript
// リクエストのデバウンスとバッチ処理
import { debounce } from 'lodash-es'

export function useSearchTodos(searchTerm: string) {
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  return useQuery({
    queryKey: ['todos', 'search', debouncedSearchTerm],
    queryFn: () => fetchTodos(debouncedSearchTerm),
    enabled: debouncedSearchTerm.length > 2, // 3文字以上で検索
  })
}

// カスタムデバウンスフック
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
```

## 🎉 まとめ

このページでは、Next.jsアプリケーションにおける効率的なデータ取得方法を学びました。SWR、React Query、Next.jsのキャッシュ機能を使ったパフォーマンス最適化の手法を理解し、実践的なスキルを習得しました。

:::note 要点のまとめ

- SWRはシンプルなAPIで自動キャッシュと再取得を提供
- React Queryは高度なキャッシュ管理と状態管理が可能
- Next.jsの自動キャッシュ機能でサーバーサイド最適化
- 楽観的更新でユーザー体験を向上
- 適切なキャッシュ戦略がパフォーマンスの鍵

:::

次のページでは、**認証（Auth.js/Clerk）**について学び、セキュアなユーザー管理の方法を理解していきます。

[次のページ：認証](./authentication)

## 🔗 関連リンク

- [SWR公式ドキュメント](https://swr.vercel.app/)
- [React Query公式ドキュメント](https://tanstack.com/query/latest)
- [Next.js Cachingドキュメント](https://nextjs.org/docs/app/building-your-application/caching)
- [Next.js Data Fetchingドキュメント](https://nextjs.org/docs/app/building-your-application/data-fetching)

## 📚 さらに深く学習したい方へ

このページで学ぶ内容は、現代のWebアプリケーション開発において不可欠なスキルです。より深く学習したい方は、以下のトピックも参照してください：

- 大規模アプリケーションの状態管理パターン
- リアルタイムデータの同期戦略
- オフラインファーストアプローチ
- パフォーマンスモニタリングと最適化