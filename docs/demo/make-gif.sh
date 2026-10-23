#!/usr/bin/env bash
# Join the terminal clip and the Open WebUI clip into docs/demo/demo.mp4 (1080p) and docs/demo/demo.gif.
# Usage: docs/demo/make-gif.sh docs/demo/terminal-cut.mp4 docs/demo/browser-cut.mp4
set -euo pipefail

TERMINAL="${1:-docs/demo/terminal-cut.mp4}"
BROWSER="${2:-docs/demo/browser-cut.mp4}"
OUT="${3:-docs/demo/demo.gif}"
OUT_MP4="${OUT_MP4:-${OUT%.gif}.mp4}"
VIDEO_WIDTH="${VIDEO_WIDTH:-1920}"
WIDTH="${WIDTH:-1920}"
FPS="${FPS:-15}"
VIDEO_HEIGHT=$(( VIDEO_WIDTH * 9 / 16 / 2 * 2 ))

command -v ffmpeg >/dev/null || { echo "ffmpeg is required" >&2; exit 1; }

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# Normalize both clips to the same size and frame rate, letterboxing as needed.
for name in terminal browser; do
  src="$TERMINAL"; [ "$name" = browser ] && src="$BROWSER"
  ffmpeg -loglevel error -y -i "$src" -an \
    -vf "fps=30,scale=$VIDEO_WIDTH:$VIDEO_HEIGHT:force_original_aspect_ratio=decrease:flags=lanczos,pad=$VIDEO_WIDTH:$VIDEO_HEIGHT:(ow-iw)/2:(oh-ih)/2:color=0x1e1e2e" \
    -c:v libx264 -preset slow -crf 14 -pix_fmt yuv420p "$TMP/$name.mp4"
done

printf "file '%s'\nfile '%s'\n" "$TMP/terminal.mp4" "$TMP/browser.mp4" > "$TMP/list.txt"
ffmpeg -loglevel error -y -f concat -safe 0 -i "$TMP/list.txt" -c copy "$TMP/joined.mp4"

# The MP4 is the sharp version: full resolution, plays in any browser.
ffmpeg -loglevel error -y -i "$TMP/joined.mp4" \
  -c:v libx264 -preset slow -crf 20 -tune stillimage -pix_fmt yuv420p -movflags +faststart "$OUT_MP4"

# The GIF is the inline preview. One palette for the whole clip and light dithering keep text crisp.
ffmpeg -loglevel error -y -i "$TMP/joined.mp4" \
  -vf "fps=$FPS,scale=$WIDTH:-2:flags=lanczos,split[a][b];[a]palettegen=stats_mode=diff:max_colors=256[p];[b][p]paletteuse=dither=sierra2_4a:diff_mode=rectangle" \
  -loop 0 "$OUT"

if command -v gifsicle >/dev/null; then
  gifsicle -O3 -b "$OUT"
fi

duration="$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT_MP4")"
echo "Wrote $OUT_MP4 (${duration%.*}s, $(du -h "$OUT_MP4" | cut -f1)) and $OUT ($(du -h "$OUT" | cut -f1))"
echo "Keep the GIF under about 10 MB so GitHub renders it inline."
