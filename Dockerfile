FROM python:2.7.15

RUN apt-get update && apt-get install -y --no-install-recommends \
    unixodbc-dev \
    unixodbc \
    libpq-dev
RUN pip install --upgrade pip awscli gunicorn

ADD ./requirements.txt /otlplus/www/requirements.txt
WORKDIR /otlplus/www
RUN pip install -r requirements.txt
ADD ./ /otlplus/www

EXPOSE 7000

CMD ["/otlplus/www/entrypoint.sh"]
