# -*- coding: utf-8 -*-

from watchdog.events import FileSystemEventHandler
from watchdog.observers import Observer

import os
import time
import subprocess
import shutil

target_dir = "/home/pi/procon29/FelicaReader/"


class ChangeHandler(FileSystemEventHandler):
    def on_created(self, event):
        filepath = event.src_path
        filename = os.path.basename(filepath)
        print('%sができました' % filename)

    def on_modified(self, event):
        filepath = event.src_path
        filename = os.path.basename(filepath)
        print('%sを変更しました' % filename)
        #subprocess.call("sudo pkill chomium",shell=True)
        #time.sleep(1)
        #subprocess.call("php /var/www/html/2018_procon_wellness/data_download_S.php",shell=True)
        #subprocess.call("/bin/sh /home/pi/procon29/FelicaReader/browser.sh",shell=True)
        #time.sleep(15)
        subprocess.call("sudo pkill chromium",shell=True)
        subprocess.call("php /var/www/html/bingo/bingo/data_download_test.php &",shell=True)
        shutil.copyfile("./demidu.csv","/var/www/html/bingo/bingo/demidu.csv")
        #subprocess.call("sudo cp ./demidu.csv /var/www/html/bingo/bingo/",shell=True)
        time.sleep(1)
        print('killed')
        subprocess.call("/bin/sh /home/pi/procon29/FelicaReader/browser.sh",shell=True)

    def on_deleted(self, event):
        filepath = event.src_path
        filename = os.path.basename(filepath)
        print('%sを削除しました' % filename)


if __name__ in '__main__':
    while 1:
        event_handler = ChangeHandler()
        observer = Observer()
        observer.schedule(event_handler, target_dir, recursive=True)
        observer.start()
        try:
            while True:
                time.sleep(0.1)
        except KeyboardInterrupt:
            observer.stop()
        observer.join()
