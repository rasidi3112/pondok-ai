<div align="center">

# pondok-ai

**Jalankan susunan AI peribadi anda sendiri secara setempat dengan satu arahan.**

LLM setempat, UI sembang, carian vektor dan API yang serasi dengan OpenAI, disatukan dengan Docker Compose.

[![npm version](https://img.shields.io/npm/v/pondok-ai?logo=npm&color=cb3837)](https://www.npmjs.com/package/pondok-ai)
[![CI](https://github.com/rasidi3112/pondok-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/rasidi3112/pondok-ai/actions/workflows/ci.yml)
[![Node.js](https://img.shields.io/node/v/pondok-ai?logo=node.js&logoColor=white&color=339933)](https://nodejs.org)
[![Docker Compose v2](https://img.shields.io/badge/Docker%20Compose-v2-2496ED?logo=docker&logoColor=white)](https://docs.docker.com/compose/)
[![License: MIT](https://img.shields.io/github/license/rasidi3112/pondok-ai?color=blue)](./LICENSE)

[English](README.md) · [Bahasa Indonesia](README_id.md) · [한국어](README_ko.md) · [العربية](README_ar.md) · [Español](README_es.md) · [中文](README_zh.md) · [Français](README_fr.md) · [日本語](README_ja.md) · [Deutsch](README_de.md) · [Português](README_pt.md) · [Русский](README_ru.md) · [हिन्दी](README_hi.md) · [Türkçe](README_tr.md) · [Italiano](README_it.md) · [Tiếng Việt](README_vi.md) · [Polski](README_pl.md) · **Bahasa Melayu**

<sub>Terjemahan dijana secara automatik dan mungkin ketinggalan berbanding README bahasa Inggeris.</sub>

<br>

<a href="docs/demo/demo.mp4">
  <img src="docs/demo/demo.gif" alt="Demo pondok-ai: init, up, kemudian bersembang dengan llama3.2:3b dalam Open WebUI" width="100%">
</a>

<sub>Daripada folder kosong hingga balasan daripada model setempat. Dirakam pada mesin CPU sahaja dengan imej dan model yang telah dimuat turun lebih awal; masa menunggu dipercepatkan dan dilabel pada skrin.<br>
<a href="docs/demo/demo.mp4"><b>▶ Tonton video 1080p</b></a></sub>

<br>

[Mula Pantas](#mula-pantas) · [Ciri-ciri](#ciri-ciri) · [Tangkapan Skrin](#tangkapan-skrin) · [Pratetapan](#pratetapan) · [CLI](#arahan-cli) · [Gerbang API](#gerbang-api) · [Dokumentasi](#dokumentasi)

</div>

---

## Gambaran Keseluruhan

`pondok-ai` ialah CLI yang menyediakan persekitaran AI peribadi yang lengkap pada komputer anda sendiri. Ia menjana susunan Docker Compose yang sesuai dengan perkakasan anda, memulakannya dengan pemeriksaan kesihatan dan menguruskan model untuk anda.

Prompt, sembang dan embedding diproses pada komputer anda. Memuat turun imej kontena dan pemberat model buat kali pertama memerlukan sambungan internet.

```bash
npx pondok-ai init
npx pondok-ai up
```

<sub>Pondok ialah perkataan bahasa Indonesia yang bermaksud tempat penginapan atau perlindungan kecil. Pakej ini dahulunya diterbitkan sebagai `local-ai-stack`.</sub>

## Ciri-ciri

| | |
|---|---|
| **Pemprosesan setempat** | Prompt, sembang, embedding dan inferens dijalankan pada perkakasan anda. |
| **Pengesanan perkakasan** | Mengesan OS, seni bina, RAM, cakera dan GPU (Apple Metal, NVIDIA CUDA), kemudian mengesyorkan pratetapan dan model yang sesuai. |
| **Pratetapan modular** | Skalakan daripada UI sembang ringan (`minimal`) kepada susunan RAG (`standard`) atau aliran automasi (`full`). |
| **Gerbang serasi OpenAI** | Halakan SDK OpenAI atau LangChain ke `http://localhost:8000/v1` tanpa menulis semula kod. |
| **Pengurus model** | Muat turun, senaraikan, periksa dan buang model dengan pemeriksaan keselamatan RAM dan cakera sebelum setiap muat turun. |
| **Diagnostik** | `pondok-ai doctor` memeriksa daemon Docker, port, RAM, cakera dan GPU sebelum masalah berlaku. |
| **Sandaran** | Sandarkan dan pulihkan konfigurasi serta volum data dengan pemeriksaan integriti SHA-256. |

## Mula Pantas

**Prasyarat:** Node.js 22 atau lebih baharu, Docker dan Docker Compose v2.

**1. Mulakan susunan**

```bash
# Wizard persediaan interaktif dengan pengesanan perkakasan
npx pondok-ai init

# Atau tanpa interaksi dengan pratetapan pilihan
npx pondok-ai init --preset standard --yes
```

**2. Mulakan perkhidmatan** (menunggu sehingga setiap perkhidmatan sihat)

```bash
npx pondok-ai up
```

**3. Pilih dan pasang model**

```bash
# Cadangan berdasarkan RAM, VRAM dan ruang cakera kosong anda
npx pondok-ai model recommend

# Pasang dengan pemeriksaan awal memori dan cakera
npx pondok-ai model install llama3.2:3b
```

Setelah berjalan, buka susunan anda:

| Perkhidmatan | URL |
|---|---|
| Open WebUI | [http://localhost:3000](http://localhost:3000) |
| Gerbang API | [http://localhost:8000](http://localhost:8000) |
| Ollama | [http://localhost:11434](http://localhost:11434) |
| Qdrant | [http://localhost:6333/dashboard](http://localhost:6333/dashboard) *(jika dipetakan)* |

<details>
<summary><b>Skrip pemasang</b> (eksperimen, tidak diliputi oleh CI)</summary>

**macOS dan Linux**

```bash
curl -fsSL https://raw.githubusercontent.com/rasidi3112/pondok-ai/main/scripts/install.sh | bash
```

**Windows (PowerShell)**

```powershell
iwr -useb https://raw.githubusercontent.com/rasidi3112/pondok-ai/main/scripts/install.ps1 | iex
```

</details>

## Tangkapan Skrin

<p align="center">
  <img src="docs/demo/screenshots/chat.png" alt="Open WebUI menjawab soalan dengan llama3.2:3b yang berjalan secara setempat" width="100%">
  <br>
  <sub>Open WebUI bersembang dengan <code>llama3.2:3b</code>, dihidangkan oleh kontena Ollama setempat.</sub>
</p>

<table>
  <tr>
    <td width="50%"><img src="docs/demo/screenshots/doctor.png" alt="Output pondok-ai doctor: maklumat sistem, status Docker dan semakan keperluan"></td>
    <td width="50%"><img src="docs/demo/screenshots/model-recommend.png" alt="Output pondok-ai model recommend: model yang serasi, cukup-cukup muat dan tidak serasi untuk mesin ini"></td>
  </tr>
  <tr>
    <td align="center"><sub><code>pondok-ai doctor</code> memeriksa Docker, RAM, cakera dan GPU</sub></td>
    <td align="center"><sub><code>pondok-ai model recommend</code> menyusun model mengikut keupayaan perkakasan anda</sub></td>
  </tr>
</table>

## Pratetapan

| Pratetapan | Perkhidmatan Disertakan | RAM Minimum | Disyorkan Untuk |
|---|---|---|---|
| **`minimal`** | Ollama, Open WebUI | 8 GB | Sembang setempat yang pantas, eksperimen ringan |
| **`standard`** *(lalai)* | Ollama, Open WebUI, PostgreSQL, Qdrant, API Gateway | 16 GB | Aliran RAG, pembangunan aplikasi, pengganti OpenAI |
| **`full`** | Standard + enjin automasi n8n | 16+ GB | Ejen AI autonomi, automasi aliran kerja visual |

## Seni Bina

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

Lihat [Gambaran Keseluruhan Seni Bina](./docs/architecture.md) untuk butiran lanjut.

## Arahan CLI

| Arahan | Penerangan |
|---|---|
| `pondok-ai init` | Jalankan wizard konfigurasi interaktif dengan pengesanan perkakasan |
| `pondok-ai up` | Sahkan konfigurasi Compose, mulakan kontena dan tunggu pemeriksaan kesihatan |
| `pondok-ai down` | Hentikan dan buang kontena susunan |
| `pondok-ai start` | Mulakan kontena sedia ada yang telah dihentikan |
| `pondok-ai stop` | Hentikan kontena yang sedang berjalan |
| `pondok-ai restart` | Mulakan semula kontena susunan |
| `pondok-ai status` | Paparkan kesihatan kontena dan URL |
| `pondok-ai logs [service]` | Lihat log (`-f` untuk penstriman) |
| `pondok-ai doctor` | Diagnosis Docker, RAM, GPU/VRAM, port dan cadangan model |
| `pondok-ai update` | Tarik semula imej versi tetap yang dikonfigurasi dengan sandaran automatik dan pemeriksaan kesihatan |
| `pondok-ai backup` | Sandarkan konfigurasi dan volum data dengan pemeriksaan integriti SHA-256 (tidak disulitkan) |
| `pondok-ai restore <path>` | Pulihkan daripada sandaran yang disemak integriti SHA-256 (tidak disulitkan) |
| `pondok-ai reset` | Tetapkan semula susunan (volum dikekalkan kecuali `--delete-data` dinyatakan) |
| `pondok-ai config` | Periksa atau sunting konfigurasi aktif |
| `pondok-ai model list` | Senaraikan model yang telah dimuat turun |
| `pondok-ai model recommend` | Cadangan model mengikut perkakasan (RAM, VRAM, cakera) |
| `pondok-ai model install <name>` | Tarik model baharu dengan pemeriksaan awal keselamatan sumber |
| `pondok-ai model remove <name>` | Padam model yang telah dipasang |
| `pondok-ai model status` | Periksa penggunaan sumber oleh model |

Imej ditetapkan kepada versi yang jelas. `pondok-ai update` menyegarkan versi yang dikonfigurasi; ia tidak memilih keluaran yang lebih baharu. Selepas memasang CLI yang lebih baharu, jalankan `pondok-ai update --upgrade-images` untuk memindahkan hanya tag imej lalai lama milik CLI. Nilai imej tersuai dikekalkan.

## Gerbang API

Gerbang API menyediakan titik akhir REST OpenAI yang boleh terus menggantikan yang asal. Tetapkan `PONDOK_AI_API_KEY` kepada `API_SECRET_KEY` yang dijana sebelum memanggil titik akhir `/v1/*`.

Secara lalai, gerbang mengehadkan permintaan `/v1/*` yang disahkan kepada 120 permintaan seminit bagi setiap klien (IP sumber dan kunci API). Tetapkan `RATE_LIMIT_MAX_REQUESTS` dan `RATE_LIMIT_WINDOW_MS` dalam `.env` jika klien setempat anda memerlukan had yang berbeza.

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
<summary><b>Menggunakan SDK Node.js rasmi OpenAI</b></summary>

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

Lihat [Rujukan Gerbang API](./docs/api-reference.md) untuk setiap titik akhir.

## Contoh

- [`examples/openai-compat/`](./examples/openai-compat): Skrip integrasi SDK OpenAI yang boleh digunakan terus.
- [`examples/rag-example/`](./examples/rag-example): Aliran RAG menyeluruh menggunakan pangkalan data vektor Qdrant dan embedding Ollama.

## Diuji dalam CI

Setiap permintaan tarik menjalankan ujian hujung ke hujung pada GitHub Actions (amd64 dan arm64): init, up, menarik model yang sangat kecil (smollm:135m, kira-kira 90 MB), menyenaraikannya melalui /v1/models, permintaan /v1/chat/completions tanpa penstriman, had kadar (401 dan 429), dan semakan bahawa halaman permulaan Open WebUI memberikan respons. Belum diliputi: respons penstriman, embedding, pecutan GPU dan hos macOS/Windows.

## Batasan yang diketahui

- Belum diuji pada hos macOS atau Windows sebenar.
- Pada Apple Silicon, kontena Docker tidak dapat menggunakan GPU. Jalankan `pondok-ai init --native-ollama` untuk menggunakan Ollama yang dipasang secara asli dengan Metal; lihat [panduan GPU](./docs/gpu-setup.md).
- Pecutan GPU, respons penstriman dan embedding belum diliputi oleh CI.
- Saiz imej besar (beberapa GB). Sediakan ruang cakera kosong yang mencukupi; ruang kerja awan 32 GB dengan baki 19 GB kehabisan ruang ketika mengekstrak imej Ollama.

## Dokumentasi

- [Gambaran Keseluruhan Seni Bina](./docs/architecture.md)
- [Rujukan Gerbang API](./docs/api-reference.md)
- [Panduan Konfigurasi](./docs/configuration.md)
- [Persediaan Pecutan GPU (Metal / CUDA)](./docs/gpu-setup.md)
- [Penyelesaian Masalah dan Diagnostik](./docs/troubleshooting.md)
- [Merakam demo README](./docs/demo/RECORDING.md)

## Sumbangan

Sumbangan dialu-alukan! Rujuk [CONTRIBUTING.md](./CONTRIBUTING.md) untuk bermula.

## Lesen

[MIT](./LICENSE) © 2026 penyumbang pondok-ai
