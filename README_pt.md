<div align="center">

# pondok-ai

**Execute seu próprio stack de IA privado localmente com um único comando.**

LLMs locais, uma interface de chat, busca vetorial e uma API compatível com a OpenAI, integrados com Docker Compose.

[![npm version](https://img.shields.io/npm/v/pondok-ai?logo=npm&color=cb3837)](https://www.npmjs.com/package/pondok-ai)
[![CI](https://github.com/rasidi3112/pondok-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/rasidi3112/pondok-ai/actions/workflows/ci.yml)
[![Node.js](https://img.shields.io/node/v/pondok-ai?logo=node.js&logoColor=white&color=339933)](https://nodejs.org)
[![Docker Compose v2](https://img.shields.io/badge/Docker%20Compose-v2-2496ED?logo=docker&logoColor=white)](https://docs.docker.com/compose/)
[![License: MIT](https://img.shields.io/github/license/rasidi3112/pondok-ai?color=blue)](./LICENSE)

[English](README.md) · [Bahasa Indonesia](README_id.md) · [한국어](README_ko.md) · [العربية](README_ar.md) · [Español](README_es.md) · [中文](README_zh.md) · [Français](README_fr.md) · [日本語](README_ja.md) · [Deutsch](README_de.md) · **Português** · [Русский](README_ru.md) · [हिन्दी](README_hi.md) · [Türkçe](README_tr.md) · [Italiano](README_it.md) · [Tiếng Việt](README_vi.md) · [Polski](README_pl.md) · [Bahasa Melayu](README_ms.md)

<sub>As traduções são geradas automaticamente e podem estar atrasadas em relação ao README em inglês.</sub>

<br>

<a href="docs/demo/demo.mp4">
  <img src="docs/demo/demo.gif" alt="Demo do pondok-ai: init, up e depois uma conversa com o llama3.2:3b no Open WebUI" width="100%">
</a>

<sub>De uma pasta vazia até a resposta de um modelo local. Gravado em uma máquina só com CPU, com as imagens e o modelo baixados previamente; as esperas foram aceleradas e sinalizadas na tela.<br>
<a href="docs/demo/demo.mp4"><b>▶ Assista ao vídeo em 1080p</b></a></sub>

<br>

[Início rápido](#início-rápido) · [Recursos](#recursos) · [Capturas de tela](#capturas-de-tela) · [Presets](#presets) · [CLI](#comandos-da-cli) · [API Gateway](#api-gateway) · [Documentação](#documentação)

</div>

---

## Visão geral

`pondok-ai` é uma CLI que sobe um ambiente de IA completo e privado na sua própria máquina. Ela gera um stack Docker Compose adequado ao seu hardware, inicia-o com verificações de saúde e gerencia os modelos para você.

Prompts, chats e embeddings são processados na sua máquina. O primeiro download das imagens de contêiner e dos pesos dos modelos requer conexão com a internet.

```bash
npx pondok-ai init
npx pondok-ai up
```

<sub>Pondok é a palavra indonésia para uma pequena cabana ou abrigo. O pacote era publicado anteriormente como `local-ai-stack`.</sub>

## Recursos

| | |
|---|---|
| **Processamento local** | Prompts, chats, embeddings e inferência rodam no seu hardware. |
| **Detecção de hardware** | Detecta sistema operacional, arquitetura, RAM, disco e GPU (Apple Metal, NVIDIA CUDA) e recomenda um preset e modelos adequados. |
| **Presets modulares** | Escale de uma interface de chat leve (`minimal`) para um stack RAG (`standard`) ou um pipeline de automação (`full`). |
| **Gateway compatível com OpenAI** | Aponte os SDKs da OpenAI ou o LangChain para `http://localhost:8000/v1` sem reescrever código. |
| **Gerenciador de modelos** | Baixe, liste, inspecione e remova modelos, com verificações de RAM e disco antes de cada download. |
| **Diagnóstico** | `pondok-ai doctor` verifica o daemon do Docker, as portas, a RAM, o disco e a GPU antes que surjam problemas. |
| **Backups** | Faça backup e restaure configurações e volumes de dados com verificação de integridade SHA-256. |

## Início rápido

**Pré-requisitos:** Node.js 22 ou superior, Docker e Docker Compose v2.

**1. Inicialize o stack**

```bash
# Assistente de configuração interativo com detecção de hardware
npx pondok-ai init

# Ou de forma não interativa com um preset escolhido
npx pondok-ai init --preset standard --yes
```

**2. Inicie os serviços** (aguarda até que todos estejam saudáveis)

```bash
npx pondok-ai up
```

**3. Escolha e instale um modelo**

```bash
# Recomendações com base na sua RAM, VRAM e espaço livre em disco
npx pondok-ai model recommend

# Instalação com verificação prévia de memória e disco
npx pondok-ai model install llama3.2:3b
```

Com tudo rodando, abra seu stack:

| Serviço | URL |
|---|---|
| Open WebUI | [http://localhost:3000](http://localhost:3000) |
| API Gateway | [http://localhost:8000](http://localhost:8000) |
| Ollama | [http://localhost:11434](http://localhost:11434) |
| Qdrant | [http://localhost:6333/dashboard](http://localhost:6333/dashboard) *(quando mapeado)* |

<details>
<summary><b>Scripts de instalação</b> (experimentais, não cobertos pela CI)</summary>

**macOS e Linux**

```bash
curl -fsSL https://raw.githubusercontent.com/rasidi3112/pondok-ai/main/scripts/install.sh | bash
```

**Windows (PowerShell)**

```powershell
iwr -useb https://raw.githubusercontent.com/rasidi3112/pondok-ai/main/scripts/install.ps1 | iex
```

</details>

## Capturas de tela

<p align="center">
  <img src="docs/demo/screenshots/chat.png" alt="Open WebUI respondendo a uma pergunta com o llama3.2:3b rodando localmente" width="100%">
  <br>
  <sub>Open WebUI conversando com o <code>llama3.2:3b</code>, servido pelo contêiner local do Ollama.</sub>
</p>

<table>
  <tr>
    <td width="50%"><img src="docs/demo/screenshots/doctor.png" alt="Saída do pondok-ai doctor: informações do sistema, status do Docker e verificação de requisitos"></td>
    <td width="50%"><img src="docs/demo/screenshots/model-recommend.png" alt="Saída do pondok-ai model recommend: modelos compatíveis, no limite e incompatíveis para esta máquina"></td>
  </tr>
  <tr>
    <td align="center"><sub><code>pondok-ai doctor</code> verifica Docker, RAM, disco e GPU</sub></td>
    <td align="center"><sub><code>pondok-ai model recommend</code> ordena os modelos pelo que seu hardware consegue rodar</sub></td>
  </tr>
</table>

## Presets

| Preset | Serviços incluídos | RAM mínima | Recomendado para |
|---|---|---|---|
| **`minimal`** | Ollama, Open WebUI | 8 GB | Chat local rápido, experimentação leve |
| **`standard`** *(padrão)* | Ollama, Open WebUI, PostgreSQL, Qdrant, API Gateway | 16 GB | Pipelines RAG, desenvolvimento de aplicativos, substituto da OpenAI |
| **`full`** | Standard + motor de automação n8n | 16+ GB | Agentes de IA autônomos, automação visual de fluxos de trabalho |

## Arquitetura

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

Veja a [visão geral da arquitetura](./docs/architecture.md) para mais detalhes.

## Comandos da CLI

| Comando | Descrição |
|---|---|
| `pondok-ai init` | Executa o assistente de configuração interativo com detecção de hardware |
| `pondok-ai up` | Valida a configuração do Compose, inicia os contêineres e aguarda as verificações de saúde |
| `pondok-ai down` | Para e remove os contêineres do stack |
| `pondok-ai start` | Inicia contêineres existentes que estão parados |
| `pondok-ai stop` | Para os contêineres em execução |
| `pondok-ai restart` | Reinicia os contêineres do stack |
| `pondok-ai status` | Mostra a saúde dos contêineres e as URLs |
| `pondok-ai logs [service]` | Exibe os logs (`-f` para acompanhar em tempo real) |
| `pondok-ai doctor` | Diagnostica Docker, RAM, GPU/VRAM, portas e recomendações de modelos |
| `pondok-ai update` | Baixa novamente as imagens fixadas configuradas, com backup automático e verificações de saúde |
| `pondok-ai backup` | Faz backup de configurações e volumes de dados com verificação de integridade SHA-256 (sem criptografia) |
| `pondok-ai restore <path>` | Restaura a partir de um backup verificado com SHA-256 (sem criptografia) |
| `pondok-ai reset` | Redefine o stack (preserva os volumes, a menos que `--delete-data` seja especificado) |
| `pondok-ai config` | Inspeciona ou edita a configuração ativa |
| `pondok-ai model list` | Lista os modelos baixados |
| `pondok-ai model recommend` | Recomendações de modelos de acordo com o hardware (RAM, VRAM, disco) |
| `pondok-ai model install <name>` | Baixa um novo modelo com verificações prévias de recursos |
| `pondok-ai model remove <name>` | Remove um modelo instalado |
| `pondok-ai model status` | Inspeciona o consumo de recursos dos modelos |

As imagens são fixadas em versões explícitas. `pondok-ai update` atualiza as versões configuradas; ele não seleciona versões mais novas. Depois de instalar uma CLI mais nova, execute `pondok-ai update --upgrade-images` para migrar apenas as tags de imagem padrão antigas da CLI. Valores de imagem personalizados são preservados.

## API Gateway

O API Gateway oferece endpoints REST da OpenAI como substituto direto. Defina `PONDOK_AI_API_KEY` com a `API_SECRET_KEY` gerada antes de chamar um endpoint `/v1/*`.

Por padrão, o gateway limita as requisições autenticadas a `/v1/*` a 120 por minuto por cliente (IP de origem e chave de API). Configure `RATE_LIMIT_MAX_REQUESTS` e `RATE_LIMIT_WINDOW_MS` no `.env` se o seu cliente local precisar de limites diferentes.

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
<summary><b>Usando o SDK oficial da OpenAI para Node.js</b></summary>

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

Veja a [referência do API Gateway](./docs/api-reference.md) para todos os endpoints.

## Exemplos

- [`examples/openai-compat/`](./examples/openai-compat): script de integração direta com o SDK da OpenAI.
- [`examples/rag-example/`](./examples/rag-example): pipeline RAG de ponta a ponta usando o banco de dados vetorial Qdrant e embeddings do Ollama.

## Testado na CI

Cada pull request executa um teste de ponta a ponta no GitHub Actions (amd64 e arm64): init, up, download de um modelo bem pequeno (smollm:135m, cerca de 90 MB), listagem via /v1/models, uma requisição /v1/chat/completions sem streaming, limitação de taxa (401 e 429) e uma verificação de que a página inicial do Open WebUI responde. Ainda não coberto: respostas em streaming, embeddings, aceleração por GPU e hosts macOS/Windows.

## Limitações conhecidas

- Ainda não testado em hosts reais com macOS ou Windows.
- No Apple Silicon, os contêineres Docker não conseguem usar a GPU. Execute `pondok-ai init --native-ollama` para usar um Ollama instalado nativamente com Metal; veja o [guia de GPU](./docs/gpu-setup.md).
- Aceleração por GPU, respostas em streaming e embeddings ainda não são cobertos pela CI.
- As imagens são grandes (vários GB). Reserve bastante espaço livre em disco; um workspace na nuvem de 32 GB com 19 GB livres ficou sem espaço ao extrair a imagem do Ollama.

## Documentação

- [Visão geral da arquitetura](./docs/architecture.md)
- [Referência do API Gateway](./docs/api-reference.md)
- [Guia de configuração](./docs/configuration.md)
- [Configuração da aceleração por GPU (Metal / CUDA)](./docs/gpu-setup.md)
- [Solução de problemas e diagnóstico](./docs/troubleshooting.md)
- [Gravando a demo do README](./docs/demo/RECORDING.md)

## Contribuindo

Contribuições são bem-vindas! Confira o [CONTRIBUTING.md](./CONTRIBUTING.md) para começar.

## Licença

[MIT](./LICENSE) © 2026 colaboradores do pondok-ai
