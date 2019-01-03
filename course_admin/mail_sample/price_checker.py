#! Python 3.7.1
# 2018/12/22
# 開発担当者　川本孝太朗
# amazonの価格を定期的にチェックして下がっていたら通知をくれる

import sqlite3
from contextlib import closing
import bs4
import requests
import re
import smtplib
from email.mime.text import MIMEText
from email.utils import formatdate


# 価格の取得

def get_price(page_url):
    res = requests.get(page_url)
    soup = bs4.BeautifulSoup(res.text, features="lxml")
    selected_html = soup.select('.a-span12 span.a-color-price')

    if not selected_html:
        selected_html = soup.select('.a-color-base span.a-color-price')

    pattern = '\d*,?\d*,?\d*\d'
    regex = re.compile(pattern)
    matches = re.findall(regex, selected_html[0].text)
    price = matches[0].replace(',', '')
    return int(price)

# タイトルゲット


def get_title(page_url):
    res = requests.get(page_url)
    soup = bs4.BeautifulSoup(res.text, features="lxml")
    selected_html = soup.select('#productTitle')
    title = selected_html[0].text
    title = title.replace(' ', '')
    title = title.replace('\n', '')
    return title


# メールの送信


FROM_ADDRESS = 'kotaro111024@gmail.com'
MY_PASSWORD = 'KKocto24'


def create_message(from_addr, to_addr, subject, body):
    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = from_addr
    msg['To'] = to_addr
    msg['Date'] = formatdate()
    return msg


def send(from_addr, to_addr, body_msg):
    smtpobj = smtplib.SMTP('smtp.gmail.com', 587)
    smtpobj.ehlo()
    smtpobj.starttls()
    smtpobj.ehlo()
    smtpobj.login(FROM_ADDRESS, MY_PASSWORD)
    smtpobj.sendmail(from_addr, to_addr, body_msg.as_string())
    smtpobj.close()


# 通知
# ToDo 定期的に実行できるようにする
# DataBase:price_checker table:user  column:(name, title, url, price, mail)

if __name__ == '__main__':
    db = 'price_checker.db'
    temp_msg = '''{}さん！\n{}の値段が昨日より下がって{}円になりました！'''
    mail_subject = '値下げのお知らせ'

    with closing(sqlite3.connect(db)) as conn:
        c = conn.cursor()
        select_sql = 'select * from users'
        for row in c.execute(select_sql):
            url = row[2]
            current_price = get_price(url)
            if current_price < row[3]:
                mail_body = temp_msg.format(row[0], row[1], current_price)
                message = create_message(FROM_ADDRESS, row[4], mail_subject, mail_body)
                send(FROM_ADDRESS, row[4], message)

            if current_price != row[3]:
                update_sql = 'update users set price = ? where url = ?'
                c.execute(update_sql, (current_price, row[2]))
                conn.commit()
        conn.commit()
        conn.close()