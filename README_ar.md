<div align="center">

# pondok-ai

**شغّل حزمة الذكاء الاصطناعي الخاصة بك محليًا بأمر واحد.**

نماذج لغوية محلية، وواجهة دردشة، وبحث متجهي، وواجهة برمجية متوافقة مع OpenAI، مترابطة معًا عبر Docker Compose.

[![npm version](https://img.shields.io/npm/v/pondok-ai?logo=npm&color=cb3837)](https://www.npmjs.com/package/pondok-ai)
[![CI](https://github.com/rasidi3112/pondok-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/rasidi3112/pondok-ai/actions/workflows/ci.yml)
[![Node.js](https://img.shields.io/node/v/pondok-ai?logo=node.js&logoColor=white&color=339933)](https://nodejs.org)
[![Docker Compose v2](https://img.shields.io/badge/Docker%20Compose-v2-2496ED?logo=docker&logoColor=white)](https://docs.docker.com/compose/)
[![License: MIT](https://img.shields.io/github/license/rasidi3112/pondok-ai?color=blue)](./LICENSE)

[English](README.md) · [Bahasa Indonesia](README_id.md) · [한국어](README_ko.md) · **العربية** · [Español](README_es.md) · [中文](README_zh.md) · [Français](README_fr.md) · [日本語](README_ja.md) · [Deutsch](README_de.md) · [Português](README_pt.md) · [Русский](README_ru.md) · [हिन्दी](README_hi.md) · [Türkçe](README_tr.md) · [Italiano](README_it.md) · [Tiếng Việt](README_vi.md) · [Polski](README_pl.md) · [Bahasa Melayu](README_ms.md)

<sub>الترجمات مُنشأة آليًا وقد لا تكون محدّثة مثل ملف README الإنجليزي.</sub>

<br>

<a href="docs/demo/demo.mp4">
  <img src="docs/demo/demo.gif" alt="عرض توضيحي لـ pondok-ai: الأمر init ثم up، ثم الدردشة مع gemma3:1b في Open WebUI" width="100%">
</a>

<sub>من مجلد فارغ إلى ردّ من نموذج محلي. سُجّل على جهاز Mac بمعالج Apple M1 مع Ollama أصلي (GPU ‏Metal) وتنزيل الصور والنموذج مسبقًا؛ وتم تسريع فترة انتظار بدء Open WebUI ووضع علامة عليها على الشاشة. كانت المساحة الحرة على قرص جهاز Mac أقل من 10 غيغابايت، لذا شُغّل <code>init</code> مع <code>--force</code>.<br>
<a href="docs/demo/demo.mp4"><b>▶ شاهد الفيديو بدقة 1080p</b></a></sub>

<br>

[البدء السريع](#البدء-السريع) · [الميزات](#الميزات) · [لقطات الشاشة](#لقطات-الشاشة) · [الإعدادات المسبقة](#الإعدادات-المسبقة) · [CLI](#أوامر-cli) · [بوابة API](#بوابة-api) · [التوثيق](#التوثيق)

</div>

---

## نظرة عامة

`pondok-ai` أداة سطر أوامر (CLI) تُشغّل بيئة ذكاء اصطناعي خاصة ومتكاملة على جهازك. تُنشئ حزمة Docker Compose مناسبة لعتادك، وتُشغّلها مع فحوصات السلامة، وتدير النماذج نيابةً عنك.

تُعالَج المطالبات والمحادثات والتضمينات على جهازك. يتطلب تنزيل صور الحاويات وأوزان النماذج لأول مرة اتصالًا بالإنترنت.

```bash
npx pondok-ai init
npx pondok-ai up
```

<sub>كلمة Pondok في الإندونيسية تعني كوخًا صغيرًا أو مأوى. كانت الحزمة تُنشر سابقًا باسم `local-ai-stack`.</sub>

## الميزات

| | |
|---|---|
| **معالجة محلية** | تعمل المطالبات والمحادثات والتضمينات والاستدلال على عتادك. |
| **اكتشاف العتاد** | يكتشف نظام التشغيل والمعمارية والذاكرة والقرص ووحدة GPU ‏(Apple Metal وNVIDIA CUDA)، ويوصي بإعداد مسبق ونماذج مناسبة. |
| **إعدادات مسبقة معيارية** | توسّع من واجهة دردشة خفيفة (`minimal`) إلى حزمة RAG ‏(`standard`) أو خط أتمتة (`full`). |
| **بوابة متوافقة مع OpenAI** | وجّه حزم OpenAI SDK أو LangChain إلى `http://localhost:8000/v1` دون إعادة كتابة الشيفرة. |
| **مدير النماذج** | نزّل النماذج واعرضها وافحصها واحذفها، مع فحوصات أمان للذاكرة والقرص قبل كل تنزيل. |
| **التشخيص** | يفحص `pondok-ai doctor` خدمة Docker والمنافذ والذاكرة والقرص ووحدة GPU قبل أن تواجه المشكلات. |
| **النسخ الاحتياطي** | انسخ الإعدادات ووحدات تخزين البيانات احتياطيًا واستعدها مع فحوصات سلامة SHA-256. |

## البدء السريع

**المتطلبات المسبقة:** Node.js 22 أو أحدث، وDocker، وDocker Compose v2.

**1. تهيئة الحزمة**

```bash
# معالج إعداد تفاعلي مع اكتشاف العتاد
npx pondok-ai init

# أو بشكل غير تفاعلي مع إعداد مسبق مختار
npx pondok-ai init --preset standard --yes
```

**2. تشغيل الخدمات** (ينتظر حتى تصبح كل الخدمات سليمة)

```bash
npx pondok-ai up
```

قد يستغرق التشغيل الأول بضع دقائق بينما يُنزّل Open WebUI نماذجه المساعدة. على جهاز Mac مع Ollama أصلي، يشغّل `up` أيضًا Ollama إن لم يكن يعمل. وإذا لم يُثبَّت أي نموذج بعد، يخبرك `up` بالنموذج المناسب لذاكرة RAM لديك.

**3. اختيار نموذج وتثبيته**

```bash
# توصيات بناءً على الذاكرة وذاكرة الرسوميات والمساحة الحرة على القرص
npx pondok-ai model recommend

# التثبيت مع فحص مسبق للذاكرة والقرص
npx pondok-ai model install llama3.2:3b
```

بعد التشغيل، افتح حزمتك:

| الخدمة | الرابط |
|---|---|
| Open WebUI | [http://localhost:3000](http://localhost:3000) |
| بوابة API | [http://localhost:8000](http://localhost:8000) |
| Ollama | [http://localhost:11434](http://localhost:11434) |
| Qdrant | [http://localhost:6333/dashboard](http://localhost:6333/dashboard) *(عند ربط المنفذ)* |

<details>
<summary><b>نصوص التثبيت</b> (تجريبية، غير مشمولة باختبارات CI)</summary>

**macOS وLinux**

```bash
curl -fsSL https://raw.githubusercontent.com/rasidi3112/pondok-ai/main/scripts/install.sh | bash
```

**Windows (PowerShell)**

```powershell
iwr -useb https://raw.githubusercontent.com/rasidi3112/pondok-ai/main/scripts/install.ps1 | iex
```

</details>

## لقطات الشاشة

<p align="center">
  <img src="docs/demo/screenshots/chat.png" alt="Open WebUI يجيب عن سؤال باستخدام gemma3:1b الذي يعمل محليًا" width="100%">
  <br>
  <sub>Open WebUI يتحاور مع <code>gemma3:1b</code> الذي يقدّمه Ollama أصلي على جهاز Mac بمعالج Apple M1.</sub>
</p>

<table>
  <tr>
    <td width="50%"><img src="docs/demo/screenshots/doctor.png" alt="مخرجات pondok-ai doctor: معلومات النظام وحالة Docker وفحص المتطلبات"></td>
    <td width="50%"><img src="docs/demo/screenshots/model-recommend.png" alt="مخرجات pondok-ai model recommend: النماذج المتوافقة والمتوافقة بالكاد وغير المتوافقة مع هذا الجهاز"></td>
  </tr>
  <tr>
    <td align="center"><sub><code>pondok-ai doctor</code> يفحص Docker والذاكرة والقرص ووحدة GPU</sub></td>
    <td align="center"><sub><code>pondok-ai model recommend</code> يرتّب النماذج حسب ما يستطيع عتادك تشغيله</sub></td>
  </tr>
</table>

## الإعدادات المسبقة

| الإعداد المسبق | الخدمات المضمّنة | الحد الأدنى للذاكرة | موصى به لـ |
|---|---|---|---|
| **`minimal`** | Ollama, Open WebUI | 8 GB | دردشة محلية سريعة، تجارب خفيفة |
| **`standard`** *(افتراضي)* | Ollama, Open WebUI, PostgreSQL, Qdrant, API Gateway | 16 GB | خطوط RAG، تطوير التطبيقات، بديل لـ OpenAI |
| **`full`** | Standard + محرك الأتمتة n8n | 16+ GB | وكلاء ذكاء اصطناعي مستقلون، أتمتة مرئية لسير العمل |

## البنية

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

راجع [نظرة عامة على البنية](./docs/architecture.md) لمزيد من التفاصيل.

## أوامر CLI

| الأمر | الوصف |
|---|---|
| `pondok-ai init` | تشغيل معالج الإعداد التفاعلي مع اكتشاف العتاد |
| `pondok-ai up` | التحقق من إعدادات Compose وتشغيل الحاويات وانتظار فحوصات السلامة |
| `pondok-ai down` | إيقاف حاويات الحزمة وإزالتها |
| `pondok-ai start` | تشغيل الحاويات الموجودة المتوقفة |
| `pondok-ai stop` | إيقاف الحاويات قيد التشغيل |
| `pondok-ai restart` | إعادة تشغيل حاويات الحزمة |
| `pondok-ai status` | عرض حالة الحاويات وروابطها |
| `pondok-ai logs [service]` | عرض السجلات (`-f` للمتابعة المباشرة) |
| `pondok-ai doctor` | تشخيص Docker والذاكرة وGPU/VRAM والمنافذ مع توصيات النماذج |
| `pondok-ai update` | إعادة تنزيل الصور المثبّتة الإصدار في الإعدادات مع نسخ احتياطي تلقائي وفحوصات السلامة |
| `pondok-ai backup` | نسخ الإعدادات ووحدات تخزين البيانات احتياطيًا مع فحوصات سلامة SHA-256 (غير مشفّرة) |
| `pondok-ai restore <path>` | الاستعادة من نسخة احتياطية تم التحقق من سلامتها بـ SHA-256 (غير مشفّرة) |
| `pondok-ai reset` | إعادة ضبط الحزمة (تُحفظ وحدات التخزين ما لم يُحدَّد `--delete-data`) |
| `pondok-ai config` | فحص الإعدادات النشطة أو تعديلها |
| `pondok-ai model list` | عرض النماذج المنزّلة |
| `pondok-ai model recommend` | توصيات نماذج مناسبة للعتاد (الذاكرة، VRAM، القرص) |
| `pondok-ai model install <name>` | تنزيل نموذج جديد مع فحوصات أمان مسبقة للموارد |
| `pondok-ai model remove <name>` | حذف نموذج مثبّت |
| `pondok-ai model status` | فحص استهلاك النماذج للموارد |

الصور مثبّتة على إصدارات محددة. يحدّث `pondok-ai update` الإصدارات المضبوطة ولا يختار إصدارات أحدث. بعد تثبيت إصدار أحدث من CLI، شغّل `pondok-ai update --upgrade-images` لترحيل وسوم الصور الافتراضية القديمة الخاصة بـ CLI فقط. تُحفظ قيم الصور المخصّصة كما هي.

## بوابة API

توفّر بوابة API نقاط نهاية REST متوافقة مع OpenAI يمكن استخدامها بديلًا مباشرًا. اضبط `PONDOK_AI_API_KEY` على قيمة `API_SECRET_KEY` المُنشأة قبل استدعاء أي نقطة نهاية `/v1/*`.

تحدّ البوابة افتراضيًا طلبات `/v1/*` الموثّقة بـ 120 طلبًا في الدقيقة لكل عميل (عنوان IP المصدر ومفتاح API). اضبط `RATE_LIMIT_MAX_REQUESTS` و`RATE_LIMIT_WINDOW_MS` في `.env` إذا احتاج عميلك المحلي إلى حدود مختلفة.

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
<summary><b>استخدام OpenAI Node.js SDK الرسمية</b></summary>

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

راجع [مرجع بوابة API](./docs/api-reference.md) لجميع نقاط النهاية.

## أمثلة

- [`examples/openai-compat/`](./examples/openai-compat): نص تكامل مع OpenAI SDK يعمل بديلًا مباشرًا.
- [`examples/rag-example/`](./examples/rag-example): خط RAG متكامل يستخدم قاعدة بيانات المتجهات Qdrant وتضمينات Ollama.

## مُختبَر في CI

يشغّل كل طلب سحب اختبارًا شاملًا على GitHub Actions ‏(amd64 وarm64): ‏init وup، وتنزيل نموذج صغير جدًا (smollm:135m، نحو 90 ميغابايت)، وعرضه عبر /v1/models، وطلب /v1/chat/completions دون بث، وتحديد المعدل (401 و429)، والتحقق من أن صفحة بدء Open WebUI تستجيب. غير مشمول بعد: الاستجابات المتدفقة، والتضمينات، وتسريع GPU، وأجهزة macOS/Windows.

واختُبر يدويًا أيضًا على جهاز Mac بمعالج Apple M1 مع Docker Desktop وOllama المثبّت عبر Homebrew ‏(0.5.2): ‏`init` مع الإعداد المسبق `minimal` وOllama أصلي، و`up`، وتسجيل الدخول إلى Open WebUI، والدردشة مع `gemma3:1b`، وفتح `pondok-ai share` من هاتف على شبكة Wi-Fi نفسها.

## القيود المعروفة

- لم يُختبر بعد على أجهزة Windows. اختُبر macOS يدويًا على Apple Silicon (انظر أعلاه)، لكنه غير مشمول في CI.
- على Apple Silicon، لا تستطيع حاويات Docker استخدام وحدة GPU. شغّل `pondok-ai init --native-ollama` لاستخدام Ollama مثبّت أصليًا مع Metal بدلًا من ذلك؛ راجع [دليل GPU](./docs/gpu-setup.md).
- تسريع GPU والاستجابات المتدفقة والتضمينات غير مشمولة باختبارات CI بعد.
- الصور كبيرة الحجم (عدة غيغابايت). خطّط لمساحة قرص حرة كافية؛ فقد نفدت المساحة في بيئة عمل سحابية بسعة 32 GB فيها 19 GB حرة أثناء فك صورة Ollama.

## التوثيق

- [نظرة عامة على البنية](./docs/architecture.md)
- [مرجع بوابة API](./docs/api-reference.md)
- [دليل الإعداد](./docs/configuration.md)
- [إعداد تسريع GPU ‏(Metal / CUDA)](./docs/gpu-setup.md)
- [استكشاف الأخطاء وإصلاحها والتشخيص](./docs/troubleshooting.md)
- [تسجيل العرض التوضيحي لملف README](./docs/demo/RECORDING.md)

## المساهمة

المساهمات مرحّب بها! اطّلع على [CONTRIBUTING.md](./CONTRIBUTING.md) للبدء.

## الترخيص

[MIT](./LICENSE) © 2026 المساهمون في pondok-ai
