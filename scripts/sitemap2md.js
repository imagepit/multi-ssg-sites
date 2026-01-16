#!/usr/bin/env node

/**
 * sitemap2md.js
 * 
 * sitemap.mdから階層構造を含めたディレクトリ・mdファイルを作成するスクリプト
 * 
 * 使用方法:
 * node sitemap2md.js [sitemap.mdのパス] [出力先ディレクトリ]
 * 
 * 例:
 * node sitemap2md.js ../contents/claude-code/specs/sitemap.md ../contents/claude-code/contents
 */

const fs = require('fs');
const path = require('path');

class SitemapToMarkdown {
  constructor(sitemapPath, outputDir) {
    this.sitemapPath = sitemapPath;
    this.outputDir = outputDir;
    this.createdDirs = new Set();
    this.createdFiles = new Set();
  }

  /**
   * メイン処理を実行
   */
  async run() {
    try {
      console.log('🚀 sitemap2md.js を開始します...');
      console.log(`📁 入力ファイル: ${this.sitemapPath}`);
      console.log(`📁 出力ディレクトリ: ${this.outputDir}`);

      // 入力ファイルの存在確認
      if (!fs.existsSync(this.sitemapPath)) {
        throw new Error(`入力ファイルが見つかりません: ${this.sitemapPath}`);
      }

      // 出力ディレクトリの作成
      this.ensureDirectoryExists(this.outputDir);

      // sitemap.mdの読み込み
      const sitemapContent = fs.readFileSync(this.sitemapPath, 'utf8');
      
      // 階層構造の解析
      const structure = this.parseSitemap(sitemapContent);
      
      // ディレクトリとファイルの作成
      await this.createStructure(structure);

      console.log('✅ 処理が完了しました！');
      console.log(`📊 作成されたディレクトリ数: ${this.createdDirs.size}`);
      console.log(`📊 作成されたファイル数: ${this.createdFiles.size}`);
      
    } catch (error) {
      console.error('❌ エラーが発生しました:', error.message);
      process.exit(1);
    }
  }

  /**
   * sitemap.mdの内容を解析して階層構造を取得
   */
  parseSitemap(content) {
    const lines = content.split('\n');
    const structure = [];
    const stack = []; // 階層のスタック管理

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // 空行やコメント、ヘッダーをスキップ
      if (!line || line.startsWith('#') || !line.startsWith('-')) {
        continue;
      }

      // インデントレベルを計算（スペース2つ = レベル1）
      const indentLevel = (lines[i].length - lines[i].trimStart().length) / 2;
      
      // リンクの解析
      const linkMatch = line.match(/^-\s*\[([^\]]+)\]\(([^)]+)\)/);
      if (!linkMatch) {
        continue;
      }

      const title = linkMatch[1];
      let filePath = linkMatch[2];

      // 拡張子がない場合は.mdを追加
      if (!filePath.includes('.') || filePath.endsWith('/')) {
        filePath += '.md';
      }

      // スタックを現在のレベルに調整
      while (stack.length > indentLevel) {
        stack.pop();
      }

      const item = {
        title,
        path: filePath,
        level: indentLevel,
        parent: stack.length > 0 ? stack[stack.length - 1] : null
      };

      structure.push(item);
      stack.push(item);
    }

    return structure;
  }

  /**
   * 階層構造に基づいてディレクトリとファイルを作成
   */
  async createStructure(structure) {
    for (const item of structure) {
      const fullPath = path.join(this.outputDir, item.path);
      const dirPath = path.dirname(fullPath);
      const fileName = path.basename(fullPath);

      // ディレクトリの作成
      this.ensureDirectoryExists(dirPath);

      // ファイルの作成
      await this.createMarkdownFile(fullPath, item);
    }
  }

  /**
   * ディレクトリが存在しない場合は作成
   */
  ensureDirectoryExists(dirPath) {
    if (!this.createdDirs.has(dirPath) && !fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      this.createdDirs.add(dirPath);
      console.log(`📁 ディレクトリを作成: ${dirPath}`);
    }
  }

  /**
   * Markdownファイルを作成
   */
  async createMarkdownFile(filePath, item) {
    if (this.createdFiles.has(filePath)) {
      return; // 既に作成済み
    }

    const content = this.generateMarkdownContent(item);
    
    try {
      fs.writeFileSync(filePath, content, 'utf8');
      this.createdFiles.add(filePath);
      console.log(`📄 ファイルを作成: ${filePath}`);
    } catch (error) {
      console.error(`❌ ファイル作成エラー: ${filePath}`, error.message);
    }
  }

  /**
   * Markdownファイルの内容を生成
   */
  generateMarkdownContent(item) {
    const content = [];
    
    // frontmatterの生成
    content.push('---');
    content.push(`title: ${item.title}`);
    
    // slugの生成（ファイル名のみ、拡張子なし）
    const fileName = path.basename(item.path, '.md');
    content.push(`slug: ${fileName}`);
    
    // その他の項目は空欄
    content.push('parent:');
    
    // file_pathにディレクトリパスを設定（拡張子なし）
    const dirPath = path.dirname(item.path);
    const filePath = dirPath === '.' ? fileName : `${dirPath}/${fileName}`;
    content.push(`file_path: ${filePath}`);
    
    content.push('target_user:');
    content.push('goal:');
    content.push('status: not_started');
    content.push('post_type: pages');
    content.push('seo_title:');
    content.push('seo_keywords:');
    content.push('seo_description:');
    content.push('handson_overview:');
    content.push('---');
    content.push('');
    
    // 本文部分
    content.push('<!-- コンテンツをここに記述 -->');
    
    return content.join('\n');
  }

  /**
   * 相対パスを計算
   */
  getRelativePath(fromPath, toPath) {
    const fromDir = path.dirname(fromPath);
    const toDir = path.dirname(toPath);
    const toFile = path.basename(toPath);
    
    const relativeDir = path.relative(fromDir, toDir);
    return path.join(relativeDir, toFile).replace(/\\/g, '/');
  }
}

/**
 * コマンドライン引数の処理
 */
function parseArguments() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('使用方法: node sitemap2md.js <sitemap.mdのパス> <出力先ディレクトリ>');
    console.log('');
    console.log('例:');
    console.log('  node sitemap2md.js ../contents/claude-code/specs/sitemap.md ../contents/claude-code/contents');
    process.exit(1);
  }

  const sitemapPath = path.resolve(args[0]);
  const outputDir = path.resolve(args[1]);

  return { sitemapPath, outputDir };
}

/**
 * メイン実行部分
 */
async function main() {
  try {
    const { sitemapPath, outputDir } = parseArguments();
    const converter = new SitemapToMarkdown(sitemapPath, outputDir);
    await converter.run();
  } catch (error) {
    console.error('❌ 実行エラー:', error.message);
    process.exit(1);
  }
}

// スクリプトが直接実行された場合のみmain()を呼び出し
if (require.main === module) {
  main();
}

module.exports = SitemapToMarkdown;
