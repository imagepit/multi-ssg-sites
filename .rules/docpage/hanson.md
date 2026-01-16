# ハンズオン手順の書き方のルール

- ハンズオン手順は必ず「`:::step`」〜「`:::`」ブロックで囲むこと。
- 各手順にはタイトルを付け、手順の内容を簡潔に説明する。
  - 手順のタイトルには順序づけのリストで簡潔なタイトルにする。
  - どの場所、ファイルでどんな内容のコーディング、コマンドをするのかを明確に説明する。
- **読者が実際に手を動かすときに必要な情報を全て提供する**。
  - どの場所（パス）で、どのファイルを編集するのか、どのコマンドを実行するのかを明確にする。
    - **ユーザーがすぐ手を動かして試すことができるように、最初の作業手順として「任意の場所（デスクトップなど）でxxxフォルダを作成する」から開始する。**
  - コマンド実行、コード実行、ファイルパスを記述する場合は、必ずコードブロックで囲む。

_ハンズオン手順の書き方_

````markdown
:::step

1. [手順タイトル1]

[手順の説明]

_[コマンドなら「コマンド実行」、コードなら「コード実行」、ファイルならファイルパスを記述する]_

```bash
[コマンドやプログラムなどのコードを記述する場合は次のフォーマットで記述する]
```

[コマンドやコードの説明]

2. [手順タイトル2]

[手順の説明]

:::
````

_ハンズオン部分の具体例_

````markdown
### サーブレットを使ってHello Worldをしてみよう

それでは、学習した内容を踏まえてサーブレットでHello Worldをしてみましょう。

:::step

1. VSCodeでプロジェクトを開く

任意の場所（デスクトップなど）で`sample-j2ee`フォルダを作成し、VSCodeで`sample-j2ee`フォルダを開いてください。

1. サーブレットの追加

`src/main/java/com/example/servlet`に`SecondServlet.java`を作成して下記コードを追加してください。

```java
@WebServlet("/second")
public class SecondServlet extends HttpServlet{
  @Override
  protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    PrintWriter out = resp.getWriter();
    //delstart
    out.print("Hello second page!!");
    //delend
    //addstart
    out.print("<h1>Hello second page!!<h1>");
    //addend
  }
}
```

2. アプリケーションの再起動

次のコマンドを実行してアプリケーションを再起動します。

```bash
./mvnw spring-boot:run
```

3. ブラウザで動作確認

ブラウザを開き、`http://localhost:8080/second`にアクセスします。
見出し項目で「Hello second page!!」と表示されれば成功です。

1. コミット

修正した内容をコミットします。

```bash
git add .
git commit -m "SecondServletを修正"
```

:::

このようにサーブレットを使ってHello Worldを表示することができました。
````