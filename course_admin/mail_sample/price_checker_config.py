#! Python 3.7.1
# 2018/12/29
# 開発担当者　川本孝太朗
# price_checkerのデータベース管理


import sqlite3
from contextlib import closing
import bs4
import requests
import re
import smtplib
from email.mime.text import MIMEText
from email.utils import formatdate
import price_checker
import pprint
# ToDo Qiita書く


# データの挿入
# DataBase:price_checker table:user  column:(name, title, url, price, mail)


def insert_data(dbname, user_name, page_url, mail_address):
    with closing(sqlite3.connect(dbname)) as connection:
        cursor = connection.cursor()
        price = price_checker.get_price(page_url)
        title = price_checker.get_title(page_url)
        sql = 'insert into users (name, title, url, price, mail) values (?,?,?,?,?)'
        user = (user_name, title, page_url, price, mail_address)
        cursor.execute(sql, user)
        connection.commit()
        connection.close()

# データの削除


def delete_data(dbname, page_url):
    with closing(sqlite3.connect(dbname)) as connection:
        cursor = connection.cursor()
        sql = 'delete from users where url = ? '
        data = (page_url,)
        cursor.execute(sql, data)
        connection.commit()
        connection.close()


# データの取得


def get_data(dbname, user_name):
    list = []
    with closing(sqlite3.connect(dbname)) as connection:
        cursor = connection.cursor()
        select_sql = 'select * from users where name = ? '
        data = (user_name,)
        for row in cursor.execute(select_sql, data):
            list.append(row)
        connection.close()
    return  list

# ToDo パスワードを導入する

if __name__ == '__main__':

    print('configを開始します')
    name = input('名前を入力してください：')
    items = get_data('price_checker.db',name)
    if items == []:
        print('はじめまして{}さん'.format(name))

    else:
        print('あなたが登録している商品はこちらです')
        for item in items:
            print('\nitem{}'.format(items.index(item)+1))
            print(item[1])

    while True:
        items = get_data('price_checker.db', name)
        print('\n\n何をしますか？数字で入力してください')
        print('1.登録商品の表示\n'\
              '2.商品の追加\n'\
              '3.商品の削除\n'\
              '4.終了')
        choice = int(input('選択：'))
        if choice == 1:
            if items:
                print('あなたが登録している商品はこちらです')
                for item in items:
                    print('\nitem{}'.format(items.index(item) + 1))
                    print(item[1])
            else:
                print('あなたが登録している商品はありません')

        elif choice == 2:
            url = input('追加する商品のurlを入力してください:')
            if item == []:
                mail_addr = input('メールアドレスを入力してください:')
            else:
                mail_addr = item[0][4]

            insert_data('price_checker.db', name, url, mail_addr)
            print('データを登録しました')

        elif choice == 3:
            for item in items:
                print('\nitem{}'.format(items.index(item) + 1))
                print(item[2])
            print('削除する商品の番号を入力してください')
            index = int(input('番号：')) - 1

            delete_data('price_checker.db', items[index][2])
            print('データを削除しました')

        else:
            break


