# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2018-12-18 08:13
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('review', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='is_deleted',
            field=models.IntegerField(default=0),
        ),
    ]