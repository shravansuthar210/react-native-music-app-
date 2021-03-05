from django.shortcuts import render
from django.http import HttpResponse

from rest_framework.decorators import api_view
from rest_framework.parsers import JSONParser 
from django.http.response import JsonResponse
import datetime
from datetime import date

import json

from . import models


# Create your views here.
def hello(request):
    return HttpResponse("Hello world")
    

@api_view(['POST'])
def login(request):
    def default(o):
        if isinstance(o, (datetime.date, datetime.datetime)):
            return o.isoformat()
    login_data=JSONParser().parse(request)
    print("login_data",login_data)
    if models.auth.objects.filter(email=login_data['email'],password=login_data['password']).values():
        database_value=models.auth.objects.filter(email=login_data['email'],password=login_data['password']).values()[0]
        print("database_value",database_value)
        
        if database_value['email_verfy']==True:
            print("json.dumps(database_value)")
            return HttpResponse(json.dumps(database_value,default=default))
        else:
            print("email",database_value)
           # json.dumps(response_data)
            return HttpResponse(json.dumps(database_value,default=default))
    else:
        print("else")
        body={
            "email":"wrong",
            "password":"wrong"
        }
        return HttpResponse(json.dumps(body,default=default))

@api_view(['POST'])
def register(request):
    register_data=JSONParser().parse(request)
    print("register",register_data)
    def default(o):
        if isinstance(o, (datetime.date, datetime.datetime)):
            return o.isoformat()
    if models.auth.objects.filter(email=register_data['email']).values():
        body={
            "email":"email already taken"
        }
        print("body",body)
        return HttpResponse(json.dumps(body,default=default))
        
    else:
        def sequence_id():
            datetime1=datetime.datetime.now()
            return str(datetime1.second)+str(datetime1.hour)+str(datetime1.year)[2:]+str(datetime1.month)+str(datetime1.day)+str(datetime1.minute)
        sequence_id=sequence_id()
        music_auth_1=models.auth(u_id=int(sequence_id),email=register_data['email'],email_verfy=True,full_name=register_data['full_name'],password=register_data['password'],premium=False,premium_date=date.today())
        music_auth_1.save()
        song=models.user_like(u_id=int(sequence_id),search=[],song_like=[],playlist_like=[],artist_like=[],albums_like=[],history=[])
        song.save()
        print("music_auth_1",music_auth_1)
        body={
            "u_id":int(sequence_id),
            "email":register_data['email'],
            "email_verfy":True,
            "full_name":register_data['full_name'],
            "premium":False
        } 
        return HttpResponse(json.dumps(body,default=default))
        
@api_view(['POST'])
def search(request):
    def default(o):
        if isinstance(o, (datetime.date, datetime.datetime)):
            return o.isoformat()
    def query_to_list(list,t):
        l=[]
        k="http://192.168.43.5:8000/media/"
        if t=="artist":
            for i in list:
                i.update({'artist_img':k+i['artist_img']})
                l.append(i)
            return l
            
        else:
            for i in list:
                i.update({'song_img':k+i['song_img']})
                i.update({'song_file':k+i['song_file']})
                l.append(i)
            return l
    search_data=JSONParser().parse(request)
    u_id_temp=search_data['u_id']
    search_text=search_data['search_text']
    if models.user_like.objects.filter(u_id=u_id_temp).values():
        
        music_song=models.song.objects.filter(song_name=search_text).values("song_id","song_name","artist","song_img","like","listen_total","listen_week","song_file")[:]
       # music_artist=models.song.objects.filter(artist=search_text).values("song_id","song_name","artist","song_img","like","listen_total","listen_week","song_file")[:]
        
        artist=models.artist.objects.filter(artist_name=search_text).values("artist_name","artist_img")[:]
        music_albums=models.song.objects.filter(album=search_text).values("song_id","song_name","artist","song_img","listen_total","listen_week","song_file")[:]
        
        user_like_table=models.user_like.objects.get(u_id=u_id_temp)
        user_like_table.search.append(search_text)
        #print("yh",user_like_table)
        user_like_table.save()
        body={
            "song":query_to_list(music_song,"O"),
            "artist":query_to_list(artist,"artist"),
            "albums":query_to_list(music_albums,"O")
        }
        #print("body",body)
        return HttpResponse(json.dumps(body,default=default))
    else:
        body={
            "u_id":"wrong u_id"
        }
        return HttpResponse(json.dumps(body,default=default))
@api_view(['POST'])
def like(request):
    def default(o):
        if isinstance(o, (datetime.date, datetime.datetime)):
            return o.isoformat()
    like_data=JSONParser().parse(request)
    u_id_temp=like_data['u_id']
    if models.user_like.objects.filter(u_id=u_id_temp).values():
        if like_data['type']=="song":            
            song_id=like_data['song_id']
            user_like_temp=models.user_like.objects.get(u_id=u_id_temp)
            qw = False
            for i in user_like_temp.song_like:
                if i == song_id:
                    qw = True
                    print("song liked")
            if qw == False:
                like_incre=models.song.objects.get(song_id=song_id)
                like_incre.like=like_incre.like+1
                like_incre.save()
                
                user_like_temp.song_like.append(song_id)
                user_like_temp.save()
                print("song")
                body={
                    "song_id":song_id,
                    "like":like_incre.like,
                    "is_like":True
                }
            else:
                body={
                    "song_id":song_id,
                    "like":models.song.objects.get(song_id=song_id).like,
                    "is_like":False
                }
            return HttpResponse(json.dumps(body,default=default))
        elif like_data['type']=="artist":
            artist_name=like_data['artist']
            user_like_temp=models.user_like.objects.get(u_id=u_id_temp)
            qw =False
            for i in user_like_temp.artist_like:
                if i == artist_name:
                    qw = True
                    print("artist liked")
            if qw == False:
                like_incre=models.artist.objects.get(artist_name=artist_name)
                like_incre.like=like_incre.like+1
                like_incre.save()
                user_like_temp.artist_like.append(artist_name)
                user_like_temp.save()
                print("artist")
                body={
                    "artist_name":artist_name,
                    "like":like_incre.like,
                    "is_like":True
                }
            else:
                body={
                    "artist_name":artist_name,
                    "like":models.artist.objects.get(artist_name=artist_name).like,
                    "is_like":False
                }
            return HttpResponse(json.dumps(body,default=default))
    else:
        body={
            "u_id":"wrong u_id"
        }
        return HttpResponse(json.dumps(body,default=default))
        
@api_view(['POST'])
def dislke(request):
    def default(o):
        if isinstance(o, (datetime.date, datetime.datetime)):
            return o.isoformat()
    dislike_data=JSONParser().parse(request)
    u_id_temp=dislike_data['u_id']
    print("u_id_temp",dislike_data)
    
    
    if models.user_like.objects.filter(u_id=u_id_temp).values():
        if dislike_data['type']=="song":            
            song_id=dislike_data['song_id']
            user_like_temp=models.user_like.objects.get(u_id=u_id_temp)
            qw =False
            print("user_like_temp.song_like",user_like_temp.song_like)
            for i in user_like_temp.song_like:
                if i == song_id:
                    qw = True
                    print("artist liked")
            if qw == True:
                like_incre=models.song.objects.get(song_id=song_id)
                like_incre.like=like_incre.like-1
                like_incre.save()
                
                
                user_like_temp.song_like.remove(song_id)
                user_like_temp.save()
                print("song")
                body={
                    "song_id":song_id,
                    "like":like_incre.like,
                    "is_like":False
                }
            else:
                body={
                    "song_id":song_id,
                    "like":models.song.objects.get(song_id=song_id).like,
                    "is_like":True
                }
            print("body",body)
            return HttpResponse(json.dumps(body,default=default))
        elif dislike_data['type']=="artist":
            user_like_temp=models.user_like.objects.get(u_id=u_id_temp)
            artist_name=dislike_data['artist']
            qw =False
            for i in user_like_temp.artist_like:
                if i == artist_name:
                    qw = True
                    print("artist liked")
            if qw == True:
                like_incre=models.artist.objects.get(artist_name=artist_name)
                like_incre.like=like_incre.like-1
                like_incre.save()
                
                user_like_temp.artist_like.remove(artist_name)
                user_like_temp.save()
                print("artist")
                body={
                    "artist_name":artist_name,
                    "like":like_incre.like,
                    "is_like":False
                }
            else:
                body={
                    "artist_name":artist_name,
                    "like":models.artist.objects.get(artist_name=artist_name).like,
                    "is_like":True
                }
            return HttpResponse(json.dumps(body,default=default))
    else:
        body={
            "u_id":"wrong u_id"
        }
        return HttpResponse(json.dumps(body,default=default))
        
@api_view(['POST'])
def islke(request):
    def default(o):
        if isinstance(o, (datetime.date, datetime.datetime)):
            return o.isoformat()
    islike_data=JSONParser().parse(request)
    print("islike_data",islike_data)
    u_id_temp=islike_data['u_id']
    if models.user_like.objects.filter(u_id=u_id_temp).values():
        if islike_data['type']=="song":            
            song_id=islike_data['song_id']
            user_like_temp=models.user_like.objects.get(u_id=u_id_temp)
            qw = False
            for i in user_like_temp.song_like:
                if i == song_id:
                    qw = True
                    print("song liked")
            print("song")
            body={
                "song_id":song_id,
                "is_like":qw,
                "like":models.song.objects.get(song_id=song_id).like
            }
            print("body",body)
            return HttpResponse(json.dumps(body,default=default))
        elif islike_data['type']=="artist":
            artist_name=islike_data['artist']
            user_like_temp=models.user_like.objects.get(u_id=u_id_temp)
            qw =False
            for i in user_like_temp.artist_like:
                if i == artist_name:
                    qw = True
                    print("artist liked")
                            
            print("artist")
            body={
                "artist":artist_name,
                "is_like":qw,
                "like":models.artist.objects.get(artist_name=artist_name).like
            }
            print("body",body)
            return HttpResponse(json.dumps(body,default=default))
    else:
        body={
            "u_id":"wrong u_id"
        }
        print("body",body)
        return HttpResponse(json.dumps(body,default=default))
@api_view(['POST'])
def desboard(request):
    k="http://192.168.43.5:8000/media/"
    def default(o):
        if isinstance(o, (datetime.date, datetime.datetime)):
            return o.isoformat()
    def history_define(history_list):
        print(history_list)
        history=[]
        for i in history_list:
            print("i",type(i))
            w=eval(i)
            print("w",type(w),w)
            if w['type']=='artist':
                artist=w['artist']
                artist_data=models.artist.objects.filter(artist_name=artist).values("artist_name","artist_img","like")[0]
                artist_data.update({"artist_img":k+artist_data["artist_img"]})
                artist_data.update({'date':w['date']})
                print("artist_data",artist_data,type(artist_data))
                history.append(artist_data)
            elif w['type']=='song':
                song_id=w['song_id']
                music_song=models.song.objects.filter(song_id=song_id).values("song_id","song_name","artist","song_img","like","listen_total","listen_week","song_file")[0]
                music_song.update({'song_img':k+music_song['song_img']})
                music_song.update({'song_file':k+music_song['song_file']})
                music_song.update({'date':w['date']})
                history.append(music_song)
        return history
    def song_def_list(song_list):
        song_list_temp=[]
        for i in song_list:
            music_song=models.song.objects.filter(song_id=i).values("song_id","song_name","artist","song_img","like","listen_total","listen_week","song_file")[:]
            for j in music_song:
                j.update({'song_img':k+j['song_img']})
                j.update({'song_file':k+j['song_file']})
                song_list_temp.append(j)
        return song_list_temp
    def artist_def_list(artist_list):
        print("artist",artist_list)
        artist_list_temp=[]
        for i in artist_list:
            print("i",i)
            artist=models.artist.objects.filter(artist_name=i).values("artist_name","artist_img","like")[:]
            for j in artist:
                j.update({"artist_img":k+j["artist_img"]})
                artist_list_temp.append(j)
            print(artist)
        return artist_list_temp
        
    def query_to_list(list,user_like):
        l=[]
        if user_like=="like":
            for i in list:
                #k=i['song_like']
                i.update({'history':history_define(i['history'])})
                i.update({'song_like':song_def_list(i['song_like'])})
                i.update({'artist_like':artist_def_list(i['artist_like'])})
                l.append(i)
            return l
        elif user_like=="artist":
            for i in list:
                i.update({'artist_img':k+i['artist_img']})
                l.append(i)
            return l
        else:
            for i in list:
                i.update({'song_img':k+i['song_img']})
                i.update({'song_file':k+i['song_file']})
                l.append(i)
            return l
    desboard_data=JSONParser().parse(request)
    u_id_temp=desboard_data['u_id']
    if models.user_like.objects.filter(u_id=u_id_temp).values():
    
        music_song=models.song.objects.filter().values("song_id","song_name","artist","song_img","like","listen_total","listen_week","song_file")[:]
        
        music_albums=models.song.objects.filter().values("song_id","song_name","artist","album","song_img","like","listen_total","listen_week","song_file")[:]
        
        artist=models.artist.objects.filter().values("artist_name","artist_img","like")[:]
        
        user_like_temp=models.user_like.objects.filter(u_id=u_id_temp).values("search","song_like","playlist_like","artist_like","albums_like","history")[:]
        body={
            "song":query_to_list(music_song,"song"),
            "artist":query_to_list(artist,"artist"),
            "albums":query_to_list(music_albums,"song"),
            "user_like":query_to_list(user_like_temp,"like")
        }
        return HttpResponse(json.dumps(body,default=default))
    else:
        body={
            "u_id":"invalid"
        }
        return HttpResponse(json.dumps(body,default=default))
@api_view(['POST'])
def get_list(request):
    k="http://192.168.43.5:8000/media/"
    def default(o):
        if isinstance(o, (datetime.date, datetime.datetime)):
            return o.isoformat()
    def query_to_list(list,qw):
        l=[]        
        for i in list:
            i.update({'song_img':k+i['song_img']})
            i.update({'song_file':k+i['song_file']})
            i.update({'me_like':is_me_like(i['song_id'],qw)})
            l.append(i)
        return l
    def is_me_like(song_id,like_list):
        #global like_list
        me_like=False
        for i in like_list:
            if i== str(song_id):
                print("trru")
                me_like=True
                break
                #like_list.remove(song_id)
        return me_like
                
    get_list_data=JSONParser().parse(request)
    print("get_list_data",get_list_data)
    u_id_temp=get_list_data['u_id']
    if models.user_like.objects.filter(u_id=u_id_temp).values():
        list_type=get_list_data['type']
        if list_type=="artist":
            artist_name=get_list_data['artist']
            print("artist_name",artist_name)
            music_list=models.song.objects.filter(artist=artist_name).values("song_id","song_name","artist","album","song_img","like","listen_total","listen_week","song_file")[:]
            print("music_list",music_list)
            #artist_detail=models.artist.objects.filter().values("artist_name","artist_img","like")[0]
            user_like_temp=models.user_like.objects.filter(u_id=u_id_temp).values("song_like")[0]
            print("music",user_like_temp['song_like'])
            
            body={
               # "artist_name":artist_detail["artist_name"],
                #"artist_img":k+artist_detail["artist_img"],
                #"like":artist_detail["like"],
                "song":query_to_list(music_list,user_like_temp['song_like'])
            }
            print("body",body)
            return HttpResponse(json.dumps(body,default=default))
        
    else:
        body={
            "u_id":"invalid"
        }
        return HttpResponse(json.dumps(body,default=default))
@api_view(['POST'])
def setHistory(request):
    def default(o):
        if isinstance(o, (datetime.date, datetime.datetime)):
            return o.isoformat()
    history_data=JSONParser().parse(request)
    u_id_temp=history_data['u_id']
    
    print('history',history_data)
    if models.user_like.objects.filter(u_id=u_id_temp).values():  
        user_like_table=models.user_like.objects.get(u_id=u_id_temp)
        if history_data['type']=='song':
            song_id=history_data['song_id']
            print("song_id",song_id)
            body={
                'type':'song',
                'song_id':song_id,
                'date':datetime.datetime.now()
            }
            try:
                i=eval(user_like_table.history[len(user_like_table.history)-1])
                if i['song_id']!=body['song_id']:    
                    user_like_table.history.append(body)
                    user_like_table.save()
                else:
                    print("not save")
            except:
                print("except save")
                user_like_table.history.append(body)
                user_like_table.save()
        elif history_data['type']=='artist':
            artist=history_data['artist']
            body={
                'type':'artist',
                'artist':artist,
                'date':datetime.datetime.now()
            }
            try:
                i=eval(user_like_table.history[len(user_like_table.history)-1])
                if i['artist']!=body['artist']:    
                    user_like_table.history.append(body)
                    user_like_table.save()
                else:
                    print("not save")
            except:
                print("except save")
                user_like_table.history.append(body)
                user_like_table.save()
        return HttpResponse(json.dumps(body,default=default))
        
    else:
        body={
            "u_id":"invalid"
        }
        return HttpResponse(json.dumps(body,default=default))
    
    
    