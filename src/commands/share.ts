import { Command } from 'commander';
import ora from 'ora';
import { ConfigManager } from '../config/manager.js';
import { StackConfig } from '../config/schema.js';
import { DockerClient } from '../docker/client.js';
import { generateComposeFile } from '../docker/compose.js';
import { checkHttpEndpoint } from '../docker/health.js';
import { getOpenWebUIAccountState } from '../services/openwebui.js';
import { getLanAddresses } from '../system/network.js';
import { showError, showLanShare } from '../cli/ui.js';
import { writeFile } from '../utils/fs.js';
import { logger } from '../utils/logger.js';

interface ShareOptions {
  dir?: string;
  stop?: boolean;
  yes?: boolean;
}

export function createShareCommand(): Command {
  const cmd = new Command('share')
    .description('Share Open WebUI with other devices on your local network (Wi-Fi or LAN)')
    .option('--stop', 'Stop sharing and make Open WebUI reachable from this machine only')
    .option('-y, --yes', 'Continue when the Open WebUI admin account cannot be verified')
    .option('-d, --dir <directory>', 'Working directory', process.cwd())
    .action(async (options: ShareOptions) => {
      await runShare(options);
    });

  return cmd;
}

/**
 * Host this machine uses to reach its own Open WebUI.
 */
function localHost(config: StackConfig): string {
  return config.network.lanShare || config.network.bindAddress === '0.0.0.0'
    ? '127.0.0.1'
    : config.network.bindAddress;
}

async function runShare(options: ShareOptions): Promise<void> {
  const baseDir = options.dir ?? process.cwd();
  const configManager = new ConfigManager(baseDir);

  const config = configManager.loadConfig();
  if (!config) {
    showError('Stack not initialized.', 'Run "pondok-ai init" first.');
    process.exit(1);
  }

  if (!config.services.openwebui.enabled) {
    showError(
      'Open WebUI is not enabled in this stack.',
      'Enable it with "pondok-ai config edit".',
    );
    process.exit(1);
  }

  const port = config.services.openwebui.port ?? 3000;
  const docker = new DockerClient(
    configManager.getComposePath(),
    configManager.getEnvPath(),
    config.projectName,
  );

  if (options.stop) {
    if (!config.network.lanShare) {
      logger.info('Open WebUI is not being shared on the network.');
      return;
    }
    config.network.lanShare = false;
    await applyConfig(
      configManager,
      config,
      docker,
      'Moving Open WebUI back to this machine only...',
    );
    logger.success(
      `Sharing stopped. Open WebUI is now at http://${localHost(config)}:${port} only.`,
    );
    return;
  }

  const localUrl = `http://${localHost(config)}:${port}`;
  const account = await getOpenWebUIAccountState(localUrl);

  if (account.state === 'unreachable') {
    showError(
      `Open WebUI is not responding at ${localUrl}.`,
      `Start the stack with "pondok-ai up", open ${localUrl} on this machine and create the admin account, then run "pondok-ai share" again.`,
    );
    process.exit(1);
  }

  if (account.state === 'no-admin') {
    showError(
      'Open WebUI has no admin account yet.',
      `Open ${localUrl} on this machine and sign up first. The first account becomes the admin,\n  so it must exist before anyone else on the network can reach Open WebUI.`,
    );
    process.exit(1);
  }

  if (account.state === 'unknown' && !options.yes) {
    showError(
      'Could not verify that Open WebUI has an admin account.',
      `Open ${localUrl} and make sure you can log in as the admin, then run "pondok-ai share --yes".`,
    );
    process.exit(1);
  }

  if (!config.network.lanShare) {
    config.network.lanShare = true;
    await applyConfig(configManager, config, docker, 'Publishing Open WebUI on your network...');
  }

  const addresses = getLanAddresses();
  showLanShare(
    addresses.map((address) => `http://${address}:${port}`),
    account.state === 'ready' ? account.signupEnabled : null,
  );

  if (config.network.bindAddress === '0.0.0.0') {
    logger.warn(
      'The bind address is 0.0.0.0, so services without a login (Ollama, Qdrant) are also reachable from the network.',
    );
    logger.raw(
      '  Run "pondok-ai config edit" and choose 127.0.0.1 to keep them on this machine.\n',
    );
  }
}

/**
 * Save the config, regenerate the Compose file and recreate the changed containers.
 */
async function applyConfig(
  configManager: ConfigManager,
  config: StackConfig,
  docker: DockerClient,
  message: string,
): Promise<void> {
  configManager.saveConfig(config);
  writeFile(configManager.getComposePath(), generateComposeFile(config, configManager.loadEnv()));

  const spinner = ora(message).start();
  const exitCode = await docker.up();
  if (exitCode !== 0) {
    spinner.fail('Docker Compose failed');
    showError(
      'Could not recreate Open WebUI.',
      'Run "pondok-ai logs openwebui" to see what went wrong.',
    );
    process.exit(1);
  }

  const url = `http://${localHost(config)}:${config.services.openwebui.port ?? 3000}/`;
  const deadline = Date.now() + 90_000;
  while (Date.now() < deadline) {
    if ((await checkHttpEndpoint(url)).ok) {
      spinner.succeed('Open WebUI is ready');
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }
  spinner.warn('Open WebUI is taking longer than expected to start. Check "pondok-ai status".');
}
