<div align="center">

# pondok-ai

**Run your own private AI stack locally with one command.**

Local LLMs, a chat UI, vector search, and an OpenAI-compatible API, wired together with Docker Compose.

[![npm version](https://img.shields.io/npm/v/pondok-ai?logo=npm&color=cb3837)](https://www.npmjs.com/package/pondok-ai)
[![CI](https://github.com/rasidi3112/pondok-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/rasidi3112/pondok-ai/actions/workflows/ci.yml)
[![Node.js](https://img.shields.io/node/v/pondok-ai?logo=node.js&logoColor=white&color=339933)](https://nodejs.org)
[![Docker Compose v2](https://img.shields.io/badge/Docker%20Compose-v2-2496ED?logo=docker&logoColor=white)](https://docs.docker.com/compose/)
[![License: MIT](https://img.shields.io/github/license/rasidi3112/pondok-ai?color=blue)](./LICENSE)

**English** · [Bahasa Indonesia](README_id.md) · [한국어](README_ko.md) · [العربية](README_ar.md) · [Español](README_es.md) · [中文](README_zh.md) · [Français](README_fr.md) · [日本語](README_ja.md) · [Deutsch](README_de.md) · [Português](README_pt.md) · [Русский](README_ru.md) · [हिन्दी](README_hi.md) · [Türkçe](README_tr.md) · [Italiano](README_it.md) · [Tiếng Việt](README_vi.md) · [Polski](README_pl.md) · [Bahasa Melayu](README_ms.md)

<sub>Translations are machine-generated and may lag behind the English README.</sub>

<br>

<a href="docs/demo/demo.mp4">
  <img src="docs/demo/demo.gif" alt="pondok-ai demo: init, up, then chatting with llama3.2:3b in Open WebUI" width="100%">
</a>

<sub>From an empty folder to a reply from a local model. Recorded on a CPU-only machine with images and model pre-pulled; waiting is sped up and labelled on screen.<br>
<a href="docs/demo/demo.mp4"><b>▶ Watch the 1080p video</b></a></sub>

<br>

[Quickstart](#quickstart) · [Features](#features) · [Screenshots](#screenshots) · [Presets](#presets) · [Share on your network](#share-on-your-network) · [CLI](#cli-commands) · [API Gateway](#api-gateway) · [Docs](#documentation)

</div>

---

## Overview

`pondok-ai` is a CLI that boots a complete, private AI environment on your own machine. It generates a Docker Compose stack for your hardware, starts it with health checks, and manages models for you.

Prompts, chats, and embeddings are processed on your machine. Pulling container images and model weights the first time requires an internet connection.

```bash
npx pondok-ai init
npx pondok-ai up
```

<sub>Pondok is Indonesian for a small lodge or shelter. The package was formerly published as `local-ai-stack`.</sub>

## Features

| | |
|---|---|
| **Local processing** | Prompts, chats, embeddings, and inference run on your hardware. |
| **Hardware detection** | Detects OS, architecture, RAM, disk, and GPU (Apple Metal, NVIDIA CUDA) and recommends a preset and models that fit. |
| **Modular presets** | Scale from a lightweight chat UI (`minimal`) to a RAG stack (`standard`) or an automation pipeline (`full`). |
| **Share on your network** | `pondok-ai share` turns one machine into a private ChatGPT for a classroom or office: everyone on the same Wi-Fi opens Open WebUI from a QR code and logs in with their own account. |
| **OpenAI-compatible gateway** | Point the OpenAI SDKs or LangChain at `http://localhost:8000/v1` without rewriting code. |
| **Model manager** | Pull, list, inspect, and remove models with RAM and disk safety checks before each download. |
| **Diagnostics** | `pondok-ai doctor` checks the Docker daemon, ports, RAM, disk, and GPU before you hit problems. |
| **Backups** | Back up and restore configs and data volumes with SHA-256 integrity checks. |

## Quickstart

**Prerequisites:** Node.js 22 or later, Docker, and Docker Compose v2.

**1. Initialize the stack**

```bash
# Interactive setup wizard with hardware detection
npx pondok-ai init

# Or non-interactive with a chosen preset
npx pondok-ai init --preset standard --yes
```

**2. Start the services** (waits until every service is healthy)

```bash
npx pondok-ai up
```

**3. Pick and install a model**

```bash
# Recommendations based on your RAM, VRAM, and free disk
npx pondok-ai model recommend

# Only models that answer well in Bahasa Indonesia (Gemma 3, Qwen 2.5, Aya Expanse, BGE-M3)
npx pondok-ai model recommend --lang id

# Install with a pre-flight memory and disk check
npx pondok-ai model install llama3.2:3b
```

Once running, open your stack:

| Service | URL |
|---|---|
| Open WebUI | [http://localhost:3000](http://localhost:3000) |
| API Gateway | [http://localhost:8000](http://localhost:8000) |
| Ollama | [http://localhost:11434](http://localhost:11434) |
| Qdrant | [http://localhost:6333/dashboard](http://localhost:6333/dashboard) *(when mapped)* |

<details>
<summary><b>Installer scripts</b> (experimental, not covered by CI)</summary>

**macOS and Linux**

```bash
curl -fsSL https://raw.githubusercontent.com/rasidi3112/pondok-ai/main/scripts/install.sh | bash
```

**Windows (PowerShell)**

```powershell
iwr -useb https://raw.githubusercontent.com/rasidi3112/pondok-ai/main/scripts/install.ps1 | iex
```

</details>

## Screenshots

<p align="center">
  <img src="docs/demo/screenshots/chat.png" alt="Open WebUI answering a question with llama3.2:3b running locally" width="100%">
  <br>
  <sub>Open WebUI chatting with <code>llama3.2:3b</code>, served by the local Ollama container.</sub>
</p>

<table>
  <tr>
    <td width="50%"><img src="docs/demo/screenshots/doctor.png" alt="pondok-ai doctor output: system information, Docker status, and requirement checks"></td>
    <td width="50%"><img src="docs/demo/screenshots/model-recommend.png" alt="pondok-ai model recommend output: compatible, tight-fit, and incompatible models for this machine"></td>
  </tr>
  <tr>
    <td align="center"><sub><code>pondok-ai doctor</code> checks Docker, RAM, disk, and GPU</sub></td>
    <td align="center"><sub><code>pondok-ai model recommend</code> sorts models by what your hardware can run</sub></td>
  </tr>
</table>

## Presets

| Preset | Services Included | Min RAM | Recommended For |
|---|---|---|---|
| **`minimal`** | Ollama, Open WebUI | 8 GB | Quick local chat, lightweight experimentation |
| **`standard`** *(default)* | Ollama, Open WebUI, PostgreSQL, Qdrant, API Gateway | 16 GB | RAG pipelines, app development, OpenAI replacement |
| **`full`** | Standard + n8n automation engine | 16+ GB | Autonomous AI agents, visual workflow automation |

## Share on your network

One machine can serve a whole classroom, office, or pesantren. Everyone on the same Wi-Fi or LAN opens Open WebUI in their browser, each with their own account and chat history, while the models run on that one machine.

1. Start the stack, then open http://localhost:3000 on this machine and create the admin account.

   ```bash
   npx pondok-ai up
   ```

2. As the admin, open **Admin Panel > Settings > General**, turn on **New Sign Ups** and save. Open WebUI turns sign-ups off once the admin exists. Leave **Default User Role** at **Pending**.
3. Share Open WebUI on the local network:

   ```bash
   npx pondok-ai share
   ```

   It prints the address for each network this machine is on, such as `http://192.168.1.20:3000`, with a QR code people can scan with their phone. On a terminal with a light background, use `npx pondok-ai share --light` so the QR code scans.
4. People sign up from their own devices. Approve each one in **Admin Panel > Users**, and they can start chatting with the models installed on this machine.

It is safe by default:

- **Admin first.** `share` refuses to run until the Open WebUI admin account exists, because the first account to sign up becomes the admin.
- **Login is always on.** New accounts wait as *pending* until the admin approves them in **Admin Panel > Users**.
- **Only Open WebUI is shared.** The API gateway, Ollama, Qdrant, and n8n keep their bind address (`127.0.0.1` by default), so nothing without a login is exposed.

While sharing, approved users can use every model installed on this machine, including ones you marked private in the Workspace. The "Account Activation Pending" screen shows the admin's name and email; turn off **Show Admin Details in Account Pending Overlay** in **Admin Panel > Settings > General** to hide them.

Traffic is plain HTTP, so share only on a network you trust, not public Wi-Fi. Your OS firewall may ask to allow incoming connections the first time. Stop sharing with `npx pondok-ai share --stop`.

## Architecture

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

See the [Architecture Overview](./docs/architecture.md) for details.

## CLI Commands

| Command | Description |
|---|---|
| `pondok-ai init` | Run interactive configuration wizard with hardware detection |
| `pondok-ai up` | Validate Compose config, boot containers, and wait for health checks |
| `pondok-ai down` | Stop and remove stack containers |
| `pondok-ai start` | Start existing stopped containers |
| `pondok-ai stop` | Stop running containers |
| `pondok-ai restart` | Restart stack containers |
| `pondok-ai status` | Show container health and URLs |
| `pondok-ai logs [service]` | View logs (`-f` to stream) |
| `pondok-ai doctor` | Diagnose Docker, RAM, GPU/VRAM, ports, and model recommendations |
| `pondok-ai update` | Re-pull configured pinned images with automated backup and health checks |
| `pondok-ai backup` | Backup configs and data volumes with SHA-256 integrity checks (not encrypted) |
| `pondok-ai restore <path>` | Restore from a SHA-256 integrity-checked backup (not encrypted) |
| `pondok-ai reset` | Reset stack (preserves volumes unless `--delete-data` is specified) |
| `pondok-ai config` | Inspect or edit active configuration |
| `pondok-ai share` | Share Open WebUI on your Wi-Fi or LAN with a QR code (`--stop` to end) |
| `pondok-ai model list` | List downloaded models |
| `pondok-ai model recommend` | Hardware-tailored model recommendations (RAM, VRAM, Disk); `--lang id` for Bahasa Indonesia |
| `pondok-ai model install <name>` | Pull a new model with pre-flight resource safety checks |
| `pondok-ai model remove <name>` | Delete an installed model |
| `pondok-ai model status` | Inspect model resource footprints |

Images are pinned to explicit versions. `pondok-ai update` refreshes the configured versions; it does not select newer releases. After installing a newer CLI, run `pondok-ai update --upgrade-images` to migrate only the CLI's legacy default image tags. Custom image values are preserved.

## API Gateway

The API Gateway provides drop-in OpenAI REST endpoints. Set `PONDOK_AI_API_KEY` to the generated `API_SECRET_KEY` before calling a `/v1/*` endpoint.

The gateway limits authenticated `/v1/*` requests per client (source IP and API key) to 120 requests per minute by default. Configure `RATE_LIMIT_MAX_REQUESTS` and `RATE_LIMIT_WINDOW_MS` in `.env` if your local client needs different limits.

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
<summary><b>Using the official OpenAI Node.js SDK</b></summary>

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

See the [API Gateway Reference](./docs/api-reference.md) for every endpoint.

## Examples

- [`examples/openai-compat/`](./examples/openai-compat): Drop-in OpenAI SDK integration script.
- [`examples/rag-example/`](./examples/rag-example): End-to-end RAG pipeline using the Qdrant vector database and Ollama embeddings.

## Tested in CI

Every pull request runs an end-to-end test on GitHub Actions (amd64 and arm64): init, up, pull a very small model (smollm:135m, about 90 MB), list it via /v1/models, a non-streaming /v1/chat/completions request, rate limiting (401 and 429), and a check that Open WebUI's start page responds. Not covered yet: streaming responses, embeddings, GPU acceleration, and macOS/Windows hosts.

## Known limitations

- Not tested on real macOS or Windows hosts yet.
- On Apple Silicon, Docker containers cannot use the GPU. Run `pondok-ai init --native-ollama` to use a natively installed Ollama with Metal instead; see the [GPU guide](./docs/gpu-setup.md).
- GPU acceleration, streaming responses, and embeddings are not covered by CI yet.
- The images are large (several GB). Plan for substantial free disk space; a 32 GB cloud workspace with 19 GB free ran out of space while extracting the Ollama image.

## Documentation

- [Architecture Overview](./docs/architecture.md)
- [API Gateway Reference](./docs/api-reference.md)
- [Configuration Guide](./docs/configuration.md)
- [GPU Acceleration Setup (Metal / CUDA)](./docs/gpu-setup.md)
- [Troubleshooting & Diagnostics](./docs/troubleshooting.md)
- [Recording the README demo](./docs/demo/RECORDING.md)

## Contributing

Contributions are welcome! Check out [CONTRIBUTING.md](./CONTRIBUTING.md) to get started.

## License

[MIT](./LICENSE) © 2026 pondok-ai contributors
