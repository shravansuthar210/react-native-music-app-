from django.contrib import admin
from django.urls import path,include

from . import views
from django.conf.urls import url



urlpatterns = [
    path('',views.hello),
    url('login',views.login),
    url('register',views.register),
    url('search',views.search),
    url('like',views.like),
    url('desboard',views.desboard),
    url('dislke',views.dislke),
    url('islke',views.islke),
    url('get_list',views.get_list),
    url('history',views.setHistory),
]
