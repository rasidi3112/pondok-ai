<div align="center">

# pondok-ai

**Esegui il tuo stack di IA privato in locale con un solo comando.**

LLM locali, un'interfaccia di chat, ricerca vettoriale e un'API compatibile con OpenAI, collegati con Docker Compose.

[![npm version](https://img.shields.io/npm/v/pondok-ai?logo=npm&color=cb3837)](https://www.npmjs.com/package/pondok-ai)
[![CI](https://github.com/rasidi3112/pondok-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/rasidi3112/pondok-ai/actions/workflows/ci.yml)
[![Node.js](https://img.shields.io/node/v/pondok-ai?logo=node.js&logoColor=white&color=339933)](https://nodejs.org)
[![Docker Compose v2](https://img.shields.io/badge/Docker%20Compose-v2-2496ED?logo=docker&logoColor=white)](https://docs.docker.com/compose/)
[![License: MIT](https://img.shields.io/github/license/rasidi3112/pondok-ai?color=blue)](./LICENSE)

[English](README.md) · [Bahasa Indonesia](README_id.md) · [한국어](README_ko.md) · [العربية](README_ar.md) · [Español](README_es.md) · [中文](README_zh.md) · [Français](README_fr.md) · [日本語](README_ja.md) · [Deutsch](README_de.md) · [Português](README_pt.md) · [Русский](README_ru.md) · [हिन्दी](README_hi.md) · [Türkçe](README_tr.md) · **Italiano** · [Tiếng Việt](README_vi.md) · [Polski](README_pl.md) · [Bahasa Melayu](README_ms.md)

<sub>Le traduzioni sono generate automaticamente e potrebbero non essere allineate al README in inglese.</sub>

<br>

<a href="docs/demo/demo.mp4">
  <img src="docs/demo/demo.gif" alt="Demo di pondok-ai: init, up e poi una chat con llama3.2:3b in Open WebUI" width="100%">
</a>

<sub>Da una cartella vuota alla risposta di un modello locale. Registrato su una macchina solo CPU, con immagini e modello già scaricati; le attese sono accelerate e indicate sullo schermo.<br>
<a href="docs/demo/demo.mp4"><b>▶ Guarda il video in 1080p</b></a></sub>

<br>

[Avvio rapido](#avvio-rapido) · [Funzionalità](#funzionalità) · [Screenshot](#screenshot) · [Preset](#preset) · [CLI](#comandi-cli) · [API Gateway](#api-gateway) · [Documentazione](#documentazione)

</div>

---

## Panoramica

`pondok-ai` è una CLI che avvia un ambiente di IA completo e privato sulla tua macchina. Genera uno stack Docker Compose adatto al tuo hardware, lo avvia con controlli di salute e gestisce i modelli al posto tuo.

Prompt, chat ed embedding vengono elaborati sulla tua macchina. Il primo download delle immagini dei container e dei pesi dei modelli richiede una connessione a Internet.

```bash
npx pondok-ai init
npx pondok-ai up
```

<sub>Pondok in indonesiano indica una piccola capanna o un rifugio. Il pacchetto era pubblicato in precedenza come `local-ai-stack`.</sub>

## Funzionalità

| | |
|---|---|
| **Elaborazione locale** | Prompt, chat, embedding e inferenza girano sul tuo hardware. |
| **Rilevamento dell'hardware** | Rileva sistema operativo, architettura, RAM, disco e GPU (Apple Metal, NVIDIA CUDA) e consiglia un preset e modelli adatti. |
| **Preset modulari** | Passa da un'interfaccia di chat leggera (`minimal`) a uno stack RAG (`standard`) o a una pipeline di automazione (`full`). |
| **Gateway compatibile con OpenAI** | Punta gli SDK di OpenAI o LangChain su `http://localhost:8000/v1` senza riscrivere il codice. |
| **Gestore dei modelli** | Scarica, elenca, ispeziona e rimuovi modelli, con controlli di RAM e disco prima di ogni download. |
| **Diagnostica** | `pondok-ai doctor` controlla il demone Docker, le porte, la RAM, il disco e la GPU prima che sorgano problemi. |
| **Backup** | Esegui backup e ripristino di configurazioni e volumi di dati con verifica di integrità SHA-256. |

## Avvio rapido

**Prerequisiti:** Node.js 22 o successivo, Docker e Docker Compose v2.

**1. Inizializza lo stack**

```bash
# Procedura guidata interattiva con rilevamento dell'hardware
npx pondok-ai init

# Oppure in modo non interattivo con un preset a scelta
npx pondok-ai init --preset standard --yes
```

**2. Avvia i servizi** (attende finché ogni servizio è in salute)

```bash
npx pondok-ai up
```

**3. Scegli e installa un modello**

```bash
# Consigli in base a RAM, VRAM e spazio libero su disco
npx pondok-ai model recommend

# Installazione con verifica preliminare di memoria e disco
npx pondok-ai model install llama3.2:3b
```

Una volta avviato, apri il tuo stack:

| Servizio | URL |
|---|---|
| Open WebUI | [http://localhost:3000](http://localhost:3000) |
| API Gateway | [http://localhost:8000](http://localhost:8000) |
| Ollama | [http://localhost:11434](http://localhost:11434) |
| Qdrant | [http://localhost:6333/dashboard](http://localhost:6333/dashboard) *(se la porta è mappata)* |

<details>
<summary><b>Script di installazione</b> (sperimentali, non coperti dalla CI)</summary>

**macOS e Linux**

```bash
curl -fsSL https://raw.githubusercontent.com/rasidi3112/pondok-ai/main/scripts/install.sh | bash
```

**Windows (PowerShell)**

```powershell
iwr -useb https://raw.githubusercontent.com/rasidi3112/pondok-ai/main/scripts/install.ps1 | iex
```

</details>

## Screenshot

<p align="center">
  <img src="docs/demo/screenshots/chat.png" alt="Open WebUI risponde a una domanda con llama3.2:3b in esecuzione in locale" width="100%">
  <br>
  <sub>Open WebUI in chat con <code>llama3.2:3b</code>, servito dal container Ollama locale.</sub>
</p>

<table>
  <tr>
    <td width="50%"><img src="docs/demo/screenshots/doctor.png" alt="Output di pondok-ai doctor: informazioni di sistema, stato di Docker e verifica dei requisiti"></td>
    <td width="50%"><img src="docs/demo/screenshots/model-recommend.png" alt="Output di pondok-ai model recommend: modelli compatibili, al limite e incompatibili per questa macchina"></td>
  </tr>
  <tr>
    <td align="center"><sub><code>pondok-ai doctor</code> controlla Docker, RAM, disco e GPU</sub></td>
    <td align="center"><sub><code>pondok-ai model recommend</code> ordina i modelli in base a ciò che il tuo hardware può eseguire</sub></td>
  </tr>
</table>

## Preset

| Preset | Servizi inclusi | RAM minima | Consigliato per |
|---|---|---|---|
| **`minimal`** | Ollama, Open WebUI | 8 GB | Chat locale veloce, sperimentazione leggera |
| **`standard`** *(predefinito)* | Ollama, Open WebUI, PostgreSQL, Qdrant, API Gateway | 16 GB | Pipeline RAG, sviluppo di applicazioni, sostituto di OpenAI |
| **`full`** | Standard + motore di automazione n8n | 16+ GB | Agenti IA autonomi, automazione visuale dei flussi di lavoro |

## Architettura

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

Per i dettagli consulta la [panoramica dell'architettura](./docs/architecture.md).

## Comandi CLI

| Comando | Descrizione |
|---|---|
| `pondok-ai init` | Avvia la procedura guidata di configurazione interattiva con rilevamento dell'hardware |
| `pondok-ai up` | Convalida la configurazione Compose, avvia i container e attende i controlli di salute |
| `pondok-ai down` | Arresta e rimuove i container dello stack |
| `pondok-ai start` | Avvia i container esistenti arrestati |
| `pondok-ai stop` | Arresta i container in esecuzione |
| `pondok-ai restart` | Riavvia i container dello stack |
| `pondok-ai status` | Mostra lo stato di salute dei container e gli URL |
| `pondok-ai logs [service]` | Visualizza i log (`-f` per seguirli in streaming) |
| `pondok-ai doctor` | Diagnostica Docker, RAM, GPU/VRAM, porte e consigli sui modelli |
| `pondok-ai update` | Riscarica le immagini fissate configurate, con backup automatico e controlli di salute |
| `pondok-ai backup` | Backup di configurazioni e volumi di dati con verifica di integrità SHA-256 (non cifrato) |
| `pondok-ai restore <path>` | Ripristina da un backup verificato con SHA-256 (non cifrato) |
| `pondok-ai reset` | Reimposta lo stack (conserva i volumi a meno che non sia specificato `--delete-data`) |
| `pondok-ai config` | Ispeziona o modifica la configurazione attiva |
| `pondok-ai model list` | Elenca i modelli scaricati |
| `pondok-ai model recommend` | Consigli sui modelli in base all'hardware (RAM, VRAM, disco) |
| `pondok-ai model install <name>` | Scarica un nuovo modello con controlli preliminari sulle risorse |
| `pondok-ai model remove <name>` | Elimina un modello installato |
| `pondok-ai model status` | Ispeziona l'impronta dei modelli sulle risorse |

Le immagini sono fissate a versioni esplicite. `pondok-ai update` aggiorna le versioni configurate; non seleziona release più recenti. Dopo aver installato una CLI più recente, esegui `pondok-ai update --upgrade-images` per migrare solo i vecchi tag di immagine predefiniti della CLI. I valori di immagine personalizzati vengono mantenuti.

## API Gateway

L'API Gateway fornisce endpoint REST OpenAI utilizzabili come sostituto diretto. Imposta `PONDOK_AI_API_KEY` sulla `API_SECRET_KEY` generata prima di chiamare un endpoint `/v1/*`.

Per impostazione predefinita il gateway limita le richieste autenticate a `/v1/*` a 120 al minuto per client (IP di origine e chiave API). Configura `RATE_LIMIT_MAX_REQUESTS` e `RATE_LIMIT_WINDOW_MS` in `.env` se il tuo client locale ha bisogno di limiti diversi.

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
<summary><b>Con l'SDK ufficiale OpenAI per Node.js</b></summary>

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

Consulta il [riferimento dell'API Gateway](./docs/api-reference.md) per tutti gli endpoint.

## Esempi

- [`examples/openai-compat/`](./examples/openai-compat): script di integrazione diretta con l'SDK di OpenAI.
- [`examples/rag-example/`](./examples/rag-example): pipeline RAG end-to-end con il database vettoriale Qdrant e gli embedding di Ollama.

## Testato in CI

Ogni pull request esegue un test end-to-end su GitHub Actions (amd64 e arm64): init, up, download di un modello molto piccolo (smollm:135m, circa 90 MB), elenco tramite /v1/models, una richiesta /v1/chat/completions senza streaming, limitazione della frequenza (401 e 429) e un controllo che la pagina iniziale di Open WebUI risponda. Non ancora coperti: risposte in streaming, embedding, accelerazione GPU e host macOS/Windows.

## Limitazioni note

- Non ancora testato su host macOS o Windows reali.
- Su Apple Silicon i container Docker non possono usare la GPU. Esegui `pondok-ai init --native-ollama` per usare invece un Ollama installato nativamente con Metal; consulta la [guida GPU](./docs/gpu-setup.md).
- Accelerazione GPU, risposte in streaming ed embedding non sono ancora coperti dalla CI.
- Le immagini sono grandi (diversi GB). Prevedi molto spazio libero su disco; un workspace cloud da 32 GB con 19 GB liberi ha esaurito lo spazio durante l'estrazione dell'immagine di Ollama.

## Documentazione

- [Panoramica dell'architettura](./docs/architecture.md)
- [Riferimento dell'API Gateway](./docs/api-reference.md)
- [Guida alla configurazione](./docs/configuration.md)
- [Configurazione dell'accelerazione GPU (Metal / CUDA)](./docs/gpu-setup.md)
- [Risoluzione dei problemi e diagnostica](./docs/troubleshooting.md)
- [Registrare la demo del README](./docs/demo/RECORDING.md)

## Contribuire

I contributi sono benvenuti! Leggi [CONTRIBUTING.md](./CONTRIBUTING.md) per iniziare.

## Licenza

[MIT](./LICENSE) © 2026 contributori di pondok-ai
