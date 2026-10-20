import { describe, it, expect, vi } from 'vitest';
import { load as yamlLoad } from 'js-yaml';
import { networkInterfaces } from 'node:os';
import { generateComposeFile } from '../../src/docker/compose.js';
import { getDefaultConfig } from '../../src/config/defaults.js';
import { getLanAddresses, isPrivateIPv4 } from '../../src/system/network.js';
import { getOpenWebUIAccountState } from '../../src/services/openwebui.js';

type InterfaceMap = ReturnType<typeof networkInterfaces>;

interface ParsedCompose {
  services: Record<string, { ports?: string[]; environment?: Record<string, string> }>;
}

function iface(address: string, internal = false): InterfaceMap[string] {
  return [
    {
      address,
      netmask: '255.255.255.0',
      family: 'IPv4',
      mac: '00:00:00:00:00:00',
      internal,
      cidr: `${address}/24`,
    },
  ];
}

function jsonResponse(body: unknown, ok = true): Response {
  return { ok, json: async () => body } as Response;
}

describe('LAN share', () => {
  describe('Compose file', () => {
    it('keeps Open WebUI on the bind address by default', () => {
      const config = getDefaultConfig('standard');
      const compose = yamlLoad(generateComposeFile(config)) as ParsedCompose;

      expect(compose.services.openwebui.ports).toEqual(['127.0.0.1:3000:8080']);
      expect(compose.services.openwebui.environment?.WEBUI_AUTH).toBeUndefined();
      expect(compose.services.openwebui.environment?.BYPASS_MODEL_ACCESS_CONTROL).toBeUndefined();
    });

    it('keeps the Open WebUI session key in the data volume', () => {
      const config = getDefaultConfig('minimal');
      const compose = yamlLoad(generateComposeFile(config)) as ParsedCompose;

      expect(compose.services.openwebui.environment?.WEBUI_SECRET_KEY_FILE).toBe(
        '/app/backend/data/.webui_secret_key',
      );
    });

    it('publishes only Open WebUI on all interfaces, with login forced on', () => {
      const config = getDefaultConfig('full');
      config.network.lanShare = true;
      const compose = yamlLoad(generateComposeFile(config)) as ParsedCompose;

      expect(compose.services.openwebui.ports).toEqual(['0.0.0.0:3000:8080']);
      expect(compose.services.openwebui.environment?.WEBUI_AUTH).toBe('True');
      expect(compose.services.openwebui.environment?.BYPASS_MODEL_ACCESS_CONTROL).toBe('True');
      expect(compose.services.ollama.ports).toEqual(['127.0.0.1:11434:11434']);
      expect(compose.services.qdrant.ports).toEqual(['127.0.0.1:6333:6333']);
      expect(compose.services.api.ports).toEqual(['127.0.0.1:8000:8000']);
      expect(compose.services.n8n.ports).toEqual(['127.0.0.1:5678:5678']);
    });
  });

  describe('LAN addresses', () => {
    it('recognises private IPv4 ranges', () => {
      expect(isPrivateIPv4('192.168.1.20')).toBe(true);
      expect(isPrivateIPv4('10.0.0.5')).toBe(true);
      expect(isPrivateIPv4('172.20.1.1')).toBe(true);
      expect(isPrivateIPv4('172.32.0.1')).toBe(false);
      expect(isPrivateIPv4('8.8.8.8')).toBe(false);
      expect(isPrivateIPv4('127.0.0.1')).toBe(false);
      expect(isPrivateIPv4('not-an-ip')).toBe(false);
    });

    it('skips loopback, virtual and public interfaces and lists Wi-Fi first', () => {
      const addresses = getLanAddresses({
        lo: iface('127.0.0.1', true),
        docker0: iface('172.17.0.1'),
        'br-1a2b3c': iface('172.18.0.1'),
        veth12ab: iface('172.19.0.1'),
        eth1: iface('10.10.0.7'),
        wlan0: iface('192.168.1.20'),
        eth2: iface('203.0.113.4'),
      });

      expect(addresses).toEqual(['192.168.1.20', '10.10.0.7']);
    });

    it('ignores IPv6 entries', () => {
      const addresses = getLanAddresses({
        en0: [
          {
            address: 'fe80::1',
            netmask: 'ffff:ffff:ffff:ffff::',
            family: 'IPv6',
            mac: '00:00:00:00:00:00',
            internal: false,
            cidr: 'fe80::1/64',
            scopeid: 1,
          },
        ],
      });

      expect(addresses).toEqual([]);
    });
  });

  describe('Open WebUI admin check', () => {
    it('reports no admin while Open WebUI is onboarding', async () => {
      const fetchImpl = vi.fn().mockResolvedValue(jsonResponse({ onboarding: true, status: true }));
      await expect(getOpenWebUIAccountState('http://127.0.0.1:3000', fetchImpl)).resolves.toEqual({
        state: 'no-admin',
      });
      expect(fetchImpl).toHaveBeenCalledWith('http://127.0.0.1:3000/api/config', expect.anything());
    });

    it('reports ready with the sign-up setting once an admin exists', async () => {
      const fetchImpl = vi
        .fn()
        .mockResolvedValue(jsonResponse({ status: true, features: { enable_signup: false } }));
      await expect(getOpenWebUIAccountState('http://127.0.0.1:3000', fetchImpl)).resolves.toEqual({
        state: 'ready',
        signupEnabled: false,
      });
    });

    it('reports unreachable when the request fails', async () => {
      const fetchImpl = vi.fn().mockRejectedValue(new TypeError('fetch failed'));
      await expect(getOpenWebUIAccountState('http://127.0.0.1:3000', fetchImpl)).resolves.toEqual({
        state: 'unreachable',
        error: 'fetch failed',
      });
    });

    it('reports unknown for responses it does not recognise', async () => {
      const notJson = {
        ok: true,
        json: async () => {
          throw new SyntaxError('Unexpected token <');
        },
      } as unknown as Response;

      await expect(
        getOpenWebUIAccountState('http://x', vi.fn().mockResolvedValue(notJson)),
      ).resolves.toEqual({ state: 'unknown' });
      await expect(
        getOpenWebUIAccountState('http://x', vi.fn().mockResolvedValue(jsonResponse({}, false))),
      ).resolves.toEqual({ state: 'unknown' });
      await expect(
        getOpenWebUIAccountState(
          'http://x',
          vi.fn().mockResolvedValue(jsonResponse({ name: 'x' })),
        ),
      ).resolves.toEqual({ state: 'unknown' });
    });
  });
});
