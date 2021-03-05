# Generated by Django 3.1.1 on 2020-10-14 10:03

from django.db import migrations, models
import music.models


class Migration(migrations.Migration):

    dependencies = [
        ('music', '0019_auto_20201003_1720'),
    ]

    operations = [
        migrations.CreateModel(
            name='artist',
            fields=[
                ('artist_name', models.CharField(max_length=20, primary_key=True, serialize=False)),
                ('artist_img', models.ImageField(default=None, upload_to=music.models.artist.content_file_name_img)),
                ('like', models.IntegerField(default=0)),
            ],
        ),
        migrations.AlterField(
            model_name='song',
            name='song_id',
            field=models.BigIntegerField(default='01520101433', primary_key=True, serialize=False),
        ),
    ]