---
title: "ダッシュボードスターター | v0でデータ可視化と管理画面を構築"
slug: dashboard-starter
parent: "templates"
file_path: templates/dashboard-starter
target_user: "Web開発者、データアナリスト、プロダクトマネージャー"
goal: "v0で作成したダッシュボードテンプレートを提供し、データ可視化、テーブル表示、フィルタリング機能を実装する方法を学ぶ"
status: publish
post_type: pages
seo_title: "ダッシュボードスターター | v0でデータ可視化と管理画面を構築"
seo_description: "v0 by Vercelで作成したダッシュボードテンプレート。データテーブル、チャート表示、フィルタリング機能を備えた管理画面を効率的に構築できます。"
seo_keywords: "v0, ダッシュボード, データ可視化, テーブル, フィルター, チャート, 管理画面, データ管理"
handson_overview: "ダッシュボードスターターテンプレートをv0でカスタマイズし、実際のデータ可視化と管理機能を実装するハンズオンを行います。"
---

## 📊 ダッシュボードスターター

v0で作成したダッシュボードスターターは、データを効果的に可視化し、直感的な操作が可能な管理画面を構築するためのテンプレートです。テーブル表示、フィルタリング、チャート機能が統合されており、ビジネスの意思決定を支援します。

### このページで学べること

:::note

このページでは、ダッシュボードスターターテンプレートの機能とカスタマイズ方法を学びます。

- データテーブルの設計と実装
- 高度なフィルタリングと検索機能
- チャートとデータ可視化の実装
- リアルタイムデータ更新
- レスポンシブデザインの適用
- パフォーマンス最適化

:::

## 🎯 ダッシュボードの基本構造

効果的なダッシュボードには、データの明確な表示と直感的な操作インターフェースが必要です。

### テンプレートの特徴

- **柔軟なデータテーブル**: ソート、フィルター、ページネーション機能
- **リッチなチャート表示**: 折れ線、棒、円、面グラフなど多様な表示
- **高度なフィルタリング**: 複合条件でのデータ絞り込み
- **リアルタイム更新**: WebSocketによる自動データ更新
- **エクスポート機能**: CSV、PDFでのデータ出力
- **カスタマイズ可能**: ウィジェットの配置と表示設定

:::note データ可視化の重要性

データ可視化は、大量のデータを理解しやすく、意思決定を迅速に行うための重要な要素です。このダッシュボードスターターは、ビジネスユーザーが直感的にデータを分析できるように設計されています。

:::

## 📝 プロンプト設計パターン

ダッシュボードの各要素を作成するためのプロンプト例を見ていきましょう。

### メトリクスカードのプロンプト

```bash
ダッシュボードのメトリクスカードを作成してください。

カード要素:
- メトリクスタイトル
- 主要数値（大きく表示）
- 前期間比の変化率
- アイコン（視覚的補助）
- 微妙なトレンドライン（オプション）

スタイルバリエーション:
- 成長系: 緑色、上向き矢印
- 減少系: 赤色、下向き矢印
- 安定系: 青色、横矢印
- 予測系: 紫色、点線

インタラクション:
- ホバーで詳細情報表示
- クリックで関連データへ遷移
- カードサイズの調整可能
- 色テーマのカスタマイズ

レスポンシンス:
- モバイル: 1列表示
- タブレット: 2列表示
- デスクトップ: 3-4列表示
```

### データテーブルのプロンプト

```bash
高度な機能を持つデータテーブルを作成してください。

テーブル機能:
- ヘッダー固定
- 列のリサイズ
- 列の表示/非表示切り替え
- 行選択（複数選択対応）
- セル内のデータ編集
- 行の展開（詳細情報表示）

ソート機能:
- 単一列ソート
- 複数列ソート（Shift+クリック）
- カスタムソートロジック
- ソート方向の視覚的表示

フィルター機能:
- グローバル検索
- 列単位フィルター
- 範囲フィルター（日付、数値）
- 選択フィルター（ドロップダウン）
- カスタムフィルター条件

ページネーション:
- ページサイズ変更
- ページ番号指定ジャンプ
- 総件数表示
- 無限スクロールオプション

パフォーマンス:
- 仮想スクロール（大量データ対応）
- 遅延読み込み
- データキャッシュ
- 読み込み状態表示
```

### チャート表示のプロンプト

```bash
インタラクティブなデータ可視化チャートを作成してください。

チャートタイプ:
- 折れ線グラフ（時系列データ）
- 棒グラフ（カテゴリ比較）
- 円グラフ（構成比）
- 散布図（相関分析）
- エリアチャート（累積データ）
- レーダーチャート（多軸評価）

インタラクション機能:
- ツールチップ（詳細情報表示）
- ズームとパン
- データポイント選択
- 凡例のクリックで表示/非表示
- ドラッグ選択による範囲指定

カスタマイズ:
- 色テーマの変更
- 軸ラベルのフォーマット
- グリッド線の表示/非表示
- アニメーションの有効化
- レスポンシブレイアウト

エクスポート機能:
- 画像として保存（PNG, SVG）
- データのCSVエクスポート
- 印刷用レイアウト
```

## 🛠️ ダッシュボードスターターをカスタマイズしてみよう

実際にv0を使ってダッシュボードスターターをカスタマイズしてみましょう。

:::step

1. プロジェクトのセットアップ

まずはテンプレートをクローンして基本設定を行います。

```bash
# リポジトリのクローン
git clone https://github.com/your-repo/dashboard-starter.git
cd dashboard-starter

# 依存関係のインストール
pnpm install

# 環境変数の設定
cp .env.example .env.local
```

2. データテーブルコンポーネントの実装

高度な機能を持つデータテーブルを実装します。

```typescript
// src/components/dashboard/DataTable.tsx
import { useState, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Download,
  Settings
} from 'lucide-react'

interface Column {
  key: string
  label: string
  type?: 'text' | 'number' | 'date' | 'status'
  sortable?: boolean
  filterable?: boolean
  render?: (value: any, row: any) => React.ReactNode
}

interface DataTableProps {
  data: any[]
  columns: Column[]
  onRowClick?: (row: any) => void
  onSelectionChange?: (selectedRows: any[]) => void
}

export default function DataTable({
  data,
  columns,
  onRowClick,
  onSelectionChange
}: DataTableProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [filters, setFilters] = useState<Record<string, any>>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())

  // フィルタリングとソートの適用
  const filteredAndSortedData = useMemo(() => {
    let result = [...data]

    // 検索フィルター
    if (searchQuery) {
      result = result.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    }

    // 列フィルター
    Object.entries(filters).forEach(([columnKey, filterValue]) => {
      if (filterValue !== '') {
        result = result.filter(row => {
          const value = row[columnKey]
          if (typeof value === 'string') {
            return value.toLowerCase().includes(filterValue.toLowerCase())
          }
          return value === filterValue
        })
      }
    })

    // ソート
    if (sortColumn) {
      result.sort((a, b) => {
        const aValue = a[sortColumn]
        const bValue = b[sortColumn]

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
        }

        const aString = String(aValue || '')
        const bString = String(bValue || '')

        if (sortDirection === 'asc') {
          return aString.localeCompare(bString)
        } else {
          return bString.localeCompare(aString)
        }
      })
    }

    return result
  }, [data, searchQuery, filters, sortColumn, sortDirection])

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(columnKey)
      setSortDirection('asc')
    }
  }

  const handleFilterChange = (columnKey: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [columnKey]: value
    }))
  }

  const handleRowSelect = (rowId: string, checked: boolean) => {
    const newSelected = new Set(selectedRows)
    if (checked) {
      newSelected.add(rowId)
    } else {
      newSelected.delete(rowId)
    }
    setSelectedRows(newSelected)

    if (onSelectionChange) {
      const selectedData = data.filter(row => newSelected.has(row.id))
      onSelectionChange(selectedData)
    }
  }

  const handleSelectAll = (checked: boolean) => {
    const newSelected = checked ? new Set(data.map(row => row.id)) : new Set()
    setSelectedRows(newSelected)

    if (onSelectionChange) {
      const selectedData = data.filter(row => newSelected.has(row.id))
      onSelectionChange(selectedData)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-4">
      {/* 検索とフィルターバー */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="データを検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            フィルター
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            エクスポート
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            設定
          </Button>
        </div>
      </div>

      {/* テーブル */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <input
                  type="checkbox"
                  checked={selectedRows.size === data.length && data.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </TableHead>
              {columns.map((column) => (
                <TableHead key={column.key}>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`font-medium cursor-pointer hover:text-gray-700 ${
                        sortColumn === column.key ? 'text-blue-600' : ''
                      }`}
                      onClick={() => column.sortable && handleSort(column.key)}
                    >
                      {column.label}
                      {sortColumn === column.key && (
                        sortDirection === 'asc' ?
                          <ChevronUp className="h-4 w-4 inline" /> :
                          <ChevronDown className="h-4 w-4 inline" />
                      )}
                    </span>
                    {column.filterable && (
                      <Select
                        value={filters[column.key] || ''}
                        onValueChange={(value) => handleFilterChange(column.key, value)}
                      >
                        <SelectTrigger className="w-32 h-8">
                          <SelectValue placeholder="フィルター" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">すべて</SelectItem>
                          {Array.from(new Set(data.map(row => row[column.key])))
                            .map((value) => (
                              <SelectItem key={value} value={String(value)}>
                                {String(value)}
                              </SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedData.map((row) => (
              <TableRow
                key={row.id}
                className={`cursor-pointer hover:bg-gray-50 ${
                  selectedRows.has(row.id) ? 'bg-blue-50' : ''
                }`}
                onClick={() => onRowClick && onRowClick(row)}
              >
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedRows.has(row.id)}
                    onChange={(e) => handleRowSelect(row.id, e.target.checked)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </TableCell>
                {columns.map((column) => (
                  <TableCell key={column.key}>
                    {column.render ? (
                      column.render(row[column.key], row)
                    ) : column.type === 'status' ? (
                      <Badge className={getStatusColor(row[column.key])}>
                        {row[column.key]}
                      </Badge>
                    ) : (
                      row[column.key]
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ページネーション */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {filteredAndSortedData.length} 件中 {selectedRows.size} 件を選択
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            前へ
          </Button>
          <span className="text-sm">1 / 10</span>
          <Button variant="outline" size="sm">
            次へ
          </Button>
        </div>
      </div>
    </div>
  )
}
```

3. チャートコンポーネントの実装

様々なタイプのチャートを表示するコンポーネントを実装します。

```typescript
// src/components/dashboard/Charts.tsx
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

interface ChartData {
  name: string
  value: number
  [key: string]: any
}

interface ChartsProps {
  type: 'line' | 'bar' | 'pie'
  data: ChartData[]
  title?: string
  colors?: string[]
  height?: number
}

const defaultColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

export default function Charts({
  type,
  data,
  title,
  colors = defaultColors,
  height = 300
}: ChartsProps) {
  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {Object.keys(data[0] || {})
              .filter(key => key !== 'name')
              .map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              ))}
          </LineChart>
        )

      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {Object.keys(data[0] || {})
              .filter(key => key !== 'name')
              .map((key, index) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={colors[index % colors.length]}
                />
              ))}
          </BarChart>
        )

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        )

      default:
        return null
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      {title && (
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  )
}
```

4. リアルタイム更新機能の実装

WebSocketを使ったリアルタイムデータ更新を実装します。

```typescript
// src/hooks/useWebSocket.ts
import { useEffect, useRef } from 'react'

interface UseWebSocketOptions {
  url: string
  onMessage: (data: any) => void
  reconnectInterval?: number
}

export function useWebSocket({
  url,
  onMessage,
  reconnectInterval = 5000
}: UseWebSocketOptions) {
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const connect = () => {
    try {
      wsRef.current = new WebSocket(url)

      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data)
        onMessage(data)
      }

      wsRef.current.onclose = () => {
        // 再接続
        reconnectTimeoutRef.current = setTimeout(connect, reconnectInterval)
      }

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error)
      }
    } catch (error) {
      console.error('Failed to connect WebSocket:', error)
    }
  }

  const send = (data: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data))
    }
  }

  useEffect(() => {
    connect()

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [url])

  return { send }
}

// src/components/dashboard/RealTimeDashboard.tsx
import { useState, useEffect } from 'react'
import { useWebSocket } from '@/hooks/useWebSocket'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface RealTimeMetrics {
  activeUsers: number
  totalRequests: number
  averageResponseTime: number
  errorRate: number
}

export default function RealTimeDashboard() {
  const [metrics, setMetrics] = useState<RealTimeMetrics>({
    activeUsers: 0,
    totalRequests: 0,
    averageResponseTime: 0,
    errorRate: 0
  })

  const { send } = useWebSocket({
    url: process.env.NEXT_PUBLIC_WS_URL!,
    onMessage: (data) => {
      if (data.type === 'metrics_update') {
        setMetrics(data.metrics)
      }
    }
  })

  useEffect(() => {
    // 初期データをリクエスト
    send({ type: 'get_metrics' })
  }, [send])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">アクティブユーザー</CardTitle>
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.activeUsers}</div>
          <p className="text-xs text-muted-foreground">リアルタイム</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">総リクエスト数</CardTitle>
          <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalRequests.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">過去24時間</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">平均応答時間</CardTitle>
          <div className="h-2 w-2 bg-yellow-500 rounded-full animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.averageResponseTime}ms</div>
          <p className="text-xs text-muted-foreground">現在の値</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">エラー率</CardTitle>
          <div className={`h-2 w-2 rounded-full animate-pulse ${
            metrics.errorRate > 5 ? 'bg-red-500' : 'bg-green-500'
          }`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.errorRate}%</div>
          <p className="text-xs text-muted-foreground">過去1時間</p>
        </CardContent>
      </Card>
    </div>
  )
}
```

5. データエクスポート機能の実装

CSVやPDFでのデータ出力機能を実装します。

```typescript
// src/lib/export-utils.ts
import { CSVLink } from 'react-csv'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

interface ExportData {
  headers: string[]
  data: any[][]
  filename?: string
}

export function exportToCSV({ headers, data, filename = 'export.csv' }: ExportData) {
  const csvContent = [
    headers.join(','),
    ...data.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function exportToPDF({ headers, data, filename = 'export.pdf' }: ExportData) {
  const doc = new jsPDF()

  doc.autoTable({
    head: [headers],
    body: data,
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
    },
  })

  doc.save(filename)
}

// src/components/dashboard/ExportControls.tsx
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Download, FileText, FileSpreadsheet } from 'lucide-react'
import { exportToCSV, exportToPDF } from '@/lib/export-utils'

interface ExportControlsProps {
  data: any[]
  headers: string[]
}

export default function ExportControls({ data, headers }: ExportControlsProps) {
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf'>('csv')

  const handleExport = () => {
    const exportData = data.map(row => headers.map(header => row[header]))

    if (exportFormat === 'csv') {
      exportToCSV({
        headers,
        data: exportData,
        filename: `dashboard-export-${new Date().toISOString().split('T')[0]}.csv`
      })
    } else {
      exportToPDF({
        headers,
        data: exportData,
        filename: `dashboard-export-${new Date().toISOString().split('T')[0]}.pdf`
      })
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={exportFormat} onValueChange={(value: 'csv' | 'pdf') => setExportFormat(value)}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="csv">CSV</SelectItem>
          <SelectItem value="pdf">PDF</SelectItem>
        </SelectContent>
      </Select>

      <Button onClick={handleExport} variant="outline" size="sm">
        <Download className="h-4 w-4 mr-2" />
        {exportFormat === 'csv' ? (
          <>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            CSVで出力
          </>
        ) : (
          <>
            <FileText className="h-4 w-4 mr-2" />
            PDFで出力
          </>
        )}
      </Button>
    </div>
  )
}
```

6. パフォーマンス最適化

大量データを扱うための最適化を実装します。

```typescript
// src/components/dashboard/VirtualizedTable.tsx
import { FixedSizeList as List } from 'react-window'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface VirtualizedTableProps {
  data: any[]
  columns: any[]
  height: number
  itemSize: number
}

export default function VirtualizedTable({
  data,
  columns,
  height,
  itemSize = 50
}: VirtualizedTableProps) {
  const Row = ({ index, style }: { index: number; style: any }) => {
    const row = data[index]

    return (
      <TableRow style={style}>
        {columns.map((column) => (
          <TableCell key={column.key}>
            {column.render ? column.render(row[column.key], row) : row[column.key]}
          </TableCell>
        ))}
      </TableRow>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key}>{column.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
      </Table>

      <List
        height={height}
        itemCount={data.length}
        itemSize={itemSize}
        width="100%"
      >
        {Row}
      </List>
    </div>
  )
}
```

:::

## 📊 ダッシュボードのレイアウトパターン

様々な画面サイズに対応するレスポンシブレイアウトを実装します。

```typescript
// src/components/dashboard/DashboardLayout.tsx
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface DashboardLayoutProps {
  children: ReactNode
  className?: string
}

export default function DashboardLayout({ children, className }: DashboardLayoutProps) {
  return (
    <div className={cn("min-h-screen bg-gray-50", className)}>
      <div className="flex">
        {/* サイドバー */}
        <aside className="w-64 bg-white shadow-md">
          <div className="p-6">
            <h2 className="text-xl font-bold">ダッシュボード</h2>
          </div>
          <nav className="mt-6">
            {/* ナビゲーションアイテム */}
          </nav>
        </aside>

        {/* メインコンテンツ */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
```

## まとめ

ダッシュボードスターターは、データ可視化と管理画面構築のための強力なテンプレートです。v0で作成したこのテンプレートをカスタマイズすることで、ビジネスに合わせた効果的なダッシュボードを迅速に構築できます。

:::note 要点のまとめ

- 高度なデータテーブル機能（ソート、フィルター、ページネーション）
- リッチなチャート表示（折れ線、棒、円グラフなど）
- リアルタイムデータ更新による最新情報の表示
- データエクスポート機能（CSV、PDF）
- レスポンシブデザインであらゆるデバイスに対応
- パフォーマンス最適化で大量データも快適に処理

:::

次は「[ランディングページスターター](./landing-starter.md)」を学び、マーケティングに最適化されたLPの構築方法を習得しましょう。

## 📚 関連リンク

- [Recharts公式ドキュメント](https://recharts.org/)
- [React Table公式ドキュメント](https://react-table.tanstack.com/)
- [データ可視化のベストプラクティス](../level3-components/charts-icons-animations.md)
- [パフォーマンス最適化ガイド](../level5-designsystem-ops/performance.md)