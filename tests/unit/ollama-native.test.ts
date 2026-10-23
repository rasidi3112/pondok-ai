import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createServer, Server } from 'node:http';
import { load as yamlLoad } from 'js-yaml';
import { getDefaultConfig } from '../../src/config/defaults.js';
import { generateComposeFile } from '../../src/docker/compose.js';
import {
  ensureNativeOllamaRunning,
  getOllamaHostUrl,
  getOllamaUrlForContainers,
  isNativeOllama,
  listOllamaModels,
  NativeOllamaLauncher,
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

/**
 * Fake host where Ollama comes up only after `startsWith` launches it.
 */
function fakeLauncher(options: {
  running?: boolean;
  hasApp?: boolean;
  hasBinary?: boolean;
  startsWith?: 'app' | 'serve';
}) {
  let running = options.running ?? false;
  const calls: string[] = [];
  const launcher: NativeOllamaLauncher = {
    isReachable: async () => running,
    openApp: async () => {
      calls.push('app');
      if (!options.hasApp) return false;
      if (options.startsWith === 'app') running = true;
      return true;
    },
    serve: async () => {
      calls.push('serve');
      if (!options.hasBinary) return false;
      if (options.startsWith === 'serve') running = true;
      return true;
    },
  };
  return { launcher, calls };
}

const FAST = { waitMs: 50, intervalMs: 10 };

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

  describe('getOllamaHostUrl', () => {
    it('should use the host loopback for native Ollama', () => {
      const config = nativeConfig();
      config.network.bindAddress = '0.0.0.0';
      config.services.ollama.port = 11500;
      expect(getOllamaHostUrl(config)).toBe('http://127.0.0.1:11500');
    });

    it('should use the bind address for Docker Ollama', () => {
      const config = getDefaultConfig('standard');
      config.network.bindAddress = '192.168.1.20';
      expect(getOllamaHostUrl(config)).toBe('http://192.168.1.20:11434');
    });
  });

  describe('ensureNativeOllamaRunning', () => {
    it('should leave a running Ollama alone', async () => {
      const { launcher, calls } = fakeLauncher({ running: true, hasApp: true });
      expect(await ensureNativeOllamaRunning(launcher, FAST)).toBe('already-running');
      expect(calls).toEqual([]);
    });

    it('should open the Ollama app when it is installed', async () => {
      const { launcher, calls } = fakeLauncher({ hasApp: true, hasBinary: true, startsWith: 'app' });
      expect(await ensureNativeOllamaRunning(launcher, FAST)).toBe('app');
      expect(calls).toEqual(['app']);
    });

    it('should fall back to "ollama serve" for a Homebrew install without the app', async () => {
      const { launcher, calls } = fakeLauncher({ hasBinary: true, startsWith: 'serve' });
      expect(await ensureNativeOllamaRunning(launcher, FAST)).toBe('serve');
      expect(calls).toEqual(['app', 'serve']);
    });

    it('should try "ollama serve" when the app opens but Ollama never answers', async () => {
      const { launcher, calls } = fakeLauncher({ hasApp: true, hasBinary: true, startsWith: 'serve' });
      expect(await ensureNativeOllamaRunning(launcher, FAST)).toBe('serve');
      expect(calls).toEqual(['app', 'serve']);
    });

    it('should report failure when Ollama is not installed', async () => {
      const { launcher } = fakeLauncher({});
      expect(await ensureNativeOllamaRunning(launcher, FAST)).toBe('failed');
    });
  });

  describe('listOllamaModels', () => {
    let server: Server;
    let baseUrl: string;
    let tags: unknown = { models: [] };

    beforeAll(async () => {
      server = createServer((req, res) => {
        if (req.url === '/api/tags' && tags !== null) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(tags));
        } else {
          res.writeHead(500);
          res.end();
        }
      });
      await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
      const addr = server.address();
      baseUrl = `http://127.0.0.1:${typeof addr === 'object' && addr ? addr.port : 0}`;
    });

    afterAll(async () => {
      await new Promise<void>((resolve) => server.close(() => resolve()));
    });

    it('should return an empty list when no model is installed', async () => {
      tags = { models: [] };
      expect(await listOllamaModels(baseUrl)).toEqual([]);
    });

    it('should return the installed model names', async () => {
      tags = { models: [{ name: 'llama3.2:3b' }, { name: 'gemma3:4b' }] };
      expect(await listOllamaModels(baseUrl)).toEqual(['llama3.2:3b', 'gemma3:4b']);
    });

    it('should return null when Ollama answers with an error', async () => {
      tags = null;
      expect(await listOllamaModels(baseUrl)).toBeNull();
    });

    it('should return null when Ollama is not reachable', async () => {
      expect(await listOllamaModels('http://127.0.0.1:1', 500)).toBeNull();
    });
  });
});
