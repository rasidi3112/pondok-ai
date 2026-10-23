// Browser half of the README demo: open Open WebUI, ask one question, let the reply stream in.
// Usage (stack running, admin account and model already set up, see RECORDING.md):
//   node docs/demo/record-browser.mjs
// Env: WEBUI_URL, WEBUI_EMAIL, WEBUI_PASSWORD, DEMO_MODEL, DEMO_PROMPT, CHROMIUM_PATH, OUT, SCREENSHOT
//
// Playwright's built-in video recorder captures at CSS pixels, which looks soft once scaled.
// This script instead takes device-pixel screenshots in a loop (1280x720 at 1.5x = 1920x1080)
// and assembles them into an H.264 clip with ffmpeg, so text stays sharp.
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const url = process.env.WEBUI_URL ?? 'http://127.0.0.1:3000';
const email = process.env.WEBUI_EMAIL ?? 'demo@example.com';
const password = process.env.WEBUI_PASSWORD ?? 'pondok-demo-pass';
const model = process.env.DEMO_MODEL ?? 'gemma3:1b';
const prompt =
  process.env.DEMO_PROMPT ?? 'Explain in two sentences why running AI locally is good for privacy.';
const out = process.env.OUT ?? 'docs/demo/browser.mp4';
const screenshot = process.env.SCREENSHOT ?? 'docs/demo/screenshots/chat.png';
const viewport = { width: 1280, height: 720 };
const deviceScaleFactor = 1.5;

// Sign in before recording so the clip starts on a ready chat screen.
const signin = await fetch(`${url}/api/v1/auths/signin`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});
if (!signin.ok) throw new Error(`Sign-in failed: ${signin.status} ${await signin.text()}`);
const { token } = await signin.json();

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH });
const contextOptions = { viewport, deviceScaleFactor, colorScheme: 'dark' };

// Dismiss the one-time "What's New" dialog off camera.
const prep = await browser.newContext(contextOptions);
await prep.addInitScript((t) => localStorage.setItem('token', t), token);
const prepPage = await prep.newPage();
await prepPage.goto(url);
await prepPage
  .getByRole('button', { name: "Okay, Let's Go!" })
  .click({ timeout: 10_000 })
  .catch(() => {});
await prepPage.waitForTimeout(1000);
await prep.close();

const context = await browser.newContext(contextOptions);
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
await page.waitForTimeout(500);

// Capture frames until stopped; each frame keeps its wall-clock time so playback speed is real.
const frameDir = mkdtempSync(join(tmpdir(), 'pondok-demo-'));
const frames = [];
let recording = true;
const recorder = (async () => {
  while (recording) {
    const file = join(frameDir, `${String(frames.length).padStart(5, '0')}.jpg`);
    await page.screenshot({ path: file, type: 'jpeg', quality: 92 });
    frames.push({ file, time: Date.now() });
  }
})();

await page.waitForTimeout(1000);
await input.click();
await page.keyboard.type(prompt, { delay: 35 });
await page.waitForTimeout(500);
await page.keyboard.press('Enter');

// The stop button shows while the reply streams; wait for it to go away.
await page.waitForTimeout(1500);
await page
  .locator('button[aria-label="Stop"], #stop-response-button')
  .first()
  .waitFor({ state: 'detached', timeout: 180_000 })
  .catch(() => {});
await page.waitForTimeout(2000);

recording = false;
await recorder;
if (screenshot) await page.screenshot({ path: screenshot });

await context.close();
await browser.close();

// Turn the timed frames into a constant 30 fps H.264 clip.
const list = frames
  .map((f, i) => {
    const next = frames[i + 1]?.time ?? f.time + 100;
    return `file '${f.file}'\nduration ${((next - f.time) / 1000).toFixed(3)}`;
  })
  .join('\n');
writeFileSync(join(frameDir, 'frames.txt'), `${list}\nfile '${frames.at(-1).file}'\n`);
execFileSync('ffmpeg', [
  '-loglevel',
  'error',
  '-y',
  '-f',
  'concat',
  '-safe',
  '0',
  '-i',
  join(frameDir, 'frames.txt'),
  '-vf',
  'fps=30,format=yuv420p',
  '-c:v',
  'libx264',
  '-preset',
  'slow',
  '-crf',
  '18',
  out,
]);
rmSync(frameDir, { recursive: true, force: true });
console.log(`Wrote ${out} (${frames.length} frames)${screenshot ? ` and ${screenshot}` : ''}`);
