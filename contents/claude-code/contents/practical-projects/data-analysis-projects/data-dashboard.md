---
title: "データ分析ダッシュボード"
description: "Claude Codeを活用してデータ分析ダッシュボードを構築する実践的なガイドです。Python、Pandas、Plotlyを使用したインタラクティブな可視化手法を学びます。"
status: "published"
priority: "high"
tags: ["データ分析", "Python", "Pandas", "Plotly", "ダッシュボード", "可視化"]
author: "Claude"
category: "practical-projects"
---

# データ分析ダッシュボード

Claude Codeを活用したデータ分析ダッシュボード開発の実践的なガイドです。このプロジェクトでは、Python、Pandas、Plotlyを使用して、インタラクティブで実用的なデータ分析ダッシュボードを構築します。

## プロジェクト概要

### 構築するダッシュボードの機能

- データの読み込みと前処理
- インタラクティブな可視化
- フィルタリングと検索機能
- データのエクスポート機能
- リアルタイムデータ更新
- レポート生成機能

### 使用技術

- **言語**: Python 3.9+
- **データ処理**: Pandas, NumPy
- **可視化**: Plotly, Matplotlib
- **Webフレームワーク**: Flask, Dash
- **データソース**: CSV, JSON, API
- **デプロイ**: Docker, Heroku

### 前提条件

:::note 前提条件

- Python 3.9以上がインストールされている
- pip（Pythonパッケージマネージャー）
- Gitの基本操作ができる
- データ分析の基本概念を理解している
- コマンドラインの基本操作ができる

:::

## プロジェクトセットアップ

### 1. プロジェクトの初期化

:::step

1. プロジェクトディレクトリの作成

```bash
mkdir data-dashboard
cd data-dashboard
```

2. Python仮想環境の作成

```bash
# 仮想環境の作成
python -m venv venv

# 仮想環境の有効化
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

3. 必要なパッケージのインストール

```bash
# 基本パッケージ
pip install pandas numpy matplotlib seaborn

# Webフレームワークと可視化
pip install flask dash plotly dash-bootstrap-components

# データ処理とユーティリティ
pip install openpyxl xlrd python-dotenv gunicorn

# 開発環境
pip install jupyter notebook pytest pytest-cov black flake8
```

4. プロジェクト構造の作成

```bash
mkdir -p src/{data,models,views,utils}
mkdir -p tests
mkdir -p data/{raw,processed,external}
mkdir -p config
mkdir -p assets/{css,js,images}
```

:::

### 2. 基本的なFlaskアプリケーションの構築

:::step

1. メインアプリケーションファイルの作成

_src/app.py_

```python
from flask import Flask, render_template, request, jsonify, send_file
import pandas as pd
import numpy as np
import plotly.graph_objects as go
import plotly.express as px
from datetime import datetime, timedelta
import json
import os
from dotenv import load_dotenv

# ユーティリティのインポート
from src.data.data_loader import DataLoader
from src.data.data_processor import DataProcessor
from src.models.dashboard_model import DashboardModel
from src.utils.chart_generator import ChartGenerator

# 環境変数の読み込み
load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')

# データローダーとプロセッサーの初期化
data_loader = DataLoader()
data_processor = DataProcessor()
dashboard_model = DashboardModel()
chart_generator = ChartGenerator()

@app.route('/')
def index():
    """ダッシュボードのメインページ"""
    return render_template('index.html')

@app.route('/api/data/overview')
def get_data_overview():
    """データ概要の取得"""
    try:
        overview = dashboard_model.get_data_overview()
        return jsonify(overview)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/charts/<chart_type>')
def get_chart(chart_type):
    """チャートデータの取得"""
    try:
        filters = request.args.to_dict()
        chart_data = chart_generator.generate_chart(chart_type, filters)
        return jsonify(chart_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/data/export')
def export_data():
    """データのエクスポート"""
    try:
        format_type = request.args.get('format', 'csv')
        filters = request.args.to_dict()

        exported_file = data_processor.export_data(format_type, filters)
        return send_file(exported_file, as_attachment=True)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/data/refresh')
def refresh_data():
    """データの更新"""
    try:
        success = data_loader.refresh_data()
        return jsonify({'success': success})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
```

2. 環境変数ファイルの作成

_.env_

```bash
# Flask設定
SECRET_KEY=your-secret-key-here
DEBUG=True
FLASK_ENV=development

# データベース設定（使用する場合）
DATABASE_URL=sqlite:///data/dashboard.db

# 外部API設定（使用する場合）
API_KEY_EXTERNAL=your-external-api-key

# データ設定
DATA_REFRESH_INTERVAL=3600  # 秒
MAX_RECORDS=10000

# ログ設定
LOG_LEVEL=INFO
LOG_FILE=logs/dashboard.log
```

:::

### 3. データ処理モジュールの実装

:::step

1. データローダーの作成

_src/data/data_loader.py_

```python
import pandas as pd
import numpy as np
import json
import requests
from datetime import datetime, timedelta
import os
from typing import Dict, List, Optional, Union
import logging

class DataLoader:
    """データ読み込みクラス"""

    def __init__(self, data_dir: str = "data"):
        self.data_dir = data_dir
        self.logger = logging.getLogger(__name__)

    def load_csv_data(self, file_path: str, **kwargs) -> pd.DataFrame:
        """CSVファイルからデータを読み込む"""
        try:
            full_path = os.path.join(self.data_dir, file_path)
            df = pd.read_csv(full_path, **kwargs)
            self.logger.info(f"CSVデータを読み込みました: {file_path}")
            return df
        except Exception as e:
            self.logger.error(f"CSV読み込みエラー: {e}")
            raise

    def load_json_data(self, file_path: str) -> Union[Dict, List]:
        """JSONファイルからデータを読み込む"""
        try:
            full_path = os.path.join(self.data_dir, file_path)
            with open(full_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            self.logger.info(f"JSONデータを読み込みました: {file_path}")
            return data
        except Exception as e:
            self.logger.error(f"JSON読み込みエラー: {e}")
            raise

    def load_excel_data(self, file_path: str, **kwargs) -> pd.DataFrame:
        """Excelファイルからデータを読み込む"""
        try:
            full_path = os.path.join(self.data_dir, file_path)
            df = pd.read_excel(full_path, **kwargs)
            self.logger.info(f"Excelデータを読み込みました: {file_path}")
            return df
        except Exception as e:
            self.logger.error(f"Excel読み込みエラー: {e}")
            raise

    def fetch_api_data(self, url: str, params: Optional[Dict] = None,
                      headers: Optional[Dict] = None) -> Dict:
        """APIからデータを取得する"""
        try:
            response = requests.get(url, params=params, headers=headers)
            response.raise_for_status()
            data = response.json()
            self.logger.info(f"APIデータを取得しました: {url}")
            return data
        except Exception as e:
            self.logger.error(f"API取得エラー: {e}")
            raise

    def generate_sample_data(self, rows: int = 1000) -> pd.DataFrame:
        """サンプルデータを生成する"""
        try:
            np.random.seed(42)

            # 日付範囲の生成
            start_date = datetime.now() - timedelta(days=365)
            dates = pd.date_range(start=start_date, periods=rows, freq='D')

            # サンプルデータの生成
            data = {
                'date': dates,
                'category': np.random.choice(['A', 'B', 'C', 'D'], rows),
                'value': np.random.normal(100, 20, rows),
                'quantity': np.random.poisson(50, rows),
                'price': np.random.uniform(10, 1000, rows),
                'region': np.random.choice(['North', 'South', 'East', 'West'], rows),
                'status': np.random.choice(['Active', 'Inactive', 'Pending'], rows)
            }

            df = pd.DataFrame(data)
            # 数値データのクリーニング
            df['value'] = df['value'].clip(lower=0)
            df['price'] = df['price'].round(2)

            self.logger.info(f"サンプルデータを生成しました: {rows}行")
            return df
        except Exception as e:
            self.logger.error(f"サンプルデータ生成エラー: {e}")
            raise

    def refresh_data(self) -> bool:
        """データを更新する"""
        try:
            # サンプルデータを生成して保存
            sample_data = self.generate_sample_data(1000)

            # 生データディレクトリに保存
            os.makedirs(os.path.join(self.data_dir, 'raw'), exist_ok=True)
            sample_data.to_csv(
                os.path.join(self.data_dir, 'raw', 'sample_data.csv'),
                index=False
            )

            self.logger.info("データの更新が完了しました")
            return True
        except Exception as e:
            self.logger.error(f"データ更新エラー: {e}")
            return False
```

2. データプロセッサーの作成

_src/data/data_processor.py_

```python
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple, Any
import logging

class DataProcessor:
    """データ処理クラス"""

    def __init__(self):
        self.logger = logging.getLogger(__name__)

    def clean_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """データのクリーニング"""
        try:
            # 欠損値の処理
            df = df.dropna()

            # 重複行の削除
            df = df.drop_duplicates()

            # 数値列のクリーニング
            numeric_columns = df.select_dtypes(include=[np.number]).columns
            for col in numeric_columns:
                # 外れ値の処理（IQR法）
                Q1 = df[col].quantile(0.25)
                Q3 = df[col].quantile(0.75)
                IQR = Q3 - Q1
                lower_bound = Q1 - 1.5 * IQR
                upper_bound = Q3 + 1.5 * IQR
                df = df[(df[col] >= lower_bound) & (df[col] <= upper_bound)]

            self.logger.info(f"データクリーニング完了: {len(df)}行")
            return df
        except Exception as e:
            self.logger.error(f"データクリーニングエラー: {e}")
            raise

    def aggregate_data(self, df: pd.DataFrame,
                      group_by: List[str],
                      agg_funcs: Dict[str, List[str]]) -> pd.DataFrame:
        """データの集約"""
        try:
            aggregated = df.groupby(group_by).agg(agg_funcs).reset_index()

            # マルチインデックスのカラム名をフラット化
            aggregated.columns = ['_'.join(col).strip() if col[1] else col[0]
                                for col in aggregated.columns]

            self.logger.info(f"データ集約完了: {len(aggregated)}行")
            return aggregated
        except Exception as e:
            self.logger.error(f"データ集約エラー: {e}")
            raise

    def filter_data(self, df: pd.DataFrame, filters: Dict[str, Any]) -> pd.DataFrame:
        """データのフィルタリング"""
        try:
            filtered_df = df.copy()

            for column, condition in filters.items():
                if column not in df.columns:
                    continue

                if isinstance(condition, dict):
                    # 範囲フィルター
                    if 'min' in condition and 'max' in condition:
                        filtered_df = filtered_df[
                            (filtered_df[column] >= condition['min']) &
                            (filtered_df[column] <= condition['max'])
                        ]
                    elif 'values' in condition:
                        # 値リストフィルター
                        filtered_df = filtered_df[
                            filtered_df[column].isin(condition['values'])
                        ]
                elif isinstance(condition, str):
                    # テキスト検索
                    if column in filtered_df.select_dtypes(include=['object']).columns:
                        filtered_df = filtered_df[
                            filtered_df[column].str.contains(condition, case=False, na=False)
                        ]

            self.logger.info(f"データフィルタリング完了: {len(filtered_df)}行")
            return filtered_df
        except Exception as e:
            self.logger.error(f"データフィルタリングエラー: {e}")
            raise

    def calculate_statistics(self, df: pd.DataFrame,
                           columns: Optional[List[str]] = None) -> Dict[str, Dict]:
        """基本統計量の計算"""
        try:
            if columns is None:
                columns = df.select_dtypes(include=[np.number]).columns.tolist()

            stats = {}
            for col in columns:
                if col in df.columns:
                    stats[col] = {
                        'count': len(df[col]),
                        'mean': df[col].mean(),
                        'median': df[col].median(),
                        'std': df[col].std(),
                        'min': df[col].min(),
                        'max': df[col].max(),
                        'q25': df[col].quantile(0.25),
                        'q75': df[col].quantile(0.75)
                    }

            self.logger.info(f"統計量計算完了: {len(stats)}列")
            return stats
        except Exception as e:
            self.logger.error(f"統計量計算エラー: {e}")
            raise

    def time_series_analysis(self, df: pd.DataFrame,
                           date_column: str,
                           value_column: str) -> Dict[str, Any]:
        """時系列分析"""
        try:
            # 日付列の変換
            df[date_column] = pd.to_datetime(df[date_column])
            df = df.sort_values(date_column)

            # 日次データのリサンプリング
            daily_data = df.set_index(date_column)[value_column].resample('D').mean()

            # トレンド分析
            trend = np.polyfit(range(len(daily_data)), daily_data, 1)
            trend_slope = trend[0]

            # 移動平均
            moving_avg_7 = daily_data.rolling(window=7).mean()
            moving_avg_30 = daily_data.rolling(window=30).mean()

            result = {
                'trend_slope': trend_slope,
                'trend_direction': 'increasing' if trend_slope > 0 else 'decreasing',
                'daily_data': daily_data.to_dict(),
                'moving_avg_7': moving_avg_7.to_dict(),
                'moving_avg_30': moving_avg_30.to_dict(),
                'volatility': daily_data.std()
            }

            self.logger.info("時系列分析完了")
            return result
        except Exception as e:
            self.logger.error(f"時系列分析エラー: {e}")
            raise

    def export_data(self, df: pd.DataFrame, format_type: str,
                   filename: Optional[str] = None) -> str:
        """データのエクスポート"""
        try:
            if filename is None:
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                filename = f"exported_data_{timestamp}.{format_type}"

            filepath = f"data/exports/{filename}"
            os.makedirs(os.path.dirname(filepath), exist_ok=True)

            if format_type.lower() == 'csv':
                df.to_csv(filepath, index=False)
            elif format_type.lower() == 'excel':
                df.to_excel(filepath, index=False)
            elif format_type.lower() == 'json':
                df.to_json(filepath, orient='records', force_ascii=False)
            else:
                raise ValueError(f"サポートされていないフォーマット: {format_type}")

            self.logger.info(f"データエクスポート完了: {filepath}")
            return filepath
        except Exception as e:
            self.logger.error(f"データエクスポートエラー: {e}")
            raise
```

:::

### 4. ダッシュボードモデルの実装

:::step

1. ダッシュボードモデルの作成

_src/models/dashboard_model.py_

```python
import pandas as pd
import numpy as np
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
import logging
from ..data.data_loader import DataLoader
from ..data.data_processor import DataProcessor

class DashboardModel:
    """ダッシュボードモデルクラス"""

    def __init__(self):
        self.data_loader = DataLoader()
        self.data_processor = DataProcessor()
        self.logger = logging.getLogger(__name__)
        self._data_cache = None
        self._last_refresh = None

    def _load_data(self) -> pd.DataFrame:
        """データを読み込む（キャッシュ機能付き）"""
        try:
            # キャッシュが有効な場合はキャッシュを返す
            if (self._data_cache is not None and
                self._last_refresh and
                (datetime.now() - self._last_refresh).seconds < 3600):
                return self._data_cache

            # データの読み込み
            try:
                df = self.data_loader.load_csv_data('raw/sample_data.csv')
            except FileNotFoundError:
                # ファイルが存在しない場合はサンプルデータを生成
                df = self.data_loader.generate_sample_data(1000)
                df.to_csv('data/raw/sample_data.csv', index=False)

            # データの前処理
            df = self.data_processor.clean_data(df)

            # キャッシュの更新
            self._data_cache = df
            self._last_refresh = datetime.now()

            self.logger.info("データの読み込みと前処理が完了しました")
            return df
        except Exception as e:
            self.logger.error(f"データ読み込みエラー: {e}")
            raise

    def get_data_overview(self) -> Dict[str, Any]:
        """データ概要の取得"""
        try:
            df = self._load_data()

            overview = {
                'total_records': len(df),
                'date_range': {
                    'start': df['date'].min().isoformat(),
                    'end': df['date'].max().isoformat()
                },
                'categories': {
                    'unique_count': df['category'].nunique(),
                    'values': df['category'].value_counts().to_dict()
                },
                'regions': {
                    'unique_count': df['region'].nunique(),
                    'values': df['region'].value_counts().to_dict()
                },
                'status_distribution': df['status'].value_counts().to_dict(),
                'numeric_summary': self.data_processor.calculate_statistics(df)
            }

            return overview
        except Exception as e:
            self.logger.error(f"データ概要取得エラー: {e}")
            raise

    def get_trend_data(self, period: str = 'daily') -> Dict[str, Any]:
        """トレンドデータの取得"""
        try:
            df = self._load_data()

            if period == 'daily':
                grouped = df.groupby(df['date'].dt.date).agg({
                    'value': ['mean', 'sum', 'count'],
                    'quantity': ['sum', 'mean']
                }).reset_index()
            elif period == 'weekly':
                grouped = df.groupby(df['date'].dt.isocalendar().week).agg({
                    'value': ['mean', 'sum', 'count'],
                    'quantity': ['sum', 'mean']
                }).reset_index()
            elif period == 'monthly':
                grouped = df.groupby(df['date'].dt.to_period('M')).agg({
                    'value': ['mean', 'sum', 'count'],
                    'quantity': ['sum', 'mean']
                }).reset_index()
            else:
                raise ValueError(f"サポートされていない期間: {period}")

            # マルチインデックスのカラム名をフラット化
            grouped.columns = ['_'.join(col).strip() if col[1] else col[0]
                             for col in grouped.columns]

            return {
                'period': period,
                'data': grouped.to_dict('records')
            }
        except Exception as e:
            self.logger.error(f"トレンドデータ取得エラー: {e}")
            raise

    def get_category_analysis(self) -> Dict[str, Any]:
        """カテゴリ分析データの取得"""
        try:
            df = self._load_data()

            category_stats = df.groupby('category').agg({
                'value': ['mean', 'sum', 'std'],
                'quantity': ['sum', 'mean'],
                'price': ['mean', 'min', 'max'],
                'date': 'count'
            }).reset_index()

            # カラム名のフラット化
            category_stats.columns = ['_'.join(col).strip() if col[1] else col[0]
                                     for col in category_stats.columns]

            return {
                'category_stats': category_stats.to_dict('records'),
                'top_categories': df['category'].value_counts().head(10).to_dict()
            }
        except Exception as e:
            self.logger.error(f"カテゴリ分析エラー: {e}")
            raise

    def get_regional_analysis(self) -> Dict[str, Any]:
        """地域分析データの取得"""
        try:
            df = self._load_data()

            regional_stats = df.groupby('region').agg({
                'value': ['mean', 'sum'],
                'quantity': ['sum', 'mean'],
                'price': ['mean', 'min', 'max'],
                'date': 'count'
            }).reset_index()

            # カラム名のフラット化
            regional_stats.columns = ['_'.join(col).strip() if col[1] else col[0]
                                   for col in regional_stats.columns]

            return {
                'regional_stats': regional_stats.to_dict('records'),
                'region_distribution': df['region'].value_counts().to_dict()
            }
        except Exception as e:
            self.logger.error(f"地域分析エラー: {e}")
            raise

    def get_correlation_analysis(self) -> Dict[str, Any]:
        """相関分析データの取得"""
        try:
            df = self._load_data()

            # 数値列の選択
            numeric_columns = df.select_dtypes(include=[np.number]).columns
            correlation_matrix = df[numeric_columns].corr()

            return {
                'correlation_matrix': correlation_matrix.to_dict(),
                'strong_correlations': self._find_strong_correlations(correlation_matrix)
            }
        except Exception as e:
            self.logger.error(f"相関分析エラー: {e}")
            raise

    def _find_strong_correlations(self, corr_matrix: pd.DataFrame,
                                 threshold: float = 0.7) -> List[Dict]:
        """強い相関関係を見つける"""
        try:
            strong_corrs = []

            for i in range(len(corr_matrix.columns)):
                for j in range(i + 1, len(corr_matrix.columns)):
                    corr_value = corr_matrix.iloc[i, j]
                    if abs(corr_value) >= threshold:
                        strong_corrs.append({
                            'variable1': corr_matrix.columns[i],
                            'variable2': corr_matrix.columns[j],
                            'correlation': corr_value
                        })

            return strong_corrs
        except Exception as e:
            self.logger.error(f"相関分析エラー: {e}")
            return []

    def get_filtered_data(self, filters: Dict[str, Any]) -> Dict[str, Any]:
        """フィルタリングされたデータの取得"""
        try:
            df = self._load_data()

            if filters:
                df = self.data_processor.filter_data(df, filters)

            return {
                'data': df.to_dict('records'),
                'total_records': len(df),
                'summary': self.data_processor.calculate_statistics(df)
            }
        except Exception as e:
            self.logger.error(f"フィルタリングデータ取得エラー: {e}")
            raise
```

:::

### 5. チャート生成クラスの実装

:::step

1. チャート生成クラスの作成

_src/utils/chart_generator.py_

```python
import plotly.graph_objects as go
import plotly.express as px
import pandas as pd
import numpy as np
from typing import Dict, List, Optional, Any
import logging
from ..models.dashboard_model import DashboardModel

class ChartGenerator:
    """チャート生成クラス"""

    def __init__(self):
        self.dashboard_model = DashboardModel()
        self.logger = logging.getLogger(__name__)

    def generate_chart(self, chart_type: str, filters: Optional[Dict] = None) -> Dict[str, Any]:
        """チャートデータの生成"""
        try:
            chart_methods = {
                'line_trend': self._generate_line_chart,
                'bar_chart': self._generate_bar_chart,
                'pie_chart': self._generate_pie_chart,
                'scatter_plot': self._generate_scatter_plot,
                'heatmap': self._generate_heatmap,
                'box_plot': self._generate_box_plot,
                'histogram': self._generate_histogram,
                'area_chart': self._generate_area_chart
            }

            if chart_type not in chart_methods:
                raise ValueError(f"サポートされていないチャートタイプ: {chart_type}")

            return chart_methods[chart_type](filters)
        except Exception as e:
            self.logger.error(f"チャート生成エラー: {e}")
            raise

    def _generate_line_chart(self, filters: Optional[Dict] = None) -> Dict[str, Any]:
        """折れ線グラフの生成"""
        try:
            trend_data = self.dashboard_model.get_trend_data('daily')

            fig = go.Figure()

            fig.add_trace(go.Scatter(
                x=trend_data['data']['date'],
                y=trend_data['data']['value_mean'],
                mode='lines+markers',
                name='平均値',
                line=dict(color='blue', width=2)
            ))

            fig.add_trace(go.Scatter(
                x=trend_data['data']['date'],
                y=trend_data['data']['value_sum'],
                mode='lines',
                name='合計値',
                line=dict(color='green', width=2),
                yaxis='y2'
            ))

            fig.update_layout(
                title='日次トレンド分析',
                xaxis_title='日付',
                yaxis_title='平均値',
                yaxis2=dict(
                    title='合計値',
                    overlaying='y',
                    side='right'
                ),
                hovermode='x unified',
                template='plotly_white'
            )

            return {
                'chart_type': 'line',
                'data': fig.to_dict(),
                'config': {'responsive': True}
            }
        except Exception as e:
            self.logger.error(f"折れ線グラフ生成エラー: {e}")
            raise

    def _generate_bar_chart(self, filters: Optional[Dict] = None) -> Dict[str, Any]:
        """棒グラフの生成"""
        try:
            category_data = self.dashboard_model.get_category_analysis()

            df = pd.DataFrame(category_data['category_stats'])

            fig = px.bar(
                df,
                x='category',
                y='value_sum',
                color='category',
                title='カテゴリ別合計値',
                labels={'value_sum': '合計値', 'category': 'カテゴリ'}
            )

            fig.update_layout(
                xaxis_title='カテゴリ',
                yaxis_title='合計値',
                template='plotly_white'
            )

            return {
                'chart_type': 'bar',
                'data': fig.to_dict(),
                'config': {'responsive': True}
            }
        except Exception as e:
            self.logger.error(f"棒グラフ生成エラー: {e}")
            raise

    def _generate_pie_chart(self, filters: Optional[Dict] = None) -> Dict[str, Any]:
        """円グラフの生成"""
        try:
            overview = self.dashboard_model.get_data_overview()

            fig = go.Figure(data=[go.Pie(
                labels=list(overview['status_distribution'].keys()),
                values=list(overview['status_distribution'].values()),
                hole=0.3
            )])

            fig.update_traces(
                hoverinfo='label+percent',
                textinfo='value',
                textfont_size=12
            )

            fig.update_layout(
                title='ステータス分布',
                template='plotly_white'
            )

            return {
                'chart_type': 'pie',
                'data': fig.to_dict(),
                'config': {'responsive': True}
            }
        except Exception as e:
            self.logger.error(f"円グラフ生成エラー: {e}")
            raise

    def _generate_scatter_plot(self, filters: Optional[Dict] = None) -> Dict[str, Any]:
        """散布図の生成"""
        try:
            df = self.dashboard_model._load_data()

            fig = px.scatter(
                df,
                x='value',
                y='price',
                color='category',
                size='quantity',
                hover_data=['region', 'status'],
                title='価値と価格の関係',
                labels={'value': '価値', 'price': '価格', 'quantity': '数量'}
            )

            fig.update_layout(
                template='plotly_white'
            )

            return {
                'chart_type': 'scatter',
                'data': fig.to_dict(),
                'config': {'responsive': True}
            }
        except Exception as e:
            self.logger.error(f"散布図生成エラー: {e}")
            raise

    def _generate_heatmap(self, filters: Optional[Dict] = None) -> Dict[str, Any]:
        """ヒートマップの生成"""
        try:
            correlation_data = self.dashboard_model.get_correlation_analysis()
            corr_matrix = pd.DataFrame(correlation_data['correlation_matrix'])

            fig = go.Figure(data=go.Heatmap(
                z=corr_matrix.values,
                x=corr_matrix.columns,
                y=corr_matrix.columns,
                colorscale='RdBu',
                zmid=0,
                text=corr_matrix.values,
                texttemplate="%{text:.2f}",
                textfont={"size": 10}
            ))

            fig.update_layout(
                title='相関マトリックス',
                template='plotly_white'
            )

            return {
                'chart_type': 'heatmap',
                'data': fig.to_dict(),
                'config': {'responsive': True}
            }
        except Exception as e:
            self.logger.error(f"ヒートマップ生成エラー: {e}")
            raise

    def _generate_box_plot(self, filters: Optional[Dict] = None) -> Dict[str, Any]:
        """箱ひげ図の生成"""
        try:
            df = self.dashboard_model._load_data()

            fig = go.Figure()

            for category in df['category'].unique():
                category_data = df[df['category'] == category]['value']
                fig.add_trace(go.Box(
                    y=category_data,
                    name=category,
                    boxpoints='outliers'
                ))

            fig.update_layout(
                title='カテゴリ別価値分布',
                xaxis_title='カテゴリ',
                yaxis_title='価値',
                template='plotly_white'
            )

            return {
                'chart_type': 'box',
                'data': fig.to_dict(),
                'config': {'responsive': True}
            }
        except Exception as e:
            self.logger.error(f"箱ひげ図生成エラー: {e}")
            raise

    def _generate_histogram(self, filters: Optional[Dict] = None) -> Dict[str, Any]:
        """ヒストグラムの生成"""
        try:
            df = self.dashboard_model._load_data()

            fig = go.Figure()

            fig.add_trace(go.Histogram(
                x=df['value'],
                nbinsx=30,
                name='価値分布',
                opacity=0.7
            ))

            fig.update_layout(
                title='価値の分布',
                xaxis_title='価値',
                yaxis_title='頻度',
                template='plotly_white'
            )

            return {
                'chart_type': 'histogram',
                'data': fig.to_dict(),
                'config': {'responsive': True}
            }
        except Exception as e:
            self.logger.error(f"ヒストグラム生成エラー: {e}")
            raise

    def _generate_area_chart(self, filters: Optional[Dict] = None) -> Dict[str, Any]:
        """エリアチャートの生成"""
        try:
            trend_data = self.dashboard_model.get_trend_data('daily')

            fig = go.Figure()

            fig.add_trace(go.Scatter(
                x=trend_data['data']['date'],
                y=trend_data['data']['quantity_sum'],
                fill='tozeroy',
                mode='none',
                name='数量',
                fillcolor='rgba(0,100,80,0.4)'
            ))

            fig.update_layout(
                title='数量の推移',
                xaxis_title='日付',
                yaxis_title='数量',
                template='plotly_white'
            )

            return {
                'chart_type': 'area',
                'data': fig.to_dict(),
                'config': {'responsive': True}
            }
        except Exception as e:
            self.logger.error(f"エリアチャート生成エラー: {e}")
            raise
```

:::

### 6. HTMLテンプレートの作成

:::step

1. メインテンプレートの作成

_templates/index.html_

```html
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>データ分析ダッシュボード</title>

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Plotly.js -->
    <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>

    <!-- カスタムCSS -->
    <style>
        .chart-container {
            height: 400px;
            margin-bottom: 30px;
        }

        .stat-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 20px;
        }

        .stat-value {
            font-size: 2em;
            font-weight: bold;
        }

        .stat-label {
            font-size: 0.9em;
            opacity: 0.8;
        }

        .filter-section {
            background-color: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 30px;
        }

        .chart-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
            gap: 20px;
        }

        .loading {
            text-align: center;
            padding: 20px;
        }

        .error-message {
            background-color: #f8d7da;
            color: #721c24;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 20px;
        }

        .success-message {
            background-color: #d4edda;
            color: #155724;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container-fluid">
        <div class="row">
            <div class="col-12">
                <h1 class="text-center my-4">データ分析ダッシュボード</h1>
            </div>
        </div>

        <!-- 統計カード -->
        <div class="row" id="stats-container">
            <div class="col-md-3">
                <div class="stat-card">
                    <div class="stat-value" id="total-records">-</div>
                    <div class="stat-label">総レコード数</div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stat-card">
                    <div class="stat-value" id="total-categories">-</div>
                    <div class="stat-label">カテゴリ数</div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stat-card">
                    <div class="stat-value" id="total-regions">-</div>
                    <div class="stat-label">地域数</div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stat-card">
                    <div class="stat-value" id="avg-value">-</div>
                    <div class="stat-label">平均価値</div>
                </div>
            </div>
        </div>

        <!-- フィルターセクション -->
        <div class="row">
            <div class="col-12">
                <div class="filter-section">
                    <h4>データフィルター</h4>
                    <div class="row">
                        <div class="col-md-3">
                            <label for="category-filter">カテゴリ:</label>
                            <select id="category-filter" class="form-select" multiple>
                                <option value="">全て</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label for="region-filter">地域:</label>
                            <select id="region-filter" class="form-select" multiple>
                                <option value="">全て</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label for="date-start">開始日:</label>
                            <input type="date" id="date-start" class="form-control">
                        </div>
                        <div class="col-md-3">
                            <label for="date-end">終了日:</label>
                            <input type="date" id="date-end" class="form-control">
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col-md-12">
                            <button class="btn btn-primary" onclick="applyFilters()">フィルター適用</button>
                            <button class="btn btn-secondary" onclick="clearFilters()">クリア</button>
                            <button class="btn btn-success" onclick="refreshData()">データ更新</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- チャートコンテナ -->
        <div class="row">
            <div class="col-md-6">
                <div class="chart-container">
                    <div id="line-chart"></div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="chart-container">
                    <div id="bar-chart"></div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-6">
                <div class="chart-container">
                    <div id="pie-chart"></div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="chart-container">
                    <div id="scatter-plot"></div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-6">
                <div class="chart-container">
                    <div id="heatmap"></div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="chart-container">
                    <div id="box-plot"></div>
                </div>
            </div>
        </div>

        <!-- エクスポートボタン -->
        <div class="row">
            <div class="col-12 text-center">
                <button class="btn btn-outline-primary" onclick="exportData('csv')">CSVエクスポート</button>
                <button class="btn btn-outline-primary" onclick="exportData('excel')">Excelエクスポート</button>
                <button class="btn btn-outline-primary" onclick="exportData('json')">JSONエクスポート</button>
            </div>
        </div>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>

    <!-- カスタムJavaScript -->
    <script>
        // グローバル変数
        let currentFilters = {};

        // ページ読み込み時の初期化
        document.addEventListener('DOMContentLoaded', function() {
            loadDashboard();
        });

        // ダッシュボードデータの読み込み
        async function loadDashboard() {
            try {
                await loadOverview();
                await loadCharts();
                await loadFilterOptions();
            } catch (error) {
                showError('データの読み込みに失敗しました: ' + error.message);
            }
        }

        // データ概要の読み込み
        async function loadOverview() {
            try {
                const response = await fetch('/api/data/overview');
                const data = await response.json();

                document.getElementById('total-records').textContent = data.total_records.toLocaleString();
                document.getElementById('total-categories').textContent = data.categories.unique_count;
                document.getElementById('total-regions').textContent = data.regions.unique_count;
                document.getElementById('avg-value').textContent = Math.round(data.numeric_summary.value.mean).toLocaleString();
            } catch (error) {
                console.error('概要データ読み込みエラー:', error);
            }
        }

        // チャートの読み込み
        async function loadCharts() {
            const chartTypes = ['line_trend', 'bar_chart', 'pie_chart', 'scatter_plot', 'heatmap', 'box_plot'];

            for (const chartType of chartTypes) {
                try {
                    const response = await fetch(`/api/charts/${chartType}`);
                    const chartData = await response.json();

                    if (chartData.error) {
                        console.error(`チャートエラー (${chartType}):`, chartData.error);
                        continue;
                    }

                    Plotly.newPlot(chartType.replace('_', '-'), chartData.data.data, chartData.data.layout, chartData.config);
                } catch (error) {
                    console.error(`チャート読み込みエラー (${chartType}):`, error);
                }
            }
        }

        // フィルターオプションの読み込み
        async function loadFilterOptions() {
            try {
                const response = await fetch('/api/data/overview');
                const data = await response.json();

                // カテゴリオプション
                const categorySelect = document.getElementById('category-filter');
                Object.keys(data.categories.values).forEach(category => {
                    const option = document.createElement('option');
                    option.value = category;
                    option.textContent = category;
                    categorySelect.appendChild(option);
                });

                // 地域オプション
                const regionSelect = document.getElementById('region-filter');
                Object.keys(data.regions.values).forEach(region => {
                    const option = document.createElement('option');
                    option.value = region;
                    option.textContent = region;
                    regionSelect.appendChild(option);
                });
            } catch (error) {
                console.error('フィルターオプション読み込みエラー:', error);
            }
        }

        // フィルターの適用
        function applyFilters() {
            const categoryFilter = Array.from(document.getElementById('category-filter').selectedOptions).map(option => option.value);
            const regionFilter = Array.from(document.getElementById('region-filter').selectedOptions).map(option => option.value);
            const dateStart = document.getElementById('date-start').value;
            const dateEnd = document.getElementById('date-end').value;

            currentFilters = {};

            if (categoryFilter.length > 0) {
                currentFilters.category = { values: categoryFilter };
            }

            if (regionFilter.length > 0) {
                currentFilters.region = { values: regionFilter };
            }

            if (dateStart && dateEnd) {
                currentFilters.date = { min: dateStart, max: dateEnd };
            }

            // フィルターを適用してチャートを再読み込み
            loadCharts();
        }

        // フィルターのクリア
        function clearFilters() {
            document.getElementById('category-filter').selectedIndex = -1;
            document.getElementById('region-filter').selectedIndex = -1;
            document.getElementById('date-start').value = '';
            document.getElementById('date-end').value = '';

            currentFilters = {};
            loadCharts();
        }

        // データの更新
        async function refreshData() {
            try {
                showLoading();
                const response = await fetch('/api/data/refresh');
                const result = await response.json();

                if (result.success) {
                    showSuccess('データが正常に更新されました');
                    loadDashboard();
                } else {
                    showError('データの更新に失敗しました');
                }
            } catch (error) {
                showError('データの更新に失敗しました: ' + error.message);
            } finally {
                hideLoading();
            }
        }

        // データのエクスポート
        function exportData(format) {
            const params = new URLSearchParams(currentFilters);
            params.append('format', format);

            window.open(`/api/data/export?${params.toString()}`, '_blank');
        }

        // ユーティリティ関数
        function showLoading() {
            // ローディング表示の実装
            console.log('Loading...');
        }

        function hideLoading() {
            // ローディング非表示の実装
            console.log('Loading complete');
        }

        function showError(message) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            document.body.insertBefore(errorDiv, document.body.firstChild);

            setTimeout(() => {
                errorDiv.remove();
            }, 5000);
        }

        function showSuccess(message) {
            const successDiv = document.createElement('div');
            successDiv.className = 'success-message';
            successDiv.textContent = message;
            document.body.insertBefore(successDiv, document.body.firstChild);

            setTimeout(() => {
                successDiv.remove();
            }, 5000);
        }
    </script>
</body>
</html>
```

:::

### 7. テストの実装

:::step

1. テストファイルの作成

_tests/test_data_loader.py_

```python
import pytest
import pandas as pd
import tempfile
import os
from src.data.data_loader import DataLoader

class TestDataLoader:
    """データローダーのテストクラス"""

    def setup_method(self):
        """テスト前のセットアップ"""
        self.data_loader = DataLoader()

        # テスト用の一時ディレクトリ作成
        self.temp_dir = tempfile.mkdtemp()
        self.data_loader.data_dir = self.temp_dir

    def teardown_method(self):
        """テスト後のクリーンアップ"""
        # 一時ディレクトリの削除
        import shutil
        shutil.rmtree(self.temp_dir)

    def test_generate_sample_data(self):
        """サンプルデータ生成のテスト"""
        df = self.data_loader.generate_sample_data(100)

        assert len(df) == 100
        assert 'date' in df.columns
        assert 'category' in df.columns
        assert 'value' in df.columns
        assert 'quantity' in df.columns
        assert 'price' in df.columns
        assert 'region' in df.columns
        assert 'status' in df.columns

    def test_load_csv_data(self):
        """CSVデータ読み込みのテスト"""
        # テスト用CSVファイルの作成
        test_data = pd.DataFrame({
            'col1': [1, 2, 3],
            'col2': ['a', 'b', 'c']
        })
        test_csv_path = os.path.join(self.temp_dir, 'test.csv')
        test_data.to_csv(test_csv_path, index=False)

        # CSV読み込みのテスト
        loaded_data = self.data_loader.load_csv_data('test.csv')

        assert len(loaded_data) == 3
        assert list(loaded_data.columns) == ['col1', 'col2']

    def test_load_csv_file_not_found(self):
        """CSVファイルが見つからない場合のテスト"""
        with pytest.raises(FileNotFoundError):
            self.data_loader.load_csv_data('nonexistent.csv')
```

_tests/test_data_processor.py_

```python
import pytest
import pandas as pd
import numpy as np
from src.data.data_processor import DataProcessor

class TestDataProcessor:
    """データプロセッサーのテストクラス"""

    def setup_method(self):
        """テスト前のセットアップ"""
        self.data_processor = DataProcessor()

        # テスト用データの作成
        self.test_data = pd.DataFrame({
            'date': pd.date_range('2023-01-01', periods=100),
            'category': np.random.choice(['A', 'B', 'C'], 100),
            'value': np.random.normal(100, 20, 100),
            'quantity': np.random.poisson(50, 100),
            'price': np.random.uniform(10, 1000, 100),
            'region': np.random.choice(['North', 'South', 'East', 'West'], 100),
            'status': np.random.choice(['Active', 'Inactive', 'Pending'], 100)
        })

    def test_clean_data(self):
        """データクリーニングのテスト"""
        # 欠損値と重複を追加
        dirty_data = self.test_data.copy()
        dirty_data.loc[0, 'value'] = np.nan
        dirty_data = pd.concat([dirty_data, dirty_data.iloc[0:1]], ignore_index=True)

        cleaned_data = self.data_processor.clean_data(dirty_data)

        # 欠損値が除去されていることを確認
        assert cleaned_data.isnull().sum().sum() == 0

        # 重複が除去されていることを確認
        assert len(cleaned_data) < len(dirty_data)

    def test_calculate_statistics(self):
        """統計量計算のテスト"""
        stats = self.data_processor.calculate_statistics(self.test_data)

        assert 'value' in stats
        assert 'quantity' in stats
        assert 'price' in stats

        # 統計量の基本要素を確認
        value_stats = stats['value']
        assert 'count' in value_stats
        assert 'mean' in value_stats
        assert 'std' in value_stats
        assert 'min' in value_stats
        assert 'max' in value_stats

    def test_filter_data(self):
        """データフィルタリングのテスト"""
        filters = {
            'category': {'values': ['A', 'B']},
            'value': {'min': 50, 'max': 150}
        }

        filtered_data = self.data_processor.filter_data(self.test_data, filters)

        # フィルターが適用されていることを確認
        assert all(filtered_data['category'].isin(['A', 'B']))
        assert all((filtered_data['value'] >= 50) & (filtered_data['value'] <= 150))
```

:::

### 8. デプロイ準備

:::step

1. Dockerfileの作成

_Dockerfile_

```dockerfile
FROM python:3.9-slim

# 作業ディレクトリの設定
WORKDIR /app

# システムパッケージのインストール
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# 環境変数の設定
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Pythonパッケージのインストール
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# アプリケーションコードのコピー
COPY . .

# データディレクトリの作成
RUN mkdir -p data/{raw,processed,exports} logs

# ポートの公開
EXPOSE 5000

# アプリケーションの起動
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "src.app:app"]
```

2. requirements.txtの作成

_requirements.txt_

```text
flask==2.3.3
pandas==2.0.3
numpy==1.24.3
plotly==5.15.0
matplotlib==3.7.2
seaborn==0.12.2
dash==2.11.1
dash-bootstrap-components==1.4.1
openpyxl==3.1.2
xlrd==2.0.1
python-dotenv==1.0.0
gunicorn==21.2.0
requests==2.31.0
pytest==7.4.0
pytest-cov==4.1.0
black==23.7.0
flake8==6.0.0
```

3. docker-compose.ymlの作成

_docker-compose.yml_

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production
      - SECRET_KEY=your-production-secret-key
    volumes:
      - ./data:/app/data
      - ./logs:/app/logs
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    restart: unless-stopped
```

:::

## 実行とテスト

### 開発環境での実行

```bash
# 仮想環境の有効化
source venv/bin/activate  # macOS/Linux
# または
venv\Scripts\activate     # Windows

# データの初期化
python -c "from src.data.data_loader import DataLoader; dl = DataLoader(); dl.refresh_data()"

# アプリケーションの起動
python src/app.py

# テストの実行
pytest tests/

# コードフォーマット
black src/
flake8 src/
```

### Dockerを使用した実行

```bash
# Dockerイメージのビルド
docker build -t data-dashboard .

# Docker Composeでの起動
docker-compose up --build

# バックグラウンドでの実行
docker-compose up -d
```

### アクセス

- ローカル環境: http://localhost:5000
- Docker環境: http://localhost:5000

## まとめ

このプロジェクトでは、Claude Codeを活用して包括的なデータ分析ダッシュボードを構築しました。

:::note 主要な実装内容

- **データ処理**: Pandasを使用したデータの読み込み、クリーニング、集約
- **可視化**: Plotlyを使用したインタラクティブなチャート生成
- **Webフレームワーク**: Flaskを使用したバックエンドAPI
- **リアルタイム機能**: データの自動更新とフィルタリング
- **エクスポート機能**: CSV、Excel、JSON形式でのデータエクスポート
- **テスト**: pytestを使用した包括的なテストスイート

:::

### 学習ポイント

- データ分析パイプラインの構築方法
- インタラクティブな可視化の実装
- Web APIとデータ処理の統合
- リアルタイムデータ処理の基本
- コンテナ化とデプロイ戦略

### 次のステップ

- 機械学習モデルの統合
- リアルタイムデータストリームの処理
- ユーザー認証とアクセス制御
- パフォーマンスの最適化
- クラウドサービスへのデプロイ

## 関連記事

[To-Doリストアプリ](../web-app-projects/todo-app.md)
[天気アプリ](../web-app-projects/weather-app.md)
[REST APIサーバー](../api-projects/rest-api-server.md)