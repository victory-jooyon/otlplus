# -*- coding: utf-8 -*-
# Generated by Django 1.11.21 on 2020-01-13 07:09
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('subject', '0011_auto_20200113_1557'),
    ]

    operations = [
        migrations.AlterField(
            model_name='lecture',
            name='professors',
            field=models.ManyToManyField(blank=True, db_index=True, related_name='lecture_professor', to='subject.Professor'),
        ),
        migrations.AlterField(
            model_name='lecture',
            name='type_en',
            field=models.CharField(db_index=True, max_length=36),
        ),
    ]