import { networkInterfaces } from 'node:os';

type InterfaceMap = ReturnType<typeof networkInterfaces>;

// Virtual interfaces that other devices on the network cannot reach
const VIRTUAL_INTERFACE =
  /^(docker|br-|veth|virbr|vmnet|vboxnet|cni|flannel|tailscale|utun|zt|lo)/i;

/**
 * True for IPv4 addresses in the private ranges used by home, school and office networks.
 */
export function isPrivateIPv4(address: string): boolean {
  const parts = address.split('.').map(Number);
  if (parts.length !== 4 || parts.some((p) => !Number.isInteger(p) || p < 0 || p > 255)) {
    return false;
  }

  const [a, b] = parts;
  return a === 10 || (a === 192 && b === 168) || (a === 172 && b >= 16 && b <= 31);
}

function rank(address: string): number {
  if (address.startsWith('192.168.')) return 0;
  if (address.startsWith('10.')) return 1;
  return 2;
}

/**
 * IPv4 addresses that other devices on the local network can use to reach this machine,
 * most likely Wi-Fi or Ethernet address first.
 */
export function getLanAddresses(interfaces: InterfaceMap = networkInterfaces()): string[] {
  const addresses = new Set<string>();

  for (const [name, entries] of Object.entries(interfaces)) {
    if (!entries || VIRTUAL_INTERFACE.test(name)) continue;

    for (const entry of entries) {
      if (entry.family === 'IPv4' && !entry.internal && isPrivateIPv4(entry.address)) {
        addresses.add(entry.address);
      }
    }
  }

  return [...addresses].sort((x, y) => rank(x) - rank(y));
}
