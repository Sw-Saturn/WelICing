from __future__ import print_function
import socket
import time
import RPi.GPIO as GPIO
GPIO.setmode(GPIO.BCM)
GPIO.setup(25, GPIO.IN)
from contextlib import closing

def main():

  while True:
    inputValue = GPIO.input(25)
    if (inputValue == True):
      send()
    time.sleep(1)

def send(): #送信処理

  host = '192.168.1.0' #送信先IP
  port = 8080 '送信先Port
  bufsize = 4096

  sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
  sock.settimeout(0.5) #接続タイムアウト値設定

  with closing(sock):
    try:
      sock.connect((host, port))
      sock.send(b'raspberry')
    except socket.timeout:
      print(b'socketTimeout')
    except socket.error:
      print(b'socketError')
    time.sleep(5)
  return

if __name__ == '__main__':
  main()

#---------------------------------------------------------------------
from __future__ import print_function
import socket
import time
from contextlib import closing

from ctypes import *

def main():

  while True: #ずっと繰り返し
    recv()
    time.sleep(1) #一秒止める

def recv(): #受信処理
  host = '192.168.1.0' #自分のIP
  port = 8080 #任意のIP
  backlog = 10
  bufsize = 4096
  socket.timeout(1)

  sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
  try:
    with closing(sock):
      sock.bind((host, port))
      sock.listen(backlog)
      conn, address = sock.accept()
      msg = conn.recv(bufsize)
      if (msg == 'raspberry'): #識別文字列が一致したら表示処理
        popup()

  except socket.timeout:
    print(b'socketTimeout')
  except socket.error:
    print(b'socketError')

def popup(): #Windows画面にメッセージを出す
  user32 = windll.user32
  user32.MessageBoxA( 0, "Enemy Will Come Here!!", "Caution!!", 0x00000030)

if __name__ == '__main__':
  main()
#---------------------------------------------------------------------
#A recv
import socket
import threading
import time

HOSTNAME = "192.168.1.10"
PORT = 12345
CLIENTNUM = 3

class ConnClient(threading.Thread):

    def __init__(self,conn,addr):
        threading.Thread.__init__(self)
        self.stop_event = threading.Event()
        self.conn_socket = conn
        self.addr = addr

    def run(self):
        try:
            while (1):
                senddata = raw_input(str(self.addr)+" SendData:")
                self.conn_socket.send(senddata)
                recvdata = self.conn_socket.recv(1024)
                print "ReciveData:"+recvdata
                if (recvdata == "quit") or (senddata == "quit"):
                    break

        except socket.error:
            print "connect error"

        finally:
            self.conn_socket.close()
            print "connect close"

    def stop(self):
        self.conn_socket.close()

def main():
        s_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s_socket.bind((HOSTNAME, PORT))
        s_socket.listen(CLIENTNUM)

        while (1):
            conn, addr = s_socket.accept()
            print("Conneted by"+str(addr))
            connClientThread = ConnClient(conn,addr)
            connClientThread.setDaemon(True)
            connClientThread.start()

if __name__ == '__main__':
    main()

#-----------------------------------------------------------
# A send
import socket
import time
import sys

HOSTNAME = "192.168.1.10"
PORT = 12345
INTERVAL = 3
RETRYTIMES = 10

def socket_connect(host, port, interval, retries):

    c_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    for x in range(retries):
        try:
            c_socket.connect((host, port))
            return c_socket
        except socket.error:
            print "wait"+str(interval)+"s"
            time.sleep(interval)

    c_socket.close()
    return None

def main():

    c_socket = socket_connect(HOSTNAME,PORT,INTERVAL,RETRYTIMES)

    if c_socket is None:
        print "system exit:connection error"
        sys.exit(0)

    while(1):
        recvdata = c_socket.recv(1024)
        print "ReciveData:"+recvdata
        senddata = raw_input("SendData:")
        c_socket.send(senddata)
        if (recvdata == "quit") or (senddata == "quit"):
            c_socket.close()
            break

if __name__ == '__main__':
    main()
