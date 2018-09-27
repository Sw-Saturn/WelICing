# -*- coding: utf-8 -*-

import binascii
import serial
import nfc
import sys
import time
import random
import datetime
import mysql.connector
from RPi import GPIO
from dateutil.relativedelta import relativedelta
import pprint
import pickle

finIDm = 77408918390023174  #010101129C17E006 [ICOCA]
RasNum = 1

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
    elif sum==6:
        return 2.1
    elif sum==7:
        return 1.3
    elif sum==8:
        return 1
    return 0

def custom_round(number, ndigits=0):
    if type(number) == int:#整数ならそのまま返す
        return number
    d_point = len(str(number).split('.')[1])#小数点以下が何桁あるか定義
    if ndigits >= d_point:#求める小数点以下の値が引数より大きい場合はそのまま返す
        return number
    c = (10 ** d_point) * 2
    #小数点以下の桁数分元の数に0を足して整数にして2倍するための値(0.01ならcは200)
    return round((number * c + 1) / c, ndigits)
    #元の数に0を足して整数にして2倍して1を足して2で割る。元の数が0.01なら0.015にしてroundを行う

def format_float(num):
        return ('%i' if num == int(num) else '%s') % num

def calcTime(dt,data):
    oldTime=data[0][u'時間']
    delta=dt-oldTime
    delta=delta.total_seconds()
    return delta/3600
def calcCalories(time,dist,data):
    speed=dist/time
    weight=data[0][u'体重']
    #print ("speed: "+str(speed))
    #print ("weight: "+str(weight))
    cal=(0.1451*speed*speed-0.6804*speed+3.4571)*weight*time*1.05
    return cal


class MyCardReader(object):

    def on_connect(self, tag):
        #print "touched"
        self.idm = binascii.hexlify(tag.idm)
        # LED
        GPIO.output(17,0)
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

def main():
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(17,GPIO.OUT) #Red
    GPIO.setup(27,GPIO.OUT) #Green
    GPIO.setup(22,GPIO.OUT) #Blue
    GPIO.output(17,1)
    GPIO.output(27,1)
    GPIO.output(22,0)
    with open('message.pickle','rb')as p:
        message=pickle.load(p)
    #print "Started idm_reader !!!"
    cr = MyCardReader()
    while True:
        GPIO.output(17,1)
        GPIO.output(27,1)
        GPIO.output(22,0)
        #with open('speed.pickle','rb')as f:
        #    basedSpeed=pickle.load(f)
        #print "touch card:"
        cr.read_id()
        idm_dec=int(cr.idm,16)
        print idm_dec
        with open('idm.txt','w') as writeIDm:
            writeIDm.write(str(idm_dec))
        print "released"
        #print cr.idm
        #host=ik1-333-26548.vs.sakura.ne.jp
        connect = mysql.connector.connect(user='user1', password='Sotuken17-Feli', host='153.126.194.52', database='ikiiki', charset='utf8')
        cursor = connect.cursor(buffered=True,dictionary=True)

        # select
        stmt='SELECT * FROM `ikiiki` WHERE `ID` = %s ORDER BY `時間` DESC'
        cursor.execute(stmt,(idm_dec,))

        row = cursor.fetchmany(2)
        #for i in row:
        #    l=pprint.pformat(i)
        #    print (l.decode('unicode-escape'))
        cursor.close()
        if RasNum==row[0][u'端末番号']:
            GPIO.output(17,1)
            time.sleep(0.8)
            GPIO.output(17,0)
            connect.close()
            if idm_dec==finIDm:
                break
            continue

        #calculation Distance.
        distance=calcDistance(row,RasNum)
        print("distance: "+str(distance))

        now = datetime.datetime.now()
        nowtime = now.strftime('%Y-%m-%d %H:%M:%S')
        hours=calcTime(now,row)
        print("hours: "+str(hours))
        counts=row[0][u'回数']
        counts=counts+1

        kcal=calcCalories(hours,distance,row)
        #print ("calories: "+str(kcal))
        #print distance/hours
        totalHours=row[0][u'総運動時間']+hours
        #print ("totalHours: "+str(totalHours))
        cardNumber=row[0]['CardNum']
        totalDistance=row[0][u'総移動距離']+distance
        #print ("totalDistance: "+str(totalDistance))
        
        totalCalories=row[0][u'総消費カロリー']+kcal
        #print ("totalCalories: "+str(totalCalories))

        height=row[0][u'身長']
        weight=row[0][u'体重']
        age=row[0][u'年齢']
        sex=row[0][u'性別']

        try:
            cur=connect.cursor(prepared=True)
            insert='INSERT INTO ikiiki(ID,CardNum,時間,距離,消費カロリー,総運動時間,総移動距離,総消費カロリー,端末番号,回数,身長,体重,年齢,性別) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?);'
            
            
            #basedSpeed+=((distance/hours)-basedSpeed)/10
            #with open('speed.pickle','wb')as f:
            #    pickle.dump(basedSpeed,f)
            #print basedSpeed
            if hours>1:
                totalHours=totalHours-hours
                totalCalories=totalCalories-kcal
                counts=counts-1
                totalDistance=totalDistance-distance
                distance=0
                kcal=0

            cur.execute(insert,(str(idm_dec),str(cardNumber),nowtime,distance,kcal,totalHours,totalDistance,totalCalories,RasNum,counts,height,weight,age,sex))
            connect.commit()
            cursor.close()
            connect.close()
            GPIO.output(27,1) #Green LED on.
            time.sleep(0.8)
            GPIO.output(27,0)
        except:
            connect.rollback()
            GPIO.output(17,0)       #LEDoff
            GPIO.output(27,0)
            GPIO.output(22,0)
            raise
        if RasNum==1:
            s=serial.Serial("/dev/ttyUSB0",9600)
            nowtime=datetime.datetime.now().strftime('%Y年%m月%d日%H時%M分%S秒')

            totalTimes='{0.hours}時間{0.minutes}分{0.seconds}秒'.format(relativedelta(hours=totalHours).normalized())

            printStr='{0},{1:0=3},{2},{3},{4},{5},{6},{7}'
            message=random.choice(messageList).encode('utf-8')
            time.sleep(1.8)
            distance=custom_round(distance,2)
            kcal=custom_round(kcal,2)
            totalDistance=custom_round(totalDistance,2)
            totalCalories=custom_round(totalCalories,2)
            print type(nowtime)
            printStr=printStr.format(nowtime,cardNumber,format_float(distance),format_float(kcal),totalTimes,format_float(totalDistance),format_float(totalCalories),message)
            print printStr
            s.write(printStr)
            s.close()
        
        if idm_dec == finIDm:
            break

    #print "Stopped idm_reader"


if __name__ == '__main__':
    main()
