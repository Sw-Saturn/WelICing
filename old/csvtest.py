#coding:utf-8

import csv   #csvモジュールをインポートする

f = open('data.csv', 'rb')

dataReader = csv.reader(f)

for row in dataReader:
   print ' ' .join(row)
