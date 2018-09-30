#sudo pkill -f -- "chromium-browser --type=renderer"
#xset s off
#xset -dpms
#xset s noblank
#unclutter
chromium-browser --kiosk --fullscreen --noerrdialogs --incognito --allow-file-access-from-files http://localhost/ &
