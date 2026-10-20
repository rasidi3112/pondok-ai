<div align="center">

# pondok-ai

**명령어 하나로 나만의 프라이빗 AI 스택을 로컬에서 실행하세요.**

로컬 LLM, 채팅 UI, 벡터 검색, OpenAI 호환 API를 Docker Compose로 하나로 묶었습니다.

[![npm version](https://img.shields.io/npm/v/pondok-ai?logo=npm&color=cb3837)](https://www.npmjs.com/package/pondok-ai)
[![CI](https://github.com/rasidi3112/pondok-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/rasidi3112/pondok-ai/actions/workflows/ci.yml)
[![Node.js](https://img.shields.io/node/v/pondok-ai?logo=node.js&logoColor=white&color=339933)](https://nodejs.org)
[![Docker Compose v2](https://img.shields.io/badge/Docker%20Compose-v2-2496ED?logo=docker&logoColor=white)](https://docs.docker.com/compose/)
[![License: MIT](https://img.shields.io/github/license/rasidi3112/pondok-ai?color=blue)](./LICENSE)

[English](README.md) · [Bahasa Indonesia](README_id.md) · **한국어** · [العربية](README_ar.md) · [Español](README_es.md) · [中文](README_zh.md) · [Français](README_fr.md) · [日本語](README_ja.md) · [Deutsch](README_de.md) · [Português](README_pt.md) · [Русский](README_ru.md) · [हिन्दी](README_hi.md) · [Türkçe](README_tr.md) · [Italiano](README_it.md) · [Tiếng Việt](README_vi.md) · [Polski](README_pl.md) · [Bahasa Melayu](README_ms.md)

<sub>번역은 기계로 생성되었으며 영어 README보다 늦게 반영될 수 있습니다.</sub>

<br>

<a href="docs/demo/demo.mp4">
  <img src="docs/demo/demo.gif" alt="pondok-ai 데모: init, up 후 Open WebUI에서 llama3.2:3b와 채팅" width="100%">
</a>

<sub>빈 폴더에서 로컬 모델의 답변까지. 이미지와 모델을 미리 받아 둔 CPU 전용 머신에서 녹화했으며, 대기 시간은 빠르게 재생하고 화면에 표시했습니다.<br>
<a href="docs/demo/demo.mp4"><b>▶ 1080p 영상 보기</b></a></sub>

<br>

[빠른 시작](#빠른-시작) · [주요 기능](#주요-기능) · [스크린샷](#스크린샷) · [프리셋](#프리셋) · [CLI](#cli-명령어) · [API 게이트웨이](#api-게이트웨이) · [문서](#문서)

</div>

---

## 개요

`pondok-ai`는 완전한 프라이빗 AI 환경을 내 컴퓨터에서 띄워 주는 CLI입니다. 하드웨어에 맞는 Docker Compose 스택을 생성하고, 헬스 체크와 함께 실행하며, 모델 관리까지 대신해 줍니다.

프롬프트, 채팅, 임베딩은 모두 내 컴퓨터에서 처리됩니다. 컨테이너 이미지와 모델 가중치를 처음 내려받을 때는 인터넷 연결이 필요합니다.

```bash
npx pondok-ai init
npx pondok-ai up
```

<sub>Pondok은 인도네시아어로 작은 오두막이나 쉼터를 뜻합니다. 이 패키지는 이전에 `local-ai-stack`이라는 이름으로 배포되었습니다.</sub>

## 주요 기능

| | |
|---|---|
| **로컬 처리** | 프롬프트, 채팅, 임베딩, 추론이 모두 내 하드웨어에서 실행됩니다. |
| **하드웨어 감지** | OS, 아키텍처, RAM, 디스크, GPU(Apple Metal, NVIDIA CUDA)를 감지하고 알맞은 프리셋과 모델을 추천합니다. |
| **모듈형 프리셋** | 가벼운 채팅 UI(`minimal`)부터 RAG 스택(`standard`), 자동화 파이프라인(`full`)까지 확장할 수 있습니다. |
| **OpenAI 호환 게이트웨이** | 코드를 다시 쓰지 않고 OpenAI SDK나 LangChain을 `http://localhost:8000/v1`로 연결하세요. |
| **모델 관리자** | 모델을 받고, 나열하고, 살펴보고, 삭제할 수 있으며 다운로드 전마다 RAM과 디스크 안전 검사를 합니다. |
| **진단** | `pondok-ai doctor`가 문제가 생기기 전에 Docker 데몬, 포트, RAM, 디스크, GPU를 점검합니다. |
| **백업** | SHA-256 무결성 검사와 함께 설정과 데이터 볼륨을 백업하고 복원합니다. |

## 빠른 시작

**사전 요구 사항:** Node.js 22 이상, Docker, Docker Compose v2.

**1. 스택 초기화**

```bash
# 하드웨어 감지가 포함된 대화형 설정 마법사
npx pondok-ai init

# 또는 원하는 프리셋으로 비대화형 실행
npx pondok-ai init --preset standard --yes
```

**2. 서비스 시작** (모든 서비스가 정상 상태가 될 때까지 기다립니다)

```bash
npx pondok-ai up
```

**3. 모델 선택 및 설치**

```bash
# RAM, VRAM, 남은 디스크 용량에 따른 추천
npx pondok-ai model recommend

# 메모리와 디스크를 사전 점검한 뒤 설치
npx pondok-ai model install llama3.2:3b
```

실행되면 스택을 열어 보세요.

| 서비스 | URL |
|---|---|
| Open WebUI | [http://localhost:3000](http://localhost:3000) |
| API 게이트웨이 | [http://localhost:8000](http://localhost:8000) |
| Ollama | [http://localhost:11434](http://localhost:11434) |
| Qdrant | [http://localhost:6333/dashboard](http://localhost:6333/dashboard) *(포트를 매핑한 경우)* |

<details>
<summary><b>설치 스크립트</b> (실험적, CI 대상 아님)</summary>

**macOS 및 Linux**

```bash
curl -fsSL https://raw.githubusercontent.com/rasidi3112/pondok-ai/main/scripts/install.sh | bash
```

**Windows (PowerShell)**

```powershell
iwr -useb https://raw.githubusercontent.com/rasidi3112/pondok-ai/main/scripts/install.ps1 | iex
```

</details>

## 스크린샷

<p align="center">
  <img src="docs/demo/screenshots/chat.png" alt="로컬에서 실행 중인 llama3.2:3b로 질문에 답하는 Open WebUI" width="100%">
  <br>
  <sub>로컬 Ollama 컨테이너가 제공하는 <code>llama3.2:3b</code>와 채팅 중인 Open WebUI.</sub>
</p>

<table>
  <tr>
    <td width="50%"><img src="docs/demo/screenshots/doctor.png" alt="pondok-ai doctor 출력: 시스템 정보, Docker 상태, 요구 사항 점검"></td>
    <td width="50%"><img src="docs/demo/screenshots/model-recommend.png" alt="pondok-ai model recommend 출력: 이 머신에서 호환되는 모델, 빠듯한 모델, 호환되지 않는 모델"></td>
  </tr>
  <tr>
    <td align="center"><sub><code>pondok-ai doctor</code>가 Docker, RAM, 디스크, GPU를 점검</sub></td>
    <td align="center"><sub><code>pondok-ai model recommend</code>가 하드웨어에서 실행 가능한 순서로 모델을 정렬</sub></td>
  </tr>
</table>

## 프리셋

| 프리셋 | 포함된 서비스 | 최소 RAM | 추천 용도 |
|---|---|---|---|
| **`minimal`** | Ollama, Open WebUI | 8 GB | 간편한 로컬 채팅, 가벼운 실험 |
| **`standard`** *(기본값)* | Ollama, Open WebUI, PostgreSQL, Qdrant, API Gateway | 16 GB | RAG 파이프라인, 앱 개발, OpenAI 대체 |
| **`full`** | Standard + n8n 자동화 엔진 | 16+ GB | 자율 AI 에이전트, 시각적 워크플로 자동화 |

## 아키텍처

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

자세한 내용은 [아키텍처 개요](./docs/architecture.md)를 참고하세요.

## CLI 명령어

| 명령어 | 설명 |
|---|---|
| `pondok-ai init` | 하드웨어 감지가 포함된 대화형 설정 마법사 실행 |
| `pondok-ai up` | Compose 설정을 검증하고 컨테이너를 시작한 뒤 헬스 체크 대기 |
| `pondok-ai down` | 스택 컨테이너 중지 및 삭제 |
| `pondok-ai start` | 중지된 기존 컨테이너 시작 |
| `pondok-ai stop` | 실행 중인 컨테이너 중지 |
| `pondok-ai restart` | 스택 컨테이너 재시작 |
| `pondok-ai status` | 컨테이너 상태와 URL 표시 |
| `pondok-ai logs [service]` | 로그 보기 (`-f`로 실시간 스트리밍) |
| `pondok-ai doctor` | Docker, RAM, GPU/VRAM, 포트 진단 및 모델 추천 |
| `pondok-ai update` | 설정된 고정 버전 이미지를 자동 백업 및 헬스 체크와 함께 다시 받기 |
| `pondok-ai backup` | SHA-256 무결성 검사와 함께 설정과 데이터 볼륨 백업 (암호화되지 않음) |
| `pondok-ai restore <path>` | SHA-256 무결성이 확인된 백업에서 복원 (암호화되지 않음) |
| `pondok-ai reset` | 스택 초기화 (`--delete-data`를 지정하지 않으면 볼륨은 유지) |
| `pondok-ai config` | 현재 설정 확인 또는 편집 |
| `pondok-ai model list` | 다운로드한 모델 목록 |
| `pondok-ai model recommend` | 하드웨어 맞춤 모델 추천 (RAM, VRAM, 디스크) |
| `pondok-ai model install <name>` | 리소스 사전 안전 검사 후 새 모델 받기 |
| `pondok-ai model remove <name>` | 설치된 모델 삭제 |
| `pondok-ai model status` | 모델별 리소스 사용량 확인 |

이미지는 명시적인 버전으로 고정되어 있습니다. `pondok-ai update`는 설정된 버전을 새로 받을 뿐, 더 새로운 릴리스를 고르지 않습니다. 새 CLI를 설치한 뒤 `pondok-ai update --upgrade-images`를 실행하면 CLI의 예전 기본 이미지 태그만 마이그레이션됩니다. 사용자 지정 이미지 값은 그대로 유지됩니다.

## API 게이트웨이

API 게이트웨이는 그대로 대체해 쓸 수 있는 OpenAI REST 엔드포인트를 제공합니다. `/v1/*` 엔드포인트를 호출하기 전에 `PONDOK_AI_API_KEY`를 생성된 `API_SECRET_KEY`로 설정하세요.

게이트웨이는 기본적으로 인증된 `/v1/*` 요청을 클라이언트(소스 IP와 API 키)별로 분당 120건으로 제한합니다. 로컬 클라이언트에 다른 한도가 필요하면 `.env`에서 `RATE_LIMIT_MAX_REQUESTS`와 `RATE_LIMIT_WINDOW_MS`를 설정하세요.

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
<summary><b>공식 OpenAI Node.js SDK 사용하기</b></summary>

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

모든 엔드포인트는 [API 게이트웨이 레퍼런스](./docs/api-reference.md)를 참고하세요.

## 예제

- [`examples/openai-compat/`](./examples/openai-compat): OpenAI SDK를 그대로 대체해 쓰는 통합 스크립트.
- [`examples/rag-example/`](./examples/rag-example): Qdrant 벡터 데이터베이스와 Ollama 임베딩을 사용하는 엔드투엔드 RAG 파이프라인.

## CI 테스트

모든 풀 리퀘스트는 GitHub Actions(amd64 및 arm64)에서 엔드투엔드 테스트를 실행합니다: init, up, 아주 작은 모델(smollm:135m, 약 90 MB) 받기, /v1/models로 목록 확인, 스트리밍 없는 /v1/chat/completions 요청, 속도 제한(401 및 429), 그리고 Open WebUI 시작 페이지가 응답하는지 확인합니다. 아직 다루지 않는 항목: 스트리밍 응답, 임베딩, GPU 가속, macOS/Windows 호스트.

## 알려진 제한 사항

- 실제 macOS나 Windows 호스트에서는 아직 테스트하지 않았습니다.
- Apple Silicon에서는 Docker 컨테이너가 GPU를 사용할 수 없습니다. `pondok-ai init --native-ollama`를 실행하면 대신 Metal을 지원하는 네이티브 설치 Ollama를 사용할 수 있습니다. [GPU 가이드](./docs/gpu-setup.md)를 참고하세요.
- GPU 가속, 스트리밍 응답, 임베딩은 아직 CI에서 다루지 않습니다.
- 이미지 용량이 큽니다(수 GB). 디스크 여유 공간을 넉넉히 확보하세요. 여유 공간이 19 GB인 32 GB 클라우드 작업 공간에서 Ollama 이미지를 푸는 도중 공간이 부족했습니다.

## 문서

- [아키텍처 개요](./docs/architecture.md)
- [API 게이트웨이 레퍼런스](./docs/api-reference.md)
- [설정 가이드](./docs/configuration.md)
- [GPU 가속 설정 (Metal / CUDA)](./docs/gpu-setup.md)
- [문제 해결 및 진단](./docs/troubleshooting.md)
- [README 데모 녹화하기](./docs/demo/RECORDING.md)

## 기여하기

기여를 환영합니다! 시작하려면 [CONTRIBUTING.md](./CONTRIBUTING.md)를 확인하세요.

## 라이선스

[MIT](./LICENSE) © 2026 pondok-ai contributors
