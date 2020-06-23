#!/bin/bash

gunicorn -b 0.0.0.0:7000 -w $NUM_WORKERS otlplus.wsgi:application
