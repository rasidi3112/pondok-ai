import { Command } from 'commander';
import ora from 'ora';
import { join } from 'node:path';
import { totalmem } from 'node:os';
import { ConfigManager } from '../config/manager.js';
import { StackConfig } from '../config/schema.js';
import { findInvalidRequiredSecrets } from '../config/secrets.js';
import { DockerClient } from '../docker/client.js';
import { DEFAULT_HEALTH_TIMEOUT_SECONDS, ServiceHealthResult, waitForServicesHealthy } from '../docker/health.js';
import {
  createNativeOllamaLauncher,
  ensureNativeOllamaRunning,
  getOllamaHostUrl,
  isNativeOllama,
  listOllamaModels,
} from '../system/ollama-native.js';
import { detectDiskFree } from '../system/detect.js';
import { pickDefaultModel } from '../system/recommendations.js';
import { showBanner, showServiceUrls, showError } from '../cli/ui.js';
import { logger } from '../utils/logger.js';

interface UpOptions {
  dir?: string;
  healthcheck?: boolean;
  timeout?: string;
}

export function createUpCommand(): Command {
  const cmd = new Command('up')
    .description('Start the pondok-ai stack')
    .option('-d, --dir <directory>', 'Working directory', process.cwd())
    .option('--no-healthcheck', 'Skip waiting for service health checks')
    .option('-t, --timeout <seconds>', 'Timeout in seconds for health checks', String(DEFAULT_HEALTH_TIMEOUT_SECONDS))
    .action(async (options: UpOptions) => {
      await runUp(options);
    });

  return cmd;
}

async function runUp(options: UpOptions): Promise<void> {
  showBanner();

  const baseDir = options.dir ?? process.cwd();
  const configManager = new ConfigManager(baseDir);

  const config = configManager.loadConfig();
  if (!config) {
    showError(
      'Stack not initialized.',
      'Run "pondok-ai init" first to create a configuration.',
    );
    process.exit(1);
  }

  const invalidSecrets = findInvalidRequiredSecrets(configManager.loadEnv());
  if (invalidSecrets.length > 0) {
    showError(
      `Invalid required secret value(s): ${invalidSecrets.join(', ')}`,
      'Run "pondok-ai init" to generate secure credentials before starting the stack.',
    );
    process.exit(1);
  }

  if (isNativeOllama(config)) {
    await startNativeOllama(config, join(configManager.getStackDir(), 'ollama.log'));
  }

  const docker = new DockerClient(
    configManager.getComposePath(),
    configManager.getEnvPath(),
    config.projectName,
  );

  const spinner = ora('Validating Docker Compose configuration...').start();

  try {
    // 1. Validate Docker Compose config before attempting startup
    const validation = await docker.validateCompose();
    if (!validation.valid) {
      spinner.fail('Docker Compose validation failed');
      showError(
        'Invalid Docker Compose configuration.',
        validation.error ?? 'Please check your configuration or re-run "pondok-ai init --force".',
      );
      process.exit(1);
    }

    // 2. Start services
    spinner.text = 'Starting services with Docker Compose...';
    const exitCode = await docker.up();
    if (exitCode !== 0) {
      spinner.fail('Failed to start services');
      showError(
        'Docker Compose failed.',
        'Run "pondok-ai logs" to see what went wrong.\n  Run "pondok-ai doctor" to check your environment.',
      );
      process.exit(1);
    }

    // 3. Service health check verification
    let pending: ServiceHealthResult[] = [];
    if (options.healthcheck !== false) {
      const parsedTimeout = parseInt(options.timeout ?? '', 10);
      const timeoutSec = parsedTimeout > 0 ? parsedTimeout : DEFAULT_HEALTH_TIMEOUT_SECONDS;
      spinner.text = 'Waiting for services to become healthy...';

      const healthResult = await waitForServicesHealthy(
        config,
        docker,
        timeoutSec,
        (msg) => {
          spinner.text = msg;
        },
      );

      pending = [...healthResult.results.values()].filter((r) => !r.healthy);
      if (healthResult.allHealthy) {
        spinner.succeed('All services started and healthy');
      } else {
        spinner.warn(`Services are running, but not ready after ${timeoutSec}s: ${pending.map((r) => r.displayName).join(', ')}`);
      }
      showServiceUrls(config, { ready: healthResult.allHealthy });
    } else {
      spinner.succeed('All services started (health check skipped)');
      showServiceUrls(config, { ready: false });
    }

    if (pending.length > 0) {
      showStillStartingHelp(pending);
    }

    await showModelHint(config);
  } catch (error) {
    spinner.fail('Failed to start services');
    showError(
      error instanceof Error ? error.message : 'Unknown error',
      'Make sure Docker is running and try again.',
    );
    process.exit(1);
  }
}

/**
 * Start a native Ollama that is not running yet, so the stack has a model server to talk to.
 */
async function startNativeOllama(config: StackConfig, logFile: string): Promise<void> {
  const port = config.services.ollama.port ?? 11434;
  const launcher = createNativeOllamaLauncher(getOllamaHostUrl(config), logFile);
  if (await launcher.isReachable()) return;

  const spinner = ora(`Native Ollama is not running on port ${port}, starting it...`).start();
  const started = await ensureNativeOllamaRunning(launcher);
  if (started === 'app') {
    spinner.succeed('Started the Ollama app');
  } else if (started === 'serve') {
    spinner.succeed(`Started Ollama in the background with "ollama serve" (log: ${logFile})`);
  } else if (started === 'already-running') {
    spinner.succeed('Native Ollama is running');
  } else {
    spinner.warn(`Native Ollama is not reachable on port ${port} and could not be started automatically.`);
    logger.raw('  Start it with "ollama serve" or open the Ollama app, then run "pondok-ai up" again.');
    logger.raw('  Not installed yet? Run "brew install ollama" or download it from https://ollama.com/download\n');
  }
}

/**
 * Tell the user how to follow services that are still starting, instead of claiming they are ready.
 */
function showStillStartingHelp(pending: Array<Pick<ServiceHealthResult, 'name' | 'displayName'>>): void {
  if (pending.some((r) => r.name === 'openwebui')) {
    logger.raw('  Open WebUI downloads its support models on first start, which can take a few minutes.');
  }
  logger.raw('  Check progress with:');
  logger.raw('    pondok-ai status');
  logger.raw(`    pondok-ai logs ${pending[0].name} --follow\n`);
}

/**
 * Point the user at a model to pull when Ollama has none, since Open WebUI cannot chat without one.
 */
async function showModelHint(config: StackConfig): Promise<void> {
  if (!config.services.ollama.enabled) return;

  const models = await listOllamaModels(getOllamaHostUrl(config));
  // null means Ollama could not be asked; the health output already covers that
  if (models === null || models.length > 0) return;

  const memoryGB = Math.round((totalmem() / (1024 * 1024 * 1024)) * 10) / 10;
  const model = pickDefaultModel({ totalMemoryGB: memoryGB, diskFreeGB: await detectDiskFree(), vramGB: null });
  logger.warn('Ollama has no models yet, so there is nothing to chat with.');
  if (model) {
    logger.raw(`  Install the recommended model for this machine (${memoryGB} GB RAM):`);
    logger.raw(`    pondok-ai model install ${model.name}`);
    logger.raw('  Or see other options with "pondok-ai model recommend".\n');
  } else {
    logger.raw('  No chat model fits this machine comfortably right now. Freeing disk space usually helps.');
    logger.raw('  See why with "pondok-ai model recommend".\n');
  }
}
