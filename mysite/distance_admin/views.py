from distance_admin.models import Check_piont
# Create your views here.
from django.http import HttpResponse
import re
import requests


def request_distance(map_url):
    r = requests.get(map_url)
    pattern = r'\d\d*\.?\d* k?m'
    regex = re.compile(pattern)
    matches = re.findall(regex, r.text)

    if 'k' in matches[0]:
        distance = float(matches[0][0:-3])
        distance *= 1000  # km表示のときにはm表示に変換する
    else:
        distance = float(matches[0][0:-2])
    return distance


def get_distance(idnum1, idnum2):
    point1 = Check_piont.objects.get(divice_num=idnum1)
    point2 = Check_piont.objects.get(divice_num=idnum2)
    temp_url = 'https://www.google.co.jp/maps/dir/{}、〒{}/{}、〒{}/'
    map_url = temp_url.format(point1.place_name, point1.postal_code,
                              point2.place_name, point2.postal_code)
    distance = request_distance(map_url)
    return distance


def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")


def res(request, idnum1, idnum2):
    distance = get_distance(idnum1, idnum2)
    return HttpResponse(distance)