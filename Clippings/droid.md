
https://www.youtube.com/watch?v=oenjvN0hHeE

[00:00](https://www.youtube.com/watch?v=oenjvN0hHeE&t=0) [Music] [Applause] Hi, welcome to another video.
[00:08](https://www.youtube.com/watch?v=oenjvN0hHeE&t=8) So, I have been seeing a lot of talk about Droid and I thought I would try it out as well and share my thoughts on it. It's not open source, but their CLI tool is free and you can set up your own API
[00:22](https://www.youtube.com/watch?v=oenjvN0hHeE&t=22) key and base URL along with other stuff and use it with any model similar to how claude code is not open source, but you can configure it with anything. So there's that. It also gives
[00:37](https://www.youtube.com/watch?v=oenjvN0hHeE&t=37) you a free pro trial without any card required. Similar to cursor or windsurf, which give you 20 million tokens for models like sonnet, GPT5 and things like that. They boast that
[00:52](https://www.youtube.com/watch?v=oenjvN0hHeE&t=52) their agentic performance can make sonnet perform like opus and that's what I've been seeing talked about as well. You can also configure it with any custom API as I said. So, this is just a
[01:06](https://www.youtube.com/watch?v=oenjvN0hHeE&t=66) plus. I'll be talking about the performance through their API, but I'll also show you how you can set it up with something like the GLM coding plan and test the performance with that as well.
[01:19](https://www.youtube.com/watch?v=oenjvN0hHeE&t=79) To use it, you'd have to run this command, and this will get Droid installed. After installing, you'll have to set up an account with Droid, and then you
[01:29](https://www.youtube.com/watch?v=oenjvN0hHeE&t=89) should be good to go. Some things I want to mention before jumping in are that you can make sub aents here as well. It's very similar to how claude code sub aents work and the
[01:41](https://www.youtube.com/watch?v=oenjvN0hHeE&t=101) defining process is also pretty much the same. There's also IDE integration available which is similar to the integration that the earlier claude code IDE extension offered before the native
[01:54](https://www.youtube.com/watch?v=oenjvN0hHeE&t=114) one. It allows you to select chunks of code and quickly reference stuff in the CLI and it is aware of your workspace that way. So that is great. There are also custom
[02:08](https://www.youtube.com/watch?v=oenjvN0hHeE&t=128) droids or sub aents which are also quite similar to how claude's sub aents work. You can also potentially port claude code sub aents here quite easily as it's mostly the same. It also supports the
[02:23](https://www.youtube.com/watch?v=oenjvN0hHeE&t=143) agents markdown specification and you can bring your own provider and key as I mentioned earlier. MCP is also supported. So it seems pretty fleshed out which is really
[02:36](https://www.youtube.com/watch?v=oenjvN0hHeE&t=156) great. Now I have it installed here and you can start it with the Droid command very  easily. But before proceeding let me
[02:45](https://www.youtube.com/watch?v=oenjvN0hHeE&t=165) tell you about Ninja Chat. Ninja Chat is an all-in-one AI platform where for just $11 per month, you get access to top AI models like GPT40, Claude for Sonnet, and Gemini 2.5 Pro, all in one place.
[02:59](https://www.youtube.com/watch?v=oenjvN0hHeE&t=179) I've been using Gemini for quick research. But what's really cool is their AI playground where you can compare responses from different models side by side. Their mind map generator
[03:09](https://www.youtube.com/watch?v=oenjvN0hHeE&t=189) is a gamecher for organizing complex ideas as well. The basic plan gives you 1,000 messages, 30 images, and five videos monthly with higher tiers available. If you need more, use my code
[03:21](https://www.youtube.com/watch?v=oenjvN0hHeE&t=201) king 25 for 25% off any plan or king 40 yearly for 40% off annual subscriptions. Check the link in description to try it yourself. Now, back to the video. After
[03:34](https://www.youtube.com/watch?v=oenjvN0hHeE&t=214) starting, it looks something like this. There's a huge droid branding at the top, which is not something I like. And then at the bottom, you have the prompt box. You can also see the model being
[03:47](https://www.youtube.com/watch?v=oenjvN0hHeE&t=227) used here, which is set 4.5 by default. There are many slash commands here as well. For example, there's the model option to switch between set high, GPT5, codeex, and things like that.
[04:04](https://www.youtube.com/watch?v=oenjvN0hHeE&t=244) You can also see token usage with the cost option and track what's happening. You also have the settings option which allows you to change the model to anything, adjust reasoning effort, and
[04:17](https://www.youtube.com/watch?v=oenjvN0hHeE&t=257) even change the diff display mode, completion bell, cloud sync, custom droids, and other things like that. That's pretty much it. And most of the features Cloud Code has are also
[04:30](https://www.youtube.com/watch?v=oenjvN0hHeE&t=270) available here. Now, let's try to do something with it as well. I'm going to ask it one of my benchmark questions, which is to make me a movie tracker app using Expo. I
[04:43](https://www.youtube.com/watch?v=oenjvN0hHeE&t=283) already have a base Expo app set up, and it just needs to write code. After sending this, it works very similarly to Claude Code. Like, it's really similar. It doesn't ask for
[04:56](https://www.youtube.com/watch?v=oenjvN0hHeE&t=296) approval for edits though, which can be a bummer for some people since Claude Code asks for approval almost every time, which is great, but not available here. Anyway, I tried that and in a bit
[05:11](https://www.youtube.com/watch?v=oenjvN0hHeE&t=311) it was done. The first mistake it made was that it used Radix UI but didn't install the package which led to an error. I installed it and this is what it looks
[05:22](https://www.youtube.com/watch?v=oenjvN0hHeE&t=322) like. It looks fine, but nothing extraordinary. Baseclaw code or open code generates way better projects than this. However, the calendar UI here was good, but still it
[05:36](https://www.youtube.com/watch?v=oenjvN0hHeE&t=336) struggles with incorrect font colors and small stuff like that. So, nothing too extraordinary. Very ordinary generation for sure. Next was the Go Tui calculator. And this
[05:50](https://www.youtube.com/watch?v=oenjvN0hHeE&t=350) wasn't good either. It just doesn't work. It's not comparable to Claude Code, Kilo Code, or Klein because those are simply better and can oneshot this with Sonnet 4.5.
[06:04](https://www.youtube.com/watch?v=oenjvN0hHeE&t=364) Similarly, I asked it to edit a Godo FPS game and add a step counter as well as a life bar that decreases with jumping. And well, it wasn't able to do this correctly either. It did get the bars
[06:18](https://www.youtube.com/watch?v=oenjvN0hHeE&t=378) implemented, but the step counter doesn't work. it almost never oneshots anything. Then I thought maybe it was focused more on large repos. So I tried my open code
[06:29](https://www.youtube.com/watch?v=oenjvN0hHeE&t=389) repo question and it failed that as well. So yeah, it's not great. I'd keep it somewhere below GPT5 codeex which was also bad. So yeah, not very impressive, but I really liked the UI. It felt like
[06:47](https://www.youtube.com/watch?v=oenjvN0hHeE&t=407) claude code but a bit snappier. It seems to do multiple tool calls at once, which felt kind of cool. So, I wanted to try it with GLM 4.6 to see if maybe sonnet was the issue. And I'm glad I did
[07:01](https://www.youtube.com/watch?v=oenjvN0hHeE&t=421) because it works really well with GLM. Pretty similar to Claude Code and the like. That's what I did. I went to the  settings in the CLI, which is located at
[07:13](https://www.youtube.com/watch?v=oenjvN0hHeE&t=433) this path. You can then set up the anthropic API with the GLM coding plan here quite easily. Now you can head back to Droid and
[07:24](https://www.youtube.com/watch?v=oenjvN0hHeE&t=444) you'll see the GLM4.6 model available. You can now use it and it works really well without any issues. It's pretty fast too, which is great.
[07:36](https://www.youtube.com/watch?v=oenjvN0hHeE&t=456) So I first tried the movie tracker app prompt and this is what it generated. It looks kind of cool. It made it light themed and there's also a calendar with a ton of stuff. It's not bad. I'd still
[07:51](https://www.youtube.com/watch?v=oenjvN0hHeE&t=471) prefer Generations from Kilo, but this is decent. The calculator was good as well. Not much better than Clawed Code, but not worse either. The Godo example worked fine, too. And the life bar and
[08:06](https://www.youtube.com/watch?v=oenjvN0hHeE&t=486) step counter also showed up and worked properly this time. The open code repo question still didn't work here. So while this is promising,
[08:18](https://www.youtube.com/watch?v=oenjvN0hHeE&t=498) it doesn't really increase the model's raw capabilities. And I'd still recommend Claude Code, Kilo Code, or similar tools for general coding since Droid doesn't bring anything new.
[08:31](https://www.youtube.com/watch?v=oenjvN0hHeE&t=511) I was seeing a lot of hype about this and the company themselves were claiming their agent is top scoring and revealing some secret sauce when in reality it often performs worse than the
[08:44](https://www.youtube.com/watch?v=oenjvN0hHeE&t=524) competition. So yeah, I just wanted to share my thoughts on that as well. Overall, it's pretty cool. Anyway, share your thoughts
[08:54](https://www.youtube.com/watch?v=oenjvN0hHeE&t=534) below and subscribe to the channel. You can also donate via super thanks option or join the channel as well and get some perks. I'll see you in the next video. Bye.
[09:05](https://www.youtube.com/watch?v=oenjvN0hHeE&t=545) [Music]https://www.youtube.com/watch?v=oenjvN0hHeE

## 要約

### droid.md 要約

- **Droidの概要**: 非OSSだがCLIは無料。任意のAPIキー/エンドポイントを設定可能。MCPやサブエージェント対応。エディタ連携でワークスペース認識、エージェントMarkdown仕様もサポート。

- **UI/操作感**: Claude Codeに近いUIで軽快。設定でモデル変更、推論努力、差分表示など調整可。複数ツールコールが同時に走る印象。

- **標準設定での性能評価**:
  - Expo映画トラッカー: Radix UI未インストールなど初歩的ミス。見た目は普通。
  - Go TUI電卓: 動作せず。
  - Godot FPS改修: ライフバーは動くが歩数カウンタ不正。
  - 大規模リポ質問: 失敗。
  - 総じてGPT5 CodeEX未満で、Claude Code/Kilo Codeに劣る。

- **GLM 4.6に切替後（独自プロバイダ設定）**:
  - 設定ファイルでAnthropic APIスキーム＋GLMコーディングプランを設定し、GLM 4.6選択可能に。
  - 映画トラッカー: まずまず。電卓: 良好。Godot改修: 期待どおり動作。
  - ただし大規模リポ質問は依然弱い。モデルの生性能を底上げする「魔法」ではない。

- **結論/所感**:
  - UIと操作性は好印象かつ高速。
  - ただしエージェント層だけでモデル能力が劇的に向上するわけではない。
  - 一般的なコーディング用途は依然としてClaude CodeやKilo Code等を推奨。DroidはGLM併用時は実用的だが、過度な期待は禁物。