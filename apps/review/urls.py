"""otlplus URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import url
from django.http import HttpResponseRedirect
from . import views

urlpatterns = [
    url(r'^latest/(?P<page>[0-9]+)$', views.latest),

    url(r'^comment/([1-9][0-9]*)$', views.ReviewView),

    url(r'^professor/([^/]+)$', views.professor),
    url(r'^professor/([^/]+)/([^/]+)/([^/]+)$', views.professorComment),

    url(r'^course/([^/]+)$', views.course),
    url(r'^course/([^/]+)/([^/]+)/([^/]+)$', views.courseComment),

    url(r'^result$', views.resultProfessor),
    url(r'^result/(?P<page>[0-9]+)$', views.resultCourse),

    url(r'^insert/([^/]+)/([^/]+)/$', views.ReviewInsertAdd),

    url(r'^delete/$',views.ReviewDelete),
    url(r'^like/$',views.ReviewLike),
    url(r'^refresh/$',views.ReviewRefresh),
    url(r'^portal/$',views.ReviewPortal),
    url(r'^dictionary/([^/]+)/$', views.dictionary),
]
