# Terminal half of the README demo (pondok-ai init, then up).
# Render with VHS (https://github.com/charmbracelet/vhs):
#   vhs docs/demo/demo.tape
# Recorded on an Apple Silicon Mac with a native Ollama; see docs/demo/RECORDING.md.

Output docs/demo/terminal.mp4

Require npx
Require docker

Set Shell "bash"
Set FontSize 26
Set Width 1920
Set Height 1080
Set Padding 40
Set Theme "Catppuccin Mocha"
Set TypingSpeed 45ms
Set Framerate 30

# Start from an empty folder so init runs on a clean slate.
Hide
Type "rm -rf /tmp/pondok-demo && mkdir -p /tmp/pondok-demo && cd /tmp/pondok-demo && clear"
Enter
Show

Sleep 500ms
Type "npx pondok-ai init --preset minimal --native-ollama --force --yes"
Sleep 400ms
Enter
Sleep 8s

Type "clear && npx pondok-ai up"
Sleep 400ms
Enter
Sleep 40s
