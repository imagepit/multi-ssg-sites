#!/bin/bash

# Hands-on verification script for Python setup
echo "=== LangChain Python環境セットアップ ハンズオン検証 ==="
echo ""

# Step 1: Create project folder (already done by script location)
echo "1. プロジェクトフォルダの確認"
pwd
echo ""

# Step 2: Create virtual environment
echo "2. 仮想環境の作成"
python3 -m venv langchain-env
echo "仮想環境 'langchain-env' を作成しました"
echo ""

# Step 3: Activate virtual environment
echo "3. 仮想環境の有効化"
source langchain-env/bin/activate
echo "仮想環境を有効化しました"
echo ""

# Step 4: Verify virtual environment activation
echo "4. 仮想環境の有効化確認"
which python
echo "pip list:"
pip list
echo ""

# Step 5: Install LangChain packages
echo "5. LangChainパッケージのインストール"
echo "基本的なLangChainのインストール..."
pip install langchain

echo "OpenAI統合パッケージのインストール..."
pip install langchain-openai

echo "追加の便利なパッケージのインストール..."
pip install python-dotenv jupyter
echo ""

# Step 6: Verify installation
echo "6. インストールの確認"
pip list | grep langchain
echo ""

# Step 7: Run basic test
echo "7. 基本動作テストの実行"
python test_langchain.py
echo ""

# Step 8: Create and test requirements.txt
echo "8. 依存関係管理のテスト"
echo "現在の依存関係:"
pip freeze
echo ""

echo "requirements.txtからのインストールテスト用に新しい環境を作成..."
python3 -m venv test-env
source test-env/bin/activate
echo "テスト環境でrequirements.txtからインストール..."
pip install -r requirements.txt
echo ""

echo "テスト環境での動作確認:"
python test_langchain.py
echo ""

echo "=== ハンズオン検証完了 ==="