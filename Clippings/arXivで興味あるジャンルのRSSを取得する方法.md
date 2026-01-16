---
title: "arXivで興味あるジャンルのRSSを取得する方法"
source: "https://yoshikiito.net/blog/archives/get-rss-arxiv/"
author:
  - "[[テストウフ]]"
published: 2025-04-25T23:59:34JST
created: 2025-10-08
description: "arXiv.org e-Print archiveのRSSがFeedlyでうまく取得できないなーと思っていたのですが、ちゃんとドキュメントが存在していました。RSSフィード - arXiv情報上記見ていただければ早いのですが、自分が読み取ったTipsをここに書いておきます。ジャンル毎のページをもとにRSSを取得するたとえばProgramming Languagesのページ（https://arxiv.org/list/cs.PL/recent）にアクセスすると、Programming Languagesジャンルの最新登録論文がリストで表示されます。この画面上だととくにRSSやAtom関連の購読ボタンなどは出ていないので、URLを自力で変換してあげる必要がありそうです。変換といっても簡単で、通常：https://arxiv.org/list/cs.PL/recentRSS：https://rss.arxiv.org/rss/cs.PLです。arxivの前にrssをつけ、listをrssに変えます。そして末尾のrecentを除きます。これで、以下のようなRSSフィードが取得できるので、あとは上記　https://rss.arxiv.org/rss/cs.PL　をFeedlyなどに登録すればOKです。複数ジャンルを1つのフィードで購読するRSSの末尾にあるcs.PLなど、ジャンルを表す部分を+でつなぐことで、複数ジャンルの論文情報をひとつのフィードで取得できます。たとえばhttps://rss.arxiv.org/rss/cs.AI+cs.FL+cs.LO+cs.LG+cs.SE+cs.PLのような形です。"
tags:
  - "clippings"
---
[arXiv.org e-Print archive](https://arxiv.org/) のRSSがFeedlyでうまく取得できないなーと思っていたのですが、ちゃんとドキュメントが存在していました。

[RSSフィード - arXiv情報](https://info.arxiv.org/help/rss.html)

上記見ていただければ早いのですが、自分が読み取ったTipsをここに書いておきます。

## ジャンル毎のページをもとにRSSを取得する

たとえばProgramming Languagesのページ（https://arxiv.org/list/cs.PL/recent）にアクセスすると、Programming Languagesジャンルの最新登録論文がリストで表示されます。

[![Image from Gyazo](https://i.gyazo.com/7dd3b171c9824abb5aaa61d32efc3b52.png)](https://gyazo.com/7dd3b171c9824abb5aaa61d32efc3b52)

この画面上だととくにRSSやAtom関連の購読ボタンなどは出ていないので、URLを自力で変換してあげる必要がありそうです。

変換といっても簡単で、

- 通常：https://arxiv.org/list/cs.PL/recent
- RSS：https://rss.arxiv.org/rss/cs.PL

です。

arxivの前に `rss` をつけ、 `list` を `rss` に変えます。そして末尾のrecentを除きます。

これで、以下のようなRSSフィードが取得できるので、あとは上記　https://rss.arxiv.org/rss/cs.PL　をFeedlyなどに登録すればOKです。

[![Image from Gyazo](https://i.gyazo.com/da88ec650128bc861a65f2432561338b.png)](https://gyazo.com/da88ec650128bc861a65f2432561338b)

## 複数ジャンルを1つのフィードで購読する

RSSの末尾にある `cs.PL` など、ジャンルを表す部分を `+` でつなぐことで、複数ジャンルの論文情報をひとつのフィードで取得できます。

たとえば

[https://rss.arxiv.org/rss/cs.AI+cs.FL+cs.LO+cs.LG+cs.SE+cs.PL](https://rss.arxiv.org/rss/cs.AI+cs.FL+cs.LO+cs.LG+cs.SE+cs.PL)

のような形です。