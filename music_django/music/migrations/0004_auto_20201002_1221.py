# Generated by Django 3.1.1 on 2020-10-02 06:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('music', '0003_auto_20201002_1209'),
    ]

    operations = [
        migrations.AlterField(
            model_name='song',
            name='song_id',
            field=models.BigIntegerField(default='20122010221', primary_key=True, serialize=False),
        ),
    ]
