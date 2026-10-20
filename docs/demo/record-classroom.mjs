// Browser parts of the classroom demo (pondok-ai share): a student's phone and the teacher's admin page.
// Usage (stack shared with `pondok-ai share`, admin account created, see RECORDING.md):
//   node docs/demo/record-classroom.mjs signup    # phone: open the LAN link, sign up, land on "pending"
//   node docs/demo/record-classroom.mjs chat &    # phone: waits on the pending screen until approved, then chats
//   node docs/demo/record-classroom.mjs admin     # desktop: approve the student in Admin Panel > Users
// Env: SHARE_URL, ADMIN_URL, ADMIN_EMAIL, ADMIN_PASSWORD, STUDENT_NAME, STUDENT_EMAIL, STUDENT_PASSWORD,
//      DEMO_PROMPT, CHROMIUM_PATH, OUT_DIR
//
// Like record-browser.mjs, frames are device-pixel screenshots taken in a loop, so text stays sharp.
// Headless screenshots have no mouse pointer, so the admin clip draws one that follows the real mouse.
import { chromium, devices } from 'playwright';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const step = process.argv[2];
const shareUrl = process.env.SHARE_URL ?? 'http://192.168.1.20:3000';
const adminUrl = process.env.ADMIN_URL ?? 'http://127.0.0.1:3000';
const adminEmail = process.env.ADMIN_EMAIL ?? 'teacher@example.com';
const adminPassword = process.env.ADMIN_PASSWORD ?? 'pondok-demo-pass';
const studentName = process.env.STUDENT_NAME ?? 'Rani';
const studentEmail = process.env.STUDENT_EMAIL ?? 'rani@example.com';
const studentPassword = process.env.STUDENT_PASSWORD ?? 'rani-kelas-8';
const prompt =
  process.env.DEMO_PROMPT ?? 'Jelaskan fotosintesis dalam dua kalimat untuk siswa SMP.';
const outDir = process.env.OUT_DIR ?? 'docs/demo';
const studentState = join(outDir, '.classroom-student.json');
const approvedFlag = join(outDir, '.classroom-approved');
const phone = { ...devices['Pixel 7'], deviceScaleFactor: 2, colorScheme: 'dark' };

function startRecording(page) {
  const frameDir = mkdtempSync(join(tmpdir(), 'pondok-classroom-'));
  const frames = [];
  let recording = true;
  const recorder = (async () => {
    while (recording) {
      const file = join(frameDir, `${String(frames.length).padStart(5, '0')}.jpg`);
      await page.screenshot({ path: file, type: 'jpeg', quality: 92 });
      frames.push({ file, time: Date.now() });
    }
  })();
  return async (out) => {
    recording = false;
    await recorder;
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
      '16',
      out,
    ]);
    rmSync(frameDir, { recursive: true, force: true });
    console.log(`Wrote ${out} (${frames.length} frames)`);
  };
}

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH });

if (step === 'signup') {
  rmSync(approvedFlag, { force: true });
  const context = await browser.newContext(phone);
  const page = await context.newPage();
  await page.goto('about:blank');
  const stop = startRecording(page);
  await page.waitForTimeout(600);
  await page.goto(shareUrl);
  await page.locator('input[type="email"]').waitFor({ timeout: 30_000 });
  await page.waitForTimeout(1800);
  await page
    .getByRole('button', { name: /sign up/i })
    .first()
    .click();
  await page.waitForTimeout(1200);
  await page.locator('input[autocomplete="name"], input[name="name"]').first().click();
  await page.keyboard.type(studentName, { delay: 90 });
  await page.locator('input[type="email"]').click();
  await page.keyboard.type(studentEmail, { delay: 60 });
  await page.locator('input[type="password"]').first().click();
  await page.keyboard.type(studentPassword, { delay: 60 });
  await page.waitForTimeout(700);
  await page
    .getByRole('button', { name: /create account|sign up/i })
    .last()
    .click();
  await page
    .getByText(/pending/i)
    .first()
    .waitFor({ timeout: 30_000 });
  await page.waitForTimeout(3500);
  await stop(join(outDir, 'classroom-signup.mp4'));
  await context.storageState({ path: studentState });
}

if (step === 'chat') {
  const context = await browser.newContext({ ...phone, storageState: studentState });
  const page = await context.newPage();
  await page.goto(shareUrl);
  const checkAgain = page.getByRole('button', { name: /check again/i });
  await checkAgain.waitFor({ timeout: 30_000 });
  console.log('Waiting on the pending screen. Run the admin step now.');
  while (!existsSync(approvedFlag)) await page.waitForTimeout(300);
  const stop = startRecording(page);
  await page.waitForTimeout(1500);
  await checkAgain.tap();
  const input = page.locator('#chat-input');
  await input.waitFor({ timeout: 30_000 });
  await page.waitForTimeout(1200);
  const whatsNew = page.getByRole('button', { name: "Okay, Let's Go!" });
  if (await whatsNew.isVisible().catch(() => false)) await whatsNew.tap();
  await input.tap();
  await page.waitForTimeout(400);
  await page.keyboard.type(prompt, { delay: 55 });
  await page.waitForTimeout(600);
  // On a phone Enter adds a new line, so tap the send button.
  await page.locator('#send-message-button').tap();
  await page.waitForTimeout(1500);
  await page
    .locator('#stop-response-button, button[aria-label="Stop"]')
    .first()
    .waitFor({ state: 'detached', timeout: 600_000 })
    .catch(() => {});
  await page.waitForTimeout(3500);
  await stop(join(outDir, 'classroom-chat.mp4'));
  rmSync(studentState, { force: true });
  rmSync(approvedFlag, { force: true });
}

if (step === 'admin') {
  const signin = await fetch(`${adminUrl}/api/v1/auths/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: adminEmail, password: adminPassword }),
  });
  if (!signin.ok) throw new Error(`Sign-in failed: ${signin.status} ${await signin.text()}`);
  const { token } = await signin.json();

  // 1024x576 at 1.875x is 1920x1080 with larger text than a 1280x720 page.
  const context = await browser.newContext({
    viewport: { width: 1024, height: 576 },
    deviceScaleFactor: 1.875,
    colorScheme: 'dark',
  });
  await context.addInitScript((t) => {
    localStorage.setItem('token', t);
    localStorage.setItem('theme', 'dark');
  }, token);
  await context.addInitScript(() => {
    window.addEventListener('DOMContentLoaded', () => {
      const dot = document.createElement('div');
      dot.style.cssText =
        'position:fixed;left:-50px;top:-50px;width:22px;height:22px;margin:-11px 0 0 -11px;border-radius:50%;' +
        'background:rgba(255,255,255,.35);border:2px solid #fff;box-shadow:0 0 6px rgba(0,0,0,.6);' +
        'z-index:2147483647;pointer-events:none;transition:transform .12s';
      document.documentElement.appendChild(dot);
      addEventListener(
        'mousemove',
        (e) => {
          dot.style.left = `${e.clientX}px`;
          dot.style.top = `${e.clientY}px`;
        },
        true,
      );
      addEventListener(
        'mousedown',
        () => {
          dot.style.transform = 'scale(.7)';
        },
        true,
      );
      addEventListener(
        'mouseup',
        () => {
          dot.style.transform = 'scale(1)';
        },
        true,
      );
    });
  });
  const page = await context.newPage();
  const moveTo = async (locator) => {
    const box = await locator.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 25 });
  };

  await page.goto(`${adminUrl}/admin/users`);
  const role = page
    .locator('tr', { hasText: studentEmail })
    .locator('button[aria-label="Change User Role"]');
  await role.waitFor({ timeout: 30_000 });
  await page.mouse.move(700, 450);
  await page.waitForTimeout(800);
  const stop = startRecording(page);
  await page.waitForTimeout(1800);
  await moveTo(role);
  await page.waitForTimeout(500);
  await role.click();
  await page.waitForTimeout(1300);
  const select = page.locator('select').filter({ visible: true }).first();
  await moveTo(select);
  await page.waitForTimeout(500);
  await select.selectOption('user');
  await page.waitForTimeout(1200);
  const save = page.getByRole('button', { name: 'Save', exact: true });
  await moveTo(save);
  await page.waitForTimeout(400);
  await save.click();
  await page.waitForFunction(
    (email) =>
      [...document.querySelectorAll('tr')].some(
        (row) =>
          row.textContent.includes(email) &&
          row.querySelector('button[aria-label="Change User Role"]')?.textContent.trim() === 'user',
      ),
    studentEmail,
    { timeout: 15_000 },
  );
  writeFileSync(approvedFlag, 'approved');
  await page.waitForTimeout(2500);
  await stop(join(outDir, 'classroom-admin.mp4'));
}

await browser.close();
