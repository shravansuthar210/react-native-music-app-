# Generated by Django 3.1.1 on 2020-10-14 10:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('music', '0022_auto_20201014_1540'),
    ]

    operations = [
        migrations.AlterField(
            model_name='song',
            name='song_id',
            field=models.BigIntegerField(default='101520101459', primary_key=True, serialize=False),
        ),
    ]