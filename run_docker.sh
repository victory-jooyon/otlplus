#!/bin/bash

## This file is for use outside of container.

NUM_CPU=$(nproc --all)
NUM_WORKERS=$(expr $NUM_CPU \* 2 + 1)

cd /home/ubuntu && mkdir -p logs

# Prepare google_client_secrets.json
# Prepare settings_rdbms.py

docker pull shavakan/cs453-otlplus:latest

docker run -d -p 7000:7000 --cpus $NUM_CPU -v /home/ubuntu/logs:/otlplus/www/logs \
    -v /home/ubuntu/secrets/google_client_secrets.json:/otlplus/www/keys/google_client_secrets.json \
    -v /home/ubuntu/secrets/settings_rdbms.py:/otlplus/www/otlplus/settings_rdbms.py \
    -e NUM_WORKERS=$NUM_WORKERS \
    -e SECRET_KEY= \
    -e SSO_CLIENT_ID= \
    -e SSO_SECRET_KEY= \
    --name otlplus \
    shavakan/cs453-otlplus:latest
