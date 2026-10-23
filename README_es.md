<div align="center">

# pondok-ai

**Ejecuta tu propio stack de IA privado en local con un solo comando.**

LLM locales, una interfaz de chat, búsqueda vectorial y una API compatible con OpenAI, conectados con Docker Compose.

[![npm version](https://img.shields.io/npm/v/pondok-ai?logo=npm&color=cb3837)](https://www.npmjs.com/package/pondok-ai)
[![CI](https://github.com/rasidi3112/pondok-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/rasidi3112/pondok-ai/actions/workflows/ci.yml)
[![Node.js](https://img.shields.io/node/v/pondok-ai?logo=node.js&logoColor=white&color=339933)](https://nodejs.org)
[![Docker Compose v2](https://img.shields.io/badge/Docker%20Compose-v2-2496ED?logo=docker&logoColor=white)](https://docs.docker.com/compose/)
[![License: MIT](https://img.shields.io/github/license/rasidi3112/pondok-ai?color=blue)](./LICENSE)

[English](README.md) · [Bahasa Indonesia](README_id.md) · [한국어](README_ko.md) · [العربية](README_ar.md) · **Español** · [中文](README_zh.md) · [Français](README_fr.md) · [日本語](README_ja.md) · [Deutsch](README_de.md) · [Português](README_pt.md) · [Русский](README_ru.md) · [हिन्दी](README_hi.md) · [Türkçe](README_tr.md) · [Italiano](README_it.md) · [Tiếng Việt](README_vi.md) · [Polski](README_pl.md) · [Bahasa Melayu](README_ms.md)

<sub>Las traducciones se generan automáticamente y pueden ir por detrás del README en inglés.</sub>

<br>

<a href="docs/demo/demo.mp4">
  <img src="docs/demo/demo.gif" alt="Demo de pondok-ai: init, up y después un chat con gemma3:1b en Open WebUI" width="100%">
</a>

<sub>De una carpeta vacía a la respuesta de un modelo local. Grabado en un Mac con Apple M1 y Ollama nativo (GPU Metal), con las imágenes y el modelo descargados de antemano; la espera hasta que arranca Open WebUI está acelerada y señalada en pantalla. El Mac tenía menos de 10 GB de disco libre, así que <code>init</code> se ejecuta con <code>--force</code>.<br>
<a href="docs/demo/demo.mp4"><b>▶ Ver el vídeo en 1080p</b></a></sub>

<br>

[Inicio rápido](#inicio-rápido) · [Características](#características) · [Capturas](#capturas-de-pantalla) · [Presets](#presets) · [CLI](#comandos-de-la-cli) · [API Gateway](#api-gateway) · [Documentación](#documentación)

</div>

---

## Descripción general

`pondok-ai` es una CLI que levanta un entorno de IA completo y privado en tu propia máquina. Genera un stack de Docker Compose adaptado a tu hardware, lo inicia con comprobaciones de salud y gestiona los modelos por ti.

Los prompts, los chats y los embeddings se procesan en tu máquina. La primera descarga de las imágenes de contenedor y de los pesos de los modelos requiere conexión a internet.

```bash
npx pondok-ai init
npx pondok-ai up
```

<sub>Pondok significa en indonesio una pequeña cabaña o refugio. El paquete se publicaba antes como `local-ai-stack`.</sub>

## Características

| | |
|---|---|
| **Procesamiento local** | Los prompts, chats, embeddings y la inferencia se ejecutan en tu hardware. |
| **Detección de hardware** | Detecta sistema operativo, arquitectura, RAM, disco y GPU (Apple Metal, NVIDIA CUDA) y recomienda un preset y modelos adecuados. |
| **Presets modulares** | Escala desde una interfaz de chat ligera (`minimal`) hasta un stack RAG (`standard`) o un pipeline de automatización (`full`). |
| **Gateway compatible con OpenAI** | Apunta los SDK de OpenAI o LangChain a `http://localhost:8000/v1` sin reescribir código. |
| **Gestor de modelos** | Descarga, lista, inspecciona y elimina modelos, con comprobaciones de RAM y disco antes de cada descarga. |
| **Diagnóstico** | `pondok-ai doctor` revisa el daemon de Docker, los puertos, la RAM, el disco y la GPU antes de que surjan problemas. |
| **Copias de seguridad** | Respalda y restaura configuraciones y volúmenes de datos con verificación de integridad SHA-256. |

## Inicio rápido

**Requisitos previos:** Node.js 22 o superior, Docker y Docker Compose v2.

**1. Inicializa el stack**

```bash
# Asistente de configuración interactivo con detección de hardware
npx pondok-ai init

# O de forma no interactiva con un preset elegido
npx pondok-ai init --preset standard --yes
```

**2. Inicia los servicios** (espera hasta que todos estén sanos)

```bash
npx pondok-ai up
```

El primer arranque puede tardar unos minutos mientras Open WebUI descarga sus modelos auxiliares. En un Mac con Ollama nativo, `up` también inicia Ollama si no está en ejecución. Si aún no hay ningún modelo instalado, `up` te indica cuál se ajusta a tu RAM.

**3. Elige e instala un modelo**

```bash
# Recomendaciones según tu RAM, VRAM y disco libre
npx pondok-ai model recommend

# Instalación con comprobación previa de memoria y disco
npx pondok-ai model install llama3.2:3b
```

Una vez en marcha, abre tu stack:

| Servicio | URL |
|---|---|
| Open WebUI | [http://localhost:3000](http://localhost:3000) |
| API Gateway | [http://localhost:8000](http://localhost:8000) |
| Ollama | [http://localhost:11434](http://localhost:11434) |
| Qdrant | [http://localhost:6333/dashboard](http://localhost:6333/dashboard) *(si está mapeado)* |

<details>
<summary><b>Scripts de instalación</b> (experimentales, no cubiertos por CI)</summary>

**macOS y Linux**

```bash
curl -fsSL https://raw.githubusercontent.com/rasidi3112/pondok-ai/main/scripts/install.sh | bash
```

**Windows (PowerShell)**

```powershell
iwr -useb https://raw.githubusercontent.com/rasidi3112/pondok-ai/main/scripts/install.ps1 | iex
```

</details>

## Capturas de pantalla

<p align="center">
  <img src="docs/demo/screenshots/chat.png" alt="Open WebUI respondiendo una pregunta con gemma3:1b ejecutándose en local" width="100%">
  <br>
  <sub>Open WebUI chateando con <code>gemma3:1b</code>, servido por un Ollama nativo en un Mac con Apple M1.</sub>
</p>

<table>
  <tr>
    <td width="50%"><img src="docs/demo/screenshots/doctor.png" alt="Salida de pondok-ai doctor: información del sistema, estado de Docker y comprobación de requisitos"></td>
    <td width="50%"><img src="docs/demo/screenshots/model-recommend.png" alt="Salida de pondok-ai model recommend: modelos compatibles, justos e incompatibles para esta máquina"></td>
  </tr>
  <tr>
    <td align="center"><sub><code>pondok-ai doctor</code> revisa Docker, RAM, disco y GPU</sub></td>
    <td align="center"><sub><code>pondok-ai model recommend</code> ordena los modelos según lo que tu hardware puede ejecutar</sub></td>
  </tr>
</table>

## Presets

| Preset | Servicios incluidos | RAM mínima | Recomendado para |
|---|---|---|---|
| **`minimal`** | Ollama, Open WebUI | 8 GB | Chat local rápido, experimentación ligera |
| **`standard`** *(predeterminado)* | Ollama, Open WebUI, PostgreSQL, Qdrant, API Gateway | 16 GB | Pipelines RAG, desarrollo de aplicaciones, sustituto de OpenAI |
| **`full`** | Standard + motor de automatización n8n | 16+ GB | Agentes de IA autónomos, automatización visual de flujos de trabajo |

## Arquitectura

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

Consulta la [descripción de la arquitectura](./docs/architecture.md) para más detalles.

## Comandos de la CLI

| Comando | Descripción |
|---|---|
| `pondok-ai init` | Ejecuta el asistente de configuración interactivo con detección de hardware |
| `pondok-ai up` | Valida la configuración de Compose, arranca los contenedores y espera a las comprobaciones de salud |
| `pondok-ai down` | Detiene y elimina los contenedores del stack |
| `pondok-ai start` | Inicia contenedores existentes que estén detenidos |
| `pondok-ai stop` | Detiene los contenedores en ejecución |
| `pondok-ai restart` | Reinicia los contenedores del stack |
| `pondok-ai status` | Muestra el estado de salud de los contenedores y las URL |
| `pondok-ai logs [service]` | Muestra los logs (`-f` para seguirlos en tiempo real) |
| `pondok-ai doctor` | Diagnostica Docker, RAM, GPU/VRAM, puertos y recomendaciones de modelos |
| `pondok-ai update` | Vuelve a descargar las imágenes fijadas configuradas, con copia de seguridad automática y comprobaciones de salud |
| `pondok-ai backup` | Respalda configuraciones y volúmenes de datos con verificación de integridad SHA-256 (sin cifrar) |
| `pondok-ai restore <path>` | Restaura desde una copia verificada con SHA-256 (sin cifrar) |
| `pondok-ai reset` | Restablece el stack (conserva los volúmenes salvo que se indique `--delete-data`) |
| `pondok-ai config` | Inspecciona o edita la configuración activa |
| `pondok-ai model list` | Lista los modelos descargados |
| `pondok-ai model recommend` | Recomendaciones de modelos según el hardware (RAM, VRAM, disco) |
| `pondok-ai model install <name>` | Descarga un modelo nuevo con comprobaciones previas de recursos |
| `pondok-ai model remove <name>` | Elimina un modelo instalado |
| `pondok-ai model status` | Inspecciona el consumo de recursos de los modelos |

Las imágenes están fijadas a versiones explícitas. `pondok-ai update` actualiza las versiones configuradas; no selecciona versiones más recientes. Tras instalar una CLI más nueva, ejecuta `pondok-ai update --upgrade-images` para migrar solo las etiquetas de imagen predeterminadas antiguas de la CLI. Los valores de imagen personalizados se conservan.

## API Gateway

El API Gateway ofrece endpoints REST de OpenAI como reemplazo directo. Asigna a `PONDOK_AI_API_KEY` el `API_SECRET_KEY` generado antes de llamar a un endpoint `/v1/*`.

Por defecto, el gateway limita las solicitudes autenticadas a `/v1/*` a 120 por minuto por cliente (IP de origen y clave de API). Configura `RATE_LIMIT_MAX_REQUESTS` y `RATE_LIMIT_WINDOW_MS` en `.env` si tu cliente local necesita otros límites.

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
<summary><b>Con el SDK oficial de OpenAI para Node.js</b></summary>

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

Consulta la [referencia del API Gateway](./docs/api-reference.md) para ver todos los endpoints.

## Ejemplos

- [`examples/openai-compat/`](./examples/openai-compat): Script de integración directa con el SDK de OpenAI.
- [`examples/rag-example/`](./examples/rag-example): Pipeline RAG de extremo a extremo con la base de datos vectorial Qdrant y embeddings de Ollama.

## Probado en CI

Cada pull request ejecuta una prueba de extremo a extremo en GitHub Actions (amd64 y arm64): init, up, descarga de un modelo muy pequeño (smollm:135m, unos 90 MB), listado mediante /v1/models, una solicitud /v1/chat/completions sin streaming, limitación de tasa (401 y 429) y una comprobación de que la página de inicio de Open WebUI responde. Aún no cubierto: respuestas en streaming, embeddings, aceleración por GPU y hosts macOS/Windows.

También probado a mano en un Mac con Apple M1, Docker Desktop y Ollama de Homebrew (0.5.2): `init` con el preset `minimal` y Ollama nativo, `up`, inicio de sesión en Open WebUI, chat con `gemma3:1b` y `pondok-ai share` abierto desde un teléfono en la misma red Wi-Fi.

## Limitaciones conocidas

- Aún no se ha probado en hosts con Windows. macOS se ha probado a mano en Apple Silicon (ver arriba), pero no en CI.
- En Apple Silicon, los contenedores de Docker no pueden usar la GPU. Ejecuta `pondok-ai init --native-ollama` para usar en su lugar un Ollama instalado de forma nativa con Metal; consulta la [guía de GPU](./docs/gpu-setup.md).
- La aceleración por GPU, las respuestas en streaming y los embeddings aún no están cubiertos por CI.
- Las imágenes son grandes (varios GB). Reserva bastante espacio libre en disco; un espacio de trabajo en la nube de 32 GB con 19 GB libres se quedó sin espacio al extraer la imagen de Ollama.

## Documentación

- [Descripción de la arquitectura](./docs/architecture.md)
- [Referencia del API Gateway](./docs/api-reference.md)
- [Guía de configuración](./docs/configuration.md)
- [Configuración de aceleración por GPU (Metal / CUDA)](./docs/gpu-setup.md)
- [Solución de problemas y diagnóstico](./docs/troubleshooting.md)
- [Grabación de la demo del README](./docs/demo/RECORDING.md)

## Contribuir

¡Las contribuciones son bienvenidas! Consulta [CONTRIBUTING.md](./CONTRIBUTING.md) para empezar.

## Licencia

[MIT](./LICENSE) © 2026 colaboradores de pondok-ai
