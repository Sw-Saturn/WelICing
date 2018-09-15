#coding:utf-8
import csv
import datetime
import time

f = open('timedata.csv', 'ab')

csvWriter = csv.writer(f)

now = datetime.datetime.now().strftime("%Y/%m/%d %H:%M*%S")
listData = [] #
listData.append(now)                      #
csvWriter.writerow(listData)          #

f.close()
