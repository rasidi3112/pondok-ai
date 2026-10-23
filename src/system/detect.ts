import { platform, arch, totalmem, cpus, freemem } from 'node:os';
import { exec } from '../utils/exec.js';
import { logger } from '../utils/logger.js';

export type GpuType = 'metal' | 'cuda' | 'rocm' | 'none';

export interface SystemInfo {
  os: string;
  arch: string;
  platform: NodeJS.Platform;
  totalMemoryGB: number;
  freeMemoryGB: number;
  cpuCount: number;
  cpuModel: string;
  gpuAvailable: boolean;
  gpuType: GpuType;
  gpuName: string | null;
  gpuInfo: string | null;
  vramGB: number | null;
  vramFreeGB: number | null;
  dockerInstalled: boolean;
  dockerRunning: boolean;
  dockerVersion: string | null;
  dockerComposeVersion: string | null;
  diskFreeGB: number | null;
}

/**
 * Detect comprehensive system information for requirements checking
 * and configuration recommendations.
 */
export async function detectSystem(): Promise<SystemInfo> {
  const totalMemoryGB = roundTo(totalmem() / (1024 * 1024 * 1024), 1);
  const freeMemoryGB = roundTo(freemem() / (1024 * 1024 * 1024), 1);

  const info: SystemInfo = {
    os: getOSName(),
    arch: arch(),
    platform: platform(),
    totalMemoryGB,
    freeMemoryGB,
    cpuCount: cpus().length,
    cpuModel: cpus()[0]?.model?.trim() ?? 'Unknown',
    gpuAvailable: false,
    gpuType: 'none',
    gpuName: null,
    gpuInfo: null,
    vramGB: null,
    vramFreeGB: null,
    dockerInstalled: false,
    dockerRunning: false,
    dockerVersion: null,
    dockerComposeVersion: null,
    diskFreeGB: null,
  };

  // Detect Docker
  const dockerInfo = await detectDocker();
  info.dockerInstalled = dockerInfo.installed;
  info.dockerRunning = dockerInfo.running;
  info.dockerVersion = dockerInfo.version;
  info.dockerComposeVersion = dockerInfo.composeVersion;

  // Detect GPU with memory awareness
  const gpuInfo = await detectGPU(totalMemoryGB, freeMemoryGB);
  info.gpuAvailable = gpuInfo.available;
  info.gpuType = gpuInfo.type;
  info.gpuName = gpuInfo.name;
  info.gpuInfo = gpuInfo.info;
  info.vramGB = gpuInfo.vramGB;
  info.vramFreeGB = gpuInfo.vramFreeGB;

  // Detect disk space
  info.diskFreeGB = await detectDiskFree();

  return info;
}

function getOSName(): string {
  const p = platform();
  switch (p) {
    case 'darwin':
      return 'macOS';
    case 'linux':
      return 'Linux';
    case 'win32':
      return 'Windows';
    default:
      return p;
  }
}

async function detectDocker(): Promise<{
  installed: boolean;
  running: boolean;
  version: string | null;
  composeVersion: string | null;
}> {
  const result = {
    installed: false,
    running: false,
    version: null as string | null,
    composeVersion: null as string | null,
  };

  try {
    const versionResult = await exec('docker', ['--version']);
    if (versionResult.exitCode === 0) {
      result.installed = true;
      const match = versionResult.stdout.match(/Docker version ([^\s,]+)/);
      result.version = match ? match[1] : versionResult.stdout;
    }
  } catch {
    logger.debug('Docker not found in PATH');
    return result;
  }

  try {
    const infoResult = await exec('docker', ['info'], { timeout: 10000 });
    result.running = infoResult.exitCode === 0;
  } catch {
    logger.debug('Docker daemon not responding');
  }

  try {
    const composeResult = await exec('docker', ['compose', 'version']);
    if (composeResult.exitCode === 0) {
      const match = composeResult.stdout.match(/v?(\d+\.\d+\.\d+)/);
      result.composeVersion = match ? match[1] : composeResult.stdout;
    }
  } catch {
    logger.debug('Docker Compose not available');
  }

  return result;
}

async function detectGPU(
  totalMemoryGB: number,
  freeMemoryGB: number,
): Promise<{
  available: boolean;
  type: GpuType;
  name: string | null;
  info: string | null;
  vramGB: number | null;
  vramFreeGB: number | null;
}> {
  const p = platform();

  // 1. Try NVIDIA (Linux / Windows / WSL)
  try {
    const result = await exec('nvidia-smi', [
      '--query-gpu=name,memory.total,memory.free',
      '--format=csv,noheader,nounits',
    ], { timeout: 5000 });

    if (result.exitCode === 0 && result.stdout.trim()) {
      const firstLine = result.stdout.trim().split('\n')[0];
      const parts = firstLine.split(',').map((s) => s.trim());
      const name = parts[0] || 'NVIDIA GPU';
      const totalMB = parts[1] ? parseFloat(parts[1]) : 0;
      const freeMB = parts[2] ? parseFloat(parts[2]) : 0;
      const vramGB = totalMB > 0 ? roundTo(totalMB / 1024, 1) : null;
      const vramFreeGB = freeMB > 0 ? roundTo(freeMB / 1024, 1) : null;

      const vramDesc = vramGB !== null ? ` (${vramGB}GB VRAM)` : '';
      return {
        available: true,
        type: 'cuda',
        name,
        info: `${name}${vramDesc}`,
        vramGB,
        vramFreeGB,
      };
    }
  } catch {
    // nvidia-smi not found
  }

  // 2. macOS: Check for Apple Silicon (Metal)
  if (p === 'darwin' && arch() === 'arm64') {
    // Unified memory allows up to ~75% allocation to GPU
    const unifiedVramGB = roundTo(totalMemoryGB * 0.75, 1);
    const unifiedFreeGB = roundTo(freeMemoryGB * 0.75, 1);
    return {
      available: true,
      type: 'metal',
      name: 'Apple Silicon (Metal)',
      info: `Apple Silicon (Metal, ~${unifiedVramGB}GB unified VRAM)`,
      vramGB: unifiedVramGB,
      vramFreeGB: unifiedFreeGB,
    };
  }

  // 3. Try ROCm (AMD)
  try {
    const result = await exec('rocm-smi', ['--showmeminfo', 'vram'], { timeout: 5000 });
    if (result.exitCode === 0 && result.stdout.trim()) {
      return {
        available: true,
        type: 'rocm',
        name: 'AMD ROCm GPU',
        info: 'AMD ROCm GPU detected',
        vramGB: null,
        vramFreeGB: null,
      };
    }
  } catch {
    // rocm-smi not found
  }

  return {
    available: false,
    type: 'none',
    name: null,
    info: null,
    vramGB: null,
    vramFreeGB: null,
  };
}

export async function detectDiskFree(): Promise<number | null> {
  const p = platform();

  try {
    if (p === 'win32') {
      const result = await exec('wmic', ['logicaldisk', 'where', 'DeviceID="C:"', 'get', 'FreeSpace', '/value']);
      if (result.exitCode === 0) {
        const match = result.stdout.match(/FreeSpace=(\d+)/);
        if (match) {
          return roundTo(parseInt(match[1]) / (1024 * 1024 * 1024), 1);
        }
      }
    } else {
      const result = await exec('df', ['-k', '.']);
      if (result.exitCode === 0) {
        const lines = result.stdout.split('\n');
        if (lines.length >= 2) {
          const parts = lines[1].split(/\s+/);
          const availableKB = parseInt(parts[3]);
          if (!isNaN(availableKB)) {
            return roundTo(availableKB / (1024 * 1024), 1);
          }
        }
      }
    }
  } catch {
    // Disk detection failed
  }

  return null;
}

function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
