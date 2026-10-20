<div align="center">

# pondok-ai

**Faites tourner votre propre stack d'IA privée en local, en une seule commande.**

Des LLM locaux, une interface de chat, la recherche vectorielle et une API compatible OpenAI, assemblés avec Docker Compose.

[![npm version](https://img.shields.io/npm/v/pondok-ai?logo=npm&color=cb3837)](https://www.npmjs.com/package/pondok-ai)
[![CI](https://github.com/rasidi3112/pondok-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/rasidi3112/pondok-ai/actions/workflows/ci.yml)
[![Node.js](https://img.shields.io/node/v/pondok-ai?logo=node.js&logoColor=white&color=339933)](https://nodejs.org)
[![Docker Compose v2](https://img.shields.io/badge/Docker%20Compose-v2-2496ED?logo=docker&logoColor=white)](https://docs.docker.com/compose/)
[![License: MIT](https://img.shields.io/github/license/rasidi3112/pondok-ai?color=blue)](./LICENSE)

[English](README.md) · [Bahasa Indonesia](README_id.md) · [한국어](README_ko.md) · [العربية](README_ar.md) · [Español](README_es.md) · [中文](README_zh.md) · **Français** · [日本語](README_ja.md) · [Deutsch](README_de.md) · [Português](README_pt.md) · [Русский](README_ru.md) · [हिन्दी](README_hi.md) · [Türkçe](README_tr.md) · [Italiano](README_it.md) · [Tiếng Việt](README_vi.md) · [Polski](README_pl.md) · [Bahasa Melayu](README_ms.md)

<sub>Les traductions sont générées automatiquement et peuvent être en retard sur le README anglais.</sub>

<br>

<a href="docs/demo/demo.mp4">
  <img src="docs/demo/demo.gif" alt="Démo de pondok-ai : init, up, puis une conversation avec llama3.2:3b dans Open WebUI" width="100%">
</a>

<sub>D'un dossier vide à la réponse d'un modèle local. Enregistré sur une machine sans GPU, avec les images et le modèle téléchargés à l'avance ; les temps d'attente sont accélérés et signalés à l'écran.<br>
<a href="docs/demo/demo.mp4"><b>▶ Voir la vidéo en 1080p</b></a></sub>

<br>

[Démarrage rapide](#démarrage-rapide) · [Fonctionnalités](#fonctionnalités) · [Captures d'écran](#captures-décran) · [Préréglages](#préréglages) · [CLI](#commandes-cli) · [Passerelle API](#passerelle-api) · [Documentation](#documentation)

</div>

---

## Présentation

`pondok-ai` est une CLI qui démarre un environnement d'IA complet et privé sur votre propre machine. Elle génère une stack Docker Compose adaptée à votre matériel, la lance avec des vérifications de santé et gère les modèles pour vous.

Les prompts, les conversations et les embeddings sont traités sur votre machine. Le premier téléchargement des images de conteneurs et des poids des modèles nécessite une connexion Internet.

```bash
npx pondok-ai init
npx pondok-ai up
```

<sub>« Pondok » désigne en indonésien une petite cabane ou un abri. Le paquet était auparavant publié sous le nom `local-ai-stack`.</sub>

## Fonctionnalités

| | |
|---|---|
| **Traitement local** | Les prompts, conversations, embeddings et l'inférence s'exécutent sur votre matériel. |
| **Détection du matériel** | Détecte l'OS, l'architecture, la RAM, le disque et le GPU (Apple Metal, NVIDIA CUDA), puis recommande un préréglage et des modèles adaptés. |
| **Préréglages modulaires** | Passez d'une interface de chat légère (`minimal`) à une stack RAG (`standard`) ou à un pipeline d'automatisation (`full`). |
| **Passerelle compatible OpenAI** | Pointez les SDK OpenAI ou LangChain vers `http://localhost:8000/v1` sans réécrire votre code. |
| **Gestionnaire de modèles** | Téléchargez, listez, inspectez et supprimez des modèles, avec des contrôles de RAM et de disque avant chaque téléchargement. |
| **Diagnostic** | `pondok-ai doctor` vérifie le démon Docker, les ports, la RAM, le disque et le GPU avant que les problèmes n'apparaissent. |
| **Sauvegardes** | Sauvegardez et restaurez les configurations et les volumes de données avec un contrôle d'intégrité SHA-256. |

## Démarrage rapide

**Prérequis :** Node.js 22 ou plus récent, Docker et Docker Compose v2.

**1. Initialiser la stack**

```bash
# Assistant de configuration interactif avec détection du matériel
npx pondok-ai init

# Ou en mode non interactif avec un préréglage choisi
npx pondok-ai init --preset standard --yes
```

**2. Démarrer les services** (attend que chaque service soit en bonne santé)

```bash
npx pondok-ai up
```

**3. Choisir et installer un modèle**

```bash
# Recommandations selon votre RAM, votre VRAM et l'espace disque libre
npx pondok-ai model recommend

# Installation avec vérification préalable de la mémoire et du disque
npx pondok-ai model install llama3.2:3b
```

Une fois lancée, ouvrez votre stack :

| Service | URL |
|---|---|
| Open WebUI | [http://localhost:3000](http://localhost:3000) |
| Passerelle API | [http://localhost:8000](http://localhost:8000) |
| Ollama | [http://localhost:11434](http://localhost:11434) |
| Qdrant | [http://localhost:6333/dashboard](http://localhost:6333/dashboard) *(si le port est exposé)* |

<details>
<summary><b>Scripts d'installation</b> (expérimentaux, non couverts par la CI)</summary>

**macOS et Linux**

```bash
curl -fsSL https://raw.githubusercontent.com/rasidi3112/pondok-ai/main/scripts/install.sh | bash
```

**Windows (PowerShell)**

```powershell
iwr -useb https://raw.githubusercontent.com/rasidi3112/pondok-ai/main/scripts/install.ps1 | iex
```

</details>

## Captures d'écran

<p align="center">
  <img src="docs/demo/screenshots/chat.png" alt="Open WebUI répondant à une question avec llama3.2:3b exécuté en local" width="100%">
  <br>
  <sub>Open WebUI en conversation avec <code>llama3.2:3b</code>, servi par le conteneur Ollama local.</sub>
</p>

<table>
  <tr>
    <td width="50%"><img src="docs/demo/screenshots/doctor.png" alt="Sortie de pondok-ai doctor : informations système, état de Docker et vérification des prérequis"></td>
    <td width="50%"><img src="docs/demo/screenshots/model-recommend.png" alt="Sortie de pondok-ai model recommend : modèles compatibles, limites et incompatibles pour cette machine"></td>
  </tr>
  <tr>
    <td align="center"><sub><code>pondok-ai doctor</code> vérifie Docker, la RAM, le disque et le GPU</sub></td>
    <td align="center"><sub><code>pondok-ai model recommend</code> classe les modèles selon ce que votre matériel peut faire tourner</sub></td>
  </tr>
</table>

## Préréglages

| Préréglage | Services inclus | RAM min. | Recommandé pour |
|---|---|---|---|
| **`minimal`** | Ollama, Open WebUI | 8 Go | Chat local rapide, expérimentations légères |
| **`standard`** *(par défaut)* | Ollama, Open WebUI, PostgreSQL, Qdrant, API Gateway | 16 Go | Pipelines RAG, développement d'applications, remplacement d'OpenAI |
| **`full`** | Standard + moteur d'automatisation n8n | 16+ Go | Agents IA autonomes, automatisation visuelle de workflows |

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

Voir la [vue d'ensemble de l'architecture](./docs/architecture.md) pour plus de détails.

## Commandes CLI

| Commande | Description |
|---|---|
| `pondok-ai init` | Lance l'assistant de configuration interactif avec détection du matériel |
| `pondok-ai up` | Valide la configuration Compose, démarre les conteneurs et attend les vérifications de santé |
| `pondok-ai down` | Arrête et supprime les conteneurs de la stack |
| `pondok-ai start` | Démarre les conteneurs existants arrêtés |
| `pondok-ai stop` | Arrête les conteneurs en cours d'exécution |
| `pondok-ai restart` | Redémarre les conteneurs de la stack |
| `pondok-ai status` | Affiche l'état de santé des conteneurs et les URL |
| `pondok-ai logs [service]` | Affiche les journaux (`-f` pour les suivre en continu) |
| `pondok-ai doctor` | Diagnostique Docker, la RAM, le GPU/VRAM, les ports et les recommandations de modèles |
| `pondok-ai update` | Retélécharge les images épinglées configurées, avec sauvegarde automatique et vérifications de santé |
| `pondok-ai backup` | Sauvegarde les configurations et les volumes de données avec contrôle d'intégrité SHA-256 (non chiffré) |
| `pondok-ai restore <path>` | Restaure depuis une sauvegarde vérifiée par SHA-256 (non chiffrée) |
| `pondok-ai reset` | Réinitialise la stack (conserve les volumes sauf si `--delete-data` est indiqué) |
| `pondok-ai config` | Inspecte ou modifie la configuration active |
| `pondok-ai model list` | Liste les modèles téléchargés |
| `pondok-ai model recommend` | Recommandations de modèles adaptées au matériel (RAM, VRAM, disque) |
| `pondok-ai model install <name>` | Télécharge un nouveau modèle avec vérification préalable des ressources |
| `pondok-ai model remove <name>` | Supprime un modèle installé |
| `pondok-ai model status` | Inspecte l'empreinte des modèles sur les ressources |

Les images sont épinglées à des versions explicites. `pondok-ai update` rafraîchit les versions configurées ; il ne choisit pas de versions plus récentes. Après avoir installé une CLI plus récente, lancez `pondok-ai update --upgrade-images` pour migrer uniquement les anciennes étiquettes d'image par défaut de la CLI. Les valeurs d'image personnalisées sont conservées.

## Passerelle API

La passerelle API fournit des endpoints REST OpenAI utilisables directement à la place de l'original. Définissez `PONDOK_AI_API_KEY` avec la valeur générée de `API_SECRET_KEY` avant d'appeler un endpoint `/v1/*`.

Par défaut, la passerelle limite les requêtes authentifiées vers `/v1/*` à 120 par minute et par client (IP source et clé d'API). Configurez `RATE_LIMIT_MAX_REQUESTS` et `RATE_LIMIT_WINDOW_MS` dans `.env` si votre client local a besoin d'autres limites.

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
<summary><b>Avec le SDK officiel OpenAI pour Node.js</b></summary>

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

Voir la [référence de la passerelle API](./docs/api-reference.md) pour tous les endpoints.

## Exemples

- [`examples/openai-compat/`](./examples/openai-compat) : script d'intégration directe du SDK OpenAI.
- [`examples/rag-example/`](./examples/rag-example) : pipeline RAG de bout en bout avec la base de données vectorielle Qdrant et les embeddings d'Ollama.

## Testé en CI

Chaque pull request exécute un test de bout en bout sur GitHub Actions (amd64 et arm64) : init, up, téléchargement d'un très petit modèle (smollm:135m, environ 90 Mo), listage via /v1/models, une requête /v1/chat/completions sans streaming, la limitation de débit (401 et 429) et une vérification que la page d'accueil d'Open WebUI répond. Pas encore couvert : les réponses en streaming, les embeddings, l'accélération GPU et les hôtes macOS/Windows.

## Limitations connues

- Pas encore testé sur de vrais hôtes macOS ou Windows.
- Sur Apple Silicon, les conteneurs Docker ne peuvent pas utiliser le GPU. Lancez `pondok-ai init --native-ollama` pour utiliser à la place un Ollama installé nativement avec Metal ; voir le [guide GPU](./docs/gpu-setup.md).
- L'accélération GPU, les réponses en streaming et les embeddings ne sont pas encore couverts par la CI.
- Les images sont volumineuses (plusieurs Go). Prévoyez beaucoup d'espace disque libre ; un espace de travail cloud de 32 Go avec 19 Go libres a manqué d'espace en extrayant l'image d'Ollama.

## Documentation

- [Vue d'ensemble de l'architecture](./docs/architecture.md)
- [Référence de la passerelle API](./docs/api-reference.md)
- [Guide de configuration](./docs/configuration.md)
- [Configuration de l'accélération GPU (Metal / CUDA)](./docs/gpu-setup.md)
- [Dépannage et diagnostic](./docs/troubleshooting.md)
- [Enregistrer la démo du README](./docs/demo/RECORDING.md)

## Contribuer

Les contributions sont les bienvenues ! Consultez [CONTRIBUTING.md](./CONTRIBUTING.md) pour commencer.

## Licence

[MIT](./LICENSE) © 2026 contributeurs de pondok-ai
