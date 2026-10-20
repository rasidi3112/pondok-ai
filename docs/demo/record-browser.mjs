// Browser half of the README demo: open Open WebUI, ask one question, let the reply stream in.
// Usage (stack running, admin account and model already set up, see RECORDING.md):
//   node docs/demo/record-browser.mjs
// Env: WEBUI_URL, WEBUI_EMAIL, WEBUI_PASSWORD, DEMO_MODEL, DEMO_PROMPT, CHROMIUM_PATH
import { chromium } from 'playwright';
import { mkdtempSync, readdirSync, renameSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const url = process.env.WEBUI_URL ?? 'http://127.0.0.1:3000';
const email = process.env.WEBUI_EMAIL ?? 'demo@example.com';
const password = process.env.WEBUI_PASSWORD ?? 'pondok-demo-pass';
const model = process.env.DEMO_MODEL ?? 'llama3.2:3b';
const prompt =
  process.env.DEMO_PROMPT ?? 'Explain in two sentences why running AI locally is good for privacy.';
const out = process.env.OUT ?? 'docs/demo/browser.webm';
const size = { width: 1280, height: 720 };

// Sign in before recording so the clip starts on a ready chat screen.
const signin = await fetch(`${url}/api/v1/auths/signin`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});
if (!signin.ok) throw new Error(`Sign-in failed: ${signin.status} ${await signin.text()}`);
const { token } = await signin.json();

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH });

// Dismiss the one-time "What's New" dialog off camera.
const prep = await browser.newContext({ viewport: size, colorScheme: 'dark' });
await prep.addInitScript((t) => localStorage.setItem('token', t), token);
const prepPage = await prep.newPage();
await prepPage.goto(url);
await prepPage
  .getByRole('button', { name: "Okay, Let's Go!" })
  .click({ timeout: 10_000 })
  .catch(() => {});
await prepPage.waitForTimeout(1000);
await prep.close();

const videoDir = mkdtempSync(join(tmpdir(), 'pondok-demo-'));
const context = await browser.newContext({
  viewport: size,
  colorScheme: 'dark',
  recordVideo: { dir: videoDir, size },
});
await context.addInitScript(
  ([t, m]) => {
    localStorage.setItem('token', t);
    localStorage.setItem('theme', 'dark');
    localStorage.setItem('selectedModels', JSON.stringify([m]));
  },
  [token, model],
);

const page = await context.newPage();
await page.goto(`${url}/?models=${encodeURIComponent(model)}`);
const input = page.locator('#chat-input');
await input.waitFor({ state: 'visible', timeout: 60_000 });
await page.waitForTimeout(1500);

await input.click();
await page.keyboard.type(prompt, { delay: 35 });
await page.waitForTimeout(500);
await page.keyboard.press('Enter');

// The stop button shows while the reply streams; wait for it to go away.
await page.waitForTimeout(1500);
await page
  .locator('button[aria-label="Stop"], #stop-response-button')
  .first()
  .waitFor({ state: 'detached', timeout: 120_000 })
  .catch(() => {});
await page.waitForTimeout(2000);

await context.close();
await browser.close();

const [video] = readdirSync(videoDir);
renameSync(join(videoDir, video), out);
rmSync(videoDir, { recursive: true, force: true });
console.log(`Wrote ${out}`);
