---
title: "GitLab CLI MCPサーバー | MCP Servers · LobeHub"
source: "https://lobehub.com/ja/mcp/stijnwillems-glab-mcp-server"
author:
  - "[[stijnwillems]]"
published: 2025-10-28
created: 2025-10-31
description: "Model Context Protocol（MCP）サーバーで、glab CLIツールをラップし、AIアシスタントとGitLab間のシームレスな連携を提供します。Python 3.9以上と、認証済みのGitLab CLIツール「glab」が必要です。ローカルのMCP設定ファイル「mcp.json」は、「mcp...."
tags:
  - "clippings"
---
K

[ヘルプが必要ですか？](https://discord.gg/AYFPHvv2jT) [ソースコードを見る](https://github.com/doozMen/gitlab-mcp-swift) [問題を報告する](https://github.com/doozMen/gitlab-mcp-swift/issues)

Model Context Protocol（MCP）サーバーで、glab CLIツールをラップし、AIアシスタントとGitLab間のシームレスな連携を提供します。Python 3.9以上と、認証済みのGitLab CLIツール「glab」が必要です。ローカルのMCP設定ファイル「mcp.json」は、「mcp.json.example」から作成できます。

## GitLab CLI MCP Server

A dynamic Model Context Protocol (MCP) server that provides seamless integration between AI assistants (like Claude) and GitLab through the `glab` CLI tool. This server automatically discovers all available `glab` commands and exposes them as tools.

## Features

- 🔄 **Dynamic Command Discovery**: Automatically discovers and exposes all `glab` commands
- 🔧 **Full GitLab Integration**: Access issues, merge requests, pipelines, repositories, and more
- 🤖 **AI-Friendly**: Structured JSON responses optimized for AI assistants
- 🛡️ **Secure**: Uses your existing `glab` authentication
- 🚀 **Fast**: Direct CLI wrapper with command caching
- 📦 **Easy Setup**: Simple Python package installation
- 🔍 **Self-Documenting**: Built-in help tool for exploring commands

## Available Tools

The server dynamically discovers and exposes all `glab` commands as tools. Common tools include:

- `glab_auth` - Manage authentication
- `glab_issue` - Work with issues
- `glab_mr` - Manage merge requests
- `glab_repo` - Work with repositories
- `glab_ci` - Manage CI/CD pipelines
- `glab_release` - Manage releases
- `glab_api` - Make authenticated API requests
- `glab_help` - Get detailed help for any command
- `glab_raw` - Execute any glab command with full control
- And many more...

### Special Tools

- `glab_discover` - Force re-discovery of available commands
- `glab_help` - Get detailed help for any glab command or subcommand

## Prerequisites

1. **Python 3.9+**
2. **GitLab CLI (`glab`)** installed and authenticated:

## Installation

```
pip install glab-mcp-server
```

### From Source

Shell

```
git clone https://github.com/yourusername/glab-mcp

cd glab-mcp

pip install -e .
```

## Running the Server

**Important**: The MCP server must be running before it can be used by Claude or other AI assistants.

### Start the Server

After installation, run the server using the provided script:

```
python run_server.py
```

This will start the GitLab MCP server and keep it running. You should see output indicating the server is ready:

Plaintext

```
Starting GitLab MCP server...

Server is running. Press Ctrl+C to stop.
```

Keep this terminal window open while using the MCP with Claude.

### Alternative Methods

You can also run the server directly:

Shell

```
# If installed via pip

python -m glab_mcp

# If running from source

python src/glab_mcp/server.py
```

## Configuration

### Local MCP Configuration

If you cloned this repository, you'll need to create your local MCP configuration:

Shell

```
# Create your local MCP configuration from the example template

cp mcp.json.example mcp.json
```

This creates a `mcp.json` file with the correct configuration for your local environment. The `mcp.json` file is gitignored to avoid committing machine-specific paths.

### Claude Desktop

Add to your `claude_desktop_config.json`:

JSON

```
{

  "mcpServers": {

    "glab": {

      "command": "python",

      "args": ["-m", "glab_mcp"],

      "env": {

        "PATH": "/usr/local/bin:/usr/bin:/bin"

      }

    }

  }

}
```

Or if you installed from source:

JSON

```
{

  "mcpServers": {

    "glab": {

      "command": "python",

      "args": ["/path/to/glab-mcp/src/glab_mcp/server.py"]

    }

  }

}
```

### Claude CLI

For the Claude CLI (`claude`), add to your configuration:

Shell

```
# In your shell profile (.bashrc, .zshrc, etc.)

export CLAUDE_MCP_SERVERS='{"glab": {"command": "python", "args": ["-m", "glab_mcp"]}}'
```

## Usage Examples

Once configured, you can ask Claude to:

- "List all open issues in my GitLab project"
- "Create a new merge request for the feature branch"
- "Show me the failing pipelines"
- "Get information about the myorg/myproject repository"

## Development

### Setup Development Environment

Shell

```
# Clone the repository

git clone https://github.com/yourusername/glab-mcp

cd glab-mcp

# Create virtual environment

python -m venv venv

source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install in development mode

pip install -e ".[dev]"
```

### Running Tests

```
pytest
```

### Code Quality

Shell

```
# Format code

black src/

# Sort imports

isort src/

# Type checking

mypy src/
```

### Debug Mode

Enable debug logging:

```
export GLAB_MCP_DEBUG=1
```

## Troubleshooting

### Common Issues

1. **"glab not found" error**
	- Ensure `glab` is installed and in your PATH
	- Add the PATH to your MCP server configuration
2. **Authentication errors**
	- Run `glab auth status` to check authentication
	- Re-authenticate with `glab auth login`
3. **Permission errors**
	- Verify your GitLab token has the necessary permissions
	- Check repository access rights

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/doozMen/gitlab-mcp-swift) file for details.

## Acknowledgments

- Built on the [Model Context Protocol](https://github.com/anthropics/mcp)
- Powered by [GitLab CLI](https://gitlab.com/gitlab-org/cli)

[gitlab](https://lobehub.com/mcp?q=gitlab) [cli](https://lobehub.com/mcp?q=cli) [mcp](https://lobehub.com/mcp?q=mcp) [glab](https://lobehub.com/mcp?q=glab) [python](https://lobehub.com/mcp?q=python) [ai-assistant](https://lobehub.com/mcp?q=ai-assistant) [integration](https://lobehub.com/mcp?q=integration) [developer-tools](https://lobehub.com/mcp?q=developer-tools)

## 関連 MCP サーバー

[もっと見る](https://lobehub.com/mcp?category=developer)[A](https://lobehub.com/mcp/microsoft-playwright-mcp?activeTab=score)

[優良](https://lobehub.com/mcp/microsoft-playwright-mcp?activeTab=score)

[

21

](https://lobehub.com/mcp/microsoft-playwright-mcp?activeTab=schema)

Playwrightを使用したブラウザ自動化機能を提供するModel Context Protocol（MCP）サーバーです。ビジョンモデルを使用せずに構造化されたアクセシビリティスナップショットを通じてWebページと対話できるようにし、LLM（大規模言語モデル）がWebページとインタラクションできるようにします。Node.js 18以上が必要です。設定ファイルのパスは--configオプションで指定可能です。

公開日

開発ツール おすすめ

ローカルサービス

3312

22487## [Context7 MCP - 最新のコードドキュメントをあらゆるプロンプトに](https://lobehub.com/mcp/upstash-context7)

upstash[A](https://lobehub.com/mcp/upstash-context7?activeTab=score)

[優良](https://lobehub.com/mcp/upstash-context7?activeTab=score)

[

2

](https://lobehub.com/mcp/upstash-context7?activeTab=schema)

Node.js用のContext7 MCPサーバーで、ライブラリの最新のバージョン固有のドキュメントとコード例を直接プロンプトに提供します。Node.js >= v18.0.0が必要です。

公開日

開発ツール おすすめ

ハイブリッドサービス

2235

35324## [BlenderMCP - Blender Model Context Protocol統合](https://lobehub.com/mcp/ahujasid-blender-mcp)

ahujasid[A](https://lobehub.com/mcp/ahujasid-blender-mcp?activeTab=score)

[優良](https://lobehub.com/mcp/ahujasid-blender-mcp?activeTab=score)

[

17

1

](https://lobehub.com/mcp/ahujasid-blender-mcp?activeTab=schema)

BlenderMCPは、Model Context Protocol（MCP）を通じてBlenderとClaude AIを接続し、Claudeが直接Blenderと対話・制御できるようにします。この統合により、プロンプト支援による3Dモデリング、シーン作成、操作が可能です。Blender 3.0以上とPython 3.10+が必要です。uvパッケージマネージャーは別途インストールしてください（指示に従って）。

公開日

開発ツール おすすめ

ローカルサービス

666

13973[A](https://lobehub.com/mcp/crystaldba-postgres-mcp?activeTab=score)

[優良](https://lobehub.com/mcp/crystaldba-postgres-mcp?activeTab=score)

[

9

](https://lobehub.com/mcp/crystaldba-postgres-mcp?activeTab=schema)

Postgres MCP Proは、PostgreSQLデータベース向けのオープンソースのModel Context Protocol（MCP）サーバーです。インデックスチューニング、Explainプラン、ヘルスチェック、安全なSQL実行を提供します。DATABASE\_URI環境変数を通じて設定されたPostgreSQLデータベース接続URIが必要です。

公開日

開発ツール おすすめ

ローカルサービス

338

477## [21st.dev Magic AI Agent](https://lobehub.com/mcp/21st-dev-magic-mcp)

21st-dev[B](https://lobehub.com/mcp/21st-dev-magic-mcp?activeTab=score)

[良好](https://lobehub.com/mcp/21st-dev-magic-mcp?activeTab=score)

[

4

](https://lobehub.com/mcp/21st-dev-magic-mcp?activeTab=schema)

21st.devによるMagic MCP UIビルダーです。動作にはhttps://21st.dev/magic/consoleから生成したAPIキーが必要です。

公開日

開発ツール おすすめ

ローカルサービス

190

3854

![🤔](https://registry.npmmirror.com/@lobehub/fluent-emoji-anim-3/latest/files/assets/1f914.webp)

## 必要なMCPサーバーが見つかりませんか？

教えてください。できるだけ早く追加します〜

自己効力感を高め、 創造の楽しみ を取り戻す

豊富なスマートアシスタントエコシステムを探索し、理想のワークフローを簡単に構築しましょう。すべては LobeChat で実現できます。一般ユーザーからプロ開発者まで、LobeChat は誰もが利用できる AI アシスタントの実験場です。