<div align="center">

# pondok-ai

**Uruchom własny, prywatny stos AI lokalnie za pomocą jednej komendy.**

Lokalne modele LLM, interfejs czatu, wyszukiwanie wektorowe oraz API kompatybilne z OpenAI, połączone za pomocą Docker Compose.

[![npm version](https://img.shields.io/npm/v/pondok-ai?logo=npm&color=cb3837)](https://www.npmjs.com/package/pondok-ai)
[![CI](https://github.com/rasidi3112/pondok-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/rasidi3112/pondok-ai/actions/workflows/ci.yml)
[![Node.js](https://img.shields.io/node/v/pondok-ai?logo=node.js&logoColor=white&color=339933)](https://nodejs.org)
[![Docker Compose v2](https://img.shields.io/badge/Docker%20Compose-v2-2496ED?logo=docker&logoColor=white)](https://docs.docker.com/compose/)
[![License: MIT](https://img.shields.io/github/license/rasidi3112/pondok-ai?color=blue)](./LICENSE)

[English](README.md) · [Bahasa Indonesia](README_id.md) · [한국어](README_ko.md) · [العربية](README_ar.md) · [Español](README_es.md) · [中文](README_zh.md) · [Français](README_fr.md) · [日本語](README_ja.md) · [Deutsch](README_de.md) · [Português](README_pt.md) · [Русский](README_ru.md) · [हिन्दी](README_hi.md) · [Türkçe](README_tr.md) · [Italiano](README_it.md) · [Tiếng Việt](README_vi.md) · **Polski** · [Bahasa Melayu](README_ms.md)

<sub>Tłumaczenia są generowane maszynowo i mogą być opóźnione względem angielskiej wersji README.</sub>

<br>

<a href="docs/demo/demo.mp4">
  <img src="docs/demo/demo.gif" alt="demo pondok-ai: init, up, a następnie rozmowa z llama3.2:3b w Open WebUI" width="100%">
</a>

<sub>Od pustego folderu do odpowiedzi lokalnego modelu. Nagranie wykonano na komputerze korzystającym wyłącznie z CPU, z wcześniej pobranymi obrazami i modelem; czas oczekiwania został przyspieszony i oznaczony na ekranie.<br>
<a href="docs/demo/demo.mp4"><b>▶ Obejrzyj film w jakości 1080p</b></a></sub>

<br>

[Szybki start](#szybki-start) · [Funkcje](#funkcje) · [Zrzuty ekranu](#zrzuty-ekranu) · [Ustawienia wstępne](#ustawienia-wstępne) · [CLI](#polecenia-cli) · [Brama API](#brama-api) · [Dokumentacja](#dokumentacja)

</div>

---

## Przegląd

`pondok-ai` to CLI, które uruchamia kompletne, prywatne środowisko AI na Twoim komputerze. Generuje stos Docker Compose dopasowany do Twojego sprzętu, uruchamia go z kontrolą stanu usług i zarządza modelami za Ciebie.

Prompty, czaty i embeddingi są przetwarzane na Twoim komputerze. Przy pierwszym uruchomieniu wymagane jest połączenie z Internetem w celu pobrania obrazów kontenerów i wag modeli.

```bash
npx pondok-ai init
npx pondok-ai up
```

<sub>Pondok to indonezyjskie określenie małego schronienia lub miejsca noclegowego. Pakiet był wcześniej publikowany jako `local-ai-stack`.</sub>

## Funkcje

| | |
|---|---|
| **Przetwarzanie lokalne** | Prompty, czaty, embeddingi i inferencja działają na Twoim sprzęcie. |
| **Wykrywanie sprzętu** | Wykrywa system operacyjny, architekturę, pamięć RAM, dysk i GPU (Apple Metal, NVIDIA CUDA), a następnie rekomenduje odpowiednie ustawienia wstępne i modele. |
| **Modułowe ustawienia wstępne** | Skaluj od lekkiego interfejsu czatu (`minimal`), przez stos RAG (`standard`), aż po potok automatyzacji (`full`). |
| **Brama kompatybilna z OpenAI** | Skieruj OpenAI SDK lub LangChain na `http://localhost:8000/v1` bez przepisywania kodu. |
| **Menedżer modeli** | Pobieraj, wyświetlaj, sprawdzaj i usuwaj modele, korzystając z kontroli bezpieczeństwa pamięci RAM i miejsca na dysku przed każdym pobraniem. |
| **Diagnostyka** | `pondok-ai doctor` sprawdza demona Dockera, porty, pamięć RAM, dysk i GPU, zanim pojawią się problemy. |
| **Kopie zapasowe** | Twórz kopie zapasowe i przywracaj konfiguracje oraz wolumeny danych z kontrolą integralności SHA-256. |

## Szybki start

**Wymagania:** Node.js 22 lub nowszy, Docker oraz Docker Compose v2.

**1. Zainicjalizuj stos**

```bash
# Interaktywny kreator konfiguracji z wykrywaniem sprzętu
npx pondok-ai init

# Lub tryb nieinteraktywny z wybranym ustawieniem wstępnym
npx pondok-ai init --preset standard --yes
```

**2. Uruchom usługi** (czeka, aż każda usługa będzie gotowa)

```bash
npx pondok-ai up
```

**3. Wybierz i zainstaluj model**

```bash
# Rekomendacje na podstawie pamięci RAM, VRAM i wolnego miejsca na dysku
npx pondok-ai model recommend

# Instalacja z wstępną kontrolą pamięci i miejsca na dysku
npx pondok-ai model install llama3.2:3b
```

Po uruchomieniu otwórz swój stos:

| Usługa | URL |
|---|---|
| Open WebUI | [http://localhost:3000](http://localhost:3000) |
| API Gateway | [http://localhost:8000](http://localhost:8000) |
| Ollama | [http://localhost:11434](http://localhost:11434) |
| Qdrant | [http://localhost:6333/dashboard](http://localhost:6333/dashboard) *(jeśli zmapowany)* |

<details>
<summary><b>Skrypty instalacyjne</b> (eksperymentalne, nieobjęte CI)</summary>

**macOS i Linux**

```bash
curl -fsSL https://raw.githubusercontent.com/rasidi3112/pondok-ai/main/scripts/install.sh | bash
```

**Windows (PowerShell)**

```powershell
iwr -useb https://raw.githubusercontent.com/rasidi3112/pondok-ai/main/scripts/install.ps1 | iex
```

</details>

## Zrzuty ekranu

<p align="center">
  <img src="docs/demo/screenshots/chat.png" alt="Open WebUI odpowiadający na pytanie z lokalnie uruchomionym llama3.2:3b" width="100%">
  <br>
  <sub>Open WebUI rozmawiający z <code>llama3.2:3b</code>, obsługiwanym przez lokalny kontener Ollama.</sub>
</p>

<table>
  <tr>
    <td width="50%"><img src="docs/demo/screenshots/doctor.png" alt="Wynik pondok-ai doctor: informacje o systemie, status Dockera i kontrole wymagań"></td>
    <td width="50%"><img src="docs/demo/screenshots/model-recommend.png" alt="Wynik pondok-ai model recommend: kompatybilne modele, modele na granicy możliwości i niekompatybilne modele dla tego komputera"></td>
  </tr>
  <tr>
    <td align="center"><sub><code>pondok-ai doctor</code> sprawdza Docker, RAM, dysk i GPU</sub></td>
    <td align="center"><sub><code>pondok-ai model recommend</code> sortuje modele według tego, które mogą działać na Twoim sprzęcie</sub></td>
  </tr>
</table>

## Ustawienia wstępne

| Ustawienie | Zawarte usługi | Min. RAM | Zalecane do |
|---|---|---|---|
| **`minimal`** | Ollama, Open WebUI | 8 GB | Szybki lokalny czat, lekkie eksperymenty |
| **`standard`** *(domyślne)* | Ollama, Open WebUI, PostgreSQL, Qdrant, API Gateway | 16 GB | Potoki RAG, tworzenie aplikacji, zamiennik OpenAI |
| **`full`** | Standard + silnik automatyzacji n8n | 16+ GB | Autonomiczne agenty AI, wizualna automatyzacja przepływów pracy |

## Architektura

```text
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

Szczegóły znajdziesz w [Przeglądzie architektury](./docs/architecture.md).

## Polecenia CLI

| Polecenie | Opis |
|---|---|
| `pondok-ai init` | Uruchamia interaktywny kreator konfiguracji z wykrywaniem sprzętu |
| `pondok-ai up` | Sprawdza konfigurację Compose, uruchamia kontenery i czeka na kontrole stanu |
| `pondok-ai down` | Zatrzymuje i usuwa kontenery stosu |
| `pondok-ai start` | Uruchamia istniejące zatrzymane kontenery |
| `pondok-ai stop` | Zatrzymuje działające kontenery |
| `pondok-ai restart` | Ponownie uruchamia kontenery stosu |
| `pondok-ai status` | Wyświetla stan kontenerów i adresy URL |
| `pondok-ai logs [service]` | Wyświetla logi (`-f` umożliwia ich śledzenie na żywo) |
| `pondok-ai doctor` | Diagnozuje Docker, RAM, GPU/VRAM, porty i rekomendacje modeli |
| `pondok-ai update` | Ponownie pobiera skonfigurowane przypięte obrazy z automatyczną kopią zapasową i kontrolą stanu |
| `pondok-ai backup` | Tworzy kopię zapasową konfiguracji i wolumenów danych z kontrolą integralności SHA-256 (bez szyfrowania) |
| `pondok-ai restore <path>` | Przywraca dane z kopii zapasowej sprawdzonej pod kątem integralności SHA-256 (bez szyfrowania) |
| `pondok-ai reset` | Resetuje stos (zachowuje wolumeny, chyba że określono `--delete-data`) |
| `pondok-ai config` | Sprawdza lub edytuje aktywną konfigurację |
| `pondok-ai model list` | Wyświetla pobrane modele |
| `pondok-ai model recommend` | Rekomendacje modeli dopasowane do sprzętu (RAM, VRAM, dysk) |
| `pondok-ai model install <name>` | Pobiera nowy model ze wstępną kontrolą zasobów |
| `pondok-ai model remove <name>` | Usuwa zainstalowany model |
| `pondok-ai model status` | Sprawdza wykorzystanie zasobów przez modele |

Obrazy są przypięte do konkretnych wersji. `pondok-ai update` odświeża skonfigurowane wersje; nie wybiera nowszych wydań. Po zainstalowaniu nowszego CLI uruchom `pondok-ai update --upgrade-images`, aby zmigrować tylko starsze domyślne tagi obrazów CLI. Własne wartości obrazów zostają zachowane.

## Brama API

API Gateway udostępnia gotowe do użycia endpointy REST kompatybilne z OpenAI. Ustaw `PONDOK_AI_API_KEY` na wygenerowaną wartość `API_SECRET_KEY` przed wywołaniem endpointu `/v1/*`.

Brama ogranicza uwierzytelnione żądania `/v1/*` na klienta (adres IP źródłowy i klucz API) do domyślnie 120 żądań na minutę. Skonfiguruj `RATE_LIMIT_MAX_REQUESTS` oraz `RATE_LIMIT_WINDOW_MS` w `.env`, jeśli Twój lokalny klient wymaga innych limitów.

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
<summary><b>Korzystanie z oficjalnego OpenAI Node.js SDK</b></summary>

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

Zobacz [Dokumentację API Gateway](./docs/api-reference.md), aby poznać wszystkie endpointy.

## Przykłady

- [`examples/openai-compat/`](./examples/openai-compat): Skrypt integracyjny OpenAI SDK działający bez dodatkowych zmian.
- [`examples/rag-example/`](./examples/rag-example): Kompletny potok RAG wykorzystujący bazę danych wektorowych Qdrant oraz embeddingi Ollama.

## Testowane w CI

Każdy pull request uruchamia test end-to-end w GitHub Actions (amd64 i arm64): inicjalizację, uruchomienie, pobranie bardzo małego modelu (smollm:135m, około 90 MB), wyświetlenie go za pomocą `/v1/models`, nieprzesyłane strumieniowo żądanie `/v1/chat/completions`, ograniczanie liczby żądań (401 i 429) oraz sprawdzenie, czy strona startowa Open WebUI odpowiada. Nie są jeszcze objęte testami: odpowiedzi strumieniowe, embeddingi, akceleracja GPU oraz hosty macOS/Windows.

## Znane ograniczenia

- Nie testowano jeszcze na rzeczywistych komputerach z systemem macOS lub Windows.
- Na Apple Silicon kontenery Docker nie mogą korzystać z GPU. Uruchom `pondok-ai init --native-ollama`, aby używać natywnie zainstalowanego Ollama z Metal; zobacz [przewodnik GPU](./docs/gpu-setup.md).
- Akceleracja GPU, odpowiedzi strumieniowe i embeddingi nie są jeszcze objęte CI.
- Obrazy są duże (kilka GB). Zaplanuj odpowiednią ilość wolnego miejsca na dysku; środowisko chmurowe z 32 GB miejsca i 19 GB wolnego miejsca zabrakło miejsca podczas rozpakowywania obrazu Ollama.

## Dokumentacja

- [Przegląd architektury](./docs/architecture.md)
- [Dokumentacja API Gateway](./docs/api-reference.md)
- [Przewodnik konfiguracji](./docs/configuration.md)
- [Konfiguracja akceleracji GPU (Metal / CUDA)](./docs/gpu-setup.md)
- [Rozwiązywanie problemów i diagnostyka](./docs/troubleshooting.md)
- [Nagrywanie demonstracji README](./docs/demo/RECORDING.md)

## Współtworzenie

Wszelkie wkłady są mile widziane! Zajrzyj do [CONTRIBUTING.md](./CONTRIBUTING.md), aby rozpocząć.

## Licencja

[MIT](./LICENSE) © 2026 współtwórcy pondok-ai
