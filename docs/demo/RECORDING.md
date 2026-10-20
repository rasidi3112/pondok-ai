# Recording the README demo

The demo at the top of the README shows the whole first-run path in about 35 seconds:
`pondok-ai init`, then `pondok-ai up`, then a chat reply in Open WebUI.
It is built from two 1080p clips, a scripted terminal clip and a scripted browser clip, stitched with ffmpeg into
`docs/demo/demo.mp4` (1920×1080, the sharp version) and `docs/demo/demo.gif` (1280px, the inline preview).
The screenshots in the README come from the same setup.

## Storyboard (target 35s)

| Time | Shot | What the viewer should notice |
|---|---|---|
| 0–7s | Terminal: `npx pondok-ai init --preset minimal --yes` | Hardware detection and "Stack initialized successfully!" |
| 7–17s | Terminal: `npx pondok-ai up` | "All services started and healthy" and the service URLs |
| 17–22s | Browser opens http://localhost:3000 | Open WebUI is already running, model `llama3.2:3b` selected |
| 22–35s | Prompt sent, reply streams in | A real answer from a local model, no cloud key |

Suggested prompt (short, answers in 2–3 lines):

> Explain in two sentences why running AI locally is good for privacy.

## Tools

- [VHS](https://github.com/charmbracelet/vhs) for the terminal clip (`brew install vhs`, or see its README)
- [Playwright](https://playwright.dev) for the browser clip and the chat screenshot
- `ffmpeg` (required) and `gifsicle` (optional, shrinks the GIF)

## 1. Prepare so nothing waits on the network

Image pulls and model downloads are slow and would blow the 35s budget, so do them once before recording.

```bash
# Warm the image cache and the model in a throwaway folder
mkdir -p /tmp/pondok-warmup && cd /tmp/pondok-warmup
npx pondok-ai init --preset minimal --yes
npx pondok-ai up
npx pondok-ai model install llama3.2:3b
```

Then open http://localhost:3000, create the admin account, pick `llama3.2:3b` as the default model,
and send one throwaway message so the model is loaded into memory. Close the chat.

Finally stop the warm-up stack so `up` in the recording really starts it (volumes and cached images are kept):

```bash
npx pondok-ai down
```

Every folder uses the same Compose project (`pondok-ai`), so the account and model you set up here
are still there when `demo.tape` runs `init` and `up` in a fresh `/tmp/pondok-demo` folder.

## 2. Record the terminal clip

From the repository root:

```bash
vhs docs/demo/demo.tape
```

This writes `docs/demo/terminal.mp4` at 1920×1080. The tape sleeps long enough for `up` to finish on a slow
machine, so the idle time is trimmed in step 4.

## 3. Record the browser clip and the chat screenshot

With the stack from step 2 still running, record the chat with Playwright (it signs in, dismisses the
"What's New" dialog off camera, types the prompt, and waits for the reply to finish):

```bash
npm i --no-save playwright
WEBUI_EMAIL=you@example.com WEBUI_PASSWORD=... node docs/demo/record-browser.mjs
```

This writes `docs/demo/browser.mp4` and `docs/demo/screenshots/chat.png`, both at 1920×1080.
Playwright's own video recorder captures at CSS pixels, which looks soft, so the script renders a 1280×720 page at
1.5× device scale and records it as timed screenshots instead. Set `DEMO_MODEL` or `DEMO_PROMPT` to change the
model or question, and `CHROMIUM_PATH` to use a browser you already have.

## 4. Cut the waiting and build the video and GIF

On a machine without a GPU the first token and the reply together can take more than a minute, so trim both clips
and speed up the waiting with `edit-clip.sh`. Every sped-up part gets a label on screen. Each segment is
`START END SPEED [LABEL]` in seconds of the raw clip; find the times by stepping through your own recording.
The committed take used:

```bash
docs/demo/edit-clip.sh docs/demo/terminal.mp4 docs/demo/terminal-cut.mp4 \
  "0 6.5 1;10.6 15 1;15 36.6 6 6x speed: waiting for health checks;36.6 39.5 1"
docs/demo/edit-clip.sh docs/demo/browser.mp4 docs/demo/browser-cut.mp4 \
  "0 4.6 1;4.6 52.5 20 20x speed: waiting for the first token (CPU only);52.5 86.8 5 5x speed: reply streaming (CPU only);86.8 90.5 1"
```

Then join them:

```bash
docs/demo/make-gif.sh docs/demo/terminal-cut.mp4 docs/demo/browser-cut.mp4
```

This writes `docs/demo/demo.mp4` (1920×1080, 30 fps) and `docs/demo/demo.gif` (1280px, 15 fps).
Keep the GIF under about 10 MB so GitHub shows it inline. If it is too large, try `WIDTH=960 FPS=12`.

## 5. Terminal screenshots

With the stack running:

```bash
vhs docs/demo/screenshots.tape
```

This writes `docs/demo/screenshots/doctor.png` and `docs/demo/screenshots/model-recommend.png`.

Commit `demo.mp4`, `demo.gif`, and the screenshots. The raw and cut clips are ignored by git.

## Checklist before committing

- [ ] Total length is 30–40 seconds
- [ ] No real hostnames, emails, API keys, or other personal data on screen
- [ ] The reply visibly comes from `llama3.2:3b` running locally
- [ ] Every sped-up part is labelled on screen
- [ ] The GIF loops cleanly and is under about 10 MB

# Recording the classroom demo

The demo in the "Share on your network" section shows `pondok-ai share` end to end in about a minute:
the teacher shares Open WebUI, a student opens the link on a phone and signs up, the teacher approves the
account, and the student asks a question in Indonesian. It is built from four 1080p clips stitched by
`make-classroom.sh` into `docs/demo/classroom.mp4` (1920×1080) and `docs/demo/classroom.gif` (1280px).

| Clip | Recorded with | Shows |
|---|---|---|
| `classroom-terminal.mp4` | `vhs docs/demo/classroom.tape` | `npx pondok-ai share` printing the LAN link and the QR code |
| `classroom-signup.mp4` | `record-classroom.mjs signup` | A Pixel 7 sized browser opens the link, signs up, lands on "Account Activation Pending" |
| `classroom-admin.mp4` | `record-classroom.mjs admin` | Admin Panel > Users, the student's role changed from Pending to User |
| `classroom-chat.mp4` | `record-classroom.mjs chat` | The student taps "Check Again" and chats |

## 1. Prepare

Use a fresh Open WebUI volume so the student list only shows the demo accounts, then:

```bash
mkdir -p /tmp/pondok-kelas && cd /tmp/pondok-kelas
npx pondok-ai init --preset minimal --yes
npx pondok-ai up
npx pondok-ai model install llama3.2:3b
```

Open http://localhost:3000, create the admin account (a teacher name and an `example.com` email), then in
**Admin Panel > Settings > General** turn on **New Sign Ups**, keep **Default User Role** at **Pending**, and turn off
**Show Admin Details in Account Pending Overlay**. In **Admin Panel > Settings > Models** make `llama3.2:3b` the
default model. Send one throwaway message so the model is loaded, then run `npx pondok-ai share` once so the
recorded run does not recreate the container.

The phone has to reach the LAN address that `share` prints, not `localhost`. A second device on the same Wi-Fi
works; on Linux a network namespace joined to the host with a veth pair does too (the committed take used
`192.168.50.10` for the host and ran the phone steps inside the namespace).

## 2. Record

```bash
PONDOK_DIR=/tmp/pondok-kelas vhs docs/demo/classroom.tape
export SHARE_URL=http://192.168.50.10:3000 ADMIN_EMAIL=... ADMIN_PASSWORD=...
node docs/demo/record-classroom.mjs signup
node docs/demo/record-classroom.mjs chat &   # waits on the pending screen
node docs/demo/record-classroom.mjs admin    # approves; the chat step then continues
wait
```

The phone is a Pixel 7 viewport at 2× device scale and the admin page is 1024×576 at 1.875× (1920×1080), both
recorded as timed screenshots so text stays sharp. Headless screenshots have no mouse pointer, so the admin clip
draws a dot that follows the real mouse.

`gemma3:4b` (what `model recommend --lang id` suggests) answers this prompt well, but Open WebUI 0.11 sends its
built-in tools with every chat and Ollama rejects them for models without tool support ("does not support tools").
The committed take uses `llama3.2:3b`, which works out of the box.

## 3. Cut and build

The committed take used:

```bash
CHAT_CUT="0 10 1;10 65.5 20 20x speed: model thinking (CPU only);65.5 113.3 6 6x speed: reply streaming (CPU only);113.3 118 1" \
  docs/demo/make-classroom.sh
```

`TERMINAL_CUT`, `SIGNUP_CUT` and `ADMIN_CUT` default to the whole clip (the terminal clip to its first 9 seconds).
Commit `classroom.mp4` and `classroom.gif`; the raw clips are ignored by git.
