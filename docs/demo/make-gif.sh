#!/usr/bin/env bash
# Stitch the terminal clip and the Open WebUI clip into docs/demo/demo.gif.
# Usage: docs/demo/make-gif.sh docs/demo/terminal.mp4 docs/demo/browser.webm
set -euo pipefail

TERMINAL="${1:-docs/demo/terminal.mp4}"
BROWSER="${2:-docs/demo/browser.webm}"
OUT="${3:-docs/demo/demo.gif}"
WIDTH="${WIDTH:-960}"
FPS="${FPS:-12}"
HEIGHT=$(( WIDTH * 9 / 16 / 2 * 2 ))

command -v ffmpeg >/dev/null || { echo "ffmpeg is required" >&2; exit 1; }

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# Normalize both clips to the same size and frame rate, letterboxing as needed.
for name in terminal browser; do
  src="$TERMINAL"; [ "$name" = browser ] && src="$BROWSER"
  ffmpeg -loglevel error -y -i "$src" -an \
    -vf "fps=$FPS,scale=$WIDTH:$HEIGHT:force_original_aspect_ratio=decrease:force_divisible_by=2,pad=$WIDTH:$HEIGHT:(ow-iw)/2:(oh-ih)/2:color=0x1e1e2e" \
    "$TMP/$name.mp4"
done

printf "file '%s'\nfile '%s'\n" "$TMP/terminal.mp4" "$TMP/browser.mp4" > "$TMP/list.txt"
ffmpeg -loglevel error -y -f concat -safe 0 -i "$TMP/list.txt" -c copy "$TMP/joined.mp4"

# One palette for the whole clip keeps the GIF sharp and small.
ffmpeg -loglevel error -y -i "$TMP/joined.mp4" \
  -vf "split[a][b];[a]palettegen=stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle" \
  -loop 0 "$OUT"

if command -v gifsicle >/dev/null; then
  gifsicle -O3 --lossy=40 -b "$OUT"
fi

duration="$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$TMP/joined.mp4")"
size="$(du -h "$OUT" | cut -f1)"
echo "Wrote $OUT (${duration%.*}s, $size)"
echo "Aim for about 30s and under 8 MB so GitHub renders it inline."
