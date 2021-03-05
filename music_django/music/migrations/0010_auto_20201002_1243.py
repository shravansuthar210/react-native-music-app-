# Generated by Django 3.1.1 on 2020-10-02 07:13

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('music', '0009_auto_20201002_1240'),
    ]

    operations = [
        migrations.AddField(
            model_name='user_like',
            name='history',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.TextField(), default=None, size=None),
        ),
        migrations.AlterField(
            model_name='song',
            name='song_id',
            field=models.BigIntegerField(default='12122010243', primary_key=True, serialize=False),
        ),
    ]