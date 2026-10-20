import { describe, it, expect } from 'vitest';
import { load as yamlLoad } from 'js-yaml';
import { getDefaultConfig } from '../../src/config/defaults.js';
import { generateComposeFile } from '../../src/docker/compose.js';
import {
  getOllamaUrlForContainers,
  isNativeOllama,
  supportsNativeOllama,
} from '../../src/system/ollama-native.js';

type ParsedCompose = {
  services: Record<
    string,
    {
      environment?: Record<string, string>;
      depends_on?: Record<string, unknown>;
      extra_hosts?: string[];
    }
  >;
  volumes: Record<string, unknown>;
};

function nativeConfig(preset: 'minimal' | 'standard' | 'full' = 'standard') {
  const config = getDefaultConfig(preset);
  config.services.ollama.runtime = 'native';
  return config;
}

describe('Native Ollama', () => {
  describe('supportsNativeOllama', () => {
    it('should only be supported on macOS', () => {
      expect(supportsNativeOllama('darwin')).toBe(true);
      expect(supportsNativeOllama('linux')).toBe(false);
      expect(supportsNativeOllama('win32')).toBe(false);
    });
  });

  describe('isNativeOllama', () => {
    it('should default to the Docker runtime', () => {
      const config = getDefaultConfig('standard');
      expect(config.services.ollama.runtime).toBe('docker');
      expect(isNativeOllama(config)).toBe(false);
    });

    it('should treat configs without a runtime field as Docker', () => {
      const config = getDefaultConfig('standard');
      delete config.services.ollama.runtime;
      expect(isNativeOllama(config)).toBe(false);
    });

    it('should be false when Ollama is disabled', () => {
      const config = nativeConfig();
      config.services.ollama.enabled = false;
      expect(isNativeOllama(config)).toBe(false);
    });
  });

  describe('getOllamaUrlForContainers', () => {
    it('should use the compose service name for Docker Ollama', () => {
      expect(getOllamaUrlForContainers(getDefaultConfig('standard'))).toBe('http://ollama:11434');
    });

    it('should use host.docker.internal and the configured port for native Ollama', () => {
      const config = nativeConfig();
      config.services.ollama.port = 11500;
      expect(getOllamaUrlForContainers(config)).toBe('http://host.docker.internal:11500');
    });
  });

  describe('Compose generation', () => {
    it('should not create an Ollama container or volume', () => {
      const parsed = yamlLoad(generateComposeFile(nativeConfig())) as ParsedCompose;
      expect(parsed.services.ollama).toBeUndefined();
      expect(parsed.volumes['ollama-data']).toBeUndefined();
    });

    it('should point Open WebUI and the API Gateway at the host', () => {
      const parsed = yamlLoad(generateComposeFile(nativeConfig())) as ParsedCompose;
      for (const name of ['openwebui', 'api']) {
        const svc = parsed.services[name];
        expect(svc.environment?.OLLAMA_BASE_URL).toBe('http://host.docker.internal:11434');
        expect(svc.extra_hosts).toEqual(['host.docker.internal:host-gateway']);
        expect(svc.depends_on?.ollama).toBeUndefined();
      }
    });

    it('should keep the API Gateway dependencies on other services', () => {
      const parsed = yamlLoad(generateComposeFile(nativeConfig())) as ParsedCompose;
      expect(parsed.services.api.depends_on).toHaveProperty('postgres');
      expect(parsed.services.api.depends_on).toHaveProperty('qdrant');
    });

    it('should leave the Docker runtime output unchanged', () => {
      const parsed = yamlLoad(generateComposeFile(getDefaultConfig('standard'))) as ParsedCompose;
      expect(parsed.services.ollama).toBeDefined();
      expect(parsed.volumes['ollama-data']).toBeDefined();
      expect(parsed.services.openwebui.environment?.OLLAMA_BASE_URL).toBe('http://ollama:11434');
      expect(parsed.services.openwebui.extra_hosts).toBeUndefined();
      expect(parsed.services.api.depends_on).toHaveProperty('ollama');
    });
  });
});
