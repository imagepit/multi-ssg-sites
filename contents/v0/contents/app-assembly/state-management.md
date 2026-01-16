---
title: 状態管理（useState/zustand/URL State） | Next.jsアプリ開発実践ガイド
slug: state-management
parent: "app-assembly"
file_path: app-assembly/state-management
target_user: "経験2年以内のフロントエンドエンジニア"
goal: "Next.jsアプリケーションにおける状態管理の様々なアプローチを理解し、適切な状態管理ソリューションを選択・実装できるようになる"
status: publish
post_type: pages
seo_title: Next.js状態管理完全ガイド | useState/Zustand/URL Stateの実践的活用法
seo_description: Next.jsアプリケーションでの状態管理パターンを包括的に解説。ローカル状態からグローバル状態まで、v0コンポーネント統合を含む実践的な実装方法を学びます。
seo_keywords: "Next.js, 状態管理, useState, Zustand, URL State, React, グローバル状態, パフォーマンス最適化"
handson_overview: "Todoアプリを例に、useState、Zustand、URL Stateを使った状態管理パターンを実装し、それぞれの適切な使い分けを学ぶハンズオン"
---

## 🔄 はじめに

状態管理はReactアプリケーションの心臓部です。このセクションでは、Next.jsアプリケーションにおける様々な状態管理アプローチを学び、アプリケーションの複雑さに応じた最適なソリューションを選択できるようになります。

### このページで学べる事

:::note このページで学べること

- **useState**を使ったローカル状態管理のベストプラクティス
- **Zustand**による軽量で効率的なグローバル状態管理
- **URL State**を活用したシェア可能な状態管理
- **状態管理パターン**の適切な選択基準
- **v0コンポーネント**との統合パターン
- **パフォーマンス最適化**とメモ化戦略

:::

## 🎯 状態管理の基本概念

### 状態の種類と適切な選択

:::note 状態の種類と管理方法

- **ローカル状態（UI State）**：コンポーネント内のみで使用する状態 → `useState`
- **グローバル状態（Application State）**：複数コンポーネントで共有する状態 → `Zustand`/`Context`
- **サーバー状態（Server State）**：サーバーから取得するデータ → `SWR`/`React Query`
- **URL状態（URL State）**：URLに保存する状態 → `URLSearchParams`
- **フォーム状態（Form State）**：フォームの入力状態 → `React Hook Form`

:::

### 状態管理の選択基準

```typescript
// 状態管理の選択ガイド
1. 状態のスコープを考える（単一コンポーネント vs 複数コンポーネント）
2. 更新頻度を考慮する（高頻度 vs 低頻度）
3. パフォーマンス要件を評価する（再レンダリングの影響）
4. 開発体験を重視する（学習コスト、開発効率）
5. 将来の拡張性を考慮する（アプリケーションの成長）
```

## 🏠 useStateによるローカル状態管理

### 基本的なuseStateの活用

```typescript
// src/components/TodoItem.tsx
'use client'

import { useState } from 'react'
import { Todo } from '@/types'

interface TodoItemProps {
  todo: Todo
  onUpdate: (id: string, updates: Partial<Todo>) => void
  onDelete: (id: string) => void
}

export default function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  // ローカル状態：編集モード
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.title)

  // ローカル状態：展開状態
  const [isExpanded, setIsExpanded] = useState(false)

  // ローカル状態：アニメーション
  const [isDeleting, setIsDeleting] = useState(false)

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(todo.id, { title: editText.trim() })
      setIsEditing(false)
    }
  }

  const handleDelete = () => {
    setIsDeleting(true)
    setTimeout(() => onDelete(todo.id), 300)
  }

  if (isDeleting) {
    return (
      <div className="opacity-0 transition-opacity duration-300 h-16">
        {/* 削除アニメーション */}
      </div>
    )
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <input
            type="checkbox"
            checked={todo.status === 'completed'}
            onChange={(e) => onUpdate(todo.id, {
              status: e.target.checked ? 'completed' : 'pending'
            })}
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
          />

          {isEditing ? (
            <div className="flex-1 flex space-x-2">
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="flex-1 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleSave()}
              />
              <button
                onClick={handleSave}
                className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                保存
              </button>
              <button
                onClick={() => {
                  setIsEditing(false)
                  setEditText(todo.title)
                }}
                className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                キャンセル
              </button>
            </div>
          ) : (
            <div className="flex-1">
              <h3 className={`font-medium ${todo.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                {todo.title}
              </h3>
              {todo.description && (
                <p className="text-sm text-gray-600 mt-1">{todo.description}</p>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d={isExpanded ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
            </svg>
          </button>

          {!isEditing && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-blue-600 hover:text-blue-800"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-red-600 hover:text-red-800"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className={`px-2 py-1 rounded-full ${
              todo.priority === 'high' ? 'bg-red-100 text-red-800' :
              todo.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              優先度: {todo.priority === 'high' ? '高' : todo.priority === 'medium' ? '中' : '低'}
            </span>
            {todo.dueDate && (
              <span>期限: {new Date(todo.dueDate).toLocaleDateString()}</span>
            )}
            <span>作成: {new Date(todo.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      )}
    </div>
  )
}
```

### 複雑なローカル状態の管理

```typescript
// src/components/TodoFilters.tsx
'use client'

import { useState, useMemo } from 'react'

interface TodoFiltersProps {
  onFilterChange: (filters: TodoFilters) => void
}

interface TodoFilters {
  status: 'all' | 'pending' | 'completed'
  priority: 'all' | 'low' | 'medium' | 'high'
  search: string
  sortBy: 'createdAt' | 'dueDate' | 'priority'
  sortOrder: 'asc' | 'desc'
}

export default function TodoFilters({ onFilterChange }: TodoFiltersProps) {
  // 複数の関連する状態を管理
  const [filters, setFilters] = useState<TodoFilters>({
    status: 'all',
    priority: 'all',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })

  // メモ化によるパフォーマンス最適化
  const filterOptions = useMemo(() => ({
    status: [
      { value: 'all', label: 'すべて' },
      { value: 'pending', label: '未完了' },
      { value: 'completed', label: '完了' }
    ],
    priority: [
      { value: 'all', label: 'すべて' },
      { value: 'low', label: '低' },
      { value: 'medium', label: '中' },
      { value: 'high', label: '高' }
    ],
    sortBy: [
      { value: 'createdAt', label: '作成日' },
      { value: 'dueDate', label: '期限' },
      { value: 'priority', label: '優先度' }
    ]
  }), [])

  // 状態更新をまとめて処理
  const updateFilter = (key: keyof TodoFilters, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* 検索入力 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">検索</label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            placeholder="Todoを検索..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* ステータスフィルター */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ステータス</label>
          <select
            value={filters.status}
            onChange={(e) => updateFilter('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {filterOptions.status.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* 優先度フィルター */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">優先度</label>
          <select
            value={filters.priority}
            onChange={(e) => updateFilter('priority', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {filterOptions.priority.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* 並び替え */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">並び替え</label>
          <select
            value={filters.sortBy}
            onChange={(e) => updateFilter('sortBy', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {filterOptions.sortBy.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* 並び順 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">順序</label>
          <select
            value={filters.sortOrder}
            onChange={(e) => updateFilter('sortOrder', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="desc">降順</option>
            <option value="asc">昇順</option>
          </select>
        </div>
      </div>

      {/* アクティブなフィルターの表示 */}
      <div className="mt-4 flex flex-wrap gap-2">
        {filters.status !== 'all' && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            ステータス: {filterOptions.status.find(s => s.value === filters.status)?.label}
          </span>
        )}
        {filters.priority !== 'all' && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            優先度: {filterOptions.priority.find(p => p.value === filters.priority)?.label}
          </span>
        )}
        {filters.search && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            検索: {filters.search}
          </span>
        )}
      </div>
    </div>
  )
}
```

## 🌍 Zustandによるグローバル状態管理

### Zustandの導入

```bash
npm install zustand
```

### ストアの作成

```typescript
// src/stores/todo-store.ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { Todo } from '@/types'

interface TodoState {
  todos: Todo[]
  loading: boolean
  error: string | null

  // アクション
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt'>) => void
  updateTodo: (id: string, updates: Partial<Todo>) => void
  deleteTodo: (id: string) => void
  toggleTodo: (id: string) => void
  setTodos: (todos: Todo[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  // フィルター状態
  filters: {
    status: 'all' | 'pending' | 'completed'
    priority: 'all' | 'low' | 'medium' | 'high'
    search: string
    sortBy: 'createdAt' | 'dueDate' | 'priority'
    sortOrder: 'asc' | 'desc'
  }
  updateFilters: (filters: Partial<TodoState['filters']>) => void

  // 計算された状態
  filteredTodos: Todo[]
  stats: {
    total: number
    completed: number
    pending: number
    overdue: number
  }
}

export const useTodoStore = create<TodoState>()(
  devtools(
    persist(
      (set, get) => ({
        todos: [],
        loading: false,
        error: null,

        filters: {
          status: 'all',
          priority: 'all',
          search: '',
          sortBy: 'createdAt',
          sortOrder: 'desc'
        },

        // アクション
        addTodo: (todoData) => {
          const newTodo: Todo = {
            ...todoData,
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString(),
          }

          set((state) => ({
            todos: [newTodo, ...state.todos]
          }))
        },

        updateTodo: (id, updates) => {
          set((state) => ({
            todos: state.todos.map((todo) =>
              todo.id === id ? { ...todo, ...updates } : todo
            )
          }))
        },

        deleteTodo: (id) => {
          set((state) => ({
            todos: state.todos.filter((todo) => todo.id !== id)
          }))
        },

        toggleTodo: (id) => {
          set((state) => ({
            todos: state.todos.map((todo) =>
              todo.id === id
                ? {
                    ...todo,
                    status: todo.status === 'completed' ? 'pending' : 'completed'
                  }
                : todo
            )
          }))
        },

        setTodos: (todos) => set({ todos }),
        setLoading: (loading) => set({ loading }),
        setError: (error) => set({ error }),

        updateFilters: (newFilters) => {
          set((state) => ({
            filters: { ...state.filters, ...newFilters }
          }))
        },

        // 計算された状態（ゲッター）
        get filteredTodos() {
          const { todos, filters } = get()

          return todos
            .filter((todo) => {
              // ステータスフィルター
              if (filters.status !== 'all' && todo.status !== filters.status) {
                return false
              }

              // 優先度フィルター
              if (filters.priority !== 'all' && todo.priority !== filters.priority) {
                return false
              }

              // 検索フィルター
              if (filters.search) {
                const searchLower = filters.search.toLowerCase()
                return (
                  todo.title.toLowerCase().includes(searchLower) ||
                  (todo.description?.toLowerCase().includes(searchLower) ?? false)
                )
              }

              return true
            })
            .sort((a, b) => {
              let aValue: any, bValue: any

              switch (filters.sortBy) {
                case 'createdAt':
                  aValue = new Date(a.createdAt).getTime()
                  bValue = new Date(b.createdAt).getTime()
                  break
                case 'dueDate':
                  aValue = a.dueDate ? new Date(a.dueDate).getTime() : 0
                  bValue = b.dueDate ? new Date(b.dueDate).getTime() : 0
                  break
                case 'priority':
                  const priorityOrder = { high: 3, medium: 2, low: 1 }
                  aValue = priorityOrder[a.priority]
                  bValue = priorityOrder[b.priority]
                  break
              }

              if (filters.sortOrder === 'asc') {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
              } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
              }
            })
        },

        get stats() {
          const { todos } = get()
          const now = new Date().getTime()

          return {
            total: todos.length,
            completed: todos.filter((t) => t.status === 'completed').length,
            pending: todos.filter((t) => t.status === 'pending').length,
            overdue: todos.filter(
              (t) =>
                t.status === 'pending' &&
                t.dueDate &&
                new Date(t.dueDate).getTime() < now
            ).length
          }
        }
      }),
      {
        name: 'todo-storage',
        partialize: (state) => ({
          todos: state.todos,
          filters: state.filters
        })
      }
    ),
    { name: 'todo-store' }
  )
)
```

### コンポーネントでの利用

```typescript
// src/components/TodoList.tsx
'use client'

import { useEffect } from 'react'
import { useTodoStore } from '@/stores/todo-store'
import TodoItem from './TodoItem'
import TodoFilters from './TodoFilters'

export default function TodoList() {
  const {
    todos,
    filteredTodos,
    stats,
    loading,
    error,
    filters,
    updateFilters,
    deleteTodo,
    updateTodo,
    toggleTodo,
    setTodos
  } = useTodoStore()

  // 初期データのロード（実際にはAPIから取得）
  useEffect(() => {
    // モックデータ
    const mockTodos: Todo[] = [
      {
        id: '1',
        title: 'Next.jsの学習',
        description: 'App Routerについて深く学ぶ',
        priority: 'high',
        status: 'pending',
        dueDate: '2024-01-15',
        createdAt: '2024-01-01T10:00:00Z'
      },
      {
        id: '2',
        title: 'v0コンポーネントの統合',
        priority: 'medium',
        status: 'pending',
        createdAt: '2024-01-02T10:00:00Z'
      }
    ]

    setTodos(mockTodos)
  }, [setTodos])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-medium">エラーが発生しました</h3>
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 統計情報 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-600">合計</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-sm text-gray-600">完了</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-gray-600">未完了</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
          <div className="text-sm text-gray-600">期限切れ</div>
        </div>
      </div>

      {/* フィルター */}
      <TodoFilters onFilterChange={updateFilters} />

      {/* Todoリスト */}
      <div className="space-y-3">
        {filteredTodos.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {todos.length === 0 ? 'Todoがありません' : '条件に一致するTodoがありません'}
            </h3>
            <p className="text-gray-500">
              {todos.length === 0
                ? '新しいTodoを作成しましょう'
                : 'フィルター条件を変更してください'
              }
            </p>
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onUpdate={updateTodo}
              onDelete={deleteTodo}
            />
          ))
        )}
      </div>

      {/* リスト情報 */}
      <div className="text-sm text-gray-500 text-center">
        {filteredTodos.length} / {todos.length} 件のTodoを表示
      </div>
    </div>
  )
}
```

## 🔗 URL Stateによる状態管理

### URLパラメータの活用

```typescript
// src/hooks/useURLState.ts
'use client'

import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

interface URLStateOptions {
  serialize?: (value: any) => string
  deserialize?: (value: string) => any
}

export function useURLState<T = string>(
  key: string,
  defaultValue: T,
  options: URLStateOptions = {}
) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const {
    serialize = JSON.stringify,
    deserialize = JSON.parse
  } = options

  const value = searchParams.has(key)
    ? deserialize(searchParams.get(key)!)
    : defaultValue

  const setValue = useCallback((newValue: T) => {
    const params = new URLSearchParams(searchParams.toString())

    if (newValue === defaultValue || newValue === undefined || newValue === null) {
      params.delete(key)
    } else {
      params.set(key, serialize(newValue))
    }

    router.push(`?${params.toString()}`, { scroll: false })
  }, [key, defaultValue, serialize, searchParams, router])

  return [value, setValue] as const
}

// プリミティブ値用のカスタムフック
export function useURLString(key: string, defaultValue: string) {
  return useURLState(key, defaultValue, {
    serialize: (value) => value.toString(),
    deserialize: (value) => value
  })
}

export function useURLNumber(key: string, defaultValue: number) {
  return useURLState(key, defaultValue, {
    serialize: (value) => value.toString(),
    deserialize: (value) => Number(value)
  })
}

export function useURLBoolean(key: string, defaultValue: boolean) {
  return useURLState(key, defaultValue, {
    serialize: (value) => value.toString(),
    deserialize: (value) => value === 'true'
  })
}
```

### URL Stateを活用したフィルタリング

```typescript
// src/components/TodoFiltersWithURL.tsx
'use client'

import { useURLString, useURLBoolean } from '@/hooks/useURLState'
import { useMemo } from 'react'

export default function TodoFiltersWithURL() {
  // URLパラメータから状態を管理
  const [search, setSearch] = useURLString('search', '')
  const [status, setStatus] = useURLString('status', 'all')
  const [priority, setPriority] = useURLString('priority', 'all')
  const [sortBy, setSortBy] = useURLString('sortBy', 'createdAt')
  const [sortOrder, setSortOrder] = useURLString('sortOrder', 'desc')
  const [showCompleted, setShowCompleted] = useURLBoolean('showCompleted', true)

  const filterOptions = useMemo(() => ({
    status: [
      { value: 'all', label: 'すべて' },
      { value: 'pending', label: '未完了' },
      { value: 'completed', label: '完了' }
    ],
    priority: [
      { value: 'all', label: 'すべて' },
      { value: 'low', label: '低' },
      { value: 'medium', label: '中' },
      { value: 'high', label: '高' }
    ],
    sortBy: [
      { value: 'createdAt', label: '作成日' },
      { value: 'dueDate', label: '期限' },
      { value: 'priority', label: '優先度' }
    ]
  }), [])

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* 検索入力 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">検索</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Todoを検索..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* ステータスフィルター */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ステータス</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {filterOptions.status.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* 優先度フィルター */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">優先度</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {filterOptions.priority.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* 並び替え */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">並び替え</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {filterOptions.sortBy.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* 表示オプション */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">表示オプション</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showCompleted}
                onChange={(e) => setShowCompleted(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm">完了を表示</span>
            </label>
          </div>
        </div>
      </div>

      {/* シェアボタン */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={() => {
            const url = new URL(window.location.href)
            navigator.clipboard.writeText(url.toString())
            alert('URLをコピーしました！')
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
        >
          🔗 フィルター条件をシェア
        </button>
      </div>
    </div>
  )
}
```

## 🎨 v0コンポーネントとの統合

### 状態管理を考慮したv0コンポーネント

```typescript
// src/components/ui/StatefulTodoCard.tsx
'use client'

import { useState } from 'react'
import { Todo } from '@/types'

interface StatefulTodoCardProps {
  todo: Todo
  onUpdate?: (id: string, updates: Partial<Todo>) => void
  onDelete?: (id: string) => void
  // v0コンポーネントのカスタマイズ用プロパティ
  variant?: 'default' | 'compact' | 'detailed'
  theme?: 'light' | 'dark'
  showActions?: boolean
}

export default function StatefulTodoCard({
  todo,
  onUpdate,
  onDelete,
  variant = 'default',
  theme = 'light',
  showActions = true
}: StatefulTodoCardProps) {
  // ローカル状態
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [actionMenuOpen, setActionMenuOpen] = useState(false)

  // v0で生成した基本コンポーネントを状態管理と統合
  const getPriorityColor = (priority: Todo['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
    }
  }

  const getStatusIcon = (status: Todo['status']) => {
    return status === 'completed' ? (
      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ) : (
      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" strokeWidth={2} />
      </svg>
    )
  }

  if (variant === 'compact') {
    return (
      <div
        className={`
          border rounded-lg p-3 transition-all duration-200
          ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
          ${isHovered ? 'shadow-md' : ''}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            {getStatusIcon(todo.status)}
            <span className={`font-medium ${todo.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {todo.title}
            </span>
            <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(todo.priority)}`}>
              {todo.priority === 'high' ? '高' : todo.priority === 'medium' ? '中' : '低'}
            </span>
          </div>

          {showActions && isHovered && (
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {onDelete && (
                <button
                  onClick={() => onDelete(todo.id)}
                  className="p-1 text-red-600 hover:text-red-800"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      className={`
        border rounded-lg p-4 transition-all duration-200
        ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
        ${isHovered ? 'shadow-lg' : 'shadow'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <button
            onClick={() => onUpdate?.(todo.id, {
              status: todo.status === 'completed' ? 'pending' : 'completed'
            })}
            className="mt-1"
          >
            {getStatusIcon(todo.status)}
          </button>

          <div className="flex-1">
            <h3 className={`font-medium text-lg ${todo.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {todo.title}
            </h3>

            {todo.description && (
              <p className="text-gray-600 mt-1">{todo.description}</p>
            )}

            <div className="flex items-center space-x-3 mt-3">
              <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(todo.priority)}`}>
                {todo.priority === 'high' ? '高優先度' : todo.priority === 'medium' ? '中優先度' : '低優先度'}
              </span>

              {todo.dueDate && (
                <span className="text-xs text-gray-500 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(todo.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {showActions && (
          <div className="relative">
            <button
              onClick={() => setActionMenuOpen(!actionMenuOpen)}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>

            {actionMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsExpanded(!isExpanded)
                      setActionMenuOpen(false)
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {isExpanded ? '詳細を非表示' : '詳細を表示'}
                  </button>
                  <button
                    onClick={() => {
                      onUpdate?.(todo.id, {
                        status: todo.status === 'completed' ? 'pending' : 'completed'
                      })
                      setActionMenuOpen(false)
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {todo.status === 'completed' ? '未完了に戻す' : '完了にする'}
                  </button>
                  {onDelete && (
                    <button
                      onClick={() => {
                        onDelete(todo.id)
                        setActionMenuOpen(false)
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      削除
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">作成日時:</span>
              <span className="ml-2 text-gray-600">
                {new Date(todo.createdAt).toLocaleString()}
              </span>
            </div>
            {todo.dueDate && (
              <div>
                <span className="font-medium text-gray-700">期限:</span>
                <span className="ml-2 text-gray-600">
                  {new Date(todo.dueDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
```

## 🛠️ Todoアプリで実践してみよう

それでは、学習した内容を踏まえて状態管理を実装してみましょう。

:::step

1. Zustandのインストール

```bash
npm install zustand
```

2. ストアの作成

`src/stores/todo-store.ts`を作成し、前述のZustandストアのコードを追加してください。

3. URL Stateフックの作成

`src/hooks/useURLState.ts`を作成し、URL State管理用フックを実装してください。

4. コンポーネントの更新

各コンポーネントを更新して、適切な状態管理方法を使用してください。

5. メインページの統合

`app/todos/page.tsx`を更新し、すべての状態管理を統合してください。

```typescript
'use client'

import { useTodoStore } from '@/stores/todo-store'
import TodoForm from '@/components/forms/TodoForm'
import TodoList from '@/components/TodoList'
import { createTodoAction } from '@/lib/actions/todo-actions'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'

export default function TodosPage() {
  const { addTodo } = useTodoStore()

  const createTodoMutation = useMutation({
    mutationFn: createTodoAction,
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message)
        addTodo(data.data!)
      } else {
        toast.error(data.error || 'エラーが発生しました')
      }
    },
    onError: () => {
      toast.error('予期せぬエラーが発生しました')
    }
  })

  const handleSubmit = async (formData: any) => {
    await createTodoMutation.mutateAsync(formData)
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Todo管理</h1>
        <p className="text-gray-600">
          useState、Zustand、URL Stateを使った状態管理の実践例
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* フォームセクション */}
        <div className="xl:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-8">
            <h2 className="text-xl font-semibold mb-4">新しいTodoを追加</h2>
            <TodoForm onSubmit={handleSubmit} />
          </div>
        </div>

        {/* リストセクション */}
        <div className="xl:col-span-2">
          <TodoList />
        </div>
      </div>
    </div>
  )
}
```

6. 開発サーバーの起動

```bash
npm run dev
```

7. 動作確認

ブラウザで`http://localhost:3000/todos`にアクセスし、状態管理機能を確認してください。

8. コミット

```bash
git add .
git commit -m "Implement state management with useState, Zustand, and URL State"
```

:::

このように、状況に応じて適切な状態管理方法を選択・実装できます。

## ⚡ パフォーマンス最適化

### メモ化のベストプラクティス

```typescript
// 高価な計算をメモ化
import { useMemo, useCallback } from 'react'

export function OptimizedTodoComponent({ todos, filters }: { todos: Todo[]; filters: Filters }) {
  // 計算結果をメモ化
  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      // 複雑なフィルタリングロジック
      return Object.entries(filters).every(([key, value]) => {
        if (value === 'all') return true
        return todo[key as keyof Todo] === value
      })
    })
  }, [todos, filters])

  // コールバック関数をメモ化
  const handleTodoUpdate = useCallback((id: string, updates: Partial<Todo>) => {
    // 更新処理
  }, [])

  // コンポーネントのメモ化
  return (
    <div>
      {filteredTodos.map(todo => (
        <MemoizedTodoItem
          key={todo.id}
          todo={todo}
          onUpdate={handleTodoUpdate}
        />
      ))}
    </div>
  )
}

// 個別コンポーネントのメモ化
const MemoizedTodoItem = React.memo(TodoItem)
```

### 選択的サブスクリプション

```typescript
// Zustandの選択的サブスクリプションで不要な再レンダリングを防止
import { useTodoStore } from '@/stores/todo-store'

function TodoStats() {
  // 必要な状態のみをサブスクライブ
  const stats = useTodoStore((state) => state.stats)

  return (
    <div>
      <span>合計: {stats.total}</span>
      <span>完了: {stats.completed}</span>
    </div>
  )
}

function TodoFilters() {
  // フィルター状態のみをサブスクライブ
  const filters = useTodoStore((state) => state.filters)
  const updateFilters = useTodoStore((state) => state.updateFilters)

  return (
    <div>
      {/* フィルターUI */}
    </div>
  )
}
```

## 🎉 まとめ

このページでは、Next.jsアプリケーションにおける状態管理の様々なアプローチを学びました。ローカル状態からグローバル状態、URL Stateまで、状況に応じた適切な状態管理方法を選択・実装できるようになりました。

:::note 要点のまとめ

- **useState**：コンポーネント内のローカル状態管理に最適
- **Zustand**：軽量で直感的なグローバル状態管理ソリューション
- **URL State**：シェア可能な状態の管理に最適
- **状態の種類**に応じて適切な管理方法を選択することが重要
- **パフォーマンス最適化**にメモ化と選択的サブスクリプションを活用
- **v0コンポーネント**は状態管理パターンと統合して利用

:::

次のページでは、**国際化（i18n）とRTL対応**について学び、グローバルなユーザーに対応したアプリケーション開発方法を理解していきます。

[次のページ：国際化/i18n/RTL対応](./i18n-rtl)

## 🔗 関連リンク

- [Zustandドキュメント](https://zustand.docs.pmnd.rs/)
- [React状態管理ベストプラクティス](https://react.dev/learn/extracting-state-logic-into-a-custom-hook)
- [Next.js URLパラメータの操作](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#using-urlsearchparams)
- [Reactメモ化最適化](https://react.dev/reference/react/useMemo)

## 📚 さらに深く学習したい方へ

このページで学ぶ内容は、現代のReactアプリケーション開発において中核をなすスキルです。より深く学習したい方は、以下のトピックも参照してください：

- 大規模アプリケーションの状態管理アーキテクチャ
- 状態管理のテスト戦略
- パフォーマンス監視と最適化
- サーバーサイド状態管理の統合
- 状態管理とデータベースの同期