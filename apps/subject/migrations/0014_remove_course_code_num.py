# -*- coding: utf-8 -*-
# Generated by Django 1.11.21 on 2020-01-26 06:28
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('subject', '0013_auto_20200123_1702'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='course',
            name='code_num',
        ),
    ]