---
title: "To-Doリストアプリ"
description: "Claude Codeを使ってTo-Doリストアプリを構築する実践的なプロジェクトです。ReactとTypeScriptを使用したモダンなWebアプリケーション開発を学びます。"
status: "published"
priority: "high"
tags: ["React", "TypeScript", "Webアプリ", "実践プロジェクト", "CRUDアプリ"]
author: "Claude"
category: "practical-projects"
---

# To-Doリストアプリ

このプロジェクトでは、Claude Codeを使って完全なTo-Doリストアプリを構築します。ReactとTypeScriptを使用したモダンなWebアプリケーション開発の実践的なスキルを学びましょう。

## プロジェクト概要

このプロジェクトでは、以下の機能を持つTo-Doリストアプリを構築します：

- ✅ タスクの追加・編集・削除
- ✅ タスクの完了状態切り替え
- ✅ ローカルストレージによるデータ永続化
- ✅ フィルタリング機能（全て/完了/未完了）
- ✅ テキスト検索機能
- ✅ 期限日設定と表示
- ✅ レスポンシブデザイン

## 開発環境のセットアップ

:::step

1. プロジェクトの初期化

ReactとTypeScriptを使用したプロジェクトをセットアップします。

```bash
# プロジェクトディレクトリの作成
mkdir todo-app
cd todo-app

# Reactプロジェクトの作成
npx create-react-app . --template typescript

# 必要なパッケージのインストール
npm install
```

2. 開発環境の設定

TypeScriptの設定と開発ツールを構成します。

```bash
# TypeScript設定の確認
cat tsconfig.json

# ESLintとPrettierの設定
npm install --save-dev eslint prettier eslint-config-prettier eslint-plugin-prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

3. ディレクトリ構造の作成

整理されたディレクトリ構造を作成します。

```bash
mkdir -p src/components src/hooks src/services src/types src/utils
```

:::

## 基本コンポーネントの実装

:::step

1. 型定義の作成

まず、アプリケーションで使用する型を定義します。

_src/types/todo.ts_
```typescript
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
}

export interface TodoFormData {
  text: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
}

export interface FilterOptions {
  status: 'all' | 'active' | 'completed';
  searchTerm: string;
  priority?: 'low' | 'medium' | 'high';
  sortBy: 'createdAt' | 'dueDate' | 'priority' | 'text';
  sortOrder: 'asc' | 'desc';
}
```

2. TodoItemコンポーネントの作成

個々のTodoアイテムを表示するコンポーネントを作成します。

_src/components/TodoItem.tsx_
```typescript
import React, { useState } from 'react';
import { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: Partial<Todo>) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleSave = () => {
    if (editText.trim()) {
      onEdit(todo.id, { text: editText.trim() });
      setIsEditing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditText(todo.text);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('ja-JP');
  };

  return (
    <li className={`todo-item p-4 border rounded-lg shadow-sm ${
      todo.completed ? 'bg-gray-50 opacity-75' : 'bg-white'
    }`}>
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
        />

        <div className="flex-1">
          {isEditing ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <button
                onClick={handleSave}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                保存
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditText(todo.text);
                }}
                className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                キャンセル
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <div className="flex-1">
                <span className={`${
                  todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
                }`}>
                  {todo.text}
                </span>

                <div className="flex items-center gap-2 mt-1">
                  {todo.dueDate && (
                    <span className="text-xs text-gray-500">
                      📅 {formatDate(todo.dueDate)}
                    </span>
                  )}
                  <span className={`text-xs font-medium ${getPriorityColor(todo.priority)}`}>
                    {todo.priority === 'high' ? '🔴' : todo.priority === 'medium' ? '🟡' : '🟢'}
                    {todo.priority}
                  </span>
                  {todo.tags.map((tag, index) => (
                    <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                  title="編集"
                >
                  ✏️
                </button>
                <button
                  onClick={() => onDelete(todo.id)}
                  className="p-1 text-red-600 hover:bg-red-100 rounded"
                  title="削除"
                >
                  🗑️
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </li>
  );
};

export default TodoItem;
```

3. AddTodoFormコンポーネントの作成

新しいTodoを追加するフォームコンポーネントを作成します。

_src/components/AddTodoForm.tsx_
```typescript
import React, { useState } from 'react';
import { TodoFormData } from '../types/todo';

interface AddTodoFormProps {
  onAdd: (todoData: TodoFormData) => void;
}

const AddTodoForm: React.FC<AddTodoFormProps> = ({ onAdd }) => {
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [tags, setTags] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd({
        text: text.trim(),
        dueDate: dueDate || undefined,
        priority,
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean)
      });

      // フォームのリセット
      setText('');
      setDueDate('');
      setPriority('medium');
      setTags('');
      setIsOpen(false);
    }
  };

  return (
    <div className="mb-6">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          ➕ 新しいタスクを追加
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-4 border rounded-lg shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                タスク内容 *
              </label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="タスク内容を入力..."
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  期限日
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  優先度
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">低</option>
                  <option value="medium">中</option>
                  <option value="high">高</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                タグ（カンマ区切り）
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="仕事, 重要, 急ぎ..."
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={!text.trim()}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                追加
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                キャンセル
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddTodoForm;
```

:::

## フィルタリングと検索機能

:::step

1. FilterControlsコンポーネントの作成

タスクのフィルタリングと検索を行うコントロールを作成します。

_src/components/FilterControls.tsx_
```typescript
import React from 'react';
import { FilterOptions } from '../types/todo';

interface FilterControlsProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  todoCount: number;
  activeCount: number;
  completedCount: number;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  filters,
  onFiltersChange,
  todoCount,
  activeCount,
  completedCount
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      searchTerm: e.target.value
    });
  };

  const handleStatusChange = (status: 'all' | 'active' | 'completed') => {
    onFiltersChange({
      ...filters,
      status
    });
  };

  const handlePriorityChange = (priority: 'low' | 'medium' | 'high' | undefined) => {
    onFiltersChange({
      ...filters,
      priority
    });
  };

  const handleSortChange = (sortBy: 'createdAt' | 'dueDate' | 'priority' | 'text') => {
    onFiltersChange({
      ...filters,
      sortBy,
      sortOrder: filters.sortBy === sortBy && filters.sortOrder === 'asc' ? 'desc' : 'asc'
    });
  };

  return (
    <div className="bg-white p-4 border rounded-lg shadow-sm mb-6">
      <div className="space-y-4">
        {/* 検索バー */}
        <div>
          <input
            type="text"
            value={filters.searchTerm}
            onChange={handleSearchChange}
            placeholder="タスクを検索..."
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* ステータスフィルター */}
        <div className="flex gap-2">
          <button
            onClick={() => handleStatusChange('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filters.status === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            全て ({todoCount})
          </button>
          <button
            onClick={() => handleStatusChange('active')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filters.status === 'active'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            未完了 ({activeCount})
          </button>
          <button
            onClick={() => handleStatusChange('completed')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filters.status === 'completed'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            完了 ({completedCount})
          </button>
        </div>

        {/* 優先度フィルター */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">優先度:</span>
          <select
            value={filters.priority || ''}
            onChange={(e) => handlePriorityChange(
              e.target.value ? e.target.value as 'low' | 'medium' | 'high' : undefined
            )}
            className="px-2 py-1 border rounded text-sm"
          >
            <option value="">全て</option>
            <option value="high">高</option>
            <option value="medium">中</option>
            <option value="low">低</option>
          </select>
        </div>

        {/* 並び替え */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">並び替え:</span>
          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-');
              handleSortChange(sortBy as 'createdAt' | 'dueDate' | 'priority' | 'text');
            }}
            className="px-2 py-1 border rounded text-sm"
          >
            <option value="createdAt-desc">作成日時 (新しい順)</option>
            <option value="createdAt-asc">作成日時 (古い順)</option>
            <option value="dueDate-asc">期限日 (近い順)</option>
            <option value="dueDate-desc">期限日 (遠い順)</option>
            <option value="priority-desc">優先度 (高い順)</option>
            <option value="priority-asc">優先度 (低い順)</option>
            <option value="text-asc">タスク名 (A-Z)</option>
            <option value="text-desc">タスク名 (Z-A)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;
```

2. カスタムフックの作成

Todoの状態管理とフィルタリングを行うカスタムフックを作成します。

_src/hooks/useTodos.ts_
```typescript
import { useState, useEffect, useMemo } from 'react';
import { Todo, TodoFormData, FilterOptions } from '../types/todo';

const STORAGE_KEY = 'claude-code-todos';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  // ローカルストレージからの読み込み
  useEffect(() => {
    const savedTodos = localStorage.getItem(STORAGE_KEY);
    if (savedTodos) {
      try {
        const parsedTodos = JSON.parse(savedTodos);
        // 日付文字列をDateオブジェクトに変換
        const todosWithDates = parsedTodos.map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
          dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined
        }));
        setTodos(todosWithDates);
      } catch (error) {
        console.error('Failed to load todos from localStorage:', error);
      }
    }
  }, []);

  // ローカルストレージへの保存
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  // Todoの追加
  const addTodo = (todoData: TodoFormData) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: todoData.text,
      completed: false,
      createdAt: new Date(),
      dueDate: todoData.dueDate ? new Date(todoData.dueDate) : undefined,
      priority: todoData.priority,
      tags: todoData.tags
    };
    setTodos(prevTodos => [...prevTodos, newTodo]);
  };

  // Todoの更新
  const updateTodo = (id: string, updates: Partial<Todo>) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, ...updates } : todo
      )
    );
  };

  // Todoの削除
  const deleteTodo = (id: string) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  // Todoの完了状態切り替え
  const toggleTodo = (id: string) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // フィルタリングされたTodoの取得
  const getFilteredTodos = (filters: FilterOptions) => {
    return useMemo(() => {
      let filtered = [...todos];

      // ステータスフィルター
      if (filters.status === 'active') {
        filtered = filtered.filter(todo => !todo.completed);
      } else if (filters.status === 'completed') {
        filtered = filtered.filter(todo => todo.completed);
      }

      // 検索フィルター
      if (filters.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase();
        filtered = filtered.filter(todo =>
          todo.text.toLowerCase().includes(searchTerm) ||
          todo.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      }

      // 優先度フィルター
      if (filters.priority) {
        filtered = filtered.filter(todo => todo.priority === filters.priority);
      }

      // 並び替え
      filtered.sort((a, b) => {
        let aValue: any = a[filters.sortBy];
        let bValue: any = b[filters.sortBy];

        // 日付の場合はタイムスタンプで比較
        if (aValue instanceof Date) aValue = aValue.getTime();
        if (bValue instanceof Date) bValue = bValue.getTime();

        if (filters.sortOrder === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });

      return filtered;
    }, [todos, filters]);
  };

  // 統計情報の取得
  const getStats = () => {
    return useMemo(() => {
      const total = todos.length;
      const completed = todos.filter(todo => todo.completed).length;
      const active = total - completed;

      const priorityCounts = {
        high: todos.filter(todo => todo.priority === 'high').length,
        medium: todos.filter(todo => todo.priority === 'medium').length,
        low: todos.filter(todo => todo.priority === 'low').length
      };

      const overdueCount = todos.filter(todo => {
        if (todo.completed || !todo.dueDate) return false;
        return new Date(todo.dueDate) < new Date();
      }).length;

      return {
        total,
        completed,
        active,
        priorityCounts,
        overdueCount,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
      };
    }, [todos]);
  };

  return {
    todos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    getFilteredTodos,
    getStats
  };
};
```

:::

## メインアプリケーションの実装

:::step

1. TodoListコンポーネントの作成

フィルタリングされたTodoリストを表示するコンポーネントを作成します。

_src/components/TodoList.tsx_
```typescript
import React from 'react';
import { Todo } from '../types/todo';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: Partial<Todo>) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, onToggle, onDelete, onEdit }) => {
  if (todos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="text-4xl mb-2">📝</div>
        <p>タスクがありません</p>
        <p className="text-sm">新しいタスクを追加してください</p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
};

export default TodoList;
```

2. StatsPanelコンポーネントの作成

統計情報を表示するパネルを作成します。

_src/components/StatsPanel.tsx_
```typescript
import React from 'react';

interface StatsPanelProps {
  total: number;
  completed: number;
  active: number;
  priorityCounts: {
    high: number;
    medium: number;
    low: number;
  };
  overdueCount: number;
  completionRate: number;
}

const StatsPanel: React.FC<StatsPanelProps> = ({
  total,
  completed,
  active,
  priorityCounts,
  overdueCount,
  completionRate
}) => {
  return (
    <div className="bg-white p-4 border rounded-lg shadow-sm mb-6">
      <h3 className="text-lg font-semibold mb-3">📊 統計情報</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{total}</div>
          <div className="text-sm text-gray-600">総タスク数</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{active}</div>
          <div className="text-sm text-gray-600">未完了</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-gray-600">{completed}</div>
          <div className="text-sm text-gray-600">完了</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{completionRate}%</div>
          <div className="text-sm text-gray-600">完了率</div>
        </div>
      </div>

      {/* 優先度分布 */}
      <div className="mt-4 pt-4 border-t">
        <h4 className="text-sm font-medium text-gray-700 mb-2">優先度分布</h4>
        <div className="flex gap-4">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            <span className="text-sm">高: {priorityCounts.high}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
            <span className="text-sm">中: {priorityCounts.medium}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            <span className="text-sm">低: {priorityCounts.low}</span>
          </div>
        </div>
      </div>

      {/* 期限切れタスク */}
      {overdueCount > 0 && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
          <div className="flex items-center gap-2">
            <span className="text-red-600">⚠️</span>
            <span className="text-sm text-red-700">
              期限切れのタスクが {overdueCount} 件あります
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsPanel;
```

3. Appコンポーネントの更新

メインのAppコンポーネントを更新して、すべてのコンポーネントを統合します。

_src/App.tsx_
```typescript
import React, { useState } from 'react';
import { useTodos } from './hooks/useTodos';
import { FilterOptions } from './types/todo';
import AddTodoForm from './components/AddTodoForm';
import FilterControls from './components/FilterControls';
import TodoList from './components/TodoList';
import StatsPanel from './components/StatsPanel';
import './App.css';

const App: React.FC = () => {
  const { todos, addTodo, deleteTodo, toggleTodo, updateTodo, getFilteredTodos, getStats } = useTodos();

  const [filters, setFilters] = useState<FilterOptions>({
    status: 'all',
    searchTerm: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const filteredTodos = getFilteredTodos(filters);
  const stats = getStats();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            ✅ To-Doリスト
          </h1>
          <p className="text-gray-600">
            Claude Codeで構築したモダンなタスク管理アプリ
          </p>
        </header>

        <main>
          {/* 統計パネル */}
          <StatsPanel {...stats} />

          {/* タスク追加フォーム */}
          <AddTodoForm onAdd={addTodo} />

          {/* フィルターコントロール */}
          <FilterControls
            filters={filters}
            onFiltersChange={setFilters}
            todoCount={stats.total}
            activeCount={stats.active}
            completedCount={stats.completed}
          />

          {/* Todoリスト */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">
                {filters.status === 'all' && '全てのタスク'}
                {filters.status === 'active' && '未完了のタスク'}
                {filters.status === 'completed' && '完了したタスク'}
                <span className="text-sm text-gray-500 ml-2">
                  ({filteredTodos.length}件)
                </span>
              </h2>
            </div>
            <div className="p-4">
              <TodoList
                todos={filteredTodos}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onEdit={updateTodo}
              />
            </div>
          </div>
        </main>

        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>Built with Claude Code, React, and TypeScript</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
```

4. スタイルの更新

アプリケーションのスタイルを更新します。

_src/App.css_
```css
/* 既存のスタイルに追加 */
body {
  background-color: #f9fafb;
}

.todo-item {
  transition: all 0.2s ease;
}

.todo-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* ボタンスタイル */
button {
  transition: all 0.2s ease;
}

button:hover {
  transform: translateY(-1px);
}

/* フォームスタイル */
input:focus,
select:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* アニメーション */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.todo-item {
  animation: fadeIn 0.3s ease;
}

/* レスポンシブデザイン */
@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .flex {
    flex-direction: column;
    gap: 0.5rem;
  }
}
```

:::

## テストの実装

:::step

1. テスト環境のセットアップ

JestとReact Testing Libraryを設定します。

```bash
# テストライブラリのインストール
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest jest-environment-jsdom

# テスト設定ファイルの作成
cat > jest.config.js << 'EOF'
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}'
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/reportWebVitals.ts'
  ]
};
EOF

# セットアップファイルの作成
cat > src/setupTests.js << 'EOF'
import '@testing-library/jest-dom';
```

2. コンポーネントテストの作成

_addTodoForm.test.tsx_
```typescript
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddTodoForm from '../components/AddTodoForm';

describe('AddTodoForm', () => {
  const mockOnAdd = jest.fn();

  beforeEach(() => {
    mockOnAdd.mockClear();
  });

  test('フォームが初期状態でレンダリングされる', () => {
    render(<AddTodoForm onAdd={mockOnAdd} />);

    expect(screen.getByText('➕ 新しいタスクを追加')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('タスク内容を入力...')).not.toBeInTheDocument();
  });

  test('フォームが開くと入力フィールドが表示される', async () => {
    render(<AddTodoForm onAdd={mockOnAdd} />);

    const addButton = screen.getByText('➕ 新しいタスクを追加');
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('タスク内容を入力...')).toBeInTheDocument();
      expect(screen.getByText('追加')).toBeInTheDocument();
      expect(screen.getByText('キャンセル')).toBeInTheDocument();
    });
  });

  test('有効なタスクが追加できる', async () => {
    render(<AddTodoForm onAdd={mockOnAdd} />);

    // フォームを開く
    fireEvent.click(screen.getByText('➕ 新しいタスクを追加'));

    // フォームに入力
    await waitFor(() => {
      const input = screen.getByPlaceholderText('タスク内容を入力...');
      fireEvent.change(input, { target: { value: 'テストタスク' } });
    });

    // フォームを送信
    fireEvent.click(screen.getByText('追加'));

    expect(mockOnAdd).toHaveBeenCalledWith({
      text: 'テストタスク',
      priority: 'medium',
      tags: []
    });
  });

  test('空のタスクは追加できない', async () => {
    render(<AddTodoForm onAdd={mockOnAdd} />);

    // フォームを開く
    fireEvent.click(screen.getByText('➕ 新しいタスクを追加'));

    // 空のテキストで送信を試みる
    await waitFor(() => {
      const addButton = screen.getByText('追加');
      expect(addButton).toBeDisabled();
    });

    expect(mockOnAdd).not.toHaveBeenCalled();
  });
});
```

3. フックテストの作成

_useTodos.test.ts_
```typescript
import { renderHook, act } from '@testing-library/react';
import { useTodos } from '../hooks/useTodos';

// localStorageのモック
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('useTodos', () => {
  beforeEach(() => {
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.setItem.mockClear();
    localStorage.clear();
  });

  test('初期状態では空の配列を返す', () => {
    mockLocalStorage.getItem.mockReturnValue(null);

    const { result } = renderHook(() => useTodos());

    expect(result.current.todos).toEqual([]);
  });

  test('Todoを追加できる', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo({
        text: 'テストタスク',
        priority: 'medium',
        tags: []
      });
    });

    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].text).toBe('テストタスク');
    expect(result.current.todos[0].completed).toBe(false);
  });

  test('Todoの完了状態を切り替えられる', () => {
    const { result } = renderHook(() => useTodos());

    // Todoを追加
    act(() => {
      result.current.addTodo({
        text: 'テストタスク',
        priority: 'medium',
        tags: []
      });
    });

    const todoId = result.current.todos[0].id;

    // 完了状態を切り替え
    act(() => {
      result.current.toggleTodo(todoId);
    });

    expect(result.current.todos[0].completed).toBe(true);
  });

  test('Todoを削除できる', () => {
    const { result } = renderHook(() => useTodos());

    // Todoを追加
    act(() => {
      result.current.addTodo({
        text: 'テストタスク',
        priority: 'medium',
        tags: []
      });
    });

    const todoId = result.current.todos[0].id;

    // Todoを削除
    act(() => {
      result.current.deleteTodo(todoId);
    });

    expect(result.current.todos).toHaveLength(0);
  });

  test('統計情報を正しく計算できる', () => {
    const { result } = renderHook(() => useTodos());

    // 複数のTodoを追加
    act(() => {
      result.current.addTodo({
        text: 'タスク1',
        priority: 'high',
        tags: []
      });
      result.current.addTodo({
        text: 'タスク2',
        priority: 'medium',
        tags: []
      });
    });

    // 1つを完了にする
    act(() => {
      result.current.toggleTodo(result.current.todos[0].id);
    });

    const stats = result.current.getStats();

    expect(stats.total).toBe(2);
    expect(stats.completed).toBe(1);
    expect(stats.active).toBe(1);
    expect(stats.completionRate).toBe(50);
    expect(stats.priorityCounts.high).toBe(1);
    expect(stats.priorityCounts.medium).toBe(1);
  });
});
```

4. package.jsonにテストスクリプトを追加

```json
{
  "scripts": {
    "test": "react-scripts test",
    "test:coverage": "react-scripts test --coverage --watchAll=false"
  }
}
```

:::

## デプロイの準備

:::step

1. ビルド設定の確認

```bash
# ビルドのテスト
npm run build

# ビルドされたファイルの確認
ls -la build/
```

2. デプロイ設定の作成

_netlify.toml_
```toml
[build]
  command = "npm run build"
  publish = "build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

3. GitHub Actionsの設定

.github/workflows/deploy.yml_
```yaml
name: Deploy to Netlify

on:
  push:
    branches: [ main ]
  pull_request:
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

    - name: Run tests
      run: npm run test:coverage

    - name: Build
      run: npm run build

    - name: Deploy to Netlify
      if: github.ref == 'refs/heads/main'
      uses: netlify/actions/cli@master
      with:
        args: deploy --dir=build --prod
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

:::

## Claude Codeでの開発体験

このプロジェクトをClaude Codeで開発する際の効果的な活用方法：

### プロンプト例

```bash
# コンポーネントのリファクタリング
claude "このTodoItemコンポーネントをよりアクセシビリティ対応にしてください。ARIA属性とキーボードナビゲーションを追加してください。"

# 新機能の追加
claude "このTo-Doアプリにドラッグ＆ドロップでの並び替え機能を追加してください。react-beautiful-dndを使用してください。"

# パフォーマンス最適化
claude "このアプリケーションのパフォーマンスを最適化してください。メモ化と遅延読み込みを実装してください。"

# スタイリングの改善
claude "このアプリにTailwind CSSを使用してモダンなデザインを適用してください。ダークモードにも対応してください。"
```

### ベストプラクティス

1. **段階的な開発**: 機能ごとに小さなプロンプトで依頼する
2. **コードレビュー**: 生成されたコードは必ずレビューして理解する
3. **テストの実装**: 機能追加時に同時にテストも生成してもらう
4. **ドキュメント化**: 複雑なロジックにはコメントを追加してもらう

## まとめ

このプロジェクトでは、Claude Codeを使用して完全なTo-Doリストアプリを構築しました。

### 学んだこと

- ✅ ReactとTypeScriptを使用したモダンなWebアプリ開発
- ✅ カスタムフックによる状態管理
- ✅ ローカルストレージによるデータ永続化
- ✅ フィルタリングと検索機能の実装
- ✅ テスト駆動開発の実践
- ✅ レスポンシブデザインの適用
- ✅ Claude Codeを活用した効率的な開発

### 次のステップ

このプロジェクトを基に、さらに高度な機能に挑戦しましょう：

1. **バックエンド連携**: FirebaseやSupabaseとの連携
2. **リアルタイム同期**: 複数デバイス間での同期機能
3. **通知機能**: 期限リマインダーの実装
4. **カレンダービュー**: ガントチャート形式の表示
5. **チーム機能**: 共有タスクリストの実装

Claude Codeを活用することで、これらの高度な機能も効率的に実装できます。

---

## 関連リソース

- [React公式ドキュメント](https://react.dev/)
- [TypeScript公式ドキュメント](https://www.typescriptlang.org/)
- [Testing Library](https://testing-library.com/)
- [Tailwind CSS](https://tailwindcss.com/)