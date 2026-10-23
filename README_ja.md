<div align="center">

# pondok-ai

**コマンドひとつで、自分だけのプライベート AI スタックをローカルで動かす。**

ローカル LLM、チャット UI、ベクトル検索、OpenAI 互換 API を Docker Compose でまとめて構成します。

[![npm version](https://img.shields.io/npm/v/pondok-ai?logo=npm&color=cb3837)](https://www.npmjs.com/package/pondok-ai)
[![CI](https://github.com/rasidi3112/pondok-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/rasidi3112/pondok-ai/actions/workflows/ci.yml)
[![Node.js](https://img.shields.io/node/v/pondok-ai?logo=node.js&logoColor=white&color=339933)](https://nodejs.org)
[![Docker Compose v2](https://img.shields.io/badge/Docker%20Compose-v2-2496ED?logo=docker&logoColor=white)](https://docs.docker.com/compose/)
[![License: MIT](https://img.shields.io/github/license/rasidi3112/pondok-ai?color=blue)](./LICENSE)

[English](README.md) · [Bahasa Indonesia](README_id.md) · [한국어](README_ko.md) · [العربية](README_ar.md) · [Español](README_es.md) · [中文](README_zh.md) · [Français](README_fr.md) · **日本語** · [Deutsch](README_de.md) · [Português](README_pt.md) · [Русский](README_ru.md) · [हिन्दी](README_hi.md) · [Türkçe](README_tr.md) · [Italiano](README_it.md) · [Tiếng Việt](README_vi.md) · [Polski](README_pl.md) · [Bahasa Melayu](README_ms.md)

<sub>翻訳は機械生成のため、英語版 README より内容が古い場合があります。</sub>

<br>

<a href="docs/demo/demo.mp4">
  <img src="docs/demo/demo.gif" alt="pondok-ai のデモ：init、up のあと Open WebUI で gemma3:1b とチャット" width="100%">
</a>

<sub>空のフォルダからローカルモデルの応答まで。ネイティブ Ollama（Metal GPU）を使う Apple M1 の Mac で、イメージとモデルを事前に取得した状態で収録しています。Open WebUI の起動待ちは早送りし、画面上に表示しています。この Mac は空きディスクが 10 GB 未満だったため、<code>init</code> は <code>--force</code> 付きで実行しています。<br>
<a href="docs/demo/demo.mp4"><b>▶ 1080p の動画を見る</b></a></sub>

<br>

[クイックスタート](#クイックスタート) · [機能](#機能) · [スクリーンショット](#スクリーンショット) · [プリセット](#プリセット) · [CLI](#cli-コマンド) · [API ゲートウェイ](#api-ゲートウェイ) · [ドキュメント](#ドキュメント)

</div>

---

## 概要

`pondok-ai` は、完全でプライベートな AI 環境を手元のマシンで立ち上げる CLI です。ハードウェアに合わせた Docker Compose スタックを生成し、ヘルスチェック付きで起動し、モデルの管理も行います。

プロンプト、チャット、埋め込みはすべてあなたのマシン上で処理されます。コンテナイメージとモデルの重みを初めて取得する際にはインターネット接続が必要です。

```bash
npx pondok-ai init
npx pondok-ai up
```

<sub>Pondok はインドネシア語で小さな小屋や宿を意味します。このパッケージは以前 `local-ai-stack` という名前で公開されていました。</sub>

## 機能

| | |
|---|---|
| **ローカル処理** | プロンプト、チャット、埋め込み、推論はすべて手元のハードウェアで実行されます。 |
| **ハードウェア検出** | OS、アーキテクチャ、RAM、ディスク、GPU（Apple Metal、NVIDIA CUDA）を検出し、適したプリセットとモデルを提案します。 |
| **モジュール式プリセット** | 軽量なチャット UI（`minimal`）から RAG スタック（`standard`）、自動化パイプライン（`full`）まで拡張できます。 |
| **OpenAI 互換ゲートウェイ** | OpenAI SDK や LangChain の接続先を `http://localhost:8000/v1` に変えるだけで、コードを書き換える必要はありません。 |
| **モデルマネージャー** | モデルの取得、一覧表示、確認、削除ができ、ダウンロードの前には毎回 RAM とディスクの安全チェックを行います。 |
| **診断** | `pondok-ai doctor` が Docker デーモン、ポート、RAM、ディスク、GPU を事前にチェックし、問題を未然に防ぎます。 |
| **バックアップ** | 設定とデータボリュームを SHA-256 の整合性チェック付きでバックアップ・復元できます。 |

## クイックスタート

**前提条件:** Node.js 22 以降、Docker、Docker Compose v2。

**1. スタックを初期化する**

```bash
# ハードウェア検出付きの対話型セットアップウィザード
npx pondok-ai init

# または、プリセットを指定して非対話で実行
npx pondok-ai init --preset standard --yes
```

**2. サービスを起動する**（すべてのサービスが正常になるまで待機します）

```bash
npx pondok-ai up
```

初回起動では Open WebUI が補助モデルをダウンロードするため、数分かかることがあります。ネイティブ Ollama を使う Mac では、Ollama が起動していなければ `up` が起動します。モデルがまだインストールされていない場合は、`up` が RAM に合ったモデルを案内します。

**3. モデルを選んでインストールする**

```bash
# RAM、VRAM、空きディスク容量に基づくおすすめ
npx pondok-ai model recommend

# メモリとディスクを事前チェックしてからインストール
npx pondok-ai model install llama3.2:3b
```

起動したら、スタックを開きます。

| サービス | URL |
|---|---|
| Open WebUI | [http://localhost:3000](http://localhost:3000) |
| API ゲートウェイ | [http://localhost:8000](http://localhost:8000) |
| Ollama | [http://localhost:11434](http://localhost:11434) |
| Qdrant | [http://localhost:6333/dashboard](http://localhost:6333/dashboard) *（ポートを公開している場合）* |

<details>
<summary><b>インストールスクリプト</b>（実験的、CI の対象外）</summary>

**macOS と Linux**

```bash
curl -fsSL https://raw.githubusercontent.com/rasidi3112/pondok-ai/main/scripts/install.sh | bash
```

**Windows (PowerShell)**

```powershell
iwr -useb https://raw.githubusercontent.com/rasidi3112/pondok-ai/main/scripts/install.ps1 | iex
```

</details>

## スクリーンショット

<p align="center">
  <img src="docs/demo/screenshots/chat.png" alt="ローカルで動作する gemma3:1b を使って質問に答える Open WebUI" width="100%">
  <br>
  <sub>Apple M1 の Mac 上のネイティブ Ollama が提供する <code>gemma3:1b</code> と Open WebUI でチャットしている様子。</sub>
</p>

<table>
  <tr>
    <td width="50%"><img src="docs/demo/screenshots/doctor.png" alt="pondok-ai doctor の出力：システム情報、Docker の状態、要件チェック"></td>
    <td width="50%"><img src="docs/demo/screenshots/model-recommend.png" alt="pondok-ai model recommend の出力：このマシンで動くモデル、ぎりぎり動くモデル、動かないモデル"></td>
  </tr>
  <tr>
    <td align="center"><sub><code>pondok-ai doctor</code> が Docker、RAM、ディスク、GPU をチェック</sub></td>
    <td align="center"><sub><code>pondok-ai model recommend</code> がハードウェアで動かせるかどうかでモデルを並べ替え</sub></td>
  </tr>
</table>

## プリセット

| プリセット | 含まれるサービス | 最小 RAM | おすすめの用途 |
|---|---|---|---|
| **`minimal`** | Ollama, Open WebUI | 8 GB | 手軽なローカルチャット、軽い実験 |
| **`standard`** *（デフォルト）* | Ollama, Open WebUI, PostgreSQL, Qdrant, API Gateway | 16 GB | RAG パイプライン、アプリ開発、OpenAI の代替 |
| **`full`** | Standard + n8n 自動化エンジン | 16+ GB | 自律型 AI エージェント、ビジュアルなワークフロー自動化 |

## アーキテクチャ

```
┌───────────────────────────────────────────────────────────────┐
│                      Host Machine (CLI)                       │
│                                                               │
│   Port 3000                 Port 8000           Port 5678     │
│       │                         │                   │         │
└───────┼─────────────────────────┼───────────────────┼─────────┘
        ▼                         ▼                   ▼
  ┌───────────┐             ┌───────────┐       ┌───────────┐
  │ Open      │             │ API       │       │ n8n       │
  │ WebUI     │             │ Gateway   │       │ (Full)    │
  └─────┬─────┘             └─────┬─────┘       └─────┬─────┘
        │                         │                   │
        ├─────────────────────────┼───────────────────┤
        ▼                         ▼                   ▼
  ┌───────────┐             ┌───────────┐       ┌───────────┐
  │ Ollama    │             │ Qdrant    │       │ Postgres  │
  │ (LLMs)    │             │ (Vector)  │       │ (State)   │
  └───────────┘             └───────────┘       └───────────┘
```

詳しくは[アーキテクチャ概要](./docs/architecture.md)をご覧ください。

## CLI コマンド

| コマンド | 説明 |
|---|---|
| `pondok-ai init` | ハードウェア検出付きの対話型設定ウィザードを実行 |
| `pondok-ai up` | Compose 設定を検証し、コンテナを起動してヘルスチェックを待機 |
| `pondok-ai down` | スタックのコンテナを停止して削除 |
| `pondok-ai start` | 停止中の既存コンテナを起動 |
| `pondok-ai stop` | 実行中のコンテナを停止 |
| `pondok-ai restart` | スタックのコンテナを再起動 |
| `pondok-ai status` | コンテナの状態と URL を表示 |
| `pondok-ai logs [service]` | ログを表示（`-f` でストリーム表示） |
| `pondok-ai doctor` | Docker、RAM、GPU/VRAM、ポートを診断し、モデルを提案 |
| `pondok-ai update` | 設定済みの固定バージョンのイメージを再取得（自動バックアップとヘルスチェック付き） |
| `pondok-ai backup` | 設定とデータボリュームを SHA-256 整合性チェック付きでバックアップ（暗号化なし） |
| `pondok-ai restore <path>` | SHA-256 で整合性を確認したバックアップから復元（暗号化なし） |
| `pondok-ai reset` | スタックをリセット（`--delete-data` を指定しない限りボリュームは保持） |
| `pondok-ai config` | 現在の設定を確認・編集 |
| `pondok-ai model list` | ダウンロード済みのモデルを一覧表示 |
| `pondok-ai model recommend` | ハードウェアに合わせたモデルの提案（RAM、VRAM、ディスク） |
| `pondok-ai model install <name>` | リソースの事前安全チェック付きで新しいモデルを取得 |
| `pondok-ai model remove <name>` | インストール済みのモデルを削除 |
| `pondok-ai model status` | モデルのリソース使用量を確認 |

イメージは明示的なバージョンに固定されています。`pondok-ai update` は設定済みのバージョンを更新するだけで、新しいリリースを選ぶことはありません。新しい CLI をインストールしたあとは、`pondok-ai update --upgrade-images` を実行すると CLI の旧デフォルトイメージタグだけが移行されます。カスタムのイメージ指定はそのまま保持されます。

## API ゲートウェイ

API ゲートウェイは、そのまま置き換えて使える OpenAI の REST エンドポイントを提供します。`/v1/*` エンドポイントを呼び出す前に、`PONDOK_AI_API_KEY` に生成された `API_SECRET_KEY` を設定してください。

ゲートウェイは、認証済みの `/v1/*` リクエストをデフォルトでクライアント（送信元 IP と API キー）ごとに毎分 120 件に制限します。ローカルのクライアントで別の上限が必要な場合は、`.env` の `RATE_LIMIT_MAX_REQUESTS` と `RATE_LIMIT_WINDOW_MS` を設定してください。

```bash
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $PONDOK_AI_API_KEY" \
  -d '{
    "model": "llama3.2:3b",
    "messages": [
      { "role": "user", "content": "Hello from pondok-ai!" }
    ]
  }'
```

<details>
<summary><b>公式 OpenAI Node.js SDK を使う</b></summary>

```typescript
import OpenAI from 'openai';

const apiKey = process.env.PONDOK_AI_API_KEY;
if (!apiKey) {
  throw new Error('Set PONDOK_AI_API_KEY to your generated API_SECRET_KEY.');
}

const openai = new OpenAI({
  baseURL: 'http://localhost:8000/v1',
  apiKey,
});

const completion = await openai.chat.completions.create({
  model: 'llama3.2:3b',
  messages: [{ role: 'user', content: 'Explain quantum computing in one sentence.' }],
});

console.log(completion.choices[0].message.content);
```

</details>

すべてのエンドポイントは [API ゲートウェイリファレンス](./docs/api-reference.md)をご覧ください。

## サンプル

- [`examples/openai-compat/`](./examples/openai-compat)：OpenAI SDK をそのまま置き換えて使う統合スクリプト。
- [`examples/rag-example/`](./examples/rag-example)：Qdrant ベクトルデータベースと Ollama の埋め込みを使ったエンドツーエンドの RAG パイプライン。

## CI でのテスト

すべてのプルリクエストで GitHub Actions（amd64 と arm64）のエンドツーエンドテストを実行します：init、up、ごく小さなモデル（smollm:135m、約 90 MB）の取得、/v1/models での一覧表示、ストリーミングなしの /v1/chat/completions リクエスト、レート制限（401 と 429）、そして Open WebUI のスタートページが応答するかの確認です。まだ対象外：ストリーミング応答、埋め込み、GPU アクセラレーション、macOS/Windows ホスト。

さらに、Docker Desktop と Homebrew 版 Ollama を入れた Apple M1 の Mac で 0.5.2 を手動テストしました：`minimal` プリセットとネイティブ Ollama での `init`、`up`、Open WebUI へのログイン、`gemma3:1b` とのチャット、同じ Wi-Fi のスマートフォンから開いた `pondok-ai share`。

## 既知の制限事項

- Windows ホストではまだテストしていません。macOS は Apple Silicon で手動テスト済みですが（上記参照）、CI の対象外です。
- Apple Silicon では Docker コンテナから GPU を使えません。`pondok-ai init --native-ollama` を実行すると、代わりにネイティブインストールした Metal 対応の Ollama を使えます。詳しくは [GPU ガイド](./docs/gpu-setup.md)をご覧ください。
- GPU アクセラレーション、ストリーミング応答、埋め込みはまだ CI の対象外です。
- イメージは大きめ（数 GB）です。十分な空きディスク容量を確保してください。空き 19 GB の 32 GB クラウドワークスペースでは、Ollama イメージの展開中に容量が足りなくなりました。

## ドキュメント

- [アーキテクチャ概要](./docs/architecture.md)
- [API ゲートウェイリファレンス](./docs/api-reference.md)
- [設定ガイド](./docs/configuration.md)
- [GPU アクセラレーションの設定（Metal / CUDA）](./docs/gpu-setup.md)
- [トラブルシューティングと診断](./docs/troubleshooting.md)
- [README デモの収録方法](./docs/demo/RECORDING.md)

## コントリビューション

コントリビューションを歓迎します！まずは [CONTRIBUTING.md](./CONTRIBUTING.md) をご覧ください。

## ライセンス

[MIT](./LICENSE) © 2026 pondok-ai contributors
