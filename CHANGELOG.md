# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

## [0.5.2] - 2026-10-23

### Added
- `up` starts a native Ollama on macOS when it is not running. It opens the Ollama app when installed and otherwise runs `ollama serve` in the background, logging to `.pondok-ai/ollama.log`. The manual hint is only shown when both fail.
- `up` points to the recommended model for your RAM (`pondok-ai model install ...`) when Ollama has no models yet, since Open WebUI has nothing to chat with until one is installed.

### Fixed
- `up` no longer says the stack is ready while Open WebUI is still starting. On first start Open WebUI downloads its support models, which took longer than the old 45 second wait, so `localhost:3000` refused connections right after the "ready" banner. `up` and `update` now wait up to 5 minutes by default (`--timeout`), the progress line names the services still starting, Open WebUI is probed on its `/health` endpoint, and when a service is still not ready `up` says so and shows how to follow it with `pondok-ai status` and `pondok-ai logs`.

## [0.5.1] - 2026-10-20

### Fixed
- Models without tool support, such as `gemma3:4b` and `gemma3:12b` from `model recommend --lang id`, can chat in Open WebUI. Open WebUI 0.11 sends its built-in tools with every chat, which Ollama rejects for these models with "does not support tools". New stacks now start Open WebUI with legacy function calling (`DEFAULT_MODEL_PARAMS`). Open WebUI keeps this setting in its database after the first start, so existing stacks change it once in the Admin Panel; see [Troubleshooting](docs/troubleshooting.md#does-not-support-tools-in-open-webui).

## [0.5.0] - 2026-10-20

### Added
- **Share on your network.** `pondok-ai share` publishes Open WebUI on the local network and prints its addresses with a QR code, so a classroom or office can use one machine from their own devices. It refuses to run until the Open WebUI admin account exists, keeps login on (`WEBUI_AUTH=True`), lets approved users chat with the installed models (`BYPASS_MODEL_ACCESS_CONTROL=True`), and leaves every other service on the bind address. It tells the admin to turn on New Sign Ups when they are off. `--light` draws the QR code for light terminal themes, and `pondok-ai share --stop` turns sharing off.
- **Models for Bahasa Indonesia.** `pondok-ai model recommend --lang id` lists only models that answer well in Indonesian and picks one for your RAM: Qwen 2.5 (1.5B, 3B, 7B), Gemma 3 (4B, 12B), Aya Expanse (8B), and BGE-M3 embeddings for RAG over Indonesian documents. These models are also added to the default list.

### Fixed
- Recreating the Open WebUI container (`update`, `share`, `config edit`) no longer logs everyone out. Its session signing key is now kept in the Open WebUI data volume (`WEBUI_SECRET_KEY_FILE`) instead of the container's filesystem.
- `model install` no longer sizes a larger tag like a smaller model of the same family. `qwen2.5:14b` or `deepseek-r1:32b` used to match `qwen2.5:1.5b` or `deepseek-r1:7b` and pass the memory check; tags that are not in the list are now estimated from their parameter count and quantization.

## [0.4.0] - 2026-10-20

### Added
- Opt-in native Ollama on macOS so models run on the Apple Silicon GPU (Metal). `pondok-ai init --native-ollama`, or answering yes when an Apple Silicon GPU is detected, skips the Ollama container and points Open WebUI and the API Gateway at the host Ollama via `host.docker.internal`. `model` commands, health checks and `up` use the host Ollama in this mode. Linux and Windows behavior is unchanged.
- Demo GIF and 1080p demo video in the README, with the scripts used to record them in `docs/demo/`.
- Polish README translation (thanks @MeydhiXploit).
- GitHub issue forms, Dependabot, CodeQL scanning, and a workflow that publishes the API Gateway image to `ghcr.io/rasidi3112/pondok-ai-gateway` (amd64 and arm64) on each release tag.

### Changed
- The NVIDIA GPU prompt no longer appears on macOS.
- README restructured with screenshots, a feature table and a shorter quickstart.
- All 16 translated READMEs synced with the English README, with the same language selector in every file.
- Security reports now go through GitHub Private Vulnerability Reporting.

## [0.3.1] - 2026-10-13

### Security
- Major upgrade from Fastify 4.29.1 to Fastify 5.12.5, with @fastify/cors 10.1.0, to address published advisories (request validation and authentication bypass issues, and denial of service).

## [0.3.0] - 2026-10-12

- BREAKING: renamed from local-ai-stack to pondok-ai (npm package, CLI command, config directory .pondok-ai, container names pondok-ai-*). Existing 0.2.x stacks are not migrated automatically. The old package name is deprecated.

## [0.2.4] - 2026-10-11

### Fixed
- Replaced missing `curl` in Ollama container health check with `ollama list` (`["CMD", "ollama", "list"]`) to prevent services from failing startup due to unhealthy status.
- Replaced missing `curl` in Qdrant container health check with bash TCP socket probe (`["CMD", "bash", "-c", ":> /dev/tcp/127.0.0.1/6333"]`). Note that this health check only verifies that the TCP port is open and listening.
- Replaced missing `curl` in API Gateway container health check with Node.js built-in fetch probe (`["CMD", "node", "-e", "fetch('http://127.0.0.1:8000/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"]`) compatible with the Alpine base image.

## [0.2.3] - 2026-10-11

- Version bump only; published without the healthcheck fixes, so `up` fails in this version.

## [0.2.2] - 2026-10-11

- Version bump only; published without the healthcheck fixes, so `up` fails in this version.

## [0.2.1] - 2026-10-11

- Version bump only; published without the healthcheck fixes, so `up` fails in this version.

## [0.2.0] - 2026-10-11

### Added
- Configurable in-memory, per-source-IP rate limiting for authenticated API Gateway `/v1/*` requests.

### Changed
- Pinned service and gateway build images to explicit versions. `update` now refreshes configured pins; `update --upgrade-images` migrates legacy default tags without overwriting custom image values.

### Fixed
- Corrected backup and restore documentation: backups are integrity-checked with SHA-256, are not encrypted, and do not provide cryptographic authenticity guarantees.

---

## [0.1.0] - 2026-10-09

### Added
- **Interactive & Non-Interactive CLI**:
  - `init` command with interactive wizard, hardware auto-detection, and preset flags (`--preset`, `--yes`).
  - `up`, `down`, `start`, `stop`, `restart` lifecycle orchestration with pre-flight compose syntax validation and active service readiness polling.
  - `backup` command creating encrypted/hashed backups of configs and Docker persistent volumes with a cryptographic SHA-256 `manifest.json`.
  - `restore` command restoring stack state and volumes with pre-restore SHA-256 integrity verification (`--verify-only`).
  - `update` command performing safe image upgrades with automated pre-update backups and health verification.
  - `status` command showing container health and active URL table.
  - `logs` command supporting service filtering and follow mode (`-f`).
  - `doctor` command diagnosing Docker, RAM, GPU/VRAM, ports, and model recommendations.
  - `reset` command with data-safety guarantees (preserves persistent volumes by default unless `--delete-data` is explicitly passed).
  - `config` command to inspect and modify stack options.
  - `model` command suite (`list`, `recommend`, `install`, `remove`, `status`) with hardware-aware fit evaluations (Compatible, Tight, Incompatible) and safety guards.
- **Cross-Platform One-Command Installers**:
  - `scripts/install.sh`: Automated prerequisite detection (Docker, Node, Curl) and installation for macOS and Linux.
  - `scripts/install.ps1`: Automated PowerShell installer and prerequisite validator for Windows.
- **Smart Hardware Detection & Model Recommendations**:
  - Auto-detection of Apple Silicon Metal unified memory limits, NVIDIA CUDA VRAM via `nvidia-smi`, AMD ROCm, and CPU/RAM/Disk metrics.
  - Tailored Ollama model recommendations based on actual host capacity.
- **Privacy & Security Hardening**:
  - Default `127.0.0.1` binding on all service ports to prevent accidental LAN exposure.
  - File permission enforcement (`0600`) on generated `.env` credential files on Unix platforms.
  - Guarded data deletion requiring interactive confirmation and explicit flags.
- **Service Presets**:
  - `minimal`: Ollama + Open WebUI.
  - `standard`: Ollama + Open WebUI + PostgreSQL + Qdrant + API Gateway.
  - `full`: Standard + n8n automation engine.
- **OpenAI-Compatible API Gateway**:
  - `POST /v1/chat/completions` with streaming SSE and tool parameters.
  - `POST /v1/embeddings` for vector embeddings.
  - `GET /v1/models` and `GET /models` listing available local models.
  - `GET /health` and `GET /status` active probes.
- **Comprehensive Documentation & Examples**:
  - Complete architectural blueprint, configuration manual, GPU acceleration manual, and troubleshooting guide.
  - RAG vector ingestion and query code examples.
  - OpenAI SDK drop-in replacement example.
