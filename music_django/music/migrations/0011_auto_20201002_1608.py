# Generated by Django 3.1.1 on 2020-10-02 10:38

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('music', '0010_auto_20201002_1243'),
    ]

    operations = [
        migrations.AlterField(
            model_name='song',
            name='song_id',
            field=models.BigIntegerField(default='3616201028', primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='user_like',
            name='albums_like',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.TextField(), blank=True, null=True, size=None),
        ),
        migrations.AlterField(
            model_name='user_like',
            name='artist_like',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.TextField(), blank=True, null=True, size=None),
        ),
        migrations.AlterField(
            model_name='user_like',
            name='history',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.TextField(), blank=True, default=None, null=True, size=None),
        ),
        migrations.AlterField(
            model_name='user_like',
            name='playlist_like',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.TextField(), blank=True, null=True, size=None),
        ),
        migrations.AlterField(
            model_name='user_like',
            name='search',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.TextField(), blank=True, default=None, null=True, size=None),
        ),
        migrations.AlterField(
            model_name='user_like',
            name='song_like',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.TextField(), blank=True, null=True, size=None),
        ),
    ]