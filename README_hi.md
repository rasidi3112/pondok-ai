<div align="center">

# pondok-ai

**एक ही कमांड से अपना निजी AI स्टैक लोकल रूप से चलाएँ।**

लोकल LLM, चैट UI, वेक्टर सर्च और OpenAI-संगत API, जिन्हें Docker Compose से एक साथ जोड़ा गया है।

[![npm version](https://img.shields.io/npm/v/pondok-ai?logo=npm&color=cb3837)](https://www.npmjs.com/package/pondok-ai)
[![CI](https://github.com/rasidi3112/pondok-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/rasidi3112/pondok-ai/actions/workflows/ci.yml)
[![Node.js](https://img.shields.io/node/v/pondok-ai?logo=node.js&logoColor=white&color=339933)](https://nodejs.org)
[![Docker Compose v2](https://img.shields.io/badge/Docker%20Compose-v2-2496ED?logo=docker&logoColor=white)](https://docs.docker.com/compose/)
[![License: MIT](https://img.shields.io/github/license/rasidi3112/pondok-ai?color=blue)](./LICENSE)

[English](README.md) · [Bahasa Indonesia](README_id.md) · [한국어](README_ko.md) · [العربية](README_ar.md) · [Español](README_es.md) · [中文](README_zh.md) · [Français](README_fr.md) · [日本語](README_ja.md) · [Deutsch](README_de.md) · [Português](README_pt.md) · [Русский](README_ru.md) · **हिन्दी** · [Türkçe](README_tr.md) · [Italiano](README_it.md) · [Tiếng Việt](README_vi.md) · [Polski](README_pl.md) · [Bahasa Melayu](README_ms.md)

<sub>अनुवाद मशीन द्वारा तैयार किए गए हैं और अंग्रेज़ी README से पीछे हो सकते हैं।</sub>

<br>

<a href="docs/demo/demo.mp4">
  <img src="docs/demo/demo.gif" alt="pondok-ai डेमो: init, up, फिर Open WebUI में gemma3:1b के साथ चैट" width="100%">
</a>

<sub>एक खाली फ़ोल्डर से लेकर लोकल मॉडल के जवाब तक। नेटिव Ollama (Metal GPU) वाले Apple M1 Mac पर रिकॉर्ड किया गया, इमेज और मॉडल पहले से डाउनलोड थे; Open WebUI के शुरू होने की प्रतीक्षा तेज़ की गई है और स्क्रीन पर दिखाई गई है। उस Mac में 10 GB से कम खाली डिस्क थी, इसलिए <code>init</code> को <code>--force</code> के साथ चलाया गया।<br>
<a href="docs/demo/demo.mp4"><b>▶ 1080p वीडियो देखें</b></a></sub>

<br>

[क्विकस्टार्ट](#क्विकस्टार्ट) · [विशेषताएँ](#विशेषताएँ) · [स्क्रीनशॉट](#स्क्रीनशॉट) · [प्रीसेट](#प्रीसेट) · [CLI](#cli-कमांड) · [API गेटवे](#api-गेटवे) · [दस्तावेज़](#दस्तावेज़)

</div>

---

## अवलोकन

`pondok-ai` एक CLI है जो आपकी अपनी मशीन पर एक पूर्ण, निजी AI वातावरण शुरू करता है। यह आपके हार्डवेयर के अनुसार Docker Compose स्टैक बनाता है, उसे हेल्थ चेक के साथ शुरू करता है, और आपके लिए मॉडल का प्रबंधन करता है।

प्रॉम्प्ट, चैट और एम्बेडिंग आपकी मशीन पर ही प्रोसेस होते हैं। कंटेनर इमेज और मॉडल वेट पहली बार डाउनलोड करने के लिए इंटरनेट कनेक्शन ज़रूरी है।

```bash
npx pondok-ai init
npx pondok-ai up
```

<sub>Pondok इंडोनेशियाई भाषा में एक छोटी झोपड़ी या आश्रय को कहते हैं। यह पैकेज पहले `local-ai-stack` नाम से प्रकाशित होता था।</sub>

## विशेषताएँ

| | |
|---|---|
| **लोकल प्रोसेसिंग** | प्रॉम्प्ट, चैट, एम्बेडिंग और इन्फ़रेंस आपके हार्डवेयर पर चलते हैं। |
| **हार्डवेयर पहचान** | OS, आर्किटेक्चर, RAM, डिस्क और GPU (Apple Metal, NVIDIA CUDA) पहचानता है और उपयुक्त प्रीसेट व मॉडल सुझाता है। |
| **मॉड्यूलर प्रीसेट** | हल्के चैट UI (`minimal`) से RAG स्टैक (`standard`) या ऑटोमेशन पाइपलाइन (`full`) तक बढ़ाएँ। |
| **OpenAI-संगत गेटवे** | कोड दोबारा लिखे बिना OpenAI SDK या LangChain को `http://localhost:8000/v1` पर पॉइंट करें। |
| **मॉडल मैनेजर** | मॉडल डाउनलोड करें, सूचीबद्ध करें, जाँचें और हटाएँ, हर डाउनलोड से पहले RAM और डिस्क की सुरक्षा जाँच के साथ। |
| **डायग्नोस्टिक्स** | `pondok-ai doctor` समस्या आने से पहले Docker डेमन, पोर्ट, RAM, डिस्क और GPU की जाँच करता है। |
| **बैकअप** | SHA-256 इंटीग्रिटी जाँच के साथ कॉन्फ़िग और डेटा वॉल्यूम का बैकअप लें और उन्हें रीस्टोर करें। |

## क्विकस्टार्ट

**पूर्वापेक्षाएँ:** Node.js 22 या नया, Docker और Docker Compose v2।

**1. स्टैक इनिशियलाइज़ करें**

```bash
# हार्डवेयर पहचान के साथ इंटरैक्टिव सेटअप विज़ार्ड
npx pondok-ai init

# या चुने हुए प्रीसेट के साथ बिना इंटरैक्शन के
npx pondok-ai init --preset standard --yes
```

**2. सर्विस शुरू करें** (सभी सर्विस स्वस्थ होने तक प्रतीक्षा करता है)

```bash
npx pondok-ai up
```

पहली बार शुरू होने में कुछ मिनट लग सकते हैं, क्योंकि Open WebUI अपने सहायक मॉडल डाउनलोड करता है। नेटिव Ollama वाले Mac पर, अगर Ollama नहीं चल रहा है तो `up` उसे भी शुरू कर देता है। अगर अभी कोई मॉडल इंस्टॉल नहीं है, तो `up` बताता है कि आपकी RAM के लिए कौन-सा मॉडल सही है।

**3. एक मॉडल चुनें और इंस्टॉल करें**

```bash
# आपकी RAM, VRAM और खाली डिस्क के आधार पर सुझाव
npx pondok-ai model recommend

# मेमोरी और डिस्क की पूर्व-जाँच के साथ इंस्टॉल करें
npx pondok-ai model install llama3.2:3b
```

चलने के बाद, अपना स्टैक खोलें:

| सर्विस | URL |
|---|---|
| Open WebUI | [http://localhost:3000](http://localhost:3000) |
| API गेटवे | [http://localhost:8000](http://localhost:8000) |
| Ollama | [http://localhost:11434](http://localhost:11434) |
| Qdrant | [http://localhost:6333/dashboard](http://localhost:6333/dashboard) *(पोर्ट मैप होने पर)* |

<details>
<summary><b>इंस्टॉलर स्क्रिप्ट</b> (प्रायोगिक, CI द्वारा कवर नहीं)</summary>

**macOS और Linux**

```bash
curl -fsSL https://raw.githubusercontent.com/rasidi3112/pondok-ai/main/scripts/install.sh | bash
```

**Windows (PowerShell)**

```powershell
iwr -useb https://raw.githubusercontent.com/rasidi3112/pondok-ai/main/scripts/install.ps1 | iex
```

</details>

## स्क्रीनशॉट

<p align="center">
  <img src="docs/demo/screenshots/chat.png" alt="लोकल रूप से चल रहे gemma3:1b के साथ सवाल का जवाब देता Open WebUI" width="100%">
  <br>
  <sub>Apple M1 Mac पर नेटिव Ollama द्वारा परोसे गए <code>gemma3:1b</code> के साथ चैट करता Open WebUI।</sub>
</p>

<table>
  <tr>
    <td width="50%"><img src="docs/demo/screenshots/doctor.png" alt="pondok-ai doctor आउटपुट: सिस्टम जानकारी, Docker स्थिति और आवश्यकताओं की जाँच"></td>
    <td width="50%"><img src="docs/demo/screenshots/model-recommend.png" alt="pondok-ai model recommend आउटपुट: इस मशीन के लिए संगत, मुश्किल से फ़िट और असंगत मॉडल"></td>
  </tr>
  <tr>
    <td align="center"><sub><code>pondok-ai doctor</code> Docker, RAM, डिस्क और GPU की जाँच करता है</sub></td>
    <td align="center"><sub><code>pondok-ai model recommend</code> मॉडल को इस हिसाब से छाँटता है कि आपका हार्डवेयर क्या चला सकता है</sub></td>
  </tr>
</table>

## प्रीसेट

| प्रीसेट | शामिल सर्विस | न्यूनतम RAM | किसके लिए उपयुक्त |
|---|---|---|---|
| **`minimal`** | Ollama, Open WebUI | 8 GB | तेज़ लोकल चैट, हल्के प्रयोग |
| **`standard`** *(डिफ़ॉल्ट)* | Ollama, Open WebUI, PostgreSQL, Qdrant, API Gateway | 16 GB | RAG पाइपलाइन, ऐप डेवलपमेंट, OpenAI का विकल्प |
| **`full`** | Standard + n8n ऑटोमेशन इंजन | 16+ GB | स्वायत्त AI एजेंट, विज़ुअल वर्कफ़्लो ऑटोमेशन |

## आर्किटेक्चर

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

विवरण के लिए [आर्किटेक्चर अवलोकन](./docs/architecture.md) देखें।

## CLI कमांड

| कमांड | विवरण |
|---|---|
| `pondok-ai init` | हार्डवेयर पहचान के साथ इंटरैक्टिव कॉन्फ़िगरेशन विज़ार्ड चलाएँ |
| `pondok-ai up` | Compose कॉन्फ़िग सत्यापित करें, कंटेनर शुरू करें और हेल्थ चेक की प्रतीक्षा करें |
| `pondok-ai down` | स्टैक कंटेनर रोकें और हटाएँ |
| `pondok-ai start` | पहले से मौजूद रुके हुए कंटेनर शुरू करें |
| `pondok-ai stop` | चल रहे कंटेनर रोकें |
| `pondok-ai restart` | स्टैक कंटेनर रीस्टार्ट करें |
| `pondok-ai status` | कंटेनर की हेल्थ और URL दिखाएँ |
| `pondok-ai logs [service]` | लॉग देखें (स्ट्रीम करने के लिए `-f`) |
| `pondok-ai doctor` | Docker, RAM, GPU/VRAM, पोर्ट का निदान और मॉडल सुझाव |
| `pondok-ai update` | कॉन्फ़िगर की गई पिन इमेज को ऑटोमैटिक बैकअप और हेल्थ चेक के साथ फिर से पुल करें |
| `pondok-ai backup` | SHA-256 इंटीग्रिटी जाँच के साथ कॉन्फ़िग और डेटा वॉल्यूम का बैकअप (एन्क्रिप्टेड नहीं) |
| `pondok-ai restore <path>` | SHA-256 इंटीग्रिटी-जाँचे गए बैकअप से रीस्टोर करें (एन्क्रिप्टेड नहीं) |
| `pondok-ai reset` | स्टैक रीसेट करें (जब तक `--delete-data` न दिया जाए, वॉल्यूम सुरक्षित रहते हैं) |
| `pondok-ai config` | सक्रिय कॉन्फ़िगरेशन देखें या संपादित करें |
| `pondok-ai model list` | डाउनलोड किए गए मॉडल की सूची |
| `pondok-ai model recommend` | हार्डवेयर के अनुसार मॉडल सुझाव (RAM, VRAM, डिस्क) |
| `pondok-ai model install <name>` | संसाधनों की पूर्व-सुरक्षा जाँच के साथ नया मॉडल पुल करें |
| `pondok-ai model remove <name>` | इंस्टॉल किया गया मॉडल हटाएँ |
| `pondok-ai model status` | मॉडल के संसाधन उपयोग की जाँच करें |

इमेज स्पष्ट वर्शन पर पिन की गई हैं। `pondok-ai update` कॉन्फ़िगर किए गए वर्शन को रीफ़्रेश करता है; यह नए रिलीज़ नहीं चुनता। नया CLI इंस्टॉल करने के बाद, CLI के केवल पुराने डिफ़ॉल्ट इमेज टैग माइग्रेट करने के लिए `pondok-ai update --upgrade-images` चलाएँ। कस्टम इमेज मान सुरक्षित रहते हैं।

## API गेटवे

API गेटवे सीधे बदले जा सकने वाले OpenAI REST एंडपॉइंट देता है। किसी `/v1/*` एंडपॉइंट को कॉल करने से पहले `PONDOK_AI_API_KEY` को जनरेट किए गए `API_SECRET_KEY` पर सेट करें।

डिफ़ॉल्ट रूप से गेटवे प्रमाणित `/v1/*` अनुरोधों को प्रति क्लाइंट (स्रोत IP और API key) प्रति मिनट 120 अनुरोधों तक सीमित करता है। अगर आपके लोकल क्लाइंट को अलग सीमा चाहिए, तो `.env` में `RATE_LIMIT_MAX_REQUESTS` और `RATE_LIMIT_WINDOW_MS` कॉन्फ़िगर करें।

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
<summary><b>आधिकारिक OpenAI Node.js SDK के साथ उपयोग</b></summary>

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

सभी एंडपॉइंट के लिए [API गेटवे संदर्भ](./docs/api-reference.md) देखें।

## उदाहरण

- [`examples/openai-compat/`](./examples/openai-compat): OpenAI SDK को सीधे बदलकर इस्तेमाल करने वाली इंटीग्रेशन स्क्रिप्ट।
- [`examples/rag-example/`](./examples/rag-example): Qdrant वेक्टर डेटाबेस और Ollama एम्बेडिंग का उपयोग करने वाली एंड-टू-एंड RAG पाइपलाइन।

## CI में परीक्षित

हर पुल रिक्वेस्ट GitHub Actions (amd64 और arm64) पर एक एंड-टू-एंड टेस्ट चलाती है: init, up, एक बहुत छोटा मॉडल पुल करना (smollm:135m, लगभग 90 MB), /v1/models से उसकी सूची देखना, एक नॉन-स्ट्रीमिंग /v1/chat/completions अनुरोध, रेट लिमिटिंग (401 और 429), और यह जाँच कि Open WebUI का स्टार्ट पेज जवाब देता है। अभी कवर नहीं: स्ट्रीमिंग रिस्पॉन्स, एम्बेडिंग, GPU एक्सेलेरेशन और macOS/Windows होस्ट।

इसके अलावा Docker Desktop और Homebrew से इंस्टॉल Ollama वाले Apple M1 Mac पर 0.5.2 का हाथ से परीक्षण किया गया: `minimal` प्रीसेट और नेटिव Ollama के साथ `init`, `up`, Open WebUI में लॉग इन, `gemma3:1b` से चैट, और उसी Wi-Fi पर एक फ़ोन से खोला गया `pondok-ai share`।

## ज्ञात सीमाएँ

- अभी तक Windows होस्ट पर परीक्षण नहीं किया गया है। macOS का Apple Silicon पर हाथ से परीक्षण किया गया है (ऊपर देखें), लेकिन CI में नहीं।
- Apple Silicon पर Docker कंटेनर GPU का उपयोग नहीं कर सकते। इसके बजाय Metal के साथ नेटिव रूप से इंस्टॉल Ollama इस्तेमाल करने के लिए `pondok-ai init --native-ollama` चलाएँ; [GPU गाइड](./docs/gpu-setup.md) देखें।
- GPU एक्सेलेरेशन, स्ट्रीमिंग रिस्पॉन्स और एम्बेडिंग अभी CI द्वारा कवर नहीं हैं।
- इमेज बड़ी हैं (कई GB)। पर्याप्त खाली डिस्क स्पेस रखें; 19 GB खाली स्पेस वाले 32 GB क्लाउड वर्कस्पेस में Ollama इमेज निकालते समय जगह खत्म हो गई थी।

## दस्तावेज़

- [आर्किटेक्चर अवलोकन](./docs/architecture.md)
- [API गेटवे संदर्भ](./docs/api-reference.md)
- [कॉन्फ़िगरेशन गाइड](./docs/configuration.md)
- [GPU एक्सेलेरेशन सेटअप (Metal / CUDA)](./docs/gpu-setup.md)
- [समस्या निवारण और डायग्नोस्टिक्स](./docs/troubleshooting.md)
- [README डेमो रिकॉर्ड करना](./docs/demo/RECORDING.md)

## योगदान

योगदान का स्वागत है! शुरू करने के लिए [CONTRIBUTING.md](./CONTRIBUTING.md) देखें।

## लाइसेंस

[MIT](./LICENSE) © 2026 pondok-ai योगदानकर्ता
