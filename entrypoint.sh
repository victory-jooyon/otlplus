#!/bin/bash

NUM_CPU=$(cat /proc/cpuinfo | grep processor | wc -l)

gunicorn -b 0.0.0.0:7000 -w $NUM_CPU otlplus.wsgi:application
