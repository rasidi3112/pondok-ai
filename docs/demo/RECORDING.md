# Recording the README demo

The GIF at the top of the README shows the whole first-run path in about 30 seconds:
`pondok-ai init`, then `pondok-ai up`, then a chat reply in Open WebUI.
It is built from two clips, a scripted terminal clip and a short browser clip, stitched with ffmpeg.

## Storyboard (target 30s)

| Time | Shot | What the viewer should notice |
|---|---|---|
| 0–8s | Terminal: `npx pondok-ai init --preset minimal --yes` | Hardware detection and "Stack initialized successfully!" |
| 8–16s | Terminal: `npx pondok-ai up` | "All services started and healthy" and the service URLs |
| 16–19s | Browser opens http://localhost:3000 | Open WebUI is already running, model `llama3.2:3b` selected |
| 19–30s | Type a prompt, reply streams in | A real answer from a local model, no cloud key |

Suggested prompt (short, answers in 2–3 lines):

> Explain in two sentences why running AI locally is good for privacy.

## Tools

- [VHS](https://github.com/charmbracelet/vhs) for the terminal clip (`brew install vhs`, or see its README)
- Any screen recorder for the browser clip (macOS `Cmd+Shift+5`, OBS, or Kap)
- `ffmpeg` (required) and `gifsicle` (optional, shrinks the GIF)

## 1. Prepare so nothing waits on the network

Image pulls and model downloads are slow and would blow the 30s budget, so do them once before recording.

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

This writes `docs/demo/terminal.mp4`. The tape waits on the real CLI output, so the clip length follows your machine.
The tape sleeps long enough for `up` to finish on a slow machine, so trim the idle time afterwards
(the committed GIF cuts the pauses and plays the health-check wait at 6x, labelled on screen).

## 3. Record the browser clip

With the stack from step 2 still running, record the chat with Playwright (it signs in, dismisses the
"What's New" dialog off camera, types the prompt, and waits for the reply to finish):

```bash
npm i --no-save playwright
WEBUI_EMAIL=you@example.com WEBUI_PASSWORD=... node docs/demo/record-browser.mjs
```

This writes `docs/demo/browser.webm` at 960×540, the same width as the GIF, so the chat text is not scaled down. Set `DEMO_MODEL` or `DEMO_PROMPT` to change the model or question,
and `CHROMIUM_PATH` to use a browser you already have.

To record by hand instead, use a 960×540 dark-mode browser window, open http://localhost:3000,
send the prompt, stop about one second after the reply finishes, and save it as `docs/demo/browser.mp4`.

## 4. Build the GIF

```bash
docs/demo/make-gif.sh docs/demo/terminal.mp4 docs/demo/browser.webm
```

This writes `docs/demo/demo.gif` at 960px wide and 12 fps. Keep it under about 8 MB so GitHub shows it inline.
If it is too large, try `WIDTH=800 FPS=10 docs/demo/make-gif.sh ...`.

On a machine without a GPU the first token and the reply together can take about a minute, so trim and speed up both clips
before building the GIF, and label every sped-up part on screen. The committed take used these cuts
(start–end in seconds of the raw clip, then speed):

| Clip | Kept at 1x | Sped up, with an on-screen label |
|---|---|---|
| terminal | 0–6.2 (init), 10.3–14.5 (typing `up`), 36–38.5 (ready) | 14.5–36 at 6x, "waiting for health checks" |
| browser | 1.6–7 (typing the prompt), 65–68.5 (finished reply) | 7–41 at 15x, "waiting for the first token (CPU only)"; 41–65 at 4x, "reply streaming (CPU only)" |

Use ffmpeg `trim`, `setpts=(PTS-STARTPTS)/SPEED` and `drawtext` per segment, `concat` the segments,
and pass the two edited clips to `make-gif.sh`.

Commit only `docs/demo/demo.gif`. The `.mp4` and `.webm` sources are ignored by git.

## Checklist before committing

- [ ] Total length is 25–35 seconds
- [ ] No real hostnames, emails, API keys, or other personal data on screen
- [ ] The reply visibly comes from `llama3.2:3b` running locally
- [ ] The GIF loops cleanly and is under about 8 MB
