#!/usr/bin/env bash
# Trim a raw clip and speed up the waiting parts, labelling every sped-up part on screen.
# Usage: docs/demo/edit-clip.sh IN OUT "START END SPEED [LABEL];..."
# Example: docs/demo/edit-clip.sh terminal.mp4 terminal-cut.mp4 "0 6.5 1;15 36.6 6 6x speed: waiting for health checks"
set -euo pipefail

IN="$1"
OUT="$2"
SEGMENTS="$3"
FONT_SIZE="${FONT_SIZE:-34}"
FONT="${FONT:-}"
if [ -z "$FONT" ]; then
  FONT="$(fc-match -f '%{file}' 'Inter:semibold' 2>/dev/null || true)"
fi

command -v ffmpeg >/dev/null || { echo "ffmpeg is required" >&2; exit 1; }

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# Encode each segment on its own (seeking into the input) so long clips never sit in memory, then join them.
n=0
IFS=';' read -ra parts <<< "$SEGMENTS"
for part in "${parts[@]}"; do
  read -r start end speed label <<< "$part"
  f="setpts=(PTS-STARTPTS)/$speed"
  if [ -n "${label:-}" ]; then
    label="${label//:/\\:}"
    f="$f,drawtext=fontfile='$FONT':text='$label':fontsize=$FONT_SIZE:fontcolor=0x1e1e2e"
    f="$f:box=1:boxcolor=0xf9e2af:boxborderw=16:x=w-tw-48:y=40"
  fi
  ffmpeg -loglevel error -y -ss "$start" -to "$end" -i "$IN" -an -vf "$f,fps=30" \
    -c:v libx264 -preset slow -crf 16 -pix_fmt yuv420p "$TMP/$n.mp4"
  echo "file '$TMP/$n.mp4'" >> "$TMP/list.txt"
  n=$((n + 1))
done

ffmpeg -loglevel error -y -f concat -safe 0 -i "$TMP/list.txt" -c copy "$OUT"
echo "Wrote $OUT ($(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT")s)"
