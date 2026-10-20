<div align="center">

# pondok-ai

**Betreiben Sie Ihren eigenen privaten KI-Stack lokal mit einem einzigen Befehl.**

Lokale LLMs, eine Chat-Oberfläche, Vektorsuche und eine OpenAI-kompatible API, verbunden mit Docker Compose.

[![npm version](https://img.shields.io/npm/v/pondok-ai?logo=npm&color=cb3837)](https://www.npmjs.com/package/pondok-ai)
[![CI](https://github.com/rasidi3112/pondok-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/rasidi3112/pondok-ai/actions/workflows/ci.yml)
[![Node.js](https://img.shields.io/node/v/pondok-ai?logo=node.js&logoColor=white&color=339933)](https://nodejs.org)
[![Docker Compose v2](https://img.shields.io/badge/Docker%20Compose-v2-2496ED?logo=docker&logoColor=white)](https://docs.docker.com/compose/)
[![License: MIT](https://img.shields.io/github/license/rasidi3112/pondok-ai?color=blue)](./LICENSE)

[English](README.md) · [Bahasa Indonesia](README_id.md) · [한국어](README_ko.md) · [العربية](README_ar.md) · [Español](README_es.md) · [中文](README_zh.md) · [Français](README_fr.md) · [日本語](README_ja.md) · **Deutsch** · [Português](README_pt.md) · [Русский](README_ru.md) · [हिन्दी](README_hi.md) · [Türkçe](README_tr.md) · [Italiano](README_it.md) · [Tiếng Việt](README_vi.md) · [Polski](README_pl.md) · [Bahasa Melayu](README_ms.md)

<sub>Übersetzungen werden maschinell erstellt und können hinter der englischen README zurückliegen.</sub>

<br>

<a href="docs/demo/demo.mp4">
  <img src="docs/demo/demo.gif" alt="pondok-ai-Demo: init, up und anschließend ein Chat mit llama3.2:3b in Open WebUI" width="100%">
</a>

<sub>Von einem leeren Ordner bis zur Antwort eines lokalen Modells. Aufgenommen auf einem Rechner nur mit CPU, Images und Modell waren vorab heruntergeladen; Wartezeiten sind beschleunigt und auf dem Bildschirm gekennzeichnet.<br>
<a href="docs/demo/demo.mp4"><b>▶ Video in 1080p ansehen</b></a></sub>

<br>

[Schnellstart](#schnellstart) · [Funktionen](#funktionen) · [Screenshots](#screenshots) · [Voreinstellungen](#voreinstellungen) · [CLI](#cli-befehle) · [API-Gateway](#api-gateway) · [Dokumentation](#dokumentation)

</div>

---

## Überblick

`pondok-ai` ist eine CLI, die eine vollständige, private KI-Umgebung auf Ihrem eigenen Rechner startet. Sie erzeugt einen auf Ihre Hardware abgestimmten Docker-Compose-Stack, startet ihn mit Health-Checks und verwaltet die Modelle für Sie.

Prompts, Chats und Embeddings werden auf Ihrem Rechner verarbeitet. Für das erstmalige Herunterladen der Container-Images und Modellgewichte ist eine Internetverbindung erforderlich.

```bash
npx pondok-ai init
npx pondok-ai up
```

<sub>„Pondok“ ist das indonesische Wort für eine kleine Hütte oder Unterkunft. Das Paket wurde früher als `local-ai-stack` veröffentlicht.</sub>

## Funktionen

| | |
|---|---|
| **Lokale Verarbeitung** | Prompts, Chats, Embeddings und Inferenz laufen auf Ihrer Hardware. |
| **Hardware-Erkennung** | Erkennt Betriebssystem, Architektur, RAM, Festplatte und GPU (Apple Metal, NVIDIA CUDA) und empfiehlt eine passende Voreinstellung und passende Modelle. |
| **Modulare Voreinstellungen** | Skalieren Sie von einer schlanken Chat-Oberfläche (`minimal`) über einen RAG-Stack (`standard`) bis zu einer Automatisierungspipeline (`full`). |
| **OpenAI-kompatibles Gateway** | Richten Sie die OpenAI-SDKs oder LangChain auf `http://localhost:8000/v1`, ohne Code umzuschreiben. |
| **Modell-Manager** | Modelle herunterladen, auflisten, inspizieren und entfernen, mit RAM- und Speicherprüfung vor jedem Download. |
| **Diagnose** | `pondok-ai doctor` prüft Docker-Daemon, Ports, RAM, Festplatte und GPU, bevor Probleme auftreten. |
| **Backups** | Sichern und Wiederherstellen von Konfigurationen und Datenvolumes mit SHA-256-Integritätsprüfung. |

## Schnellstart

**Voraussetzungen:** Node.js 22 oder neuer, Docker und Docker Compose v2.

**1. Stack initialisieren**

```bash
# Interaktiver Einrichtungsassistent mit Hardware-Erkennung
npx pondok-ai init

# Oder nicht-interaktiv mit einer gewählten Voreinstellung
npx pondok-ai init --preset standard --yes
```

**2. Dienste starten** (wartet, bis alle Dienste gesund sind)

```bash
npx pondok-ai up
```

**3. Ein Modell auswählen und installieren**

```bash
# Empfehlungen basierend auf RAM, VRAM und freiem Speicherplatz
npx pondok-ai model recommend

# Installation mit vorheriger Speicher- und Festplattenprüfung
npx pondok-ai model install llama3.2:3b
```

Sobald alles läuft, öffnen Sie Ihren Stack:

| Dienst | URL |
|---|---|
| Open WebUI | [http://localhost:3000](http://localhost:3000) |
| API-Gateway | [http://localhost:8000](http://localhost:8000) |
| Ollama | [http://localhost:11434](http://localhost:11434) |
| Qdrant | [http://localhost:6333/dashboard](http://localhost:6333/dashboard) *(wenn zugeordnet)* |

<details>
<summary><b>Installationsskripte</b> (experimentell, nicht durch CI abgedeckt)</summary>

**macOS und Linux**

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
  <img src="docs/demo/screenshots/chat.png" alt="Open WebUI beantwortet eine Frage mit dem lokal laufenden llama3.2:3b" width="100%">
  <br>
  <sub>Open WebUI im Chat mit <code>llama3.2:3b</code>, bereitgestellt vom lokalen Ollama-Container.</sub>
</p>

<table>
  <tr>
    <td width="50%"><img src="docs/demo/screenshots/doctor.png" alt="Ausgabe von pondok-ai doctor: Systeminformationen, Docker-Status und Anforderungsprüfungen"></td>
    <td width="50%"><img src="docs/demo/screenshots/model-recommend.png" alt="Ausgabe von pondok-ai model recommend: kompatible, knapp passende und inkompatible Modelle für diesen Rechner"></td>
  </tr>
  <tr>
    <td align="center"><sub><code>pondok-ai doctor</code> prüft Docker, RAM, Festplatte und GPU</sub></td>
    <td align="center"><sub><code>pondok-ai model recommend</code> sortiert Modelle danach, was Ihre Hardware ausführen kann</sub></td>
  </tr>
</table>

## Voreinstellungen

| Voreinstellung | Enthaltene Dienste | Min. RAM | Empfohlen für |
|---|---|---|---|
| **`minimal`** | Ollama, Open WebUI | 8 GB | Schneller lokaler Chat, leichte Experimente |
| **`standard`** *(Standard)* | Ollama, Open WebUI, PostgreSQL, Qdrant, API-Gateway | 16 GB | RAG-Pipelines, App-Entwicklung, OpenAI-Ersatz |
| **`full`** | Standard + n8n-Automatisierungs-Engine | 16+ GB | Autonome KI-Agenten, visuelle Workflow-Automatisierung |

## Architektur

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

Details finden Sie in der [Architektur-Übersicht](./docs/architecture.md).

## CLI-Befehle

| Befehl | Beschreibung |
|---|---|
| `pondok-ai init` | Interaktiven Konfigurationsassistenten mit Hardware-Erkennung ausführen |
| `pondok-ai up` | Compose-Konfiguration validieren, Container starten und auf Health-Checks warten |
| `pondok-ai down` | Stack-Container stoppen und entfernen |
| `pondok-ai start` | Vorhandene, gestoppte Container starten |
| `pondok-ai stop` | Laufende Container stoppen |
| `pondok-ai restart` | Stack-Container neu starten |
| `pondok-ai status` | Container-Zustand und URLs anzeigen |
| `pondok-ai logs [service]` | Logs anzeigen (`-f` zum Streamen) |
| `pondok-ai doctor` | Docker, RAM, GPU/VRAM, Ports und Modellempfehlungen diagnostizieren |
| `pondok-ai update` | Konfigurierte, gepinnte Images mit automatischem Backup und Health-Checks neu laden |
| `pondok-ai backup` | Konfigurationen und Datenvolumes mit SHA-256-Integritätsprüfung sichern (nicht verschlüsselt) |
| `pondok-ai restore <path>` | Aus einem SHA-256-geprüften Backup wiederherstellen (nicht verschlüsselt) |
| `pondok-ai reset` | Stack zurücksetzen (Volumes bleiben erhalten, außer `--delete-data` ist angegeben) |
| `pondok-ai config` | Aktive Konfiguration anzeigen oder bearbeiten |
| `pondok-ai model list` | Heruntergeladene Modelle auflisten |
| `pondok-ai model recommend` | Auf die Hardware abgestimmte Modellempfehlungen (RAM, VRAM, Festplatte) |
| `pondok-ai model install <name>` | Neues Modell mit vorheriger Ressourcenprüfung laden |
| `pondok-ai model remove <name>` | Installiertes Modell löschen |
| `pondok-ai model status` | Ressourcenbedarf der Modelle anzeigen |

Images sind auf feste Versionen gepinnt. `pondok-ai update` aktualisiert die konfigurierten Versionen; es wählt keine neueren Releases aus. Führen Sie nach der Installation einer neueren CLI `pondok-ai update --upgrade-images` aus, um nur die alten Standard-Image-Tags der CLI zu migrieren. Benutzerdefinierte Image-Werte bleiben erhalten.

## API-Gateway

Das API-Gateway stellt OpenAI-REST-Endpunkte als direkten Ersatz bereit. Setzen Sie `PONDOK_AI_API_KEY` auf den generierten `API_SECRET_KEY`, bevor Sie einen `/v1/*`-Endpunkt aufrufen.

Das Gateway begrenzt authentifizierte `/v1/*`-Anfragen pro Client (Quell-IP und API-Schlüssel) standardmäßig auf 120 Anfragen pro Minute. Konfigurieren Sie `RATE_LIMIT_MAX_REQUESTS` und `RATE_LIMIT_WINDOW_MS` in `.env`, wenn Ihr lokaler Client andere Limits benötigt.

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
<summary><b>Mit dem offiziellen OpenAI Node.js SDK</b></summary>

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

Alle Endpunkte finden Sie in der [API-Gateway-Referenz](./docs/api-reference.md).

## Beispiele

- [`examples/openai-compat/`](./examples/openai-compat): Integrationsskript für das OpenAI-SDK als direkter Ersatz.
- [`examples/rag-example/`](./examples/rag-example): End-to-End-RAG-Pipeline mit der Vektordatenbank Qdrant und Ollama-Embeddings.

## In CI getestet

Jeder Pull Request führt einen End-to-End-Test auf GitHub Actions aus (amd64 und arm64): init, up, Laden eines sehr kleinen Modells (smollm:135m, etwa 90 MB), Auflisten über /v1/models, eine nicht-streamende /v1/chat/completions-Anfrage, Rate-Limiting (401 und 429) sowie eine Prüfung, dass die Startseite von Open WebUI antwortet. Noch nicht abgedeckt: Streaming-Antworten, Embeddings, GPU-Beschleunigung und macOS-/Windows-Hosts.

## Bekannte Einschränkungen

- Noch nicht auf echten macOS- oder Windows-Hosts getestet.
- Auf Apple Silicon können Docker-Container die GPU nicht nutzen. Führen Sie `pondok-ai init --native-ollama` aus, um stattdessen ein nativ installiertes Ollama mit Metal zu verwenden; siehe [GPU-Anleitung](./docs/gpu-setup.md).
- GPU-Beschleunigung, Streaming-Antworten und Embeddings sind noch nicht durch CI abgedeckt.
- Die Images sind groß (mehrere GB). Planen Sie reichlich freien Speicherplatz ein; einem Cloud-Workspace mit 32 GB und 19 GB freiem Speicher ging beim Entpacken des Ollama-Images der Platz aus.

## Dokumentation

- [Architektur-Übersicht](./docs/architecture.md)
- [API-Gateway-Referenz](./docs/api-reference.md)
- [Konfigurationsleitfaden](./docs/configuration.md)
- [Einrichtung der GPU-Beschleunigung (Metal / CUDA)](./docs/gpu-setup.md)
- [Fehlerbehebung & Diagnose](./docs/troubleshooting.md)
- [Aufnahme der README-Demo](./docs/demo/RECORDING.md)

## Mitwirken

Beiträge sind willkommen! Lesen Sie [CONTRIBUTING.md](./CONTRIBUTING.md), um loszulegen.

## Lizenz

[MIT](./LICENSE) © 2026 pondok-ai-Mitwirkende
