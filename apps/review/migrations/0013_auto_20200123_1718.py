# -*- coding: utf-8 -*-
# Generated by Django 1.11.21 on 2020-01-23 08:18
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('review', '0012_auto_20200123_1701'),
    ]

    operations = [
        migrations.RenameField(
            model_name='review',
            old_name='comment',
            new_name='content',
        ),
    ]
