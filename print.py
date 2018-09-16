# -*- coding: utf-8 -*-
import serial
from sys import argv
from time import sleep

def main():
    if len(argv)>1:
        s=serial.Serial("/dev/ttyUSB0",9600)
        sleep(2)
        print(type(argv[1]))
        input=argv[1].decode('utf-8')
        s.write(argv[1])
        print("success")
        s.close()
    else:
        print("error")


if __name__ == "__main__":
    main()

