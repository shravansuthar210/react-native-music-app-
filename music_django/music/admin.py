from django.contrib import admin
from . import models
# Register your models here.
admin.site.register(models.song)
admin.site.register(models.artist)
admin.site.register(models.user_like)