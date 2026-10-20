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

Note that `demo.tape` runs `init` in a fresh `/tmp/pondok-demo` folder, which gets its own Compose project.
If Open WebUI in that folder asks you to sign up again, do the account and model setup there once,
run `npx pondok-ai down`, and re-render the tape.

## 2. Record the terminal clip

From the repository root:

```bash
vhs docs/demo/demo.tape
```

This writes `docs/demo/terminal.mp4`. The tape waits on the real CLI output, so the clip length follows your machine.
If `up` takes more than about 8 seconds, trim the dead time afterwards, for example:

```bash
ffmpeg -i docs/demo/terminal.mp4 -ss 0 -t 16 -c copy docs/demo/terminal-trimmed.mp4
```

## 3. Record the browser clip

1. Use a clean browser window at 1280×720 (or any 16:9 size), no bookmarks bar or extensions in view.
2. Use dark mode in Open WebUI so it matches the terminal theme.
3. Start recording, open http://localhost:3000, start a new chat, paste the prompt, press Enter.
4. Stop recording about one second after the reply finishes. Aim for 10–14 seconds.
5. Save it as `docs/demo/browser.mp4` (convert `.mov` with `ffmpeg -i in.mov docs/demo/browser.mp4`).

## 4. Build the GIF

```bash
docs/demo/make-gif.sh docs/demo/terminal.mp4 docs/demo/browser.mp4
```

This writes `docs/demo/demo.gif` at 960px wide and 12 fps. Keep it under about 8 MB so GitHub shows it inline.
If it is too large, try `WIDTH=800 FPS=10 docs/demo/make-gif.sh ...`.

Commit only `docs/demo/demo.gif`. The `.mp4` sources are ignored by git.

## Checklist before committing

- [ ] Total length is 25–35 seconds
- [ ] No real hostnames, emails, API keys, or other personal data on screen
- [ ] The reply visibly comes from `llama3.2:3b` running locally
- [ ] The GIF loops cleanly and is under about 8 MB
