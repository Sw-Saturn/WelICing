#!/bin/bash
#echo 0
sakura=morimoto@153.126.194.52
dir=/home/pi/nfcpy/FeliCaReader/ono1/ras7
file_name=$(date '+%Y%m%d%H').csv
#echo 1
sudo rsync -aruz -e 'ssh -p 443 -i /home/pi/.ssh/id_rsa7' $dir $sakura:/home/morimoto/ono1/
#echo 2
sudo python /home/pi/nfcpy/FeliCaReader/idm_reader.py $dir/$file_name &
#echo 3
