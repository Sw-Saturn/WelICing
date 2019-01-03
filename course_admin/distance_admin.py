#! Python 3.7.1
# 2018/12/29
# 開発担当者　川本孝太朗
# WelIcingの距離の管理


import sqlite3
from contextlib import closing
import requests
import re

# -------------------------------------------------------------------------------------
# この形式だとデータベースはすっきりする代わりに通信量が増え，遅延が１秒程度発生する．
# 探索の計算オーダーはO(n)登録するデータはn個
# 登録の計算オーダーはO(1)
# 全組み合わせを登録する場合は探索の計算オーダーはO(n*n)登録するデータはn*(n-1)/2個
# 登録の計算オーダーはO(n*n)データベースは複雑になり，登録に恐ろしく時間がかかる
# マルチスレッドにすれば登録時間を改善できるが，それこそ通信料がバカにならない
# -------------------------------------------------------------------------------------

# sqliteの使い方：　https://qiita.com/kawa-Kotaro/items/9933f56abd53a09826d9
# ToDo 変な入力の時の例外処理
# ToDo エラー回避のtry except


# テーブルの作成


def create_table(dbname, table_name):
    with closing(sqlite3.connect(dbname)) as connection:
        cursor = connection.cursor()
        sql = 'create table ? (id int, postal_code varchar(64), name varchar(1024))'
        data = (table_name,)
        cursor.execute(sql, data)
        connection.commit()
        connection.close()


# データベースから端末の情報を取り出す


def get_data(dbname, table_name, idnum):
    records = []
    with closing(sqlite3.connect(dbname)) as connection:
        cursor = connection.cursor()
        select_sql = 'select * from ? where id = ?'
        data = (table_name, idnum)
        for row in cursor.execute(select_sql, data):
            records.append(row)
        connection.close()
    return records


# データベースから端末の情報を取り出す


def get_all_data(dbname, table_name):
    records = []
    with closing(sqlite3.connect(dbname)) as connection:
        cursor = connection.cursor()
        select_sql = 'select * from ?'
        data = (table_name,)
        for row in cursor.execute(select_sql, data):
            records.append(row)
        connection.close()
    return records


# データベースにある端末の情報を更新


def update_data(dbname, table_name, idnum, postal_code, place_name):
    with closing(sqlite3.connect(dbname)) as connection:
        cursor = connection.cursor()
        sql = 'update ? postal_code=? name=? where id=?'
        data = (table_name, postal_code, place_name, idnum)
        cursor.execute(sql, data)
        connection.commit()
        connection.close()


# データベースに端末の情報を追加


def insert_data(dbname, table_name, idnum, postal_code, place_name):
    with closing(sqlite3.connect(dbname)) as connection:
        cursor = connection.cursor()
        sql = 'insert into ? (id, postal_code, name) values (?,?,?)'
        data = (table_name, idnum, postal_code, place_name)
        cursor.execute(sql, data)
        connection.commit()
        connection.close()


# データベースから端末の情報を削除


def delete_data(dbname, table_name, idnum):
    with closing(sqlite3.connect(dbname)) as connection:
        cursor = connection.cursor()
        sql = 'delete from ? where idnum = ? '
        data = (table_name, idnum)
        cursor.execute(sql, data)
        connection.commit()
        connection.close()


# urlにアクセスして距離を取得する


def request_distance(map_url):
    res = requests.get(map_url)
    pattern = r'\d\d*\.?\d* k?m'
    regex = re.compile(pattern)
    matches = re.findall(regex, res.text)

    if 'k' in matches[0]:
        distance = float(matches[0][0:-3])
        distance *= 1000  # km表示のときにはm表示に変換する
    else:
        distance = float(matches[0][0:-2])
    return distance


# 端末番号を2カ所引数に与えれば距離[m]を返す関数


def get_distance(idnum1, idnum2):
    dbname = 'check_point.db'
    table_name = 'check_point'
    point1 = get_data(dbname, table_name, idnum1)
    point2 = get_data(dbname, table_name, idnum2)
    temp_url = 'https://www.google.co.jp/maps/dir/{}、〒{}/{}、〒{}/'
    map_url = temp_url.format(point1[0][2], point1[0][1], point2[0][2], point2[0][1])
    distance = request_distance(map_url)
    return distance


if __name__ == '__main__':
    db = 'check_point.db'
    table = 'check_point'
    print('端末の設定を開始します')

    while True:
        devices = get_all_data(db, table)
        print('\n\n何をしますか？数字で入力してください')
        print('1.端末情報の表示\n'
              '2.端末の追加\n'
              '3.端末情報の更新\n'
              '4.端末の削除\n'
              '5.終了')
        choice = int(input('選択：'))

        if choice == 1:
            if devices:
                print('登録している端末は以下の通りです')
                for device in devices:
                    print('\n端末番号{}'.format(device[0]))
                    print('〒{} 場所:{}'.format(device[1], device[2]))
            else:
                print('登録している端末はありません')

        elif choice == 2:
            device_num = int(input('追加する端末の端末番号を入力してください:'))
            post = input('郵便番号を入力してください. （入力形式：123-4567）:〒')
            place = input('登録場所の名前を入力してください:')
            insert_data(db, table, device_num, post, place)
            print('端末を登録しました')

        elif choice == 3:
            if devices:
                print('登録している端末は以下の通りです')
                for device in devices:
                    print('\n端末番号{}'.format(device[0]))
                    print('〒{} 場所:{}'.format(device[1], device[2]))
            else:
                print('登録している端末はありません')
                continue
            device_num = int(input('\n更新する端末の端末番号を入力してください:'))
            post = input('郵便番号を入力してください. （入力形式：123-4567）:〒')
            place = input('登録場所の名前を入力してください:')
            update_data(db, table, device_num, post, place)
            print('端末情報を更新しました')

        elif choice == 4:
            if devices:
                print('登録している端末は以下の通りです')
                for device in devices:
                    print('\n端末番号{}'.format(device[0]))
                    print('〒{} 場所:{}'.format(device[1], device[2]))
            else:
                print('登録している端末はありません')
                continue
            print('削除する端末の端末番号を入力してください')
            device_num = int(input('番号：'))
            delete_data(db, table, device_num)
            print('データを削除しました')

        else:
            print('設定を終了します')
            break
