from django.db import models
from django.contrib.postgres.fields import ArrayField
import datetime
import os
import calendar


# Create your models here.

class auth(models.Model):
    u_id=models.BigIntegerField(blank=False)
    email=models.EmailField(blank=False,max_length=30,primary_key=True)
    email_verfy=models.BooleanField(default=False)
    #phone_number=Model.IntegerField(blank=False)
    full_name=models.CharField(blank=False,max_length=20)
    password=models.CharField(blank=False,max_length=20)
    premium=models.BooleanField(default=False)
    premium_date=models.DateField()

class user_like(models.Model):
    u_id=models.BigIntegerField(blank=False,primary_key=True)
    search=ArrayField(models.TextField())
    song_like=ArrayField(models.TextField())
    playlist_like=ArrayField(models.TextField())
    artist_like=ArrayField(models.TextField())
    albums_like=ArrayField(models.TextField())
    history=ArrayField(models.TextField())
    
class artist(models.Model):
    def content_file_name_img(instance, filename):
        return os.path.join('Artist', filename)
    artist_name=models.CharField(blank=False,max_length=20,primary_key=True)
    artist_img=models.ImageField(blank=False,upload_to=content_file_name_img,default=None)
    like=models.IntegerField(default=0)
    
    
class song(models.Model):
    global u
    def u_id():
        datetime1=datetime.datetime.now()
        return str(datetime1.second)+str(datetime1.hour)+str(datetime1.year)[2:]+str(datetime1.month)+str(datetime1.day)+str(datetime1.minute)
    u=u_id()
    def content_file_name_mp3(instance, filename):
        ext = filename.split('.')[-1]
        if ext=="mp3":
            filename = "%s/%s.%s" % (u, u, ext)
            return os.path.join('song', filename)
    def content_file_name_img(instance, filename):
        ext = filename.split('.')[-1]
        filename = "%s/%s.%s" % (u, u, ext)
        return os.path.join('song', filename)
        
    def get_artist_list():
        artist1=artist.objects.filter().values("artist_name")[:]
        qw=[]
        MONTH_CHOICES = [(str(artist1[i]['artist_name']), str(artist1[i]['artist_name'])) for i in range(0,len(artist1))]
        return MONTH_CHOICES
    
    song_id=models.BigIntegerField(primary_key=True,default=u)
    song_file=models.FileField(blank=False,upload_to=content_file_name_mp3,default=None)
    song_name=models.CharField(blank=False,max_length=25,default=None)
    artist=models.CharField(blank=False,max_length=25,choices=get_artist_list())
    album=models.CharField(blank=False,max_length=25)
    song_img=models.ImageField(blank=False,upload_to=content_file_name_img,default=None)
    like=models.IntegerField(default=0)
    listen_total=models.IntegerField(default=0)
    listen_week=models.IntegerField(default=0)
    