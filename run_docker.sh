#!/bin/bash

cd react && npm install && npm run build

aws s3 cp s3://otlplus/keys keys --recursive
aws s3 cp s3://otlplus/db.sqlite3 db.sqlite3
cat keys/sso >> otlplus/otlplus/settings.py

docker run -d --name otlplus \
    -p 7000:7000 \
    -v /home/ec2-user/keys:/otlplus/www/keys \
    -v /home/ec2-user/db.sqlite3:/otlplus/www/db.sqlite3 \
    -e SSO_CLIENT_ID=testa4fad110c14864c1 \
    -e SSO_SECRET_KEY=edd69b59abd5ab7d2d5c \
    shavakan/cs453-otlplus
