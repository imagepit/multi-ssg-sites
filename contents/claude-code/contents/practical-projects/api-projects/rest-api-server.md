---
title: "REST APIサーバー"
description: "Claude Codeを活用してREST APIサーバーを構築する実践的なガイドです。Node.js、Express、MongoDBを使用した堅牢なAPI開発手法を学びます。"
status: "published"
priority: "high"
tags: ["REST API", "Node.js", "Express", "MongoDB", "認証"]
author: "Claude"
category: "practical-projects"
---

# REST APIサーバー

Claude Codeを活用したREST APIサーバー開発の実践的なガイドです。このプロジェクトでは、Node.js、Express、MongoDBを使用して、本番環境で使用できる堅牢なAPIサーバーを構築します。

## プロジェクト概要

### 構築するAPIの機能

- ユーザー管理（登録、認証、認可）
- 認証・認可システム（JWTトークン）
- データのCRUD操作
- レート制限とセキュリティ対策
- APIドキュメンテーション
- テストとデプロイ

### 使用技術

- **ランタイム**: Node.js 18+
- **フレームワーク**: Express.js
- **データベース**: MongoDB
- **認証**: JWT (JSON Web Tokens)
- **バリデーション**: Joi
- **ドキュメンテーション**: Swagger/OpenAPI
- **テスト**: Jest, Supertest
- **デプロイ**: Docker, Vercel

### 前提条件

:::note 前提条件

- Node.js 18以上がインストールされている
- MongoDBアカウント（Atlas推奨）
- Gitの基本操作ができる
- REST APIの基本概念を理解している

:::

## プロジェクトセットアップ

### 1. プロジェクトの初期化

:::step

1. プロジェクトディレクトリの作成

```bash
mkdir rest-api-server
cd rest-api-server
```

2. Node.jsプロジェクトの初期化

```bash
npm init -y
```

3. 必要なパッケージのインストール

```bash
# 本番環境パッケージ
npm install express mongoose jsonwebtoken bcryptjs cors helmet morgan dotenv express-rate-limit joi

# 開発環境パッケージ
npm install --save-dev typescript @types/node @types/express @types/jsonwebtoken @types/bcryptjs @types/cors @types/morgan @types/jest jest supertest ts-node nodemon prettier eslint
```

4. TypeScript設定の作成

_tsconfig.json_

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

:::

### 2. 基本的なExpressサーバーの構築

:::step

1. 基本的なサーバーファイルの作成

_src/server.ts_

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// ルートのインポート
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import apiRoutes from './routes/api';

// ミドルウェアのインポート
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';

// 環境変数の読み込み
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ミドルウェアの設定
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// レート制限
app.use(rateLimiter);

// ルートの設定
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api', apiRoutes);

// ヘルスチェックエンドポイント
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// エラーハンドリングミドルウェア
app.use(errorHandler);

// データベース接続
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rest-api-server');
    console.log('MongoDBに接続しました');
  } catch (error) {
    console.error('MongoDB接続エラー:', error);
    process.exit(1);
  }
};

// サーバーの起動
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`サーバーがポート${PORT}で起動しました`);
  });
};

startServer().catch(console.error);

export default app;
```

2. 環境変数ファイルの作成

_.env.example_

```bash
# サーバー設定
PORT=3000
NODE_ENV=development

# データベース設定
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rest-api-server?retryWrites=true&w=majority

# JWT設定
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# レート制限設定
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# APIキー設定（外部API用）
API_KEY_EXTERNAL=your-external-api-key
```

_.env_

```bash
# 開発環境用の設定をコピー
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/rest-api-server
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRE=7d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

:::

### 3. データモデルの作成

:::step

1. ユーザーモデルの作成

_src/models/User.ts_

```typescript
import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: 'user' | 'admin';
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, '有効なメールアドレスを入力してください']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  avatar: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// パスワードのハッシュ化
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// パスワード比較メソッド
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// インデックスの作成
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ createdAt: -1 });

export const User = mongoose.model<IUser>('User', userSchema);
```

2. APIデータモデルの作成

_src/models/ApiData.ts_

```typescript
import mongoose, { Document, Schema } from 'mongoose';

export interface IApiData extends Document {
  title: string;
  description: string;
  content: string;
  tags: string[];
  category: string;
  author: mongoose.Types.ObjectId;
  status: 'draft' | 'published' | 'archived';
  views: number;
  likes: number;
  metadata: {
    source?: string;
    language?: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
  };
  createdAt: Date;
  updatedAt: Date;
}

const apiDataSchema = new Schema<IApiData>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  content: {
    type: String,
    required: true
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 50
  }],
  category: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  metadata: {
    source: String,
    language: {
      type: String,
      default: 'ja'
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    }
  }
}, {
  timestamps: true
});

// インデックスの作成
apiDataSchema.index({ title: 'text', description: 'text', content: 'text' });
apiDataSchema.index({ category: 1, status: 1 });
apiDataSchema.index({ author: 1, createdAt: -1 });
apiDataSchema.index({ tags: 1 });
apiDataSchema.index({ 'metadata.difficulty': 1 });

export const ApiData = mongoose.model<IApiData>('ApiData', apiDataSchema);
```

:::

### 4. 認証システムの実装

:::step

1. 認証ミドルウェアの作成

_src/middleware/auth.ts_

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

interface JwtPayload {
  userId: string;
  username: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
        role: string;
      };
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'アクセストークンが必要です' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    // ユーザーの存在確認
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({ error: '無効なトークンです' });
    }

    req.user = {
      id: user.id,
      username: user.username,
      role: user.role
    };

    next();
  } catch (error) {
    res.status(401).json({ error: '無効なトークンです' });
  }
};

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: '認証が必要です' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'アクセス権限がありません' });
    }

    next();
  };
};
```

2. 認証ルートの作成

_src/routes/auth.ts_

```typescript
import express from 'express';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import { User } from '../models/User';

const router = express.Router();

// バリデーションスキーマ
const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().max(50).required(),
  lastName: Joi.string().max(50).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// ユーザー登録
router.post('/register', async (req, res) => {
  try {
    // バリデーション
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { username, email, password, firstName, lastName } = value;

    // ユーザーの存在確認
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'メールアドレスまたはユーザー名は既に使用されています'
      });
    }

    // ユーザーの作成
    const user = new User({
      username,
      email,
      password,
      firstName,
      lastName
    });

    await user.save();

    // JWTトークンの生成
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    // 最終ログイン時間の更新
    user.lastLogin = new Date();
    await user.save();

    res.status(201).json({
      message: 'ユーザーが正常に登録されました',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('登録エラー:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// ログイン
router.post('/login', async (req, res) => {
  try {
    // バリデーション
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password } = value;

    // ユーザーの検索
    const user = await User.findOne({ email });
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'メールアドレスまたはパスワードが正しくありません' });
    }

    // パスワードの検証
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'メールアドレスまたはパスワードが正しくありません' });
    }

    // JWTトークンの生成
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    // 最終ログイン時間の更新
    user.lastLogin = new Date();
    await user.save();

    res.json({
      message: 'ログインに成功しました',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('ログインエラー:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// トークンの検証
router.get('/verify', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'トークンが必要です' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const user = await User.findById(decoded.userId).select('-password');

    if (!user || !user.isActive) {
      return res.status(401).json({ error: '無効なトークンです' });
    }

    res.json({
      valid: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    res.status(401).json({
      valid: false,
      error: '無効なトークンです'
    });
  }
});

export default router;
```

:::

### 5. APIルートの実装

:::step

1. APIルートの作成

_src/routes/api.ts_

```typescript
import express from 'express';
import Joi from 'joi';
import { ApiData } from '../models/ApiData';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// バリデーションスキーマ
const createDataSchema = Joi.object({
  title: Joi.string().max(200).required(),
  description: Joi.string().max(500).required(),
  content: Joi.string().required(),
  tags: Joi.array().items(Joi.string().max(50)),
  category: Joi.string().max(100).required(),
  metadata: Joi.object({
    source: Joi.string().optional(),
    language: Joi.string().default('ja'),
    difficulty: Joi.string().valid('beginner', 'intermediate', 'advanced').default('beginner')
  }).optional()
});

const updateDataSchema = Joi.object({
  title: Joi.string().max(200),
  description: Joi.string().max(500),
  content: Joi.string(),
  tags: Joi.array().items(Joi.string().max(50)),
  category: Joi.string().max(100),
  status: Joi.string().valid('draft', 'published', 'archived'),
  metadata: Joi.object({
    source: Joi.string().optional(),
    language: Joi.string(),
    difficulty: Joi.string().valid('beginner', 'intermediate', 'advanced')
  }).optional()
});

// データの取得（パブリック）
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      tags,
      difficulty,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query: any = { status: 'published' };

    // カテゴリフィルター
    if (category) {
      query.category = category;
    }

    // タグフィルター
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      query.tags = { $in: tagArray };
    }

    // 難易度フィルター
    if (difficulty) {
      query['metadata.difficulty'] = difficulty;
    }

    // 検索
    if (search) {
      query.$text = { $search: search as string };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    const [data, total] = await Promise.all([
      ApiData.find(query)
        .populate('author', 'username firstName lastName')
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      ApiData.countDocuments(query)
    ]);

    res.json({
      data,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('データ取得エラー:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// 特定のデータ取得（パブリック）
router.get('/:id', async (req, res) => {
  try {
    const data = await ApiData.findById(req.params.id)
      .populate('author', 'username firstName lastName')
      .lean();

    if (!data) {
      return res.status(404).json({ error: 'データが見つかりません' });
    }

    if (data.status !== 'published') {
      return res.status(403).json({ error: 'このデータは公開されていません' });
    }

    // 閲覧数の増加
    await ApiData.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    res.json(data);
  } catch (error) {
    console.error('データ取得エラー:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// データの作成（認証必須）
router.post('/', authenticate, async (req, res) => {
  try {
    const { error, value } = createDataSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const newData = new ApiData({
      ...value,
      author: req.user!.id
    });

    await newData.save();

    const populatedData = await ApiData.findById(newData._id)
      .populate('author', 'username firstName lastName')
      .lean();

    res.status(201).json({
      message: 'データが正常に作成されました',
      data: populatedData
    });
  } catch (error) {
    console.error('データ作成エラー:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// データの更新（認証必須）
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { error, value } = updateDataSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const existingData = await ApiData.findById(req.params.id);
    if (!existingData) {
      return res.status(404).json({ error: 'データが見つかりません' });
    }

    // 権限チェック（作者本人のみ更新可能）
    if (existingData.author.toString() !== req.user!.id && req.user!.role !== 'admin') {
      return res.status(403).json({ error: '更新権限がありません' });
    }

    const updatedData = await ApiData.findByIdAndUpdate(
      req.params.id,
      value,
      { new: true, runValidators: true }
    ).populate('author', 'username firstName lastName');

    res.json({
      message: 'データが正常に更新されました',
      data: updatedData
    });
  } catch (error) {
    console.error('データ更新エラー:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// データの削除（認証必須）
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const data = await ApiData.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ error: 'データが見つかりません' });
    }

    // 権限チェック
    if (data.author.toString() !== req.user!.id && req.user!.role !== 'admin') {
      return res.status(403).json({ error: '削除権限がありません' });
    }

    await ApiData.findByIdAndDelete(req.params.id);

    res.json({ message: 'データが正常に削除されました' });
  } catch (error) {
    console.error('データ削除エラー:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// いいね機能
router.post('/:id/like', authenticate, async (req, res) => {
  try {
    const data = await ApiData.findById(req.params.id);
    if (!data) {
      return res.status(404).json({ error: 'データが見つかりません' });
    }

    if (data.status !== 'published') {
      return res.status(403).json({ error: 'このデータは公開されていません' });
    }

    await ApiData.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } });

    res.json({ message: 'いいねが追加されました' });
  } catch (error) {
    console.error('いいねエラー:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

export default router;
```

2. ユーザールートの作成

_src/routes/users.ts_

```typescript
import express from 'express';
import { User } from '../models/User';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// ユーザープロフィール取得
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user!.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'ユーザーが見つかりません' });
    }

    res.json(user);
  } catch (error) {
    console.error('プロフィール取得エラー:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// ユーザープロフィール更新
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { firstName, lastName, avatar } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user!.id,
      { firstName, lastName, avatar },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'プロフィールが更新されました',
      user: updatedUser
    });
  } catch (error) {
    console.error('プロフィール更新エラー:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// パスワード変更
router.put('/password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user!.id);
    if (!user) {
      return res.status(404).json({ error: 'ユーザーが見つかりません' });
    }

    // 現在のパスワードの検証
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ error: '現在のパスワードが正しくありません' });
    }

    // 新しいパスワードの設定
    user.password = newPassword;
    await user.save();

    res.json({ message: 'パスワードが変更されました' });
  } catch (error) {
    console.error('パスワード変更エラー:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// ユーザーのデータ一覧取得
router.get('/my-data', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query: any = { author: req.user!.id };
    if (status) {
      query.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [data, total] = await Promise.all([
      ApiData.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      ApiData.countDocuments(query)
    ]);

    res.json({
      data,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('データ取得エラー:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

// 管理者用：全ユーザー一覧
router.get('/', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      User.find()
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      User.countDocuments()
    ]);

    res.json({
      users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('ユーザー取得エラー:', error);
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

export default router;
```

:::

### 6. ミドルウェアの実装

:::step

1. エラーハンドリングミドルウェア

_src/middleware/errorHandler.ts_

```typescript
import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'サーバーエラーが発生しました';

  // 開発環境では詳細なエラー情報を返す
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', error);
    res.status(statusCode).json({
      error: message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  } else {
    // 本番環境では最小限の情報のみ返す
    res.status(statusCode).json({
      error: statusCode === 500 ? 'サーバーエラーが発生しました' : message
    });
  }
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const createError = (message: string, statusCode: number = 500): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};
```

2. レート制限ミドルウェア

_src/middleware/rateLimiter.ts_

```typescript
import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

// 一般的なレート制限
export const rateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15分
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // 各IPあたりのリクエスト数
  message: {
    error: 'リクエスト数が制限を超えました。しばらくしてから再度お試しください。'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 認証エンドポイント用の厳しいレート制限
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: 5, // 各IPあたりのログイン試行回数
  message: {
    error: 'ログイン試行回数が制限を超えました。15分後に再度お試しください。'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// API作成用のレート制限
export const apiCreationRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1時間
  max: 10, // 各ユーザーあたりのAPI作成回数
  message: {
    error: 'API作成回数が制限を超えました。1時間後に再度お試しください。'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
```

3. バリデーションミドルウェア

_src/middleware/validation.ts_

```typescript
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({
        error: 'バリデーションエラー',
        details: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }

    next();
  };
};
```

:::

### 7. テストの実装

:::step

1. テスト設定ファイル

_jest.config.js_

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/server.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts']
};
```

2. テストセットアップファイル

_tests/setup.ts_

```typescript
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});
```

3. 認証テスト

_tests/auth.test.ts_

```typescript
import request from 'supertest';
import app from '../src/server';
import { User } from '../src/models/User';

describe('Authentication Endpoints', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should not register user with existing email', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      const response = await request(app)
        .post('/api/auth/register')
        .send({ ...userData, username: 'testuser2' })
        .expect(400);

      expect(response.body.error).toContain('既に使用されています');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData);
    });

    it('should login with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(loginData.email);
    });

    it('should not login with invalid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.error).toContain('正しくありません');
    });
  });
});
```

:::

### 8. デプロイ準備

:::step

1. Dockerfileの作成

_Dockerfile_

```dockerfile
# マルチステージビルド
# ステージ1: ビルド
FROM node:18-alpine AS builder

WORKDIR /app

# パッケージファイルのコピー
COPY package*.json ./

# 依存関係のインストール
RUN npm ci --only=production

# ソースコードのコピー
COPY . .

# TypeScriptのビルド
RUN npm run build

# ステージ2: 実行
FROM node:18-alpine AS runner

WORKDIR /app

# ユーザーの作成
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# ビルド成果物のコピー
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./

# ポートの公開
EXPOSE 3000

# ヘルスチェック
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# アプリケーションの起動
USER nodejs
CMD ["node", "dist/server.js"]
```

2. Docker Composeの作成

_docker-compose.yml_

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongodb:27017/rest-api-server
      - JWT_SECRET=your-production-secret-key
      - PORT=3000
    depends_on:
      - mongodb
    restart: unless-stopped

  mongodb:
    image: mongo:6
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_DATABASE=rest-api-server
    volumes:
      - mongodb_data:/data/db
    restart: unless-stopped

volumes:
  mongodb_data:
```

3. Vercelデプロイ設定

_vercel.json_

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/server.ts"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

4. 起動スクリプトの更新

_package.json_（scriptsセクション）

```json
{
  "scripts": {
    "start": "node dist/server.js",
    "dev": "nodemon src/server.ts",
    "build": "tsc",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src --ext .ts",
    "lint:fix": "eslint src --ext .ts --fix",
    "typecheck": "tsc --noEmit",
    "docker:build": "docker build -t rest-api-server .",
    "docker:run": "docker run -p 3000:3000 rest-api-server",
    "docker:compose": "docker-compose up --build",
    "deploy": "vercel --prod"
  }
}
```

:::

### 9. APIドキュメンテーション

:::step

1. Swagger設定

_src/swagger.ts_

```typescript
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'REST API Server',
      version: '1.0.0',
      description: 'Claude Codeで構築したREST APIサーバー',
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production'
          ? 'https://your-api-domain.com'
          : 'http://localhost:3000',
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts'],
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };
```

2. サーバーへのSwagger統合

_src/server.ts_（ミドルウェアの追加）

```typescript
// 既存のインポートに追加
import { swaggerUi, specs } from './swagger';

// ルートの設定前に追加
if (process.env.NODE_ENV === 'development') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}
```

:::

## 実行とテスト

### 開発環境での実行

```bash
# 開発サーバーの起動
npm run dev

# 別のターミナルでテストの実行
npm test

# カバレッジレポートの表示
npm run test:coverage
```

### 本番環境でのデプロイ

```bash
# Dockerを使用したデプロイ
npm run docker:compose

# Vercelへのデプロイ
npm run deploy
```

### APIのテスト

```bash
# ユーザー登録
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123","firstName":"Test","lastName":"User"}'

# ログイン
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# APIデータの取得（公開エンドポイント）
curl http://localhost:3000/api

# APIデータの作成（認証必須）
curl -X POST http://localhost:3000/api \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title":"テストデータ","description":"テスト用のデータです","content":"これはテストデータの内容です","category":"テスト"}'
```

## まとめ

このプロジェクトでは、Claude Codeを活用して本番環境で使用できるREST APIサーバーを構築しました。

:::note 主要な実装内容

- **認証システム**: JWTベースの認証と認可
- **データベース**: MongoDBとの連携とデータモデリング
- **セキュリティ**: レート制限、バリデーション、エラーハンドリング
- **テスト**: Jestを用いた包括的なテストスイート
- **デプロイ**: DockerとVercel対応
- **ドキュメンテーション**: Swagger/OpenAPI統合

:::

### 学習ポイント

- REST APIのベストプラクティス
- 認証・認可の実装方法
- データベース設計とモデリング
- セキュリティ対策の重要性
- テスト駆動開発の実践
- コンテナ化とデプロイ戦略

### 次のステップ

- WebSocketによるリアルタイム通信の追加
- キャッシュ戦略の実装（Redis）
- ファイルアップロード機能の追加
- APIモニタリングとロギングの強化
- CI/CDパイプラインの構築

## 関連記事

[To-Doリストアプリ](../web-app-projects/todo-app.md)
[天気アプリ](../web-app-projects/weather-app.md)
[データ分析ダッシュボード](../data-analysis-projects/data-dashboard.md)