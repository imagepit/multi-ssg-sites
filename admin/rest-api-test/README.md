# REST API テストファイル

VSCode REST Client を使用してAPIをテストするためのファイル群です。

## セットアップ

### 1. 拡張機能のインストール

VSCodeで「REST Client」拡張機能をインストールしてください。

- 拡張機能ID: `humao.rest-client`
- [マーケットプレイスリンク](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)

### 2. 環境変数の設定

`.vscode/settings.json` に環境変数が設定されています。
必要に応じて、`adminApiKey` などの値を実際の値に変更してください。

## 環境の切り替え方法

- **Windows**: `Ctrl + Alt + E`
- **Mac**: `Cmd + Alt + E`

上記のショートカットで環境を切り替えることができます。

利用可能な環境:
- `local`: ローカル開発環境 (http://localhost:3200)
- `staging`: ステージング環境
- `production`: 本番環境

## リクエストの送信方法

1. `.http` ファイルを開く
2. 送信したいリクエストの上にある `Send Request` リンクをクリック
   - または、リクエスト行にカーソルを置いて:
   - **Windows**: `Ctrl + Alt + R`
   - **Mac**: `Cmd + Alt + R`

## 注意事項

- 認証が必要なエンドポイントは、先に `auth.http` でログインしてCookieを取得する必要があります
- 管理者APIは `X-Admin-API-Key` ヘッダーが必要です
- 各ファイル内のサンプルID（UUID等）は実際の値に置き換えてください
- プロモーションAPIは `staging` または `test` 環境でのみ利用可能です
