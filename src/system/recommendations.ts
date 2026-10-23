import { SystemInfo } from './detect.js';

export interface ModelSpec {
  name: string;
  displayName: string;
  description: string;
  category: 'general' | 'coding' | 'embedding' | 'reasoning' | 'compact';
  parameterSize: string;
  diskSizeGB: number;
  minRamGB: number;
  recommendedRamGB: number;
  vramGB?: number;
  /** Languages besides English the model handles well, as ISO 639-1 codes. */
  languages?: string[];
}

export type CompatibilityTier = 'compatible' | 'tight' | 'incompatible';

export interface ModelRecommendation {
  model: ModelSpec;
  tier: CompatibilityTier;
  reason: string;
  fitsInVram: boolean;
  fitsInRam: boolean;
  fitsInDisk: boolean;
}

/**
 * Languages that `--lang` can filter recommendations by.
 */
export const SUPPORTED_LANGUAGES: Record<string, string> = {
  id: 'Bahasa Indonesia',
};

export interface RecommendationOptions {
  /** Only recommend models that handle this language well (ISO 639-1 code). */
  language?: string;
}

export interface RecommendationReport {
  recommendedDefault: ModelSpec;
  compatibleModels: ModelRecommendation[];
  tightModels: ModelRecommendation[];
  incompatibleModels: ModelRecommendation[];
  summary: string;
}

export const POPULAR_MODELS: ModelSpec[] = [
  // Compact / Edge models
  {
    name: 'llama3.2:1b',
    displayName: 'Llama 3.2 (1B)',
    description: 'Ultra-fast, lightweight model ideal for resource-constrained systems',
    category: 'compact',
    parameterSize: '1B',
    diskSizeGB: 1.3,
    minRamGB: 2,
    recommendedRamGB: 4,
    vramGB: 2,
  },
  {
    name: 'qwen2.5:1.5b',
    displayName: 'Qwen 2.5 (1.5B)',
    description: 'Fast multilingual compact model with great instruction following',
    category: 'compact',
    parameterSize: '1.5B',
    diskSizeGB: 1.0,
    minRamGB: 2,
    recommendedRamGB: 4,
    vramGB: 2,
    languages: ['id'],
  },
  // Balanced / Everyday assistants
  {
    name: 'llama3.2:3b',
    displayName: 'Llama 3.2 (3B)',
    description: 'Best balanced model for local chat, summarization, and daily tasks',
    category: 'general',
    parameterSize: '3B',
    diskSizeGB: 2.0,
    minRamGB: 4,
    recommendedRamGB: 6,
    vramGB: 3,
  },
  {
    name: 'qwen2.5:3b',
    displayName: 'Qwen 2.5 (3B)',
    description: 'Multilingual everyday assistant that answers well in Bahasa Indonesia',
    category: 'general',
    parameterSize: '3B',
    diskSizeGB: 1.9,
    minRamGB: 4,
    recommendedRamGB: 6,
    vramGB: 3,
    languages: ['id'],
  },
  {
    name: 'gemma3:4b',
    displayName: 'Gemma 3 (4B)',
    description: 'Google multilingual model trained on 140+ languages, including Bahasa Indonesia',
    category: 'general',
    parameterSize: '4B',
    diskSizeGB: 3.3,
    minRamGB: 6,
    recommendedRamGB: 8,
    vramGB: 4,
    languages: ['id'],
  },
  {
    name: 'phi3:mini',
    displayName: 'Phi-3 Mini (3.8B)',
    description: 'Strong mathematical and logical reasoning in a compact footprint',
    category: 'reasoning',
    parameterSize: '3.8B',
    diskSizeGB: 2.2,
    minRamGB: 4,
    recommendedRamGB: 6,
    vramGB: 4,
  },
  {
    name: 'mistral:7b',
    displayName: 'Mistral (7B)',
    description: 'Fast, high quality general purpose conversational model',
    category: 'general',
    parameterSize: '7B',
    diskSizeGB: 4.1,
    minRamGB: 6,
    recommendedRamGB: 10,
    vramGB: 6,
  },
  {
    name: 'llama3.1:8b',
    displayName: 'Llama 3.1 (8B)',
    description: 'Meta flagship 8B model with excellent general reasoning and tool use',
    category: 'general',
    parameterSize: '8B',
    diskSizeGB: 4.7,
    minRamGB: 8,
    recommendedRamGB: 12,
    vramGB: 8,
  },
  {
    name: 'qwen2.5:7b',
    displayName: 'Qwen 2.5 (7B)',
    description: 'High-capability 7B general intelligence model with excellent knowledge breadth',
    category: 'general',
    parameterSize: '7B',
    diskSizeGB: 4.7,
    minRamGB: 8,
    recommendedRamGB: 12,
    vramGB: 8,
    languages: ['id'],
  },
  {
    name: 'aya-expanse:8b',
    displayName: 'Aya Expanse (8B)',
    description: 'Cohere model built for 23 languages, including Bahasa Indonesia',
    category: 'general',
    parameterSize: '8B',
    diskSizeGB: 5.1,
    minRamGB: 8,
    recommendedRamGB: 12,
    vramGB: 6,
    languages: ['id'],
  },
  {
    name: 'deepseek-r1:7b',
    displayName: 'DeepSeek R1 (7B)',
    description: 'Advanced reasoning model trained with reinforcement learning',
    category: 'reasoning',
    parameterSize: '7B',
    diskSizeGB: 4.7,
    minRamGB: 8,
    recommendedRamGB: 12,
    vramGB: 8,
  },
  // Coding models
  {
    name: 'qwen2.5-coder:7b',
    displayName: 'Qwen 2.5 Coder (7B)',
    description: 'Top-tier code generation, debugging, and comprehension',
    category: 'coding',
    parameterSize: '7B',
    diskSizeGB: 4.7,
    minRamGB: 8,
    recommendedRamGB: 12,
    vramGB: 8,
  },
  {
    name: 'codellama:7b',
    displayName: 'CodeLlama (7B)',
    description: 'Meta specialized model for software engineering and programming',
    category: 'coding',
    parameterSize: '7B',
    diskSizeGB: 3.8,
    minRamGB: 6,
    recommendedRamGB: 10,
    vramGB: 6,
  },
  // Heavy / Workstation models
  {
    name: 'gemma3:12b',
    displayName: 'Gemma 3 (12B)',
    description: 'Stronger multilingual Gemma 3 for writing and analysis in Bahasa Indonesia',
    category: 'general',
    parameterSize: '12B',
    diskSizeGB: 8.1,
    minRamGB: 12,
    recommendedRamGB: 16,
    vramGB: 10,
    languages: ['id'],
  },
  {
    name: 'deepseek-r1:14b',
    displayName: 'DeepSeek R1 (14B)',
    description: 'High-precision 14B reasoning model for complex analytical queries',
    category: 'reasoning',
    parameterSize: '14B',
    diskSizeGB: 9.0,
    minRamGB: 14,
    recommendedRamGB: 20,
    vramGB: 12,
  },
  {
    name: 'llama3.1:70b',
    displayName: 'Llama 3.1 (70B)',
    description: 'Flagship 70B model requiring dedicated workstation / multi-GPU',
    category: 'general',
    parameterSize: '70B',
    diskSizeGB: 39.0,
    minRamGB: 48,
    recommendedRamGB: 64,
    vramGB: 40,
  },
  // Embeddings
  {
    name: 'nomic-embed-text',
    displayName: 'Nomic Embed Text',
    description: 'High performance embeddings with 8192 context window for RAG',
    category: 'embedding',
    parameterSize: '137M',
    diskSizeGB: 0.3,
    minRamGB: 1,
    recommendedRamGB: 2,
    vramGB: 1,
  },
  {
    name: 'bge-m3',
    displayName: 'BGE-M3',
    description: 'Multilingual embeddings for RAG over documents in Bahasa Indonesia and 100+ languages',
    category: 'embedding',
    parameterSize: '567M',
    diskSizeGB: 1.2,
    minRamGB: 2,
    recommendedRamGB: 4,
    vramGB: 2,
    languages: ['id'],
  },
];

/**
 * Default model per RAM size for each supported language, smallest machine first.
 */
const LANGUAGE_DEFAULTS: Record<string, Array<{ belowRamGB: number; model: string }>> = {
  id: [
    { belowRamGB: 8, model: 'qwen2.5:1.5b' },
    { belowRamGB: 16, model: 'gemma3:4b' },
    { belowRamGB: Infinity, model: 'gemma3:12b' },
  ],
};

/**
 * Evaluate compatibility of a specific model against system hardware.
 */
export function evaluateModel(model: ModelSpec, system: SystemInfo): ModelRecommendation {
  const ram = system.totalMemoryGB;
  const freeDisk = system.diskFreeGB ?? 50; // Assume sufficient if undetermined
  const vram = system.vramGB;

  const fitsInDisk = freeDisk >= model.diskSizeGB + 2; // Keep at least 2GB breathing room
  const fitsInRam = ram >= model.minRamGB;
  const fitsInVram = vram !== null && vram !== undefined && vram >= (model.vramGB ?? model.minRamGB);

  let tier: CompatibilityTier;
  let reason: string;

  if (!fitsInDisk) {
    tier = 'incompatible';
    reason = `Insufficient disk space (${freeDisk.toFixed(1)}GB available, need ${(model.diskSizeGB + 2).toFixed(1)}GB)`;
  } else if (!fitsInRam) {
    tier = 'incompatible';
    reason = `Requires at least ${model.minRamGB}GB RAM (system has ${ram.toFixed(1)}GB)`;
  } else if (ram >= model.recommendedRamGB) {
    tier = 'compatible';
    reason = fitsInVram
      ? `Runs fully accelerated on GPU (${vram}GB VRAM)`
      : `Runs comfortably in system memory (${ram}GB RAM)`;
  } else {
    tier = 'tight';
    reason = `Meets minimum ${model.minRamGB}GB RAM, but ${model.recommendedRamGB}GB recommended to prevent swapping`;
  }

  return {
    model,
    tier,
    reason,
    fitsInVram,
    fitsInRam,
    fitsInDisk,
  };
}

/**
 * The model to suggest first for a machine with this much memory.
 */
export function getDefaultModel(totalMemoryGB: number, language?: string): ModelSpec {
  const languageDefault = language
    ? LANGUAGE_DEFAULTS[language]?.find((d) => totalMemoryGB < d.belowRamGB)
    : undefined;
  if (languageDefault) {
    return POPULAR_MODELS.find((m) => m.name === languageDefault.model)!;
  } else if (totalMemoryGB < 8) {
    return POPULAR_MODELS.find((m) => m.name === 'llama3.2:1b')!;
  } else if (totalMemoryGB < 16) {
    return POPULAR_MODELS.find((m) => m.name === 'llama3.2:3b')!;
  } else if (totalMemoryGB < 32) {
    return POPULAR_MODELS.find((m) => m.name === 'llama3.1:8b') ?? POPULAR_MODELS.find((m) => m.name === 'llama3.2:3b')!;
  }
  return POPULAR_MODELS.find((m) => m.name === 'deepseek-r1:14b') ?? POPULAR_MODELS.find((m) => m.name === 'llama3.1:8b')!;
}

/**
 * Generate a complete recommendation report tailored to detected hardware.
 */
export function getModelRecommendations(
  system: SystemInfo,
  options: RecommendationOptions = {},
): RecommendationReport {
  const { language } = options;
  const models = language
    ? POPULAR_MODELS.filter((m) => m.languages?.includes(language))
    : POPULAR_MODELS;
  const evaluated = models.map((m) => evaluateModel(m, system));

  const compatible = evaluated.filter((e) => e.tier === 'compatible');
  const tight = evaluated.filter((e) => e.tier === 'tight');
  const incompatible = evaluated.filter((e) => e.tier === 'incompatible');

  const defaultModel = getDefaultModel(system.totalMemoryGB, language);

  const summary = `Detected ${system.totalMemoryGB}GB RAM, ${system.cpuCount} CPU cores${system.gpuAvailable ? `, and ${system.gpuInfo}` : ''}.`;

  return {
    recommendedDefault: defaultModel,
    compatibleModels: compatible,
    tightModels: tight,
    incompatibleModels: incompatible,
    summary,
  };
}

/**
 * Estimate requirements for a model that is not in POPULAR_MODELS from the parameter
 * count in its tag, e.g. `qwen2.5:14b` or `llama3.1:8b-instruct-q8_0`. Ollama's default
 * tags are 4-bit quantized, about 0.6 GB per billion parameters.
 */
export function estimateModelSpec(modelName: string): ModelSpec | undefined {
  const tag = modelName.split(':')[1] ?? '';
  const match = /(?:^|[-_])(\d+(?:\.\d+)?)b(?:$|[-_])/.exec(tag);
  if (!match) {
    return undefined;
  }

  const billions = Number(match[1]);
  const gbPerBillion = /fp16|f16|bf16/.test(tag) ? 2 : /q8/.test(tag) ? 1.07 : 0.6;
  const diskSizeGB = Math.round(billions * gbPerBillion * 10) / 10;

  return {
    name: modelName,
    displayName: modelName,
    description: 'Requirements estimated from the parameter count in the tag',
    category: 'general',
    parameterSize: `${match[1]}B`,
    diskSizeGB,
    minRamGB: Math.ceil(diskSizeGB * 1.2 + 1),
    recommendedRamGB: Math.ceil(diskSizeGB * 1.5 + 2),
    vramGB: Math.ceil(diskSizeGB * 1.1),
  };
}

/**
 * Validate whether a model can run safely, producing actionable warnings.
 */
export function validateModelFit(
  modelName: string,
  system: SystemInfo,
): {
  canRun: boolean;
  tier: CompatibilityTier;
  warning?: string;
  spec?: ModelSpec;
} {
  const normalized = modelName.trim().toLowerCase();
  const [baseName, tag] = normalized.split(':');

  // A tag that names a size (qwen2.5:14b) must not borrow the spec of a smaller
  // sibling (qwen2.5:1.5b), so it is estimated from its parameter count instead.
  const spec =
    POPULAR_MODELS.find((m) => m.name.toLowerCase() === normalized) ??
    (tag ? estimateModelSpec(normalized) : undefined) ??
    POPULAR_MODELS.find((m) => m.name.toLowerCase().startsWith(baseName));

  if (!spec) {
    // Unknown model — general heuristic
    return {
      canRun: true,
      tier: 'compatible',
    };
  }

  const evaluation = evaluateModel(spec, system);

  if (evaluation.tier === 'incompatible') {
    return {
      canRun: false,
      tier: 'incompatible',
      warning: evaluation.reason,
      spec,
    };
  }

  if (evaluation.tier === 'tight') {
    return {
      canRun: true,
      tier: 'tight',
      warning: evaluation.reason,
      spec,
    };
  }

  return {
    canRun: true,
    tier: 'compatible',
    spec,
  };
}
