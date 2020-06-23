#!/bin/bash

gunicorn -b 0.0.0.0:7000 -t 10 -w $NUM_WORKERS otlplus.wsgi:application
