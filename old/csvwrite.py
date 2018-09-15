#coding:utf-8
import csv

f = open('writedata.csv', 'ab') #�ե����뤬̵�����к��롢��'a'�����ꤷ�ޤ�

csvWriter = csv.writer(f)

val = 0
for num in range(1, 5):
   listData = [] #����������������������#list�ν�����
   val = num
   listData.append(val)                      #list�˥ǡ������ɲ�
   for loop in range(0, 5):
      val = val * 10 + num
      listData.append(val)
   csvWriter.writerow(listData)          #1�Խ񤭹���

f.close()
