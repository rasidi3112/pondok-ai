<div align="center">

# pondok-ai

**Запустите собственный приватный ИИ-стек локально одной командой.**

Локальные LLM, чат-интерфейс, векторный поиск и API, совместимый с OpenAI, связанные через Docker Compose.

[![npm version](https://img.shields.io/npm/v/pondok-ai?logo=npm&color=cb3837)](https://www.npmjs.com/package/pondok-ai)
[![CI](https://github.com/rasidi3112/pondok-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/rasidi3112/pondok-ai/actions/workflows/ci.yml)
[![Node.js](https://img.shields.io/node/v/pondok-ai?logo=node.js&logoColor=white&color=339933)](https://nodejs.org)
[![Docker Compose v2](https://img.shields.io/badge/Docker%20Compose-v2-2496ED?logo=docker&logoColor=white)](https://docs.docker.com/compose/)
[![License: MIT](https://img.shields.io/github/license/rasidi3112/pondok-ai?color=blue)](./LICENSE)

[English](README.md) · [Bahasa Indonesia](README_id.md) · [한국어](README_ko.md) · [العربية](README_ar.md) · [Español](README_es.md) · [中文](README_zh.md) · [Français](README_fr.md) · [日本語](README_ja.md) · [Deutsch](README_de.md) · [Português](README_pt.md) · **Русский** · [हिन्दी](README_hi.md) · [Türkçe](README_tr.md) · [Italiano](README_it.md) · [Tiếng Việt](README_vi.md) · [Polski](README_pl.md) · [Bahasa Melayu](README_ms.md)

<sub>Переводы выполнены автоматически и могут отставать от английского README.</sub>

<br>

<a href="docs/demo/demo.mp4">
  <img src="docs/demo/demo.gif" alt="Демонстрация pondok-ai: init, up, затем чат с gemma3:1b в Open WebUI" width="100%">
</a>

<sub>От пустой папки до ответа локальной модели. Записано на Mac с Apple M1 и нативным Ollama (GPU Metal), образы и модель загружены заранее; ожидание запуска Open WebUI ускорено и отмечено на экране. На Mac было меньше 10 ГБ свободного места на диске, поэтому <code>init</code> запущен с <code>--force</code>.<br>
<a href="docs/demo/demo.mp4"><b>▶ Смотреть видео в 1080p</b></a></sub>

<br>

[Быстрый старт](#быстрый-старт) · [Возможности](#возможности) · [Скриншоты](#скриншоты) · [Пресеты](#пресеты) · [CLI](#команды-cli) · [API-шлюз](#api-шлюз) · [Документация](#документация)

</div>

---

## Обзор

`pondok-ai` — это CLI, который разворачивает полноценную приватную ИИ-среду на вашем компьютере. Он генерирует стек Docker Compose под ваше оборудование, запускает его с проверками работоспособности и управляет моделями за вас.

Промпты, чаты и эмбеддинги обрабатываются на вашем компьютере. Для первой загрузки образов контейнеров и весов моделей требуется подключение к интернету.

```bash
npx pondok-ai init
npx pondok-ai up
```

<sub>Pondok по-индонезийски означает небольшую хижину или приют. Ранее пакет публиковался под названием `local-ai-stack`.</sub>

## Возможности

| | |
|---|---|
| **Локальная обработка** | Промпты, чаты, эмбеддинги и инференс выполняются на вашем оборудовании. |
| **Определение оборудования** | Определяет ОС, архитектуру, RAM, диск и GPU (Apple Metal, NVIDIA CUDA) и рекомендует подходящий пресет и модели. |
| **Модульные пресеты** | Масштабируйтесь от лёгкого чат-интерфейса (`minimal`) до RAG-стека (`standard`) или конвейера автоматизации (`full`). |
| **Шлюз, совместимый с OpenAI** | Направьте SDK OpenAI или LangChain на `http://localhost:8000/v1` без переписывания кода. |
| **Менеджер моделей** | Загружайте, просматривайте, проверяйте и удаляйте модели с проверкой RAM и диска перед каждой загрузкой. |
| **Диагностика** | `pondok-ai doctor` проверяет демон Docker, порты, RAM, диск и GPU до того, как возникнут проблемы. |
| **Резервные копии** | Резервное копирование и восстановление конфигураций и томов данных с проверкой целостности SHA-256. |

## Быстрый старт

**Требования:** Node.js 22 или новее, Docker и Docker Compose v2.

**1. Инициализируйте стек**

```bash
# Интерактивный мастер настройки с определением оборудования
npx pondok-ai init

# Или в неинтерактивном режиме с выбранным пресетом
npx pondok-ai init --preset standard --yes
```

**2. Запустите сервисы** (ожидает, пока все сервисы станут работоспособными)

```bash
npx pondok-ai up
```

Первый запуск может занять несколько минут, пока Open WebUI загружает свои вспомогательные модели. На Mac с нативным Ollama `up` также запускает Ollama, если он не работает. Если ни одна модель ещё не установлена, `up` подскажет, какая подходит под ваш объём RAM.

**3. Выберите и установите модель**

```bash
# Рекомендации на основе вашей RAM, VRAM и свободного места на диске
npx pondok-ai model recommend

# Установка с предварительной проверкой памяти и диска
npx pondok-ai model install llama3.2:3b
```

После запуска откройте свой стек:

| Сервис | URL |
|---|---|
| Open WebUI | [http://localhost:3000](http://localhost:3000) |
| API-шлюз | [http://localhost:8000](http://localhost:8000) |
| Ollama | [http://localhost:11434](http://localhost:11434) |
| Qdrant | [http://localhost:6333/dashboard](http://localhost:6333/dashboard) *(если порт проброшен)* |

<details>
<summary><b>Скрипты установки</b> (экспериментальные, не покрыты CI)</summary>

**macOS и Linux**

```bash
curl -fsSL https://raw.githubusercontent.com/rasidi3112/pondok-ai/main/scripts/install.sh | bash
```

**Windows (PowerShell)**

```powershell
iwr -useb https://raw.githubusercontent.com/rasidi3112/pondok-ai/main/scripts/install.ps1 | iex
```

</details>

## Скриншоты

<p align="center">
  <img src="docs/demo/screenshots/chat.png" alt="Open WebUI отвечает на вопрос с помощью локально запущенной gemma3:1b" width="100%">
  <br>
  <sub>Open WebUI в диалоге с <code>gemma3:1b</code>, которую обслуживает нативный Ollama на Mac с Apple M1.</sub>
</p>

<table>
  <tr>
    <td width="50%"><img src="docs/demo/screenshots/doctor.png" alt="Вывод pondok-ai doctor: сведения о системе, статус Docker и проверка требований"></td>
    <td width="50%"><img src="docs/demo/screenshots/model-recommend.png" alt="Вывод pondok-ai model recommend: совместимые, впритык подходящие и несовместимые модели для этой машины"></td>
  </tr>
  <tr>
    <td align="center"><sub><code>pondok-ai doctor</code> проверяет Docker, RAM, диск и GPU</sub></td>
    <td align="center"><sub><code>pondok-ai model recommend</code> сортирует модели по тому, что способно запустить ваше оборудование</sub></td>
  </tr>
</table>

## Пресеты

| Пресет | Входящие сервисы | Мин. RAM | Рекомендуется для |
|---|---|---|---|
| **`minimal`** | Ollama, Open WebUI | 8 ГБ | Быстрый локальный чат, лёгкие эксперименты |
| **`standard`** *(по умолчанию)* | Ollama, Open WebUI, PostgreSQL, Qdrant, API Gateway | 16 ГБ | RAG-конвейеры, разработка приложений, замена OpenAI |
| **`full`** | Standard + движок автоматизации n8n | 16+ ГБ | Автономные ИИ-агенты, визуальная автоматизация рабочих процессов |

## Архитектура

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

Подробности — в [обзоре архитектуры](./docs/architecture.md).

## Команды CLI

| Команда | Описание |
|---|---|
| `pondok-ai init` | Запустить интерактивный мастер настройки с определением оборудования |
| `pondok-ai up` | Проверить конфигурацию Compose, запустить контейнеры и дождаться проверок работоспособности |
| `pondok-ai down` | Остановить и удалить контейнеры стека |
| `pondok-ai start` | Запустить существующие остановленные контейнеры |
| `pondok-ai stop` | Остановить работающие контейнеры |
| `pondok-ai restart` | Перезапустить контейнеры стека |
| `pondok-ai status` | Показать состояние контейнеров и URL |
| `pondok-ai logs [service]` | Просмотреть логи (`-f` для потокового вывода) |
| `pondok-ai doctor` | Диагностика Docker, RAM, GPU/VRAM, портов и рекомендации по моделям |
| `pondok-ai update` | Заново загрузить закреплённые образы из конфигурации с автоматическим бэкапом и проверками работоспособности |
| `pondok-ai backup` | Резервное копирование конфигураций и томов данных с проверкой целостности SHA-256 (без шифрования) |
| `pondok-ai restore <path>` | Восстановить из резервной копии, проверенной по SHA-256 (без шифрования) |
| `pondok-ai reset` | Сбросить стек (тома сохраняются, если не указан `--delete-data`) |
| `pondok-ai config` | Просмотреть или изменить активную конфигурацию |
| `pondok-ai model list` | Список загруженных моделей |
| `pondok-ai model recommend` | Рекомендации моделей под ваше оборудование (RAM, VRAM, диск) |
| `pondok-ai model install <name>` | Загрузить новую модель с предварительной проверкой ресурсов |
| `pondok-ai model remove <name>` | Удалить установленную модель |
| `pondok-ai model status` | Посмотреть, сколько ресурсов занимают модели |

Образы закреплены за конкретными версиями. `pondok-ai update` обновляет настроенные версии, но не выбирает более новые релизы. После установки более новой версии CLI выполните `pondok-ai update --upgrade-images`, чтобы перенести только устаревшие теги образов CLI по умолчанию. Пользовательские значения образов сохраняются.

## API-шлюз

API-шлюз предоставляет REST-эндпоинты OpenAI, которые можно использовать как прямую замену. Перед вызовом эндпоинта `/v1/*` присвойте `PONDOK_AI_API_KEY` значение сгенерированного `API_SECRET_KEY`.

По умолчанию шлюз ограничивает аутентифицированные запросы к `/v1/*` до 120 в минуту на клиента (IP-адрес источника и API-ключ). Настройте `RATE_LIMIT_MAX_REQUESTS` и `RATE_LIMIT_WINDOW_MS` в `.env`, если вашему локальному клиенту нужны другие лимиты.

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
<summary><b>Использование официального OpenAI Node.js SDK</b></summary>

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

Все эндпоинты описаны в [справочнике API-шлюза](./docs/api-reference.md).

## Примеры

- [`examples/openai-compat/`](./examples/openai-compat): скрипт интеграции с OpenAI SDK в качестве прямой замены.
- [`examples/rag-example/`](./examples/rag-example): сквозной RAG-конвейер на векторной базе данных Qdrant и эмбеддингах Ollama.

## Проверено в CI

Каждый pull request запускает сквозной тест в GitHub Actions (amd64 и arm64): init, up, загрузка очень маленькой модели (smollm:135m, около 90 МБ), её вывод через /v1/models, запрос /v1/chat/completions без стриминга, ограничение частоты запросов (401 и 429) и проверка того, что стартовая страница Open WebUI отвечает. Пока не покрыто: потоковые ответы, эмбеддинги, ускорение на GPU и хосты macOS/Windows.

Также проверено вручную на Mac с Apple M1, Docker Desktop и Ollama из Homebrew (0.5.2): `init` с пресетом `minimal` и нативным Ollama, `up`, вход в Open WebUI, чат с `gemma3:1b` и `pondok-ai share`, открытый с телефона в той же сети Wi-Fi.

## Известные ограничения

- Ещё не протестировано на хостах Windows. macOS проверен вручную на Apple Silicon (см. выше), но не в CI.
- На Apple Silicon контейнеры Docker не могут использовать GPU. Выполните `pondok-ai init --native-ollama`, чтобы вместо этого использовать нативно установленный Ollama с Metal; см. [руководство по GPU](./docs/gpu-setup.md).
- Ускорение на GPU, потоковые ответы и эмбеддинги пока не покрыты CI.
- Образы большие (несколько ГБ). Заложите достаточно свободного места на диске: облачному рабочему окружению на 32 ГБ с 19 ГБ свободного места не хватило места при распаковке образа Ollama.

## Документация

- [Обзор архитектуры](./docs/architecture.md)
- [Справочник API-шлюза](./docs/api-reference.md)
- [Руководство по конфигурации](./docs/configuration.md)
- [Настройка ускорения на GPU (Metal / CUDA)](./docs/gpu-setup.md)
- [Устранение неполадок и диагностика](./docs/troubleshooting.md)
- [Запись демо для README](./docs/demo/RECORDING.md)

## Участие в разработке

Мы рады вашему вкладу! Начните с [CONTRIBUTING.md](./CONTRIBUTING.md).

## Лицензия

[MIT](./LICENSE) © 2026 участники проекта pondok-ai
