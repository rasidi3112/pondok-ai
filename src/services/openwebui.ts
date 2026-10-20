/**
 * What Open WebUI reports about its accounts, read from its public /api/config endpoint.
 */
export type OpenWebUIAccountState =
  | { state: 'ready'; signupEnabled: boolean | null }
  | { state: 'no-admin' }
  | { state: 'unreachable'; error: string }
  | { state: 'unknown' };

/**
 * Check whether Open WebUI already has its admin account.
 *
 * Open WebUI makes the first account that signs up the admin, so it must not be
 * reachable from the network before that account exists. While no account exists,
 * /api/config returns `onboarding: true` to anonymous callers.
 */
export async function getOpenWebUIAccountState(
  baseUrl: string,
  fetchImpl: typeof fetch = fetch,
  timeoutMs: number = 5000,
): Promise<OpenWebUIAccountState> {
  let body: unknown;

  try {
    const response = await fetchImpl(`${baseUrl}/api/config`, {
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!response.ok) {
      return { state: 'unknown' };
    }
    body = await response.json();
  } catch (error) {
    if (error instanceof SyntaxError) {
      return { state: 'unknown' };
    }
    return { state: 'unreachable', error: error instanceof Error ? error.message : String(error) };
  }

  if (typeof body !== 'object' || body === null || !('status' in body)) {
    return { state: 'unknown' };
  }

  const config = body as { onboarding?: unknown; features?: { enable_signup?: unknown } };
  if (config.onboarding === true) {
    return { state: 'no-admin' };
  }

  const signup = config.features?.enable_signup;
  return { state: 'ready', signupEnabled: typeof signup === 'boolean' ? signup : null };
}
