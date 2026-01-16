---
title: "天気アプリ"
description: "Claude Codeを使って天気アプリを構築する実践的なプロジェクトです。Next.js、外部API連携、リアルタイムデータ表示を学びます。"
status: "published"
priority: "high"
tags: ["Next.js", "API連携", "天気アプリ", "実践プロジェクト", "TypeScript"]
author: "Claude"
category: "practical-projects"
---

# 天気アプリ

このプロジェクトでは、Claude Codeを使って外部APIと連携する天気アプリを構築します。Next.jsとTypeScriptを使用したモダンなWebアプリケーション開発の実践的なスキルを学びましょう。

## プロジェクト概要

このプロジェクトでは、以下の機能を持つ天気アプリを構築します：

- 🌤️ 現在地の天気情報取得
- 🔍 都市名による天気検索
- 📊 5日間天気予報の表示
- 🌡️ 温度、湿度、風速などの詳細情報
- 📍 お気に入り都市の保存
- 📱 レスポンシブデザイン
- 🌙 ダークモード対応

## 開発環境のセットアップ

:::step

1. プロジェクトの初期化

Next.jsとTypeScriptを使用したプロジェクトをセットアップします。

```bash
# プロジェクトディレクトリの作成
mkdir weather-app
cd weather-app

# Next.jsプロジェクトの作成
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# 必要なパッケージのインストール
npm install axios date-fns recharts
```

2. 環境変数の設定

OpenWeatherMap APIを使用するための設定を行います。

```bash
# .env.localファイルの作成
cat > .env.local << 'EOF'
NEXT_PUBLIC_WEATHER_API_KEY=your_openweathermap_api_key_here
NEXT_PUBLIC_WEATHER_API_URL=https://api.openweathermap.org/data/2.5
NEXT_PUBLIC_GEOCODING_API_URL=https://api.openweathermap.org/geo/1.0
EOF
```

3. ディレクトリ構造の作成

整理されたディレクトリ構造を作成します。

```bash
mkdir -p src/{components,services,hooks,types,utils,stores}
```

:::

## 型定義の作成

:::step

1. 天気データの型定義

アプリケーションで使用する型を定義します。

_src/types/weather.ts_
```typescript
export interface WeatherData {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface ForecastData {
  cod: string;
  message: number;
  cnt: number;
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      sea_level: number;
      grnd_level: number;
      humidity: number;
      temp_kf: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    clouds: {
      all: number;
    };
    wind: {
      speed: number;
      deg: number;
      gust: number;
    };
    visibility: number;
    pop: number;
    sys: {
      pod: string;
    };
    dt_txt: string;
  }>;
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export interface LocationData {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface FavoriteCity {
  id: string;
  name: string;
  lat: number;
  lon: number;
  country: string;
  addedAt: Date;
}

export interface WeatherError {
  message: string;
  code?: string;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
```

2. UIコンポーネントの型定義

_src/types/ui.ts_
```typescript
export interface Theme {
  mode: 'light' | 'dark' | 'auto';
}

export interface ChartDataPoint {
  time: string;
  temperature: number;
  humidity: number;
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: Date;
  location: {
    name: string;
    lat: number;
    lon: number;
  };
}
```

:::

## APIサービスの実装

:::step

1. 天気APIサービスの作成

外部APIとの通信を行うサービスを作成します。

_src/services/weatherService.ts_
```typescript
import axios from 'axios';
import { WeatherData, ForecastData, LocationData, WeatherError } from '@/types/weather';

const WEATHER_API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const WEATHER_API_URL = process.env.NEXT_PUBLIC_WEATHER_API_URL;
const GEOCODING_API_URL = process.env.NEXT_PUBLIC_GEOCODING_API_URL;

export class WeatherService {
  private static handleError(error: any): WeatherError {
    if (error.response) {
      return {
        message: error.response.data.message || 'APIエラーが発生しました',
        code: error.response.status.toString()
      };
    } else if (error.request) {
      return {
        message: 'ネットワークエラーが発生しました'
      };
    } else {
      return {
        message: '予期せぬエラーが発生しました'
      };
    }
  }

  static async getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
    try {
      const response = await axios.get(`${WEATHER_API_URL}/weather`, {
        params: {
          lat,
          lon,
          appid: WEATHER_API_KEY,
          units: 'metric',
          lang: 'ja'
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async getForecast(lat: number, lon: number): Promise<ForecastData> {
    try {
      const response = await axios.get(`${WEATHER_API_URL}/forecast`, {
        params: {
          lat,
          lon,
          appid: WEATHER_API_KEY,
          units: 'metric',
          lang: 'ja'
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async searchCities(query: string): Promise<LocationData[]> {
    try {
      const response = await axios.get(`${GEOCODING_API_URL}/direct`, {
        params: {
          q: query,
          limit: 5,
          appid: WEATHER_API_KEY
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  static async getWeatherByCityName(cityName: string): Promise<{
    weather: WeatherData;
    forecast: ForecastData;
    location: LocationData;
  }> {
    try {
      // まず都市の座標を取得
      const locations = await this.searchCities(cityName);
      if (locations.length === 0) {
        throw new Error('都市が見つかりません');
      }

      const location = locations[0];
      const [weather, forecast] = await Promise.all([
        this.getCurrentWeather(location.lat, location.lon),
        this.getForecast(location.lat, location.lon)
      ]);

      return { weather, forecast, location };
    } catch (error) {
      throw this.handleError(error);
    }
  }
}
```

2. ローカルストレージサービスの作成

お気に入り都市の保存を行うサービスを作成します。

_src/services/storageService.ts_
```typescript
import { FavoriteCity, SearchHistoryItem } from '@/types';

const STORAGE_KEYS = {
  FAVORITE_CITIES: 'weather_app_favorite_cities',
  SEARCH_HISTORY: 'weather_app_search_history',
  THEME: 'weather_app_theme'
};

export class StorageService {
  static getFavoriteCities(): FavoriteCity[] {
    if (typeof window === 'undefined') return [];

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.FAVORITE_CITIES);
      if (!stored) return [];

      const cities = JSON.parse(stored);
      return cities.map((city: any) => ({
        ...city,
        addedAt: new Date(city.addedAt)
      }));
    } catch (error) {
      console.error('Failed to load favorite cities:', error);
      return [];
    }
  }

  static addFavoriteCity(city: Omit<FavoriteCity, 'id' | 'addedAt'>): void {
    if (typeof window === 'undefined') return;

    try {
      const favorites = this.getFavoriteCities();
      const newFavorite: FavoriteCity = {
        ...city,
        id: `city_${Date.now()}`,
        addedAt: new Date()
      };

      // 既に存在する場合は追加しない
      const exists = favorites.some(fav =>
        fav.name === city.name && fav.country === city.country
      );

      if (!exists) {
        favorites.push(newFavorite);
        localStorage.setItem(STORAGE_KEYS.FAVORITE_CITIES, JSON.stringify(favorites));
      }
    } catch (error) {
      console.error('Failed to save favorite city:', error);
    }
  }

  static removeFavoriteCity(cityId: string): void {
    if (typeof window === 'undefined') return;

    try {
      const favorites = this.getFavoriteCities();
      const updated = favorites.filter(city => city.id !== cityId);
      localStorage.setItem(STORAGE_KEYS.FAVORITE_CITIES, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to remove favorite city:', error);
    }
  }

  static getSearchHistory(): SearchHistoryItem[] {
    if (typeof window === 'undefined') return [];

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
      if (!stored) return [];

      const history = JSON.parse(stored);
      return history.map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      }));
    } catch (error) {
      console.error('Failed to load search history:', error);
      return [];
    }
  }

  static addToSearchHistory(item: Omit<SearchHistoryItem, 'id' | 'timestamp'>): void {
    if (typeof window === 'undefined') return;

    try {
      const history = this.getSearchHistory();
      const newItem: SearchHistoryItem = {
        ...item,
        id: `search_${Date.now()}`,
        timestamp: new Date()
      };

      // 重複を削除して最新の検索を先頭に
      const filtered = history.filter(h => h.query !== item.query);
      filtered.unshift(newItem);

      // 最大50件に制限
      const limited = filtered.slice(0, 50);
      localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(limited));
    } catch (error) {
      console.error('Failed to save search history:', error);
    }
  }

  static clearSearchHistory(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(STORAGE_KEYS.SEARCH_HISTORY);
    } catch (error) {
      console.error('Failed to clear search history:', error);
    }
  }

  static getTheme(): 'light' | 'dark' | 'auto' {
    if (typeof window === 'undefined') return 'auto';

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.THEME);
      return stored as 'light' | 'dark' | 'auto' || 'auto';
    } catch (error) {
      return 'auto';
    }
  }

  static setTheme(theme: 'light' | 'dark' | 'auto'): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  }
}
```

:::

## カスタムフックの実装

:::step

1. 天気データフックの作成

天気データの取得と状態管理を行うフックを作成します。

_src/hooks/useWeather.ts_
```typescript
import { useState, useEffect } from 'react';
import { WeatherData, ForecastData, LocationData, LoadingState, WeatherError } from '@/types/weather';
import { WeatherService } from '@/services/weatherService';

interface UseWeatherReturn {
  weather: WeatherData | null;
  forecast: ForecastData | null;
  location: LocationData | null;
  loading: LoadingState;
  error: WeatherError | null;
  fetchWeatherByCoords: (lat: number, lon: number) => Promise<void>;
  fetchWeatherByCity: (cityName: string) => Promise<void>;
  clearError: () => void;
}

export const useWeather = (): UseWeatherReturn => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState<LoadingState>('idle');
  const [error, setError] = useState<WeatherError | null>(null);

  const clearError = () => setError(null);

  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    setLoading('loading');
    setError(null);

    try {
      const [weatherData, forecastData] = await Promise.all([
        WeatherService.getCurrentWeather(lat, lon),
        WeatherService.getForecast(lat, lon)
      ]);

      setWeather(weatherData);
      setForecast(forecastData);
      setLocation({
        name: weatherData.name,
        lat: weatherData.coord.lat,
        lon: weatherData.coord.lon,
        country: weatherData.sys.country
      });
      setLoading('success');
    } catch (err) {
      setError(err as WeatherError);
      setLoading('error');
    }
  };

  const fetchWeatherByCity = async (cityName: string) => {
    setLoading('loading');
    setError(null);

    try {
      const result = await WeatherService.getWeatherByCityName(cityName);
      setWeather(result.weather);
      setForecast(result.forecast);
      setLocation(result.location);
      setLoading('success');
    } catch (err) {
      setError(err as WeatherError);
      setLoading('error');
    }
  };

  return {
    weather,
    forecast,
    location,
    loading,
    error,
    fetchWeatherByCoords,
    fetchWeatherByCity,
    clearError
  };
};
```

2. 位置情報フックの作成

現在地の取得を行うフックを作成します。

_src/hooks/useGeolocation.ts_
```typescript
import { useState, useEffect } from 'react';

interface Position {
  latitude: number;
  longitude: number;
}

interface UseGeolocationReturn {
  position: Position | null;
  loading: boolean;
  error: string | null;
  getCurrentPosition: () => Promise<void>;
}

export const useGeolocation = (): UseGeolocationReturn => {
  const [position, setPosition] = useState<Position | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentPosition = async (): Promise<void> => {
    if (!navigator.geolocation) {
      setError('このブラウザでは位置情報がサポートされていません');
      return;
    }

    setLoading(true);
    setError(null);

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setPosition(pos);
          setLoading(false);
          resolve();
        },
        (error) => {
          let errorMessage = '位置情報の取得に失敗しました';

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = '位置情報へのアクセスが許可されていません';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = '位置情報が利用できません';
              break;
            case error.TIMEOUT:
              errorMessage = '位置情報の取得がタイムアウトしました';
              break;
            default:
              errorMessage = '予期せぬエラーが発生しました';
              break;
          }

          setError(errorMessage);
          setLoading(false);
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5分
        }
      );
    });
  };

  useEffect(() => {
    // コンポーネントマウント時に位置情報を取得
    getCurrentPosition().catch(() => {
      // エラーは無視（ユーザーが手動で取得できるように）
    });
  }, []);

  return {
    position,
    loading,
    error,
    getCurrentPosition
  };
};
```

3. テーマフックの作成

テーマ管理を行うフックを作成します。

_src/hooks/useTheme.ts_
```typescript
import { useState, useEffect } from 'react';
import { StorageService } from '@/services/storageService';

export const useTheme = () => {
  const [theme, setThemeState] = useState<'light' | 'dark' | 'auto'>('auto');

  useEffect(() => {
    const savedTheme = StorageService.getTheme();
    setThemeState(savedTheme);
  }, []);

  useEffect(() => {
    if (theme === 'auto') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      document.documentElement.classList.toggle('dark', systemTheme === 'dark');
    } else {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }

    StorageService.setTheme(theme);
  }, [theme]);

  const setTheme = (newTheme: 'light' | 'dark' | 'auto') => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('auto');
    } else {
      setTheme('light');
    }
  };

  return {
    theme,
    setTheme,
    toggleTheme
  };
};
```

:::

## UIコンポーネントの実装

:::step

1. 現在の天気表示コンポーネント

_src/components/CurrentWeather.tsx_
```typescript
'use client';

import React from 'react';
import { WeatherData } from '@/types/weather';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface CurrentWeatherProps {
  weather: WeatherData;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({
  weather,
  isFavorite,
  onToggleFavorite
}) => {
  const getWeatherIcon = (iconCode: string): string => {
    const iconMap: { [key: string]: string } = {
      '01d': '☀️',
      '01n': '🌙',
      '02d': '⛅',
      '02n': '☁️',
      '03d': '☁️',
      '03n': '☁️',
      '04d': '☁️',
      '04n': '☁️',
      '09d': '🌧️',
      '09n': '🌧️',
      '10d': '🌦️',
      '10n': '🌧️',
      '11d': '⛈️',
      '11n': '⛈️',
      '13d': '❄️',
      '13n': '❄️',
      '50d': '🌫️',
      '50n': '🌫️'
    };
    return iconMap[iconCode] || '🌤️';
  };

  const formatTemperature = (temp: number): string => {
    return `${Math.round(temp)}°C`;
  };

  const formatTime = (timestamp: number): string => {
    return format(new Date(timestamp * 1000), 'H:mm', { locale: ja });
  };

  const getWindDirection = (deg: number): string => {
    const directions = ['北', '北東', '東', '南東', '南', '南西', '西', '北西'];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
  };

  const weatherMain = weather.weather[0];

  return (
    <div className="current-weather bg-gradient-to-br from-blue-400 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-3xl font-bold">{weather.name}</h2>
          <p className="text-sm opacity-80">{weather.sys.country}</p>
          <p className="text-sm opacity-80">
            {format(new Date(), 'M月d日(E)', { locale: ja })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleFavorite}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
            aria-label={isFavorite ? 'お気に入りから削除' : 'お気に入りに追加'}
          >
            {isFavorite ? '❤️' : '🤍'}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-6xl mb-2">
            {getWeatherIcon(weatherMain.icon)}
          </div>
          <div className="text-xl capitalize">
            {weatherMain.description}
          </div>
        </div>
        <div className="text-right">
          <div className="text-6xl font-bold mb-2">
            {formatTemperature(weather.main.temp)}
          </div>
          <div className="text-sm opacity-80">
            体感温度: {formatTemperature(weather.main.feels_like)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/20 rounded-lg p-3">
          <div className="text-sm opacity-80">最高/最低</div>
          <div className="font-semibold">
            {formatTemperature(weather.main.temp_max)} / {formatTemperature(weather.main.temp_min)}
          </div>
        </div>
        <div className="bg-white/20 rounded-lg p-3">
          <div className="text-sm opacity-80">湿度</div>
          <div className="font-semibold">{weather.main.humidity}%</div>
        </div>
        <div className="bg-white/20 rounded-lg p-3">
          <div className="text-sm opacity-80">風速</div>
          <div className="font-semibold">
            {weather.wind.speed.toFixed(1)} m/s {getWindDirection(weather.wind.deg)}
          </div>
        </div>
        <div className="bg-white/20 rounded-lg p-3">
          <div className="text-sm opacity-80">気圧</div>
          <div className="font-semibold">{weather.main.pressure} hPa</div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/20">
        <div className="flex justify-between text-sm">
          <span>🌅 日の出: {formatTime(weather.sys.sunrise)}</span>
          <span>🌇 日の入り: {formatTime(weather.sys.sunset)}</span>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
```

2. 天気予表示コンポーネント

_src/components/WeatherForecast.tsx_
```typescript
'use client';

import React from 'react';
import { ForecastData } from '@/types/weather';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface WeatherForecastProps {
  forecast: ForecastData;
}

const WeatherForecast: React.FC<WeatherForecastProps> = ({ forecast }) => {
  const getWeatherIcon = (iconCode: string): string => {
    const iconMap: { [key: string]: string } = {
      '01d': '☀️',
      '01n': '🌙',
      '02d': '⛅',
      '02n': '☁️',
      '03d': '☁️',
      '03n': '☁️',
      '04d': '☁️',
      '04n': '☁️',
      '09d': '🌧️',
      '09n': '🌧️',
      '10d': '🌦️',
      '10n': '🌧️',
      '11d': '⛈️',
      '11n': '⛈️',
      '13d': '❄️',
      '13n': '❄️',
      '50d': '🌫️',
      '50n': '🌫️'
    };
    return iconMap[iconCode] || '🌤️';
  };

  const formatTemperature = (temp: number): string => {
    return `${Math.round(temp)}°C`;
  };

  // 日付ごとにグループ化
  const dailyForecasts = forecast.list.reduce((acc, item) => {
    const date = new Date(item.dt * 1000).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {} as { [key: string]: typeof forecast.list });

  return (
    <div className="weather-forecast bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        5日間天気予報
      </h3>

      <div className="space-y-4">
        {Object.entries(dailyForecasts).slice(0, 5).map(([date, items]) => {
          const mainItem = items[0];
          const temps = items.map(item => item.main.temp);
          const minTemp = Math.min(...temps);
          const maxTemp = Math.max(...temps);
          const avgPop = items.reduce((sum, item) => sum + item.pop, 0) / items.length;

          return (
            <div key={date} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="text-4xl">
                  {getWeatherIcon(mainItem.weather[0].icon)}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {format(new Date(date), 'M月d日(E)', { locale: ja })}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {mainItem.weather[0].description}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatTemperature(maxTemp)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatTemperature(minTemp)}
                  </span>
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-400">
                  💧 {Math.round(avgPop * 100)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeatherForecast;
```

3. 検索コンポーネント

_src/components/SearchBar.tsx_
```typescript
'use client';

import React, { useState } from 'react';
import { LocationData } from '@/types/weather';
import { StorageService } from '@/services/storageService';

interface SearchBarProps {
  onSearch: (location: LocationData) => void;
  loading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, loading }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationData[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setSearchLoading(true);
    try {
      // 実際の実装ではWeatherService.searchCitiesを呼び出す
      // ここではモックデータを使用
      const mockSuggestions: LocationData[] = [
        { name: 'Tokyo', lat: 35.6762, lon: 139.6503, country: 'JP' },
        { name: 'Osaka', lat: 34.6937, lon: 135.5023, country: 'JP' },
        { name: 'Kyoto', lat: 35.0116, lon: 135.7681, country: 'JP' }
      ].filter(city =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setSuggestions(mockSuggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Search error:', error);
      setSuggestions([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const debouncedSearch = React.useCallback(
    (searchQuery: string) => {
      const timer = setTimeout(() => {
        handleSearch(searchQuery);
      }, 300);

      return () => clearTimeout(timer);
    },
    []
  );

  React.useEffect(() => {
    if (query) {
      const cleanup = debouncedSearch(query);
      return cleanup;
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query, debouncedSearch]);

  const handleSelectLocation = (location: LocationData) => {
    onSearch(location);
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);

    // 検索履歴に追加
    StorageService.addToSearchHistory({
      query,
      location
    });
  };

  return (
    <div className="relative">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="都市名を入力..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          disabled={loading}
        />
        <button
          onClick={() => query && handleSelectLocation(suggestions[0])}
          disabled={!query || loading || searchLoading}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {searchLoading ? '検索中...' : '検索'}
        </button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
          {suggestions.map((location, index) => (
            <button
              key={index}
              onClick={() => handleSelectLocation(location)}
              className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-600 last:border-b-0"
            >
              <div className="font-medium text-gray-900 dark:text-white">
                {location.name}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {location.country}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
```

:::

## メインページの実装

:::step

_src/app/page.tsx_
```typescript
'use client';

import React, { useEffect, useState } from 'react';
import { useWeather } from '@/hooks/useWeather';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useTheme } from '@/hooks/useTheme';
import { StorageService } from '@/services/storageService';
import { LocationData, FavoriteCity } from '@/types';
import CurrentWeather from '@/components/CurrentWeather';
import WeatherForecast from '@/components/WeatherForecast';
import SearchBar from '@/components/SearchBar';

export default function Home() {
  const {
    weather,
    forecast,
    location,
    loading,
    error,
    fetchWeatherByCoords,
    fetchWeatherByCity,
    clearError
  } = useWeather();

  const { position, loading: geoLoading, getCurrentPosition } = useGeolocation();
  const { theme, toggleTheme } = useTheme();
  const [favorites, setFavorites] = useState<FavoriteCity[]>([]);
  const [isCurrentFavorite, setIsCurrentFavorite] = useState(false);

  // お気に入りの読み込み
  useEffect(() => {
    setFavorites(StorageService.getFavoriteCities());
  }, []);

  // 現在地のお気に入り状態を更新
  useEffect(() => {
    if (location) {
      const favorite = favorites.some(fav =>
        fav.name === location.name && fav.country === location.country
      );
      setIsCurrentFavorite(favorite);
    }
  }, [location, favorites]);

  // 現在地の天気を取得
  useEffect(() => {
    if (position) {
      fetchWeatherByCoords(position.latitude, position.longitude);
    }
  }, [position, fetchWeatherByCoords]);

  const handleSearch = (selectedLocation: LocationData) => {
    fetchWeatherByCity(`${selectedLocation.name},${selectedLocation.country}`);
  };

  const handleToggleFavorite = () => {
    if (!location) return;

    if (isCurrentFavorite) {
      // お気に入りから削除
      const favoriteToRemove = favorites.find(fav =>
        fav.name === location.name && fav.country === location.country
      );
      if (favoriteToRemove) {
        StorageService.removeFavoriteCity(favoriteToRemove.id);
        setFavorites(StorageService.getFavoriteCities());
      }
    } else {
      // お気に入りに追加
      StorageService.addFavoriteCity({
        name: location.name,
        lat: location.lat,
        lon: location.lon,
        country: location.country
      });
      setFavorites(StorageService.getFavoriteCities());
    }
    setIsCurrentFavorite(!isCurrentFavorite);
  };

  const handleFavoriteClick = (favorite: FavoriteCity) => {
    fetchWeatherByCoords(favorite.lat, favorite.lon);
  };

  const getLoadingMessage = () => {
    if (geoLoading) return '位置情報を取得中...';
    if (loading === 'loading') return '天気データを取得中...';
    return '読み込み中...';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-6xl mx-auto p-4">
        {/* ヘッダー */}
        <header className="flex items-center justify-between py-6 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              🌤️ 天気アプリ
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              世界中の天気情報をリアルタイムで表示
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            aria-label="テーマ切り替え"
          >
            {theme === 'light' ? '🌙' : theme === 'dark' ? '☀️' : '🌗'}
          </button>
        </header>

        {/* 検索バー */}
        <div className="mb-6">
          <SearchBar onSearch={handleSearch} loading={loading === 'loading'} />
        </div>

        {/* お気に入り都市 */}
        {favorites.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              ❤️ お気に入り
            </h3>
            <div className="flex gap-2 flex-wrap">
              {favorites.map(favorite => (
                <button
                  key={favorite.id}
                  onClick={() => handleFavoriteClick(favorite)}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                >
                  {favorite.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* メインコンテンツ */}
        <main className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左側：現在の天気 */}
          <div className="space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <div className="flex items-center justify-between">
                  <span>{error.message}</span>
                  <button onClick={clearError} className="text-red-500 hover:text-red-700">
                    ✕
                  </button>
                </div>
              </div>
            )}

            {(loading === 'loading' || geoLoading) && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                <p className="text-gray-600 dark:text-gray-300">
                  {getLoadingMessage()}
                </p>
              </div>
            )}

            {weather && location && (
              <CurrentWeather
                weather={weather}
                isFavorite={isCurrentFavorite}
                onToggleFavorite={handleToggleFavorite}
              />
            )}

            {!weather && !loading && !geoLoading && !error && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center">
                <div className="text-6xl mb-2">🌍</div>
                <p className="text-gray-600 dark:text-gray-300">
                  上記の検索バーから都市を検索するか、位置情報を許可してください
                </p>
                {!position && (
                  <button
                    onClick={getCurrentPosition}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    現在地の天気を取得
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 右側：天気予報 */}
          <div>
            {forecast && (
              <WeatherForecast forecast={forecast} />
            )}
          </div>
        </main>

        {/* フッター */}
        <footer className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            天気データ提供: OpenWeatherMap |
            Built with Claude Code, Next.js, and TypeScript
          </p>
        </footer>
      </div>
    </div>
  );
}
```

:::

## テストの実装

:::step

1. コンポーネントテストの作成

_tests/components/CurrentWeather.test.tsx_
```typescript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { WeatherData } from '@/types/weather';
import CurrentWeather from '@/components/CurrentWeather';

const mockWeather: WeatherData = {
  coord: { lon: 139.6503, lat: 35.6762 },
  weather: [{ id: 800, main: 'Clear', description: '晴れ', icon: '01d' }],
  base: 'stations',
  main: {
    temp: 25.5,
    feels_like: 26.2,
    temp_min: 24.0,
    temp_max: 27.0,
    pressure: 1013,
    humidity: 60
  },
  visibility: 10000,
  wind: { speed: 3.5, deg: 180 },
  clouds: { all: 0 },
  dt: 1634567890,
  sys: {
    type: 1,
    id: 1234,
    country: 'JP',
    sunrise: 1634560000,
    sunset: 1634600000
  },
  timezone: 32400,
  id: 1850147,
  name: 'Tokyo',
  cod: 200
};

describe('CurrentWeather', () => {
  test('天気情報が正しく表示される', () => {
    render(
      <CurrentWeather
        weather={mockWeather}
        isFavorite={false}
        onToggleFavorite={jest.fn()}
      />
    );

    expect(screen.getByText('Tokyo')).toBeInTheDocument();
    expect(screen.getByText('JP')).toBeInTheDocument();
    expect(screen.getByText('晴れ')).toBeInTheDocument();
    expect(screen.getByText('26°C')).toBeInTheDocument(); // 丸められた温度
    expect(screen.getByText('体感温度: 26°C')).toBeInTheDocument();
  });

  test('お気に入りボタンがクリックできる', () => {
    const mockOnToggleFavorite = jest.fn();
    render(
      <CurrentWeather
        weather={mockWeather}
        isFavorite={false}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    const favoriteButton = screen.getByLabelText('お気に入りに追加');
    fireEvent.click(favoriteButton);

    expect(mockOnToggleFavorite).toHaveBeenCalledTimes(1);
  });

  test('お気に入り状態が正しく表示される', () => {
    const { rerender } = render(
      <CurrentWeather
        weather={mockWeather}
        isFavorite={false}
        onToggleFavorite={jest.fn()}
      />
    );

    expect(screen.getByLabelText('お気に入りに追加')).toHaveTextContent('🤍');

    rerender(
      <CurrentWeather
        weather={mockWeather}
        isFavorite={true}
        onToggleFavorite={jest.fn()}
      />
    );

    expect(screen.getByLabelText('お気に入りから削除')).toHaveTextContent('❤️');
  });
});
```

2. フックテストの作成

_tests/hooks/useWeather.test.ts_
```typescript
import { renderHook, act } from '@testing-library/react';
import { useWeather } from '@/hooks/useWeather';
import { WeatherService } from '@/services/weatherService';

// WeatherServiceのモック
jest.mock('@/services/weatherService');
const mockedWeatherService = WeatherService as jest.Mocked<typeof WeatherService>;

describe('useWeather', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('初期状態は正しく設定される', () => {
    const { result } = renderHook(() => useWeather());

    expect(result.current.weather).toBeNull();
    expect(result.current.forecast).toBeNull();
    expect(result.current.location).toBeNull();
    expect(result.current.loading).toBe('idle');
    expect(result.current.error).toBeNull();
  });

  test('都市名での天気取得が成功する', async () => {
    const mockWeather = {
      name: 'Tokyo',
      coord: { lat: 35.6762, lon: 139.6503 },
      sys: { country: 'JP' },
      main: { temp: 25 }
    } as any;

    const mockForecast = {
      list: [],
      city: { name: 'Tokyo' }
    } as any;

    const mockLocation = {
      name: 'Tokyo',
      lat: 35.6762,
      lon: 139.6503,
      country: 'JP'
    };

    mockedWeatherService.getWeatherByCityName.mockResolvedValue({
      weather: mockWeather,
      forecast: mockForecast,
      location: mockLocation
    });

    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.fetchWeatherByCity('Tokyo');
    });

    expect(result.current.loading).toBe('success');
    expect(result.current.weather).toEqual(mockWeather);
    expect(result.current.forecast).toEqual(mockForecast);
    expect(result.current.location).toEqual(mockLocation);
    expect(result.current.error).toBeNull();
  });

  test('エラーが正しく処理される', async () => {
    const mockError = new Error('都市が見つかりません');
    mockedWeatherService.getWeatherByCityName.mockRejectedValue(mockError);

    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.fetchWeatherByCity('InvalidCity');
    });

    expect(result.current.loading).toBe('error');
    expect(result.current.error).toEqual(mockError);
  });
});
```

:::

## デプロイの準備

:::step

1. 環境変数の設定

VercelやNetlifyでデプロイするための環境変数を設定します。

```bash
# Vercelの場合
vercel env add NEXT_PUBLIC_WEATHER_API_KEY
vercel env add NEXT_PUBLIC_WEATHER_API_URL
vercel env add NEXT_PUBLIC_GEOCODING_API_URL
```

2. デプロイ設定の作成

_vercel.json_
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

3. パフォーマンス最適化

_next.config.js_
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['openweathermap.org'],
    formats: ['image/webp', 'image/avif']
  },
  compress: true,
  poweredByHeader: false
};

module.exports = nextConfig;
```

:::

## Claude Codeでの開発体験

このプロジェクトをClaude Codeで開発する際の効果的な活用方法：

### 効果的なプロンプト例

```bash
# コンポーネントの改善
claude "このCurrentWeatherコンポーネントをよりアクセシブルにしてください。ARIA属性とキーボードナビゲーションを追加してください。"

# 新機能の追加
claude "この天気アプリに空气质量指数（AQI）を表示する機能を追加してください。新しいAPIエンドポイントの統合方法も教えてください。"

# パフォーマンス最適化
claude "このアプリケーションのパフォーマンスを最適化してください。画像の遅延読み込み、コード分割、キャッシュ戦略を実装してください。"

# エラーハンドリングの改善
claude "このアプリのエラーハンドリングを改善してください。ネットワークエラー、APIエラー、位置情報エラーのユーザーフレンドリーな表示方法を実装してください。"

# テストの追加
claude "この天気アプリのための統合テストを作成してください。Cypressを使用したE2Eテストで、検索機能とお気に入り機能をテストしてください。"
```

### 開発のベストプラクティス

1. **段階的な実装**: 機能を小さく分けて順番に実装
2. **プロンプトの具体化**: 期待する動作を具体的に説明
3. **コードレビュー**: 生成されたコードを必ず確認
4. **テストの実装**: 機能ごとにテストを作成
5. **ドキュメント化**: 複雑なロジックにコメントを追加

## まとめ

このプロジェクトでは、Claude Codeを使用して完全な天気アプリを構築しました。

### 学んだこと

- ✅ Next.jsとTypeScriptを使用したモダンなWebアプリ開発
- ✅ 外部APIとの連携とエラーハンドリング
- ✅ カスタムフックによる状態管理
- ✅ ローカルストレージによるデータ永続化
- ✅ レスポンシブデザインとアクセシビリティ
- ✅ テスト駆動開発の実践
- ✅ テーマ切り替え機能の実装
- ✅ 位置情報APIの活用

### 技術スタック

- **フロントエンド**: Next.js 13+, React 18+, TypeScript
- **スタイリング**: Tailwind CSS
- **状態管理**: React Hooks, Local Storage
- **データ取得**: Axios, OpenWeatherMap API
- **テスト**: Jest, React Testing Library
- **デプロイ**: Vercel/Netlify

### 次のステップ

このプロジェクトを基に、さらに高度な機能に挑戦しましょう：

1. **リアルタイム更新**: WebSocketを使用したリアルタイム天気更新
2. **マップ表示**: 位置情報をインタラクティブなマップで表示
3. **通知機能**: 天気警報や急な気象変化の通知
4. **多言語対応**: 国際化（i18n）の実装
5. **オフライン対応**: Service Workerを使用したオフライン機能

Claude Codeを活用することで、これらの高度な機能も効率的に実装できます。

---

## 関連リソース

- [OpenWeatherMap APIドキュメント](https://openweathermap.org/api)
- [Next.js公式ドキュメント](https://nextjs.org/docs)
- [TypeScript公式ドキュメント](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)