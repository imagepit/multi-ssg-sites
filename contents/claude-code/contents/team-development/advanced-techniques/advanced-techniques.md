---
title: "高度な技術"
description: "Claude Codeを活用したチーム開発における高度な技術とベストプラクティスを学びます。マイクロサービス、CI/CD、DevOps、セキュリティなどの実践的な手法をマスターします。"
status: "published"
priority: "high"
tags: ["高度な技術", "マイクロサービス", "CI/CD", "DevOps", "セキュリティ"]
author: "Claude"
category: "team-development"
---

# 高度な技術

Claude Codeを活用したチーム開発における高度な技術とベストプラクティスについて学びます。このセクションでは、現代のソフトウェア開発で必須となるマイクロサービスアーキテクチャ、CI/CDパイプライン、DevOpsプラクティス、セキュリティ対策などの実践的な手法を解説します。

## 高度な技術の重要性

現代のソフトウェア開発では、基本的なプログラミングスキルだけでなく、アーキテクチャ設計、自動化、セキュリティなどの高度な技術が求められます。Claude Codeを適切に活用することで、これらの複雑な技術を効率的に習得し適用できます。

:::note 高度な技術が必要な理由

- **スケーラビリティ**: 大規模アプリケーションを効率的に構築・運用
- **信頼性**: 高可用性とフォールトトレランスの確保
- **開発効率**: 自動化による開発プロセスの最適化
- **セキュリティ**: 現代の脅威に対する堅牢な防御
- **保守性**: 長期的な運用と進化に対応する設計

:::

## マイクロサービスアーキテクチャ

マイクロサービスは、アプリケーションを小さな独立したサービスの集合として構築するアーキテクチャスタイルです。

:::step

1. マイクロサービス環境の構築

任意の場所（デスクトップなど）で`microservices-practice`フォルダを作成し、実践を始めます。

```bash
mkdir microservices-practice
cd microservices-practice
npm init -y
```

2. マイクロサービスフレームワークの実装

`src/microservices-framework.js`を作成し、Claude Codeを活用したマイクロサービス開発フレームワークを実装します。

_src/microservices-framework.js_

```javascript
/**
 * Claude Codeを活用したマイクロサービス開発フレームワーク
 * サービス間通信、設定管理、モニタリングなどの機能を提供
 */
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

class MicroservicesFramework {
  constructor(config = {}) {
    this.services = new Map();
    this.config = {
      port: config.port || 3000,
      serviceName: config.serviceName || 'microservice',
      registryUrl: config.registryUrl || 'http://localhost:8000',
      healthCheckInterval: config.healthCheckInterval || 30000,
      ...config
    };
    this.app = express();
    this.middleware = [];
    this.circuitBreakers = new Map();
    this.serviceDiscovery = new ServiceDiscovery(this.config.registryUrl);
    this.loadBalancer = new LoadBalancer();
    this.monitoring = new MonitoringService();

    this.setupMiddleware();
    this.setupHealthChecks();
  }

  // ミドルウェアの設定
  setupMiddleware() {
    // セキュリティミドルウェア
    this.app.use(helmet());
    this.app.use(cors({
      origin: this.config.allowedOrigins || ['http://localhost:3000'],
      credentials: true
    }));

    // レート制限
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15分
      max: 100 // 各IPあたり100リクエスト
    });
    this.app.use(limiter);

    // JSONパーサー
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));

    // リクエストロギング
    this.app.use(this.requestLogger.bind(this));

    // エラーハンドリング
    this.app.use(this.errorHandler.bind(this));
  }

  // サービスの登録
  async registerService(serviceInfo) {
    const service = {
      id: this.generateId(),
      name: this.config.serviceName,
      host: serviceInfo.host || 'localhost',
      port: serviceInfo.port || this.config.port,
      health: '/health',
      metadata: serviceInfo.metadata || {},
      registeredAt: new Date(),
      status: 'healthy'
    };

    await this.serviceDiscovery.register(service);
    this.services.set(service.id, service);

    console.log(`✅ サービスを登録しました: ${service.name} (${service.host}:${service.port})`);

    // 自動登録解除の設定
    process.on('SIGTERM', () => this.deregisterService(service.id));
    process.on('SIGINT', () => this.deregisterService(service.id));

    return service;
  }

  // サービスの登録解除
  async deregisterService(serviceId) {
    const service = this.services.get(serviceId);
    if (service) {
      await this.serviceDiscovery.deregister(serviceId);
      this.services.delete(serviceId);
      console.log(`❌ サービスの登録を解除しました: ${service.name}`);
    }
  }

  // APIエンドポイントの作成
  createEndpoint(path, handler, options = {}) {
    const method = options.method || 'get';
    const middleware = options.middleware || [];
    const rateLimit = options.rateLimit;
    const auth = options.auth;

    // ミドルウェアの適用
    const applyMiddleware = (req, res, next) => {
      // レート制限
      if (rateLimit) {
        const limiter = rateLimit({
          windowMs: rateLimit.windowMs || 15 * 60 * 1000,
          max: rateLimit.max || 100,
          message: rateLimit.message || 'Too many requests'
        });
        limiter(req, res, next);
      } else {
        next();
      }
    };

    // 認証
    const applyAuth = async (req, res, next) => {
      if (auth) {
        try {
          await this.authenticate(req, auth);
          next();
        } catch (error) {
          res.status(401).json({ error: 'Unauthorized', message: error.message });
        }
      } else {
        next();
      }
    };

    // エンドポイントの登録
    this.app[method](path, applyMiddleware, applyAuth, ...middleware, async (req, res) => {
      try {
        const startTime = Date.now();

        // サーキットブレーカーのチェック
        const circuitBreaker = this.circuitBreakers.get(path);
        if (circuitBreaker && !circuitBreaker.allowRequest()) {
          throw new Error('Service temporarily unavailable');
        }

        // ハンドラーの実行
        const result = await handler(req, res);

        // レスポンスタイムの記録
        const responseTime = Date.now() - startTime;
        this.monitoring.recordMetric('response_time', responseTime, { endpoint: path });

        res.json(result);
      } catch (error) {
        this.handleEndpointError(error, req, res, path);
      }
    });

    console.log(`📡 エンドポイントを作成しました: ${method.toUpperCase()} ${path}`);
  }

  // サービス間通信
  async callService(serviceName, endpoint, options = {}) {
    const service = await this.serviceDiscovery.discover(serviceName);
    if (!service) {
      throw new Error(`Service ${serviceName} not found`);
    }

    // ロードバランシング
    const targetService = this.loadBalancer.select(service);

    // サーキットブレーカーの取得または作成
    let circuitBreaker = this.circuitBreakers.get(`${serviceName}${endpoint}`);
    if (!circuitBreaker) {
      circuitBreaker = new CircuitBreaker({
        timeout: options.timeout || 5000,
        errorThreshold: options.errorThreshold || 0.5,
        resetTimeout: options.resetTimeout || 30000
      });
      this.circuitBreakers.set(`${serviceName}${endpoint}`, circuitBreaker);
    }

    return circuitBreaker.execute(async () => {
      const url = `${targetService.protocol || 'http'}://${targetService.host}:${targetService.port}${endpoint}`;

      const requestConfig = {
        method: options.method || 'get',
        url,
        headers: {
          'Content-Type': 'application/json',
          'X-Service-Name': this.config.serviceName,
          'X-Request-ID': this.generateRequestId(),
          ...options.headers
        },
        timeout: options.timeout || 5000,
        data: options.data
      };

      // リトライロジック
      const maxRetries = options.retries || 2;
      let lastError;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const response = await axios(requestConfig);

          // 成功メトリクスの記録
          this.monitoring.recordMetric('service_call_success', 1, {
            service: serviceName,
            endpoint,
            attempt
          });

          return response.data;
        } catch (error) {
          lastError = error;

          // 失敗メトリクスの記録
          this.monitoring.recordMetric('service_call_error', 1, {
            service: serviceName,
            endpoint,
            attempt,
            error: error.code || 'unknown'
          });

          if (attempt === maxRetries) {
            throw error;
          }

          // 指数バックオフ
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }

      throw lastError;
    });
  }

  // メッセージキューの統合
  setupMessageQueue(config = {}) {
    const messageQueue = new MessageQueue(config);

    // メッセージハンドラーの登録
    this.onMessage = (topic, handler) => {
      messageQueue.subscribe(topic, handler);
    };

    // メッセージの送信
    this.publishMessage = (topic, message) => {
      return messageQueue.publish(topic, message);
    };

    console.log('📨 メッセージキューを設定しました');
    return messageQueue;
  }

  // データベース接続の設定
  setupDatabase(config) {
    const database = new DatabaseConnection(config);

    // トランザクションハンドラー
    this.withTransaction = async (callback) => {
      return database.transaction(callback);
    };

    // クエリビルダー
    this.query = (sql, params) => {
      return database.query(sql, params);
    };

    console.log('🗄️  データベース接続を設定しました');
    return database;
  }

  // キャッシュの設定
  setupCache(config) {
    const cache = new CacheService(config);

    this.cache = {
      get: (key) => cache.get(key),
      set: (key, value, ttl) => cache.set(key, value, ttl),
      delete: (key) => cache.delete(key),
      clear: () => cache.clear()
    };

    console.log('💾 キャッシュサービスを設定しました');
    return cache;
  }

  // 認証と認可
  async authenticate(req, authConfig) {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new Error('Authorization token required');
    }

    // JWTの検証
    if (authConfig.type === 'jwt') {
      return this.verifyJWT(token, authConfig.secret);
    }

    // APIキーの検証
    if (authConfig.type === 'api_key') {
      return this.verifyAPIKey(token, authConfig.keys);
    }

    throw new Error('Unsupported authentication type');
  }

  // JWTの検証
  async verifyJWT(token, secret) {
    const jwt = require('jsonwebtoken');

    try {
      const decoded = jwt.verify(token, secret);
      return decoded;
    } catch (error) {
      throw new Error('Invalid JWT token');
    }
  }

  // APIキーの検証
  async verifyAPIKey(token, validKeys) {
    if (!validKeys.includes(token)) {
      throw new Error('Invalid API key');
    }

    return { type: 'api_key', key: token };
  }

  // ヘルスチェックの設定
  setupHealthChecks() {
    this.app.get('/health', async (req, res) => {
      const health = {
        status: 'healthy',
        timestamp: new Date(),
        service: this.config.serviceName,
        version: this.config.version || '1.0.0',
        checks: {}
      };

      try {
        // データベース接続チェック
        if (this.database) {
          health.checks.database = await this.checkDatabase();
        }

        // キャッシュチェック
        if (this.cache) {
          health.checks.cache = await this.checkCache();
        }

        // 外部サービス接続チェック
        for (const [serviceName, service] of this.services) {
          health.checks[serviceName] = await this.checkService(service);
        }

        // 全体のステータス判定
        const hasFailures = Object.values(health.checks).some(check => check.status !== 'healthy');
        health.status = hasFailures ? 'unhealthy' : 'healthy';

        res.status(health.status === 'healthy' ? 200 : 503).json(health);
      } catch (error) {
        health.status = 'unhealthy';
        health.error = error.message;
        res.status(503).json(health);
      }
    });
  }

  // データベースヘルスチェック
  async checkDatabase() {
    try {
      await this.database.query('SELECT 1');
      return { status: 'healthy', responseTime: Date.now() - this.dbCheckStart };
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  }

  // キャッシュヘルスチェック
  async checkCache() {
    try {
      const testKey = 'health_check';
      await this.cache.set(testKey, 'ok', 5);
      const value = await this.cache.get(testKey);
      await this.cache.delete(testKey);

      return value === 'ok'
        ? { status: 'healthy' }
        : { status: 'unhealthy', error: 'Cache read/write failed' };
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  }

  // サービスヘルスチェック
  async checkService(service) {
    try {
      const response = await axios.get(
        `http://${service.host}:${service.port}/health`,
        { timeout: 5000 }
      );

      return {
        status: response.data.status === 'healthy' ? 'healthy' : 'unhealthy',
        responseTime: response.headers['x-response-time']
      };
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  }

  // メトリクスの収集
  collectMetrics() {
    return this.monitoring.getMetrics();
  }

  // サーバーの起動
  async start() {
    try {
      // サービスの登録
      await this.registerService({
        host: this.config.host || 'localhost',
        port: this.config.port,
        metadata: {
          version: this.config.version || '1.0.0',
          environment: this.config.environment || 'development'
        }
      });

      // サーバーの起動
      const server = this.app.listen(this.config.port, () => {
        console.log(`🚀 サーバーを起動しました: ${this.config.serviceName} on port ${this.config.port}`);
      });

      // グレースフルシャットダウン
      this.setupGracefulShutdown(server);

      return server;
    } catch (error) {
      console.error('❌ サーバーの起動に失敗しました:', error.message);
      throw error;
    }
  }

  // リクエストロガー
  requestLogger(req, res, next) {
    const start = Date.now();
    const requestId = this.generateRequestId();

    req.requestId = requestId;
    req.startTime = start;

    res.on('finish', () => {
      const responseTime = Date.now() - start;

      this.monitoring.recordMetric('http_requests', 1, {
        method: req.method,
        path: req.path,
        status: res.statusCode,
        responseTime
      });

      console.log(`[${requestId}] ${req.method} ${req.path} - ${res.statusCode} (${responseTime}ms)`);
    });

    next();
  }

  // エラーハンドラー
  errorHandler(error, req, res, next) {
    console.error(`[${req.requestId}] Error:`, error);

    this.monitoring.recordMetric('errors', 1, {
      type: error.name,
      path: req.path,
      method: req.method
    });

    res.status(error.status || 500).json({
      error: error.name || 'Internal Server Error',
      message: error.message || 'An unexpected error occurred',
      requestId: req.requestId
    });
  }

  // エンドポイントエラーハンドラー
  handleEndpointError(error, req, res, endpoint) {
    const circuitBreaker = this.circuitBreakers.get(endpoint);
    if (circuitBreaker) {
      circuitBreaker.recordFailure();
    }

    this.monitoring.recordMetric('endpoint_errors', 1, {
      endpoint,
      error: error.name
    });

    if (error.response) {
      res.status(error.response.status).json({
        error: 'Service Error',
        message: error.response.data.message || 'External service error'
      });
    } else if (error.code === 'ECONNABORTED') {
      res.status(504).json({
        error: 'Timeout',
        message: 'Service timeout'
      });
    } else {
      res.status(500).json({
        error: 'Internal Server Error',
        message: error.message
      });
    }
  }

  // グレースフルシャットダウンの設定
  setupGracefulShutdown(server) {
    const shutdown = async (signal) => {
      console.log(`\n🛑 ${signal}を受信、シャットダウンを開始します...`);

      // 新しい接続の受け付けを停止
      server.close(() => {
        console.log('✅ サーバーを停止しました');
        process.exit(0);
      });

      // タイムアウト後に強制終了
      setTimeout(() => {
        console.error('❌ シャットダウンがタイムアウトしました。強制終了します。');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  }

  // ユーティリティメソッド
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }

  generateRequestId() {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// サービスディスカバリー
class ServiceDiscovery {
  constructor(registryUrl) {
    this.registryUrl = registryUrl;
    this.services = new Map();
    this.cache = new Map();
    this.cacheTTL = 30000; // 30秒キャッシュ
  }

  async register(service) {
    try {
      await axios.post(`${this.registryUrl}/register`, service);
      console.log(`✅ サービスを登録しました: ${service.name}`);
    } catch (error) {
      console.error('❌ サービス登録に失敗しました:', error.message);
    }
  }

  async deregister(serviceId) {
    try {
      await axios.delete(`${this.registryUrl}/deregister/${serviceId}`);
      console.log(`✅ サービス登録を解除しました: ${serviceId}`);
    } catch (error) {
      console.error('❌ サービス登録解除に失敗しました:', error.message);
    }
  }

  async discover(serviceName) {
    // キャッシュチェック
    const cached = this.cache.get(serviceName);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.services;
    }

    try {
      const response = await axios.get(`${this.registryUrl}/discover/${serviceName}`);
      const services = response.data;

      // キャッシュに保存
      this.cache.set(serviceName, {
        services,
        timestamp: Date.now()
      });

      return services;
    } catch (error) {
      console.error(`❌ サービス発見に失敗しました: ${serviceName}`, error.message);
      return null;
    }
  }
}

// ロードバランサー
class LoadBalancer {
  constructor(strategy = 'round-robin') {
    this.strategy = strategy;
    this.counters = new Map();
  }

  select(services) {
    if (!services || services.length === 0) {
      throw new Error('No services available');
    }

    switch (this.strategy) {
      case 'round-robin':
        return this.roundRobin(services);
      case 'least-connections':
        return this.leastConnections(services);
      case 'random':
        return this.random(services);
      default:
        return services[0];
    }
  }

  roundRobin(services) {
    const serviceName = services[0].name;
    const counter = this.counters.get(serviceName) || 0;
    const selected = services[counter % services.length];
    this.counters.set(serviceName, counter + 1);
    return selected;
  }

  leastConnections(services) {
    return services.reduce((min, service) =>
      service.connections < min.connections ? service : min
    );
  }

  random(services) {
    return services[Math.floor(Math.random() * services.length)];
  }
}

// サーキットブレーカー
class CircuitBreaker {
  constructor(config) {
    this.config = {
      timeout: config.timeout || 5000,
      errorThreshold: config.errorThreshold || 0.5,
      resetTimeout: config.resetTimeout || 30000,
      ...config
    };

    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.failures = 0;
    this.lastFailureTime = null;
    this.nextAttemptTime = null;
  }

  async execute(fn) {
    if (!this.allowRequest()) {
      throw new Error('Circuit breaker is OPEN');
    }

    try {
      const result = await fn();
      this.recordSuccess();
      return result;
    } catch (error) {
      this.recordFailure();
      throw error;
    }
  }

  allowRequest() {
    switch (this.state) {
      case 'CLOSED':
        return true;
      case 'OPEN':
        if (Date.now() >= this.nextAttemptTime) {
          this.state = 'HALF_OPEN';
          return true;
        }
        return false;
      case 'HALF_OPEN':
        return true;
      default:
        return true;
    }
  }

  recordSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  recordFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.state === 'CLOSED' && this.failures >= this.config.errorThreshold * 10) {
      this.state = 'OPEN';
      this.nextAttemptTime = Date.now() + this.config.resetTimeout;
    } else if (this.state === 'HALF_OPEN') {
      this.state = 'OPEN';
      this.nextAttemptTime = Date.now() + this.config.resetTimeout;
    }
  }
}

// モニタリングサービス
class MonitoringService {
  constructor() {
    this.metrics = new Map();
    this.alerts = [];
  }

  recordMetric(name, value, tags = {}) {
    const key = this.getMetricKey(name, tags);

    if (!this.metrics.has(key)) {
      this.metrics.set(key, {
        name,
        tags,
        values: [],
        timestamps: []
      });
    }

    const metric = this.metrics.get(key);
    metric.values.push(value);
    metric.timestamps.push(Date.now());

    // データポイントの制限（最新1000件）
    if (metric.values.length > 1000) {
      metric.values = metric.values.slice(-1000);
      metric.timestamps = metric.timestamps.slice(-1000);
    }

    // アラートチェック
    this.checkAlerts(name, value, tags);
  }

  getMetrics() {
    const summary = {};

    for (const [key, metric] of this.metrics) {
      const values = metric.values;
      if (values.length === 0) continue;

      summary[key] = {
        name: metric.name,
        tags: metric.tags,
        count: values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        avg: values.reduce((sum, val) => sum + val, 0) / values.length,
        latest: values[values.length - 1]
      };
    }

    return summary;
  }

  getMetricKey(name, tags) {
    const tagString = Object.entries(tags)
      .map(([key, value]) => `${key}=${value}`)
      .join(',');
    return `${name}{${tagString}}`;
  }

  checkAlerts(name, value, tags) {
    // アラートルールの定義とチェック
    const alertRules = {
      'error_rate': { threshold: 5, operator: '>' },
      'response_time': { threshold: 1000, operator: '>' },
      'memory_usage': { threshold: 90, operator: '>' }
    };

    const rule = alertRules[name];
    if (rule) {
      const shouldAlert = rule.operator === '>' ? value > rule.threshold : value < rule.threshold;

      if (shouldAlert) {
        this.alerts.push({
          name,
          value,
          threshold: rule.threshold,
          tags,
          timestamp: Date.now()
        });
      }
    }
  }
}

// メッセージキュー（簡易実装）
class MessageQueue {
  constructor(config) {
    this.config = config;
    this.subscribers = new Map();
    this.messages = [];
  }

  subscribe(topic, handler) {
    if (!this.subscribers.has(topic)) {
      this.subscribers.set(topic, []);
    }
    this.subscribers.get(topic).push(handler);
  }

  publish(topic, message) {
    this.messages.push({ topic, message, timestamp: Date.now() });

    const handlers = this.subscribers.get(topic) || [];
    handlers.forEach(handler => {
      try {
        handler(message);
      } catch (error) {
        console.error('Message handler error:', error);
      }
    });
  }
}

// データベース接続（簡易実装）
class DatabaseConnection {
  constructor(config) {
    this.config = config;
    this.pool = [];
    this.maxConnections = config.maxConnections || 10;
  }

  async query(sql, params) {
    // 実際のデータベース接続ロジックを実装
    return { rows: [], fields: [] };
  }

  async transaction(callback) {
    // トランザクション処理を実装
    try {
      const result = await callback();
      return result;
    } catch (error) {
      throw error;
    }
  }
}

// キャッシュサービス（簡易実装）
class CacheService {
  constructor(config) {
    this.config = config;
    this.cache = new Map();
    this.defaultTTL = config.defaultTTL || 3600; // 1時間
  }

  async get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  async set(key, value, ttl = this.defaultTTL) {
    const expiry = Date.now() + (ttl * 1000);
    this.cache.set(key, { value, expiry });
  }

  async delete(key) {
    this.cache.delete(key);
  }

  async clear() {
    this.cache.clear();
  }
}

module.exports = { MicroservicesFramework };
```

:::

## CI/CDパイプラインの実装

継続的インテグレーションと継続的デプロイメントは、現代のソフトウェア開発の基盤です。

:::step

1. CI/CDパイプラインの実装

`src/cicd-pipeline.js`を作成し、Claude Codeを活用したCI/CDパイプラインを実装します。

_src/cicd-pipeline.js_

```javascript
/**
 * Claude Codeを活用したCI/CDパイプライン
 * 自動ビルド、テスト、デプロイを実現
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

class CICDPipeline {
  constructor(config = {}) {
    this.config = {
      projectName: config.projectName || 'my-project',
      repository: config.repository || {},
      buildScript: config.buildScript || 'npm run build',
      testScript: config.testScript || 'npm test',
      deployScript: config.deployScript || 'npm run deploy',
      environments: config.environments || ['staging', 'production'],
      notifications: config.notifications || [],
      qualityGates: config.qualityGates || {},
      ...config
    };

    this.stages = new Map();
    this.artifacts = new Map();
    this.buildHistory = [];
    this.qualityMetrics = new Map();

    this.initializeStages();
  }

  // パイプラインの初期化
  initializeStages() {
    // ビルドステージ
    this.stages.set('build', {
      name: 'Build',
      description: 'ソースコードのビルドとコンパイル',
      script: this.config.buildScript,
      timeout: 600000, // 10分
      required: true
    });

    // テストステージ
    this.stages.set('test', {
      name: 'Test',
      description: '自動テストの実行',
      script: this.config.testScript,
      timeout: 1800000, // 30分
      required: true,
      parallel: true
    });

    // 品質チェックステージ
    this.stages.set('quality', {
      name: 'Quality Check',
      description: 'コード品質とセキュリティのチェック',
      script: 'npm run quality-check',
      timeout: 900000, // 15分
      required: true
    });

    // デプロイステージ
    this.stages.set('deploy', {
      name: 'Deploy',
      description: 'アプリケーションのデプロイ',
      script: this.config.deployScript,
      timeout: 1800000, // 30分
      required: false,
      environment: 'staging'
    });

    console.log('🔧 CI/CDパイプラインを初期化しました');
  }

  // パイプラインの実行
  async executePipeline(trigger = 'manual', options = {}) {
    const buildId = this.generateBuildId();
    const build = {
      id: buildId,
      trigger,
      status: 'running',
      startTime: new Date(),
      commit: options.commit || this.getCurrentCommit(),
      branch: options.branch || 'main',
      environment: options.environment || 'staging',
      stages: [],
      artifacts: [],
      qualityMetrics: {},
      notifications: []
    };

    console.log(`🚀 パイプラインを実行します: ${buildId}`);
    console.log(`トリガー: ${trigger}`);
    console.log(`ブランチ: ${build.branch}`);
    console.log(`環境: ${build.environment}`);

    try {
      // 前処理
      await this.preBuild(build);

      // ステージの順次実行
      for (const [stageName, stage] of this.stages) {
        if (stage.environment && stage.environment !== build.environment) {
          continue;
        }

        console.log(`\n📋 ステージを実行中: ${stage.name}`);
        const stageResult = await this.executeStage(build, stageName, stage);
        build.stages.push(stageResult);

        if (stageResult.status === 'failed' && stage.required) {
          throw new Error(`Required stage ${stageName} failed`);
        }
      }

      // 後処理
      await this.postBuild(build);

      build.status = 'success';
      build.endTime = new Date();
      build.duration = build.endTime - build.startTime;

      console.log(`✅ パイプラインが成功しました: ${buildId}`);
      console.log(`⏱️  所要時間: ${Math.round(build.duration / 1000)}秒`);

    } catch (error) {
      build.status = 'failed';
      build.endTime = new Date();
      build.duration = build.endTime - build.startTime;
      build.error = error.message;

      console.error(`❌ パイプラインが失敗しました: ${buildId}`);
      console.error(`エラー: ${error.message}`);

      // ロールバックの実行
      await this.rollback(build);
    }

    // ビルド履歴に追加
    this.buildHistory.push(build);

    // 通知の送信
    await this.sendNotifications(build);

    // レポートの生成
    const report = this.generateBuildReport(build);
    console.log('\n📊 ビルドレポート:');
    console.log(report);

    return build;
  }

  // ステージの実行
  async executeStage(build, stageName, stage) {
    const stageStart = Date.now();
    const stageResult = {
      name: stageName,
      status: 'running',
      startTime: new Date(),
      logs: [],
      artifacts: [],
      metrics: {}
    };

    try {
      // 前処理
      await this.preStage(build, stageName);

      // スクリプトの実行
      const result = await this.executeScript(stage.script, {
        timeout: stage.timeout,
        cwd: build.workspace,
        env: {
          ...process.env,
          BUILD_ID: build.id,
          STAGE_NAME: stageName,
          BRANCH_NAME: build.branch
        }
      });

      stageResult.status = 'success';
      stageResult.output = result.output;
      stageResult.logs = result.logs;

      // 成功メトリクスの記録
      this.recordMetrics(stageName, 'success', Date.now() - stageStart);

      // アーティファクトの収集
      if (stage.artifacts) {
        const artifacts = await this.collectArtifacts(stage.artifacts);
        stageResult.artifacts = artifacts;
        build.artifacts.push(...artifacts);
      }

      // 品質ゲートのチェック
      if (stageName === 'quality') {
        const qualityResult = await this.checkQualityGates(build);
        stageResult.qualityMetrics = qualityResult;
        build.qualityMetrics = qualityResult;
      }

      console.log(`✅ ${stageName} ステージが成功しました`);

    } catch (error) {
      stageResult.status = 'failed';
      stageResult.error = error.message;
      stageResult.endTime = new Date();

      // 失敗メトリクスの記録
      this.recordMetrics(stageName, 'failed', Date.now() - stageStart);

      console.error(`❌ ${stageName} ステージが失敗しました: ${error.message}`);
    }

    stageResult.endTime = new Date();
    stageResult.duration = stageResult.endTime - stageResult.startTime;

    // 後処理
    await this.postStage(build, stageName, stageResult);

    return stageResult;
  }

  // スクリプトの実行
  async executeScript(script, options = {}) {
    const timeout = options.timeout || 300000; // 5分デフォルト
    const cwd = options.cwd || process.cwd();
    const env = options.env || process.env;

    console.log(`🔧 スクリプトを実行します: ${script}`);

    return new Promise((resolve, reject) => {
      const child = require('child_process').exec(script, {
        cwd,
        env,
        timeout,
        maxBuffer: 1024 * 1024 * 10 // 10MB
      });

      let stdout = '';
      let stderr = '';
      const logs = [];

      child.stdout?.on('data', (data) => {
        stdout += data;
        logs.push({ type: 'stdout', data: data.toString(), timestamp: Date.now() });
        console.log(data.toString().trim());
      });

      child.stderr?.on('data', (data) => {
        stderr += data;
        logs.push({ type: 'stderr', data: data.toString(), timestamp: Date.now() });
        console.error(data.toString().trim());
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve({
            code,
            output: stdout,
            error: stderr,
            logs
          });
        } else {
          reject(new Error(`Script failed with exit code ${code}: ${stderr}`));
        }
      });

      child.on('error', (error) => {
        reject(error);
      });
    });
  }

  // 品質ゲートのチェック
  async checkQualityGates(build) {
    console.log('🔍 品質ゲートをチェックします...');

    const qualityMetrics = {
      codeCoverage: 0,
      codeQuality: 0,
      security: 0,
      performance: 0,
      overall: 0
    };

    try {
      // テストカバレッジのチェック
      const coverage = await this.checkTestCoverage();
      qualityMetrics.codeCoverage = coverage;

      // コード品質のチェック
      const quality = await this.checkCodeQuality();
      qualityMetrics.codeQuality = quality;

      // セキュリティスキャン
      const security = await this.runSecurityScan();
      qualityMetrics.security = security;

      // パフォーマンステスト
      const performance = await this.runPerformanceTests();
      qualityMetrics.performance = performance;

      // 総合スコアの計算
      qualityMetrics.overall = Math.round(
        (coverage * 0.3 + quality * 0.3 + security * 0.2 + performance * 0.2)
      );

      // 品質ゲートの検証
      const gates = this.config.qualityGates || {
        minCodeCoverage: 80,
        minCodeQuality: 85,
        minSecurity: 90,
        minPerformance: 75,
        minOverall: 80
      };

      const gateResults = {
        codeCoverage: coverage >= gates.minCodeCoverage,
        codeQuality: quality >= gates.minCodeQuality,
        security: security >= gates.minSecurity,
        performance: performance >= gates.minPerformance,
        overall: qualityMetrics.overall >= gates.minOverall
      };

      const passedGates = Object.values(gateResults).filter(Boolean).length;
      const totalGates = Object.keys(gateResults).length;

      console.log(`📊 品質メトリクス:`);
      console.log(`  コードカバレッジ: ${coverage}% (${gateResults.codeCoverage ? '✅' : '❌'})`);
      console.log(`  コード品質: ${quality}% (${gateResults.codeQuality ? '✅' : '❌'})`);
      console.log(`  セキュリティ: ${security}% (${gateResults.security ? '✅' : '❌'})`);
      console.log(`  パフォーマンス: ${performance}% (${gateResults.performance ? '✅' : '❌'})`);
      console.log(`  総合スコア: ${qualityMetrics.overall}% (${gateResults.overall ? '✅' : '❌'})`);

      if (passedGates < totalGates) {
        throw new Error(`Quality gates failed: ${passedGates}/${totalGates} passed`);
      }

      return {
        ...qualityMetrics,
        gates: gateResults,
        passed: passedGates === totalGates
      };

    } catch (error) {
      console.error('❌ 品質ゲートのチェックに失敗しました:', error.message);
      throw error;
    }
  }

  // テストカバレッジのチェック
  async checkTestCoverage() {
    try {
      // カバレッジレポートの生成
      await this.executeScript('npm run test:coverage', { timeout: 300000 });

      // カバレッジレポートの解析
      const coverageReport = await this.parseCoverageReport();

      return coverageReport.totalCoverage || 0;
    } catch (error) {
      console.error('テストカバレッジチェックに失敗しました:', error.message);
      return 0;
    }
  }

  // コード品質のチェック
  async checkCodeQuality() {
    try {
      // ESLintの実行
      const eslintResult = await this.executeScript('npm run lint', { timeout: 120000 });

      // 複雑性のチェック
      const complexityResult = await this.executeScript('npm run complexity', { timeout: 120000 });

      // 品質スコアの計算
      const qualityScore = this.calculateQualityScore(eslintResult, complexityResult);

      return qualityScore;
    } catch (error) {
      console.error('コード品質チェックに失敗しました:', error.message);
      return 0;
    }
  }

  // セキュリティスキャンの実行
  async runSecurityScan() {
    try {
      // 依存関係の脆弱性スキャン
      const auditResult = await this.executeScript('npm audit --audit-level=moderate', { timeout: 180000 });

      // 静的セキュリティ分析
      const sastResult = await this.executeScript('npm run security-scan', { timeout: 300000 });

      // セキュリティスコアの計算
      const securityScore = this.calculateSecurityScore(auditResult, sastResult);

      return securityScore;
    } catch (error) {
      console.error('セキュリティスキャンに失敗しました:', error.message);
      return 0;
    }
  }

  // パフォーマンステストの実行
  async runPerformanceTests() {
    try {
      // パフォーマンステストの実行
      const perfResult = await this.executeScript('npm run performance-test', { timeout: 600000 });

      // パフォーマンススコアの計算
      const performanceScore = this.calculatePerformanceScore(perfResult);

      return performanceScore;
    } catch (error) {
      console.error('パフォーマンステストに失敗しました:', error.message);
      return 0;
    }
  }

  // アーティファクトの収集
  async collectArtifacts(patterns) {
    const artifacts = [];

    for (const pattern of patterns) {
      const files = await this.findFiles(pattern);
      for (const file of files) {
        const artifact = {
          name: path.basename(file),
          path: file,
          size: fs.statSync(file).size,
          type: this.getArtifactType(file)
        };
        artifacts.push(artifact);
      }
    }

    console.log(`📦 ${artifacts.length}個のアーティファクトを収集しました`);
    return artifacts;
  }

  // ファイルの検索
  async findFiles(pattern) {
    const { glob } = await import('glob');
    return glob.sync(pattern);
  }

  // アーティファクトタイプの判定
  getArtifactType(filename) {
    const ext = path.extname(filename).toLowerCase();
    const typeMap = {
      '.js': 'javascript',
      '.ts': 'typescript',
      '.jsx': 'react',
      '.tsx': 'react-typescript',
      '.css': 'stylesheet',
      '.scss': 'stylesheet',
      '.json': 'json',
      '.html': 'html',
      '.md': 'documentation',
      '.zip': 'archive',
      '.tar.gz': 'archive'
    };
    return typeMap[ext] || 'unknown';
  }

  // ビルド前処理
  async preBuild(build) {
    console.log('🔧 ビルド前処理を実行します...');

    // ワークスペースの準備
    build.workspace = await this.prepareWorkspace();

    // コードのチェックアウト
    await this.checkoutCode(build);

    // 依存関係のインストール
    await this.installDependencies(build);

    // 環境変数の設定
    await this.setupEnvironment(build);
  }

  // ワークスペースの準備
  async prepareWorkspace() {
    const workspace = path.join(process.cwd(), 'build', Date.now().toString());

    if (!fs.existsSync(workspace)) {
      fs.mkdirSync(workspace, { recursive: true });
    }

    return workspace;
  }

  // コードのチェックアウト
  async checkoutCode(build) {
    if (build.commit) {
      console.log(`📥 コミットをチェックアウトします: ${build.commit}`);
      await this.executeScript(`git checkout ${build.commit}`, { cwd: build.workspace });
    }
  }

  // 依存関係のインストール
  async installDependencies(build) {
    console.log('📦 依存関係をインストールします...');
    await this.executeScript('npm ci', { cwd: build.workspace, timeout: 600000 });
  }

  // 環境変数の設定
  async setupEnvironment(build) {
    console.log('🔧 環境変数を設定します...');

    const envFile = path.join(build.workspace, '.env');
    const envConfig = this.config.environments[build.environment] || {};

    const envContent = Object.entries(envConfig)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    fs.writeFileSync(envFile, envContent);
  }

  // ビルド後処理
  async postBuild(build) {
    console.log('🧹 ビルド後処理を実行します...');

    // アーティファクトのアップロード
    if (build.artifacts.length > 0) {
      await this.uploadArtifacts(build);
    }

    // デプロイメントの実行
    if (build.status === 'success' && build.environment !== 'build') {
      await this.deploy(build);
    }

    // クリーンアップ
    await this.cleanup(build);
  }

  // アーティファクトのアップロード
  async uploadArtifacts(build) {
    console.log(`📤 ${build.artifacts.length}個のアーティファクトをアップロードします...`);

    for (const artifact of build.artifacts) {
      try {
        await this.uploadArtifact(artifact);
        console.log(`  ✅ ${artifact.name}`);
      } catch (error) {
        console.error(`  ❌ ${artifact.name}: ${error.message}`);
      }
    }
  }

  // アーティファクトのアップロード（個別）
  async uploadArtifact(artifact) {
    // 実際のアップロードロジックを実装
    // S3、Artifactory、または独自のストレージを使用
    console.log(`Uploading ${artifact.path} to artifact storage...`);
  }

  // デプロイメントの実行
  async deploy(build) {
    console.log(`🚀 ${build.environment} 環境にデプロイします...`);

    const deployStrategy = this.config.deployStrategy || 'blue-green';

    switch (deployStrategy) {
      case 'blue-green':
        await this.blueGreenDeploy(build);
        break;
      case 'canary':
        await this.canaryDeploy(build);
        break;
      case 'rolling':
        await this.rollingDeploy(build);
        break;
      default:
        await this.basicDeploy(build);
    }
  }

  // Blue-Greenデプロイ
  async blueGreenDeploy(build) {
    console.log('🔄 Blue-Greenデプロイを実行します...');

    // 新しい環境（Green）の準備
    const greenEnv = `${build.environment}-green`;

    // Green環境へのデプロイ
    await this.deployToEnvironment(build, greenEnv);

    // ヘルスチェック
    const healthCheck = await this.performHealthCheck(greenEnv);
    if (!healthCheck.healthy) {
      throw new Error('Green environment health check failed');
    }

    // トラフィックの切り替え
    await this.switchTraffic(build.environment, greenEnv);

    // 旧環境（Blue）のクリーンアップ
    await this.cleanupEnvironment(build.environment);

    console.log('✅ Blue-Greenデプロイが完了しました');
  }

  // カナリアデプロイ
  async canaryDeploy(build) {
    console.log('🐦 カナリアデプロイを実行します...');

    // 10%のトラフィックを新しいバージョンに
    await this.deployWithTrafficControl(build, 10);

    // モニタリング
    const monitoring = await this.monitorDeployment(build, 300000); // 5分

    if (monitoring.healthy) {
      // 段階的にトラフィックを増加
      await this.adjustTraffic(build, 50);
      await this.monitorDeployment(build, 300000);

      await this.adjustTraffic(build, 100);
      console.log('✅ カナリアデプロイが完了しました');
    } else {
      // ロールバック
      await this.rollbackTraffic(build);
      throw new Error('Canary deployment failed');
    }
  }

  // ローリングデプロイ
  async rollingDeploy(build) {
    console.log('🔄 ローリングデプロイを実行します...');

    const instances = await this.getInstances(build.environment);
    const batchSize = Math.max(1, Math.floor(instances.length / 3));

    for (let i = 0; i < instances.length; i += batchSize) {
      const batch = instances.slice(i, i + batchSize);

      // バッチをデプロイ
      for (const instance of batch) {
        await this.deployToInstance(build, instance);
      }

      // ヘルスチェック
      const healthy = await this.checkBatchHealth(batch);
      if (!healthy) {
        throw new Error('Rolling deployment health check failed');
      }

      console.log(`✅ バッチ ${Math.floor(i / batchSize) + 1}/${Math.ceil(instances.length / batchSize)} をデプロイしました`);
    }

    console.log('✅ ローリングデプロイが完了しました');
  }

  // ヘルスチェック
  async performHealthCheck(environment) {
    try {
      const url = this.getEnvironmentUrl(environment);
      const response = await axios.get(`${url}/health`, { timeout: 10000 });

      return {
        healthy: response.data.status === 'healthy',
        response: response.data,
        responseTime: response.headers['x-response-time']
      };
    } catch (error) {
      return { healthy: false, error: error.message };
    }
  }

  // デプロイメントのモニタリング
  async monitorDeployment(build, duration) {
    const startTime = Date.now();
    let healthy = true;

    while (Date.now() - startTime < duration) {
      const health = await this.performHealthCheck(build.environment);

      if (!health.healthy) {
        healthy = false;
        break;
      }

      // エラーレートのチェック
      const errorRate = await this.getErrorRate(build.environment);
      if (errorRate > 5) { // 5%以上のエラー率
        healthy = false;
        break;
      }

      await new Promise(resolve => setTimeout(resolve, 30000)); // 30秒待機
    }

    return { healthy, duration: Date.now() - startTime };
  }

  // ロールバックの実行
  async rollback(build) {
    console.log('🔄 ロールバックを実行します...');

    if (build.previousDeployment) {
      await this.deployToVersion(build, build.previousDeployment);
      console.log('✅ ロールバックが完了しました');
    } else {
      console.log('⚠️  ロールバックバージョンが見つかりません');
    }
  }

  // 通知の送信
  async sendNotifications(build) {
    console.log('📧 通知を送信します...');

    for (const notification of this.config.notifications) {
      try {
        await this.sendNotification(build, notification);
        console.log(`  ✅ ${notification.type}`);
      } catch (error) {
        console.error(`  ❌ ${notification.type}: ${error.message}`);
      }
    }
  }

  // 通知の送信（個別）
  async sendNotification(build, notification) {
    const message = this.formatNotificationMessage(build);

    switch (notification.type) {
      case 'slack':
        await this.sendSlackNotification(notification.webhook, message);
        break;
      case 'email':
        await this.sendEmailNotification(notification.recipients, message);
        break;
      case 'webhook':
        await this.sendWebhookNotification(notification.url, message);
        break;
      default:
        console.log(`Unknown notification type: ${notification.type}`);
    }
  }

  // 通知メッセージのフォーマット
  formatNotificationMessage(build) {
    const status = build.status === 'success' ? '✅' : '❌';
    const duration = Math.round(build.duration / 1000);

    return {
      text: `${status} ${this.config.projectName} Build #${build.id.slice(-6)}`,
      attachments: [{
        color: build.status === 'success' ? 'good' : 'danger',
        fields: [
          { title: 'Status', value: build.status, short: true },
          { title: 'Duration', value: `${duration}s`, short: true },
          { title: 'Branch', value: build.branch, short: true },
          { title: 'Environment', value: build.environment, short: true },
          { title: 'Commit', value: build.commit.slice(0, 7), short: true }
        ]
      }]
    };
  }

  // Slack通知の送信
  async sendSlackNotification(webhook, message) {
    await axios.post(webhook, message);
  }

  // メール通知の送信
  async sendEmailNotification(recipients, message) {
    // 実際のメール送信ロジックを実装
    console.log(`Sending email to ${recipients.join(', ')}`);
  }

  // Webhook通知の送信
  async sendWebhookNotification(url, message) {
    await axios.post(url, message);
  }

  // ビルドレポートの生成
  generateBuildReport(build) {
    const stages = build.stages.map(stage =>
      `${stage.name}: ${stage.status} (${Math.round(stage.duration / 1000)}s)`
    ).join('\n  ');

    return `
Build Report
=============
ID: ${build.id}
Status: ${build.status}
Duration: ${Math.round(build.duration / 1000)}s
Branch: ${build.branch}
Environment: ${build.environment}
Commit: ${build.commit}

Stages:
  ${stages}

Artifacts: ${build.artifacts.length}
Quality Score: ${build.qualityMetrics.overall || 'N/A'}%
    `.trim();
  }

  // ユーティリティメソッド
  generateBuildId() {
    return `build_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  }

  getCurrentCommit() {
    try {
      return execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
    } catch (error) {
      return 'unknown';
    }
  }

  recordMetrics(stage, status, duration) {
    const key = `${stage}_${status}`;
    if (!this.qualityMetrics.has(key)) {
      this.qualityMetrics.set(key, []);
    }
    this.qualityMetrics.get(key).push(duration);
  }

  parseCoverageReport() {
    // 実際のカバレッジレポート解析ロジックを実装
    return { totalCoverage: 85 };
  }

  calculateQualityScore(eslintResult, complexityResult) {
    // 実際の品質スコア計算ロジックを実装
    return 90;
  }

  calculateSecurityScore(auditResult, sastResult) {
    // 実際のセキュリティスコア計算ロジックを実装
    return 95;
  }

  calculatePerformanceScore(perfResult) {
    // 実際のパフォーマンススコア計算ロジックを実装
    return 88;
  }

  getEnvironmentUrl(environment) {
    // 環境に応じたURLを返す
    return `https://${environment}.example.com`;
  }

  getInstances(environment) {
    // 環境のインスタンスリストを返す
    return [
      { id: 'instance-1', host: '10.0.1.1' },
      { id: 'instance-2', host: '10.0.1.2' },
      { id: 'instance-3', host: '10.0.1.3' }
    ];
  }

  getErrorRate(environment) {
    // エラーレートを返す（実際には監視システムから取得）
    return Math.random() * 10;
  }

  // デプロイメントヘルパーメソッド
  async deployToEnvironment(build, environment) {
    console.log(`Deploying to ${environment}...`);
  }

  async switchTraffic(from, to) {
    console.log(`Switching traffic from ${from} to ${to}...`);
  }

  async cleanupEnvironment(environment) {
    console.log(`Cleaning up ${environment}...`);
  }

  async deployWithTrafficControl(build, percentage) {
    console.log(`Deploying with ${percentage}% traffic...`);
  }

  async adjustTraffic(build, percentage) {
    console.log(`Adjusting traffic to ${percentage}%...`);
  }

  async rollbackTraffic(build) {
    console.log('Rolling back traffic...');
  }

  async checkBatchHealth(instances) {
    console.log(`Checking health of batch: ${instances.map(i => i.id).join(', ')}`);
    return true;
  }

  async deployToInstance(build, instance) {
    console.log(`Deploying to instance ${instance.id}...`);
  }

  async deployToVersion(build, version) {
    console.log(`Deploying to version ${version}...`);
  }

  async cleanup(build) {
    console.log(`Cleaning up workspace: ${build.workspace}`);
    // ワークスペースのクリーンアップを実装
  }

  // ステージフックメソッド
  async preStage(build, stageName) {
    console.log(`Pre-stage hook for ${stageName}`);
  }

  async postStage(build, stageName, stageResult) {
    console.log(`Post-stage hook for ${stageName}`);
  }
}

module.exports = { CICDPipeline };
```

:::

## DevOpsプラクティス

DevOpsは開発と運用の協業を促進する文化とプラクティスの集合です。

:::step

1. DevOpsツールチェーンの実装

`src/devops-toolchain.js`を作成し、Claude Codeを活用したDevOpsツールチェーンを実装します。

_src/devops-toolchain.js_

```javascript
/**
 * Claude Codeを活用したDevOpsツールチェーン
 * インフラストラクチャ即時コード、監視、ロギングなどの機能を提供
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class DevOpsToolchain {
  constructor(config = {}) {
    this.config = {
      projectName: config.projectName || 'my-project',
      cloudProvider: config.cloudProvider || 'aws',
      region: config.region || 'us-east-1',
      environment: config.environment || 'development',
      monitoring: config.monitoring || {},
      logging: config.logging || {},
      ...config
    };

    this.infrastructure = new InfrastructureManager(this.config);
    this.monitoring = new MonitoringService(this.config.monitoring);
    this.logging = new LoggingService(this.config.logging);
    this.security = new SecurityService(this.config);
    this.backup = new BackupService(this.config);
  }

  // インフラストラクチャの管理
  async manageInfrastructure() {
    console.log('🏗️  インフラストラクチャを管理します...');

    // TerraformまたはCloudFormationのテンプレート生成
    const infrastructureTemplate = await this.generateInfrastructureTemplate();

    // インフラストラクチャのデプロイ
    const deployment = await this.deployInfrastructure(infrastructureTemplate);

    // 設定の検証
    const validation = await this.validateInfrastructure(deployment);

    return {
      template: infrastructureTemplate,
      deployment,
      validation
    };
  }

  // インフラストラクチャテンプレートの生成
  async generateInfrastructureTemplate() {
    console.log('📋 インフラストラクチャテンプレートを生成します...');

    const prompt = `
以下のプロジェクトに最適なインフラストラクチャテンプレートを生成してください:

プロジェクト名: ${this.config.projectName}
クラウドプロバイダー: ${this.config.cloudProvider}
環境: ${this.config.environment}
リージョン: ${this.config.region}

要件:
- 高可用性
- 自動スケーリング
- 負荷分散
- データベースの冗長化
- バックアップと復元
- セキュリティグループの設定
- 監視とロギング

テンプレート形式:
- AWSの場合: CloudFormationまたはTerraform
- GCPの場合: Deployment Manager
- Azureの場合: ARMテンプレート
`;

    // Claude Codeによるテンプレート生成（モック実装）
    const template = this.generateMockInfrastructureTemplate();

    console.log('✅ インフラストラクチャテンプレートを生成しました');
    return template;
  }

  // モックインフラストラクチャテンプレートの生成
  generateMockInfrastructureTemplate() {
    return {
      provider: this.config.cloudProvider,
      resources: {
        vpc: {
          type: 'AWS::EC2::VPC',
          properties: {
            CidrBlock: '10.0.0.0/16',
            EnableDnsSupport: true,
            EnableDnsHostnames: true,
            Tags: [
              { Key: 'Name', Value: `${this.config.projectName}-vpc` },
              { Key: 'Environment', Value: this.config.environment }
            ]
          }
        },
        loadBalancer: {
          type: 'AWS::ElasticLoadBalancingV2::LoadBalancer',
          properties: {
            Type: 'application',
            Scheme: 'internet-facing',
            Subnets: [],
            SecurityGroups: []
          }
        },
        autoScaling: {
          type: 'AWS::AutoScaling::AutoScalingGroup',
          properties: {
            MinSize: 2,
            MaxSize: 10,
            DesiredCapacity: 2,
            HealthCheckType: 'ELB',
            HealthCheckGracePeriod: 300
          }
        }
      },
      outputs: {
        LoadBalancerDNS: {
          Description: 'DNS name of the load balancer',
          Value: { 'Fn::GetAtt': ['LoadBalancer', 'DNSName'] }
        }
      }
    };
  }

  // インフラストラクチャのデプロイ
  async deployInfrastructure(template) {
    console.log('🚀 インフラストラクチャをデプロイします...');

    try {
      // テンプレートの検証
      await this.validateTemplate(template);

      // デプロイメントの実行
      const deployment = {
        id: this.generateDeploymentId(),
        status: 'deploying',
        startTime: new Date(),
        template: template,
        resources: [],
        outputs: {}
      };

      // 各リソースのデプロイ
      for (const [resourceName, resourceConfig] of Object.entries(template.resources || {})) {
        const resource = await this.deployResource(resourceName, resourceConfig);
        deployment.resources.push(resource);
      }

      // アウトプットの収集
      for (const [outputName, outputConfig] of Object.entries(template.outputs || {})) {
        deployment.outputs[outputName] = await this.getOutputValue(outputConfig);
      }

      deployment.status = 'deployed';
      deployment.endTime = new Date();

      console.log('✅ インフラストラクチャのデプロイが完了しました');
      return deployment;

    } catch (error) {
      console.error('❌ インフラストラクチャのデプロイに失敗しました:', error.message);
      throw error;
    }
  }

  // テンプレートの検証
  async validateTemplate(template) {
    console.log('🔍 テンプレートを検証します...');

    const errors = [];

    // 必須プロパティのチェック
    if (!template.provider) {
      errors.push('Provider is required');
    }

    if (!template.resources || Object.keys(template.resources).length === 0) {
      errors.push('At least one resource is required');
    }

    // リソースの検証
    for (const [resourceName, resourceConfig] of Object.entries(template.resources || {})) {
      if (!resourceConfig.type) {
        errors.push(`Resource ${resourceName} missing type`);
      }
      if (!resourceConfig.properties) {
        errors.push(`Resource ${resourceName} missing properties`);
      }
    }

    if (errors.length > 0) {
      throw new Error(`Template validation failed: ${errors.join(', ')}`);
    }

    console.log('✅ テンプレートの検証が完了しました');
  }

  // リソースのデプロイ
  async deployResource(resourceName, resourceConfig) {
    console.log(`📦 リソースをデプロイします: ${resourceName}`);

    // 実際のクラウドAPI呼び出し（モック実装）
    const resource = {
      name: resourceName,
      type: resourceConfig.type,
      id: this.generateResourceId(),
      status: 'created',
      properties: resourceConfig.properties,
      createdAt: new Date()
    };

    // デプロイメントのシミュレーション
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log(`✅ ${resourceName} をデプロイしました`);
    return resource;
  }

  // アウトプット値の取得
  async getOutputValue(outputConfig) {
    // 実際の出力値の取得ロジック（モック実装）
    return 'example-output-value';
  }

  // インフラストラクチャの検証
  async validateInfrastructure(deployment) {
    console.log('🔍 デプロイしたインフラストラクチャを検証します...');

    const validation = {
      status: 'valid',
      checks: [],
      issues: [],
      timestamp: new Date()
    };

    // 各リソースの検証
    for (const resource of deployment.resources) {
      const check = await this.validateResource(resource);
      validation.checks.push(check);

      if (!check.healthy) {
        validation.issues.push(...check.issues);
      }
    }

    // 全体の健全性判定
    const unhealthyChecks = validation.checks.filter(c => !c.healthy);
    if (unhealthyChecks.length > 0) {
      validation.status = 'invalid';
      validation.issues.unshift(`${unhealthyChecks.length} resources are unhealthy`);
    }

    console.log(`✅ 検証が完了しました: ${validation.status}`);
    return validation;
  }

  // リソースの検証
  async validateResource(resource) {
    console.log(`🔍 リソースを検証します: ${resource.name}`);

    const check = {
      resource: resource.name,
      healthy: true,
      issues: [],
      metrics: {}
    };

    try {
      // ヘルスチェック
      const health = await this.checkResourceHealth(resource);
      check.healthy = health.healthy;
      check.metrics.health = health;

      // パフォーマンスメトリクス
      const performance = await this.getResourcePerformance(resource);
      check.metrics.performance = performance;

      // セキュリティチェック
      const security = await this.checkResourceSecurity(resource);
      check.metrics.security = security;

      if (!check.healthy) {
        check.issues.push('Resource is unhealthy');
      }

    } catch (error) {
      check.healthy = false;
      check.issues.push(error.message);
    }

    return check;
  }

  // リソースのヘルスチェック
  async checkResourceHealth(resource) {
    // 実際のヘルスチェックロジック（モック実装）
    return {
      healthy: Math.random() > 0.1, // 90%の確率で正常
      responseTime: Math.floor(Math.random() * 1000),
      lastChecked: new Date()
    };
  }

  // リソースのパフォーマンス取得
  async getResourcePerformance(resource) {
    // 実際のパフォーマンス監視ロジック（モック実装）
    return {
      cpu: Math.floor(Math.random() * 100),
      memory: Math.floor(Math.random() * 100),
      network: Math.floor(Math.random() * 1000),
      disk: Math.floor(Math.random() * 100)
    };
  }

  // リソースのセキュリティチェック
  async checkResourceSecurity(resource) {
    // 実際のセキュリティチェックロジック（モック実装）
    return {
      score: Math.floor(Math.random() * 50) + 50, // 50-100のスコア
      vulnerabilities: Math.floor(Math.random() * 3),
      lastScan: new Date()
    };
  }

  // 監視の設定
  async setupMonitoring() {
    console.log('📊 監視を設定します...');

    // メトリクス収集の設定
    const metricsConfig = await this.configureMetrics();

    // アラートルールの設定
    const alertRules = await this.configureAlerts();

    // ダッシュボードの作成
    const dashboards = await this.createDashboards();

    return {
      metrics: metricsConfig,
      alerts: alertRules,
      dashboards
    };
  }

  // メトリクス設定の構成
  async configureMetrics() {
    console.log('📈 メトリクス収集を設定します...');

    const metrics = [
      {
        name: 'CPUUtilization',
        namespace: 'AWS/EC2',
        statistic: 'Average',
        period: 300
      },
      {
        name: 'MemoryUtilization',
        namespace: 'System/Linux',
        statistic: 'Average',
        period: 300
      },
      {
        name: 'ResponseTime',
        namespace: 'Application',
        statistic: 'Average',
        period: 60
      }
    ];

    const config = {
      collection: {
        enabled: true,
        interval: 60,
        metrics
      },
      retention: {
        days: 30
      }
    };

    console.log('✅ メトリクス設定を構成しました');
    return config;
  }

  // アラート設定の構成
  async configureAlerts() {
    console.log('🚨 アラートルールを設定します...');

    const alerts = [
      {
        name: 'HighCPU',
        metric: 'CPUUtilization',
        threshold: 80,
        comparison: 'greater_than',
        duration: 300,
        actions: ['notification', 'autoscale']
      },
      {
        name: 'HighMemory',
        metric: 'MemoryUtilization',
        threshold: 90,
        comparison: 'greater_than',
        duration: 300,
        actions: ['notification']
      },
      {
        name: 'HighErrorRate',
        metric: 'ErrorRate',
        threshold: 5,
        comparison: 'greater_than',
        duration: 300,
        actions: ['notification', 'rollback']
      }
    ];

    const config = {
      enabled: true,
      rules: alerts,
      channels: ['email', 'slack', 'pagerduty']
    };

    console.log('✅ アラートルールを設定しました');
    return config;
  }

  // ダッシュボードの作成
  async createDashboards() {
    console.log('📊 監視ダッシュボードを作成します...');

    const dashboards = [
      {
        name: 'System Overview',
        widgets: [
          {
            type: 'metric',
            title: 'CPU Utilization',
            metrics: ['CPUUtilization']
          },
          {
            type: 'metric',
            title: 'Memory Utilization',
            metrics: ['MemoryUtilization']
          }
        ]
      },
      {
        name: 'Application Performance',
        widgets: [
          {
            type: 'metric',
            title: 'Response Time',
            metrics: ['ResponseTime']
          },
          {
            type: 'metric',
            title: 'Error Rate',
            metrics: ['ErrorRate']
          }
        ]
      }
    ];

    const config = {
      dashboards,
      refreshInterval: 300,
      timeRange: '1h'
    };

    console.log('✅ 監視ダッシュボードを作成しました');
    return config;
  }

  // ロギングの設定
  async setupLogging() {
    console.log('📝 ロギングを設定します...');

    // ログ収集の設定
    const logCollection = await this.configureLogCollection();

    // ログ分析の設定
    const logAnalysis = await this.configureLogAnalysis();

    // ログ保持ポリシーの設定
    const retention = await this.configureLogRetention();

    return {
      collection: logCollection,
      analysis: logAnalysis,
      retention
    };
  }

  // ログ収集の設定
  async configureLogCollection() {
    console.log('📥 ログ収集を設定します...');

    const sources = [
      {
        name: 'application',
        path: '/var/log/application/*.log',
        format: 'json'
      },
      {
        name: 'nginx',
        path: '/var/log/nginx/*.log',
        format: 'combined'
      },
      {
        name: 'system',
        path: '/var/log/syslog',
        format: 'syslog'
      }
    ];

    const config = {
      enabled: true,
      sources,
      shipper: 'fluentd',
      buffer: {
        size: '100MB',
        flushInterval: 5
      }
    };

    console.log('✅ ログ収集を設定しました');
    return config;
  }

  // ログ分析の設定
  async configureLogAnalysis() {
    console.log('🔍 ログ分析を設定します...');

    const pipelines = [
      {
        name: 'error-detection',
        filters: [
          { field: 'level', operator: 'equals', value: 'ERROR' }
        ],
        actions: ['alert', 'aggregate']
      },
      {
        name: 'performance-analysis',
        filters: [
          { field: 'response_time', operator: 'greater_than', value: 1000 }
        ],
        actions: ['aggregate', 'dashboard']
      },
      {
        name: 'security-audit',
        filters: [
          { field: 'event_type', operator: 'equals', value: 'auth_failure' }
        ],
        actions: ['alert', 'correlate']
      }
    ];

    const config = {
      enabled: true,
      pipelines,
      retention: {
        hot: '7d',
        warm: '30d',
        cold: '90d'
      }
    };

    console.log('✅ ログ分析を設定しました');
    return config;
  }

  // ログ保持ポリシーの設定
  async configureLogRetention() {
    console.log('💾 ログ保持ポリシーを設定します...');

    const policies = [
      {
        name: 'application-logs',
        pattern: 'application-*',
        retention: '90d',
        archive: true
      },
      {
        name: 'access-logs',
        pattern: 'access-*',
        retention: '365d',
        archive: true
      },
      {
        name: 'system-logs',
        pattern: 'system-*',
        retention: '30d',
        archive: false
      }
    ];

    const config = {
      policies,
      compression: 'gzip',
      storage: 's3',
      lifecycle: {
        transitionToIA: '30d',
        transitionToGlacier: '90d',
        expiration: '365d'
      }
    };

    console.log('✅ ログ保持ポリシーを設定しました');
    return config;
  }

  // セキュリティの設定
  async setupSecurity() {
    console.log('🔒 セキュリティを設定します...');

    // アイデンティティとアクセス管理
    const iam = await this.configureIAM();

    // ネットワークセキュリティ
    const network = await this.configureNetworkSecurity();

    // データセキュリティ
    const data = await this.configureDataSecurity();

    // コンプライアンスチェック
    const compliance = await this.configureCompliance();

    return {
      iam,
      network,
      data,
      compliance
    };
  }

  // IAMの設定
  async configureIAM() {
    console.log('👤 IAMを設定します...');

    const roles = [
      {
        name: 'EC2InstanceRole',
        policies: ['AmazonSSMManagedInstanceCore', 'CloudWatchAgentServerPolicy']
      },
      {
        name: 'LambdaExecutionRole',
        policies: ['AWSLambdaBasicExecutionRole']
      }
    ];

    const policies = [
      {
        name: 'CustomApplicationPolicy',
        statements: [
          {
            Effect: 'Allow',
            Action: ['logs:*', 'cloudwatch:*'],
            Resource: '*'
          }
        ]
      }
    ];

    const config = {
      roles,
      policies,
      mfa: true,
      passwordPolicy: {
        minLength: 12,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSymbols: true
      }
    };

    console.log('✅ IAMを設定しました');
    return config;
  }

  // ネットワークセキュリティの設定
  async configureNetworkSecurity() {
    console.log('🌐 ネットワークセキュリティを設定します...');

    const securityGroups = [
      {
        name: 'web-sg',
        description: 'Security group for web servers',
        rules: [
          {
            protocol: 'tcp',
            fromPort: 80,
            toPort: 80,
            cidr: '0.0.0.0/0'
          },
          {
            protocol: 'tcp',
            fromPort: 443,
            toPort: 443,
            cidr: '0.0.0.0/0'
          }
        ]
      },
      {
        name: 'app-sg',
        description: 'Security group for application servers',
        rules: [
          {
            protocol: 'tcp',
            fromPort: 8080,
            toPort: 8080,
            source: 'web-sg'
          }
        ]
      }
    ];

    const nacls = [
      {
        name: 'public-nacl',
        entries: [
          { ruleNumber: 100, action: 'allow', cidr: '0.0.0.0/0' }
        ]
      }
    ];

    const config = {
      securityGroups,
      nacls,
      waf: true,
      ddosProtection: true
    };

    console.log('✅ ネットワークセキュリティを設定しました');
    return config;
  }

  // データセキュリティの設定
  async configureDataSecurity() {
    console.log('🔐 データセキュリティを設定します...');

    const encryption = {
      atRest: true,
      inTransit: true,
      keyRotation: true,
      algorithm: 'AES-256'
    };

    const backup = {
      enabled: true,
      frequency: 'daily',
      retention: '30d',
      encryption: true
    };

    const accessControl = {
      principleOfLeastPrivilege: true,
      auditLogging: true,
      sessionTimeout: 3600
    };

    const config = {
      encryption,
      backup,
      accessControl
    };

    console.log('✅ データセキュリティを設定しました');
    return config;
  }

  // コンプライアンスの設定
  async configureCompliance() {
    console.log('📋 コンプライアンスを設定します...');

    const standards = [
      {
        name: 'PCI DSS',
        enabled: true,
        controls: ['encryption', 'access_control', 'audit_logging']
      },
      {
        name: 'SOC 2',
        enabled: true,
        controls: ['security', 'availability', 'confidentiality']
      },
      {
        name: 'GDPR',
        enabled: true,
        controls: ['data_protection', 'consent_management', 'right_to_be_forgotten']
      }
    ];

    const audits = {
      frequency: 'quarterly',
      automated: true,
      reporting: true
    };

    const config = {
      standards,
      audits,
      remediation: {
        autoRemediate: true,
        severityThreshold: 'medium'
      }
    };

    console.log('✅ コンプライアンスを設定しました');
    return config;
  }

  // バックアップの設定
  async setupBackup() {
    console.log('💾 バックアップを設定します...');

    // バックアップ計画の作成
    const backupPlan = await this.createBackupPlan();

    // 復元計画の作成
    const recoveryPlan = await this.createRecoveryPlan();

    // バックアップの検証
    const validation = await this.validateBackupConfiguration(backupPlan);

    return {
      plan: backupPlan,
      recovery: recoveryPlan,
      validation
    };
  }

  // バックアップ計画の作成
  async createBackupPlan() {
    console.log('📅 バックアップ計画を作成します...');

    const resources = [
      {
        type: 'database',
        name: 'main-db',
        frequency: 'daily',
        retention: '30d',
        compression: true,
        encryption: true
      },
      {
        type: 'filesystem',
        name: 'application-data',
        frequency: 'daily',
        retention: '7d',
        compression: true,
        encryption: true
      },
      {
        type: 'configuration',
        name: 'app-config',
        frequency: 'weekly',
        retention: '90d',
        compression: true,
        encryption: true
      }
    ];

    const schedule = {
      timezone: 'UTC',
      maintenanceWindow: '02:00-04:00'
    };

    const config = {
      resources,
      schedule,
      storage: {
        type: 's3',
        redundancy: 'multi-az',
        lifecycle: {
          transitionToIA: '30d',
          transitionToGlacier: '90d',
          expiration: '365d'
        }
      }
    };

    console.log('✅ バックアップ計画を作成しました');
    return config;
  }

  // 復元計画の作成
  async createRecoveryPlan() {
    console.log('🔄 復元計画を作成します...');

    const scenarios = [
      {
        name: 'database-failure',
        rto: '15m',
        rpo: '5m',
        steps: [
          'Identify failure',
          'Restore from latest backup',
          'Validate data integrity',
          'Update DNS records'
        ]
      },
      {
        name: 'region-failure',
        rto: '4h',
        rpo: '1h',
        steps: [
          'Activate DR region',
          'Promote standby database',
          'Update traffic routing',
          'Validate service availability'
        ]
      }
    ];

    const config = {
      scenarios,
      testing: {
        frequency: 'quarterly',
        automated: true
      },
      documentation: {
        runbooks: true,
        contactList: true
      }
    };

    console.log('✅ 復元計画を作成しました');
    return config;
  }

  // バックアップ設定の検証
  async validateBackupConfiguration(backupPlan) {
    console.log('🔍 バックアップ設定を検証します...');

    const validation = {
      status: 'valid',
      checks: [],
      issues: [],
      recommendations: []
    };

    // 各リソースのバックアップ設定を検証
    for (const resource of backupPlan.resources) {
      const check = await this.validateBackupResource(resource);
      validation.checks.push(check);

      if (!check.valid) {
        validation.issues.push(...check.issues);
      }
    }

    // RTO/RPOの検証
    const rtoRpoCheck = this.validateRtoRpo(backupPlan);
    validation.checks.push(rtoRpoCheck);

    if (!rtoRpoCheck.valid) {
      validation.issues.push(...rtoRpoCheck.issues);
    }

    // 全体の健全性判定
    const invalidChecks = validation.checks.filter(c => !c.valid);
    if (invalidChecks.length > 0) {
      validation.status = 'invalid';
    }

    // 推奨事項の生成
    validation.recommendations = this.generateBackupRecommendations(validation);

    console.log(`✅ バックアップ設定の検証が完了しました: ${validation.status}`);
    return validation;
  }

  // バックアップリソースの検証
  async validateBackupResource(resource) {
    const check = {
      resource: resource.name,
      valid: true,
      issues: []
    };

    // バックアップ頻度の検証
    if (!resource.frequency) {
      check.valid = false;
      check.issues.push('Backup frequency not specified');
    }

    // 保持期間の検証
    if (!resource.retention) {
      check.valid = false;
      check.issues.push('Retention period not specified');
    }

    // 暗号化の検証
    if (!resource.encryption) {
      check.valid = false;
      check.issues.push('Encryption not enabled');
    }

    return check;
  }

  // RTO/RPOの検証
  validateRtoRpo(backupPlan) {
    const check = {
      type: 'RTO/RPO',
      valid: true,
      issues: []
    };

    // 実際のRTO/RPO検証ロジックを実装
    // ここでは簡易的なチェック
    const hasAdequateBackup = backupPlan.resources.some(r =>
      r.type === 'database' && r.frequency === 'daily'
    );

    if (!hasAdequateBackup) {
      check.valid = false;
      check.issues.push('Inadequate backup frequency for RPO requirements');
    }

    return check;
  }

  // バックアップ推奨事項の生成
  generateBackupRecommendations(validation) {
    const recommendations = [];

    if (validation.issues.some(issue => issue.includes('frequency'))) {
      recommendations.push('Consider increasing backup frequency for critical resources');
    }

    if (validation.issues.some(issue => issue.includes('encryption'))) {
      recommendations.push('Enable encryption for all backup resources');
    }

    if (validation.issues.some(issue => issue.includes('retention'))) {
      recommendations.push('Define appropriate retention policies for compliance');
    }

    return recommendations;
  }

  // ユーティリティメソッド
  generateDeploymentId() {
    return `deployment_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  }

  generateResourceId() {
    return `res_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  }
}

// 補助クラス
class InfrastructureManager {
  constructor(config) {
    this.config = config;
  }

  // インフラストラクチャ管理のメソッドを実装
}

class MonitoringService {
  constructor(config) {
    this.config = config;
  }

  // 監視サービスのメソッドを実装
}

class LoggingService {
  constructor(config) {
    this.config = config;
  }

  // ロギングサービスのメソッドを実装
}

class SecurityService {
  constructor(config) {
    this.config = config;
  }

  // セキュリティサービスのメソッドを実装
}

class BackupService {
  constructor(config) {
    this.config = config;
  }

  // バックアップサービスのメソッドを実装
}

module.exports = { DevOpsToolchain };
```

:::

## まとめ

このページでは、Claude Codeを活用した高度な技術とプラクティスについて学びました。マイクロサービスアーキテクチャ、CI/CDパイプライン、DevOpsプラクティスなど、現代のソフトウェア開発で必須となる技術を体系的に解説しました。

:::note 要点のまとめ

- マイクロサービスアーキテクチャでスケーラブルなシステムを構築
- CI/CDパイプラインで開発プロセスを自動化・効率化
- DevOpsプラクティスで開発と運用の協業を促進
- Claude Codeを活用した自動化で複雑な設定を簡素化
- 監視、ロギング、セキュリティの包括的な統合
- 自動テストと品質ゲートでリリース品質を保証

:::

## 関連記事

[チーム開発の基礎](../team-development-basics/team-development-basics.md)
[バージョン管理とGit](../version-control/version-control.md)
[コーディング規約](../coding-standards/coding-standards.md)
[実践的なワークフロー](../practical-workflows/practical-workflows.md)