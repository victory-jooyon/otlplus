# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2018-11-20 13:27
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('session', '0004_auto_20180301_2046'),
        ('subject', '0003_remove_lecture_syllabus'),
    ]

    operations = [
        migrations.CreateModel(
            name='RandomCourseReco',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('reco_date', models.DateField()),
                ('lecture', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='subject.Lecture')),
                ('userprofile', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='random_course_reco', to='session.UserProfile')),
            ],
        ),
    ]