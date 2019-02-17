from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('<int:idnum1>/<int:idnum2>', views.res, name='hoge')
]