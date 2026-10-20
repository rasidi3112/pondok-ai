# Terminal part of the classroom demo (pondok-ai share).
# Render with VHS from the repository root, with the stack up and the admin account created:
#   vhs docs/demo/classroom.tape
# See docs/demo/RECORDING.md.

Output docs/demo/classroom-terminal.mp4

Require npx

Set Shell "bash"
Set FontSize 19
Set Width 1920
Set Height 1080
Set Padding 40
Set Theme "Catppuccin Mocha"
Set TypingSpeed 50ms
Set Framerate 30

Hide
Type "export npm_config_yes=true && cd ${PONDOK_DIR:-/tmp/pondok-kelas} && clear"
Enter
Show

Sleep 600ms
Type "npx pondok-ai share"
Sleep 500ms
Enter
Sleep 10s
