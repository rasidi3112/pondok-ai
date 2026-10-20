import chalk from 'chalk';
import boxen from 'boxen';
import { renderUnicodeCompact } from 'uqr';
import { RequirementCheck } from '../system/requirements.js';
import { ServiceStatus } from '../docker/client.js';
import { StackConfig } from '../config/schema.js';
import { SERVICE_REGISTRY } from '../services/registry.js';
import { getLanAddresses } from '../system/network.js';

/**
 * Display the application banner.
 */
export function showBanner(): void {
  const banner = boxen(
    `${chalk.bold.cyan('PONDOK AI')}\n${chalk.gray('Your private AI environment')}`,
    {
      padding: 1,
      margin: { top: 1, bottom: 1, left: 0, right: 0 },
      borderStyle: 'round',
      borderColor: 'cyan',
      textAlignment: 'center',
    },
  );
  console.log(banner);
}

/**
 * Display requirement check results.
 */
export function showRequirements(checks: RequirementCheck[]): void {
  for (const check of checks) {
    if (check.passed) {
      if (check.severity === 'warning') {
        console.log(chalk.yellow(`⚠ ${check.message}`));
      } else {
        console.log(chalk.green(`✓ ${check.message}`));
      }
    } else {
      console.log(chalk.red(`✗ ${check.message}`));
    }
  }
  console.log();
}

/**
 * Display service status table.
 */
export function showServiceStatus(statuses: ServiceStatus[]): void {
  if (statuses.length === 0) {
    console.log(chalk.yellow('No services are running.'));
    return;
  }

  console.log(chalk.bold('\nService Status:\n'));

  const nameWidth = 20;
  const stateWidth = 12;
  const statusWidth = 30;

  // Header
  console.log(
    chalk.gray(
      `${'SERVICE'.padEnd(nameWidth)} ${'STATE'.padEnd(stateWidth)} ${'STATUS'.padEnd(statusWidth)}`,
    ),
  );
  console.log(chalk.gray('─'.repeat(nameWidth + stateWidth + statusWidth + 2)));

  for (const svc of statuses) {
    const stateColor = svc.state === 'running' ? chalk.green : chalk.red;
    console.log(
      `${svc.name.padEnd(nameWidth)} ${stateColor(svc.state.padEnd(stateWidth))} ${svc.status.padEnd(statusWidth)}`,
    );
  }

  console.log();
}

/**
 * Display the URLs for all enabled services after startup.
 */
export function showServiceUrls(config: StackConfig): void {
  console.log(chalk.bold.green('\n🎉 Your pondok-ai stack is ready!\n'));

  const services = config.services;
  const bind = config.network.bindAddress === '0.0.0.0' ? 'localhost' : config.network.bindAddress;

  const urlEntries: Array<{ name: string; url: string }> = [];

  if (services.openwebui.enabled) {
    urlEntries.push({ name: 'Open WebUI', url: `http://${bind}:${services.openwebui.port}` });
  }
  if (services.api.enabled) {
    urlEntries.push({ name: 'API Gateway', url: `http://${bind}:${services.api.port}` });
  }
  if (services.ollama.enabled && services.ollama.runtime === 'native') {
    urlEntries.push({ name: 'Ollama (native)', url: `http://localhost:${services.ollama.port}` });
  } else if (services.ollama.enabled) {
    urlEntries.push({ name: 'Ollama', url: `http://${bind}:${services.ollama.port}` });
  }
  if (services.qdrant.enabled) {
    urlEntries.push({ name: 'Qdrant', url: `http://${bind}:${services.qdrant.port}` });
  }
  if (services.n8n.enabled) {
    urlEntries.push({ name: 'n8n', url: `http://${bind}:${services.n8n.port}` });
  }

  for (const entry of urlEntries) {
    console.log(`  ${chalk.bold(entry.name + ':')}  ${chalk.cyan(entry.url)}`);
  }

  if (services.openwebui.enabled && config.network.lanShare) {
    for (const address of getLanAddresses()) {
      console.log(`  ${chalk.bold('On your network:')}  ${chalk.cyan(`http://${address}:${services.openwebui.port}`)}`);
    }
    console.log(chalk.gray('  Run "pondok-ai share" to show a QR code.'));
  }

  console.log();

  if (services.api.enabled) {
    console.log(chalk.gray('  Use with OpenAI SDK:'));
    console.log(chalk.gray(`  OPENAI_BASE_URL=http://${bind}:${services.api.port}/v1\n`));
  }
}

/**
 * Display how other devices on the local network can reach Open WebUI.
 */
export function showLanShare(urls: string[], signupEnabled: boolean | null): void {
  console.log(chalk.bold.green('\nOpen WebUI is shared on your network.\n'));

  if (urls.length === 0) {
    console.log(chalk.yellow('  No Wi-Fi or LAN address found. Connect this machine to a network and run "pondok-ai share" again.\n'));
  } else {
    for (const url of urls) {
      console.log(`  ${chalk.bold('Open on any device:')}  ${chalk.cyan(url)}`);
    }
    console.log();
    console.log(renderUnicodeCompact(urls[0], { border: 2 }));
    console.log();
  }

  console.log(chalk.gray('  Each person signs up with their own account. New accounts wait as "pending"'));
  console.log(chalk.gray('  until the admin approves them in Admin Panel > Users.'));
  if (signupEnabled === false) {
    console.log(chalk.yellow('  Sign-ups are turned off. Turn them on in Admin Panel > Settings > General, or add users yourself.'));
  }
  console.log(chalk.gray('  Only Open WebUI is shared. The API gateway, Ollama and Qdrant keep their bind address.'));
  console.log(chalk.gray('  Traffic is plain HTTP, so share only on a network you trust, not public Wi-Fi.'));
  console.log(chalk.gray('  Stop sharing with: pondok-ai share --stop\n'));
}

/**
 * Display detailed stack configuration.
 */
export function showConfig(config: StackConfig): void {
  console.log(chalk.bold('\nStack Configuration:\n'));
  console.log(`  ${chalk.gray('Preset:')}     ${chalk.bold(config.preset)}`);
  console.log(`  ${chalk.gray('Project:')}    ${config.projectName}`);
  console.log(`  ${chalk.gray('Bind:')}       ${config.network.bindAddress}`);
  console.log(`  ${chalk.gray('LAN share:')}  ${config.network.lanShare ? 'on (Open WebUI)' : 'off'}`);
  console.log();
  console.log(chalk.bold('  Services:'));

  for (const [key, svc] of Object.entries(config.services)) {
    const meta = SERVICE_REGISTRY[key];
    const statusIcon = svc.enabled ? chalk.green('✓') : chalk.gray('○');
    const name = meta?.displayName ?? key;
    const port = svc.port ?? meta?.defaultPort ?? '—';
    const note = key === 'ollama' && config.services.ollama.runtime === 'native' ? ' (native on host)' : '';
    console.log(`    ${statusIcon} ${name.padEnd(14)} ${chalk.gray(`port: ${port}${note}`)}`);
  }

  console.log();
}

/**
 * Display a polished error with suggested fix.
 */
export function showError(message: string, suggestion?: string): void {
  console.error(chalk.red(`\n✗ ${message}`));
  if (suggestion) {
    console.error(chalk.gray(`\n  ${suggestion}\n`));
  }
}

/**
 * Display a success message.
 */
export function showSuccess(message: string): void {
  console.log(chalk.green(`\n✓ ${message}\n`));
}
