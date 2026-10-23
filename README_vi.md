<div align="center">

# pondok-ai

**Chạy stack AI riêng tư của bạn ngay trên máy chỉ với một lệnh.**

LLM cục bộ, giao diện trò chuyện, tìm kiếm vector và API tương thích OpenAI, kết nối với nhau bằng Docker Compose.

[![npm version](https://img.shields.io/npm/v/pondok-ai?logo=npm&color=cb3837)](https://www.npmjs.com/package/pondok-ai)
[![CI](https://github.com/rasidi3112/pondok-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/rasidi3112/pondok-ai/actions/workflows/ci.yml)
[![Node.js](https://img.shields.io/node/v/pondok-ai?logo=node.js&logoColor=white&color=339933)](https://nodejs.org)
[![Docker Compose v2](https://img.shields.io/badge/Docker%20Compose-v2-2496ED?logo=docker&logoColor=white)](https://docs.docker.com/compose/)
[![License: MIT](https://img.shields.io/github/license/rasidi3112/pondok-ai?color=blue)](./LICENSE)

[English](README.md) · [Bahasa Indonesia](README_id.md) · [한국어](README_ko.md) · [العربية](README_ar.md) · [Español](README_es.md) · [中文](README_zh.md) · [Français](README_fr.md) · [日本語](README_ja.md) · [Deutsch](README_de.md) · [Português](README_pt.md) · [Русский](README_ru.md) · [हिन्दी](README_hi.md) · [Türkçe](README_tr.md) · [Italiano](README_it.md) · **Tiếng Việt** · [Polski](README_pl.md) · [Bahasa Melayu](README_ms.md)

<sub>Các bản dịch được tạo tự động và có thể chậm hơn so với README tiếng Anh.</sub>

<br>

<a href="docs/demo/demo.mp4">
  <img src="docs/demo/demo.gif" alt="Demo pondok-ai: init, up, sau đó trò chuyện với llama3.2:3b trong Open WebUI" width="100%">
</a>

<sub>Từ một thư mục trống đến câu trả lời của mô hình cục bộ. Được ghi trên máy chỉ có CPU, với image và mô hình đã tải sẵn; thời gian chờ được tua nhanh và ghi chú trên màn hình.<br>
<a href="docs/demo/demo.mp4"><b>▶ Xem video 1080p</b></a></sub>

<br>

[Bắt đầu nhanh](#bắt-đầu-nhanh) · [Tính năng](#tính-năng) · [Ảnh chụp màn hình](#ảnh-chụp-màn-hình) · [Preset](#preset) · [CLI](#lệnh-cli) · [API Gateway](#api-gateway) · [Tài liệu](#tài-liệu)

</div>

---

## Tổng quan

`pondok-ai` là một CLI khởi chạy môi trường AI hoàn chỉnh và riêng tư ngay trên máy của bạn. Nó tạo một stack Docker Compose phù hợp với phần cứng của bạn, khởi động stack với các bước kiểm tra tình trạng và quản lý mô hình thay bạn.

Prompt, cuộc trò chuyện và embedding đều được xử lý trên máy của bạn. Lần đầu tải image container và trọng số mô hình cần có kết nối internet.

```bash
npx pondok-ai init
npx pondok-ai up
```

<sub>Pondok trong tiếng Indonesia nghĩa là một căn chòi hay nơi trú nhỏ. Gói này trước đây được phát hành với tên `local-ai-stack`.</sub>

## Tính năng

| | |
|---|---|
| **Xử lý cục bộ** | Prompt, cuộc trò chuyện, embedding và suy luận đều chạy trên phần cứng của bạn. |
| **Nhận diện phần cứng** | Phát hiện hệ điều hành, kiến trúc, RAM, ổ đĩa và GPU (Apple Metal, NVIDIA CUDA), rồi đề xuất preset và mô hình phù hợp. |
| **Preset dạng mô-đun** | Mở rộng từ giao diện trò chuyện gọn nhẹ (`minimal`) lên stack RAG (`standard`) hoặc pipeline tự động hóa (`full`). |
| **Gateway tương thích OpenAI** | Trỏ OpenAI SDK hoặc LangChain tới `http://localhost:8000/v1` mà không cần viết lại mã. |
| **Trình quản lý mô hình** | Tải, liệt kê, kiểm tra và xóa mô hình, với bước kiểm tra an toàn RAM và ổ đĩa trước mỗi lần tải. |
| **Chẩn đoán** | `pondok-ai doctor` kiểm tra Docker daemon, cổng, RAM, ổ đĩa và GPU trước khi bạn gặp sự cố. |
| **Sao lưu** | Sao lưu và khôi phục cấu hình cùng volume dữ liệu với kiểm tra toàn vẹn SHA-256. |

## Bắt đầu nhanh

**Yêu cầu:** Node.js 22 trở lên, Docker và Docker Compose v2.

**1. Khởi tạo stack**

```bash
# Trình hướng dẫn thiết lập tương tác có nhận diện phần cứng
npx pondok-ai init

# Hoặc không tương tác với preset đã chọn
npx pondok-ai init --preset standard --yes
```

**2. Khởi động các dịch vụ** (chờ đến khi mọi dịch vụ đều khỏe)

```bash
npx pondok-ai up
```

Lần khởi động đầu tiên có thể mất vài phút vì Open WebUI cần tải các mô hình hỗ trợ. Trên máy Mac dùng Ollama cài đặt gốc, `up` cũng khởi động Ollama nếu nó chưa chạy. Nếu chưa cài mô hình nào, `up` sẽ cho bạn biết mô hình phù hợp với RAM của máy.

**3. Chọn và cài đặt mô hình**

```bash
# Đề xuất dựa trên RAM, VRAM và dung lượng ổ đĩa trống
npx pondok-ai model recommend

# Cài đặt kèm kiểm tra trước bộ nhớ và ổ đĩa
npx pondok-ai model install llama3.2:3b
```

Khi đã chạy, hãy mở stack của bạn:

| Dịch vụ | URL |
|---|---|
| Open WebUI | [http://localhost:3000](http://localhost:3000) |
| API Gateway | [http://localhost:8000](http://localhost:8000) |
| Ollama | [http://localhost:11434](http://localhost:11434) |
| Qdrant | [http://localhost:6333/dashboard](http://localhost:6333/dashboard) *(khi đã ánh xạ cổng)* |

<details>
<summary><b>Script cài đặt</b> (thử nghiệm, chưa được CI kiểm tra)</summary>

**macOS và Linux**

```bash
curl -fsSL https://raw.githubusercontent.com/rasidi3112/pondok-ai/main/scripts/install.sh | bash
```

**Windows (PowerShell)**

```powershell
iwr -useb https://raw.githubusercontent.com/rasidi3112/pondok-ai/main/scripts/install.ps1 | iex
```

</details>

## Ảnh chụp màn hình

<p align="center">
  <img src="docs/demo/screenshots/chat.png" alt="Open WebUI trả lời câu hỏi bằng llama3.2:3b chạy cục bộ" width="100%">
  <br>
  <sub>Open WebUI trò chuyện với <code>llama3.2:3b</code>, được phục vụ bởi container Ollama cục bộ.</sub>
</p>

<table>
  <tr>
    <td width="50%"><img src="docs/demo/screenshots/doctor.png" alt="Kết quả pondok-ai doctor: thông tin hệ thống, trạng thái Docker và kiểm tra yêu cầu"></td>
    <td width="50%"><img src="docs/demo/screenshots/model-recommend.png" alt="Kết quả pondok-ai model recommend: các mô hình tương thích, vừa đủ và không tương thích với máy này"></td>
  </tr>
  <tr>
    <td align="center"><sub><code>pondok-ai doctor</code> kiểm tra Docker, RAM, ổ đĩa và GPU</sub></td>
    <td align="center"><sub><code>pondok-ai model recommend</code> sắp xếp mô hình theo khả năng phần cứng của bạn</sub></td>
  </tr>
</table>

## Preset

| Preset | Dịch vụ đi kèm | RAM tối thiểu | Khuyên dùng cho |
|---|---|---|---|
| **`minimal`** | Ollama, Open WebUI | 8 GB | Trò chuyện cục bộ nhanh, thử nghiệm nhẹ |
| **`standard`** *(mặc định)* | Ollama, Open WebUI, PostgreSQL, Qdrant, API Gateway | 16 GB | Pipeline RAG, phát triển ứng dụng, thay thế OpenAI |
| **`full`** | Standard + công cụ tự động hóa n8n | 16+ GB | Tác tử AI tự hành, tự động hóa quy trình trực quan |

## Kiến trúc

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

Xem [Tổng quan kiến trúc](./docs/architecture.md) để biết chi tiết.

## Lệnh CLI

| Lệnh | Mô tả |
|---|---|
| `pondok-ai init` | Chạy trình hướng dẫn cấu hình tương tác có nhận diện phần cứng |
| `pondok-ai up` | Xác thực cấu hình Compose, khởi động container và chờ kiểm tra tình trạng |
| `pondok-ai down` | Dừng và xóa các container của stack |
| `pondok-ai start` | Khởi động các container đã có nhưng đang dừng |
| `pondok-ai stop` | Dừng các container đang chạy |
| `pondok-ai restart` | Khởi động lại các container của stack |
| `pondok-ai status` | Hiển thị tình trạng container và URL |
| `pondok-ai logs [service]` | Xem log (`-f` để theo dõi trực tiếp) |
| `pondok-ai doctor` | Chẩn đoán Docker, RAM, GPU/VRAM, cổng và đề xuất mô hình |
| `pondok-ai update` | Tải lại các image đã ghim phiên bản theo cấu hình, kèm sao lưu tự động và kiểm tra tình trạng |
| `pondok-ai backup` | Sao lưu cấu hình và volume dữ liệu với kiểm tra toàn vẹn SHA-256 (không mã hóa) |
| `pondok-ai restore <path>` | Khôi phục từ bản sao lưu đã kiểm tra toàn vẹn SHA-256 (không mã hóa) |
| `pondok-ai reset` | Đặt lại stack (giữ nguyên volume trừ khi dùng `--delete-data`) |
| `pondok-ai config` | Xem hoặc chỉnh sửa cấu hình đang dùng |
| `pondok-ai model list` | Liệt kê các mô hình đã tải |
| `pondok-ai model recommend` | Đề xuất mô hình theo phần cứng (RAM, VRAM, ổ đĩa) |
| `pondok-ai model install <name>` | Tải mô hình mới kèm kiểm tra an toàn tài nguyên trước |
| `pondok-ai model remove <name>` | Xóa mô hình đã cài |
| `pondok-ai model status` | Kiểm tra mức sử dụng tài nguyên của mô hình |

Image được ghim vào các phiên bản cụ thể. `pondok-ai update` làm mới các phiên bản đã cấu hình; lệnh này không tự chọn bản phát hành mới hơn. Sau khi cài CLI mới hơn, hãy chạy `pondok-ai update --upgrade-images` để chỉ chuyển đổi các tag image mặc định cũ của CLI. Các giá trị image tùy chỉnh được giữ nguyên.

## API Gateway

API Gateway cung cấp các endpoint REST của OpenAI có thể thay thế trực tiếp. Hãy đặt `PONDOK_AI_API_KEY` bằng `API_SECRET_KEY` đã được tạo trước khi gọi một endpoint `/v1/*`.

Theo mặc định, gateway giới hạn các yêu cầu `/v1/*` đã xác thực ở mức 120 yêu cầu mỗi phút cho mỗi client (IP nguồn và API key). Cấu hình `RATE_LIMIT_MAX_REQUESTS` và `RATE_LIMIT_WINDOW_MS` trong `.env` nếu client cục bộ của bạn cần giới hạn khác.

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
<summary><b>Dùng OpenAI Node.js SDK chính thức</b></summary>

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

Xem [Tài liệu tham khảo API Gateway](./docs/api-reference.md) để biết mọi endpoint.

## Ví dụ

- [`examples/openai-compat/`](./examples/openai-compat): Script tích hợp OpenAI SDK thay thế trực tiếp.
- [`examples/rag-example/`](./examples/rag-example): Pipeline RAG đầu cuối dùng cơ sở dữ liệu vector Qdrant và embedding của Ollama.

## Được kiểm thử trong CI

Mỗi pull request chạy một bài kiểm thử đầu cuối trên GitHub Actions (amd64 và arm64): init, up, tải một mô hình rất nhỏ (smollm:135m, khoảng 90 MB), liệt kê nó qua /v1/models, một yêu cầu /v1/chat/completions không streaming, giới hạn tốc độ (401 và 429) và kiểm tra trang khởi đầu của Open WebUI có phản hồi. Chưa được kiểm thử: phản hồi streaming, embedding, tăng tốc GPU và máy chủ macOS/Windows.

Cũng đã được kiểm thử thủ công trên máy Mac Apple M1 với Docker Desktop và Ollama cài qua Homebrew (0.5.2): `init` với preset `minimal` và Ollama cài đặt gốc, `up`, đăng nhập Open WebUI, trò chuyện với `gemma3:1b` và mở `pondok-ai share` từ điện thoại trong cùng mạng Wi-Fi.

## Hạn chế đã biết

- Chưa được kiểm thử trên máy Windows. macOS đã được kiểm thử thủ công trên Apple Silicon (xem ở trên), nhưng chưa có trong CI.
- Trên Apple Silicon, container Docker không thể dùng GPU. Hãy chạy `pondok-ai init --native-ollama` để dùng Ollama cài đặt gốc với Metal; xem [hướng dẫn GPU](./docs/gpu-setup.md).
- Tăng tốc GPU, phản hồi streaming và embedding chưa được CI kiểm thử.
- Các image khá lớn (vài GB). Hãy chuẩn bị nhiều dung lượng trống; một workspace đám mây 32 GB còn trống 19 GB đã hết chỗ khi giải nén image Ollama.

## Tài liệu

- [Tổng quan kiến trúc](./docs/architecture.md)
- [Tài liệu tham khảo API Gateway](./docs/api-reference.md)
- [Hướng dẫn cấu hình](./docs/configuration.md)
- [Thiết lập tăng tốc GPU (Metal / CUDA)](./docs/gpu-setup.md)
- [Khắc phục sự cố và chẩn đoán](./docs/troubleshooting.md)
- [Ghi lại bản demo cho README](./docs/demo/RECORDING.md)

## Đóng góp

Mọi đóng góp đều được hoan nghênh! Xem [CONTRIBUTING.md](./CONTRIBUTING.md) để bắt đầu.

## Giấy phép

[MIT](./LICENSE) © 2026 những người đóng góp cho pondok-ai
