# Terminal screenshots for the README (run with the stack up, see RECORDING.md):
#   vhs docs/demo/screenshots.tape

Require npx

Set Shell "bash"
Set FontSize 22
Set Width 1440
Set Height 1540
Set Padding 40
Set Theme "Catppuccin Mocha"
Set TypingSpeed 20ms

Hide
Type "cd /tmp/pondok-demo && clear"
Enter
Show

Type "npx pondok-ai doctor"
Enter
Sleep 12s
Screenshot docs/demo/screenshots/doctor.png

Hide
Type "clear"
Enter
Show

Type "npx pondok-ai model recommend --lang id"
Enter
Sleep 12s
Screenshot docs/demo/screenshots/model-recommend.png
