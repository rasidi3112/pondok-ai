<div align="center">

# pondok-ai

**一条命令，在本地运行你自己的私有 AI 栈。**

本地 LLM、聊天界面、向量搜索和兼容 OpenAI 的 API，通过 Docker Compose 整合在一起。

[![npm version](https://img.shields.io/npm/v/pondok-ai?logo=npm&color=cb3837)](https://www.npmjs.com/package/pondok-ai)
[![CI](https://github.com/rasidi3112/pondok-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/rasidi3112/pondok-ai/actions/workflows/ci.yml)
[![Node.js](https://img.shields.io/node/v/pondok-ai?logo=node.js&logoColor=white&color=339933)](https://nodejs.org)
[![Docker Compose v2](https://img.shields.io/badge/Docker%20Compose-v2-2496ED?logo=docker&logoColor=white)](https://docs.docker.com/compose/)
[![License: MIT](https://img.shields.io/github/license/rasidi3112/pondok-ai?color=blue)](./LICENSE)

[English](README.md) · [Bahasa Indonesia](README_id.md) · [한국어](README_ko.md) · [العربية](README_ar.md) · [Español](README_es.md) · **中文** · [Français](README_fr.md) · [日本語](README_ja.md) · [Deutsch](README_de.md) · [Português](README_pt.md) · [Русский](README_ru.md) · [हिन्दी](README_hi.md) · [Türkçe](README_tr.md) · [Italiano](README_it.md) · [Tiếng Việt](README_vi.md) · [Polski](README_pl.md) · [Bahasa Melayu](README_ms.md)

<sub>翻译由机器生成，可能落后于英文 README。</sub>

<br>

<a href="docs/demo/demo.mp4">
  <img src="docs/demo/demo.gif" alt="pondok-ai 演示：init、up，然后在 Open WebUI 中与 llama3.2:3b 对话" width="100%">
</a>

<sub>从一个空文件夹到本地模型给出回复。在仅有 CPU 的机器上录制，镜像和模型已预先拉取；等待过程已加速并在画面中标注。<br>
<a href="docs/demo/demo.mp4"><b>▶ 观看 1080p 视频</b></a></sub>

<br>

[快速开始](#快速开始) · [功能特性](#功能特性) · [截图](#截图) · [预设](#预设) · [CLI](#cli-命令) · [API 网关](#api-网关) · [文档](#文档)

</div>

---

## 概述

`pondok-ai` 是一个 CLI，可在你自己的机器上启动一套完整、私有的 AI 环境。它会根据你的硬件生成 Docker Compose 栈，带健康检查地启动它，并替你管理模型。

提示词、聊天和嵌入都在你的机器上处理。首次拉取容器镜像和模型权重时需要联网。

```bash
npx pondok-ai init
npx pondok-ai up
```

<sub>Pondok 在印尼语中意为小屋或栖身之所。该软件包以前以 `local-ai-stack` 的名称发布。</sub>

## 功能特性

| | |
|---|---|
| **本地处理** | 提示词、聊天、嵌入和推理都在你的硬件上运行。 |
| **硬件检测** | 检测操作系统、架构、内存、磁盘和 GPU（Apple Metal、NVIDIA CUDA），并推荐合适的预设和模型。 |
| **模块化预设** | 从轻量聊天界面（`minimal`）扩展到 RAG 栈（`standard`）或自动化流水线（`full`）。 |
| **兼容 OpenAI 的网关** | 将 OpenAI SDK 或 LangChain 指向 `http://localhost:8000/v1`，无需改写代码。 |
| **模型管理器** | 拉取、列出、查看和删除模型，每次下载前都会检查内存和磁盘是否足够。 |
| **诊断** | `pondok-ai doctor` 会在你遇到问题之前检查 Docker 守护进程、端口、内存、磁盘和 GPU。 |
| **备份** | 备份和恢复配置及数据卷，并进行 SHA-256 完整性校验。 |

## 快速开始

**前置条件：** Node.js 22 或更高版本、Docker 以及 Docker Compose v2。

**1. 初始化栈**

```bash
# 带硬件检测的交互式设置向导
npx pondok-ai init

# 或者使用指定预设以非交互方式运行
npx pondok-ai init --preset standard --yes
```

**2. 启动服务**（等待所有服务进入健康状态）

```bash
npx pondok-ai up
```

**3. 选择并安装模型**

```bash
# 根据你的内存、显存和剩余磁盘空间给出推荐
npx pondok-ai model recommend

# 安装前预先检查内存和磁盘
npx pondok-ai model install llama3.2:3b
```

运行后，打开你的栈：

| 服务 | URL |
|---|---|
| Open WebUI | [http://localhost:3000](http://localhost:3000) |
| API 网关 | [http://localhost:8000](http://localhost:8000) |
| Ollama | [http://localhost:11434](http://localhost:11434) |
| Qdrant | [http://localhost:6333/dashboard](http://localhost:6333/dashboard) *（已映射端口时）* |

<details>
<summary><b>安装脚本</b>（实验性，未纳入 CI 测试）</summary>

**macOS 和 Linux**

```bash
curl -fsSL https://raw.githubusercontent.com/rasidi3112/pondok-ai/main/scripts/install.sh | bash
```

**Windows (PowerShell)**

```powershell
iwr -useb https://raw.githubusercontent.com/rasidi3112/pondok-ai/main/scripts/install.ps1 | iex
```

</details>

## 截图

<p align="center">
  <img src="docs/demo/screenshots/chat.png" alt="Open WebUI 使用本地运行的 llama3.2:3b 回答问题" width="100%">
  <br>
  <sub>Open WebUI 与 <code>llama3.2:3b</code> 对话，模型由本地 Ollama 容器提供。</sub>
</p>

<table>
  <tr>
    <td width="50%"><img src="docs/demo/screenshots/doctor.png" alt="pondok-ai doctor 输出：系统信息、Docker 状态和需求检查"></td>
    <td width="50%"><img src="docs/demo/screenshots/model-recommend.png" alt="pondok-ai model recommend 输出：适用于本机的兼容、勉强可用和不兼容的模型"></td>
  </tr>
  <tr>
    <td align="center"><sub><code>pondok-ai doctor</code> 检查 Docker、内存、磁盘和 GPU</sub></td>
    <td align="center"><sub><code>pondok-ai model recommend</code> 按你的硬件能运行的程度对模型排序</sub></td>
  </tr>
</table>

## 预设

| 预设 | 包含的服务 | 最低内存 | 适用场景 |
|---|---|---|---|
| **`minimal`** | Ollama, Open WebUI | 8 GB | 快速本地聊天、轻量实验 |
| **`standard`** *（默认）* | Ollama, Open WebUI, PostgreSQL, Qdrant, API Gateway | 16 GB | RAG 流水线、应用开发、替代 OpenAI |
| **`full`** | Standard + n8n 自动化引擎 | 16+ GB | 自主 AI 智能体、可视化工作流自动化 |

## 架构

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

详见[架构概览](./docs/architecture.md)。

## CLI 命令

| 命令 | 说明 |
|---|---|
| `pondok-ai init` | 运行带硬件检测的交互式配置向导 |
| `pondok-ai up` | 校验 Compose 配置、启动容器并等待健康检查通过 |
| `pondok-ai down` | 停止并删除栈的容器 |
| `pondok-ai start` | 启动已存在但已停止的容器 |
| `pondok-ai stop` | 停止正在运行的容器 |
| `pondok-ai restart` | 重启栈的容器 |
| `pondok-ai status` | 显示容器健康状态和 URL |
| `pondok-ai logs [service]` | 查看日志（`-f` 实时跟踪） |
| `pondok-ai doctor` | 诊断 Docker、内存、GPU/显存、端口并给出模型推荐 |
| `pondok-ai update` | 重新拉取配置中固定版本的镜像，自动备份并执行健康检查 |
| `pondok-ai backup` | 备份配置和数据卷，带 SHA-256 完整性校验（未加密） |
| `pondok-ai restore <path>` | 从经过 SHA-256 完整性校验的备份恢复（未加密） |
| `pondok-ai reset` | 重置栈（除非指定 `--delete-data`，否则保留数据卷） |
| `pondok-ai config` | 查看或编辑当前配置 |
| `pondok-ai model list` | 列出已下载的模型 |
| `pondok-ai model recommend` | 按硬件（内存、显存、磁盘）推荐模型 |
| `pondok-ai model install <name>` | 拉取新模型，事先检查资源是否足够 |
| `pondok-ai model remove <name>` | 删除已安装的模型 |
| `pondok-ai model status` | 查看模型的资源占用 |

镜像固定为明确的版本。`pondok-ai update` 会刷新已配置的版本，但不会选择更新的发行版。安装更新版本的 CLI 后，运行 `pondok-ai update --upgrade-images`，只迁移 CLI 旧的默认镜像标签。自定义的镜像值会保留。

## API 网关

API 网关提供可直接替换的 OpenAI REST 端点。调用任何 `/v1/*` 端点之前，请将 `PONDOK_AI_API_KEY` 设置为生成的 `API_SECRET_KEY`。

默认情况下，网关对每个客户端（源 IP 和 API 密钥）的已认证 `/v1/*` 请求限制为每分钟 120 次。如果你的本地客户端需要不同的限制，请在 `.env` 中配置 `RATE_LIMIT_MAX_REQUESTS` 和 `RATE_LIMIT_WINDOW_MS`。

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
<summary><b>使用官方 OpenAI Node.js SDK</b></summary>

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

全部端点请参阅 [API 网关参考](./docs/api-reference.md)。

## 示例

- [`examples/openai-compat/`](./examples/openai-compat)：可直接替换的 OpenAI SDK 集成脚本。
- [`examples/rag-example/`](./examples/rag-example)：使用 Qdrant 向量数据库和 Ollama 嵌入的端到端 RAG 流水线。

## CI 测试覆盖

每个拉取请求都会在 GitHub Actions（amd64 和 arm64）上运行端到端测试：init、up、拉取一个非常小的模型（smollm:135m，约 90 MB）、通过 /v1/models 列出它、一次非流式的 /v1/chat/completions 请求、速率限制（401 和 429），以及检查 Open WebUI 起始页是否有响应。尚未覆盖：流式响应、嵌入、GPU 加速以及 macOS/Windows 主机。

## 已知限制

- 尚未在真实的 macOS 或 Windows 主机上测试。
- 在 Apple Silicon 上，Docker 容器无法使用 GPU。运行 `pondok-ai init --native-ollama` 即可改用本机原生安装、支持 Metal 的 Ollama；参见 [GPU 指南](./docs/gpu-setup.md)。
- GPU 加速、流式响应和嵌入尚未纳入 CI。
- 镜像体积较大（数 GB）。请预留充足的磁盘空间；一个 32 GB、剩余 19 GB 的云端工作区在解压 Ollama 镜像时空间耗尽。

## 文档

- [架构概览](./docs/architecture.md)
- [API 网关参考](./docs/api-reference.md)
- [配置指南](./docs/configuration.md)
- [GPU 加速设置（Metal / CUDA）](./docs/gpu-setup.md)
- [故障排查与诊断](./docs/troubleshooting.md)
- [录制 README 演示](./docs/demo/RECORDING.md)

## 贡献

欢迎贡献！请阅读 [CONTRIBUTING.md](./CONTRIBUTING.md) 开始参与。

## 许可证

[MIT](./LICENSE) © 2026 pondok-ai 贡献者
