---
title: サーバーアクション/APIルート/エッジ | Next.jsバックエンド機能の実践ガイド
slug: server-actions-api
parent: "app-assembly"
file_path: app-assembly/server-actions-api
target_user: "経験2年以内のフロントエンドエンジニア"
goal: "Next.jsのサーバーアクション、APIルート、エッジ機能を理解し、v0コンポーネントと連携した実践的なバックエンド開発スキルを習得する"
status: publish
post_type: pages
seo_title: Next.jsサーバーサイド開発完全ガイド | サーバーアクションとAPIルートの実践
seo_keywords: "Next.js, サーバーアクション, APIルート, エッジ, バックエンド, v0コンポーネント, Server Components, ミドルウェア"
seo_description: Next.jsのサーバーアクション、APIルート、エッジ機能の包括的ガイド。v0コンポーネントと連携した実践的なバックエンド開発手法を学びます。
handson_overview: "Todoアプリを例に、Next.jsのサーバーアクションでデータ操作、APIルートでエンドポイント作成、エッジ関数でグローバル配信を実装するハンズオン。v0コンポーネントとの連携も含む"
---

## ⚡ はじめに

Next.jsのサーバーサイド機能は、フロントエンドとバックエンドの境界を曖昧にし、よりシンプルで効率的な開発を可能にします。このセクションでは、サーバーアクション、APIルート、エッジ機能の実装方法を学びます。

### このページで学べる事

:::note このページで学べること

- **サーバーアクション**の基本概念と実装パターン
- **APIルート**の作成とデータ処理
- **エッジ関数**によるグローバル配信
- **v0コンポーネント**との連携方法
- **セキュリティ**と**パフォーマンス**の考慮事項

:::

## 🔧 サーバーアクションの基礎

### サーバーアクションとは

サーバーアクションは、Next.js 14で導入された機能で、クライアントコンポーネントから直接サーバーサイド関数を呼び出すことができます。

:::note サーバーアクションの特徴

- **直接サーバー関数呼び出し**：APIルートを介さずにサーバーサイドロジックを実行
- **フォーム処理の簡素化**：従来のフォーム送信ロジックが不要
- **型安全性**：TypeScriptの型チェックがクライアントとサーバー間で有効
- **セキュリティ**：自動的なCSRF保護

:::

### 基本的なサーバーアクションの実装

:::syntax サーバーアクションの基本構文

```typescript
// app/actions/todos.ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

interface Todo {
  id: string
  title: string
  completed: boolean
  createdAt: string
}

// メモリストレージ（実際にはデータベースを使用）
let todos: Todo[] = []

export async function createTodo(formData: FormData) {
  const title = formData.get('title') as string

  if (!title || title.trim() === '') {
    throw new Error('タイトルは必須です')
  }

  const newTodo: Todo = {
    id: Date.now().toString(),
    title: title.trim(),
    completed: false,
    createdAt: new Date().toISOString()
  }

  todos.push(newTodo)

  // キャッシュを再検証
  revalidatePath('/')

  return newTodo
}

export async function toggleTodo(id: string) {
  const todo = todos.find(t => t.id === id)
  if (!todo) {
    throw new Error('Todoが見つかりません')
  }

  todo.completed = !todo.completed
  revalidatePath('/')

  return todo
}

export async function deleteTodo(id: string) {
  const index = todos.findIndex(t => t.id === id)
  if (index === -1) {
    throw new Error('Todoが見つかりません')
  }

  todos.splice(index, 1)
  revalidatePath('/')

  return { success: true }
}
```

このコードは、Todoの作成、状態切り替え、削除を行うサーバーアクションを定義しています。`'use server'`ディレクティブでサーバーサイドでの実行を明示し、`revalidatePath`でキャッシュの再検証を行います。

:::

### サーバーアクションの呼び出し

クライアントコンポーネントからサーバーアクションを呼び出す方法です。

```typescript
// src/components/TodoItem.tsx
'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { toggleTodo, deleteTodo } from '@/app/actions/todos'

interface TodoItemProps {
  todo: {
    id: string
    title: string
    completed: boolean
  }
}

function DeleteButton({ id }: { id: string }) {
  const { pending } = useFormStatus()

  return (
    <button
      formAction={deleteTodo}
      disabled={pending}
      className="text-red-600 hover:text-red-800 disabled:opacity-50"
    >
      {pending ? '削除中...' : '削除'}
    </button>
  )
}

export default function TodoItem({ todo }: TodoItemProps) {
  const [state, action] = useFormState(toggleTodo, todo)

  return (
    <li className="flex items-center justify-between p-3 bg-white rounded shadow">
      <form action={action}>
        <input type="hidden" name="id" value={todo.id} />
        <button
          type="submit"
          className={`flex items-center space-x-2 ${
            state.completed ? 'line-through text-gray-500' : 'text-gray-900'
          }`}
        >
          <input
            type="checkbox"
            checked={state.completed}
            onChange={() => {}}
            className="mr-2"
          />
          <span>{state.title}</span>
        </button>
      </form>
      <DeleteButton id={todo.id} />
    </li>
  )
}
```

## 🚀 APIルートの実装

### APIルートの基本構造

Next.js App Routerでは、`app/api`ディレクトリ以下にAPIルートを作成します。

:::syntax APIルートの基本構造

```typescript
// app/api/todos/route.ts
import { NextRequest, NextResponse } from 'next/server'

// メモリストレージ（実際にはデータベースを使用）
let todos = [
  { id: '1', title: 'Next.jsを学ぶ', completed: false, createdAt: '2024-01-01' },
  { id: '2', title: 'v0コンポーネントを作成', completed: true, createdAt: '2024-01-02' }
]

// GETリクエストの処理
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const completed = searchParams.get('completed')

    let filteredTodos = todos
    if (completed !== null) {
      filteredTodos = todos.filter(todo =>
        todo.completed === (completed === 'true')
      )
    }

    return NextResponse.json({
      success: true,
      data: filteredTodos,
      total: filteredTodos.length
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'データ取得に失敗しました' },
      { status: 500 }
    )
  }
}

// POSTリクエストの処理
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title } = body

    if (!title || title.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'タイトルは必須です' },
        { status: 400 }
      )
    }

    const newTodo = {
      id: Date.now().toString(),
      title: title.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    }

    todos.push(newTodo)

    return NextResponse.json({
      success: true,
      data: newTodo
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'データ作成に失敗しました' },
      { status: 500 }
    )
  }
}
```

このAPIルートは、Todoデータの取得（GET）と作成（POST）を処理します。エラーハンドリングとバリデーションを含め、RESTfulな設計に従っています。

:::

### 動的APIルート

動的なパラメータを持つAPIルートを作成します。

```typescript
// app/api/todos/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'

// メモリストレージ（実際にはデータベースを使用）
let todos = [
  { id: '1', title: 'Next.jsを学ぶ', completed: false, createdAt: '2024-01-01' },
  { id: '2', title: 'v0コンポーネントを作成', completed: true, createdAt: '2024-01-02' }
]

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const todo = todos.find(t => t.id === params.id)

    if (!todo) {
      return NextResponse.json(
        { success: false, error: 'Todoが見つかりません' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: todo
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'データ取得に失敗しました' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, completed } = body

    const todoIndex = todos.findIndex(t => t.id === params.id)
    if (todoIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Todoが見つかりません' },
        { status: 404 }
      )
    }

    todos[todoIndex] = {
      ...todos[todoIndex],
      ...(title && { title: title.trim() }),
      ...(completed !== undefined && { completed })
    }

    return NextResponse.json({
      success: true,
      data: todos[todoIndex]
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'データ更新に失敗しました' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const todoIndex = todos.findIndex(t => t.id === params.id)
    if (todoIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Todoが見つかりません' },
        { status: 404 }
      )
    }

    todos.splice(todoIndex, 1)

    return NextResponse.json({
      success: true,
      message: 'Todoを削除しました'
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'データ削除に失敗しました' },
      { status: 500 }
    )
  }
}
```

## 🌐 エッジ関数の活用

### エッジ関数とは

エッジ関数は、CDNのエッジロケーションでコードを実行する機能です。

:::note エッジ関数の特徴

- **低レイテンシ**：ユーザーに近い場所でコードを実行
- **グローバル配信**：世界中のユーザーに高速にレスポンス
- **リアルタイム処理**：地理位置情報に基づく動的コンテンツ生成
- **スケーラビリティ**：自動スケーリングによる高可用性

:::

### エッジAPIルートの実装

:::syntax エッジAPIルートの基本構造

```typescript
// app/api/user/location/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    // ヘッダーから地理位置情報を取得
    const headersList = headers()
    const country = headersList.get('x-vercel-ip-country') || 'JP'
    const city = headersList.get('x-vercel-ip-city') || 'Tokyo'

    // ユーザーのIPアドレスを取得
    const ip = headersList.get('x-forwarded-for') ||
              headersList.get('x-real-ip') ||
              'unknown'

    // 地理位置情報に基づくコンテンツを生成
    const locationBasedContent = {
      country,
      city,
      ip,
      timezone: getTimezone(country),
      localTime: new Date().toLocaleString('ja-JP', {
        timeZone: getTimezone(country)
      }),
      greeting: getGreeting(country)
    }

    return NextResponse.json({
      success: true,
      data: locationBasedContent
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '位置情報の取得に失敗しました' },
      { status: 500 }
    )
  }
}

function getTimezone(country: string): string {
  const timezones: Record<string, string> = {
    'JP': 'Asia/Tokyo',
    'US': 'America/New_York',
    'GB': 'Europe/London',
    'FR': 'Europe/Paris',
    'DE': 'Europe/Berlin'
  }
  return timezones[country] || 'UTC'
}

function getGreeting(country: string): string {
  const greetings: Record<string, string> = {
    'JP': 'こんにちは',
    'US': 'Hello',
    'GB': 'Hello',
    'FR': 'Bonjour',
    'DE': 'Guten Tag'
  }
  return greetings[country] || 'Hello'
}
```

このエッジAPIルートは、ユーザーの地理位置情報に基づいてパーソナライズされたコンテンツを生成します。`runtime = 'edge'`を指定することで、エッジ環境で実行されます。

:::

### ミドルウェアの実装

ミドルウェアを使用して、リクエストの前処理を行います。

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()

  // 認証チェック
  const supabase = createMiddlewareSupabaseClient({
    req: request,
    res
  })

  const {
    data: { session }
  } = await supabase.auth.getSession()

  // 保護されたルートへのアクセス制御
  const protectedPaths = ['/dashboard', '/profile', '/settings']
  const isProtectedPath = protectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  )

  if (isProtectedPath && !session) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // CORSヘッダーの設定
  res.headers.set('Access-Control-Allow-Origin', '*')
  res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // レスポンスヘッダーの追加
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('X-Content-Type-Options', 'nosniff')

  return res
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

## 🎯 v0コンポーネントとの連携

### フォームコンポーネントの統合

v0で生成したフォームコンポーネントにサーバーアクションを統合します。

```typescript
// src/components/ui/forms/TodoForm.tsx
'use client'

import { useRef } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { createTodo } from '@/app/actions/todos'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? '追加中...' : 'Todoを追加'}
    </button>
  )
}

export default function TodoForm() {
  const [state, action] = useFormState(createTodo, null)
  const formRef = useRef<HTMLFormElement>(null)

  if (state?.success) {
    // フォームをリセット
    formRef.current?.reset()
  }

  return (
    <form ref={formRef} action={action} className="mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          name="title"
          placeholder="新しいTodoを入力..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <SubmitButton />
      </div>
      {state?.error && (
        <p className="text-red-600 text-sm mt-2">{state.error}</p>
      )}
      {state?.success && (
        <p className="text-green-600 text-sm mt-2">Todoを追加しました！</p>
      )}
    </form>
  )
}
```

### APIクライアントの実装

v0コンポーネントからAPIを呼び出すためのクライアントを実装します。

```typescript
// src/lib/api-client.ts
class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'APIリクエストに失敗しました')
    }

    return response.json()
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

export const apiClient = new ApiClient()

// 使用例
export const todosApi = {
  getAll: () => apiClient.get('/todos'),
  getById: (id: string) => apiClient.get(`/todos/${id}`),
  create: (data: any) => apiClient.post('/todos', data),
  update: (id: string, data: any) => apiClient.put(`/todos/${id}`, data),
  delete: (id: string) => apiClient.delete(`/todos/${id}`),
}
```

## 🎨 Todoアプリで実践してみよう

それでは、学習した内容を踏まえてTodoアプリのバックエンド機能を実装してみましょう。

:::step

1. サーバーアクションの作成

`app/actions/todos.ts`を作成し、以下のコードを追加してください。

```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

interface Todo {
  id: string
  title: string
  completed: boolean
  createdAt: string
}

// メモリストレージ（実際にはデータベースを使用）
let todos: Todo[] = [
  { id: '1', title: 'Next.jsを学ぶ', completed: false, createdAt: '2024-01-01' },
  { id: '2', title: 'v0コンポーネントを作成', completed: true, createdAt: '2024-01-02' }
]

export async function getTodos() {
  return todos
}

export async function createTodo(formData: FormData) {
  const title = formData.get('title') as string

  if (!title || title.trim() === '') {
    throw new Error('タイトルは必須です')
  }

  const newTodo: Todo = {
    id: Date.now().toString(),
    title: title.trim(),
    completed: false,
    createdAt: new Date().toISOString()
  }

  todos.push(newTodo)
  revalidatePath('/')

  return newTodo
}

export async function toggleTodo(id: string) {
  const todo = todos.find(t => t.id === id)
  if (!todo) {
    throw new Error('Todoが見つかりません')
  }

  todo.completed = !todo.completed
  revalidatePath('/')

  return todo
}

export async function deleteTodo(id: string) {
  const index = todos.findIndex(t => t.id === id)
  if (index === -1) {
    throw new Error('Todoが見つかりません')
  }

  todos.splice(index, 1)
  revalidatePath('/')

  return { success: true }
}
```

2. APIルートの作成

`app/api/todos/route.ts`を作成し、以下のコードを追加してください。

```typescript
import { NextRequest, NextResponse } from 'next/server'

let todos = [
  { id: '1', title: 'Next.jsを学ぶ', completed: false, createdAt: '2024-01-01' },
  { id: '2', title: 'v0コンポーネントを作成', completed: true, createdAt: '2024-01-02' }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const completed = searchParams.get('completed')

    let filteredTodos = todos
    if (completed !== null) {
      filteredTodos = todos.filter(todo =>
        todo.completed === (completed === 'true')
      )
    }

    return NextResponse.json({
      success: true,
      data: filteredTodos,
      total: filteredTodos.length
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'データ取得に失敗しました' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title } = body

    if (!title || title.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'タイトルは必須です' },
        { status: 400 }
      )
    }

    const newTodo = {
      id: Date.now().toString(),
      title: title.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    }

    todos.push(newTodo)

    return NextResponse.json({
      success: true,
      data: newTodo
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'データ作成に失敗しました' },
      { status: 500 }
    )
  }
}
```

3. Todoリストコンポーネントの作成

`src/components/TodoList.tsx`を作成し、以下のコードを追加してください。

```typescript
'use client'

import { useState, useEffect } from 'react'
import TodoItem from './TodoItem'
import TodoForm from './TodoForm'

interface Todo {
  id: string
  title: string
  completed: boolean
  createdAt: string
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/todos')
      const data = await response.json()
      if (data.success) {
        setTodos(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch todos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTodoAdded = (newTodo: Todo) => {
    setTodos(prevTodos => [newTodo, ...prevTodos])
  }

  const handleTodoUpdated = (updatedTodo: Todo) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === updatedTodo.id ? updatedTodo : todo
      )
    )
  }

  const handleTodoDeleted = (id: string) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id))
  }

  if (loading) {
    return <div className="text-center py-8">読み込み中...</div>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Todoリスト</h2>
      <TodoForm onTodoAdded={handleTodoAdded} />
      <ul className="space-y-2">
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onTodoUpdated={handleTodoUpdated}
            onTodoDeleted={handleTodoDeleted}
          />
        ))}
      </ul>
      {todos.length === 0 && (
        <p className="text-gray-500 text-center py-8">
          Todoがまだありません。最初のTodoを追加してください！
        </p>
      )}
    </div>
  )
}
```

4. ホームページの更新

`app/page.tsx`を更新してTodoリストを表示します。

```typescript
import TodoList from '@/components/TodoList'

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Next.js + v0 Todoアプリ
        </h2>
        <p className="text-gray-600">
          サーバーアクションとAPIルートを実装したTodo管理アプリケーション
        </p>
      </div>
      <TodoList />
    </div>
  )
}
```

5. 開発サーバーの起動

次のコマンドを実行して開発サーバーを起動します。

```bash
npm run dev
```

6. ブラウザで動作確認

ブラウザを開き、`http://localhost:3000`にアクセスします。
Todoの追加、状態切り替え、削除ができれば成功です。

7. APIのテスト

別のターミナルでAPIをテストします。

```bash
# Todo一覧の取得
curl http://localhost:3000/api/todos

# 新しいTodoの作成
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "APIテスト"}'

# 完了したTodoのみ取得
curl "http://localhost:3000/api/todos?completed=true"
```

8. コミット

修正した内容をコミットします。

```bash
git add .
git commit -m "Implement server actions and API routes"
```

:::

このように、Next.jsのサーバーサイド機能を実装することができました。

## 🔒 セキュリティとパフォーマンスの考慮事項

### セキュリティベストプラクティス

:::warning セキュリティ考慮事項

- **入力バリデーション**：すべてのユーザー入力を検証
- **SQLインジェクション対策**：パラメータ化されたクエリを使用
- **CSRF保護**：サーバーアクションは自動的に保護される
- **レート制限**：APIエンドポイントへの過剰なリクエストを制限
- **認証と認可**：適切なアクセス制御を実装

:::

### パフォーマンス最適化

:::note パフォーマンス最適化のポイント

- **キャッシュ戦略**：`revalidatePath`と`revalidateTag`を適切に使用
- **データベース接続プーリング**：効率的なリソース管理
- **エッジキャッシュ**：静的コンテンツをCDNでキャッシュ
- **リクエスト最適化**：不要なデータ転送を削減
- **モニタリング**：パフォーマンス指標を追跡

:::

## 🎉 まとめ

このページでは、Next.jsのサーバーサイド機能について学びました。サーバーアクション、APIルート、エッジ関数の実装方法を理解し、v0コンポーネントとの連携方法を習得しました。

:::note 要点のまとめ

- サーバーアクションはクライアントから直接サーバー関数を呼び出せる機能
- APIルートはRESTfulなエンドポイントを簡単に作成できる
- エッジ関数はグローバルな配信と低レイテンシを実現
- セキュリティとパフォーマンスの考慮が重要
- v0コンポーネントとの連携でシームレスな開発が可能

:::

次のページでは、**データ取得（SWR/React Query/キャッシュ）**について学び、効率的なデータ管理の方法を理解していきます。

[次のページ：データ取得](./data-fetching)

## 🔗 関連リンク

- [Next.js Server Actionsドキュメント](https://nextjs.org/docs/app/api-reference/functions/server-actions)
- [Next.js API Routesドキュメント](https://nextjs.org/docs/app/building-your-application/routing/api-routes)
- [Next.js Edge Functionsドキュメント](https://nextjs.org/docs/app/building-your-application/routing/edge-functions)
- [Next.js Middlewareドキュメント](https://nextjs.org/docs/app/building-your-application/routing/middleware)

## 📚 さらに深く学習したい方へ

このページで学ぶ内容は、現代のWebアプリケーション開発において重要なスキルです。より深く学習したい方は、以下のトピックも参照してください：

- データベース接続とORMの最適化
- 認証システムの設計パターン
- マイクロサービスアーキテクチャ
- サーバーレス関数のベストプラクティス