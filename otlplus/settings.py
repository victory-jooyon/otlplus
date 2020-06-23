"""
Django settings for otlplus project.

Generated by 'django-admin startproject' using Django 1.8.2.

For more information on this file, see
https://docs.djangoproject.com/en/1.8/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.8/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOG_FILE = os.path.join(BASE_DIR, 'request_middleware.log')

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.8/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!

# with open(os.path.join(BASE_DIR, 'keys/django_secret')) as f:
#     SECRET_KEY = f.read().strip()
SECRET_KEY = os.environ.get("SECRET_KEY")
SSO_CLIENT_ID = os.environ.get("SSO_CLIENT_ID")
SSO_SECRET_KEY = os.environ.get("SSO_SECRET_KEY")
SSO_IS_BETA = False

with open(os.path.join(BASE_DIR, 'keys/sso_secret')) as f:
    SSO_KEY = f.read().strip()

GOOGLE_OAUTH2_CLIENT_SECRETS_JSON = os.path.join(BASE_DIR, 'keys/google_client_secrets.json')


# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']


# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'apps.main',
    'apps.session',
    'apps.review',
    'apps.subject',
    'apps.timetable',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.common.CommonMiddleware',
    # 'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'utils.middleware.RequestMiddleware',
)

ROOT_URLCONF = 'otlplus.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'APP_DIRS': True,
        'DIRS': [
            os.path.join(BASE_DIR, 'templates'),
        ],
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


WSGI_APPLICATION = 'otlplus.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.8/ref/settings/#databases

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
#     }
# }


# Internationalization
# https://docs.djangoproject.com/en/1.8/topics/i18n/

LANGUAGE_CODE = 'ko-KR'

ugettext = lambda s: s
LANGUAGES = (
    ('ko', ugettext('Korean')),
    ('en', ugettext('English')),
)

LOCALE_PATHS = (
    os.path.join(BASE_DIR, 'locale'),
)

TIME_ZONE = 'Asia/Seoul'

USE_I18N = True

USE_L10N = True

USE_TZ = True

#  Semester INFO
from datetime import date
CURRENT_YEAR = 2019
CURRENT_SEMESTER = 1
SEMESTER_RANGES = {
    (2009, 1): (date(2009, 2, 2), date(2009, 5, 22)),
    (2009, 3): (date(2009, 9, 1), date(2009, 12, 21)),
    (2010, 1): (date(2010, 2, 1), date(2010, 5, 21)),
    (2010, 3): (date(2010, 9, 1), date(2010, 12, 21)),
    (2011, 1): (date(2011, 2, 7), date(2011, 5, 27)),
    (2011, 3): (date(2011, 9, 1), date(2011, 12, 21)),
    (2012, 1): (date(2012, 2, 6), date(2012, 5, 25)),
    (2012, 3): (date(2012, 9, 1), date(2012, 12, 21)),
    (2013, 1): (date(2013, 3, 2), date(2013, 6, 21)),
    (2013, 3): (date(2013, 9, 2), date(2013, 12, 20)),
    (2014, 1): (date(2014, 3, 3), date(2014, 6, 20)),
    (2014, 3): (date(2014, 9, 1), date(2014, 12, 19)),
    (2015, 1): (date(2015, 3, 2), date(2015, 6, 19)),
    (2015, 3): (date(2015, 8, 31), date(2015, 12, 18)),
    (2016, 1): (date(2016, 3, 2), date(2016, 6, 21)),
    (2016, 3): (date(2016, 9, 1), date(2016, 12, 21)),
    (2017, 1): (date(2017, 2, 27), date(2017, 6, 16)),
    (2017, 3): (date(2017, 8, 28), date(2017, 12, 15)),
    (2018, 1): (date(2018, 2, 26), date(2018, 6, 18)),
    (2018, 3): (date(2018, 8, 27), date(2018, 12, 14)),
    (2019, 1): (date(2019, 2, 25), date(2019, 6, 14)),
}


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.8/howto/static-files/

STATIC_URL = '/media/'
STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'static'),
)


AUTHENTICATION_BACKENDS = (
    'apps.session.auth_backend.PasswordlessModelBackend',
    'django.contrib.auth.backends.ModelBackend',
)
LOGIN_URL = '/session/login/'
LOGOUT_URL = '/session/logout/'



try:
    from settings_local import *
except ImportError:
    pass
