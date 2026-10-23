import { describe, it, expect } from 'vitest';
import {
  evaluateModel,
  getDefaultModel,
  getModelRecommendations,
  pickDefaultModel,
  validateModelFit,
  estimateModelSpec,
  POPULAR_MODELS,
  ModelSpec,
} from '../../src/system/recommendations.js';
import { SystemInfo } from '../../src/system/detect.js';

function createMockSystem(overrides: Partial<SystemInfo> = {}): SystemInfo {
  return {
    os: 'macOS',
    arch: 'arm64',
    platform: 'darwin',
    totalMemoryGB: 16,
    freeMemoryGB: 8,
    cpuCount: 8,
    cpuModel: 'Apple M1',
    gpuAvailable: true,
    gpuType: 'metal',
    gpuName: 'Apple Silicon (Metal)',
    gpuInfo: 'Apple Silicon (Metal, ~12GB unified VRAM)',
    vramGB: 12,
    vramFreeGB: 6,
    dockerInstalled: true,
    dockerRunning: true,
    dockerVersion: '24.0.0',
    dockerComposeVersion: '2.20.0',
    diskFreeGB: 100,
    ...overrides,
  };
}

describe('Smart Hardware Detection & Model Recommendations', () => {
  describe('evaluateModel', () => {
    it('should classify lightweight models as compatible on standard hardware', () => {
      const system = createMockSystem({ totalMemoryGB: 16, diskFreeGB: 80 });
      const llama3b = POPULAR_MODELS.find((m) => m.name === 'llama3.2:3b')!;

      const result = evaluateModel(llama3b, system);
      expect(result.tier).toBe('compatible');
      expect(result.fitsInRam).toBe(true);
      expect(result.fitsInDisk).toBe(true);
    });

    it('should classify large models as incompatible when RAM is insufficient', () => {
      const system = createMockSystem({ totalMemoryGB: 8 });
      const llama70b = POPULAR_MODELS.find((m) => m.name === 'llama3.1:70b')!;

      const result = evaluateModel(llama70b, system);
      expect(result.tier).toBe('incompatible');
      expect(result.fitsInRam).toBe(false);
      expect(result.reason).toContain('Requires at least 48GB RAM');
    });

    it('should classify models as incompatible when disk space is insufficient', () => {
      const system = createMockSystem({ totalMemoryGB: 64, diskFreeGB: 3 });
      const mistral7b = POPULAR_MODELS.find((m) => m.name === 'mistral:7b')!;

      const result = evaluateModel(mistral7b, system);
      expect(result.tier).toBe('incompatible');
      expect(result.fitsInDisk).toBe(false);
      expect(result.reason).toContain('Insufficient disk space');
    });

    it('should classify models as tight when between min and recommended RAM', () => {
      const system = createMockSystem({ totalMemoryGB: 8, vramGB: null, diskFreeGB: 50 });
      const qwen7b = POPULAR_MODELS.find((m) => m.name === 'qwen2.5:7b')!; // minRam: 8, recRam: 12

      const result = evaluateModel(qwen7b, system);
      expect(result.tier).toBe('tight');
      expect(result.fitsInRam).toBe(true);
      expect(result.reason).toContain('prevent swapping');
    });
  });

  describe('getModelRecommendations', () => {
    it('should recommend a compact model for machines with < 8GB RAM', () => {
      const system = createMockSystem({ totalMemoryGB: 4, diskFreeGB: 30 });
      const report = getModelRecommendations(system);

      expect(report.recommendedDefault?.name).toBe('llama3.2:1b');
      expect(report.compatibleModels.length).toBeGreaterThan(0);
      expect(report.incompatibleModels.some((m) => m.model.name === 'llama3.1:70b')).toBe(true);
    });

    it('should recommend 3B model for machines with 8GB-16GB RAM', () => {
      const system = createMockSystem({ totalMemoryGB: 16, diskFreeGB: 60 });
      const report = getModelRecommendations(system);

      expect(report.recommendedDefault?.name).toBe('llama3.1:8b');
      expect(report.compatibleModels.some((m) => m.model.name === 'llama3.2:3b')).toBe(true);
    });

    it('should recommend larger models for workstations with 32GB+ RAM', () => {
      const system = createMockSystem({ totalMemoryGB: 64, diskFreeGB: 200 });
      const report = getModelRecommendations(system);

      expect(report.recommendedDefault?.parameterSize).toMatch(/(14B|8B)/);
      expect(report.compatibleModels.some((m) => m.model.name === 'deepseek-r1:14b')).toBe(true);
    });
  });

  describe('getDefaultModel', () => {
    it('should pick the same default as the full recommendation report', () => {
      for (const totalMemoryGB of [4, 8, 16, 32, 64]) {
        const report = getModelRecommendations(createMockSystem({ totalMemoryGB }));
        expect(getDefaultModel(totalMemoryGB).name).toBe(report.recommendedDefault?.name);
      }
    });

    it('should suggest a small model on a 8GB Mac', () => {
      expect(getDefaultModel(8).name).toBe('llama3.2:3b');
    });
  });

  describe('validateModelFit', () => {
    it('should issue warnings when installing a model that exceeds system capacity', () => {
      const system = createMockSystem({ totalMemoryGB: 8, diskFreeGB: 50 });
      const fit = validateModelFit('llama3.1:70b', system);

      expect(fit.canRun).toBe(false);
      expect(fit.tier).toBe('incompatible');
      expect(fit.warning).toContain('Requires at least 48GB RAM');
    });

    it('should validate successfully for fitting models', () => {
      const system = createMockSystem({ totalMemoryGB: 16, diskFreeGB: 50 });
      const fit = validateModelFit('llama3.2:3b', system);

      expect(fit.canRun).toBe(true);
      expect(fit.tier).toBe('compatible');
      expect(fit.warning).toBeUndefined();
    });

    it('should handle fuzzy model names (e.g. base name matching)', () => {
      const system = createMockSystem({ totalMemoryGB: 16, diskFreeGB: 50 });
      const fit = validateModelFit('llama3.2:latest', system);

      expect(fit.spec).toBeDefined();
      expect(fit.spec?.name).toContain('llama3.2');
    });

    it('should not size a larger tag like a smaller sibling of the same family', () => {
      const system = createMockSystem({ totalMemoryGB: 8, vramGB: null, diskFreeGB: 50 });

      // qwen2.5:14b used to match qwen2.5:1.5b by prefix and pass as compatible
      const fit = validateModelFit('qwen2.5:14b', system);
      expect(fit.canRun).toBe(false);
      expect(fit.tier).toBe('incompatible');
      expect(fit.spec?.parameterSize).toBe('14B');

      expect(validateModelFit('qwen2.5-coder:32b', system).canRun).toBe(false);
      expect(validateModelFit('deepseek-r1:32b', system).canRun).toBe(false);
    });

    it('should still use the known spec for listed models', () => {
      const system = createMockSystem({ totalMemoryGB: 16, diskFreeGB: 50 });
      expect(validateModelFit('qwen2.5:1.5b', system).spec?.diskSizeGB).toBe(1.0);
    });
  });

  describe('estimateModelSpec', () => {
    it('should estimate 4-bit requirements from the parameter count in the tag', () => {
      const spec = estimateModelSpec('qwen2.5:14b')!;
      expect(spec.parameterSize).toBe('14B');
      expect(spec.diskSizeGB).toBe(8.4);
      expect(spec.minRamGB).toBe(12);
      expect(spec.recommendedRamGB).toBe(15);
    });

    it('should account for higher-precision quantization tags', () => {
      expect(estimateModelSpec('llama3.1:8b-instruct-q8_0')!.diskSizeGB).toBe(8.6);
      expect(estimateModelSpec('llama3.1:8b-instruct-fp16')!.diskSizeGB).toBe(16);
      expect(estimateModelSpec('qwen2.5:1.5b')!.parameterSize).toBe('1.5B');
    });

    it('should return undefined when the tag names no size', () => {
      expect(estimateModelSpec('llama3.2:latest')).toBeUndefined();
      expect(estimateModelSpec('smollm:135m')).toBeUndefined();
      expect(estimateModelSpec('mixtral:8x7b')).toBeUndefined();
      expect(estimateModelSpec('llama3.2')).toBeUndefined();
    });
  });

  describe('Language recommendations', () => {
    it('should only list models that handle the requested language', () => {
      const report = getModelRecommendations(createMockSystem(), { language: 'id' });
      const all = [...report.compatibleModels, ...report.tightModels, ...report.incompatibleModels];

      expect(all.length).toBeGreaterThan(0);
      expect(all.every((r) => r.model.languages?.includes('id'))).toBe(true);
      expect(all.map((r) => r.model.name)).toContain('bge-m3');
    });

    it('should pick an Indonesian-capable default for each machine size', () => {
      const pick = (ram: number) =>
        getModelRecommendations(createMockSystem({ totalMemoryGB: ram }), { language: 'id' })
          .recommendedDefault?.name;

      expect(pick(4)).toBe('qwen2.5:1.5b');
      expect(pick(8)).toBe('gemma3:4b');
      expect(pick(16)).toBe('gemma3:12b');
      expect(pick(64)).toBe('gemma3:12b');
    });

    it('should keep the default list unchanged without a language', () => {
      const report = getModelRecommendations(createMockSystem({ totalMemoryGB: 8 }));
      expect(report.recommendedDefault?.name).toBe('llama3.2:3b');
    });
  });

  describe('Default model on a machine low on disk', () => {
    const isCompatible = (report: ReturnType<typeof getModelRecommendations>) =>
      report.compatibleModels.some((r) => r.model.name === report.recommendedDefault?.name);

    // A 16GB M1 Mac with 5.2GB free used to get gemma3:12b while the same report listed it as incompatible
    it('should not recommend a model it lists as incompatible', () => {
      const report = getModelRecommendations(createMockSystem({ diskFreeGB: 5.2 }), { language: 'id' });

      expect(report.incompatibleModels.map((r) => r.model.name)).toContain('gemma3:12b');
      expect(report.recommendedDefault?.name).toBe('qwen2.5:3b');
      expect(isCompatible(report)).toBe(true);
    });

    it('should fall back to a smaller model without a language too', () => {
      const report = getModelRecommendations(createMockSystem({ diskFreeGB: 5.3 }));

      expect(report.recommendedDefault?.name).toBe('gemma3:4b');
      expect(isCompatible(report)).toBe(true);
    });

    it('should keep the usual default when it fits', () => {
      const report = getModelRecommendations(createMockSystem({ diskFreeGB: 10.1 }), { language: 'id' });
      expect(report.recommendedDefault?.name).toBe('gemma3:12b');
    });

    it('should never pick an embedding model as the default', () => {
      // bge-m3 still fits here, but it cannot chat
      const report = getModelRecommendations(createMockSystem({ diskFreeGB: 3.3 }), { language: 'id' });

      expect(report.compatibleModels.map((r) => r.model.name)).toContain('bge-m3');
      expect(report.recommendedDefault?.name).toBe('qwen2.5:1.5b');
    });

    it('should recommend nothing when no chat model fits', () => {
      const report = getModelRecommendations(createMockSystem({ diskFreeGB: 2 }), { language: 'id' });

      expect(report.compatibleModels).toHaveLength(0);
      expect(report.recommendedDefault).toBeNull();
    });

    it('should only ever pick a compatible model', () => {
      for (const totalMemoryGB of [2, 4, 8, 12, 16, 24, 32, 64]) {
        for (const diskFreeGB of [1, 3, 4, 5.2, 6, 8.4, 10, 12, 50, 200]) {
          for (const language of [undefined, 'id']) {
            const report = getModelRecommendations(createMockSystem({ totalMemoryGB, diskFreeGB }), { language });
            if (report.recommendedDefault) {
              expect(isCompatible(report)).toBe(true);
            }
          }
        }
      }
    });

    it('should not pick a bigger model than the default for this much RAM', () => {
      const system = createMockSystem({ totalMemoryGB: 8, diskFreeGB: 4 });
      const pick = pickDefaultModel(system)!;

      expect(pick.recommendedRamGB).toBeLessThanOrEqual(getDefaultModel(8).recommendedRamGB);
      expect(evaluateModel(pick, system).tier).toBe('compatible');
    });
  });
});
