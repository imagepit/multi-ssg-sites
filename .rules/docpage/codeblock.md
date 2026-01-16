# コードブロック部分の書き方のルール

- 言語指定を明記すること（例：```bash）
- 実行結果や出力も併せて示すこと
- **重要** コードで追加する箇所は`//addstart`と`//addend`で囲む
  - プログラム言語の文法として`#`がコメントの場合でも`//addstart`と`//addend`で囲む。
- **重要** コードで削除する箇所は`//delstart`と`//delend`で囲む
  - プログラム言語の文法として`#`がコメントの場合でも`//delstart`と`//delend`で囲む。
- コードインデントは**2つのスペース**で行うこと

## コマンド実行の書き方

- コマンドやコード例は「```bash」で囲むこと
- 実行するコマンドの説明をわかりやすく記述すること
- コマンドができる限り1コマンド毎にわけてコードブロックで表現すること

_コマンド実行の例_

````markdown

`curl`コマンドで`http://localhost:8080/api/hello`にアクセスします。

_コマンド実行_
```bash
curl http://localhost:8080/api/hello
```
````

## プログラムコードの書き方

- プログラムコードは「```{lang}」で囲むこと
- プログラムコードの説明をわかりやすく記述すること
- プログラムコードのインデントは**2つのスペース**で行うこと
- **重要** コードで追加する箇所は`//addstart`と`//addend`で囲む
  - プログラム言語の文法として`#`がコメントの場合でも`//addstart`と`//addend`で囲む。
- **重要** コードで削除する箇所は`//delstart`と`//delend`で囲む
  - プログラム言語の文法として`#`がコメントの場合でも`//delstart`と`//delend`で囲む。

_プログラムコード 追加の例_

````markdown
`path/to/Sample.java`に以下の内容を追加します。

- [プログラムコードの説明をわかりやすく記述]

_path/to/Sample.java_

```java
public class Sample{
  public static void main(String[] args){
    //addstart
    System.out.println("Hello World!!");
    //addend
  }
}
```
````

_プログラムコード 削除の例_

````markdown
`path/to/Sample.java`に以下の内容を削除します。

- [プログラムコードの説明をわかりやすく記述]

_path/to/Sample.java_

```java
public class Sample{
  public static void main(String[] args){
    //delstart
    System.out.println("Hello World!!");
    //delend
  }
}
```
````

- プログラムファイルを追加・更新する箇所はコードブロックの前にファイルパスを`_`で囲って入れてください。

_プログラムファイルパスの記述例_

````markdown
`src/utils/math.ts`に以下の内容を追加します。

_src/utils/math.ts_

```typescript
// 数学ユーティリティ関数
export function add(a: number, b: number): number {
  return a + b // 修正: 正しく足し算を実装
}

export function multiply(a: number, b: number): number {
  return a * b
}
```
````


私は次のようにコードブロックの直前に強調表現でそのコードに関するタイトルを指定しています。

_src/utils/math.ts_

```typescript
// 数学ユーティリティ関数
export function add(a: number, b: number): number {
  return a + b // 修正: 正しく足し算を実装
}

export function multiply(a: number, b: number): number {
  return a * b
}
```

上記のように記述した場合にその強調指定した箇所が、shikiのコードブロックとしてのタイトルとして表示されるようにしたいです。