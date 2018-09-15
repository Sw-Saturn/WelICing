# -*- coding: utf-8 -*-

import binascii
import nfc
import sys
import time
import datetime
import mysql.connector
from RPi import GPIO
import pprint
finIDm = 77408918390023174  #010101129C17E006 [ICOCA]
RasNum = 7


def calcDistance(data,number):
    new=data[0][u'距離']
    oldNumber=data[0][u'端末番号']
    sum=oldNumber+number
    if sum==3:
        return 1
    elif sum==4:
        return 1.1
    elif sum==5:
        return 0.35
    return 0

def calcTime(dt,data):
    oldTime=data[0][u'時間']
    dt=datetime.datetime.strptime(dt, '%Y-%m-%d %H:%M:%S')
    delta=dt-oldTime
    delta=delta.total_seconds()
    return delta/3600
def calcCalories(time,dist,data):
    speed=dist/time
    weight=data[0][u'体重']
    print ("speed: "+str(speed))
    print ("weight: "+str(weight))
    cal=(0.1451*speed*speed-0.6804*speed+3.4571)*weight*time*1.05
    return cal
class MyCardReader(object):

    def on_connect(self, tag):
        print "touched"
        self.idm = binascii.hexlify(tag.idm)
        # LED
        GPIO.output(22,1)   #BlueLEDon
        time.sleep(0.5)
        GPIO.output(22,0)
        return True

    def read_id(self):
        clf = nfc.ContactlessFrontend('usb')
        try:
            clf.connect(rdwr={'on-connect': self.on_connect})
        finally:
            clf.close()

def main(ids_csv_filename):
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(17,GPIO.OUT) #Red
    GPIO.setup(27,GPIO.OUT) #Green
    GPIO.setup(22,GPIO.OUT) #Blue
    GPIO.output(17,0)       #LEDoff
    GPIO.output(27,0)
    GPIO.output(22,0)
    print "Started idm_reader !!!"
    cr = MyCardReader()
    connect = mysql.connector.connect(user='user1', password='octo', host='localhost', database='ikiiki', charset='utf8')
    cursor = connect.cursor(dictionary=True,buffered=True)
    
    while True:
#        print "touch card:"
        cr.read_id()
        idm_dec=int(cr.idm,16)
#        print "released"
#        print cr.idm
        # select
        cursor.execute('SELECT * FROM `ikiiki` WHERE `ID` = '+str(idm_dec)+' ORDER BY `時間` DESC')
        row = cursor.fetchmany(2)
        for i in row:
            l=pprint.pformat(i)
            print (l.decode('unicode-escape'))
        cursor.close()
        connect.close()
        
        #calculation Distance.
        distance=calcDistance(row,1)
        print("distance: "+str(distance))

        now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        hours=calcTime(now,row)
        print("hours: "+str(hours))
        counts=row[0][u'回数']
        counts=counts+1

        kcal=calcCalories(hours,distance,row)
        print ("calories: "+str(kcal))

        totalHours=row[0][u'総運動時間']+hours
        print ("totalHours: "+str(totalHours))

        totalDistance=row[0][u'総移動距離']+distance
        print ("totalDistance: "+str(totalDistance))
        
        totalCalories=row[0][u'総消費カロリー']+kcal
        print ("totalCalories: "+str(totalCalories))

        


        #with open(ids_csv_filename, 'a') as ids_csv_file:   #csv open
        #    print "Successfully get IDm."
        #    print "IDm: " + cr.idm

        #    idm_dec =int(cr.idm,16)

#            now = datetime.datetime.now().strftime("%Y/%m/%d %H:%M:%S")
         #   today = datetime.datetime.now().strftime("%Y/%m/%d")
         #   now = datetime.datetime.now().strftime("%H:%M:%S")
         #   #ids_csv_file.write("{},{},{},{},{}\n".format(today, now, cr.idm, idm_dec, RasNum))
         #   ids_csv_file.write("{},{},{},{},{}\n",format(idm_dec,today,))
         #   ids_csv_file.close()

        if idm_dec == finIDm:
            break

    print "Stopped idm_reader"


if __name__ == '__main__':
    main(sys.argv[1])
