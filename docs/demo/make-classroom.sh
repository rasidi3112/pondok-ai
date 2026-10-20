#!/usr/bin/env bash
# Build the classroom demo (pondok-ai share) from four raw clips:
# docs/demo/classroom.mp4 (1920x1080, the sharp version) and docs/demo/classroom.gif (inline preview).
# Usage: docs/demo/make-classroom.sh TERMINAL PHONE_SIGNUP ADMIN PHONE_CHAT
# Each clip is cut with edit-clip.sh; set TERMINAL_CUT, SIGNUP_CUT, ADMIN_CUT and CHAT_CUT to its segments.
set -euo pipefail

DIR="$(cd "$(dirname "$0")" && pwd)"
TERMINAL="${1:-docs/demo/classroom-terminal.mp4}"
SIGNUP="${2:-docs/demo/classroom-signup.mp4}"
ADMIN="${3:-docs/demo/classroom-admin.mp4}"
CHAT="${4:-docs/demo/classroom-chat.mp4}"
OUT="${OUT:-docs/demo/classroom.gif}"
OUT_MP4="${OUT_MP4:-${OUT%.gif}.mp4}"
WIDTH="${WIDTH:-1280}"
FPS="${FPS:-15}"
TERMINAL_CUT="${TERMINAL_CUT:-0 9 1}"
SIGNUP_CUT="${SIGNUP_CUT:-0 99 1}"
ADMIN_CUT="${ADMIN_CUT:-0 99 1}"
CHAT_CUT="${CHAT_CUT:-0 99 1}"
BOLD="${BOLD:-$(fc-match -f '%{file}' 'Inter:semibold' 2>/dev/null || true)}"
REGULAR="${REGULAR:-$(fc-match -f '%{file}' 'Inter' 2>/dev/null || true)}"
BG=0x1e1e2e

command -v ffmpeg >/dev/null || { echo "ffmpeg is required" >&2; exit 1; }

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# scene NAME SOURCE LAYOUT X Y TITLE SUBTITLE
# LAYOUT "full" scales the clip to 1920x1080; "phone" puts a phone-sized clip on the left with a bezel.
# The caption (title and subtitle) is drawn at X,Y.
scene() {
  local name="$1" src="$2" layout="$3" x="$4" y="$5"
  printf '%s' "$6" > "$TMP/$name-title.txt"
  printf '%b' "$7" > "$TMP/$name-sub.txt"
  local caption="drawtext=fontfile='$BOLD':textfile='$TMP/$name-title.txt':fontsize=46:fontcolor=0xcdd6f4:x=$x:y=$y"
  caption="$caption,drawtext=fontfile='$REGULAR':textfile='$TMP/$name-sub.txt':fontsize=32:fontcolor=0xa6adc8:line_spacing=14:x=$x:y=$y+76"
  if [ "$layout" = phone ]; then
    ffmpeg -loglevel error -y -i "$src" -f lavfi -i "color=c=$BG:s=1920x1080:r=30" -filter_complex \
      "[0:v]fps=30,scale=-2:1010:flags=lanczos,pad=iw+24:ih+24:12:12:color=0x45475a[p];[1:v][p]overlay=300:(H-h)/2:shortest=1,$caption" \
      -an -c:v libx264 -preset slow -crf 14 -pix_fmt yuv420p "$TMP/$name.mp4"
  else
    ffmpeg -loglevel error -y -i "$src" -an \
      -vf "fps=30,scale=1920:1080:force_original_aspect_ratio=decrease:flags=lanczos,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=$BG,$caption" \
      -c:v libx264 -preset slow -crf 14 -pix_fmt yuv420p "$TMP/$name.mp4"
  fi
}

scene terminal "$TERMINAL" full 1000 400 \
  "The teacher shares Open WebUI" \
  "One command prints the Wi-Fi link\nand a QR code for the class."
scene signup "$SIGNUP" phone 880 420 \
  "A student opens the link on a phone" \
  "Rani signs up with a personal account.\nNew accounts wait as \"pending\"."
scene admin "$ADMIN" full 380 900 \
  "The teacher approves Rani" \
  "Admin Panel > Users, role Pending to User."
scene chat "$CHAT" phone 880 420 \
  "Rani asks in Indonesian" \
  "The answer comes from llama3.2:3b\nrunning on the teacher's machine."

"$DIR/edit-clip.sh" "$TMP/terminal.mp4" "$TMP/terminal-cut.mp4" "$TERMINAL_CUT" >/dev/null
"$DIR/edit-clip.sh" "$TMP/signup.mp4" "$TMP/signup-cut.mp4" "$SIGNUP_CUT" >/dev/null
"$DIR/edit-clip.sh" "$TMP/admin.mp4" "$TMP/admin-cut.mp4" "$ADMIN_CUT" >/dev/null
"$DIR/edit-clip.sh" "$TMP/chat.mp4" "$TMP/chat-cut.mp4" "$CHAT_CUT" >/dev/null

for name in terminal signup admin chat; do echo "file '$TMP/$name-cut.mp4'"; done > "$TMP/list.txt"
ffmpeg -loglevel error -y -f concat -safe 0 -i "$TMP/list.txt" -c copy "$TMP/joined.mp4"

ffmpeg -loglevel error -y -i "$TMP/joined.mp4" \
  -c:v libx264 -preset slow -crf 20 -tune stillimage -pix_fmt yuv420p -movflags +faststart "$OUT_MP4"

ffmpeg -loglevel error -y -i "$TMP/joined.mp4" \
  -vf "fps=$FPS,scale=$WIDTH:-2:flags=lanczos,split[a][b];[a]palettegen=stats_mode=diff:max_colors=256[p];[b][p]paletteuse=dither=sierra2_4a:diff_mode=rectangle" \
  -loop 0 "$OUT"

if command -v gifsicle >/dev/null; then
  gifsicle -O3 -b "$OUT"
fi

duration="$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT_MP4")"
echo "Wrote $OUT_MP4 (${duration%.*}s, $(du -h "$OUT_MP4" | cut -f1)) and $OUT ($(du -h "$OUT" | cut -f1))"
