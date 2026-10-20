import { StackConfig } from '../config/schema.js';
import { DockerClient } from './client.js';
import { SERVICE_REGISTRY } from '../services/registry.js';

export interface ServiceHealthResult {
  name: string;
  displayName: string;
  healthy: boolean;
  status: 'healthy' | 'unhealthy' | 'starting' | 'skipped';
  elapsedSeconds: number;
  url?: string;
  message?: string;
}

/**
 * Check health of a single HTTP service with a short timeout.
 */
export async function checkHttpEndpoint(url: string, timeoutMs: number = 2000): Promise<{ ok: boolean; status?: number; error?: string }> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);

    return {
      ok: response.ok,
      status: response.status,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Poll enabled services until all are healthy or timeout expires.
 */
export async function waitForServicesHealthy(
  config: StackConfig,
  docker: DockerClient,
  timeoutSeconds: number = 45,
  onProgress?: (summary: string) => void,
): Promise<{ allHealthy: boolean; results: Map<string, ServiceHealthResult> }> {
  const startTime = Date.now();
  const results = new Map<string, ServiceHealthResult>();

  // Determine enabled services to check
  const servicesToCheck: Array<{
    key: string;
    displayName: string;
    url?: string;
    isInternal: boolean;
  }> = [];

  for (const [key, svc] of Object.entries(config.services)) {
    if (!svc.enabled) continue;

    const meta = SERVICE_REGISTRY[key];
    // A native Ollama listens on the host's own loopback, not the stack's bind address
    const nativeOllama = key === 'ollama' && config.services.ollama.runtime === 'native';
    const bindHost =
      nativeOllama || config.network.bindAddress === '0.0.0.0' ? '127.0.0.1' : config.network.bindAddress;

    let probeUrl: string | undefined;
    if (meta?.healthEndpoint && !meta.isInternal) {
      const port = svc.port ?? meta.defaultPort;
      const path = new URL(meta.healthEndpoint).pathname;
      probeUrl = `http://${bindHost}:${port}${path}`;
    }

    servicesToCheck.push({
      key,
      displayName: meta?.displayName ?? key,
      url: probeUrl,
      isInternal: meta?.isInternal ?? false,
    });
  }

  // Initialize status map
  for (const svc of servicesToCheck) {
    results.set(svc.key, {
      name: svc.key,
      displayName: svc.displayName,
      healthy: false,
      status: 'starting',
      elapsedSeconds: 0,
      url: svc.url,
    });
  }

  let allHealthy = false;

  while ((Date.now() - startTime) < (timeoutSeconds * 1000)) {
    let currentHealthyCount = 0;
    const elapsedSec = Math.round((Date.now() - startTime) / 1000);

    for (const svc of servicesToCheck) {
      const current = results.get(svc.key)!;
      if (current.healthy) {
        currentHealthyCount++;
        continue;
      }

      if (svc.url) {
        const check = await checkHttpEndpoint(svc.url, 2000);
        if (check.ok) {
          results.set(svc.key, {
            ...current,
            healthy: true,
            status: 'healthy',
            elapsedSeconds: elapsedSec,
            message: 'Ready',
          });
          currentHealthyCount++;
        }
      } else if (svc.isInternal) {
        // Internal service like Postgres: verify container is running / healthy via docker
        const containerStatuses = await docker.status();
        const container = containerStatuses.find(
          (c) => c.name.includes(svc.key) || c.name === `${config.projectName}-${svc.key}`,
        );

        if (container && container.state === 'running') {
          // If container has healthcheck, check if it's healthy or up
          const isHealthy = !container.status.includes('unhealthy') &&
            (!container.status.includes('health: starting') || elapsedSec > 8);

          if (isHealthy) {
            results.set(svc.key, {
              ...current,
              healthy: true,
              status: 'healthy',
              elapsedSeconds: elapsedSec,
              message: 'Container running',
            });
            currentHealthyCount++;
          }
        }
      }
    }

    if (onProgress) {
      onProgress(`Waiting for services to become healthy (${currentHealthyCount}/${servicesToCheck.length} ready, ${elapsedSec}s)...`);
    }

    if (currentHealthyCount === servicesToCheck.length) {
      allHealthy = true;
      break;
    }

    // Wait 1.5 seconds between probes
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  // Mark remaining unready services as unhealthy
  const totalElapsed = Math.round((Date.now() - startTime) / 1000);
  for (const [key, res] of results.entries()) {
    if (!res.healthy) {
      results.set(key, {
        ...res,
        status: 'unhealthy',
        elapsedSeconds: totalElapsed,
        message: 'Timeout waiting for service readiness',
      });
    }
  }

  return { allHealthy, results };
}
