# Generated by Django 3.1.1 on 2020-10-02 07:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('music', '0008_auto_20201002_1233'),
    ]

    operations = [
        migrations.AddField(
            model_name='auth',
            name='premium',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='song',
            name='song_id',
            field=models.BigIntegerField(default='39122010240', primary_key=True, serialize=False),
        ),
    ]
