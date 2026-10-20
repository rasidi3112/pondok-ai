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
