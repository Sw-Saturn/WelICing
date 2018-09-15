#import binascii
import datetime
import sys
import time
import socket

HOST = '153.126.194.52' #送信先IP
PORT = 8001 #送信先ポート
INTERVAL = 3 #リトライ間隔[sec]
RETRYTIMES = 5 #リトライ回数

def socket_connect(host, port, interval, retries):

    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    for x in range(retries):
        try:
            sock.connect((host, port))
            return sock
        except socket.errer:
            print "Wait"+str(interval)+"sec"
            time.sleep(interval)

    sock.close()
    return None

def main():

    sock = socket_connect(HOSTNAME, PORT, INTERVAL, RETRYTIMES)

    if sock is None:
        print "system exit:connection error"
        sys.exit(0)

    while(1):
        recvdata = sock.recv(1024)
        print "ReciveData:"+recvdata
        senddata = raw_input("SendData:")
        sock.send(senddata)
        if (recvdata == "quit") or (senddata == "quit"):
            sock.close()
            break

if __name__ == '__main__':
    main()
