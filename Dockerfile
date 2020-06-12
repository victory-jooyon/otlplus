FROM python:2.7.15

RUN pip install --upgrade pip virtualenv awscli gunicorn
RUN virtualenv -p python2.7 /otlplus/venv
RUN apt-get update && apt-get install -y --no-install-recommends \
    unixodbc-dev \
    unixodbc \
    libpq-dev

# TODO(Jaeyoung): S3 permission & bucketname: otlplus
# 버킷구조
# otlplus
# ㄴ keys
#    ㄴ sso (SSO_CLIENT_ID, SSO_SECRET_KEY, SSO_IS_BETA 관련 정보 넣기)
#    ㄴ django_secret
#    ㄴ sso_secret (코드상 쓰이는 곳 없음)
#    ㄴ google_client_secrets.json
# ㄴ db.sqlite3

ADD ./requirements.txt /otlplus/www/requirements.txt
WORKDIR /otlplus/www
RUN pip install -r requirements.txt
ADD ./ /otlplus/www

RUN aws s3 cp s3://otlplus/keys keys --recursive
RUN aws s3 cp s3://otlplus/db.sqlite3 db.sqlite3
RUN cat keys/sso >> otlplus/settings.py
RUN /otlplus/venv/bin/pip install -r requirements.txt

EXPOSE 7000

ENV PATH "/otlplus/venv/bin:$PATH"
CMD ["gunicorn", "-b", "0.0.0.0:7000", "otlplus.wsgi:application"]
