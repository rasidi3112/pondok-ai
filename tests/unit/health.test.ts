import { describe, it, expect, afterAll, beforeAll } from 'vitest';
import { createServer, Server } from 'node:http';
import {
  checkHttpEndpoint,
  DEFAULT_HEALTH_TIMEOUT_SECONDS,
  formatHealthProgress,
  waitForServicesHealthy,
} from '../../src/docker/health.js';
import { getDefaultConfig } from '../../src/config/defaults.js';
import { DockerClient } from '../../src/docker/client.js';

describe('Service Health Diagnostics', () => {
  let server: Server;
  let serverPort: number;

  beforeAll(async () => {
    server = createServer((req, res) => {
      if (req.url === '/' || req.url === '/health' || req.url === '/ready') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok' }));
      } else if (req.url === '/error') {
        res.writeHead(500);
        res.end('Internal Server Error');
      } else {
        res.writeHead(404);
        res.end('Not Found');
      }
    });

    await new Promise<void>((resolve) => {
      server.listen(0, '127.0.0.1', () => {
        const addr = server.address();
        if (typeof addr === 'object' && addr !== null) {
          serverPort = addr.port;
        }
        resolve();
      });
    });
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  describe('checkHttpEndpoint', () => {
    it('should return ok: true for healthy endpoints (200 status)', async () => {
      const result = await checkHttpEndpoint(`http://127.0.0.1:${serverPort}/health`, 1000);
      expect(result.ok).toBe(true);
      expect(result.status).toBe(200);
    });

    it('should return ok: false for error endpoints (500 status)', async () => {
      const result = await checkHttpEndpoint(`http://127.0.0.1:${serverPort}/error`, 1000);
      expect(result.ok).toBe(false);
      expect(result.status).toBe(500);
    });

    it('should return ok: false for unreachable ports', async () => {
      // Port 1 is reserved and usually refuses connections
      const result = await checkHttpEndpoint('http://127.0.0.1:1/health', 500);
      expect(result.ok).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('waitForServicesHealthy', () => {
    it('should poll endpoints and detect health correctly', async () => {
      const config = getDefaultConfig('minimal');
      // Point ollama port to our test mock server
      config.services.ollama.port = serverPort;
      // Disable openwebui for single-service test
      config.services.openwebui.enabled = false;

      const mockDocker = {
        status: async () => [],
      } as unknown as DockerClient;

      const progressUpdates: string[] = [];
      const report = await waitForServicesHealthy(
        config,
        mockDocker,
        5,
        (msg) => progressUpdates.push(msg),
      );

      expect(report.allHealthy).toBe(true);
      const ollamaHealth = report.results.get('ollama');
      expect(ollamaHealth).toBeDefined();
      expect(ollamaHealth?.healthy).toBe(true);
      expect(ollamaHealth?.status).toBe('healthy');
    });

    it('should timeout and mark unready services as unhealthy', async () => {
      const config = getDefaultConfig('minimal');
      // Point ollama port to a dead port
      config.services.ollama.port = 19999;
      config.services.openwebui.enabled = false;

      const mockDocker = {
        status: async () => [],
      } as unknown as DockerClient;

      const report = await waitForServicesHealthy(config, mockDocker, 1);
      expect(report.allHealthy).toBe(false);
      const ollamaHealth = report.results.get('ollama');
      expect(ollamaHealth?.healthy).toBe(false);
      expect(ollamaHealth?.status).toBe('unhealthy');
      expect(ollamaHealth?.message).toContain('Timeout');
    });
  });

  describe('formatHealthProgress', () => {
    const openwebui = { key: 'openwebui', displayName: 'Open WebUI' };
    const api = { key: 'api', displayName: 'API Gateway' };

    it('should name the services that are not ready yet', () => {
      expect(formatHealthProgress([openwebui, api], 4, 5)).toBe(
        'Waiting for Open WebUI, API Gateway (2/4 ready, 5s)...',
      );
    });

    it('should explain the slow first start of Open WebUI once it takes a while', () => {
      expect(formatHealthProgress([openwebui], 2, 5)).not.toContain('support models');
      expect(formatHealthProgress([openwebui], 2, 30)).toContain('support models');
      expect(formatHealthProgress([api], 2, 30)).not.toContain('support models');
    });
  });

  describe('Default timeout', () => {
    it('should give Open WebUI minutes, not seconds, for its first start', () => {
      expect(DEFAULT_HEALTH_TIMEOUT_SECONDS).toBeGreaterThanOrEqual(180);
    });
  });

  describe('Open WebUI probe', () => {
    it('should report the Open WebUI /health endpoint, not the web page', async () => {
      const config = getDefaultConfig('minimal');
      config.services.ollama.enabled = false;
      config.services.openwebui.port = 19998;

      const mockDocker = {
        status: async () => [],
      } as unknown as DockerClient;

      const report = await waitForServicesHealthy(config, mockDocker, 1);
      expect(report.allHealthy).toBe(false);
      expect(report.results.get('openwebui')?.url).toBe('http://127.0.0.1:19998/health');
    });
  });
});
