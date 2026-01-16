#!/bin/bash

# Hands-on verification script for Node.js setup
echo "=== LangChain Node.js環境セットアップ ハンズオン検証 ==="
echo ""

# Check if Node.js and npm are available
echo "1. Node.js環境の確認"
echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"
echo ""

# Step 2: Install TypeScript and @types/node (dev dependencies)
echo "2. TypeScript関連ライブラリのインストール"
npm install --save-dev typescript @types/node
echo ""

# Step 3: Initialize TypeScript config (already created)
echo "3. TypeScript設定ファイルの確認"
if [ -f "tsconfig.json" ]; then
    echo "tsconfig.json が存在します"
    cat tsconfig.json
else
    echo "tsconfig.json が見つかりません"
fi
echo ""

# Step 4: Install LangChain packages
echo "4. LangChain関連パッケージのインストール"
npm install @langchain/core @langchain/openai dotenv
echo ""

# Step 5: Check package.json
echo "5. package.jsonの確認"
cat package.json
echo ""

# Step 6: Build TypeScript
echo "6. TypeScriptのビルド"
npm run build
echo ""

# Step 7: Check if build was successful
echo "7. ビルド結果の確認"
if [ -f "dist/index.js" ]; then
    echo "ビルドが成功しました - dist/index.js が生成されました"
    echo "生成されたJavaScriptコード:"
    cat dist/index.js
else
    echo "ビルドに失敗しました - dist/index.js が見つかりません"
fi
echo ""

# Step 8: Check installed packages
echo "8. インストールされたパッケージの確認"
npm list --depth=0
echo ""

echo "=== 注意: API実行にはOpenAI APIキーが必要です ==="
echo "実際のAPIキーを設定しての実行テストはAPIキーの設定後に行ってください"
echo ""

echo "=== ハンズオン検証完了 ==="