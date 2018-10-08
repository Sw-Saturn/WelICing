#sudo pkill -f -- "chromium-browser --type=renderer"
#xset s off
#xset -dpms
#xset s noblank
#php /var/www/html/2018_procon_wellness/data_download.php
#sudo cp /home/pi/procon29/FelicaReader/data.csv /var/www/html/2018_procon_wellness/data.csv
#unclutter
chromium-browser --kiosk --fullscreen --noerrdialogs --incognito --allow-file-access-from-files http://localhost/2018_procon_wellness/DISPLAY_RESULT.html &
