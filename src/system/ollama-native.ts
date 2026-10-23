import { platform as osPlatform } from 'node:os';
import { StackConfig } from '../config/schema.js';
import { exec } from '../utils/exec.js';

/**
 * Hostname that containers use to reach services running on the host.
 */
export const DOCKER_HOST_GATEWAY = 'host.docker.internal';

/**
 * Native Ollama is only offered on macOS, where Docker cannot reach the Metal GPU.
 * Linux and Windows keep running Ollama inside Docker.
 */
export function supportsNativeOllama(p: NodeJS.Platform = osPlatform()): boolean {
  return p === 'darwin';
}

/**
 * True when the stack should use an Ollama installed on the host instead of a container.
 */
export function isNativeOllama(config: StackConfig): boolean {
  return config.services.ollama.enabled && config.services.ollama.runtime === 'native';
}

/**
 * URL that other containers in the stack use to reach Ollama.
 */
export function getOllamaUrlForContainers(config: StackConfig): string {
  if (isNativeOllama(config)) {
    return `http://${DOCKER_HOST_GATEWAY}:${config.services.ollama.port ?? 11434}`;
  }
  return 'http://ollama:11434';
}

/**
 * Detect whether the `ollama` binary is installed on the host.
 */
export async function detectNativeOllama(): Promise<{
  installed: boolean;
  version: string | null;
}> {
  try {
    const result = await exec('ollama', ['--version'], { timeout: 5000 });
    if (result.exitCode !== 0) return { installed: false, version: null };
    const match = /(\d+\.\d+\.\d+)/.exec(result.stdout || result.stderr);
    return { installed: true, version: match?.[1] ?? null };
  } catch {
    return { installed: false, version: null };
  }
}

/**
 * Base URL of Ollama as seen from the host, used for probes and the model list.
 */
export function getOllamaHostUrl(config: StackConfig): string {
  const port = config.services.ollama.port ?? 11434;
  // A native Ollama listens on the host's own loopback, not the stack's bind address
  const host =
    isNativeOllama(config) || config.network.bindAddress === '0.0.0.0'
      ? '127.0.0.1'
      : config.network.bindAddress;
  return `http://${host}:${port}`;
}

/**
 * Names of the models installed in Ollama, or null when Ollama cannot be asked.
 */
export async function listOllamaModels(
  baseUrl: string,
  timeoutMs: number = 3000,
): Promise<string[] | null> {
  try {
    const response = await fetch(`${baseUrl}/api/tags`, { signal: AbortSignal.timeout(timeoutMs) });
    if (!response.ok) return null;
    const body = (await response.json()) as { models?: Array<{ name?: string }> };
    return (body.models ?? []).map((m) => m.name ?? '').filter(Boolean);
  } catch {
    return null;
  }
}

export type NativeOllamaStart = 'already-running' | 'app' | 'serve' | 'failed';

/**
 * The host actions used to start a native Ollama, injectable for tests.
 */
export interface NativeOllamaLauncher {
  isReachable: () => Promise<boolean>;
  /** Open the Ollama desktop app. Resolves false when the app is not installed. */
  openApp: () => Promise<boolean>;
  /** Run `ollama serve` in the background. Resolves false when the binary is missing. */
  serve: () => Promise<boolean>;
}

/**
 * Make sure a native Ollama is reachable, starting the Ollama app or `ollama serve` when it is not.
 */
export async function ensureNativeOllamaRunning(
  launcher: NativeOllamaLauncher,
  options: { waitMs?: number; intervalMs?: number } = {},
): Promise<NativeOllamaStart> {
  const { waitMs = 30000, intervalMs = 500 } = options;

  if (await launcher.isReachable()) return 'already-running';

  const waitUntilReachable = async (): Promise<boolean> => {
    const deadline = Date.now() + waitMs;
    while (Date.now() < deadline) {
      if (await launcher.isReachable()) return true;
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }
    return launcher.isReachable();
  };

  // The app keeps Ollama running and updated, so prefer it over a bare `ollama serve`
  if ((await launcher.openApp()) && (await waitUntilReachable())) return 'app';
  if ((await launcher.serve()) && (await waitUntilReachable())) return 'serve';
  return 'failed';
}

/**
 * Launcher that starts Ollama on this Mac. `ollama serve` output goes to `logFile`.
 */
export function createNativeOllamaLauncher(baseUrl: string, logFile: string): NativeOllamaLauncher {
  return {
    isReachable: async () => {
      try {
        const response = await fetch(`${baseUrl}/`, { signal: AbortSignal.timeout(2000) });
        return response.ok;
      } catch {
        return false;
      }
    },
    openApp: async () => {
      if (osPlatform() !== 'darwin') return false;
      try {
        const result = await exec('open', ['-g', '-a', 'Ollama'], { timeout: 10000 });
        return result.exitCode === 0;
      } catch {
        return false;
      }
    },
    serve: async () => {
      const { spawn } = await import('node:child_process');
      const { openSync, closeSync } = await import('node:fs');
      let logFd: number | 'ignore' = 'ignore';
      try {
        logFd = openSync(logFile, 'a');
      } catch {
        // Logging is best effort; start Ollama anyway
      }
      const host = new URL(baseUrl).host;

      return new Promise<boolean>((resolve) => {
        const child = spawn('ollama', ['serve'], {
          detached: true,
          stdio: ['ignore', logFd, logFd],
          // Keep an OLLAMA_HOST the user set themselves
          env: { ...process.env, OLLAMA_HOST: process.env.OLLAMA_HOST ?? host },
        });
        child.once('error', () => resolve(false));
        child.once('spawn', () => {
          child.unref();
          resolve(true);
        });
        if (typeof logFd === 'number') closeSync(logFd);
      });
    },
  };
}
